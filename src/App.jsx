import React, { useState } from "react";
import { T, currentSeason, currentMonth } from "./constants";
import { ZocaLogo, Button } from "./components";
import { callClaude } from "./api";
import OnboardingScreen from "./OnboardingScreen";
import TopicScreen from "./TopicScreen";
import FormatScreen from "./FormatScreen";
import EditorScreen from "./EditorScreen";
import BlogsScreen from "./BlogsScreen";

// ── Format-specific blog structures ──
const FORMAT_STRUCTURES = {
  "how-to": `FORMAT: How-To Guide
STRUCTURE (follow this exact order):
1. Title: "How to [Achieve Specific Outcome]" — phrase as a question people ask AI assistants
2. heroImage
3. geoAnswer: 60-100 word standalone direct answer starting with the topic entity — optimized for AI citation
4. introduction: Hook with a surprising stat or bold claim (2-3 sentences). Mention location.
5. whatYouWillLearn: 3-4 bullet points summarizing the outcome
6. tableOfContents: auto-generated from section headings
7. sections: Each section is a STEP with:
   - heading: "Step X: [Action Verb + Outcome]" — written as if answering a conversational AI query
   - content: BLUF first — state what to do in sentence 1, then explain why (2-3 sentences total)
   - example: Real-world example specific to the business type and location
   - proTip: Expert tip for this step (include in at least 3 steps)
   - statistic: Include with source name in 2 steps (e.g., "according to X")
   - image: contextual image query (include in 2-3 steps)
   - inlineCta: after steps 2 and 4
8. commonMistakes: 3-4 common pitfalls as bullet points
9. toolsAndResources: 3-4 helpful tools, products, or frameworks
10. quickRecap: Summary bullet points of all steps
11. Final CTA
Include 5-7 steps. Each step content must lead with the direct answer (BLUF).`,

  "listicle": `FORMAT: Listicle
STRUCTURE (follow this exact order):
1. Title: "X Ways to [Solve Problem]" or "X Best [Things] for [Audience]" — conversational, query-matching
2. heroImage
3. geoAnswer: 60-100 word standalone direct answer to the core topic — AI-citation ready
4. introduction: Hook with surprising stat or relatable problem (2-3 sentences). Mention location.
5. whoThisIsFor: 1-2 sentences describing the target reader
6. tableOfContents: auto-generated from section headings
7. sections: Each section is a NUMBERED TIP with:
   - heading: "X. [The Tip Name]" — specific, outcome-focused
   - content: BLUF first — lead with the benefit/outcome, then explain (2-3 sentences max)
   - example: A specific real-world example for this business type
   - bulletPoints: supporting details as bullets
   - proTip: expert tip (include in 2-3 items)
   - statistic: include with source name in 2-3 items
   - image: contextual image (include in 2-3 items)
   - inlineCta: after items 3 and 6
8. bonusTips: 2-3 extra quick bonus tips as bullets
9. keyTakeaways: 3-4 summary bullet points
10. Final CTA
Include 7-10 list items. Each item content leads with the direct answer (BLUF principle).`,

  "faq": `FORMAT: Q&A / FAQ
STRUCTURE (follow this exact order):
1. Title: "[Topic]: Your X Most Important Questions Answered" — phrased as a conversational query
2. heroImage
3. geoAnswer: 60-100 word standalone direct answer to the most important question in the FAQ — AI-citation ready
4. introduction: Explain who this FAQ is for, open with a surprising stat (2-3 sentences). Mention location.
5. quickSummary: 3-4 key facts with source names as bullets (e.g., "According to X, 73% of...")
6. faq: 6-8 questions with answers:
   - Each question: phrased exactly how someone would ask ChatGPT or Google
   - Each answer: 40-120 words, BLUF structure (answer first, details second), optimized for AI Overviews and Google featured snippets
7. sections: 2-3 "Deep Dive" sections expanding on the most important questions:
   - heading: The question as H2 (conversational: "What Exactly Is X?", "How Does X Work?")
   - content: BLUF first — direct answer in sentence 1, then elaborate (3-5 sentences total)
   - bulletPoints: supporting details
   - statistic: include with full source attribution
   - image: contextual image (include in 1-2)
   - proTip: expert tip (include in 1-2)
   - inlineCta: after deep answer section 1
8. relatedQuestions: 3-4 related questions (People Also Ask format — how someone would phrase to an AI)
9. expertTip: One standout expert recommendation with specific advice
10. Final CTA
FAQ answers must be 40-120 words and begin with the direct answer — this is the exact format AI models cite.`,

  "explainer": `FORMAT: Deep Dive / Complete Guide
STRUCTURE (follow this exact order):
1. Title: "What Is [Topic]? The Complete Guide for [Audience]" — phrased as the question AI gets asked most
2. heroImage
3. geoAnswer: 60-100 word standalone definition/answer to the core topic — written to be the AI Overview answer
4. introduction: Hook with bold claim or surprising stat (2-3 sentences). Mention location.
5. whatYouWillLearn: 4-5 bullet points as outcome statements
6. tableOfContents: auto-generated from section headings
7. sections: Progressive depth structure with BLUF at every level:
   - Section 1 heading: "What Is [Topic]? (And Why It Matters for You)" — direct definition first
   - Section 2 heading: "How [Topic] Actually Works" — mechanism explained
   - Section 3 heading: "The Proven Framework for [Topic]" — methodology
   - Section 4 heading: "Real Results: What to Expect" — evidence and examples
   - Section 5 heading: "Advanced [Topic] Strategies That Work in [Year]" — depth
   - Section 6 heading: "The Best Tools for [Topic]" — resources
   Each section: content opens with the direct answer (BLUF), then expands
   Each section has: heading, content, bulletPoints, proTip, image, statistic (with source), inlineCta
   Include proTips in 3 sections, images in 3 sections, statistics with source attribution in 3 sections, inlineCtas in sections 2 and 4
8. keyTakeaways: 4-5 summary bullets
9. Final CTA
Target 1200-1800 words. Every section's first sentence must stand alone as a citable fact.`,

  "seasonal": `FORMAT: Seasonal / Trend Guide
STRUCTURE (follow this exact order):
1. Title: "The Top [Topic] Trends for [Season Year]: What's Actually Working Now" — timely, specific, query-matching
2. heroImage
3. geoAnswer: 60-100 word standalone answer naming the top 2-3 trends with brief explanations — AI-citation ready with current year
4. introduction: Trend hook with urgency + a specific stat about this season (2-3 sentences). Mention location.
5. keyInsights: 3-4 stats or data points about the trend — each with a source name
6. sections: Each section is a TREND:
   - heading: "Trend #X: [Specific Trend Name]" — clear entity for AI to recognize
   - content: BLUF — what the trend is and why it matters in sentence 1 (2-3 sentences total)
   - example: Specific real-world example tied to this business type and location
   - bulletPoints: concrete actions to capitalize on this trend
   - proTip: expert tip on implementing this trend (include in 2-3 trends)
   - statistic: relevant data with source name (include in 2-3 trends)
   - image: contextual image (include in 2-3 trends)
   - inlineCta: after trends 2 and 4
7. predictions: 2-3 specific predictions with reasoning
8. whatToDoNow: 3-4 actionable bullet points
9. keyTakeaways: 3-4 summary bullets
10. Final CTA with seasonal urgency
Include 4-6 trends. Each trend's first sentence must be citable standalone. Emphasize timeliness throughout.`,
};

