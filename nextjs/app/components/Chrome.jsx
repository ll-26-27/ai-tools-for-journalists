import Link from "next/link";
import { site } from "../../lib/content.mjs";

// `current` marks the tool page you're on: "capture", "live", or nothing.
export function SiteHeader({ current = "" }) {
  return (
    <header className="site-header">
      <Link className="wordmark" href="/">
        {site.title} <span>{site.label}</span>
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/#docs">Docs</Link>
        <Link href="/capture" aria-current={current === "capture" ? "page" : undefined}>Capture</Link>
        <Link href="/live" aria-current={current === "live" ? "page" : undefined}>Live</Link>
        <Link href="/print">Print</Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link href="/">{site.title}</Link>
      <Link href="/print">Printables</Link>
      <span>{site.term}</span>
    </footer>
  );
}
