"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
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
            <ShieldCheck size={14} />
            PIXZEN Privacy Policy
          </div>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Privacy Policy
          </h1>

          <p className="mt-4 text-sm text-white/45">
            Last updated: September 2026
          </p>
        </div>

        <div className="space-y-8 rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-10">
          <section>
            <h2 className="text-xl font-semibold">1. Overview</h2>
            <p className="mt-3 leading-7 text-white/60">
              PIXZEN is an AI-powered software development and creation
              platform. This Privacy Policy explains what information may be
              collected when you use PIXZEN and how that information may be
              used to provide, maintain, secure, and improve the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">2. Information We May Collect</h2>
            <div className="mt-3 space-y-3 leading-7 text-white/60">
              <p>
                <strong className="text-white/80">Account information:</strong>{" "}
                email address, display name, authentication information, and
                account-related settings.
              </p>
              <p>
                <strong className="text-white/80">Project information:</strong>{" "}
                prompts, project instructions, generated code, project files,
                and related project data submitted through the platform.
              </p>
              <p>
                <strong className="text-white/80">Usage information:</strong>{" "}
                information such as feature usage, credit usage, error
                information, and technical information needed to operate the
                service.
              </p>
              <p>
                <strong className="text-white/80">Payment information:</strong>{" "}
                payment or transaction information that you voluntarily submit
                when purchasing a paid plan. Payment processing may involve
                third-party payment or banking services.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold">3. How Information Is Used</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 leading-7 text-white/60">
              <li>To create and manage your PIXZEN account.</li>
              <li>To provide AI generation and software-building features.</li>
              <li>To store and manage projects and credits.</li>
              <li>To process and verify payments where applicable.</li>
              <li>To maintain platform security and prevent abuse.</li>
              <li>To troubleshoot technical problems.</li>
              <li>To improve the reliability and functionality of PIXZEN.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">4. AI Providers</h2>
            <p className="mt-3 leading-7 text-white/60">
              Depending on the feature and configuration, prompts or related
              request data may be processed by third-party AI infrastructure
              providers used by PIXZEN. PIXZEN should only send information
              necessary to provide the requested feature and should not be
              treated as a place to submit highly sensitive personal
              information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">5. Data Security</h2>
            <p className="mt-3 leading-7 text-white/60">
              PIXZEN uses reasonable technical and organizational measures to
              protect information. However, no internet-based service can
              guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">6. Data Retention</h2>
            <p className="mt-3 leading-7 text-white/60">
              Information may be retained for as long as reasonably necessary
              to provide the service, maintain account records, comply with
              applicable requirements, resolve disputes, and maintain security.
              Actual retention periods should be defined by the PIXZEN
              operator's production data-retention policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">7. Your Choices</h2>
            <p className="mt-3 leading-7 text-white/60">
              Depending on the features available in your account, you may be
              able to update account information, manage projects, or request
              deletion of your account and associated data. Requests should be
              handled according to PIXZEN's actual account and deletion
              procedures.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">8. Children's Privacy</h2>
            <p className="mt-3 leading-7 text-white/60">
              PIXZEN should not knowingly collect personal information from
              children where doing so is prohibited by applicable law.
              Appropriate age requirements and parental-consent procedures
              should be configured before production launch.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">9. Changes</h2>
            <p className="mt-3 leading-7 text-white/60">
              This policy may be updated when PIXZEN's features, infrastructure,
              or legal requirements change. The updated version should include
              a new effective date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">10. Contact</h2>
            <p className="mt-3 leading-7 text-white/60">
              For privacy-related questions, use the official PIXZEN support
              contact published on the platform.
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