const STEPS = [
  { id: "topics", label: "Choose Topic",    num: 1 },
  { id: "format", label: "Select Format",   num: 2 },
  { id: "editor", label: "Generate & Edit", num: 3 },
];

// ── Helper: robustly parse JSON object from model output ──
function parseJsonObjectFromModel(raw) {
  if (!raw || typeof raw !== "string") {
    throw new Error("Empty response from model");
  }

  // Strip common markdown fences if present
  const unfenced = raw.replace(/```json\s*/gi, "").replace(/```/g, "").trim();

  // Try direct parse first
  try {
    return JSON.parse(unfenced);
  } catch {
    // Fallback: extract first {...} block
    const start = unfenced.indexOf("{");
    const end   = unfenced.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) {
      throw new Error("Could not find JSON object in model response.");
    }
    const candidate = unfenced.slice(start, end + 1);
    return JSON.parse(candidate);
  }
}

export default function App() {
  const [screen, setScreen]               = useState("onboarding");
  const [step, setStep]                   = useState("topics");
  const [profile, setProfile]             = useState({ businessName: "", businessType: "", location: "", services: [], unique: "", clientType: "", bookingUrl: "" });
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [blog, setBlog]                   = useState(null);
  const [generating, setGenerating]       = useState(false);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [suggestedTopics, setSuggestedTopics] = useState([]);

  // ── Blog library (persisted to localStorage) ──
  const [blogs, setBlogs] = useState(() => {
    try { return JSON.parse(localStorage.getItem("zoca_blogs") || "[]"); }
    catch { return []; }
  });
  const [editingBlogId, setEditingBlogId] = useState(null);

  const persistBlogs = (updated) => {
    setBlogs(updated);
    try { localStorage.setItem("zoca_blogs", JSON.stringify(updated)); } catch {}
  };

  const generateBlog = async (topic, format) => {
    setGenerating(true);
    setStep("editor");
    try {
      const sys = `You are an elite blog writer for US beauty and wellness businesses, expert in both SEO and GEO (Generative Engine Optimization). You study top-performing blogs from Mindbody, Fresha, GlossGenius, StyleSeat, Allure, and Byrdie. You write content that ranks on Google AND gets cited by AI engines like ChatGPT, Perplexity, and Google AI Overviews. Your writing is scannable, high-converting, and structured for AI extraction: compelling hooks, short paragraphs (2-3 sentences max), keyword-rich H2 sub-headings, bullet points, cited statistics, pull quotes, direct answers before explanations (BLUF principle), and multiple CTAs that drive bookings. Return ONLY valid JSON with no markdown fences or explanation.`;
      const formatGuide = FORMAT_STRUCTURES[format] || FORMAT_STRUCTURES["how-to"];
      const prompt = `Write a HIGH-CONVERTING, SEO-optimized blog post for the US beauty/wellness industry.

BUSINESS CONTEXT:
- Name: ${profile.businessName}
- Type: ${profile.businessType}
- Location: ${profile.location || "US-based"}
- Services: ${profile.services.join(", ") || "General services"}
- Unique angle: ${profile.unique || "None specified"}
- Client type: ${profile.clientType || "General clients"}
- Booking URL: ${profile.bookingUrl || "Not provided"}

BLOG BRIEF:
- Topic: ${topic.title}
- Season: ${currentSeason}, Month: ${currentMonth}

${formatGuide}

WRITING RULES (SEO + GEO):
- SHORT PARAGRAPHS: max 2-3 sentences. Never walls of text.
- BLUF PRINCIPLE (GEO): Every section must lead with the direct answer first, then elaborate. AI engines like ChatGPT and Perplexity extract the first 1-2 sentences of each section as citations — make them self-contained facts.
- HOOKS: Opening sentence of each section = bold claim, surprising stat, or relatable problem. Never a generic lead-in.
- HEADINGS: H2s must mirror how people ask AI assistants. Use "How to X", "Why X Matters", "What Is X", "The X That Changes Y" formats. Avoid bland labels like "Introduction" or "Tips".
- CONVERSATIONAL QUERY MATCHING (GEO): Write as if answering someone who typed a full question into ChatGPT. Use "you", complete thoughts, and natural language.
- ENTITY CONSISTENCY (GEO): Use the exact business name, service names, and location consistently throughout — AI engines use entity recognition to understand and cite sources.
- STATISTICS: Every stat must include a source name (e.g., "according to the American Academy of Dermatology"). AI models prioritize data-driven, cited content.
- PULL QUOTE: Include one memorable, tweetable sentence that captures the core insight.
- Each section skimmable in under 15 seconds.
- Mention location naturally in intro + 2 other places.

SEO:
- Title: include primary keyword, under 60 chars
- Meta description: under 155 chars with primary keyword + implicit CTA
- H2 headings with secondary keywords, phrased as questions where natural
- Reading time: estimate based on word count (average 200 words/min)

GEO DIRECT ANSWER (geoAnswer):
- Write a standalone 60-100 word paragraph that directly answers the blog's core question
- Begin with the business/service name or topic entity
- State the key answer factually and completely in the first sentence
- Include 1 specific statistic or fact with a source
- Written to be copy-pasteable as an AI citation — no fluff, no "In this article"

Return a JSON object with this structure:
{
  "title": "Blog title",
  "metaDescription": "Meta description",
  "readingTime": "X min read",
  "keywords": ["keyword1", "keyword2", "keyword3", "long-tail keyword"],
  "heroImage": "unsplash search query for hero",
  "introduction": "2-3 sentence hook. Mention location and topic. Open with a bold claim or surprising stat.",
  "geoAnswer": "60-100 word standalone direct answer to the blog's core question. Begins with the topic/service entity. First sentence = the answer. Includes 1 cited stat. Written to be cited verbatim by ChatGPT, Perplexity, or Google AI Overviews.",
  "pullQuote": "One memorable, tweetable sentence from the article that captures the core insight" or null,
  "relatedPostSuggestions": ["Related Blog Post Title 1", "Related Blog Post Title 2", "Related Blog Post Title 3"] or null,
  "whatYouWillLearn": ["Point 1", "Point 2", "Point 3"] or null,
  "whoThisIsFor": "1-2 sentence audience description" or null,
  "quickSummary": ["Fact 1", "Fact 2"] or null,
  "keyInsights": ["Stat/insight 1", "Stat/insight 2"] or null,
  "keyTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"],
  "sections": [
    {
      "heading": "H2 heading",
      "content": "Short paragraph (2-3 sentences)",
      "example": "Real-world example sentence" or null,
      "bulletPoints": ["Point 1", "Point 2"] or null,
      "proTip": "Expert tip text" or null,
      "statistic": { "value": "73%", "label": "description", "source": "Source Name 2024" } or null,
      "image": "unsplash search query" or null,
      "inlineCta": { "text": "CTA text", "buttonLabel": "Book Now" } or null
    }
  ],
  "commonMistakes": ["Mistake 1", "Mistake 2", "Mistake 3"] or null,
  "toolsAndResources": [{ "name": "Tool name", "description": "What it does" }] or null,
  "bonusTips": ["Bonus tip 1", "Bonus tip 2"] or null,
  "predictions": ["Prediction 1", "Prediction 2"] or null,
  "whatToDoNow": ["Action 1", "Action 2"] or null,
  "relatedQuestions": ["Question 1?", "Question 2?"] or null,
  "expertTip": "One standout expert recommendation" or null,
  "quickRecap": ["Step 1 summary", "Step 2 summary"] or null,
  "faq": [{ "question": "Question?", "answer": "Answer (40-120 words)" }],
  "cta": "Final compelling CTA paragraph",
  "wordCount": number
}

Only include the fields relevant to the chosen format. Set irrelevant fields to null. Return ONLY the JSON object.`;

      const raw = await callClaude(sys, prompt);
      const parsed = parseJsonObjectFromModel(raw);
      setBlog(parsed);
    } catch (e) {
      console.error("Error generating blog:", e);
      setBlog({ title: "Error generating blog", metaDescription: "Please try again", keywords: [], sections: [{ heading: "Something went wrong", content: "We couldn't generate your blog. Please click 'Regenerate' to try again, or go back and select a different topic." }], cta: "", wordCount: 0 });
    }
    setGenerating(false);
  };

  const handleTopicSelect  = (topic)  => { setSelectedTopic(topic);  setStep("format"); };
  const handleFormatSelect = (format) => { setSelectedFormat(format); generateBlog(selectedTopic, format); };
  const handleStartNewBlog = () => {
    setStep("topics");
    setSelectedTopic(null);
    setSelectedFormat(null);
    setBlog(null);
    setEditingBlogId(null);
    setScreen("dashboard");
  };

  // ── Blog library handlers ──
  const saveBlog = (status) => {
    const id = editingBlogId || Date.now().toString();
    const now = new Date().toISOString();
    const existing = blogs.find(b => b.id === id);
    const saved = { ...blog, id, status, savedAt: existing?.savedAt || now, updatedAt: now };
    const updated = editingBlogId
      ? blogs.map(b => b.id === editingBlogId ? saved : b)
      : [saved, ...blogs];
    persistBlogs(updated);
    setScreen("blogs");
    setStep("topics");
    setSelectedTopic(null);
    setSelectedFormat(null);
    setBlog(null);
    setEditingBlogId(null);
  };

  const handleEditBlog = (blogId) => {
    const found = blogs.find(b => b.id === blogId);
    if (!found) return;
    setBlog(found);
    setEditingBlogId(blogId);
    setStep("editor");
    setScreen("dashboard");
  };

  const handlePublishToggle = (blogId) => {
    const updated = blogs.map(b =>
      b.id === blogId
        ? { ...b, status: b.status === "published" ? "draft" : "published", updatedAt: new Date().toISOString() }
        : b
    );
    persistBlogs(updated);
  };

  const handleDeleteBlog = (blogId) => {
    persistBlogs(blogs.filter(b => b.id !== blogId));
  };

  if (screen === "onboarding") {
    return <OnboardingScreen profile={profile} setProfile={setProfile} onComplete={() => setScreen("dashboard")} />;
  }

  const stepIds      = STEPS.map(s => s.id);
  const currentIdx   = stepIds.indexOf(step);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: T.bg }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 232,
        background: T.surface,
        borderRight: `1px solid ${T.border}`,
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0, bottom: 0, left: 0,
        zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ padding: "24px 20px 20px" }}>
          <ZocaLogo height={16} color={T.text} />
        </div>

        <div style={{ height: 1, background: T.border }} />

        {/* Navigation */}
        <div style={{ padding: "16px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>

          {/* My Blogs nav item */}
          <button
            onClick={() => setScreen("blogs")}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "8px 10px", borderRadius: T.radiusSm, marginBottom: 4,
              border: "none", width: "100%", textAlign: "left",
              background: screen === "blogs" ? T.accentLight : "transparent",
              cursor: "pointer", transition: "background 0.15s",
            }}
            onMouseEnter={e => { if (screen !== "blogs") e.currentTarget.style.background = T.surfaceHover; }}
            onMouseLeave={e => { if (screen !== "blogs") e.currentTarget.style.background = "transparent"; }}
          >
            <span style={{
              fontFamily: T.fontSans, fontSize: 13,
              fontWeight: screen === "blogs" ? 700 : 400,
              color: screen === "blogs" ? T.accent : T.textSecondary,
            }}>My Blog Posts</span>
            {blogs.length > 0 && (
              <span style={{
                fontFamily: T.fontSans, fontSize: 10, fontWeight: 700,
                padding: "1px 7px", borderRadius: 999,
                background: screen === "blogs" ? T.accent : T.surfaceAlt,
                color: screen === "blogs" ? "#0A0A0A" : T.textTertiary,
                border: `1px solid ${screen === "blogs" ? "transparent" : T.border}`,
              }}>{blogs.length}</span>
            )}
          </button>

          {/* Divider + Workflow (only when on dashboard) */}
          {screen === "dashboard" && (
            <>
              <div style={{ height: 1, background: T.border, margin: "8px 4px 12px" }} />
              <div style={{
                fontFamily: T.fontSans, fontSize: 9, fontWeight: 700, color: T.textTertiary,
                textTransform: "uppercase", letterSpacing: "1.2px", padding: "0 6px", marginBottom: 10,
              }}>Workflow</div>

              {STEPS.map((s, i) => {
                const isDone   = i < currentIdx;
                const isActive = s.id === step;
                return (
                  <div key={s.id} style={{ position: "relative" }}>
                    {i > 0 && (
                      <div style={{
                        position: "absolute", left: 19, top: -10, width: 1, height: 10,
                        background: isDone ? T.green : T.border,
                      }} />
                    )}
                    <button
                      onClick={isDone && s.id === "topics" ? handleStartNewBlog : undefined}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "8px 8px", borderRadius: T.radiusSm, marginBottom: 4,
                        border: "none", width: "100%", textAlign: "left",
                        background: isActive ? T.accentLight : "transparent",
                        cursor: isDone && s.id === "topics" ? "pointer" : "default",
                        transition: "background 0.15s",
                      }}
                    >
                      <div style={{
                        width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 700,
                        background: isActive ? T.accent : isDone ? T.green : T.border,
                        color: isActive ? "#0A0A0A" : isDone ? "#0A0A0A" : T.textTertiary,
                        boxShadow: isActive ? T.shadowPink : "none",
                        transition: "all 0.2s",
                      }}>
                        {isDone ? "✓" : s.num}
                      </div>
                      <span style={{
                        fontFamily: T.fontSans, fontSize: 13,
                        fontWeight: isActive ? 700 : 400,
                        color: isActive ? T.accent : isDone ? T.text : T.textTertiary,
                      }}>{s.label}</span>
                    </button>
                  </div>
                );
              })}

              <div style={{ marginTop: 16, padding: "0 4px" }}>
                <button
                  onClick={handleStartNewBlog}
                  style={{
                    width: "100%", fontFamily: T.fontSans, fontSize: 11, fontWeight: 600,
                    padding: "9px 12px", borderRadius: T.radiusSm,
                    border: `1px dashed ${T.border}`,
                    background: "transparent", color: T.textTertiary, cursor: "pointer",
                    transition: "all 0.15s", textAlign: "center", letterSpacing: "0.04em",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.color = T.accent; e.currentTarget.style.background = T.accentLight; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textTertiary; e.currentTarget.style.background = "transparent"; }}
                >+ New Blog</button>
              </div>
            </>
          )}
        </div>

        {/* Business profile */}
        <div style={{ padding: "14px 16px", borderTop: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
              background: T.accentLight,
              border: `1px solid ${T.accent}44`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: T.accent, fontSize: 13, fontWeight: 700,
            }}>
              {profile.businessName.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: T.fontSans, fontSize: 12, fontWeight: 700, color: T.text,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {profile.businessName}
              </div>
              <div style={{
                fontFamily: T.fontSans, fontSize: 10, color: T.textTertiary,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 1,
              }}>
                {profile.businessType}{profile.location ? ` · ${profile.location}` : ""}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ marginLeft: 232, flex: 1, minHeight: "100vh", background: T.bg, display: "flex", flexDirection: "column" }}>

        {/* Top bar */}
        <div style={{
          padding: "12px 36px",
          borderBottom: `1px solid ${T.border}`,
          background: T.surface,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, zIndex: 50,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {screen === "blogs" ? (
              <span style={{ fontFamily: T.fontSans, fontSize: 11, fontWeight: 700, color: T.accent }}>
                My Blog Posts
              </span>
            ) : (
              <>
                <button
                  onClick={() => setScreen("blogs")}
                  style={{ fontFamily: T.fontSans, fontSize: 11, color: T.textTertiary, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  onMouseEnter={e => e.currentTarget.style.color = T.textSecondary}
                  onMouseLeave={e => e.currentTarget.style.color = T.textTertiary}
                >My Blogs</button>
                <span style={{ color: T.textTertiary, fontSize: 12 }}>›</span>
                {STEPS.map((s, i) => {
                  const isActive = s.id === step;
                  const isDone   = i < currentIdx;
                  return (
                    <React.Fragment key={s.id}>
                      {i > 0 && <span style={{ color: T.textTertiary, fontSize: 12 }}>›</span>}
                      <span style={{
                        fontFamily: T.fontSans, fontSize: 11, fontWeight: isActive ? 700 : 400,
                        color: isActive ? T.accent : isDone ? T.textSecondary : T.textTertiary,
                        letterSpacing: "0.02em",
                      }}>{s.label}</span>
                    </React.Fragment>
                  );
                })}
              </>
            )}
          </div>
          <div style={{
            fontFamily: T.fontSans, fontSize: 10, fontWeight: 600, color: T.textTertiary,
            background: T.surfaceAlt, padding: "4px 10px", borderRadius: 999,
            border: `1px solid ${T.border}`, letterSpacing: "0.04em",
          }}>
            {profile.businessType}
          </div>
        </div>

        {/* Screen content */}
        {screen === "blogs" ? (
          <div style={{ flex: 1, padding: "40px 48px" }}>
            <BlogsScreen
              blogs={blogs}
              onNewBlog={handleStartNewBlog}
              onEdit={handleEditBlog}
              onPublishToggle={handlePublishToggle}
              onDelete={handleDeleteBlog}
              profile={profile}
            />
          </div>
        ) : (
          <div style={{
            flex: 1,
            padding: step === "editor" ? "32px 40px" : "48px 52px",
            maxWidth: step === "editor" ? "none" : 720,
            width: "100%",
            margin: "0 auto",
            alignSelf: step === "editor" ? "stretch" : undefined,
          }}>
            {step === "topics" && (
              <TopicScreen profile={profile} onSelect={handleTopicSelect} loading={topicsLoading} setLoading={setTopicsLoading} topics={suggestedTopics} setTopics={setSuggestedTopics} />
            )}
            {step === "format" && selectedTopic && (
              <>
                <FormatScreen topic={selectedTopic} onSelect={handleFormatSelect} />
                <div style={{ marginTop: 24 }}>
                  <Button variant="ghost" size="sm" onClick={() => setStep("topics")}>← Back to topics</Button>
                </div>
              </>
            )}
            {step === "editor" && (
              <EditorScreen
                blog={blog} setBlog={setBlog} profile={profile}
                onBack={() => setScreen("blogs")}
                onRegenerate={() => generateBlog(selectedTopic, selectedFormat)}
                onSave={saveBlog}
                generating={generating}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
