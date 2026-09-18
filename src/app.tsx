import React from "react";

export default function App() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#050816",
        color: "#ffffff",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Navbar */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          width: "100%",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(5,8,22,0.82)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "18px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          {/* Logo */}
          <a
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: "#fff",
              textDecoration: "none",
              fontWeight: 800,
              fontSize: 20,
              letterSpacing: "-0.04em",
            }}
          >
            <img
              src="/pixzen-icon.png"
              alt="PIXZEN"
              width={36}
              height={36}
              style={{
                width: 36,
                height: 36,
                objectFit: "contain",
                borderRadius: 10,
              }}
            />

            <span>PIXZEN</span>
          </a>

          {/* Desktop Navigation */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
            }}
          >
            <a href="/" style={navLink}>
              Home
            </a>

            <a href="/build" style={navLink}>
              Build
            </a>

            <a href="/#services" style={navLink}>
              Services
            </a>

            <a href="/#pricing" style={navLink}>
              Pricing
            </a>

            <a href="/#faq" style={navLink}>
              FAQ
            </a>
          </nav>

          {/* CTA */}
          <a
            href="/build"
            style={{
              textDecoration: "none",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              padding: "11px 18px",
              borderRadius: 12,
              background:
                "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
              boxShadow: "0 10px 30px rgba(37,99,235,0.25)",
            }}
          >
            Start Building
          </a>
        </div>
      </header>

      {/* Hero */}
      <section
        style={{
          position: "relative",
          minHeight: "calc(100vh - 73px)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(circle at 50% 35%, rgba(37,99,235,0.20), transparent 35%), radial-gradient(circle at 80% 60%, rgba(124,58,237,0.15), transparent 30%)",
          }}
        />

        {/* Hero video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.18,
            pointerEvents: "none",
          }}
        >
          <source
            src="https://strvid.nyc3.cdn.digitaloceanspaces.com/motionsite/blue-light-glow.mp4"
            type="video/mp4"
          />
        </video>

        {/* Dark overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(5,8,22,0.45), #050816 92%)",
            pointerEvents: "none",
          }}
        />

        {/* Hero content */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            maxWidth: 1100,
            margin: "0 auto",
            padding: "100px 24px 120px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 14px",
              marginBottom: 26,
              border: "1px solid rgba(96,165,250,0.25)",
              borderRadius: 999,
              background: "rgba(37,99,235,0.08)",
              color: "#93c5fd",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#22c55e",
                boxShadow: "0 0 12px rgba(34,197,94,0.8)",
              }}
            />

            AI-Powered Development
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(48px, 8vw, 92px)",
              lineHeight: 0.98,
              letterSpacing: "-0.065em",
              fontWeight: 900,
            }}
          >
            Build Anything.
            <br />

            <span
              style={{
                background:
                  "linear-gradient(90deg, #60a5fa, #a78bfa, #22d3ee)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              With PIXZEN AI.
            </span>
          </h1>

          <p
            style={{
              maxWidth: 700,
              margin: "28px auto 0",
              color: "rgba(255,255,255,0.58)",
              fontSize: "clamp(16px, 2vw, 20px)",
              lineHeight: 1.7,
            }}
          >
            Turn your ideas into websites, web apps, mobile experiences,
            software and games with an AI-powered development workflow.
          </p>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 14,
              marginTop: 38,
            }}
          >
            <a
              href="/build"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 170,
                padding: "15px 24px",
                borderRadius: 14,
                textDecoration: "none",
                color: "#fff",
                fontWeight: 800,
                background:
                  "linear-gradient(135deg, #2563eb, #7c3aed)",
                boxShadow:
                  "0 18px 50px rgba(37,99,235,0.28)",
              }}
            >
              Start Building →
            </a>

            <a
              href="/#pricing"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 150,
                padding: "15px 24px",
                borderRadius: 14,
                textDecoration: "none",
                color: "#fff",
                fontWeight: 700,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.04)",
              }}
            >
              View Pricing
            </a>
          </div>

          {/* Stats */}
          <div
            style={{
              maxWidth: 760,
              margin: "72px auto 0",
              display: "grid",
              gridTemplateColumns:
                "repeat(3, minmax(0, 1fr))",
              gap: 12,
            }}
          >
            <Stat value="AI" label="Powered Development" />
            <Stat value="24/7" label="Build Workflow" />
            <Stat value="∞" label="Ideas to Explore" />
          </div>
        </div>
      </section>

      {/* Services */}
      <section
        id="services"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "110px 24px",
        }}
      >
        <SectionHeading
          eyebrow="WHAT YOU CAN BUILD"
          title="From idea to working product."
          description="PIXZEN is designed around building real digital products from natural-language instructions."
        />

        <div
          style={{
            marginTop: 50,
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 18,
          }}
        >
          <ServiceCard
            title="Websites"
            description="Landing pages, portfolios, business websites and modern marketing experiences."
          />

          <ServiceCard
            title="Web Apps"
            description="Dashboards, SaaS products, tools, authentication flows and interactive applications."
          />

          <ServiceCard
            title="Mobile Apps"
            description="Build mobile experiences with modern interfaces and scalable application architecture."
          />

          <ServiceCard
            title="Software"
            description="Turn complex workflows and ideas into custom software products."
          />

          <ServiceCard
            title="Games"
            description="Prototype and develop browser-based games and interactive experiences."
          />

          <ServiceCard
            title="UI/UX"
            description="Create polished interfaces with responsive layouts and modern visual systems."
          />
        </div>
      </section>

      {/* How it works */}
      <section
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.015)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "110px 24px",
          }}
        >
          <SectionHeading
            eyebrow="HOW IT WORKS"
            title="Describe it. Build it. Preview it."
            description="A simple workflow for turning an idea into an interactive product."
          />

          <div
            style={{
              marginTop: 50,
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 18,
            }}
          >
            <Step
              number="01"
              title="Describe"
              text="Tell PIXZEN what you want to build in natural language."
            />

            <Step
              number="02"
              title="Generate"
              text="The AI development workflow turns your requirements into code."
            />

            <Step
              number="03"
              title="Preview"
              text="See your generated experience and continue improving it."
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "110px 24px",
        }}
      >
        <SectionHeading
          eyebrow="PRICING"
          title="Choose your PIXZEN mode."
          description="Start with free credits and upgrade when you need more capacity."
        />

        <div
          style={{
            marginTop: 50,
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 18,
          }}
        >
          <PricingCard
            name="Free Mode"
            price="₹0"
            credits="1,000 Credits"
            description="Start experimenting with PIXZEN AI."
            button="Start Free"
            href="/build"
          />

          <PricingCard
            name="Pro Mode"
            price="₹399"
            credits="10,000 Credits"
            description="For larger projects and more AI builds."
            button="Get Pro"
            href="/payment?plan=pro"
            featured
          />

          <PricingCard
            name="Max Mode"
            price="₹999"
            credits="Unlimited Credits"
            description="For intensive AI development workflows."
            button="Get Max"
            href="/payment?plan=max"
          />
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "30px 24px 120px",
        }}
      >
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions."
          description="A few basics about PIXZEN."
        />

        <div style={{ marginTop: 45 }}>
          <Faq
            question="What is PIXZEN?"
            answer="PIXZEN is an AI-powered development platform designed to help turn natural-language ideas into digital products."
          />

          <Faq
            question="Can I start for free?"
            answer="Yes. The Free Mode starts with 1,000 credits."
          />

          <Faq
            question="What happens when my credits run out?"
            answer="You can upgrade your plan when you need additional credits."
          />

          <Faq
            question="Can I preview what I build?"
            answer="Yes. The Build workspace is designed to provide a live preview of generated web experiences."
          />
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          padding: "32px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <img
              src="/pixzen-icon.png"
              alt="PIXZEN"
              width={30}
              height={30}
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
              }}
            />

            <strong>PIXZEN</strong>
          </div>

          <span
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: 13,
            }}
          >
            © {new Date().getFullYear()} PIXZEN. All rights reserved.
          </span>
        </div>
      </footer>
    </main>
  );
}

