"use client";

import { ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      // Login successful → Home page
      router.push("/");
    } catch (err: any) {
      console.error("Firebase Login Error:", err);

      switch (err?.code) {
        case "auth/invalid-credential":
          setError("Email or password is incorrect.");
          break;

        case "auth/user-not-found":
          setError("No account found with this email.");
          break;

        case "auth/wrong-password":
          setError("Incorrect password.");
          break;

        case "auth/invalid-email":
          setError("Please enter a valid email.");
          break;

        case "auth/too-many-requests":
          setError("Too many attempts. Please try again later.");
          break;

        case "auth/network-request-failed":
          setError(
            "Network error. Please check your internet connection."
          );
          break;

        case "auth/user-disabled":
          setError("This account has been disabled.");
          break;

        default:
          setError("Unable to login. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#02040a] text-white">
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">

        {/* Background Glow */}
        <div
          className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle,rgba(37,99,235,.18),rgba(124,58,237,.08) 45%,transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        <div className="relative z-10 w-full max-w-md">

          {/* PIXZEN Logo */}
          <div className="mb-8 flex justify-center">
            <a href="/" aria-label="PIXZEN Home">
              <img
                src="/pixzen-icon.png"
                alt="PIXZEN"
                className="h-14 w-14 object-contain"
              />
            </a>
          </div>

          {/* Login Card */}
          <div
            className="rounded-3xl border border-white/[.12] p-7 sm:p-9"
            style={{
              background: "rgba(7,12,25,.82)",
              backdropFilter: "blur(30px)",
              WebkitBackdropFilter: "blur(30px)",
              boxShadow:
                "0 30px 80px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.08)",
            }}
          >

            {/* Heading */}
            <div className="text-center">

              <div className="mb-4 flex justify-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/[.08]">
                  <Sparkles
                    size={20}
                    className="text-cyan-300"
                  />
                </div>
              </div>

              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back
              </h1>

              <p className="mt-2 text-sm text-white/45">
                Login to continue with PIXZEN
              </p>

            </div>

            {/* Login Form */}
            <form
              className="mt-8 space-y-5"
              onSubmit={handleLogin}
            >

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-white/[.12] bg-white/[.04] px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-cyan-400/50 focus:bg-white/[.06]"
                />
              </div>

              {/* Password */}
              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label className="text-sm font-medium text-white/75">
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs font-medium text-cyan-400 hover:text-cyan-300"
                  >
                    Forgot password?
                  </button>

                </div>

                <div className="relative">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    required
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-white/[.12] bg-white/[.04] px-4 py-3.5 pr-12 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-cyan-400/50 focus:bg-white/[.06]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((v) => !v)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>

              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-400/20 bg-red-400/[.06] px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  background:
                    "linear-gradient(135deg,#06b6d4,#2563eb 55%,#7c3aed)",
                  boxShadow:
                    "0 0 30px rgba(37,99,235,.25)",
                }}
              >

                {loading
                  ? "Logging in..."
                  : "Login"}

                {!loading && (
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}

              </button>

            </form>

            {/* Divider */}
            <div className="my-7 flex items-center gap-3">

              <div className="h-px flex-1 bg-white/[.08]" />

              <span className="text-xs text-white/25">
                OR
              </span>

              <div className="h-px flex-1 bg-white/[.08]" />

            </div>

            {/* Signup */}
            <p className="text-center text-sm text-white/45">
              Don't have an account?{" "}

              <a
                href="/signup"
                className="font-semibold text-cyan-400 hover:text-cyan-300"
              >
                Sign up
              </a>

            </p>

          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-white/25">
            © {new Date().getFullYear()} PIXZEN. All rights reserved.
          </p>

        </div>
      </div>
    </main>
  );
}