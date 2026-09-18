"use client";

import {
  ArrowUp,
  Bot,
  Check,
  ChevronDown,
  Code2,
  Copy,
  CircleUserRound,
  Eye,
  ExternalLink,
  FileCode2,
  Globe,
  Loader2,
  LogOut,
  Menu,
  MessageSquare,
  Monitor,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  RefreshCw,
  Settings,
  Smartphone,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

import {
  onIdTokenChanged,
  type User,
} from "firebase/auth";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { auth } from "@/lib/firebase";

/* =========================================================
   TYPES
========================================================= */

type ModelId =
  | "pixzen"
  | "claude-opus-5"
  | "claude-5"
  | "gpt-5-5"
  | "gpt-6-astra";

type ModelInfo = {
  id: ModelId;
  name: string;
  description: string;
  provider: string;
  paidOnly: boolean;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  model?: ModelId;
};

/* =========================================================
   CONSTANTS
========================================================= */

const BUILD_COST = 500;

const MODELS: ModelInfo[] = [
  {
    id: "pixzen",
    name: "PIXZEN",
    description: "PIXZEN's default AI builder",
    provider: "PIXZEN",
    paidOnly: false,
  },
  {
    id: "claude-opus-5",
    name: "Claude Opus 5",
    description: "Advanced coding & reasoning",
    provider: "Anthropic",
    paidOnly: true,
  },
  {
    id: "claude-5",
    name: "Claude 5",
    description: "Advanced AI development model",
    provider: "Anthropic",
    paidOnly: true,
  },
  {
    id: "gpt-5-5",
    name: "GPT-5.5",
    description: "Advanced GPT development model",
    provider: "OpenAI",
    paidOnly: true,
  },
  {
    id: "gpt-6-astra",
    name: "GPT-6 Astra",
    description: "Next-generation AI model",
    provider: "OpenAI",
    paidOnly: true,
  },
];

/* =========================================================
   HELPERS
========================================================= */

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function extractHtml(text: string): string | null {
  if (!text) return null;

  const htmlBlock = text.match(
    /```html\s*([\s\S]*?)```/i
  );

  if (htmlBlock?.[1]) {
    return htmlBlock[1].trim();
  }

  const genericBlock = text.match(
    /```\s*([\s\S]*?)```/
  );

  if (genericBlock?.[1]) {
    const content = genericBlock[1].trim();

    if (
      content.includes("<!DOCTYPE html") ||
      content.includes("<html") ||
      content.includes("<body")
    ) {
      return content;
    }
  }

  const doctypeIndex =
    text.search(/<!doctype html/i);

  if (doctypeIndex !== -1) {
    return text.slice(doctypeIndex).trim();
  }

  const htmlIndex =
    text.search(/<html[\s>]/i);

  if (htmlIndex !== -1) {
    return text.slice(htmlIndex).trim();
  }

  return null;
}

function getModelInfo(
  modelId?: ModelId
): ModelInfo {
  return (
    MODELS.find(
      (model) => model.id === modelId
    ) ?? MODELS[0]
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function BuildPage() {
  /* =======================================================
     AUTH
  ======================================================= */

  const [user, setUser] =
    useState<User | null>(null);

  const [authLoading, setAuthLoading] =
    useState(true);

  /* =======================================================
     CREDITS
  ======================================================= */

  const [credits, setCredits] =
    useState<number | null>(null);

  const [
    creditsLoading,
    setCreditsLoading,
  ] = useState(true);

  /* =======================================================
     CHAT
  ======================================================= */

  const [messages, setMessages] =
    useState<ChatMessage[]>([]);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  /* =======================================================
     MODEL
  ======================================================= */

  const [
    selectedModel,
    setSelectedModel,
  ] = useState<ModelId>("pixzen");

  const [
    modelMenuOpen,
    setModelMenuOpen,
  ] = useState(false);

  const [userPlan, setUserPlan] =
    useState("free");

  /* =======================================================
     PROFILE
  ======================================================= */

  const [
    profileMenuOpen,
    setProfileMenuOpen,
  ] = useState(false);

  /* =======================================================
     PREVIEW
  ======================================================= */

  const [previewHtml, setPreviewHtml] =
    useState("");

  const [
    previewOpen,
    setPreviewOpen,
  ] = useState(false);

  const [
    previewMode,
    setPreviewMode,
  ] = useState<"desktop" | "mobile">(
    "desktop"
  );

  const [copied, setCopied] =
    useState(false);

  /* =======================================================
     SIDEBAR
  ======================================================= */

  const [
    sidebarOpen,
    setSidebarOpen,
  ] = useState(true);

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  /* =======================================================
     REFS
  ======================================================= */

  const inputRef =
    useRef<HTMLTextAreaElement | null>(
      null
    );

  const modelSelectorRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const profileMenuRef =
    useRef<HTMLDivElement | null>(
      null
    );

  /* =======================================================
     MEMO
  ======================================================= */

  const selectedModelInfo =
    useMemo(
      () =>
        getModelInfo(selectedModel),
      [selectedModel]
    );

  const isPaidUser =
    userPlan === "pro" ||
    userPlan === "max" ||
    userPlan === "paid";

  /* =======================================================
     AUTH LISTENER
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    const unsubscribe =
      onIdTokenChanged(
        auth,
        async (currentUser) => {
          if (!mounted) return;

          console.log(
            "[PIXZEN AUTH]",
            currentUser
              ? `Logged in: ${currentUser.email}`
              : "Not logged in"
          );

          setUser(currentUser);
          setAuthLoading(false);

          if (!currentUser) {
            setCredits(null);
            setCreditsLoading(false);
            setUserPlan("free");
            setProfileMenuOpen(false);
            return;
          }

          try {
            setCreditsLoading(true);

            /* ---------------------------------------------
               GET FRESH TOKEN + PLAN
            --------------------------------------------- */

            const tokenResult =
              await currentUser.getIdTokenResult(
                true
              );

            const plan =
              typeof tokenResult.claims
                .plan === "string"
                ? tokenResult.claims.plan
                : "free";

            if (mounted) {
              setUserPlan(plan);
            }

            /* ---------------------------------------------
               GET USER CREDITS
            --------------------------------------------- */

            const token =
              await currentUser.getIdToken();

            const response =
              await fetch(
                "/api/user/me",
                {
                  method: "GET",
                  headers: {
                    Authorization:
                      `Bearer ${token}`,
                  },
                  cache: "no-store",
                }
              );

            const data =
              await response.json();

            if (
              mounted &&
              response.ok &&
              data?.ok
            ) {
              setCredits(
                Number(
                  data.credits ?? 0
                )
              );
            } else if (mounted) {
              setCredits(null);
            }
          } catch (error) {
            console.error(
              "[PIXZEN AUTH] Failed to load user:",
              error
            );

            if (mounted) {
              setCredits(null);
            }
          } finally {
            if (mounted) {
              setCreditsLoading(false);
            }
          }
        }
      );

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  /* =======================================================
     MODEL OUTSIDE CLICK
  ======================================================= */

  useEffect(() => {
    if (!modelMenuOpen) return;

    const handleClick = (
      event: MouseEvent
    ) => {
      if (
        modelSelectorRef.current &&
        !modelSelectorRef.current.contains(
          event.target as Node
        )
      ) {
        setModelMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClick
      );
    };
  }, [modelMenuOpen]);

  /* =======================================================
     PROFILE OUTSIDE CLICK
  ======================================================= */

  useEffect(() => {
    if (!profileMenuOpen) return;

    const handleClick = (
      event: MouseEvent
    ) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(
          event.target as Node
        )
      ) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClick
      );
    };
  }, [profileMenuOpen]);

  /* =======================================================
     ESC
  ======================================================= */

  useEffect(() => {
    const handleEscape = (
      event: KeyboardEvent
    ) => {
      if (event.key !== "Escape") return;

      setModelMenuOpen(false);
      setProfileMenuOpen(false);
      setMobileMenuOpen(false);
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  /* =======================================================
     SCROLL
  ======================================================= */

  const scrollChatToBottom =
    () => {
      setTimeout(() => {
        const element =
          document.getElementById(
            "chat-scroll"
          );

        if (element) {
          element.scrollTo({
            top: element.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 50);
    };

  /* =======================================================
     SELECT MODEL
  ======================================================= */

  const selectModel = (
    model: ModelInfo
  ) => {
    if (
      model.paidOnly &&
      !isPaidUser
    ) {
      return;
    }

    setSelectedModel(model.id);
    setModelMenuOpen(false);
  };

  /* =======================================================
     NEW PROJECT
  ======================================================= */

  const newProject = () => {
    setMessages([]);
    setInput("");
    setPreviewHtml("");
    setPreviewOpen(false);
    setSelectedModel("pixzen");
    setModelMenuOpen(false);
    setProfileMenuOpen(false);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = async () => {
    try {
      await auth.signOut();

      setProfileMenuOpen(false);
      setCredits(null);
      setMessages([]);
      setPreviewHtml("");
      setPreviewOpen(false);
      setSelectedModel("pixzen");
      setUserPlan("free");
      setUser(null);
    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );
    }
  };

  /* =======================================================
     COPY HTML
  ======================================================= */

  const copyPreview = async () => {
    if (!previewHtml) return;

    try {
      await navigator.clipboard.writeText(
        previewHtml
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error(
        "Copy failed:",
        error
      );
    }
  };

  /* =======================================================
     SEND / BUILD
  ======================================================= */

  const sendMessage = async () => {
    const text = input.trim();

    if (!text || loading) {
      return;
    }

    /* -----------------------------------------------
       LOGIN CHECK
    ------------------------------------------------ */

    if (!user) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Please log in first to start building with PIXZEN.",
          model: "pixzen",
        },
      ]);

      return;
    }

    /* -----------------------------------------------
       CREDIT CHECK
    ------------------------------------------------ */

    if (
      credits !== null &&
      credits < BUILD_COST
    ) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "You don't have enough credits for this build. Please upgrade your plan to continue.",
          model: selectedModel,
        },
      ]);

      return;
    }

    /* -----------------------------------------------
       USER MESSAGE
    ------------------------------------------------ */

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setInput("");
    setLoading(true);

    scrollChatToBottom();

    try {
      /* ---------------------------------------------
         TOKEN
      --------------------------------------------- */

      const token =
        await user.getIdToken();

      /* ---------------------------------------------
         API REQUEST
      --------------------------------------------- */

      const response =
        await fetch("/api/ai", {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify({
            prompt: text,
            model: selectedModel,
          }),
        });

      const rawText =
        await response.text();

      const data =
        safeJsonParse(rawText);

      /* ---------------------------------------------
         ERROR
      --------------------------------------------- */

      if (!response.ok) {
        /* CREDIT ERROR */

        if (
          response.status === 402 ||
          data?.code ===
            "INSUFFICIENT_CREDITS"
        ) {
          if (
            typeof data?.credits ===
            "number"
          ) {
            setCredits(
              data.credits
            );
          }

          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              content:
                data?.error ??
                "Not enough credits. Please upgrade your plan.",
              model: selectedModel,
            },
          ]);

          return;
        }

        /* PAID MODEL ERROR */

        if (
          response.status === 403 ||
          data?.code ===
            "PAID_MODEL_REQUIRED"
        ) {
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              content:
                "This model is available on paid plans. Upgrade your plan to unlock it.",
              model: selectedModel,
            },
          ]);

          return;
        }

        throw new Error(
          data?.error ||
            data?.message ||
            `Request failed with status ${response.status}`
        );
      }

      if (!data) {
        throw new Error(
          "Invalid server response."
        );
      }

      /* ---------------------------------------------
         CREDITS
      --------------------------------------------- */

      if (
        typeof data.credits ===
        "number"
      ) {
        setCredits(
          data.credits
        );
      }

      /* ---------------------------------------------
         OUTPUT
      --------------------------------------------- */

      const assistantText =
        typeof data.output ===
        "string"
          ? data.output
          : typeof data.text ===
              "string"
            ? data.text
            : typeof data.response ===
                "string"
              ? data.response
              : typeof data.message ===
                  "string"
                ? data.message
                : "The AI returned an empty response.";

      const assistantModel =
        typeof data.model ===
        "string"
          ? data.model
          : selectedModel;

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: assistantText,
          model:
            assistantModel as ModelId,
        },
      ]);

      /* ---------------------------------------------
         HTML
      --------------------------------------------- */

      const html =
        extractHtml(
          assistantText
        );

      if (html) {
        setPreviewHtml(html);
        setPreviewOpen(true);
      }

      scrollChatToBottom();
    } catch (error) {
      console.error(
        "Build error:",
        error
      );

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong.";

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            `Sorry, something went wrong: ${errorMessage}`,
          model: selectedModel,
        },
      ]);
    } finally {
      setLoading(false);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  /* =======================================================
     ENTER
  ======================================================= */

  const handleInputKeyDown =
    (
      event: React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
      if (
        event.key === "Enter" &&
        !event.shiftKey
      ) {
        event.preventDefault();
        sendMessage();
      }
    };

  /* =======================================================
     SUGGESTIONS
  ======================================================= */

  const suggestions = [
    "Build a modern SaaS landing page",
    "Create a premium portfolio website",
    "Build an AI dashboard",
    "Create an e-commerce website",
  ];

  /* =======================================================
     AUTH LOADING
  ======================================================= */

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07080c] text-white">
        <div className="flex items-center gap-3 text-sm text-white/50">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading PIXZEN...
        </div>
      </main>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <main className="h-screen overflow-hidden bg-[#07080c] text-white">
      <div className="flex h-full">

        {/* =================================================
            DESKTOP SIDEBAR
        ================================================= */}

        <aside
          className={`hidden shrink-0 border-r border-white/[0.07] bg-[#0a0b10] transition-all duration-300 lg:flex lg:flex-col ${
            sidebarOpen
              ? "w-[250px]"
              : "w-[72px]"
          }`}
        >

          {/* LOGO */}

          <div className="flex h-[64px] items-center border-b border-white/[0.07] px-4">
            <a
              href="/"
              className={`flex items-center gap-2 ${
                sidebarOpen
                  ? ""
                  : "mx-auto"
              }`}
            >
              <img
                src="/pixzen-icon.png"
                alt="PIXZEN"
                className="h-8 w-8 rounded-lg object-cover"
              />

              {sidebarOpen && (
                <span className="text-[16px] font-semibold tracking-tight">
                  PIXZEN
                </span>
              )}
            </a>
          </div>

          {/* SIDEBAR BODY */}

          <div className="flex-1 overflow-y-auto p-3">

            <button
              type="button"
              onClick={newProject}
              className={`mb-4 flex w-full items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-left text-xs font-medium text-white/80 transition hover:bg-white/[0.07] ${
                !sidebarOpen
                  ? "justify-center px-0"
                  : ""
              }`}
            >
              <Plus className="h-4 w-4 shrink-0" />

              {sidebarOpen &&
                "New project"}
            </button>

            {sidebarOpen && (
              <>
                <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/25">
                  Workspace
                </div>

                <nav className="space-y-1">

                  <a
                    href="#"
                    className="flex items-center gap-3 rounded-lg bg-white/[0.06] px-3 py-2.5 text-xs text-white"
                  >
                    <MessageSquare className="h-4 w-4 text-cyan-300" />
                    Build
                  </a>

                  <a
                    href="/"
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-white/45 transition hover:bg-white/[0.04] hover:text-white"
                  >
                    <Globe className="h-4 w-4" />
                    Home
                  </a>

                  {user && (
                    <>
                      <a
                        href="/profile"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-white/45 transition hover:bg-white/[0.04] hover:text-white"
                      >
                        <CircleUserRound className="h-4 w-4" />
                        Profile
                      </a>

                      <a
                        href="/settings"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-white/45 transition hover:bg-white/[0.04] hover:text-white"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </a>
                    </>
                  )}

                </nav>

                <div className="mb-2 mt-7 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/25">
                  Recent
                </div>

                {messages.length > 0 ? (
                  <div className="truncate rounded-lg px-3 py-2 text-xs text-white/35">
                    Current project
                  </div>
                ) : (
                  <div className="px-3 text-xs leading-5 text-white/25">
                    Your projects will appear here.
                  </div>
                )}
              </>
            )}

          </div>

          {/* SIDEBAR FOOTER */}

          <div className="border-t border-white/[0.07] p-3">

            {sidebarOpen ? (
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/40">
                    Credits
                  </span>

                  <Zap className="h-3.5 w-3.5 text-cyan-300" />
                </div>

                <div className="mt-2 text-lg font-semibold">
                  {creditsLoading
                    ? "..."
                    : credits ?? 0}
                </div>

                <div className="mt-1 text-[9px] text-white/25">
                  {BUILD_COST} credits per build
                </div>

              </div>
            ) : (
              <div className="flex justify-center">
                <Zap className="h-4 w-4 text-cyan-300" />
              </div>
            )}

            <button
              type="button"
              onClick={() =>
                setSidebarOpen(
                  (value) => !value
                )
              }
              className={`mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-white/40 transition hover:bg-white/[0.04] hover:text-white ${
                !sidebarOpen
                  ? "justify-center px-0"
                  : ""
              }`}
            >
              {sidebarOpen ? (
                <>
                  <PanelLeftClose className="h-4 w-4" />
                  Collapse
                </>
              ) : (
                <PanelLeftOpen className="h-4 w-4" />
              )}
            </button>

          </div>

        </aside>

        {/* =================================================
            MOBILE DRAWER
        ================================================= */}

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">

            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() =>
                setMobileMenuOpen(false)
              }
            />

            <aside className="relative flex h-full w-[280px] flex-col border-r border-white/[0.08] bg-[#0a0b10]">

              <div className="flex h-[64px] items-center justify-between border-b border-white/[0.07] px-4">

                <a
                  href="/"
                  className="flex items-center gap-2"
                >
                  <img
                    src="/pixzen-icon.png"
                    alt="PIXZEN"
                    className="h-8 w-8 rounded-lg object-cover"
                  />

                  <span className="font-semibold">
                    PIXZEN
                  </span>
                </a>

                <button
                  type="button"
                  onClick={() =>
                    setMobileMenuOpen(
                      false
                    )
                  }
                  className="rounded-lg p-2 text-white/50 hover:bg-white/[0.05] hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>

              </div>

              <div className="flex-1 p-3">

                <button
                  type="button"
                  onClick={() => {
                    newProject();
                    setMobileMenuOpen(
                      false
                    );
                  }}
                  className="flex w-full items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-3 text-left text-xs font-medium"
                >
                  <Plus className="h-4 w-4" />
                  New project
                </button>

                <nav className="mt-5 space-y-1">

                  <a
                    href="#"
                    className="flex items-center gap-3 rounded-lg bg-white/[0.06] px-3 py-3 text-xs"
                  >
                    <MessageSquare className="h-4 w-4 text-cyan-300" />
                    Build
                  </a>

                  <a
                    href="/"
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-xs text-white/45"
                  >
                    <Globe className="h-4 w-4" />
                    Home
                  </a>

                  {user && (
                    <>
                      <a
                        href="/profile"
                        onClick={() =>
                          setMobileMenuOpen(false)
                        }
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-xs text-white/45"
                      >
                        <CircleUserRound className="h-4 w-4" />
                        Profile
                      </a>

                      <a
                        href="/settings"
                        onClick={() =>
                          setMobileMenuOpen(false)
                        }
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-xs text-white/45"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </a>

                      <button
                        type="button"
                        onClick={async () => {
                          setMobileMenuOpen(false);
                          await handleLogout();
                        }}
                        style={{
                          color: "#fca5a5",
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-xs transition hover:bg-red-400/[0.06]"
                      >
                        <LogOut className="h-4 w-4" />
                        <span style={{ color: "#fca5a5" }}>
                          Log out
                        </span>
                      </button>
                    </>
                  )}

                </nav>

              </div>

            </aside>

          </div>
        )}

        {/* =================================================
            MAIN
        ================================================= */}

        <section className="min-w-0 flex-1">

          <div className="flex h-full min-w-0 flex-col">

            {/* =================================================
                TOPBAR
            ================================================= */}

            <header className="flex h-[64px] shrink-0 items-center justify-between border-b border-white/[0.07] bg-[#08090d]/90 px-3 backdrop-blur-xl sm:px-5">

              <div className="flex min-w-0 items-center gap-2">

                <button
                  type="button"
                  onClick={() =>
                    setMobileMenuOpen(true)
                  }
                  className="rounded-lg p-2 text-white/50 hover:bg-white/[0.05] hover:text-white lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </button>

                <div className="hidden items-center gap-2 sm:flex">
                  <Code2 className="h-4 w-4 text-cyan-300" />

                  <span className="text-xs font-medium text-white/70">
                    Build
                  </span>
                </div>

                <div className="mx-1 hidden h-4 w-px bg-white/[0.08] sm:block" />

                <span className="max-w-[180px] truncate text-xs text-white/35 sm:max-w-[300px]">
                  {messages.length > 0
                    ? "Current project"
                    : "Untitled project"}
                </span>

              </div>

              {/* =================================================
                  TOP RIGHT
              ================================================= */}

              <div className="flex items-center gap-2">

                {/* CREDITS */}

                <div className="hidden items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 py-1.5 sm:flex">

                  <Zap className="h-3.5 w-3.5 text-cyan-300" />

                  <span className="text-[11px] text-white/55">
                    {creditsLoading
                      ? "..."
                      : credits ?? 0}
                  </span>

                </div>

                {/* =================================================
                    PROFILE / LOGIN
                ================================================= */}

                {user ? (
                  <div
                    ref={profileMenuRef}
                    className="relative"
                  >

                    {/* AVATAR BUTTON */}

                    <button
                      type="button"
                      aria-label="Open profile menu"
                      onClick={() =>
                        setProfileMenuOpen(
                          (value) => !value
                        )
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.1] bg-gradient-to-br from-cyan-400/20 to-purple-500/20 text-[10px] font-semibold text-white transition hover:border-white/[0.2] hover:bg-white/[0.1]"
                    >
                      {(
                        user.displayName ||
                        user.email ||
                        "U"
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </button>

                    {/* PROFILE DROPDOWN */}

                    {profileMenuOpen && (
                      <div className="absolute right-0 top-full z-[100] mt-2 w-[275px] overflow-hidden rounded-2xl border border-white/[0.09] bg-[#101116]/98 p-1.5 shadow-[0_24px_70px_rgba(0,0,0,0.65)] backdrop-blur-2xl">

                        {/* HEADER */}

                        <div className="rounded-xl bg-white/[0.04] p-3">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400/20 to-purple-400/20 text-sm font-semibold text-white">
                              {(
                                user.displayName ||
                                user.email ||
                                "U"
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div className="min-w-0 flex-1">

                              <p className="truncate text-xs font-semibold text-white">
                                {user.displayName ||
                                  "PIXZEN User"}
                              </p>

                              <p className="mt-0.5 truncate text-[10px] text-white/35">
                                {user.email}
                              </p>

                            </div>

                          </div>

                        </div>

                        {/* CREDITS */}

                        <div className="mt-1.5 flex items-center justify-between rounded-xl px-3 py-2.5">

                          <div className="flex items-center gap-2">

                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-400/10">
                              <Zap className="h-3.5 w-3.5 text-cyan-300" />
                            </div>

                            <div>
                              <p className="text-[10px] font-medium text-white/65">
                                Credits
                              </p>

                              <p className="text-[9px] text-white/30">
                                Available balance
                              </p>
                            </div>

                          </div>

                          <span className="text-xs font-semibold text-white">
                            {creditsLoading
                              ? "..."
                              : credits ?? 0}
                          </span>

                        </div>

                        {/* PLAN */}

                        <div className="flex items-center justify-between rounded-xl px-3 py-2.5">

                          <div className="flex items-center gap-2">

                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-400/10">
                              <Sparkles className="h-3.5 w-3.5 text-purple-300" />
                            </div>

                            <div>
                              <p className="text-[10px] font-medium text-white/65">
                                Plan
                              </p>

                              <p className="text-[9px] text-white/30">
                                Current plan
                              </p>
                            </div>

                          </div>

                          <span className="rounded-md bg-white/[0.06] px-2 py-1 text-[9px] font-medium capitalize text-white/55">
                            {userPlan}
                          </span>

                        </div>

                        <div className="my-1.5 h-px bg-white/[0.07]" />

                        {/* PROFILE */}

                        <a
                          href="/profile"
                          onClick={() =>
                            setProfileMenuOpen(
                              false
                            )
                          }
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-white/55 transition hover:bg-white/[0.05] hover:text-white"
                        >
                          <CircleUserRound className="h-4 w-4" />
                          Profile
                        </a>

                        {/* SETTINGS */}

                        <a
                          href="/settings"
                          onClick={() =>
                            setProfileMenuOpen(
                              false
                            )
                          }
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-white/55 transition hover:bg-white/[0.05] hover:text-white"
                        >
                          <Settings className="h-4 w-4" />
                          Settings
                        </a>

                        {/* UPGRADE */}

                        {!isPaidUser && (
                          <a
                            href="/#pricing"
                            onClick={() =>
                              setProfileMenuOpen(
                                false
                              )
                            }
                            style={{
                              color: "#000000",
                              backgroundColor:
                                "#ffffff",
                              display: "flex",
                              width: "100%",
                              height: "32px",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              whiteSpace:
                                "nowrap",
                              overflow:
                                "hidden",
                              visibility:
                                "visible",
                              opacity: 1,
                            }}
                            className="mt-1.5 rounded-lg px-2 text-[10px] font-semibold leading-none transition hover:bg-white/90"
                          >
                            Upgrade plan
                          </a>
                        )}

                        {/* LOGOUT */}

                        <button
                          type="button"
                          onClick={
                            handleLogout
                          }
                          style={{
                            color: "#fca5a5",
                            backgroundColor:
                              "transparent",
                          }}
                          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs transition hover:bg-red-400/[0.06]"
                        >
                          <LogOut className="h-4 w-4" />

                          <span
                            style={{
                              color:
                                "#fca5a5",
                            }}
                          >
                            Log out
                          </span>
                        </button>

                      </div>
                    )}

                  </div>
                ) : (
                  <a
                    href="/login"
                    style={{
                      color: "#ffffff",
                      backgroundColor:
                        "rgba(255,255,255,0.06)",
                    }}
                    className="rounded-lg border border-white/[0.1] px-3 py-1.5 text-[11px] font-medium transition hover:bg-white/[0.1]"
                  >
                    Login
                  </a>
                )}

              </div>

            </header>

            {/* =================================================
                WORKSPACE
            ================================================= */}

            <div className="relative flex min-h-0 flex-1">

              {/* =================================================
                  CHAT
              ================================================= */}

              <section
                className={`relative flex min-w-0 flex-1 flex-col ${
                  previewOpen
                    ? "lg:border-r lg:border-white/[0.07]"
                    : ""
                }`}
              >

                <div
                  id="chat-scroll"
                  className="flex-1 overflow-y-auto"
                >

                  <div className="mx-auto flex min-h-full w-full max-w-[850px] flex-col px-4 pb-[170px] pt-8 sm:px-6 lg:px-8">

                    {/* EMPTY STATE */}

                    {messages.length === 0 ? (
                      <div className="flex flex-1 flex-col items-center justify-center py-10">

                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.05] shadow-[0_0_60px_rgba(34,211,238,0.08)]">
                          <Sparkles className="h-6 w-6 text-cyan-300" />
                        </div>

                        <h1 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
                          What do you want to build?
                        </h1>

                        <p className="mt-3 max-w-[520px] text-center text-sm leading-6 text-white/35">
                          Describe your website,
                          app, dashboard, or
                          idea and PIXZEN will
                          turn it into a working
                          project.
                        </p>

                        <div className="mt-8 grid w-full max-w-[650px] grid-cols-1 gap-2 sm:grid-cols-2">

                          {suggestions.map(
                            (suggestion) => (
                              <button
                                key={
                                  suggestion
                                }
                                type="button"
                                onClick={() => {
                                  setInput(
                                    suggestion
                                  );

                                  inputRef.current?.focus();
                                }}
                                className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-left text-xs text-white/45 transition hover:border-white/[0.12] hover:bg-white/[0.045] hover:text-white/75"
                              >
                                {suggestion}
                              </button>
                            )
                          )}

                        </div>

                      </div>
                    ) : (
                      /* CHAT MESSAGES */

                      <div className="space-y-7">

                        {messages.map(
                          (message) => {
                            const modelInfo =
                              getModelInfo(
                                message.model
                              );

                            /* USER */

                            if (
                              message.role ===
                              "user"
                            ) {
                              return (
                                <div
                                  key={
                                    message.id
                                  }
                                  className="flex justify-end"
                                >
                                  <div className="max-w-[80%] rounded-2xl rounded-br-md bg-white/[0.08] px-4 py-3 text-sm leading-6 text-white/85">
                                    {
                                      message.content
                                    }
                                  </div>
                                </div>
                              );
                            }

                            /* AI */

                            return (
                              <div
                                key={
                                  message.id
                                }
                                className="flex gap-3"
                              >

                                <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-cyan-300/10 bg-cyan-300/[0.06]">
                                  <Bot className="h-4 w-4 text-cyan-300" />
                                </div>

                                <div className="min-w-0 flex-1">

                                  <div className="mb-2 flex items-center gap-2">

                                    <span className="text-xs font-semibold text-white/75">
                                      PIXZEN AI
                                    </span>

                                    <span className="rounded-md border border-white/[0.07] bg-white/[0.025] px-1.5 py-0.5 text-[8px] text-white/30">
                                      {
                                        modelInfo.name
                                      }
                                    </span>

                                    <span className="hidden text-[8px] text-white/20 sm:inline">
                                      {
                                        modelInfo.provider
                                      }
                                    </span>

                                  </div>

                                  <div className="whitespace-pre-wrap break-words text-sm leading-7 text-white/60">
                                    {
                                      message.content
                                    }
                                  </div>

                                </div>

                              </div>
                            );
                          }
                        )}

                        {/* LOADING */}

                        {loading && (
                          <div className="flex gap-3">

                            <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-cyan-300/10 bg-cyan-300/[0.06]">
                              <Bot className="h-4 w-4 text-cyan-300" />
                            </div>

                            <div className="flex items-center gap-2 text-xs text-white/30">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              PIXZEN is building...
                            </div>

                          </div>
                        )}

                      </div>
                    )}

                  </div>

                </div>

                {/* =================================================
                    INPUT
                ================================================= */}

                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40">

                  <div className="mx-auto max-w-[900px] px-3 pb-4 sm:px-5 sm:pb-6">

                    <div className="pointer-events-auto relative">

                      <div className="absolute -inset-3 -z-10 bg-gradient-to-t from-[#07080c] via-[#07080c]/95 to-transparent blur-xl" />

                      {/* MODEL SELECTOR */}

                      <div
                        ref={
                          modelSelectorRef
                        }
                        className="relative mb-2"
                      >

                        <button
                          type="button"
                          onClick={() =>
                            setModelMenuOpen(
                              (value) =>
                                !value
                            )
                          }
                          disabled={loading}
                          className="flex h-8 w-fit items-center gap-1.5 rounded-lg border border-white/10 bg-[#101116]/95 px-2.5 text-[11px] text-white/70 shadow-lg backdrop-blur-xl transition hover:border-white/20 hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-50"
                        >

                          <div className="flex h-4 w-4 items-center justify-center rounded-md bg-cyan-400/10">
                            <Sparkles className="h-2.5 w-2.5 text-cyan-300" />
                          </div>

                          <span>
                            {
                              selectedModelInfo.name
                            }
                          </span>

                          <ChevronDown
                            className={`h-3 w-3 text-white/30 transition-transform ${
                              modelMenuOpen
                                ? "rotate-180"
                                : ""
                            }`}
                          />

                        </button>

                        {/* MODEL DROPDOWN */}

                        {modelMenuOpen && (
                          <div className="absolute bottom-full left-0 z-50 mb-2 w-[245px] overflow-hidden rounded-xl border border-white/10 bg-[#101116]/98 p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-2xl">

                            <div className="px-2.5 pb-1.5 pt-1.5">

                              <p className="text-[11px] font-semibold text-white">
                                Select model
                              </p>

                              <p className="mt-0.5 text-[9px] leading-4 text-white/35">
                                Choose the AI model
                                for your build.
                              </p>

                            </div>

                            <div className="space-y-0.5">

                              {MODELS.map(
                                (model) => {

                                  const locked =
                                    model.paidOnly &&
                                    !isPaidUser;

                                  const selected =
                                    selectedModel ===
                                    model.id;

                                  return (
                                    <button
                                      key={
                                        model.id
                                      }
                                      type="button"
                                      onClick={() =>
                                        selectModel(
                                          model
                                        )
                                      }
                                      disabled={
                                        locked
                                      }
                                      className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition ${
                                        selected
                                          ? "bg-cyan-400/[0.08]"
                                          : locked
                                            ? "cursor-not-allowed opacity-40"
                                            : "hover:bg-white/[0.05]"
                                      }`}
                                    >

                                      <div
                                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                                          selected
                                            ? "bg-cyan-400/10 text-cyan-300"
                                            : "bg-white/[0.04] text-white/40"
                                        }`}
                                      >

                                        {model.id ===
                                        "pixzen" ? (
                                          <Sparkles className="h-3.5 w-3.5" />
                                        ) : model.id.includes(
                                            "claude"
                                          ) ? (
                                          <Bot className="h-3.5 w-3.5" />
                                        ) : (
                                          <Code2 className="h-3.5 w-3.5" />
                                        )}

                                      </div>

                                      <div className="min-w-0 flex-1">

                                        <div className="flex items-center gap-1.5">

                                          <span className="text-[11px] font-medium text-white">
                                            {
                                              model.name
                                            }
                                          </span>

                                          {locked && (
                                            <span className="rounded bg-white/[0.06] px-1 py-0.5 text-[7px] uppercase tracking-wide text-white/30">
                                              Pro
                                            </span>
                                          )}

                                          {selected && (
                                            <Check className="ml-auto h-3 w-3 text-cyan-300" />
                                          )}

                                        </div>

                                        <p className="mt-0.5 truncate text-[9px] text-white/35">
                                          {
                                            model.description
                                          }
                                        </p>

                                      </div>

                                    </button>
                                  );
                                }
                              )}

                            </div>

                            {/* UPGRADE */}

                            {!isPaidUser && (
                              <div className="mt-1.5 border-t border-white/[0.07] px-2 pb-2 pt-2">

                                <a
                                  href="/#pricing"
                                  style={{
                                    color:
                                      "#000000",
                                    backgroundColor:
                                      "#ffffff",
                                    display:
                                      "flex",
                                    width:
                                      "100%",
                                    height:
                                      "32px",
                                    alignItems:
                                      "center",
                                    justifyContent:
                                      "center",
                                    whiteSpace:
                                      "nowrap",
                                    overflow:
                                      "hidden",
                                    visibility:
                                      "visible",
                                    opacity: 1,
                                  }}
                                  className="rounded-lg px-2 text-[10px] font-semibold leading-none transition hover:bg-white/90"
                                >
                                  Upgrade to unlock all models
                                </a>

                              </div>
                            )}

                          </div>
                        )}

                      </div>

                      {/* INPUT BOX */}

                      <div className="overflow-hidden rounded-2xl border border-white/[0.1] bg-[#101116]/95 shadow-[0_20px_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl">

                        <div className="flex items-end gap-2 p-2">

                          <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(event) =>
                              setInput(
                                event.target.value
                              )
                            }
                            onKeyDown={
                              handleInputKeyDown
                            }
                            placeholder={`Describe what you want to build with ${selectedModelInfo.name}...`}
                            rows={1}
                            className="max-h-[140px] min-h-[42px] flex-1 resize-none bg-transparent px-2.5 py-2.5 text-sm leading-5 text-white outline-none placeholder:text-white/20"
                          />

                          <button
                            type="button"
                            onClick={
                              sendMessage
                            }
                            disabled={
                              loading ||
                              !input.trim()
                            }
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-25"
                          >
                            {loading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <ArrowUp className="h-4 w-4" />
                            )}
                          </button>

                        </div>

                        <div className="flex items-center justify-between border-t border-white/[0.05] px-3 py-2">

                          <div className="flex items-center gap-2 text-[9px] text-white/20">
                            <Sparkles className="h-3 w-3" />
                            AI-powered development
                          </div>

                          <div className="text-[9px] text-white/20">
                            Enter to build
                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </section>

              {/* =================================================
                  PREVIEW PANEL
              ================================================= */}

              {previewOpen && (
                <section className="hidden min-w-0 flex-1 flex-col bg-[#0b0c10] lg:flex">

                  {/* PREVIEW HEADER */}

                  <div className="flex h-[52px] shrink-0 items-center justify-between border-b border-white/[0.07] px-4">

                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-white/45" />

                      <span className="text-xs font-medium text-white/65">
                        Preview
                      </span>
                    </div>

                    <div className="flex items-center gap-1">

                      {/* DESKTOP */}

                      <button
                        type="button"
                        onClick={() =>
                          setPreviewMode(
                            "desktop"
                          )
                        }
                        className={`rounded-md p-1.5 transition ${
                          previewMode ===
                          "desktop"
                            ? "bg-white/[0.08] text-white"
                            : "text-white/25 hover:text-white/60"
                        }`}
                        title="Desktop preview"
                      >
                        <Monitor className="h-3.5 w-3.5" />
                      </button>

                      {/* MOBILE */}

                      <button
                        type="button"
                        onClick={() =>
                          setPreviewMode(
                            "mobile"
                          )
                        }
                        className={`rounded-md p-1.5 transition ${
                          previewMode ===
                          "mobile"
                            ? "bg-white/[0.08] text-white"
                            : "text-white/25 hover:text-white/60"
                        }`}
                        title="Mobile preview"
                      >
                        <Smartphone className="h-3.5 w-3.5" />
                      </button>

                      <div className="mx-1 h-4 w-px bg-white/[0.07]" />

                      {/* REFRESH */}

                      <button
                        type="button"
                        onClick={() =>
                          setPreviewHtml(
                            (value) =>
                              `${value}`
                          )
                        }
                        className="rounded-md p-1.5 text-white/25 transition hover:text-white/70"
                        title="Refresh preview"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                      </button>

                      {/* CLOSE */}

                      <button
                        type="button"
                        onClick={() =>
                          setPreviewOpen(
                            false
                          )
                        }
                        className="rounded-md p-1.5 text-white/25 transition hover:text-white/70"
                        title="Close preview"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>

                    </div>

                  </div>

                  {/* PREVIEW BODY */}

                  <div className="min-h-0 flex-1 overflow-auto p-4">

                    <div
                      className={`mx-auto h-full overflow-hidden rounded-xl border border-white/[0.08] bg-white shadow-2xl transition-all ${
                        previewMode ===
                        "mobile"
                          ? "max-w-[390px]"
                          : "w-full"
                      }`}
                    >

                      {previewHtml ? (
                        <iframe
                          title="PIXZEN Preview"
                          srcDoc={
                            previewHtml
                          }
                          className="h-full w-full border-0 bg-white"
                          sandbox="allow-scripts allow-forms allow-modals allow-popups"
                        />
                      ) : (
                        <div className="flex h-full min-h-[400px] flex-col items-center justify-center bg-[#fafafa] text-center">

                          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-black/[0.04]">
                            <Eye className="h-5 w-5 text-black/30" />
                          </div>

                          <p className="text-sm font-medium text-black/55">
                            Preview will appear here
                          </p>

                          <p className="mt-1 max-w-[260px] text-xs leading-5 text-black/30">
                            Ask PIXZEN to build
                            something and your
                            generated website
                            will appear here.
                          </p>

                        </div>
                      )}

                    </div>

                  </div>

                  {/* PREVIEW FOOTER */}

                  {previewHtml && (
                    <div className="flex h-[52px] shrink-0 items-center justify-between border-t border-white/[0.07] px-4">

                      <div className="flex items-center gap-2 text-[9px] text-white/25">
                        <FileCode2 className="h-3.5 w-3.5" />
                        Generated HTML
                      </div>

                      <div className="flex items-center gap-1">

                        {/* COPY */}

                        <button
                          type="button"
                          onClick={
                            copyPreview
                          }
                          className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[9px] text-white/35 transition hover:bg-white/[0.05] hover:text-white"
                        >
                          {copied ? (
                            <>
                              <Check className="h-3 w-3" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              Copy
                            </>
                          )}
                        </button>

                        {/* OPEN */}

                        <button
                          type="button"
                          onClick={() => {
                            const blob =
                              new Blob(
                                [
                                  previewHtml,
                                ],
                                {
                                  type: "text/html",
                                }
                              );

                            const url =
                              URL.createObjectURL(
                                blob
                              );

                            window.open(
                              url,
                              "_blank",
                              "noopener,noreferrer"
                            );

                            setTimeout(
                              () => {
                                URL.revokeObjectURL(
                                  url
                                );
                              },
                              10000
                            );
                          }}
                          className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[9px] text-white/35 transition hover:bg-white/[0.05] hover:text-white"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Open
                        </button>

                      </div>

                    </div>
                  )}

                </section>
              )}

              {/* =================================================
                  REOPEN PREVIEW
              ================================================= */}

              {!previewOpen && (
                <button
                  type="button"
                  onClick={() =>
                    setPreviewOpen(true)
                  }
                  className="absolute right-4 top-4 z-30 flex items-center gap-2 rounded-lg border border-white/[0.08] bg-[#101116]/90 px-3 py-2 text-[10px] text-white/55 shadow-xl backdrop-blur-xl transition hover:bg-white/[0.08] hover:text-white"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Preview
                </button>
              )}

            </div>

          </div>

        </section>

      </div>
    </main>
  );
}