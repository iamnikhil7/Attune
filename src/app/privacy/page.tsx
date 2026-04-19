import Link from "next/link";

export const metadata = { title: "Privacy — Harold & Crew" };

export default function PrivacyPage() {
  return (
    <article
      className="min-h-full px-6 py-16 mx-auto"
      style={{ maxWidth: "640px", color: "var(--foreground)" }}
    >
      <Link
        href="/"
        className="text-xs"
        style={{ color: "var(--muted-soft)" }}
      >
        ← Harold &amp; Crew
      </Link>
      <h1
        className="mt-6 mb-6"
        style={{
          fontFamily: '"Cormorant Garamond", serif',
          fontStyle: "italic",
          fontWeight: 600,
          fontSize: "2.25rem",
          color: "#2C2418",
        }}
      >
        Privacy
      </h1>
      <div className="space-y-4" style={{ color: "var(--taupe)", lineHeight: 1.7 }}>
        <p>
          Harold &amp; Crew stores the minimum data needed to give you a
          personal experience: the answers to your onboarding quiz, the
          activities you join, and the messages you exchange with Harold.
        </p>
        <p>
          We never sell your data. We do not share your conversations with
          third parties. You can delete your chat history at any time from the
          Harold tab.
        </p>
        <p>
          For questions, write to{" "}
          <a
            href="mailto:hello@haroldcrew.com"
            style={{ color: "var(--accent)" }}
          >
            hello@haroldcrew.com
          </a>
          .
        </p>
      </div>
    </article>
  );
}
