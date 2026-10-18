import Link from "next/link";
import { getClients } from "../lib/clients.mjs";
import { getEntry, getRoot, site } from "../lib/content.mjs";
import ClientGrid from "./components/ClientGrid.jsx";
import { SiteFooter, SiteHeader } from "./components/Chrome.jsx";
import Markdown from "./components/Markdown.jsx";

// The home page: the intro from _context/README.md, the four parts of the site, a few clients, and the docs.
export default async function Home() {
  const [root, docs, shotlist, clients] = await Promise.all([
    getRoot(),
    getEntry(["docs"]).then((found) => found?.entry),
    getEntry(["shotlist"]).then((found) => found?.entry),
    getClients().catch(() => []),
  ]);
  const count = (folder) => folder?.count || 0;
  const parts = [
    { href: "/capture", title: "Capture", copy: "The live camera: stills of documents, notes, and scenes, each transcribed or described, landing on this machine." },
    { href: "/clients", title: "Clients", copy: clients.length ? `${clients.length} clients, read live from a Google Sheet.` : "The client list, read live from a Google Sheet." },
    { href: "/shotlist", title: "Shot list", copy: shotlist?.description || `What to capture. ${count(shotlist) ? `${count(shotlist)} documents.` : "Coming soon."}` },
    { href: "/docs", title: "Docs", copy: docs?.description || `Guides and references, from the docs folder. ${count(docs) ? `${count(docs)} documents.` : "Coming soon."}` },
  ];

  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="hero hero-compact" aria-labelledby="site-title">
          <p className="eyebrow">{site.label} · {site.term}</p>
          <h1 id="site-title">{root.title === "Home" ? site.title : root.title}</h1>
          {root.description && <p className="hero-deck">{root.description}</p>}
          {root.content.trim() && <article className="prose hero-intro"><Markdown doc={root} /></article>}
        </section>

        <section className="tools" aria-label="The parts of the site">
          {parts.map((part) => (
            <Link href={part.href} className="tool-card" key={part.href}>
              <span className="eyebrow">{part.href}</span>
              <strong>{part.title} <span aria-hidden="true">→</span></strong>
              <span>{part.copy}</span>
            </Link>
          ))}
        </section>

        {clients.length > 0 && (
          <section className="home-band" aria-labelledby="clients-title">
            <header className="band-heading">
              <h2 id="clients-title">Clients</h2>
              <Link className="inline-link" href="/clients">All {clients.length} →</Link>
            </header>
            <ClientGrid clients={clients.slice(0, 6)} />
          </section>
        )}

        {docs && docs.count > 0 && (
          <section className="home-band" aria-labelledby="docs-title">
            <header className="band-heading">
              <h2 id="docs-title">Docs</h2>
              <Link className="inline-link" href="/docs">All docs →</Link>
            </header>
            <ul className="context-map">
              {[...docs.docs, ...docs.folders].map((item) => (
                <li key={item.slug}>
                  <Link href={item.href} className="context-row">
                    <strong>{item.title}</strong>
                    <span className="context-count">{item.kind === "folder" ? `${item.count} docs` : item.eyebrow === docs.title ? "" : item.eyebrow}</span>
                    {item.description && <span className="context-note">{item.description}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
