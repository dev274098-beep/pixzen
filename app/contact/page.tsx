"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Mail,
  MessageSquare,
  Send,
} from "lucide-react";

export default function ContactPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#02040a] text-white">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute left-[20%] top-[-10%] h-[550px] w-[550px] rounded-full bg-cyan-500/[.10] blur-[130px]" />
        <div className="absolute right-[-10%] top-[25%] h-[600px] w-[600px] rounded-full bg-purple-600/[.10] blur-[140px]" />
      </div>

      {/* Header */}
      <header className="relative z-20 p-5 sm:p-7">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <img
              src="/pixzen-icon.png"
              alt="PIXZEN"
              className="h-12 w-12 object-contain"
            />

            <span className="text-sm font-bold tracking-[.2em] text-white">
              PIXZEN
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/55 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <section className="relative z-10 px-5 pb-20 pt-10 sm:px-8 sm:pt-16">
        <div className="mx-auto max-w-7xl">
          {/* Heading */}
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[.06] px-4 py-2 text-xs font-semibold text-cyan-300">
              <MessageSquare size={14} />
              Let's talk
            </div>

            <h1 className="text-5xl font-black tracking-[-.055em] sm:text-6xl md:text-7xl">
              Have an idea?
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Let's build it.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/45 sm:text-lg">
              Tell us what you're building, what you need, or simply say
              hello. The PIXZEN team would love to hear from you.
            </p>
          </div>

          {/* Grid */}
          <div className="mt-16 grid gap-8 lg:grid-cols-[.75fr_1.25fr]">
            {/* Contact info */}
            <div className="space-y-4">
              <div
                className="rounded-3xl border border-white/[.10] p-7"
                style={{
                  background: "rgba(8,13,25,.72)",
                  backdropFilter: "blur(25px)",
                  WebkitBackdropFilter: "blur(25px)",
                }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/[.07]">
                  <Mail size={21} className="text-cyan-300" />
                </div>

                <h3 className="mt-6 text-lg font-bold">
                  Email us
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/40">
                  For general questions, partnerships, and project
                  discussions.
                </p>

                <a
                  href="mailto:hello@pixzen.ai"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
                >
                  hello@pixzen.ai
                  <ArrowRight size={14} />
                </a>
              </div>

              <div
                className="rounded-3xl border border-white/[.10] p-7"
                style={{
                  background: "rgba(8,13,25,.72)",
                  backdropFilter: "blur(25px)",
                  WebkitBackdropFilter: "blur(25px)",
                }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-400/[.07]">
                  <Clock size={21} className="text-purple-300" />
                </div>

                <h3 className="mt-6 text-lg font-bold">
                  Response time
                </h3>

                <p className="mt-2 text-sm leading-6 text-white/40">
                  We aim to respond to every message as quickly as possible.
                </p>

                <div className="mt-5 text-sm font-semibold text-white/70">
                  Usually within 24–48 hours
                </div>
              </div>
            </div>

            {/* Form */}
            <div
              className="rounded-3xl border border-white/[.12] p-7 sm:p-9"
              style={{
                background: "rgba(7,12,24,.78)",
                backdropFilter: "blur(30px)",
                WebkitBackdropFilter: "blur(30px)",
                boxShadow:
                  "0 30px 100px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.07)",
              }}
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold">
                  Send us a message
                </h2>

                <p className="mt-2 text-sm text-white/40">
                  Fill out the form and we'll get back to you.
                </p>
              </div>

              <form className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-white/70">
                      Your name
                    </label>

                    <input
                      type="text"
                      placeholder="John Doe"
                      className="h-13 w-full rounded-xl border border-white/[.10] bg-white/[.04] px-4 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-cyan-400/50"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-white/70">
                      Email
                    </label>

                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="h-13 w-full rounded-xl border border-white/[.10] bg-white/[.04] px-4 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-cyan-400/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-white/70">
                    Subject
                  </label>

                  <input
                    type="text"
                    placeholder="How can PIXZEN help?"
                    className="h-13 w-full rounded-xl border border-white/[.10] bg-white/[.04] px-4 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-cyan-400/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-white/70">
                    Message
                  </label>

                  <textarea
                    rows={6}
                    placeholder="Tell us about your idea..."
                    className="w-full resize-none rounded-xl border border-white/[.10] bg-white/[.04] px-4 py-4 text-sm leading-6 text-white outline-none placeholder:text-white/25 transition focus:border-cyan-400/50"
                  />
                </div>

                <button
                  type="submit"
                  className="group flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-sm font-bold text-white shadow-[0_0_30px_rgba(37,99,235,.22)] transition hover:-translate-y-0.5"
                >
                  Send message
                  <Send
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </form>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
            >
              Ready to start building?
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}