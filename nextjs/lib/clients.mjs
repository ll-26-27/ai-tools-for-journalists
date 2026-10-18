// The client list lives in a public Google Sheet ("AI Open Studio clients", tab `clients`), shared as "anyone with
// the link can view", so the app reads it as CSV with no key. Edit the sheet and the site follows within a minute.
// To point at another sheet, set CLIENTS_SHEET_CSV in .env.local to its export URL
// (https://docs.google.com/spreadsheets/d/<ID>/export?format=csv&gid=<GID>).

export const sheetUrl = "https://docs.google.com/spreadsheets/d/1mjKc8DcVh0Jsprh4xumgAUftVXYByHkBr-ju3xuV0Wg/edit";
const defaultCsv = "https://docs.google.com/spreadsheets/d/1mjKc8DcVh0Jsprh4xumgAUftVXYByHkBr-ju3xuV0Wg/export?format=csv&gid=1101396498";

// RFC 4180 CSV: quoted cells can hold commas, quotes ("") and line breaks.
function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (char === '"') quoted = false;
      else cell += char;
    } else if (char === '"') quoted = true;
    else if (char === ",") { row.push(cell); cell = ""; }
    else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += char;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

// Every row with a slug and a client name, in `order`. Columns are read by their header, so new columns are fine.
export async function getClients() {
  const response = await fetch(process.env.CLIENTS_SHEET_CSV || defaultCsv, { next: { revalidate: 60 } });
  if (!response.ok) throw new Error(`Couldn't read the client sheet (HTTP ${response.status}).`);
  const [header = [], ...rows] = parseCsv(await response.text());
  const keys = header.map((key) => key.trim());
  return rows
    .map((row) => Object.fromEntries(keys.map((key, index) => [key, (row[index] || "").trim()])))
    .filter((client) => client.slug && client.client)
    .sort((a, b) => (Number(a.order) || 999) - (Number(b.order) || 999));
}

export async function getClient(slug) {
  return (await getClients()).find((client) => client.slug === slug) || null;
}

// Wikimedia thumbnails come in fixed widths (…/1920px-name.jpg); the grid asks for 960.
export function thumb(url, width = 960) {
  return typeof url === "string" ? url.replace(/\/\d+px-([^/]+)$/, `/${width}px-$1`) : url;
}
