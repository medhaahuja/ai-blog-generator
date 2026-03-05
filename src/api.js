/**
 * Call the Anthropic Claude API through a secure backend.
 *
 * The browser never sees your API key:
 * - Frontend sends prompts to `/api/claude`.
 * - The Vercel serverless function holds `ANTHROPIC_API_KEY` and talks to Anthropic.
 */

export async function callClaude(systemPrompt, userPrompt) {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ systemPrompt, userPrompt }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Claude API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return data.content ?? "";
}
