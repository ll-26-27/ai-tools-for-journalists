# ai-tools-for-journalists

AI tools for journalists, from the Bok Center Learning Lab's AI Open Studio (week 4, 2026-10-01, mostly Nieman Fellows). This repo is public.

- **`_context/`**: the Markdown the site renders. Every file is a page at the same path (`_context/guides/setup.md` is `/guides/setup`), and every folder is a page showing its `README.md` above a list of what it holds. `_context/README.md` is the home page's intro. Names starting with `_` or `.` are skipped. Frontmatter (all optional): `title`, `description`, `eyebrow`, `updated`, `order`; a folder README can also set `step: 1` (with `subtitle`, `tool`, `tool_title`, `tool_copy`) to appear as a numbered step on the home page.
- **`_media/`**: gitignored, local only. Captures land here, and anything you drop in shows up on `/live`.
- **`nextjs/`**: the app.

| URL | What |
| --- | --- |
| `/` | The intro from `_context/README.md`, the tools, and a map of everything in `_context/` |
| `/<folder>/<page>` | Any folder or document in `_context/` |
| `/capture` | A camera feed and one big button (or the space bar). Pick what you're capturing: a document, notes or a whiteboard, a scene, or other. Stills save to `_media/<kind>/`; with an OpenRouter key, documents and notes are transcribed and scenes described, and the text is saved beside the still as `<image>.json`. Optionally posts to Slack. |
| `/live` | Everything in `_media/`, newest first, with its description, refreshing every 10 seconds |
| `/print` | Light print versions on Letter: any page or folder (`/print` in front of its address), everything (`/print/all`), or the set named by `print_set:` in `_context/README.md` (`/print/set`) |

In Markdown, a relative image path is a file inside `_context/`; a YouTube link, or a `.mp4` / `.mp3` address, written as an image becomes a player. Relative links between `.md` files work as they do on GitHub.

## Run it

Use Node 22 (`nextjs/.node-version`).

```sh
cd nextjs
pnpm install
pnpm dev
```

Then open the localhost address it prints. Capture needs Chrome on the same machine (camera access requires localhost or HTTPS).

For descriptions and transcriptions, copy `nextjs/.env.example` to `nextjs/.env.local` and set `OPENROUTER_API_KEY` (the model defaults to `anthropic/claude-sonnet-5`; set `OPENROUTER_MODEL` to change it). Slack settings are in the same file. Restart `pnpm dev` after editing it.

Capture and `/live` read and write the local disk, so they are built to run on a laptop. On Vercel (root directory `nextjs`), the docs and `/print` work, but captures can't be saved.

## Where this came from

Created 2026-10-01. The docs side follows the CE 11 workshop app (`ll-26-27/ce11-20260930`): every file and folder under `_context/` gets a page. The capture tool, `/live`, and the light `/print` surface come from `tdm155ai/tdm155ai-week-3`, with the studio stations swapped for kinds of capture and the NAS copy left out. The repo is nested in `ll-26-27/ai-open-studio-week-4` as a submodule.
