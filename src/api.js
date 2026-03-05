/**
 * Call the Anthropic Claude API.
 *
 * Get your API key from: https://console.anthropic.com/
 * Set it in .env as VITE_ANTHROPIC_API_KEY
 */

const API_URL = "/anthropic/v1/messages";
const MODEL   = "claude-haiku-4-5-20251001"; // fast + affordable; swap for claude-sonnet-4-6 for higher quality

export async function callClaude(systemPrompt, userPrompt) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY || "";

  if (!apiKey) {
    throw new Error("Missing VITE_ANTHROPIC_API_KEY. Get a key from https://console.anthropic.com/");
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
