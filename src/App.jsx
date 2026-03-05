import React, { useState } from "react";
import { T, currentSeason, currentMonth } from "./constants";
import { ZocaLogo, Button } from "./components";
import { callClaude } from "./api";
import OnboardingScreen from "./OnboardingScreen";
import TopicScreen from "./TopicScreen";
import FormatScreen from "./FormatScreen";
import EditorScreen from "./EditorScreen";

// ── Format-specific blog structures ──
const FORMAT_STRUCTURES = {
  "how-to": `FORMAT: How-To Guide
STRUCTURE (follow this exact order):
1. Title: "How to [Achieve Specific Outcome]"
2. heroImage
3. introduction: Hook explaining the problem and the outcome the reader will achieve (2-3 sentences)
4. whatYouWillLearn: 3-4 bullet points summarizing value
5. tableOfContents: auto-generated from section headings
6. sections: Each section is a STEP with:
   - heading: "Step X: [Action Verb + Outcome]"
   - content: Short explanation (2-3 sentences)
   - example: A real-world example specific to the business type
   - proTip: Expert tip for this step (include in at least 3 steps)
   - image: contextual image query (include in 2-3 steps)
   - inlineCta: after steps 2 and 4
7. commonMistakes: 3-4 common pitfalls as bullet points
8. toolsAndResources: 3-4 helpful tools, products, or frameworks
9. quickRecap: Summary bullet points of all steps
10. Final CTA
Include 5-7 steps. Each step should be actionable and specific.`,

  "listicle": `FORMAT: Listicle
STRUCTURE (follow this exact order):
1. Title: "X Ways to [Solve Problem]" or "X Best [Things] for [Audience]"
2. heroImage
3. introduction: Hook explaining why this topic matters (2-3 sentences)
4. whoThisIsFor: 1-2 sentences describing the target reader
5. tableOfContents: auto-generated from section headings
6. sections: Each section is a NUMBERED TIP with:
   - heading: "Tip #X: [Actionable Title]" or "#X. [Title]"
   - content: Short explanation (2-3 sentences max, skimmable in <15 seconds)
   - example: A specific real-world example
   - bulletPoints: supporting details as bullets
   - proTip: expert tip (include in 2-3 items)
   - image: contextual image (include in 2-3 items)
   - inlineCta: after items 3 and 6
7. bonusTips: 2-3 extra quick bonus tips as bullets
8. keyTakeaways: 3-4 summary bullet points
9. Final CTA
Include 7-10 list items. Each should be skimmable in under 15 seconds.`,

  "faq": `FORMAT: Q&A / FAQ
STRUCTURE (follow this exact order):
1. Title: "Frequently Asked Questions About [Topic]" or "[Topic]: X Questions Answered"
2. heroImage
3. introduction: Explain who this FAQ is for (2-3 sentences)
4. quickSummary: 3-4 key facts or stats as bullets
5. faq: 6-8 questions with answers (each answer 40-120 words, optimized for Google featured snippets)
6. sections: 2-3 "Deep Answer" sections expanding on the most important questions:
   - heading: The question as H2
   - content: Detailed 3-5 sentence answer
   - bulletPoints: supporting details
   - image: contextual image (include in 1-2)
   - proTip: expert tip (include in 1-2)
   - inlineCta: after deep answer section 1
7. relatedQuestions: 3-4 related questions for internal linking
8. expertTip: One standout expert recommendation
9. Final CTA
FAQ answers must be 40-120 words each for Google snippet optimization.`,

  "explainer": `FORMAT: Deep Dive / Complete Guide
STRUCTURE (follow this exact order):
1. Title: "The Complete Guide to [Topic]" or "Everything You Need to Know About [Topic]"
2. heroImage
3. introduction: Hook explaining why this topic matters deeply (2-3 sentences)
4. whatYouWillLearn: 4-5 bullet points
5. tableOfContents: auto-generated from section headings
6. sections: Progressive depth structure:
   - Section 1: Foundations / Basics (what it is, why it matters)
   - Section 2: Core concept explanation
   - Section 3: Framework or methodology
   - Section 4: Real examples / case studies
   - Section 5: Advanced strategies
   - Section 6: Tools and resources
   Each section has: heading, content, bulletPoints, proTip, image, statistic, inlineCta
   Include proTips in 3 sections, images in 3 sections, statistics in 2 sections, inlineCtas in sections 2 and 4
7. keyTakeaways: 4-5 summary bullets
8. Final CTA
Deep dives should be comprehensive. Target 1200-1800 words.`,

  "seasonal": `FORMAT: Seasonal / Trend Guide
STRUCTURE (follow this exact order):
1. Title: "[Season/Month Year] Guide to [Topic]" or "Top [Topic] Trends for [Season Year]"
2. heroImage
3. introduction: Trend hook explaining why this matters RIGHT NOW (2-3 sentences, urgency)
4. keyInsights: 3-4 stats or data points about the trend
5. sections: Each section is a TREND:
   - heading: "Trend #X: [Trend Name]"
   - content: Explanation of the trend (2-3 sentences)
   - example: Specific real-world example
   - bulletPoints: how to capitalize on this trend
   - proTip: expert tip (include in 2-3 trends)
   - image: contextual image (include in 2-3 trends)
   - statistic: relevant data (include in 2 trends)
   - inlineCta: after trends 2 and 4
6. predictions: 2-3 predictions for what's coming next
7. whatToDoNow: 3-4 actionable bullet points for the business owner
8. keyTakeaways: 3-4 summary bullets
9. Final CTA with seasonal urgency
Include 4-6 trends. Emphasize timeliness and urgency throughout.`,
};