/* ---------------- Components ---------------- */

function Stat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div
      style={{
        padding: "20px 14px",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.035)",
      }}
    >
      <div
        style={{
          fontSize: 24,
          fontWeight: 900,
        }}
      >
        {value}
      </div>

      <div
        style={{
          marginTop: 5,
          color: "rgba(255,255,255,0.38)",
          fontSize: 12,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          color: "#60a5fa",
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: "0.14em",
        }}
      >
        {eyebrow}
      </div>

      <h2
        style={{
          margin: "14px 0 0",
          fontSize: "clamp(32px, 5vw, 54px)",
          lineHeight: 1.05,
          letterSpacing: "-0.05em",
          fontWeight: 900,
        }}
      >
        {title}
      </h2>

      <p
        style={{
          maxWidth: 650,
          margin: "18px auto 0",
          color: "rgba(255,255,255,0.48)",
          lineHeight: 1.7,
          fontSize: 16,
        }}
      >
        {description}
      </p>
    </div>
  );
}

function ServiceCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      style={{
        minHeight: 190,
        padding: 26,
        borderRadius: 20,
        border: "1px solid rgba(255,255,255,0.08)",
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.055), rgba(255,255,255,0.018))",
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          display: "grid",
          placeItems: "center",
          borderRadius: 12,
          background: "rgba(37,99,235,0.15)",
          border: "1px solid rgba(96,165,250,0.15)",
          color: "#93c5fd",
          fontWeight: 900,
        }}
      >
        ✦
      </div>

      <h3
        style={{
          margin: "22px 0 10px",
          fontSize: 20,
          fontWeight: 800,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: 0,
          color: "rgba(255,255,255,0.45)",
          lineHeight: 1.65,
          fontSize: 14,
        }}
      >
        {description}
      </p>
    </div>
  );
}

