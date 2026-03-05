import React, { useState, useRef } from "react";
import { T, currentMonth } from "./constants";
import { Button } from "./components";
import { callClaude } from "./api";

// ── Unsplash image URL builder ──
const unsplashImg = (query, w = 800, h = 400) =>
  `https://source.unsplash.com/${w}x${h}/?${encodeURIComponent(query)}`;

// ── Formatting toolbar button ──
function FmtBtn({ label, title, onClick }) {
  return (
    <button title={title} onMouseDown={e => { e.preventDefault(); onClick(); }}
      style={{
        fontFamily: T.fontSans, fontSize: 12, fontWeight: 500, minWidth: 28, height: 26,
        padding: "0 6px", borderRadius: 6, border: "1px solid transparent",
        background: "transparent", color: T.textSecondary, cursor: "pointer", transition: "all 0.12s",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onMouseEnter={e => { e.currentTarget.style.background = T.surfaceAlt; e.currentTarget.style.color = T.text; }}
      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.textSecondary; }}
    >{label}</button>
  );
}

function FmtDivider() {
  return <div style={{ width: 1, height: 16, background: T.border, margin: "0 4px" }} />;
}

// ═══════════════════════════════════════════
// Reusable blog content blocks
// ═══════════════════════════════════════════

function SectionLabel({ children }) {
  return (
    <div style={{ fontFamily: T.fontSans, fontSize: 10, fontWeight: 700, color: T.accent, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>
      {children}
    </div>
  );
}

function ContentBox({ label, children, borderColor }) {
  return (
    <div style={{
      margin: "16px 0", padding: "18px 22px", borderRadius: T.radius,
      background: T.surfaceAlt, border: `1px solid ${T.border}`,
      borderLeft: borderColor ? `3px solid ${borderColor}` : undefined,
    }}>
      {label && <SectionLabel>{label}</SectionLabel>}
      {children}
    </div>
  );
}

function BulletList({ items, color }) {
  if (!items || items.length === 0) return null;
  return (
    <ul style={{ fontFamily: T.fontSans, fontSize: 13, color: color || T.textSecondary, lineHeight: 1.8, paddingLeft: 20, margin: "8px 0" }}>
      {items.map((item, i) => <li key={i} style={{ marginBottom: 4 }}>{item}</li>)}
    </ul>
  );
}

function ProTipBox({ text }) {
  if (!text) return null;
  return (
    <div style={{
      margin: "14px 0", padding: "14px 18px", borderRadius: T.radius,
      background: "rgba(0, 210, 160, 0.08)", border: `1px solid rgba(0, 210, 160, 0.20)`,
      borderLeft: `3px solid ${T.green}`,
    }}>
      <div style={{ fontFamily: T.fontSans, fontSize: 10, fontWeight: 700, color: T.green, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>Pro Tip</div>
      <p style={{ fontFamily: T.fontSans, fontSize: 13, color: T.text, margin: 0, lineHeight: 1.7 }}>{text}</p>
    </div>
  );
}

function ExampleBox({ text }) {
  if (!text) return null;
  return (
    <div style={{
      margin: "10px 0", padding: "12px 16px", borderRadius: T.radiusSm,
      background: T.warmLight, borderLeft: `3px solid ${T.warm}`,
    }}>
      <span style={{ fontFamily: T.fontSans, fontSize: 10, fontWeight: 700, color: T.warm, textTransform: "uppercase", letterSpacing: "0.8px" }}>Example </span>
      <p style={{ fontFamily: T.fontSans, fontSize: 13, color: T.text, margin: "4px 0 0", lineHeight: 1.6 }}>{text}</p>
    </div>
  );
}

function StatBox({ stat }) {
  if (!stat) return null;
  return (
    <div style={{
      margin: "14px 0", padding: "18px 22px", borderRadius: T.radius,
      background: T.blueLight, border: `1px solid rgba(77, 101, 255, 0.20)`, textAlign: "center",
    }}>
      <div style={{ fontFamily: T.font, fontSize: 34, fontWeight: 700, color: T.blue, lineHeight: 1 }}>{stat.value}</div>
      <p style={{ fontFamily: T.fontSans, fontSize: 13, color: T.text, margin: "6px 0 0", lineHeight: 1.5, fontWeight: 500 }}>{stat.label}</p>
      {stat.source && <p style={{ fontFamily: T.fontSans, fontSize: 10, color: T.textTertiary, margin: "4px 0 0" }}>Source: {stat.source}</p>}
    </div>
  );
}

function InlineCtaBlock({ cta, bookingUrl }) {
  if (!cta) return null;
  return (
    <div style={{
      margin: "18px 0", padding: "18px 22px", borderRadius: T.radiusLg,
      background: `linear-gradient(135deg, ${T.accentLight} 0%, rgba(77,101,255,0.06) 100%)`,
      border: `1px solid ${T.accent}33`,
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap",
    }}>
      <p style={{ fontFamily: T.fontSans, fontSize: 14, color: T.text, margin: 0, fontWeight: 500, lineHeight: 1.5, flex: 1, minWidth: 200 }}>{cta.text}</p>
      <CtaButton label={cta.buttonLabel || "Book Now"} url={bookingUrl} />
    </div>
  );
}

function CtaButton({ label, url, large }) {
  const style = {
    fontFamily: T.fontSans, fontSize: large ? 13 : 12, fontWeight: 700,
    padding: large ? "12px 28px" : "10px 22px", borderRadius: 999,
    background: T.accent, color: "#0A0A0A", textDecoration: "none",
    whiteSpace: "nowrap", boxShadow: T.shadowPink, transition: "all 0.15s",
    border: "none", cursor: "pointer", display: "inline-block", letterSpacing: "0.02em",
  };
  const hover = e => { e.currentTarget.style.background = T.accentHover; e.currentTarget.style.transform = "translateY(-1px)"; };
  const leave = e => { e.currentTarget.style.background = T.accent; e.currentTarget.style.transform = "none"; };
  if (url) return <a href={url} target="_blank" rel="noopener noreferrer" style={style} onMouseEnter={hover} onMouseLeave={leave}>{label}</a>;
  return <span style={style} onMouseEnter={hover} onMouseLeave={leave}>{label}</span>;
}

function BlogImage({ query, onDelete }) {
  const [loaded, setLoaded] = useState(true);
  if (!query || !loaded) return null;
  return (
    <div style={{ position: "relative", margin: "14px 0", borderRadius: T.radius, overflow: "hidden", border: `1px solid ${T.border}` }}>
      <img src={unsplashImg(query)} alt={query} onError={() => setLoaded(false)}
        style={{ width: "100%", height: 260, objectFit: "cover", display: "block" }} />
      <button onClick={onDelete} title="Remove image"
        style={{
          position: "absolute", top: 8, right: 8, width: 28, height: 28, borderRadius: "50%",
          background: "rgba(0,0,0,0.65)", border: "none", color: "#fff", fontSize: 14,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}
        onMouseEnter={e => e.currentTarget.style.background = T.danger}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.65)"}
      >x</button>
    </div>
  );
}

function TableOfContents({ sections }) {
  if (!sections || sections.length < 3) return null;
  return (
    <ContentBox label="Table of Contents" borderColor={T.accent}>
      <ol style={{ fontFamily: T.fontSans, fontSize: 13, color: T.text, lineHeight: 2, paddingLeft: 20, margin: 0 }}>
        {sections.map((s, i) => <li key={i} style={{ color: T.textSecondary }}><span style={{ color: T.text, fontWeight: 500 }}>{s.heading}</span></li>)}
      </ol>
    </ContentBox>
  );
}

function ToolCard({ tool }) {
  return (
    <div style={{
      padding: "12px 16px", borderRadius: T.radiusSm,
      background: T.surface, border: `1px solid ${T.border}`,
      display: "flex", gap: 10, alignItems: "flex-start",
    }}>
      <span style={{ fontSize: 16, flexShrink: 0, marginTop: 2 }}>*</span>
      <div>
        <div style={{ fontFamily: T.fontSans, fontSize: 13, fontWeight: 700, color: T.text }}>{tool.name}</div>
        <div style={{ fontFamily: T.fontSans, fontSize: 12, color: T.textSecondary, marginTop: 2, lineHeight: 1.5 }}>{tool.description}</div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════
// Main Editor Component
// ═══════════════════════════════════════════

export default function EditorScreen({ blog, setBlog, profile, onBack, onRegenerate, generating }) {
  const [rewriteIdx, setRewriteIdx] = useState(null);
  const [rewriting, setRewriting]   = useState(false);
  const [copied, setCopied]         = useState(false);
  const imageInputRef               = useRef(null);

  const exec = (cmd, val = null) => document.execCommand(cmd, false, val);
  const handleImageFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => exec("insertImage", ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const rewriteSection = async (idx) => {
    setRewriting(true); setRewriteIdx(idx);
    try {
      const section = blog.sections[idx];
      const sys = `You are a skilled blog writer for beauty and wellness businesses. Rewrite the given section to be more engaging, scannable (short paragraphs, 2-3 sentences max), and conversion-focused. Return ONLY the rewritten content in plain text, no markdown headers.`;
      const prompt = `Original heading: ${section.heading}\nOriginal content:\n${section.content}\n\nRewrite for a ${profile.businessType.toLowerCase()} ${profile.location ? "in " + profile.location : ""}. Keep it short, punchy, scannable. Max 2-3 sentences. Return only the body text.`;
      const newContent = await callClaude(sys, prompt);
      setBlog(b => ({ ...b, sections: b.sections.map((s, i) => i === idx ? { ...s, content: newContent.trim() } : s) }));
    } catch (e) { console.error(e); }
    setRewriting(false); setRewriteIdx(null);
  };

  const removeSectionImage = (idx) => setBlog(b => ({ ...b, sections: b.sections.map((s, i) => i === idx ? { ...s, image: null } : s) }));
  const removeHeroImage = () => setBlog(b => ({ ...b, heroImage: null }));

  const copyAs = (format) => {
    let out = "";
    if (format === "html") {
      out = `<h1>${blog.title}</h1>\n`;
      if (blog.metaDescription) out += `<p><em>${blog.metaDescription}</em></p>\n`;
      if (blog.introduction) out += `<p>${blog.introduction}</p>\n`;
      if (blog.keyTakeaways) out += `<h2>Key Takeaways</h2>\n<ul>${blog.keyTakeaways.map(t => `<li>${t}</li>`).join("")}</ul>\n`;
      blog.sections.forEach(s => {
        out += `<h2>${s.heading}</h2>\n<p>${s.content}</p>\n`;
        if (s.example) out += `<blockquote>${s.example}</blockquote>\n`;
        if (s.bulletPoints) out += `<ul>${s.bulletPoints.map(b => `<li>${b}</li>`).join("")}</ul>\n`;
        if (s.proTip) out += `<p><strong>Pro Tip:</strong> ${s.proTip}</p>\n`;
      });
      if (blog.faq) blog.faq.forEach(f => { out += `<h3>${f.question}</h3>\n<p>${f.answer}</p>\n`; });
      if (blog.cta) out += `<p><strong>${blog.cta}</strong></p>\n`;
    } else {
      out = `${blog.title}\n\n`;
      if (blog.introduction) out += `${blog.introduction}\n\n`;
      if (blog.keyTakeaways) out += `KEY TAKEAWAYS\n${blog.keyTakeaways.map(t => `- ${t}`).join("\n")}\n\n`;
      blog.sections.forEach(s => {
        out += `${s.heading}\n\n${s.content}\n\n`;
        if (s.example) out += `Example: ${s.example}\n\n`;
        if (s.bulletPoints) out += s.bulletPoints.map(b => `- ${b}`).join("\n") + "\n\n";
        if (s.proTip) out += `Pro Tip: ${s.proTip}\n\n`;
      });
      if (blog.commonMistakes) out += `COMMON MISTAKES\n${blog.commonMistakes.map(m => `- ${m}`).join("\n")}\n\n`;
      if (blog.quickRecap) out += `QUICK RECAP\n${blog.quickRecap.map(r => `- ${r}`).join("\n")}\n\n`;
      if (blog.faq) blog.faq.forEach(f => { out += `Q: ${f.question}\nA: ${f.answer}\n\n`; });
      if (blog.cta) out += `${blog.cta}\n`;
    }
    navigator.clipboard.writeText(out);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Loading state ──
  if (generating) {
    return (
      <div style={{ textAlign: "center", padding: "100px 20px", animation: "fadeIn 0.3s ease" }}>
        <div style={{
          width: 60, height: 60, borderRadius: "50%", margin: "0 auto 24px",
          background: T.accentLight, border: `1px solid ${T.accent}44`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24, color: T.accent, animation: "glowPulse 2s ease infinite",
        }}>*</div>
        <h2 style={{ fontFamily: T.font, fontSize: 22, fontWeight: 700, color: T.text }}>Writing your blog...</h2>
        <p style={{ fontFamily: T.fontSans, fontSize: 13, color: T.textSecondary, marginTop: 8 }}>Crafting high-converting content for {profile.businessName}</p>
        <div style={{ marginTop: 28, display: "flex", justifyContent: "center" }}>
          <div style={{ width: 200, height: 2, background: T.border, borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 2, background: T.accent, animation: "loading 1.5s ease infinite" }} />
          </div>
        </div>
      </div>
    );
  }

  if (!blog) return null;
  const bookingUrl = profile.bookingUrl || "";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, animation: "fadeIn 0.3s ease" }}>
      <input ref={imageInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageFile} />

      {/* ── Toolbar ── */}
      <div style={{ background: T.surface, borderRadius: T.radius, border: `1px solid ${T.border}`, position: "sticky", top: 52, zIndex: 10, overflow: "hidden" }}>
        {/* Row 1: nav + copy */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, padding: "11px 16px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Button variant="ghost" size="sm" onClick={onBack}>← New blog</Button>
            <Button variant="secondary" size="sm" onClick={onRegenerate}>↻ Regenerate</Button>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {blog.wordCount > 0 && (
              <span style={{ fontFamily: T.fontSans, fontSize: 10, fontWeight: 600, color: T.textTertiary, padding: "4px 10px", background: T.surfaceAlt, borderRadius: 999, border: `1px solid ${T.border}` }}>~{blog.wordCount} words</span>
            )}
            <Button variant="secondary" size="sm" onClick={() => copyAs("text")}>{copied ? "Copied!" : "Copy Text"}</Button>
            <Button variant="primary" size="sm" onClick={() => copyAs("html")}>{copied ? "Copied!" : "Copy HTML"}</Button>
          </div>
        </div>
        {/* Row 2: formatting */}
        <div style={{ display: "flex", alignItems: "center", gap: 2, padding: "6px 12px", flexWrap: "wrap" }}>
          <FmtBtn label={<b>B</b>} title="Bold" onClick={() => exec("bold")} />
          <FmtBtn label={<i>I</i>} title="Italic" onClick={() => exec("italic")} />
          <FmtBtn label={<u>U</u>} title="Underline" onClick={() => exec("underline")} />
          <FmtBtn label={<s>S</s>} title="Strikethrough" onClick={() => exec("strikeThrough")} />
          <FmtDivider />
          <FmtBtn label="H2" title="Heading 2" onClick={() => exec("formatBlock", "<h2>")} />
          <FmtBtn label="H3" title="Heading 3" onClick={() => exec("formatBlock", "<h3>")} />
          <FmtDivider />
          <FmtBtn label="*" title="Bullet list" onClick={() => exec("insertUnorderedList")} />
          <FmtBtn label="#" title="Numbered list" onClick={() => exec("insertOrderedList")} />
          <FmtDivider />
          <FmtBtn label="IMG" title="Insert image" onClick={() => imageInputRef.current?.click()} />
          <FmtDivider />
          <FmtBtn label="<-" title="Undo" onClick={() => exec("undo")} />
          <FmtBtn label="->" title="Redo" onClick={() => exec("redo")} />
        </div>
      </div>

      {/* ── SEO meta strip ── */}
      <div style={{ padding: "14px 18px", background: T.surface, borderRadius: T.radiusSm, border: `1px solid ${T.border}` }}>
        <SectionLabel>Meta Description</SectionLabel>
        <p style={{ fontFamily: T.fontSans, fontSize: 13, color: T.textSecondary, margin: "0 0 10px", lineHeight: 1.6 }}>{blog.metaDescription}</p>
        {blog.keywords?.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {blog.keywords.map((kw, i) => (
              <span key={i} style={{ fontFamily: T.fontMono, fontSize: 10, fontWeight: 500, padding: "3px 10px", background: T.accentLight, color: T.accent, borderRadius: 6 }}>{kw}</span>
            ))}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* ── BLOG DOCUMENT ── */}
      {/* ═══════════════════════════════════════════ */}
      <div style={{ background: T.surface, borderRadius: T.radiusLg, border: `1px solid ${T.border}`, overflow: "hidden" }}>

        {/* Hero image */}
        {blog.heroImage && <BlogImage query={blog.heroImage} onDelete={removeHeroImage} />}

        {/* Title */}
        <div style={{ padding: blog.heroImage ? "24px 40px 16px" : "36px 40px 16px", borderBottom: `1px solid ${T.borderLight}` }}>
          <div style={{ fontFamily: T.fontSans, fontSize: 9, fontWeight: 700, color: T.accent, textTransform: "uppercase", letterSpacing: "1.4px", marginBottom: 12 }}>
            {profile.businessName} · {currentMonth} {new Date().getFullYear()}
          </div>
          <h1 contentEditable suppressContentEditableWarning
            onFocus={e => e.target.style.borderBottomColor = T.accent}
            onBlur={e => { e.target.style.borderBottomColor = "transparent"; setBlog(b => ({ ...b, title: e.target.innerText })); }}
            style={{ fontFamily: T.fontSans, fontSize: 28, fontWeight: 700, color: T.text, margin: 0, lineHeight: 1.3, outline: "none", borderBottom: "2px solid transparent", transition: "border-color 0.2s" }}
          >{blog.title}</h1>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 40px 36px" }}>

          {/* Introduction */}
          {blog.introduction && (
            <div contentEditable suppressContentEditableWarning
              onBlur={e => setBlog(b => ({ ...b, introduction: e.target.innerText }))}
              style={{ fontFamily: T.fontSans, fontSize: 15, lineHeight: 1.8, color: T.textSecondary, marginBottom: 20, outline: "none" }}
            >{blog.introduction}</div>
          )}

          {/* What You'll Learn */}
          {blog.whatYouWillLearn && blog.whatYouWillLearn.length > 0 && (
            <ContentBox label="What You'll Learn" borderColor={T.blue}>
              <BulletList items={blog.whatYouWillLearn} color={T.text} />
            </ContentBox>
          )}

          {/* Who This Is For */}
          {blog.whoThisIsFor && (
            <div style={{ margin: "12px 0 20px", padding: "12px 16px", borderRadius: T.radiusSm, background: T.accentLight, border: `1px solid ${T.accent}33` }}>
              <p style={{ fontFamily: T.fontSans, fontSize: 13, color: T.text, margin: 0, lineHeight: 1.6 }}><strong>Who this is for:</strong> {blog.whoThisIsFor}</p>
            </div>
          )}

          {/* Quick Summary / Key Insights */}
          {(blog.quickSummary || blog.keyInsights) && (
            <ContentBox label={blog.quickSummary ? "Quick Summary" : "Key Insights"} borderColor={T.warm}>
              <BulletList items={blog.quickSummary || blog.keyInsights} color={T.text} />
            </ContentBox>
          )}

          {/* Key Takeaways */}
          {blog.keyTakeaways && blog.keyTakeaways.length > 0 && (
            <ContentBox label="Key Takeaways" borderColor={T.green}>
              <BulletList items={blog.keyTakeaways} color={T.text} />
            </ContentBox>
          )}

          {/* Table of Contents */}
          <TableOfContents sections={blog.sections} />

          {/* ── SECTIONS ── */}
          {blog.sections.map((section, idx) => (
            <div key={idx} style={{ marginBottom: 24, marginTop: idx === 0 ? 8 : 0 }}>

              {/* Section image */}
              {section.image && <BlogImage query={section.image} onDelete={() => removeSectionImage(idx)} />}

              {/* Section heading + rewrite */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
                <h2 contentEditable suppressContentEditableWarning
                  onBlur={e => setBlog(b => ({ ...b, sections: b.sections.map((s, i) => i === idx ? { ...s, heading: e.target.innerText } : s) }))}
                  style={{ fontFamily: T.fontSans, fontSize: 18, fontWeight: 700, color: T.text, margin: 0, outline: "none", flex: 1, lineHeight: 1.35 }}
                >{section.heading}</h2>
                <button onClick={() => rewriteSection(idx)} disabled={rewriting}
                  style={{
                    flexShrink: 0, fontFamily: T.fontSans, fontSize: 10, fontWeight: 600,
                    padding: "5px 12px", borderRadius: 999, border: `1px solid ${T.border}`,
                    background: "transparent", color: T.textSecondary,
                    cursor: rewriting ? "not-allowed" : "pointer", transition: "all 0.15s",
                    opacity: rewriting && rewriteIdx !== idx ? 0.35 : 1,
                    display: "flex", alignItems: "center", gap: 5,
                  }}
                  onMouseEnter={e => { if (!rewriting) { e.currentTarget.style.borderColor = T.accent + "88"; e.currentTarget.style.color = T.accent; e.currentTarget.style.background = T.accentLight; } }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSecondary; e.currentTarget.style.background = "transparent"; }}
                >{rewriting && rewriteIdx === idx ? "Rewriting..." : "* Rewrite"}</button>
              </div>

              {/* Content */}
              <div contentEditable suppressContentEditableWarning
                onBlur={e => setBlog(b => ({ ...b, sections: b.sections.map((s, i) => i === idx ? { ...s, content: e.target.innerText } : s) }))}
                style={{
                  fontFamily: T.fontSans, fontSize: 14, lineHeight: 1.8, color: T.textSecondary,
                  outline: "none", minHeight: 36, padding: "4px 8px", borderRadius: T.radiusSm,
                  margin: "-4px -8px", transition: "background 0.15s", whiteSpace: "pre-wrap",
                }}
                onFocus={e => { e.currentTarget.style.background = T.surfaceAlt; e.currentTarget.style.boxShadow = `inset 0 0 0 1px ${T.accent}33`; }}
                onMouseEnter={e => { if (document.activeElement !== e.currentTarget) e.currentTarget.style.background = T.surfaceAlt; }}
                onMouseLeave={e => { if (document.activeElement !== e.currentTarget) e.currentTarget.style.background = "transparent"; }}
                onBlurCapture={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none"; }}
              >{section.content}</div>

              {/* Example */}
              <ExampleBox text={section.example} />

              {/* Bullet points */}
              <BulletList items={section.bulletPoints} />

              {/* Pro Tip */}
              <ProTipBox text={section.proTip} />

              {/* Statistic */}
              <StatBox stat={section.statistic} />

              {/* Inline CTA */}
              <InlineCtaBlock cta={section.inlineCta} bookingUrl={bookingUrl} />

              {idx < blog.sections.length - 1 && (
                <div style={{ marginTop: 18, height: 1, background: T.borderLight }} />
              )}
            </div>
          ))}

          {/* ── Common Mistakes ── */}
          {blog.commonMistakes && blog.commonMistakes.length > 0 && (
            <ContentBox label="Common Mistakes to Avoid" borderColor={T.danger}>
              <BulletList items={blog.commonMistakes} color={T.text} />
            </ContentBox>
          )}

          {/* ── Tools & Resources ── */}
          {blog.toolsAndResources && blog.toolsAndResources.length > 0 && (
            <div style={{ margin: "16px 0" }}>
              <SectionLabel>Tools & Resources</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {blog.toolsAndResources.map((tool, i) => <ToolCard key={i} tool={tool} />)}
              </div>
            </div>
          )}

          {/* ── Bonus Tips ── */}
          {blog.bonusTips && blog.bonusTips.length > 0 && (
            <ContentBox label="Bonus Tips" borderColor={T.warm}>
              <BulletList items={blog.bonusTips} color={T.text} />
            </ContentBox>
          )}

          {/* ── Predictions ── */}
          {blog.predictions && blog.predictions.length > 0 && (
            <ContentBox label="What's Coming Next" borderColor={T.blue}>
              <BulletList items={blog.predictions} color={T.text} />
            </ContentBox>
          )}

          {/* ── What To Do Now ── */}
          {blog.whatToDoNow && blog.whatToDoNow.length > 0 && (
            <ContentBox label="What You Should Do Now" borderColor={T.green}>
              <BulletList items={blog.whatToDoNow} color={T.text} />
            </ContentBox>
          )}

          {/* ── Quick Recap ── */}
          {blog.quickRecap && blog.quickRecap.length > 0 && (
            <ContentBox label="Quick Recap" borderColor={T.accent}>
              <BulletList items={blog.quickRecap} color={T.text} />
            </ContentBox>
          )}

          {/* ── Expert Tip ── */}
          {blog.expertTip && (
            <div style={{
              margin: "16px 0", padding: "18px 22px", borderRadius: T.radius,
              background: "rgba(0, 210, 160, 0.06)", border: `1px solid rgba(0, 210, 160, 0.18)`,
              borderLeft: `3px solid ${T.green}`,
            }}>
              <div style={{ fontFamily: T.fontSans, fontSize: 10, fontWeight: 700, color: T.green, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Expert Recommendation</div>
              <p style={{ fontFamily: T.fontSans, fontSize: 14, color: T.text, margin: 0, lineHeight: 1.7, fontWeight: 500 }}>{blog.expertTip}</p>
            </div>
          )}

          {/* ── FAQ Section ── */}
          {blog.faq && blog.faq.length > 0 && (
            <div style={{ marginTop: 20, marginBottom: 24 }}>
              <h2 style={{ fontFamily: T.fontSans, fontSize: 20, fontWeight: 700, color: T.text, margin: "0 0 14px" }}>Frequently Asked Questions</h2>
              {blog.faq.map((item, i) => (
                <div key={i} style={{
                  padding: "14px 18px", marginBottom: 8, borderRadius: T.radius,
                  background: T.surfaceAlt, border: `1px solid ${T.border}`,
                }}>
                  <div style={{ fontFamily: T.fontSans, fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 6, lineHeight: 1.4 }}>Q: {item.question}</div>
                  <p style={{ fontFamily: T.fontSans, fontSize: 13, color: T.textSecondary, margin: 0, lineHeight: 1.7 }}>{item.answer}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── Related Questions ── */}
          {blog.relatedQuestions && blog.relatedQuestions.length > 0 && (
            <div style={{ margin: "12px 0 20px" }}>
              <SectionLabel>Related Questions</SectionLabel>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {blog.relatedQuestions.map((q, i) => (
                  <span key={i} style={{
                    fontFamily: T.fontSans, fontSize: 12, padding: "6px 14px", borderRadius: 999,
                    background: T.surfaceAlt, border: `1px solid ${T.border}`, color: T.textSecondary,
                  }}>{q}</span>
                ))}
              </div>
            </div>
          )}

          {/* ── Final CTA ── */}
          <div style={{
            marginTop: 16, padding: "28px", textAlign: "center",
            background: `linear-gradient(135deg, ${T.accentLight} 0%, rgba(77,101,255,0.08) 100%)`,
            borderRadius: T.radiusLg, border: `1px solid ${T.accent}33`,
          }}>
            <SectionLabel>Ready to Book?</SectionLabel>
            <p contentEditable suppressContentEditableWarning
              onBlur={e => setBlog(b => ({ ...b, cta: e.target.innerText }))}
              style={{ fontFamily: T.fontSans, fontSize: 15, color: T.text, margin: "0 0 20px", fontWeight: 500, lineHeight: 1.7, outline: "none" }}
            >{blog.cta || `Ready to book your appointment at ${profile.businessName}? We'd love to help you look and feel your best.`}</p>
            <CtaButton label="Book Appointment →" url={bookingUrl} large />
          </div>
        </div>
      </div>
    </div>
  );
}
