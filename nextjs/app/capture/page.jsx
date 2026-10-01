import { stations } from "../../lib/capture.mjs";
import { SiteHeader } from "../components/Chrome.jsx";
import CaptureClient from "./CaptureClient.jsx";

export const dynamic = "force-dynamic";

export const metadata = { title: "Capture" };

// /capture?kind=document (or notes, scene). The feed comes from whatever camera the browser can see: the laptop's
// own, a phone through Continuity Camera, or a document camera over USB.
export default async function CapturePage({ searchParams }) {
  const { kind } = await searchParams;
  const initial = Object.hasOwn(stations, kind || "") ? kind : "document";

  return (
    <>
      <SiteHeader current="capture" />
      <main id="main" className="capture-main">
        <CaptureClient stations={stations} initialStation={initial} />
      </main>
    </>
  );
}
