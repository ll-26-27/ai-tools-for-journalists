// A description of each capture from a vision model on OpenRouter (OPENROUTER_API_KEY, OPENROUTER_MODEL in
// .env.local). Each kind of capture (lib/capture.mjs) has its own prompt: documents and notes are transcribed,
// scenes are described the way a reporter would write them into a notebook.

export const defaultModel = "anthropic/claude-sonnet-5";

const common = "No preamble, no praise, no hedging, and don't guess who anyone is.";

const prompts = {
  document: "This is a photo of a document, a screen, or a sign, taken by a journalist. Transcribe its text exactly, keeping the line breaks and headings that matter; mark anything you can't read as [illegible]. Then, on a last line starting \"What it is:\", say in one sentence what kind of document it appears to be.",
  notes: "This is a photo of handwritten notes, a notebook page, or a whiteboard, taken by a journalist. Transcribe the writing as faithfully as you can, keeping lists and arrows as plain text; mark anything you can't read as [illegible].",
  scene: "This still was taken by a journalist as a visual note. Describe what is in the frame in two to four plain, factual sentences a reporter could check: the setting, what people are doing, any visible text or signage, and the light and time of day if they show.",
  other: "This still was taken by a journalist. Say what is in the frame in two or three plain sentences, transcribing any visible text.",
};

export async function describeImage(bytes, station, { apiKey, model }) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "X-Title": "ai-tools-for-journalists capture" },
    body: JSON.stringify({
      model: model || defaultModel,
      max_tokens: 1500,
      messages: [{
        role: "user",
        content: [
          { type: "text", text: `${prompts[station] || prompts.other} ${common}` },
          { type: "image_url", image_url: { url: `data:image/jpeg;base64,${Buffer.from(bytes).toString("base64")}` } },
        ],
      }],
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error?.message || `HTTP ${response.status}`);
  const text = data.choices?.[0]?.message?.content;
  const description = (Array.isArray(text) ? text.map((part) => part.text || "").join("") : text || "").trim();
  if (!description) throw new Error("empty description");
  return description;
}
