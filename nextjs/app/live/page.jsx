import { listMedia } from "../../lib/media.mjs";
import { SiteFooter, SiteHeader } from "../components/Chrome.jsx";
import AutoRefresh from "./AutoRefresh.jsx";
import Gallery from "./Gallery.jsx";

// Read _media/ on every request; the client component above refreshes it on a timer.
export const dynamic = "force-dynamic";

export const metadata = { title: "Live" };

export default async function LivePage() {
  const { items, skipped } = await listMedia();
  const images = items.filter((item) => item.type === "image").length;
  const videos = items.length - images;

  return (
    <>
      <SiteHeader current="live" />
      <main id="main" className="live-main">
        <header className="article-heading live-heading">
          <p className="eyebrow">Live</p>
          <h1>Captured on this machine</h1>
          <p className="lede">Stills from <a className="inline-link" href="/capture">/capture</a> and anything else in <code>_media/</code>, newest first. {items.length ? `${images} image${images === 1 ? "" : "s"}${videos ? ` and ${videos} clip${videos === 1 ? "" : "s"}` : ""}.` : "Nothing yet."}</p>
          <AutoRefresh seconds={10} />
        </header>
        {skipped > 0 && <p className="live-note">{skipped} file{skipped === 1 ? "" : "s"} skipped: HEIC and RAW can't be shown in a browser. Export as JPEG or PNG.</p>}
        {items.length === 0 ? (
          <section className="live-empty">
            <p className="eyebrow">Empty</p>
            <p>Take a still on <a className="inline-link" href="/capture">/capture</a>, or drop images or clips into <code>_media/</code> at the root of this repo. They appear here within a few seconds; subfolders are fine.</p>
          </section>
        ) : (
          <Gallery items={items} />
        )}
      </main>
      <SiteFooter />
    </>
  );
}
