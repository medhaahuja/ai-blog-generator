/**
 * Call the Anthropic Claude API.
 *
 * IMPORTANT: For security, we never ship your API key in the GitHub Pages build.
 * - In development (`npm run dev`), we call the API directly from the browser using your local .env key.
 * - In production (GitHub Pages), we disable direct API calls so your key is never exposed.
 */

const API_URL = "/anthropic/v1/messages";
const MODEL   = "claude-haiku-4-5-20251001"; // fast + affordable; swap for claude-sonnet-4-6 for higher quality

const IS_DEV = import.meta.env.DEV;

export async function callClaude(systemPrompt, userPrompt) {
  // In the static GitHub Pages build we do NOT call the API.
  if (!IS_DEV) {
    throw new Error(
      "The live demo on GitHub Pages cannot call Claude directly for security reasons. " +
      "To use AI generation, run the app locally with your Anthropic API key in .env."
    );
  }

  // Development-only: safe to read the key from your local machine.
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY || "";

  if (!apiKey) {
    throw new Error("Missing VITE_ANTHROPIC_API_KEY. Get a key from https://console.anthropic.com/ and add it to your .env file.");
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Claude API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return data.content?.[0]?.text ?? "";
}
