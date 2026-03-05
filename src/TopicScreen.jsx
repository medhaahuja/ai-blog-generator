import React, { useState, useEffect, useRef, useCallback } from "react";
import { T, currentMonth, currentSeason } from "./constants";
import { callClaude } from "./api";

// ── Helper: robustly parse JSON array from model output ──
function parseJsonArrayFromModel(raw) {
  if (!raw || typeof raw !== "string") {
    throw new Error("Empty response from model");
  }

  const unfenced = raw.replace(/```json\s*/gi, "").replace(/```/g, "").trim();

  try {
    const parsed = JSON.parse(unfenced);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // fall through to bracket extraction
  }

  const start = unfenced.indexOf("[");
  const end   = unfenced.lastIndexOf("]");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Could not find JSON array in model response.");
  }
  const candidate = unfenced.slice(start, end + 1);
  const parsed = JSON.parse(candidate);
  if (!Array.isArray(parsed)) {
    throw new Error("Model response did not contain a JSON array.");
  }
  return parsed;
}

export default function TopicScreen({ profile, onSelect, loading, setLoading }) {
  const [topics, setTopics]           = useState([]);
  const [customTopic, setCustomTopic] = useState("");
  const [error, setError]             = useState("");
  const fetched = useRef(false);

  const fetchTopics = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const sys = `You are an SEO content strategist specializing in the US beauty and wellness industry. You deeply understand local search behavior, seasonal trends, and what content drives bookings for small businesses. Return ONLY valid JSON, no markdown fences, no preamble, no explanation.`;
      const prompt = `Generate 5 blog topic suggestions for this business:
- Business: ${profile.businessName} (${profile.businessType})
- Location: ${profile.location || "US-based"}
- Services: ${profile.services.join(", ") || "General services"}
- Unique angle: ${profile.unique || "None specified"}
- Client type: ${profile.clientType || "General"}
- Current month: ${currentMonth}, Season: ${currentSeason}

Return a JSON array of exactly 5 objects with:
- "title": compelling blog title (include location if provided)
- "category": one of "trending", "low-competition", "client-questions", "seasonal", "educational"
- "searchVolume": "High" | "Medium" | "Low"
- "competition": "High" | "Medium" | "Low"
- "rationale": 1-sentence reason this topic is worth writing about
- "recommendedFormat": "how-to" | "listicle" | "faq" | "explainer" | "seasonal"

Mix categories. Include at least one seasonal (${currentSeason}) and one question-based topic. Return ONLY the JSON array.`;

      const raw = await callClaude(sys, prompt);
      const parsed = parseJsonArrayFromModel(raw);
      setTopics(parsed);
    } catch (e) {
      setError(e.message || "Couldn't generate topics. Please try again.");
      console.error("Error generating topics:", e);
    }
    setLoading(false);
  }, [profile, setLoading]);

  useEffect(() => {
    if (!fetched.current) { fetched.current = true; fetchTopics(); }
  }, [fetchTopics]);

  const volColor = (v) => v === "High" ? T.green : v === "Medium" ? T.warm : T.textTertiary;
  const compColor = (c) => c === "Low" ? T.green : c === "Medium" ? T.warm : T.danger;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, animation: "fadeIn 0.3s ease" }}>

      {/* Header */}
      <div>
        <h2 style={{
          fontFamily: T.font, fontSize: 24, fontWeight: 700, color: T.text,
          margin: 0, letterSpacing: "-0.3px",
        }}>
          Choose your topic
        </h2>
        <p style={{ fontFamily: T.fontSans, fontSize: 13, color: T.textSecondary, marginTop: 6 }}>
          AI-curated for {profile.businessType}
          {profile.location ? ` in ${profile.location}` : ""} · {currentMonth}
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ padding: "64px 0", textAlign: "center" }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%", margin: "0 auto 16px",
            border: `2px solid ${T.border}`, borderTopColor: T.accent,
            animation: "spin 0.9s linear infinite",
          }} />
          <div style={{ fontFamily: T.fontSans, fontSize: 13, color: T.textSecondary }}>
            Analyzing trends for {profile.businessType.toLowerCase()}s…
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          padding: "14px 18px", background: T.dangerLight,
          border: `1px solid ${T.danger}33`, borderRadius: T.radius,
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        }}>
          <span style={{ fontFamily: T.fontSans, fontSize: 13, color: T.danger }}>{error}</span>
          <button onClick={() => { fetched.current = false; fetchTopics(); }} style={{
            background: "none", border: "none", color: T.danger, fontFamily: T.fontSans,
            fontSize: 12, fontWeight: 600, cursor: "pointer", textDecoration: "underline", flexShrink: 0,
          }}>Retry</button>
        </div>
      )}

      {/* Topic cards */}
      {!loading && topics.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {topics.map((topic, i) => {
            const isRecommended = i === 0;
            return (
              <button key={i} onClick={() => onSelect(topic)} style={{
                textAlign: "left",
                background: isRecommended ? T.accentLight : T.surface,
                border: `1px solid ${isRecommended ? T.accent + "55" : T.border}`,
                borderRadius: T.radius, padding: "16px 18px", cursor: "pointer",
                transition: "all 0.18s", display: "flex", gap: 14, alignItems: "flex-start",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = T.accent + "88";
                  e.currentTarget.style.background = isRecommended ? T.accentLight : T.surfaceHover;
                  e.currentTarget.style.boxShadow = `0 0 0 1px ${T.accent}44, ${T.shadowPink}`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = isRecommended ? T.accent + "55" : T.border;
                  e.currentTarget.style.background = isRecommended ? T.accentLight : T.surface;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Left: title + recommended badge + rationale */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: T.fontSans, fontSize: 14, fontWeight: 600, color: T.text, lineHeight: 1.4 }}>
                      {topic.title}
                    </span>
                    {isRecommended && (
                      <span style={{
                        fontFamily: T.fontSans, fontSize: 9, fontWeight: 700,
                        padding: "2px 8px", borderRadius: 999,
                        background: T.accent, color: "#0A0A0A",
                        textTransform: "uppercase", letterSpacing: "0.5px", flexShrink: 0,
                      }}>
                        Recommended
                      </span>
                    )}
                  </div>
                  <p style={{ fontFamily: T.fontSans, fontSize: 12, color: T.textSecondary, margin: 0, lineHeight: 1.6 }}>
                    {topic.rationale}
                  </p>
                </div>

                {/* Right: Vol + Competition stacked */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0, alignItems: "flex-end" }}>
                  <span style={{
                    fontFamily: T.fontSans, fontSize: 10, fontWeight: 600,
                    padding: "3px 10px", borderRadius: 999,
                    background: T.surfaceAlt, border: `1px solid ${T.border}`,
                    color: volColor(topic.searchVolume), whiteSpace: "nowrap",
                  }}>
                    Vol · {topic.searchVolume}
                  </span>
                  <span style={{
                    fontFamily: T.fontSans, fontSize: 10, fontWeight: 600,
                    padding: "3px 10px", borderRadius: 999,
                    background: T.surfaceAlt, border: `1px solid ${T.border}`,
                    color: compColor(topic.competition), whiteSpace: "nowrap",
                  }}>
                    Comp · {topic.competition}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Custom topic + refresh */}
      {!loading && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: T.border }} />
            <span style={{ fontFamily: T.fontSans, fontSize: 10, fontWeight: 500, color: T.textTertiary, textTransform: "uppercase", letterSpacing: "0.06em" }}>or write your own</span>
            <div style={{ flex: 1, height: 1, background: T.border }} />
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={customTopic}
              onChange={e => setCustomTopic(e.target.value)}
              placeholder="Enter a topic you have in mind…"
              style={{
                flex: 1, fontFamily: T.fontSans, fontSize: 13, padding: "10px 14px",
                border: `1px solid ${T.border}`, borderRadius: T.radiusSm,
                background: T.surface, color: T.text, outline: "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onFocus={e => { e.target.style.borderColor = T.accent; e.target.style.boxShadow = `0 0 0 3px ${T.accentGlow}`; }}
              onBlur={e => { e.target.style.borderColor = T.border; e.target.style.boxShadow = "none"; }}
              onKeyDown={e => {
                if (e.key === "Enter" && customTopic.trim())
                  onSelect({ title: customTopic.trim(), category: "custom", recommendedFormat: "how-to" });
              }}
            />
            <button
              onClick={() => customTopic.trim() && onSelect({ title: customTopic.trim(), category: "custom", recommendedFormat: "how-to" })}
              disabled={!customTopic.trim()}
              style={{
                fontFamily: T.fontSans, fontSize: 12, fontWeight: 600,
                padding: "10px 18px", borderRadius: T.radiusSm, border: `1px solid ${T.border}`,
                background: "transparent", color: customTopic.trim() ? T.text : T.textTertiary,
                cursor: customTopic.trim() ? "pointer" : "not-allowed", transition: "all 0.15s",
              }}
            >
              Use this →
            </button>
          </div>

          <div style={{ textAlign: "center" }}>
            <button
              onClick={() => { fetched.current = false; fetchTopics(); }}
              style={{
                fontFamily: T.fontSans, fontSize: 12, fontWeight: 500,
                background: "none", border: "none", color: T.textSecondary, cursor: "pointer",
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "6px 12px", borderRadius: T.radiusSm, transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = T.accent; e.currentTarget.style.background = T.accentLight; }}
              onMouseLeave={e => { e.currentTarget.style.color = T.textSecondary; e.currentTarget.style.background = "none"; }}
            >
              ↻ Suggest new topics
            </button>
          </div>
        </>
      )}
    </div>
  );
}
