import Link from "next/link";
import { site } from "../../lib/content.mjs";

// The four parts of the site. `current` marks the one you're in.
export const sections = [
  { key: "capture", href: "/capture", title: "Capture" },
  { key: "clients", href: "/clients", title: "Clients" },
  { key: "shotlist", href: "/shotlist", title: "Shot list" },
  { key: "docs", href: "/docs", title: "Docs" },
];

export function SiteHeader({ current = "" }) {
  return (
    <header className="site-header">
      <Link className="wordmark" href="/">
        {site.title} <span>{site.label}</span>
      </Link>
      <nav aria-label="Main navigation">
        {sections.map((section) => <Link key={section.key} href={section.href} aria-current={current === section.key ? "page" : undefined}>{section.title}</Link>)}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link href="/">{site.title}</Link>
      <span className="footer-links"><Link href="/live">Live</Link><Link href="/print">Printables</Link></span>
      <span>{site.term}</span>
    </footer>
  );
}
