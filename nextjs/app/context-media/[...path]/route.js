import { readFile } from "node:fs/promises";
import path from "node:path";
import { contentRoot as root } from "../../../lib/content.mjs";

export const dynamic = "force-dynamic";

// Images inside _context/ (pictures a document embeds), so Markdown pages can show them.
// Markdown.jsx points relative image links here. Only image types, and nothing outside _context/.
const types = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".gif": "image/gif", ".webp": "image/webp", ".svg": "image/svg+xml" };

export async function GET(request, { params }) {
  const { path: segments } = await params;
  const file = path.resolve(root, ...segments.map(decodeURIComponent));
  const type = types[path.extname(file).toLowerCase()];
  if (!type || !file.startsWith(root + path.sep)) return new Response("Not found", { status: 404 });
  try {
    return new Response(await readFile(/* turbopackIgnore: true */ file), { headers: { "Content-Type": type, "Cache-Control": "no-cache" } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
