"use client";

import Link from "next/link";
import { ArrowLeft, Cookie } from "lucide-react";

export default function CookiesPage() {
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
            <Cookie size={14} />
            PIXZEN Cookies
          </div>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Cookie Policy
          </h1>

          <p className="mt-4 text-sm text-white/45">
            Last updated: September 2026
          </p>
        </div>

        <div className="space-y-8 rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-10">
          <section>
            <h2 className="text-xl font-semibold">1. What Are Cookies?</h2>
            <p className="mt-3 leading-7 text-white/60">
              Cookies are small pieces of information stored by a website or
              related technologies on your device. They can help websites
              remember sessions, preferences, and other information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">2. How PIXZEN May Use Cookies</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 leading-7 text-white/60">
              <li>Maintaining authentication sessions.</li>
              <li>Remembering certain user preferences.</li>
              <li>Protecting account and platform security.</li>
              <li>Understanding basic service usage.</li>
              <li>Supporting analytics where enabled.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">3. Authentication Storage</h2>
            <p className="mt-3 leading-7 text-white/60">
              PIXZEN may use browser storage or authentication mechanisms
              provided by its authentication infrastructure to keep users
              signed in. These mechanisms are used to maintain the account
              session and are not intended to store your password in readable
              form.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">4. Analytics</h2>
            <p className="mt-3 leading-7 text-white/60">
              If analytics services are enabled, they may use cookies or
              similar technologies to provide aggregated information about
              website usage. The exact analytics services used by PIXZEN
              should be listed here before production launch.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">5. Third-Party Services</h2>
            <p className="mt-3 leading-7 text-white/60">
              PIXZEN may integrate third-party services such as authentication,
              payment, analytics, AI, hosting, or content-delivery providers.
              Those services may use their own cookies or similar technologies
              according to their respective policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">6. Managing Cookies</h2>
            <p className="mt-3 leading-7 text-white/60">
              Most modern browsers allow you to control or delete cookies
              through browser settings. Disabling certain storage mechanisms
              may affect authentication or other PIXZEN functionality.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">7. Changes</h2>
            <p className="mt-3 leading-7 text-white/60">
              This Cookie Policy may be updated when PIXZEN changes its
              technology, integrations, or privacy practices.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">8. Contact</h2>
            <p className="mt-3 leading-7 text-white/60">
              For questions about cookies or privacy, contact PIXZEN through
              the official support contact published on the platform.
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