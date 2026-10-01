import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export const site = {
  title: "AI tools for journalists",
  label: "AI Open Studio",
  term: "Fall 2026 · Bok Center Learning Lab",
};

// Every Markdown file under the repo's _context/ (one level above this app) is a page at the same path:
// _context/a/b.md → /a/b. Every folder is a page too (/a), showing its README.md, if any, above a list of what it
// holds. _context/README.md is the home page's intro. Names starting with "_" or "." are skipped.
export const contentRoot = path.join(process.cwd(), "..", "_context");

function titleFromSlug(slug) {
  return slug
    .replace(/^\d{1,2}[-_](?=\D)/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function number(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function hrefFor(slug) {
  return slug ? `/${slug.split("/").map(encodeURIComponent).join("/")}` : "/";
}

function byOrder(a, b) {
  return a.order - b.order || a.title.localeCompare(b.title, undefined, { numeric: true });
}

async function parse(file) {
  const raw = await readFile(/* turbopackIgnore: true */ file, "utf8");
  const { data, content } = matter(raw);
  const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim();
  return { data, content, heading };
}

async function readFolder(dir, slug, parentTitle) {
  let entries = [];
  try {
    entries = await readdir(/* turbopackIgnore: true */ dir, { withFileTypes: true });
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  const readme = entries.find((entry) => entry.isFile() && /^readme\.md$/i.test(entry.name));
  const intro = readme ? await parse(path.join(dir, readme.name)) : { data: {}, content: "", heading: "" };
  const folder = {
    kind: "folder",
    slug,
    dir: slug,
    href: hrefFor(slug),
    title: typeof intro.data.title === "string" ? intro.data.title : intro.heading || titleFromSlug(slug.split("/").pop() || "Home"),
    description: typeof intro.data.description === "string" ? intro.data.description : "",
    eyebrow: typeof intro.data.eyebrow === "string" ? intro.data.eyebrow : parentTitle || "Folder",
    order: number(intro.data.order, 999),
    // A step on the home page (`step: 1`), and the tool its page leads with (`tool: /capture`, `tool_title`, `tool_copy`).
    step: number(intro.data.step, 0),
    subtitle: typeof intro.data.subtitle === "string" ? intro.data.subtitle : "",
    tool: typeof intro.data.tool === "string" ? intro.data.tool : "",
    toolTitle: typeof intro.data.tool_title === "string" ? intro.data.tool_title : "",
    toolCopy: typeof intro.data.tool_copy === "string" ? intro.data.tool_copy : "",
    content: intro.content,
    data: intro.data,
    docs: [],
    folders: [],
  };

  for (const entry of entries) {
    if (entry.name.startsWith("_") || entry.name.startsWith(".") || entry === readme) continue;
    const childSlug = slug ? `${slug}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      folder.folders.push(await readFolder(path.join(dir, entry.name), childSlug, slug ? folder.title : ""));
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    const docSlug = childSlug.slice(0, -3);
    const { data, content, heading } = await parse(path.join(dir, entry.name));
    folder.docs.push({
      kind: "doc",
      slug: docSlug,
      dir: slug,
      href: hrefFor(docSlug),
      title: typeof data.title === "string" ? data.title : heading || titleFromSlug(entry.name.slice(0, -3)),
      description: typeof data.description === "string" ? data.description : "",
      eyebrow: typeof data.eyebrow === "string" ? data.eyebrow : slug ? folder.title : "Working document",
      updated: typeof data.updated === "string" ? data.updated : "",
      order: number(data.order, 999),
      content,
      data,
    });
  }

  folder.docs.sort(byOrder);
  folder.folders.sort(byOrder);
  folder.count = folder.docs.length + folder.folders.reduce((sum, child) => sum + child.count, 0);
  return folder;
}

export async function getRoot() {
  return readFolder(contentRoot, "", "");
}

function flatten(folder, out = []) {
  if (folder.slug) out.push(folder);
  out.push(...folder.docs);
  for (const child of folder.folders) flatten(child, out);
  return out;
}

export async function getEntries() {
  return flatten(await getRoot());
}

// The entry at a path, the folders above it (for breadcrumbs), and the documents beside it (for the pager).
export async function getEntry(segments) {
  const parts = segments.map((segment) => decodeURIComponent(segment));
  let folder = await getRoot();
  const trail = [];
  for (let i = 0; i < parts.length; i++) {
    const slug = parts.slice(0, i + 1).join("/");
    const last = i === parts.length - 1;
    const child = folder.folders.find((entry) => entry.slug === slug);
    if (child && last) return { entry: child, trail, siblings: [] };
    if (child) {
      trail.push(child);
      folder = child;
      continue;
    }
    const doc = last && folder.docs.find((entry) => entry.slug === slug);
    return doc ? { entry: doc, trail, siblings: folder.docs } : null;
  }
  return null;
}

// Relative links resolve from the linking document's folder, so links written for GitHub or Obsidian work here too.
export function resolveMarkdownHref(href, dir = "") {
  if (!href) return "#";
  if (/^(?:[a-z][a-z0-9+.-]*:|#|\/)/i.test(href)) return href;
  const [pathname, hash = ""] = href.split("#");
  let target = path.posix.normalize(path.posix.join(dir, decodeURIComponent(pathname)));
  target = target.replace(/\.md$/i, "").replace(/(?:^|\/)readme$/i, "").replace(/\/$/, "");
  if (target === "." || target.startsWith("..")) target = "";
  return `${hrefFor(target)}${hash ? `#${hash}` : ""}`;
}
