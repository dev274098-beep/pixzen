"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CircleUserRound,
  CreditCard,
  LogOut,
  Mail,
  Settings,
  Sparkles,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [plan, setPlan] = useState("free");
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
        return;
      }

      setUser(currentUser);

      try {
        const token = await currentUser.getIdToken();

        const response = await fetch("/api/user/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const data = await response.json();

        if (response.ok) {
          setCredits(Number(data.credits ?? 0));
        }

        const tokenResult = await currentUser.getIdTokenResult(true);

        const userPlan =
          typeof tokenResult.claims.plan === "string"
            ? tokenResult.claims.plan
            : "free";

        setPlan(userPlan);
      } catch (error) {
        console.error("Profile load error:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#07080c] text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-white/60">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-cyan-400" />
          Loading profile...
        </div>
      </main>
    );
  }

  if (!user) return null;

  const displayName =
    user.displayName?.trim() ||
    user.email?.split("@")[0] ||
    "PIXZEN User";

  const planLabel =
    plan === "max"
      ? "MAX"
      : plan === "pro"
        ? "PRO"
        : plan === "paid"
          ? "PAID"
          : "FREE";

  return (
    <main className="min-h-screen bg-[#07080c] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-250px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute bottom-[-200px] left-[-100px] h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto min-h-screen max-w-5xl px-5 py-6 sm:px-8">
        <header className="flex items-center justify-between">
          <button
            onClick={() => router.push("/build")}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/70 transition hover:bg-white/[0.08] hover:text-white"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="flex items-center gap-2">
            <img
              src="/pixzen-icon.png"
              alt="PIXZEN"
              className="h-8 w-8 rounded-lg"
            />
            <span className="font-semibold tracking-tight">PIXZEN</span>
          </div>

          <button
            onClick={() => router.push("/settings")}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/60 transition hover:bg-white/[0.08] hover:text-white"
            aria-label="Settings"
          >
            <Settings size={17} />
          </button>
        </header>

        <section className="mt-12">
          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-400/70">
              Account
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Your Profile
            </h1>

            <p className="mt-2 text-sm text-white/40">
              Manage your PIXZEN account and credits.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-[1.5fr_1fr]">
            {/* Profile card */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-5">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                  <CircleUserRound
                    size={42}
                    strokeWidth={1.5}
                    className="text-cyan-300"
                  />
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-xl font-semibold">
                    {displayName}
                  </h2>

                  <div className="mt-1 flex items-center gap-2 text-sm text-white/40">
                    <Mail size={14} />
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-white/[0.07] pt-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-4">
                    <div className="flex items-center gap-2 text-white/40">
                      <Zap size={15} />
                      <span className="text-xs">Credits</span>
                    </div>

                    <p className="mt-2 text-2xl font-semibold">
                      {credits.toLocaleString()}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/[0.07] bg-black/20 p-4">
                    <div className="flex items-center gap-2 text-white/40">
                      <CreditCard size={15} />
                      <span className="text-xs">Plan</span>
                    </div>

                    <p className="mt-2 text-2xl font-semibold">{planLabel}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Plan card */}
            <div className="rounded-3xl border border-cyan-400/15 bg-gradient-to-br from-cyan-400/[0.08] to-purple-500/[0.06] p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
                <Sparkles size={19} className="text-cyan-300" />
              </div>

              <h2 className="mt-5 text-lg font-semibold">
                {plan === "free" ? "Free Mode" : `${planLabel} Mode`}
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/40">
                Use your PIXZEN credits to build websites, apps and other
                projects with AI.
              </p>

              <button
                onClick={() => router.push("/#pricing")}
                className="mt-6 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                View Plans
              </button>
            </div>
          </div>

          {/* Logout */}
          <div className="mt-5 rounded-3xl border border-red-400/10 bg-red-400/[0.025] p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-white">Sign out of PIXZEN</p>
                <p className="mt-1 text-sm text-white/35">
                  You can sign in again anytime.
                </p>
              </div>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                style={{
                  color: "#fca5a5",
                  backgroundColor: "rgba(239, 68, 68, 0.10)",
                  borderColor: "rgba(248, 113, 113, 0.20)",
                  opacity: loggingOut ? 0.6 : 1,
                  visibility: "visible",
                }}
                className="flex h-11 items-center justify-center gap-2 rounded-xl border px-5 text-sm font-semibold transition hover:bg-red-500/15 disabled:cursor-not-allowed"
              >
                <LogOut size={16} />
                {loggingOut ? "Signing out..." : "Log out"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}