"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bot,
  Check,
  ChevronDown,
  ChevronRight,
  Code2,
  Globe,
  Layers,
  LogOut,
  Menu,
  Palette,
  Settings,
  Shield,
  Sparkles,
  UserRound,
  X,
  Zap,
} from "lucide-react";

import {
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

/* =========================================================
   VIDEOS
========================================================= */

const HERO_VIDEO =
  "https://strvid.nyc3.cdn.digitaloceanspaces.com/motionsite/blue-light-glow.mp4";

const FAQ_VIDEO =
  "https://strvid.nyc3.digitaloceanspaces.com/motionitems/source/1781983008187-motion_51.mp4";

/* =========================================================
   LOGO
========================================================= */

function Logo() {
  return (
    <a
      href="#home"
      aria-label="PIXZEN Home"
      className="flex items-center"
    >
      <img
        src="/pixzen-icon.png"
        alt="PIXZEN"
        className="h-10 w-10 object-contain"
      />
    </a>
  );
}

/* =========================================================
   NAVBAR
========================================================= */

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const links = [
    ["Home", "#home"],
    ["Features", "#features"],
    ["Services", "#services"],
    ["Pricing", "#pricing"],
    ["FAQ", "#faq"],
    ["Contact", "/contact"],
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
      }
    );

    return () => unsubscribe();
  }, []);

  async function handleLogout() {
    try {
      await signOut(auth);
      setProfileOpen(false);
      setMobileOpen(false);
      window.location.href = "/";
    } catch (error) {
      console.error("PIXZEN logout error:", error);
    }
  }

  const avatarLetter =
    user?.displayName?.trim()?.charAt(0)?.toUpperCase() ||
    user?.email?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-[1000] px-4 pt-4 sm:px-5 sm:pt-5">
        <nav
          className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl border border-white/[0.14] px-4 sm:px-5"
          style={{
            background: "rgba(3,7,18,.82)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow:
              "0 15px 50px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.07)",
          }}
        >
          <Logo />

          {/* Desktop navigation */}
          <div className="hidden items-center gap-5 lg:ml-16 lg:flex xl:ml-24 xl:gap-6">
            {links.map(([label, href], index) => (
              <a
                key={label}
                href={href}
                className={`relative text-[12px] font-medium transition-colors duration-200 ${
                  index === 0
                    ? "text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {label}

                {index === 0 && (
                  <span className="absolute -bottom-2 left-0 right-0 mx-auto h-[2px] w-4 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
                )}
              </a>
            ))}
          </div>

          {/* Desktop right */}
          <div className="hidden items-center gap-2 md:flex">
            {!user ? (
              <>
                <a
                  href="/login"
                  className="rounded-xl px-4 py-2.5 text-[13px] font-semibold text-white/65 transition hover:bg-white/[.06] hover:text-white"
                >
                  Login
                </a>

                <a
                  href="/build"
                  className="group flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-bold text-white transition hover:-translate-y-0.5"
                  style={{
                    background:
                      "linear-gradient(135deg,#06b6d4,#2563eb 55%,#7c3aed)",
                    boxShadow:
                      "0 0 25px rgba(37,99,235,.28)",
                  }}
                >
                  Get Started
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </a>
              </>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setProfileOpen((value) => !value)
                  }
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.05] px-2.5 py-2 transition hover:bg-white/[.09]"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 text-xs font-bold text-white">
                    {avatarLetter}
                  </div>

                  <span className="max-w-[120px] truncate text-xs text-white/70">
                    {user.displayName ||
                      user.email ||
                      "Account"}
                  </span>

                  <ChevronDown
                    size={14}
                    className={`text-white/40 transition ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {profileOpen && (
                  <div
                    className="absolute right-0 top-[calc(100%+10px)] w-56 overflow-hidden rounded-2xl border border-white/10 p-1.5"
                    style={{
                      background: "rgba(7,10,20,.97)",
                      backdropFilter: "blur(30px)",
                      WebkitBackdropFilter: "blur(30px)",
                      boxShadow:
                        "0 25px 70px rgba(0,0,0,.55)",
                    }}
                  >
                    <div className="border-b border-white/[.07] px-3 py-3">
                      <p className="truncate text-xs font-semibold text-white">
                        {user.displayName || "PIXZEN User"}
                      </p>

                      <p className="mt-1 truncate text-[11px] text-white/35">
                        {user.email}
                      </p>
                    </div>

                    <a
                      href="/build"
                      className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-white/65 hover:bg-white/[.06] hover:text-white"
                    >
                      <Sparkles size={15} />
                      Build with PIXZEN
                    </a>

                    <a
                      href="/profile"
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-white/65 hover:bg-white/[.06] hover:text-white"
                    >
                      <UserRound size={15} />
                      Profile
                    </a>

                    <a
                      href="/settings"
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-white/65 hover:bg-white/[.06] hover:text-white"
                    >
                      <Settings size={15} />
                      Settings
                    </a>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs"
                      style={{
                        color: "#fca5a5",
                        backgroundColor:
                          "rgba(239,68,68,.10)",
                      }}
                    >
                      <LogOut size={15} />
                      Log out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu */}
          <button
            type="button"
            aria-label="Toggle navigation"
            onClick={() =>
              setMobileOpen((value) => !value)
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[.06] text-white md:hidden"
          >
            {mobileOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed left-4 right-4 top-[92px] z-[999] md:hidden">
          <div
            className="rounded-2xl border border-white/[.14] p-3"
            style={{
              background: "rgba(3,7,18,.97)",
              backdropFilter: "blur(30px)",
              WebkitBackdropFilter: "blur(30px)",
              boxShadow:
                "0 25px 70px rgba(0,0,0,.55)",
            }}
          >
            {links.map(([label, href]) => (
              <a
                key={label}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl px-4 py-3.5 text-sm font-medium text-white/75 transition hover:bg-white/[.06] hover:text-cyan-300"
              >
                {label}
              </a>
            ))}

            <div className="mt-2 border-t border-white/10 pt-3">
              {!user ? (
                <>
                  <a
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="mb-2 flex items-center justify-center rounded-xl border border-white/10 bg-white/[.04] px-4 py-3 text-sm font-semibold text-white/75"
                  >
                    Login
                  </a>

                  <a
                    href="/build"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 px-4 py-3 text-sm font-bold text-white"
                  >
                    Get Started
                    <ArrowRight size={15} />
                  </a>
                </>
              ) : (
                <>
                  <a
                    href="/build"
                    onClick={() => setMobileOpen(false)}
                    className="mb-2 flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 px-4 py-3 text-sm font-bold text-white"
                  >
                    Build with PIXZEN
                  </a>

                  <a
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/70 hover:bg-white/[.06]"
                  >
                    <UserRound size={17} />
                    Profile
                  </a>

                  <a
                    href="/settings"
                    onClick={() => setMobileOpen(false)}
                    className="mb-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-white/70 hover:bg-white/[.06]"
                  >
                    <Settings size={17} />
                    Settings
                  </a>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm"
                    style={{
                      color: "#fca5a5",
                      backgroundColor:
                        "rgba(239,68,68,.10)",
                    }}
                  >
                    <LogOut size={17} />
                    Log out
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* =========================================================
   HERO
========================================================= */

function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden bg-[#02040a] pt-24"
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source
          src={HERO_VIDEO}
          type="video/mp4"
        />
      </video>

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg,rgba(1,4,12,.68) 0%,rgba(1,4,12,.25) 40%,rgba(1,4,12,.96) 100%)",
        }}
      />

      <div
        className="absolute left-1/2 top-[18%] h-[520px] w-[800px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle,rgba(0,174,255,.18),rgba(37,99,235,.06) 45%,transparent 72%)",
          filter: "blur(35px)",
        }}
      />

      <div
        className="absolute -right-[10%] top-[20%] h-[500px] w-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(circle,rgba(124,58,237,.18),transparent 68%)",
          filter: "blur(45px)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-8 flex justify-center">
            <div
              className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 px-4 py-2 text-xs font-medium text-cyan-100"
              style={{
                background:
                  "rgba(8,25,45,.58)",
                backdropFilter: "blur(15px)",
              }}
            >
              <Sparkles
                size={13}
                className="text-cyan-300"
              />

              The next generation AI platform

              <ChevronRight
                size={13}
                className="text-white/40"
              />
            </div>
          </div>

          <h1 className="text-balance text-5xl font-black leading-[.95] tracking-[-.055em] text-white sm:text-6xl md:text-7xl lg:text-[88px]">
            Build smarter.
            <br />

            <span
              className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent"
              style={{
                filter:
                  "drop-shadow(0 0 30px rgba(37,99,235,.2))",
              }}
            >
              Scale faster.
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-base leading-7 text-white/55 sm:text-lg">
            PIXZEN brings powerful AI, intelligent
            automation, and modern digital tools together
            so you can turn ideas into products faster.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/build"
              className="group flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 sm:w-auto"
              style={{
                background:
                  "linear-gradient(135deg,#06b6d4,#2563eb 55%,#7c3aed)",
                boxShadow:
                  "0 0 35px rgba(37,99,235,.28)",
              }}
            >
              Start building
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>

            <a
              href="#services"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[.05] px-6 py-3.5 text-sm font-semibold text-white/85 backdrop-blur-xl transition hover:bg-white/[.1] sm:w-auto"
            >
              Explore PIXZEN
              <ChevronRight size={16} />
            </a>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-x-7 gap-y-3 text-xs text-white/35">
            {[
              "AI-powered",
              "Fast workflow",
              "Built for creators",
            ].map((item) => (
              <span
                key={item}
                className="flex items-center gap-2"
              >
                <Check
                  size={14}
                  className="text-cyan-400"
                />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-40"
        style={{
          background:
            "linear-gradient(to bottom,transparent,#02040a)",
        }}
      />
    </section>
  );
}

/* =========================================================
   FEATURES
========================================================= */

function Features() {
  const features = [
    {
      icon: Sparkles,
      title: "AI Intelligence",
      text: "Turn complex ideas into useful outputs with intelligent AI workflows.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      text: "Move from concept to execution without unnecessary complexity.",
    },
    {
      icon: Layers,
      title: "One Workspace",
      text: "Keep your creative and development workflow together in one place.",
    },
    {
      icon: Shield,
      title: "Built to Scale",
      text: "A flexible foundation designed to grow with your projects.",
    },
  ];

  return (
    <section
      id="features"
      className="relative bg-[#02040a] px-6 py-28 sm:px-8 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[.25em] text-cyan-400">
            Why PIXZEN
          </p>

          <h2 className="text-4xl font-bold tracking-[-.04em] text-white sm:text-5xl">
            Everything you need to
            <span className="text-white/40">
              {" "}
              build the future.
            </span>
          </h2>

          <p className="mt-5 max-w-xl leading-7 text-white/45">
            A focused platform for people who want less
            friction and more momentum.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/[.09] bg-white/[.025] p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/20 hover:bg-white/[.045]"
              >
                <div className="mb-7 flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[.06]">
                  <Icon
                    size={20}
                    className="text-cyan-300"
                  />
                </div>

                <h3 className="text-lg font-bold text-white">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-white/40">
                  {feature.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   SERVICES
========================================================= */

function Services() {
  const services = [
    {
      icon: Code2,
      title: "Development",
      text: "Modern websites, web apps, APIs and digital products.",
    },
    {
      icon: Palette,
      title: "UI / UX Design",
      text: "Clean interfaces and memorable digital experiences.",
    },
    {
      icon: Bot,
      title: "AI Solutions",
      text: "AI assistants, automation and intelligent workflows.",
    },
    {
      icon: Globe,
      title: "Digital Products",
      text: "Launch scalable products from idea to production.",
    },
  ];

  return (
    <section
      id="services"
      className="bg-[#03050c] px-6 py-28 sm:px-8 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[.25em] text-blue-400">
            Our Services
          </p>

          <h2 className="text-4xl font-bold tracking-[-.04em] text-white sm:text-5xl">
            Ideas into
            <span className="text-white/40">
              {" "}
              digital reality.
            </span>
          </h2>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="rounded-2xl border border-white/[.08] bg-white/[.025] p-7 transition duration-300 hover:-translate-y-1 hover:bg-white/[.05]"
              >
                <Icon
                  size={24}
                  className="text-cyan-300"
                />

                <h3 className="mt-7 text-xl font-bold text-white">
                  {service.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-white/40">
                  {service.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   PRICING
========================================================= */

function Pricing() {
  const plans = [
    {
      id: "free",
      name: "Free Mode",
      price: "₹0",
      credits: "1,000 Credits",
      icon: "https://api.iconify.design/twemoji:blossom.svg",
      iconBg: "#FFF4CD",
      features: [
        "1,000 Credits",
        "AI-powered tools",
        "Basic workflow",
      ],
      button: "Start free",
      dark: false,
      href: "/build",
    },
    {
      id: "pro",
      name: "Pro Mode",
      price: "₹399",
      credits: "10,000 Credits",
      icon: "https://api.iconify.design/twemoji:deciduous-tree.svg",
      features: [
        "10,000 Credits",
        "Advanced AI tools",
        "Priority access",
      ],
      button: "Go Pro",
      dark: true,
      href: "/payment?plan=pro",
    },
    {
      id: "max",
      name: "Max Mode",
      price: "₹999",
      credits: "Unlimited Credits",
      icon: "https://api.iconify.design/twemoji:house-with-garden.svg",
      iconBg: "#D3EFE5",
      features: [
        "Unlimited Credits",
        "All AI tools",
        "Priority support",
      ],
      button: "Go Max",
      dark: false,
      href: "/payment?plan=max",
    },
  ];

  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-[#F3EFEA] px-4 py-20 sm:px-8 sm:py-24"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-[.2em] text-black/50">
            PIXZEN Plans
          </p>

          <h2 className="mb-4 text-4xl font-bold tracking-tight text-black md:text-5xl">
            Simple, transparent pricing
          </h2>

          <p className="mx-auto max-w-2xl text-lg font-medium text-gray-600">
            Choose the perfect plan for your digital growth.
          </p>
        </div>

        <div className="mx-auto grid max-w-[1000px] grid-cols-1 items-center gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`brutal-card relative flex flex-col justify-between rounded-[2.5rem] border-[3px] border-black p-8 ${
                plan.dark
                  ? "orange-shadow bg-gradient-to-b from-[#686663] to-[#1B1B1A] md:-mt-6 md:h-[480px]"
                  : "h-[420px] bg-white"
              }`}
              style={
                plan.dark
                  ? undefined
                  : {
                      boxShadow:
                        "10px 10px 0 #000",
                    }
              }
            >
              <div>
                {plan.dark ? (
                  <div className="mb-6 flex items-center justify-between">
                    <span className="rounded-full bg-[#FFC8B4] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#C95D3B]">
                      Popular
                    </span>

                    <img
                      src={plan.icon}
                      alt=""
                      className="h-7 w-7"
                    />
                  </div>
                ) : (
                  <div
                    className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-black"
                    style={{
                      background:
                        plan.iconBg,
                      boxShadow:
                        "3px 3px 0 rgba(0,0,0,1)",
                    }}
                  >
                    <img
                      src={plan.icon}
                      alt=""
                      className="h-6 w-6"
                    />
                  </div>
                )}

                <h3
                  className={
                    plan.dark
                      ? "mb-2 text-3xl font-bold tracking-tight text-white"
                      : "mb-2 text-2xl font-bold tracking-tight text-black"
                  }
                >
                  {plan.name}
                </h3>

                <div className="flex items-end gap-2">
                  <span
                    className={
                      plan.dark
                        ? "text-[2.75rem] font-bold leading-none text-white"
                        : "text-[2.5rem] font-bold leading-none text-black"
                    }
                  >
                    {plan.price}
                  </span>

                  {plan.id !== "free" && (
                    <span
                      className={
                        plan.dark
                          ? "mb-1 text-base font-semibold text-gray-400"
                          : "mb-1 text-base font-semibold text-gray-500"
                      }
                    >
                      /mo
                    </span>
                  )}
                </div>

                {plan.dark && (
                  <p className="mb-6 mt-3 text-sm font-medium text-gray-300">
                    More power for serious AI workflows.
                  </p>
                )}

                <div
                  className={`space-y-4 ${
                    plan.dark
                      ? "mt-6"
                      : "mt-8"
                  }`}
                >
                  {plan.features.map(
                    (feature) => (
                      <div
                        key={feature}
                        className={`flex items-center text-base font-medium ${
                          plan.dark
                            ? "text-white"
                            : "text-gray-700"
                        }`}
                      >
                        {plan.dark ? (
                          <Check
                            size={17}
                            strokeWidth={3}
                            className="mr-3 shrink-0"
                          />
                        ) : (
                          <span className="mr-3 h-1 w-1 shrink-0 rounded-full bg-gray-500" />
                        )}

                        {feature}
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* PAYMENT / BUILD BUTTON */}
              <a
                href={plan.href}
                className={`btn-press flex w-full items-center justify-center rounded-full px-6 font-semibold text-base ${
                  plan.dark
                    ? "bg-[#FFE156] py-3.5 font-bold text-black hover:bg-[#F2D44D]"
                    : plan.id === "max"
                      ? "border-2 border-black bg-black py-3 text-white hover:bg-gray-800"
                      : "border-2 border-black bg-white py-3 text-black hover:bg-gray-50"
                }`}
              >
                {plan.button}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   SOLUTIONS
========================================================= */

function Solutions() {
  const items = [
    {
      icon: Code2,
      title: "Development",
      text: "Modern software and web experiences.",
    },
    {
      icon: Palette,
      title: "Creative",
      text: "Design systems and visual experiences.",
    },
    {
      icon: Bot,
      title: "AI Automation",
      text: "Automate repetitive digital workflows.",
    },
    {
      icon: Globe,
      title: "Digital Growth",
      text: "Build scalable digital products.",
    },
  ];

  return (
    <section
      id="solutions"
      className="relative overflow-hidden bg-[#02040a] px-6 py-28 sm:px-8 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[.25em] text-blue-400">
              Built for modern teams
            </p>

            <h2 className="text-4xl font-bold tracking-[-.04em] text-white sm:text-5xl">
              From idea
              <br />
              <span className="text-white/40">
                to reality.
              </span>
            </h2>

            <p className="mt-6 max-w-xl leading-7 text-white/45">
              Whether you're creating software, designing
              digital products, automating workflows, or
              exploring AI, PIXZEN gives you the tools to
              move forward.
            </p>

            <a
              href="#pricing"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
            >
              Explore solutions
              <ArrowRight size={15} />
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/[.08] bg-white/[.025] p-6"
                >
                  <Icon
                    size={21}
                    className="text-blue-400"
                  />

                  <h3 className="mt-6 font-bold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/40">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   TESTIMONIALS
========================================================= */

const testimonials = [
  {
    name: "Aarav Mehta",
    role: "Founder, Nova Labs",
    text: "PIXZEN completely changed the way our team approaches digital products.",
  },
  {
    name: "Sophia Carter",
    role: "Product Designer",
    text: "The workflow feels incredibly smooth, intuitive, and powerful.",
  },
  {
    name: "Rohan Sharma",
    role: "Startup Founder",
    text: "We were able to turn a rough concept into a working product quickly.",
  },
  {
    name: "Emily Johnson",
    role: "Creative Director",
    text: "Beautiful interfaces and a very modern experience.",
  },
  {
    name: "Kabir Patel",
    role: "Tech Lead",
    text: "PIXZEN helps us focus on shipping instead of fighting with our workflow.",
  },
  {
    name: "Maya Williams",
    role: "Founder, Bright Studio",
    text: "The entire experience feels fast and incredibly polished.",
  },
];

function Testimonials() {
  const cards = [
    ...testimonials,
    ...testimonials,
  ];

  return (
    <section
      id="testimonials"
      className="w-full overflow-hidden bg-white py-20 antialiased md:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-[#0a0a0a] px-1.5 py-1.5 pr-5 text-sm font-medium text-white shadow-xl md:text-base">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
              <Sparkles size={15} />
            </div>

            Trusted by creators and teams
          </div>

          <h2 className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-5xl lg:text-[3.5rem]">
            Loved by people who build{" "}
            <span className="text-blue-600">
              great things.
            </span>
          </h2>
        </div>
      </div>

      <div className="testimonial-mask w-full overflow-hidden pb-8">
        <div className="testimonial-track flex w-max">
          {cards.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="flex px-3"
            >
              <article className="flex min-h-[300px] w-[310px] flex-col justify-between rounded-3xl border border-gray-100 bg-gradient-to-br from-gray-50 to-gray-100 p-8 shadow-sm sm:w-[360px]">
                <div>
                  <div className="mb-6 text-4xl font-bold text-blue-600">
                    “
                  </div>

                  <p className="text-[1.05rem] font-medium leading-relaxed text-gray-700">
                    {item.text}
                  </p>
                </div>

                <div className="mt-8">
                  <div className="text-base font-bold text-gray-900">
                    {item.name}
                  </div>

                  <div className="text-sm font-medium text-gray-500">
                    {item.role}
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   FAQ
========================================================= */

function FAQ() {
  const faqs = [
    {
      question:
        "How do I get started with PIXZEN?",
      answer:
        "Create your account and start building with PIXZEN immediately.",
    },
    {
      question:
        "Is there a free plan?",
      answer:
        "Yes. PIXZEN provides a free experience with 1,000 credits.",
    },
    {
      question:
        "Can I build websites with PIXZEN?",
      answer:
        "Yes. PIXZEN can help you create websites and modern digital experiences.",
    },
    {
      question:
        "Can PIXZEN help me build AI products?",
      answer:
        "Yes. PIXZEN is designed for AI-powered applications, automation and digital products.",
    },
    {
      question:
        "Can I upgrade my plan later?",
      answer:
        "Yes. You can upgrade whenever you need additional capabilities.",
    },
    {
      question:
        "Where can I get support?",
      answer:
        "You can contact the PIXZEN support team for account, product and project help.",
    },
  ];

  const [active, setActive] =
    useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative min-h-screen overflow-hidden bg-[#02040a] px-4 py-20 sm:px-6 sm:py-24"
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source
          src={FAQ_VIDEO}
          type="video/mp4"
        />
      </video>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center,rgba(0,0,0,.5),rgba(0,0,0,.88))",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-[.25em] text-blue-400">
            FAQ
          </p>

          <h2 className="text-4xl font-bold text-white md:text-5xl">
            Frequently Asked Questions
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-white/40">
            Everything you need to know about PIXZEN.
          </p>
        </div>

        <div className="mx-auto max-w-[700px] overflow-hidden rounded-3xl border border-white/15 bg-white/[.05] backdrop-blur-2xl">
          {faqs.map((faq, index) => {
            const isOpen = active === index;

            return (
              <div
                key={faq.question}
                className={
                  index !== faqs.length - 1
                    ? "border-b border-white/[.08]"
                    : ""
                }
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() =>
                    setActive(
                      isOpen ? null : index
                    )
                  }
                  className="flex w-full items-center justify-between px-6 py-5 text-left text-base font-medium text-white transition hover:text-blue-300 md:text-lg"
                >
                  <span className="pr-5">
                    {faq.question}
                  </span>

                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      isOpen
                        ? "bg-blue-500"
                        : "bg-white/[.08]"
                    }`}
                  >
                    {isOpen ? (
                      <span className="text-lg">
                        −
                      </span>
                    ) : (
                      <span className="text-lg">
                        +
                      </span>
                    )}
                  </span>
                </button>

                <div
                  className="overflow-hidden"
                  style={{
                    maxHeight: isOpen
                      ? "300px"
                      : "0px",
                    opacity: isOpen ? 1 : 0,
                    transition:
                      "max-height .35s ease, opacity .35s ease",
                  }}
                >
                  <p className="px-6 pb-6 text-sm leading-7 text-white/40">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   RESOURCES
========================================================= */

function Resources() {
  return (
    <section
      id="resources"
      className="relative bg-[#03050c] px-6 py-28 sm:px-8 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="rounded-3xl border border-white/[.09] bg-gradient-to-br from-blue-500/[.08] via-transparent to-purple-500/[.08] p-8 sm:p-12 lg:p-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.25em] text-cyan-400">
                PIXZEN Resources
              </p>

              <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-[-.035em] text-white sm:text-4xl">
                Learn. Build. Experiment.
              </h2>

              <p className="mt-4 max-w-xl leading-7 text-white/40">
                Discover practical ideas, guides,
                workflows, and inspiration for building
                better digital products with AI.
              </p>
            </div>

            <a
              href="/build"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[.05] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/[.1]"
            >
              Start building
              <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   FOOTER
========================================================= */

function Footer() {
  return (
    <footer className="border-t border-white/[.08] bg-[#02040a] px-6 py-10 sm:px-8 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-7 md:flex-row md:items-center md:justify-between">
        <Logo />

        <p className="text-xs text-white/30">
          © {new Date().getFullYear()} PIXZEN.
          All rights reserved.
        </p>

        <div className="flex gap-5 text-xs text-white/35">
          <a
            href="/privacy"
            className="transition hover:text-white"
          >
            Privacy
          </a>

          <a
            href="/terms"
            className="transition hover:text-white"
          >
            Terms
          </a>

          <a
            href="/cookies"
            className="transition hover:text-white"
          >
            Cookies
          </a>

          <a
            href="#home"
            className="transition hover:text-white"
          >
            Top
          </a>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#02040a]">
      <Navbar />

      <Hero />

      <Features />

      <Services />

      <Pricing />

      <Solutions />

      <Testimonials />

      <FAQ />

      <Resources />

      <Footer />

      <div className="pixzen-grain" />

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          overflow-x: hidden;
          background: #02040a;
          color: white;
          font-family:
            Inter,
            Arial,
            Helvetica,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }

        ::selection {
          background: #22d3ee;
          color: #02040a;
        }

        .brutal-card {
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .brutal-card:hover {
          transform: translate(4px, 4px);
          box-shadow: 4px 4px 0 rgba(0, 0, 0, 1);
        }

        .brutal-card.orange-shadow {
          box-shadow: 10px 10px 0 #f1714e;
        }

        .brutal-card.orange-shadow:hover {
          box-shadow: 5px 5px 0 #f1714e;
        }

        .btn-press {
          transition:
            transform 0.15s ease,
            background-color 0.2s ease;
        }

        .btn-press:active {
          transform: translate(2px, 2px);
        }

        .testimonial-mask {
          mask-image:
            linear-gradient(
              to right,
              transparent,
              black 8%,
              black 92%,
              transparent
            );

          -webkit-mask-image:
            linear-gradient(
              to right,
              transparent,
              black 8%,
              black 92%,
              transparent
            );
        }

        .testimonial-track {
          animation:
            testimonialMarquee
            45s
            linear
            infinite;

          will-change: transform;
        }

        .testimonial-track:hover {
          animation-play-state: paused;
        }

        @keyframes testimonialMarquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        .pixzen-grain {
          position: fixed;
          inset: 0;
          z-index: 9999;
          pointer-events: none;
          opacity: 0.025;

          background-image:
            url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.7'/%3E%3C/svg%3E");
        }

        button:focus-visible,
        a:focus-visible {
          outline: 3px solid #22d3ee;
          outline-offset: 3px;
        }

        @media (max-width: 767px) {
          .brutal-card {
            height: 420px !important;
          }

          .brutal-card.orange-shadow {
            height: 480px !important;
          }

          .brutal-card:hover {
            transform: translate(2px, 2px);
          }

          .testimonial-track {
            animation-duration: 55s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }

          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}