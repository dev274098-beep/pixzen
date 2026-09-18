"use client";

import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-sm text-white/55 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to PIXZEN
        </Link>

        <div className="mb-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-white/60">
            <FileText size={14} />
            PIXZEN Terms
          </div>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Terms of Service
          </h1>

          <p className="mt-4 text-sm text-white/45">
            Last updated: September 2026
          </p>
        </div>

        <div className="space-y-8 rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-10">
          <section>
            <h2 className="text-xl font-semibold">1. Acceptance</h2>
            <p className="mt-3 leading-7 text-white/60">
              By accessing or using PIXZEN, you agree to follow these Terms of
              Service and any applicable laws and regulations. If you do not
              agree with these terms, you should not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">2. PIXZEN Service</h2>
            <p className="mt-3 leading-7 text-white/60">
              PIXZEN provides AI-assisted software creation, code generation,
              project management, and related digital services. Features,
              models, limits, pricing, and availability may change over time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">3. Account</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 leading-7 text-white/60">
              <li>You are responsible for maintaining your account security.</li>
              <li>You should provide accurate account information.</li>
              <li>You should not share account credentials with unauthorized users.</li>
              <li>You are responsible for activity performed through your account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">4. AI-Generated Content</h2>
            <p className="mt-3 leading-7 text-white/60">
              AI-generated code, text, designs, and other outputs may contain
              errors, omissions, security issues, or unexpected behavior.
              Generated output should be reviewed and tested before being used
              in production or safety-critical environments.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">5. Credits and Plans</h2>
            <p className="mt-3 leading-7 text-white/60">
              PIXZEN may use credits to measure AI usage. Credit amounts,
              pricing, plan features, and usage costs are displayed by PIXZEN
              and may change. Credits are not automatically guaranteed to have
              monetary value unless expressly stated by the applicable
              purchase terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">6. Payments</h2>
            <p className="mt-3 leading-7 text-white/60">
              Paid plans require successful payment verification before paid
              benefits or credits are activated. Submitting payment information
              or clicking a payment-confirmation button does not by itself
              guarantee activation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">7. Prohibited Use</h2>
            <p className="mt-3 leading-7 text-white/60">
              You must not use PIXZEN to violate applicable laws, distribute
              malware, attack systems without authorization, infringe another
              person's rights, conduct fraud, or otherwise abuse the platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">8. Intellectual Property</h2>
            <p className="mt-3 leading-7 text-white/60">
              PIXZEN's branding, interface, software, documentation, and
              platform technology may be protected by applicable intellectual
              property laws. Users should ensure that generated or uploaded
              content does not infringe third-party rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">9. Availability</h2>
            <p className="mt-3 leading-7 text-white/60">
              PIXZEN may experience downtime, maintenance, provider outages,
              model availability limitations, or other interruptions. No
              uninterrupted availability is guaranteed.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">10. Disclaimer</h2>
            <p className="mt-3 leading-7 text-white/60">
              PIXZEN is provided on an as-available basis. AI output should not
              be relied upon as a substitute for professional review where
              accuracy, security, financial impact, legal compliance, or safety
              is important.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">11. Changes</h2>
            <p className="mt-3 leading-7 text-white/60">
              These Terms may be updated as the service changes. Continued use
              after an updated version becomes effective may be subject to the
              revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">12. Contact</h2>
            <p className="mt-3 leading-7 text-white/60">
              For questions regarding these Terms, contact PIXZEN through the
              official support contact published on the platform.
            </p>
          </section>
        </div>

        <FooterLinks />
      </div>
    </main>
  );
}

function FooterLinks() {
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-white/35">
      <Link href="/privacy" className="hover:text-white">
        Privacy Policy
      </Link>
      <Link href="/terms" className="hover:text-white">
        Terms
      </Link>
      <Link href="/cookies" className="hover:text-white">
        Cookies
      </Link>
      <Link href="/" className="hover:text-white">
        Home
      </Link>
    </div>
  );
}