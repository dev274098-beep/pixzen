"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Bell,
  Check,
  CircleUserRound,
  LogOut,
  Save,
  Settings as SettingsIcon,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, updateProfile, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function SettingsPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [projectNotifications, setProjectNotifications] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
        return;
      }

      setUser(currentUser);
      setName(currentUser.displayName ?? "");
    });

    return () => unsubscribe();
  }, [router]);

  const saveSettings = async () => {
    if (!user || saving) return;

    setSaving(true);
    setSaved(false);

    try {
      await updateProfile(user, {
        displayName: name.trim(),
      });

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (error) {
      console.error("Settings save error:", error);
    } finally {
      setSaving(false);
    }
  };

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

  if (!user) {
    return (
      <main className="min-h-screen bg-[#07080c] text-white flex items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-cyan-400" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07080c] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-250px] h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute right-[-100px] top-1/2 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[130px]" />
      </div>

      <div className="relative mx-auto min-h-screen max-w-4xl px-5 py-6 sm:px-8">
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
            <span className="font-semibold">PIXZEN</span>
          </div>

          <div className="h-9 w-9" />
        </header>

        <section className="mt-12">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-cyan-400">
              <SettingsIcon size={18} />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                Settings
              </span>
            </div>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Account Settings
            </h1>

            <p className="mt-2 text-sm text-white/40">
              Customize your PIXZEN account preferences.
            </p>
          </div>

          {/* Profile */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
                <CircleUserRound size={19} className="text-cyan-300" />
              </div>

              <div>
                <h2 className="font-semibold">Profile</h2>
                <p className="text-xs text-white/35">
                  Update your account information.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5">
              <div>
                <label className="mb-2 block text-xs font-medium text-white/50">
                  Display name
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none placeholder:text-white/20 transition focus:border-cyan-400/40"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-white/50">
                  Email
                </label>

                <input
                  value={user.email ?? ""}
                  readOnly
                  className="h-12 w-full cursor-not-allowed rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 text-sm text-white/40 outline-none"
                />
              </div>

              <button
                onClick={saveSettings}
                disabled={saving}
                className="flex h-11 w-fit items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saved ? <Check size={16} /> : <Save size={16} />}
                {saving ? "Saving..." : saved ? "Saved" : "Save changes"}
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-400/10">
                <Bell size={19} className="text-purple-300" />
              </div>

              <div>
                <h2 className="font-semibold">Notifications</h2>
                <p className="text-xs text-white/35">
                  Choose which notifications you receive.
                </p>
              </div>
            </div>

            <div className="mt-6 divide-y divide-white/[0.07]">
              <SettingToggle
                title="Email notifications"
                description="Receive important account updates by email."
                enabled={emailNotifications}
                onChange={setEmailNotifications}
              />

              <SettingToggle
                title="Project notifications"
                description="Receive updates about your generated projects."
                enabled={projectNotifications}
                onChange={setProjectNotifications}
              />
            </div>
          </div>

          {/* Appearance */}
          <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10">
                <Sparkles size={19} className="text-cyan-300" />
              </div>

              <div>
                <h2 className="font-semibold">Appearance</h2>
                <p className="text-xs text-white/35">
                  PIXZEN currently uses its premium dark interface.
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.04] p-4">
              <p className="text-sm font-medium">Dark</p>
              <p className="mt-1 text-xs text-white/35">
                Premium futuristic PIXZEN interface.
              </p>
            </div>
          </div>

          {/* Logout */}
          <div className="mt-5 mb-10 rounded-3xl border border-red-400/10 bg-red-400/[0.025] p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold">Log out</h2>
                <p className="mt-1 text-sm text-white/35">
                  Sign out from your PIXZEN account on this device.
                </p>
              </div>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                style={{
                  color: "#fca5a5",
                  backgroundColor: "rgba(239, 68, 68, 0.10)",
                  border: "1px solid rgba(248, 113, 113, 0.20)",
                  visibility: "visible",
                  opacity: loggingOut ? 0.6 : 1,
                }}
                className="flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition hover:bg-red-500/15 disabled:cursor-not-allowed"
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

function SettingToggle({
  title,
  description,
  enabled,
  onChange,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-5 py-5">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-xs leading-5 text-white/35">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onChange(!enabled)}
        aria-label={title}
        aria-pressed={enabled}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-cyan-400" : "bg-white/10"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}