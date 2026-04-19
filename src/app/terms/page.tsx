import Link from "next/link";

export const metadata = { title: "Terms — Harold & Crew" };

export default function TermsPage() {
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
        Terms
      </h1>
      <div className="space-y-4" style={{ color: "var(--taupe)", lineHeight: 1.7 }}>
        <p>
          Harold &amp; Crew is a wellness companion. The suggestions Harold
          offers are not medical advice. If you&rsquo;re dealing with anything
          serious — physical, mental, or emotional — please reach out to a
          qualified professional.
        </p>
        <p>
          By using the app you agree not to misuse it (no scraping, no
          automated abuse, no impersonating other users) and accept that
          Harold can occasionally be wrong. Be kind to yourself if he is.
        </p>
        <p>
          Questions or feedback go to{" "}
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