function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        padding: 28,
        borderRadius: 20,
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.025)",
      }}
    >
      <div
        style={{
          color: "#60a5fa",
          fontSize: 12,
          fontWeight: 900,
          letterSpacing: "0.12em",
        }}
      >
        {number}
      </div>

      <h3
        style={{
          margin: "16px 0 10px",
          fontSize: 23,
          fontWeight: 850,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: 0,
          color: "rgba(255,255,255,0.45)",
          lineHeight: 1.65,
          fontSize: 14,
        }}
      >
        {text}
      </p>
    </div>
  );
}

function PricingCard({
  name,
  price,
  credits,
  description,
  button,
  href,
  featured = false,
}: {
  name: string;
  price: string;
  credits: string;
  description: string;
  button: string;
  href: string;
  featured?: boolean;
}) {
  return (
    <div
      style={{
        position: "relative",
        padding: 30,
        borderRadius: 22,
        border: featured
          ? "1px solid rgba(96,165,250,0.35)"
          : "1px solid rgba(255,255,255,0.08)",
        background: featured
          ? "linear-gradient(145deg, rgba(37,99,235,0.13), rgba(124,58,237,0.08))"
          : "rgba(255,255,255,0.025)",
      }}
    >
      {featured && (
        <div
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            padding: "5px 9px",
            borderRadius: 999,
            background: "rgba(96,165,250,0.12)",
            color: "#93c5fd",
            fontSize: 10,
            fontWeight: 900,
          }}
        >
          PRO
        </div>
      )}

      <h3
        style={{
          margin: 0,
          fontSize: 21,
          fontWeight: 850,
        }}
      >
        {name}
      </h3>

      <div
        style={{
          marginTop: 24,
          fontSize: 42,
          fontWeight: 900,
          letterSpacing: "-0.05em",
        }}
      >
        {price}
      </div>

      <div
        style={{
          marginTop: 8,
          color: "#93c5fd",
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        {credits}
      </div>

      <p
        style={{
          minHeight: 50,
          margin: "18px 0 24px",
          color: "rgba(255,255,255,0.43)",
          fontSize: 14,
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>

      <a
        href={href}
        style={{
          display: "block",
          textAlign: "center",
          padding: "13px 18px",
          borderRadius: 12,
          color: "#fff",
          textDecoration: "none",
          fontSize: 14,
          fontWeight: 800,
          background: featured
            ? "linear-gradient(135deg, #2563eb, #7c3aed)"
            : "rgba(255,255,255,0.07)",
          border: featured
            ? "none"
            : "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {button}
      </a>
    </div>
  );
}

function Faq({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <details
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "22px 0",
      }}
    >
      <summary
        style={{
          cursor: "pointer",
          fontWeight: 750,
          fontSize: 16,
        }}
      >
        {question}
      </summary>

      <p
        style={{
          margin: "14px 0 0",
          color: "rgba(255,255,255,0.45)",
          lineHeight: 1.7,
          fontSize: 14,
        }}
      >
        {answer}
      </p>
    </details>
  );
}

const navLink: React.CSSProperties = {
  color: "rgba(255,255,255,0.62)",
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 600,
};