const STEPS = [
  { id: "topics", label: "Choose Topic",    num: 1 },
  { id: "format", label: "Select Format",   num: 2 },
  { id: "editor", label: "Generate & Edit", num: 3 },
];

export default function App() {
  const [screen, setScreen]               = useState("onboarding");
  const [step, setStep]                   = useState("topics");
  const [profile, setProfile]             = useState({ businessName: "", businessType: "", location: "", services: [], unique: "", clientType: "", bookingUrl: "" });
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [blog, setBlog]                   = useState(null);
  const [generating, setGenerating]       = useState(false);
  const [topicsLoading, setTopicsLoading] = useState(false);

  const generateBlog = async (topic, format) => {
    setGenerating(true);
    setStep("editor");
    try {
      const sys = `You are an elite conversion-focused blog writer for US beauty and wellness businesses. You study top-performing salon blogs from platforms like Fresha, Vagaro, GlossGenius, StyleSeat and Booksy. You write scannable, high-converting content with short paragraphs, bullet points, expert tips, statistics, and multiple CTAs that drive bookings. Return ONLY valid JSON with no markdown fences.`;
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

WRITING RULES:
- SHORT PARAGRAPHS: max 2-3 sentences. Never walls of text.
- Each section skimmable in <15 seconds.
- Use "you" language. Warm, expert, conversational tone.
- Mention location naturally in intro + 2 other places.

SEO:
- Title: include primary keyword, under 60 chars
- Meta description: under 155 chars with primary keyword
- H2 headings with secondary keywords

Return a JSON object with this structure:
{
  "title": "Blog title",
  "metaDescription": "Meta description",
  "keywords": ["keyword1", "keyword2", "keyword3", "long-tail keyword"],
  "heroImage": "unsplash search query for hero",
  "introduction": "2-3 sentence hook. Mention location and topic.",
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

      const raw     = await callClaude(sys, prompt);
      const cleaned = raw.replace(/```json\n?/g, "").replace(/```/g, "").trim();
      setBlog(JSON.parse(cleaned));
    } catch (e) {
      console.error(e);
      setBlog({ title: "Error generating blog", metaDescription: "Please try again", keywords: [], sections: [{ heading: "Something went wrong", content: "We couldn't generate your blog. Please click 'Regenerate' to try again, or go back and select a different topic." }], cta: "", wordCount: 0 });
    }
    setGenerating(false);
  };

  const handleTopicSelect  = (topic)  => { setSelectedTopic(topic);  setStep("format"); };
  const handleFormatSelect = (format) => { setSelectedFormat(format); generateBlog(selectedTopic, format); };
  const handleStartNewBlog = ()       => { setStep("topics"); setSelectedTopic(null); setSelectedFormat(null); setBlog(null); };

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

        {/* Workflow */}
        <div style={{ padding: "20px 12px", flex: 1 }}>
          <div style={{
            fontFamily: T.fontSans, fontSize: 9, fontWeight: 700, color: T.textTertiary,
            textTransform: "uppercase", letterSpacing: "1.2px", padding: "0 8px", marginBottom: 14,
          }}>
            Workflow
          </div>

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
                  {/* Step circle */}
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
                  }}>
                    {s.label}
                  </span>
                </button>
              </div>
            );
          })}

          {step !== "topics" && (
            <div style={{ marginTop: 20, padding: "0 4px" }}>
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
              >
                + New Blog
              </button>
            </div>
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

        {/* Top breadcrumb bar */}
        <div style={{
          padding: "12px 36px",
          borderBottom: `1px solid ${T.border}`,
          background: T.surface,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, zIndex: 50,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
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
                  }}>
                    {s.label}
                  </span>
                </React.Fragment>
              );
            })}
          </div>
          <div style={{
            fontFamily: T.fontSans, fontSize: 10, fontWeight: 600, color: T.textTertiary,
            background: T.surfaceAlt, padding: "4px 10px", borderRadius: 999,
            border: `1px solid ${T.border}`, letterSpacing: "0.04em",
          }}>
            {profile.businessType}
          </div>
        </div>

        {/* Step content */}
        <div style={{
          flex: 1,
          padding: step === "editor" ? "32px 40px" : "48px 52px",
          maxWidth: step === "editor" ? "none" : 720,
          width: "100%",
          margin: "0 auto",
          alignSelf: step === "editor" ? "stretch" : undefined,
        }}>
          {step === "topics" && (
            <TopicScreen profile={profile} onSelect={handleTopicSelect} loading={topicsLoading} setLoading={setTopicsLoading} />
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
              onBack={handleStartNewBlog}
              onRegenerate={() => generateBlog(selectedTopic, selectedFormat)}
              generating={generating}
            />
          )}
        </div>
      </main>
    </div>
  );
}
