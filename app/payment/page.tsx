"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  Lock,
  QrCode,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

const UPI_ID = "6002331877@fam";

const PLAN_DATA = {
  pro: {
    name: "PIXZEN Pro",
    price: 399,
    credits: "10,000 Credits",
  },
  max: {
    name: "PIXZEN Max",
    price: 999,
    credits: "Unlimited Credits",
  },
} as const;

type PlanId = keyof typeof PLAN_DATA;

function PaymentContent() {
  const searchParams = useSearchParams();

  const [copied, setCopied] = useState(false);
  const [paid, setPaid] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const requestedPlan = searchParams.get("plan")?.toLowerCase();

  const planId: PlanId =
    requestedPlan === "max" ? "max" : "pro";

  const plan = PLAN_DATA[planId];

  const upiUrl = useMemo(() => {
    const params = new URLSearchParams({
      pa: UPI_ID,
      pn: "PIXZEN",
      am: plan.price.toFixed(2),
      cu: "INR",
      tn: `PIXZEN ${plan.name}`,
    });

    return `upi://pay?${params.toString()}`;
  }, [plan]);

  const qrUrl = useMemo(() => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=360x360&margin=12&data=${encodeURIComponent(
      upiUrl
    )}`;
  }, [upiUrl]);

  async function copyUpi() {
    try {
      await navigator.clipboard.writeText(UPI_ID);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setMessage("Could not copy UPI ID.");
    }
  }

  function openUpi() {
    window.location.href = upiUrl;
  }

  async function submitPayment() {
    if (!transactionId.trim()) {
      setMessage("Please enter your transaction ID.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const { getAuth } = await import("firebase/auth");

      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        setMessage("Please login first.");
        setSubmitting(false);
        return;
      }

      const token = await user.getIdToken(true);

      const response = await fetch(
        "/api/payments/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            plan: planId,
            transactionId: transactionId.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Payment submission failed."
        );
      }

      setPaid(true);
      setMessage(
        "Payment submitted successfully. Verification is pending."
      );
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Payment submission failed."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-220px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-600/10 blur-[140px]" />

        <div className="absolute bottom-[-200px] right-[-100px] h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[130px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/[0.06]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
          <a
            href="/"
            className="flex items-center gap-3 text-white no-underline"
          >
            <img
              src="/pixzen-icon.png"
              alt="PIXZEN"
              className="h-9 w-9 rounded-xl object-contain"
            />

            <span className="text-lg font-black tracking-tight">
              PIXZEN
            </span>
          </a>

          <a
            href="/"
            className="flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back
          </a>
        </div>
      </header>

      {/* Main */}
      <div className="relative z-10 mx-auto max-w-5xl px-5 py-12">
        <div className="mx-auto max-w-2xl">
          {/* Title */}
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/15 bg-indigo-500/[0.06] px-4 py-2 text-xs font-semibold text-indigo-300">
              <Lock size={13} />
              Secure Checkout
            </div>

            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              Complete your payment
            </h1>

            <p className="mt-4 text-sm leading-6 text-white/40">
              Pay securely using UPI and submit your transaction ID
              for verification.
            </p>
          </div>

          {/* Plan */}
          <div className="mt-10 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
            <div className="flex items-center justify-between gap-5">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-white/30">
                  Selected Plan
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  {plan.name}
                </h2>

                <p className="mt-1 text-sm text-indigo-300">
                  {plan.credits}
                </p>
              </div>

              <div className="text-right">
                <p className="text-3xl font-black">
                  ₹{plan.price}
                </p>

                <p className="text-xs text-white/30">
                  INR
                </p>
              </div>
            </div>
          </div>

          {/* QR */}
          <div className="mt-5 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
            <div className="text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.06]">
                <QrCode size={19} />
              </div>

              <h2 className="mt-4 text-lg font-bold">
                Scan & Pay
              </h2>

              <p className="mt-1 text-xs text-white/35">
                Scan this QR code with any supported UPI app.
              </p>
            </div>

            <div className="mx-auto mt-6 flex max-w-[300px] items-center justify-center rounded-2xl bg-white p-4">
              <img
                src={qrUrl}
                alt="PIXZEN UPI QR Code"
                className="h-auto w-full"
              />
            </div>

            {/* UPI */}
            <div className="mt-6">
              <p className="mb-2 text-center text-xs text-white/30">
                UPI ID
              </p>

              <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-black/20 p-2">
                <div className="min-w-0 flex-1 px-3 py-2">
                  <p className="truncate text-center text-sm font-semibold text-white/80">
                    {UPI_ID}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={copyUpi}
                  className="flex shrink-0 items-center gap-2 rounded-lg bg-white/[0.07] px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/[0.11] hover:text-white"
                >
                  {copied ? (
                    <>
                      <Check size={14} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* UPI App */}
            <button
              type="button"
              onClick={openUpi}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white/[0.06] px-5 py-3 text-sm font-bold text-white/80 transition hover:bg-white/[0.1]"
            >
              <Smartphone size={17} />
              Pay via UPI App
              <ExternalLink size={14} />
            </button>
          </div>

          {/* Transaction */}
          <div className="mt-5 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">
            <h2 className="text-lg font-bold">
              Payment confirmation
            </h2>

            <p className="mt-2 text-xs leading-5 text-white/35">
              After completing the payment, enter your transaction
              ID below.
            </p>

            <label className="mt-5 block text-xs font-semibold text-white/50">
              Transaction ID
            </label>

            <input
              value={transactionId}
              onChange={(event) =>
                setTransactionId(event.target.value)
              }
              placeholder="Enter UPI transaction ID"
              disabled={submitting || paid}
              className="mt-2 w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-indigo-400/40 disabled:opacity-50"
            />

            <button
              type="button"
              onClick={submitPayment}
              disabled={submitting || paid}
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {paid
                ? "Payment Submitted ✓"
                : submitting
                ? "Submitting..."
                : "I've Paid"}
            </button>

            {message && (
              <p className="mt-4 text-center text-xs leading-5 text-white/50">
                {message}
              </p>
            )}
          </div>

          {/* Security */}
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-indigo-400/10 bg-indigo-500/[0.04] p-4">
            <ShieldCheck
              size={17}
              className="mt-0.5 shrink-0 text-indigo-300"
            />

            <p className="text-xs leading-5 text-white/40">
              Payment information is submitted only for payment
              verification and account credit activation.
            </p>
          </div>

          {/* Privacy */}
          <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
            <p className="text-center text-xs leading-5 text-white/30">
              Your payment details and transaction information are
              handled securely and used only for payment
              verification and account credit activation.
            </p>
          </div>

          {/* Links */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-white/25">
            <a
              href="/privacy"
              className="transition hover:text-white/60"
            >
              Privacy Policy
            </a>

            <span>•</span>

            <a
              href="/terms"
              className="transition hover:text-white/60"
            >
              Terms
            </a>

            <span>•</span>

            <a
              href="/cookies"
              className="transition hover:text-white/60"
            >
              Cookies
            </a>
          </div>

          <p className="mt-7 text-center text-[11px] leading-5 text-white/15">
            PIXZEN uses submitted payment information only for
            processing, verification, account management and
            credit activation.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
          <div className="text-sm text-white/50">
            Loading payment...
          </div>
        </main>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}