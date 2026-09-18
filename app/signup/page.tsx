"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function SignupPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    const cleanName = name.trim();
    const cleanEmail = email.trim();

    if (!cleanName) {
      setError("Please enter your full name.");
      return;
    }

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreed) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);

    try {
      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          cleanEmail,
          password
        );

      await updateProfile(userCredential.user, {
        displayName: cleanName,
      });

      // Signup successful → Login page
      router.push("/login");
    } catch (err: any) {
      console.error("Firebase Signup Error:", err);

      switch (err?.code) {
        case "auth/email-already-in-use":
          setError(
            "An account already exists with this email."
          );
          break;

        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;

        case "auth/weak-password":
          setError(
            "Password is too weak. Please use a stronger password."
          );
          break;

        case "auth/network-request-failed":
          setError(
            "Network error. Please check your internet connection."
          );
          break;

        case "auth/operation-not-allowed":
          setError(
            "Email/password signup is not enabled in Firebase."
          );
          break;

        default:
          setError(
            "Unable to create your account. Please try again."
          );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#02040a] text-white">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-[-15%] h-[650px] w-[750px] -translate-x-1/2 rounded-full bg-cyan-500/[.10] blur-[130px]" />
        <div className="absolute right-[-10%] top-[25%] h-[500px] w-[500px] rounded-full bg-purple-600/[.12] blur-[120px]" />
        <div className="absolute bottom-[-15%] left-[-10%] h-[450px] w-[450px] rounded-full bg-blue-600/[.10] blur-[120px]" />
      </div>

      {/* Top */}
      <div className="relative z-10 p-5 sm:p-7">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-white/55 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to PIXZEN
        </Link>
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-[calc(100vh-90px)] items-center justify-center px-5 py-10">
        <div className="w-full max-w-[470px]">
          {/* Logo */}
          <div className="mb-7 flex justify-center">
            <Link href="/" aria-label="PIXZEN">
              <img
                src="/pixzen-icon.png"
                alt="PIXZEN"
                className="h-16 w-16 object-contain"
              />
            </Link>
          </div>

          {/* Card */}
          <div
            className="rounded-[28px] border border-white/[.12] p-7 sm:p-9"
            style={{
              background: "rgba(7,12,24,.78)",
              backdropFilter: "blur(30px)",
              WebkitBackdropFilter: "blur(30px)",
              boxShadow:
                "0 30px 100px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.08)",
            }}
          >
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-[-.04em]">
                Create your account
              </h1>

              <p className="mt-3 text-sm leading-6 text-white/45">
                Start building smarter with PIXZEN.
              </p>
            </div>

            <form
              className="mt-8 space-y-4"
              onSubmit={handleSignup}
            >
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-white/75">
                  Full name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                  />

                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    required
                    className="h-13 w-full rounded-xl border border-white/[.10] bg-white/[.04] pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-cyan-400/50 focus:bg-white/[.06]"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-white/75">
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                  />

                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    className="h-13 w-full rounded-xl border border-white/[.10] bg-white/[.04] pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-cyan-400/50 focus:bg-white/[.06]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-white/75">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    className="h-13 w-full rounded-xl border border-white/[.10] bg-white/[.04] pl-11 pr-12 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-cyan-400/50 focus:bg-white/[.06]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((v) => !v)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
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

              {/* Confirm */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-white/75">
                  Confirm password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                  />

                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    autoComplete="new-password"
                    required
                    className="h-13 w-full rounded-xl border border-white/[.10] bg-white/[.04] pl-11 pr-12 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-cyan-400/50 focus:bg-white/[.06]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirm((v) => !v)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirm ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <label className="flex cursor-pointer items-start gap-3 pt-1">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="sr-only"
                />

                <span
                  className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                    agreed
                      ? "border-cyan-400 bg-cyan-400/[.10]"
                      : "border-white/20 bg-white/[.04]"
                  }`}
                >
                  {agreed && (
                    <Check
                      size={11}
                      className="text-cyan-400"
                    />
                  )}
                </span>

                <span className="text-xs leading-5 text-white/40">
                  I agree to the PIXZEN{" "}
                  <span className="text-white/65">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="text-white/65">
                    Privacy Policy
                  </span>
                  .
                </span>
              </label>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-400/20 bg-red-400/[.06] px-4 py-3 text-sm leading-5 text-red-300">
                  {error}
                </div>
              )}

              {/* Create */}
              <button
                type="submit"
                disabled={loading}
                className="group mt-2 flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-sm font-bold text-white shadow-[0_0_30px_rgba(37,99,235,.22)] transition hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(37,99,235,.32)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create account"}

                {!loading && (
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            <div className="mt-7 text-center text-sm text-white/40">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-cyan-400 transition hover:text-cyan-300"
              >
                Sign in
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-white/25">
            © {new Date().getFullYear()} PIXZEN
          </p>
        </div>
      </div>
    </main>
  );
}