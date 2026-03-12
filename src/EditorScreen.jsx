import React, { useState, useRef, useEffect } from "react";
import { T, currentMonth } from "./constants";
import { Button } from "./components";
import { callClaude } from "./api";
import { fetchUnsplashUrl } from "./imageService";

// ── Hook: resolve an Unsplash image URL async ──
function useUnsplashImage(query, orientation = "landscape") {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (!query) return;
    setUrl(null);
    fetchUnsplashUrl(query, orientation).then(setUrl);
  }, [query, orientation]);
  return url;
}

// ── Formatting toolbar button ──
function FmtBtn({ label, title, onClick, active }) {
  const [flashing, setFlashing] = useState(false);
  const flash = () => { setFlashing(true); setTimeout(() => setFlashing(false), 350); };
  return (
    <button
      title={title}
      onMouseDown={e => { e.preventDefault(); flash(); onClick(); }}
      style={{
        fontFamily: T.fontSans, fontSize: 12, fontWeight: active ? 700 : 500,
        minWidth: 28, height: 26, padding: "0 6px", borderRadius: 6,
        border: `1px solid ${active ? T.accent + "66" : "transparent"}`,
        background: active ? T.accentLight : "transparent",
        color: active ? T.accent : T.textSecondary,
        cursor: "pointer", transition: "background 0.12s, color 0.12s",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: flashing ? "btnFlash 0.35s ease-out forwards" : "none",
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = T.surfaceAlt; e.currentTarget.style.color = T.text; } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.textSecondary; } }}
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
    <div style={{ fontFamily: T.fontSans, fontSize: 10, fontWeight: 700, color: T.accent, textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 10 }}>
      {children}
    </div>
  );
}

function ContentBox({ label, children, borderColor, icon }) {
  return (
    <div style={{
      margin: "20px 0", padding: "20px 24px", borderRadius: T.radius,
      background: T.surfaceAlt, border: `1px solid ${T.border}`,
      borderLeft: borderColor ? `3px solid ${borderColor}` : undefined,
    }}>
      {label && <SectionLabel>{icon ? `${icon}  ${label}` : label}</SectionLabel>}
      {children}
    </div>
  );
}

function BulletList({ items, color }) {
  if (!items || items.length === 0) return null;
  return (
    <ul style={{ fontFamily: T.fontSans, fontSize: 14, color: color || T.textSecondary, lineHeight: 1.85, paddingLeft: 22, margin: "8px 0" }}>
      {items.map((item, i) => <li key={i} style={{ marginBottom: 6 }}>{item}</li>)}
    </ul>
  );
}

function ProTipBox({ text }) {
  if (!text) return null;
  return (
    <div style={{
      margin: "14px 0", padding: "12px 16px", borderRadius: T.radiusSm,
      background: "rgba(0, 210, 160, 0.05)", borderLeft: `2px solid ${T.green}`,
    }}>
      <p style={{ fontFamily: T.fontSans, fontSize: 13, color: T.textSecondary, margin: 0, lineHeight: 1.75 }}>
        <strong style={{ color: T.green, fontWeight: 700 }}>Pro tip: </strong>{text}
      </p>
    </div>
  );
}

function ExampleBox({ text }) {
  if (!text) return null;
  return (
    <p style={{
      fontFamily: T.fontSans, fontSize: 14, color: T.textSecondary,
      margin: "12px 0", lineHeight: 1.75, fontStyle: "italic",
      paddingLeft: 16, borderLeft: `2px solid ${T.border}`,
    }}>{text}</p>
  );
}

function StatBox({ stat }) {
  if (!stat) return null;
  return (
    <div style={{
      margin: "16px 0", padding: "12px 16px", borderRadius: T.radiusSm,
      borderLeft: `3px solid ${T.blue}`, background: T.blueLight,
      display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap",
    }}>
      <span style={{ fontFamily: T.fontSans, fontSize: 22, fontWeight: 800, color: T.blue, lineHeight: 1 }}>{stat.value}</span>
      <span style={{ fontFamily: T.fontSans, fontSize: 13, color: T.text, lineHeight: 1.5 }}>{stat.label}</span>
      {stat.source && <span style={{ fontFamily: T.fontSans, fontSize: 11, color: T.textTertiary }}>— {stat.source}</span>}
    </div>
  );
}

function PullQuoteBlock({ text }) {
  if (!text) return null;
  return (
    <div style={{
      margin: "32px 0", padding: "28px 40px",
      borderTop: `2px solid ${T.accent}`, borderBottom: `2px solid ${T.accent}`,
      textAlign: "center",
    }}>
      <p style={{
        fontFamily: T.fontSerif, fontSize: 24, fontStyle: "italic", color: T.text,
        lineHeight: 1.55, margin: "0 0 12px", letterSpacing: "-0.2px",
      }}>"{text}"</p>
    </div>
  );
}

function InlineCtaBlock({ cta, bookingUrl }) {
  if (!cta) return null;
  return (
    <div style={{
      margin: "20px 0", padding: "18px 22px", borderRadius: T.radius,
      background: T.accentLight, border: `1px solid ${T.accent}33`,
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap",
    }}>
      <p style={{ fontFamily: T.fontSans, fontSize: 14, color: T.text, margin: 0, fontWeight: 500, lineHeight: 1.55, flex: 1, minWidth: 200 }}>{cta.text}</p>
      <CtaButton label={cta.buttonLabel || "Book Now"} url={bookingUrl} />
    </div>
  );
}

function CtaButton({ label, url, large }) {
  const style = {
    fontFamily: T.fontSans, fontSize: large ? 14 : 13, fontWeight: 700,
    padding: large ? "14px 32px" : "11px 24px", borderRadius: 999,
    background: T.accent, color: "#0A0A0A", textDecoration: "none",
    whiteSpace: "nowrap", boxShadow: T.shadowPink, transition: "all 0.15s",
    border: "none", cursor: "pointer", display: "inline-block", letterSpacing: "0.02em",
  };
  const hover = e => { e.currentTarget.style.background = T.accentHover; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(255, 168, 205, 0.45)"; };
  const leave = e => { e.currentTarget.style.background = T.accent; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = T.shadowPink; };
  if (url) return <a href={url} target="_blank" rel="noopener noreferrer" style={style} onMouseEnter={hover} onMouseLeave={leave}>{label}</a>;
  return <span style={style} onMouseEnter={hover} onMouseLeave={leave}>{label}</span>;
}

// ── Hero image: full-width, tall, with gradient overlay ──
function HeroImage({ query, onDelete }) {
  const url = useUnsplashImage(query, "landscape");
  if (!query) return null;
  if (!url) return (
    <div style={{ width: "100%", height: 480, background: T.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontFamily: T.fontSans, fontSize: 12, color: T.textTertiary }}>Loading image…</span>
    </div>
  );
  return (
    <div style={{ position: "relative", width: "100%", height: 480, overflow: "hidden" }}>
      <img
        src={url}
        alt={query}
        onError={() => {}}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(10,10,10,0) 35%, rgba(10,10,10,0.88) 100%)",
      }} />
      <button onClick={onDelete} title="Remove image"
        style={{
          position: "absolute", top: 14, right: 14, width: 32, height: 32, borderRadius: "50%",
          background: "rgba(0,0,0,0.65)", border: `1px solid rgba(255,255,255,0.15)`,
          color: "#fff", fontSize: 13, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(6px)",
        }}
        onMouseEnter={e => e.currentTarget.style.background = T.danger}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.65)"}
      >x</button>
    </div>
  );
}

// ── Section image: standard with caption support ──
function SectionImage({ query, onDelete }) {
  const url = useUnsplashImage(query, "landscape");
  if (!query) return null;
  if (!url) return (
    <div style={{ margin: "20px 0", height: 300, borderRadius: T.radius, background: T.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${T.border}` }}>
      <span style={{ fontFamily: T.fontSans, fontSize: 12, color: T.textTertiary }}>Loading image…</span>
    </div>
  );
  return (
    <div style={{ position: "relative", margin: "20px 0", borderRadius: T.radius, overflow: "hidden", border: `1px solid ${T.border}` }}>
      <img src={url} alt={query} onError={() => {}}
        style={{ width: "100%", height: 300, objectFit: "cover", display: "block" }} />
      <div style={{ padding: "8px 14px", background: T.surfaceAlt }}>
        <p style={{ fontFamily: T.fontSans, fontSize: 11, color: T.textTertiary, margin: 0, fontStyle: "italic" }}>{query}</p>
      </div>
      <button onClick={onDelete} title="Remove image"
        style={{
          position: "absolute", top: 8, right: 8, width: 28, height: 28, borderRadius: "50%",
          background: "rgba(0,0,0,0.65)", border: "none", color: "#fff", fontSize: 13,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}
        onMouseEnter={e => e.currentTarget.style.background = T.danger}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.65)"}
      >x</button>
    </div>
  );
}

// ── Author meta bar: avatar + name + date + reading time ──
function AuthorMetaRow({ businessName, industry, year, readingTime }) {
  const initials = businessName ? businessName.slice(0, 2).toUpperCase() : "ZO";
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexWrap: "wrap", gap: 12, padding: "16px 0", borderBottom: `1px solid ${T.border}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          background: T.accentLight, border: `2px solid ${T.accent}55`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: T.fontSans, fontSize: 13, fontWeight: 800, color: T.accent,
        }}>{initials}</div>
        <div>
          <div style={{ fontFamily: T.fontSans, fontSize: 13, fontWeight: 700, color: T.text }}>{businessName}</div>
          <div style={{ fontFamily: T.fontSans, fontSize: 11, color: T.textTertiary, marginTop: 2 }}>
            {currentMonth} {year} &middot; {industry}
          </div>
        </div>
      </div>
      {readingTime && (
        <span style={{
          fontFamily: T.fontSans, fontSize: 11, fontWeight: 600, color: T.textSecondary,
          padding: "5px 14px", background: T.surfaceAlt, borderRadius: 999, border: `1px solid ${T.border}`,
        }}>
          {readingTime}
        </span>
      )}
    </div>
  );
}

// ── Social share bar ──
function SocialShareRow({ title }) {
  const [linkCopied, setLinkCopied] = useState(false);
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}`;
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(title)}`;
  const pinUrl = `https://pinterest.com/pin/create/button/?description=${encodeURIComponent(title)}`;

  const copyLink = () => {
    navigator.clipboard.writeText(title);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2200);
  };

  const shareItems = [
    { label: "Twitter", url: twitterUrl, color: "#1DA1F2" },
    { label: "Facebook", url: fbUrl, color: "#1877F2" },
    { label: "Pinterest", url: pinUrl, color: "#E60023" },
  ];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 0", borderBottom: `1px solid ${T.border}`, flexWrap: "wrap" }}>
      <span style={{ fontFamily: T.fontSans, fontSize: 11, fontWeight: 600, color: T.textTertiary, marginRight: 4 }}>Share:</span>
      {shareItems.map(({ label, url, color }) => (
        <a key={label} href={url} target="_blank" rel="noopener noreferrer"
          style={{
            fontFamily: T.fontSans, fontSize: 11, fontWeight: 600, padding: "5px 14px",
            borderRadius: 999, border: `1px solid ${T.border}`, color: T.textSecondary,
            textDecoration: "none", background: T.surfaceAlt, transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color; e.currentTarget.style.background = `${color}18`; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSecondary; e.currentTarget.style.background = T.surfaceAlt; }}
        >{label}</a>
      ))}
      <button onClick={copyLink}
        style={{
          fontFamily: T.fontSans, fontSize: 11, fontWeight: 600, padding: "5px 14px",
          borderRadius: 999, border: `1px solid ${linkCopied ? T.green : T.border}`,
          color: linkCopied ? T.green : T.textSecondary,
          background: linkCopied ? T.greenLight : T.surfaceAlt, cursor: "pointer",
          transition: "all 0.2s",
        }}
      >{linkCopied ? "Copied!" : "Copy Link"}</button>
    </div>
  );
}

// ── Table of contents: editorial numbered style ──
function TableOfContents({ sections }) {
  if (!sections || sections.length < 3) return null;
  return (
    <div style={{
      margin: "28px 0", padding: "24px 28px", borderRadius: T.radius,
      background: T.surfaceAlt, border: `1px solid ${T.border}`,
    }}>
      <div style={{ fontFamily: T.fontSans, fontSize: 12, fontWeight: 700, color: T.textSecondary, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16 }}>
        Table of Contents
      </div>
      <ol style={{ margin: 0, paddingLeft: 20 }}>
        {sections.map((s, i) => (
          <li key={i} style={{ marginBottom: 10 }}>
            <span
              style={{ fontFamily: T.fontSans, fontSize: 14, color: T.textSecondary, lineHeight: 1.5, cursor: "pointer", transition: "color 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.color = T.accent; }}
              onMouseLeave={e => { e.currentTarget.style.color = T.textSecondary; }}
            >{s.heading}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ── Tools & resources card ──
function ToolCard({ tool }) {
  return (
    <div style={{
      padding: "14px 18px", borderRadius: T.radiusSm,
      background: T.surface, border: `1px solid ${T.border}`,
      display: "flex", gap: 12, alignItems: "flex-start", transition: "border-color 0.15s",
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = T.borderHover}
      onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
    >
      <div style={{
        width: 36, height: 36, borderRadius: T.radiusSm, flexShrink: 0,
        background: T.accentLight, border: `1px solid ${T.accent}33`,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
      }}>*</div>
      <div>
        <div style={{ fontFamily: T.fontSans, fontSize: 13, fontWeight: 700, color: T.text }}>{tool.name}</div>
        <div style={{ fontFamily: T.fontSans, fontSize: 12, color: T.textSecondary, marginTop: 3, lineHeight: 1.55 }}>{tool.description}</div>
      </div>
    </div>
  );
}

// ── Inline newsletter signup ──
function InlineNewsletter({ businessName }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  return (
    <div style={{
      margin: "32px 0", padding: "24px 28px", borderRadius: T.radius,
      background: T.surfaceAlt, border: `1px solid ${T.border}`, textAlign: "center",
    }}>
      <h3 style={{ fontFamily: T.fontSans, fontSize: 16, fontWeight: 700, color: T.text, margin: "0 0 8px", letterSpacing: "-0.2px" }}>
        Get Expert Tips from {businessName}
      </h3>
      <p style={{ fontFamily: T.fontSans, fontSize: 13, color: T.textSecondary, margin: "0 0 22px", lineHeight: 1.65 }}>
        Join our newsletter for exclusive tips, seasonal trends, and special offers — sent directly to your inbox.
      </p>
      {submitted ? (
        <div style={{ fontFamily: T.fontSans, fontSize: 14, fontWeight: 700, color: T.green }}>You are on the list! We will be in touch soon.</div>
      ) : (
        <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
          <input
            type="email" placeholder="your@email.com" value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              fontFamily: T.fontSans, fontSize: 13, padding: "11px 18px", borderRadius: 999,
              border: `1px solid ${T.border}`, background: T.surface, color: T.text,
              outline: "none", minWidth: 220, transition: "border-color 0.15s",
            }}
            onFocus={e => e.target.style.borderColor = T.accent}
            onBlur={e => e.target.style.borderColor = T.border}
          />
          <button
            onClick={() => { if (email) setSubmitted(true); }}
            style={{
              fontFamily: T.fontSans, fontSize: 13, fontWeight: 700, padding: "11px 26px",
              borderRadius: 999, background: T.accent, color: "#0A0A0A",
              border: "none", cursor: "pointer", boxShadow: T.shadowPink, transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = T.accentHover; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = T.accent; e.currentTarget.style.transform = "none"; }}
          >Subscribe Free</button>
        </div>
      )}
    </div>
  );
}

// ── Related post card (needs own component for hook) ──
function RelatedPostCard({ title, query }) {
  const url = useUnsplashImage(query, "landscape");
  return (
    <div
      style={{
        borderRadius: T.radius, overflow: "hidden",
        background: T.surfaceAlt, border: `1px solid ${T.border}`,
        transition: "all 0.2s", cursor: "pointer",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = T.shadowMd; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{ height: 120, overflow: "hidden", background: T.surface }}>
        {url
          ? <img src={url} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ width: "100%", height: "100%", background: T.surfaceAlt }} />
        }
      </div>
      <div style={{ padding: "14px 16px 16px" }}>
        <div style={{ fontFamily: T.fontSans, fontSize: 13, fontWeight: 600, color: T.text, lineHeight: 1.4, marginBottom: 10 }}>{title}</div>
        <div style={{ fontFamily: T.fontSans, fontSize: 11, fontWeight: 700, color: T.accent }}>Read More</div>
      </div>
    </div>
  );
}

// ── Related posts grid ──
function RelatedPostsSection({ suggestions }) {
  if (!suggestions || suggestions.length === 0) return null;
  const fallbackQueries = ["hair salon beauty styling", "spa wellness treatment", "beauty skincare routine"];
  return (
    <div style={{ marginTop: 44, paddingTop: 36, borderTop: `1px solid ${T.border}` }}>
      <h3 style={{ fontFamily: T.fontSans, fontSize: 17, fontWeight: 700, color: T.text, margin: "0 0 20px", letterSpacing: "-0.2px" }}>
        Continue Reading
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14 }}>
        {suggestions.slice(0, 3).map((title, i) => (
          <RelatedPostCard key={i} title={title} query={fallbackQueries[i % fallbackQueries.length]} />
        ))}
      </div>
    </div>
  );
}

// ── Author/business bio card at the bottom ──
function AuthorBioCard({ businessName, industry, location }) {
  const initials = businessName ? businessName.slice(0, 2).toUpperCase() : "ZO";
  return (
    <div style={{
      marginTop: 36, padding: "26px 30px", borderRadius: T.radiusLg,
      background: T.surfaceAlt, border: `1px solid ${T.border}`,
      display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap",
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
        background: T.accentLight, border: `2px solid ${T.accent}55`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: T.fontSans, fontSize: 18, fontWeight: 800, color: T.accent,
      }}>{initials}</div>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontFamily: T.fontSans, fontSize: 10, fontWeight: 700, color: T.textTertiary, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>Written by</div>
        <div style={{ fontFamily: T.fontSans, fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 6 }}>{businessName}</div>
        <p style={{ fontFamily: T.fontSans, fontSize: 13, color: T.textSecondary, margin: "0 0 12px", lineHeight: 1.65 }}>
          {businessName} is a trusted {industry?.toLowerCase()}{location ? ` in ${location}` : ""}. We're passionate about delivering outstanding results for our clients.
        </p>
        <div style={{ fontFamily: T.fontSans, fontSize: 11, fontWeight: 600, color: T.accent }}>Verified Expert &middot; {industry}</div>
      </div>
    </div>
  );
}

// ── GEO: Quick Answer box (BLUF — Bottom Line Up Front) ──
function GeoAnswerBox({ text }) {
  if (!text) return null;
  return (
    <div style={{
      margin: "0 0 24px", padding: "16px 20px", borderRadius: T.radiusSm,
      background: T.blueLight, borderLeft: `3px solid ${T.blue}`,
    }}>
      <div style={{ fontFamily: T.fontSans, fontSize: 9, fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", color: T.blue, marginBottom: 6 }}>Quick Answer</div>
      <p style={{ fontFamily: T.fontSans, fontSize: 14, color: T.text, margin: 0, lineHeight: 1.75, fontWeight: 400 }}>{text}</p>
    </div>
  );
}

// ── GEO panel: shows schema types and GEO signals ──
function GeoPanel({ blog, businessName }) {
  const hasFaq = blog.faq && blog.faq.length > 0;
  const isHowTo = blog.sections?.some(s => /^step\s+\d/i.test(s.heading));
  const hasStats = blog.sections?.some(s => s.statistic);
  const hasGeoAnswer = !!blog.geoAnswer;
  const hasCitations = blog.sections?.some(s => s.statistic?.source) ||
    blog.quickSummary?.some(s => s.includes("according")) ||
    blog.keyInsights?.some(s => s.includes("according"));

  const schemaTypes = ["Article", hasFaq && "FAQPage", isHowTo && "HowTo"].filter(Boolean);

  const signals = [
    { label: "GEO Answer (BLUF)", pass: hasGeoAnswer },
    { label: "Schema Markup", pass: true, note: schemaTypes.join(", ") },
    { label: "FAQ (AI snippet-ready)", pass: hasFaq },
    { label: "Cited Statistics", pass: hasStats || hasCitations },
    { label: "Entity Consistency", pass: !!businessName },
  ];

  return (
    <div style={{ padding: "14px 18px", background: T.surface, borderRadius: T.radiusSm, border: `1px solid ${T.border}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <SectionLabel>GEO Optimization</SectionLabel>
        <div style={{
          fontFamily: T.fontSans, fontSize: 9, fontWeight: 700, padding: "2px 10px", borderRadius: 999,
          background: T.blueLight, color: T.blue, border: `1px solid rgba(77,101,255,0.3)`,
          textTransform: "uppercase", letterSpacing: "0.5px",
        }}>AI-Ready</div>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        {signals.map(({ label, pass, note }) => (
          <div key={label} style={{
            display: "flex", alignItems: "center", gap: 5,
            fontFamily: T.fontSans, fontSize: 11, fontWeight: 500,
            color: pass ? T.green : T.textTertiary,
            padding: "3px 10px", borderRadius: 999,
            background: pass ? T.greenLight : T.surfaceAlt,
            border: `1px solid ${pass ? "rgba(0,210,160,0.25)" : T.border}`,
          }}>
            <span style={{ fontSize: 10 }}>{pass ? "✓" : "○"}</span>
            {label}{note ? `: ${note}` : ""}
          </div>
        ))}
      </div>
      <p style={{ fontFamily: T.fontSans, fontSize: 11, color: T.textTertiary, margin: 0, lineHeight: 1.6 }}>
        HTML export includes structured JSON-LD schema ({schemaTypes.join(", ")}). Content is structured for citation by ChatGPT, Perplexity, and Google AI Overviews.
      </p>
    </div>
  );
}

// ── Reading progress bar ──
function ReadingProgressBar({ progress }) {
  return (
    <div style={{ height: 3, background: T.border, overflow: "hidden" }}>
      <div style={{
        height: "100%", width: `${progress}%`,
        background: `linear-gradient(to right, ${T.accent}, ${T.blue})`,
        transition: "width 0.1s linear",
      }} />
    </div>
  );
}

// ── Detect "Step N:" prefix in headings ──
function getStepNumber(heading) {
  const match = heading?.match(/^step\s+(\d+)/i);
  return match ? parseInt(match[1]) : null;
}


// ═══════════════════════════════════════════
// Main Editor Component
// ═══════════════════════════════════════════

export default function EditorScreen({ blog, setBlog, profile, onBack, onRegenerate, onSave, generating }) {
  const [rewriteIdx, setRewriteIdx] = useState(null);
  const [rewriting, setRewriting]   = useState(false);
  const [copied, setCopied]         = useState(false);
  const [faqOpen, setFaqOpen]       = useState(new Set());
  const [progress, setProgress]     = useState(0);
  const [showLinkPopup, setShowLinkPopup] = useState(false);
  const [linkUrl, setLinkUrl]       = useState("");
  const [activeFormats, setActiveFormats] = useState({});
  const blogRef                     = useRef(null);
  const imageInputRef               = useRef(null);
  const savedRangeRef               = useRef(null);
  const linkInputRef                = useRef(null);

  // Track active formats on selection change
  useEffect(() => {
    const update = () => {
      setActiveFormats({
        bold:          document.queryCommandState("bold"),
        italic:        document.queryCommandState("italic"),
        underline:     document.queryCommandState("underline"),
        strikeThrough: document.queryCommandState("strikeThrough"),
      });
    };
    document.addEventListener("selectionchange", update);
    return () => document.removeEventListener("selectionchange", update);
  }, []);

  // Reading progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const el = blogRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrolled = Math.max(0, -rect.top);
      const total = el.offsetHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const exec = (cmd, val = null) => document.execCommand(cmd, false, val);

  // Save selection before file picker (which causes focus loss)
  const handleImgClick = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    imageInputRef.current?.click();
  };

  const handleImageFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      // Restore saved selection before inserting
      if (savedRangeRef.current) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(savedRangeRef.current);
      }
      exec("insertImage", ev.target.result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Link popup handlers
  const openLinkPopup = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    setShowLinkPopup(true);
    setTimeout(() => linkInputRef.current?.focus(), 50);
  };

  const insertLink = () => {
    const url = linkUrl.trim();
    if (!url) { setShowLinkPopup(false); return; }
    if (savedRangeRef.current) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
    exec("createLink", url.startsWith("http") ? url : `https://${url}`);
    setShowLinkPopup(false);
    setLinkUrl("");
  };

  const toggleFaq = (i) => {
    setFaqOpen(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const rewriteSection = async (idx) => {
    setRewriting(true); setRewriteIdx(idx);
    try {
      const section = blog.sections[idx];
      const sys = `You are a skilled blog writer for beauty and wellness businesses. Rewrite the given section to be more engaging, scannable (short paragraphs, 2-3 sentences max), and conversion-focused. Return ONLY the rewritten content in plain text, no markdown headers.`;
      const prompt = `Original heading: ${section.heading}\nOriginal content:\n${section.content}\n\nRewrite for a ${profile.industry.toLowerCase()} ${profile.location ? "in " + profile.location : ""}. Keep it short, punchy, scannable. Max 2-3 sentences. Return only the body text.`;
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
      // ── JSON-LD Schema Markup (GEO) ──
      const today = new Date().toISOString().split("T")[0];
      const schemas = [];

      // Article schema
      schemas.push({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": blog.title,
        "description": blog.metaDescription,
        "author": { "@type": "Organization", "name": profile.businessName },
        "publisher": { "@type": "Organization", "name": profile.businessName },
        "datePublished": today,
        "dateModified": today,
        "keywords": blog.keywords?.join(", ") || "",
      });

      // FAQPage schema (if FAQ content exists)
      if (blog.faq && blog.faq.length > 0) {
        schemas.push({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": blog.faq.map(f => ({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": { "@type": "Answer", "text": f.answer },
          })),
        });
      }

      // HowTo schema (detected from "Step N:" headings)
      const howToSteps = blog.sections?.filter(s => /^step\s+\d/i.test(s.heading));
      if (howToSteps && howToSteps.length > 0) {
        schemas.push({
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": blog.title,
          "description": blog.metaDescription,
          "step": howToSteps.map(s => ({
            "@type": "HowToStep",
            "name": s.heading,
            "text": s.content,
          })),
        });
      }

      out = schemas.map(s => `<script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n</script>`).join("\n") + "\n\n";
      out += `<h1>${blog.title}</h1>\n`;
      if (blog.metaDescription) out += `<p><em>${blog.metaDescription}</em></p>\n`;
      if (blog.geoAnswer) out += `<div class="geo-answer"><p>${blog.geoAnswer}</p></div>\n`;
      if (blog.introduction) out += `<p>${blog.introduction}</p>\n`;
      if (blog.pullQuote) out += `<blockquote><em>${blog.pullQuote}</em></blockquote>\n`;
      if (blog.keyTakeaways) out += `<h2>Key Takeaways</h2>\n<ul>${blog.keyTakeaways.map(t => `<li>${t}</li>`).join("")}</ul>\n`;
      blog.sections.forEach(s => {
        out += `<h2>${s.heading}</h2>\n<p>${s.content}</p>\n`;
        if (s.example) out += `<blockquote>${s.example}</blockquote>\n`;
        if (s.bulletPoints) out += `<ul>${s.bulletPoints.map(b => `<li>${b}</li>`).join("")}</ul>\n`;
        if (s.proTip) out += `<p><strong>Pro Tip:</strong> ${s.proTip}</p>\n`;
        if (s.statistic) out += `<p><strong>${s.statistic.value}</strong> — ${s.statistic.label}${s.statistic.source ? ` (${s.statistic.source})` : ""}</p>\n`;
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

  // ── Generation progress bar ──
  const GEN_STEPS = [
    { label: "Analyzing your topic & business…",        pct: 12 },
    { label: "Structuring sections & format…",          pct: 28 },
    { label: "Writing SEO-optimized content…",          pct: 52 },
    { label: "Optimizing for GEO & AI engines…",        pct: 74 },
    { label: "Adding stats, tips & CTAs…",              pct: 88 },
    { label: "Finalizing your blog post…",              pct: 96 },
  ];
  const [genStep, setGenStep] = useState(0);
  useEffect(() => {
    if (!generating) { setGenStep(0); return; }
    setGenStep(0);
    const timers = GEN_STEPS.map((_, i) =>
      setTimeout(() => setGenStep(i), i * 3200)
    );
    return () => timers.forEach(clearTimeout);
  }, [generating]);

  if (generating) {
    const step = GEN_STEPS[genStep] || GEN_STEPS[GEN_STEPS.length - 1];
    return (
      <div style={{ maxWidth: 480, margin: "100px auto 0", padding: "0 24px", animation: "fadeIn 0.3s ease" }}>
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%", margin: "0 auto 20px",
            background: T.accentLight, border: `1px solid ${T.accent}44`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, color: T.accent, animation: "glowPulse 2s ease infinite",
          }}>*</div>
          <h2 style={{ fontFamily: T.font, fontSize: 22, fontWeight: 700, color: T.text, margin: "0 0 6px" }}>
            Writing your blog…
          </h2>
          <p style={{ fontFamily: T.fontSans, fontSize: 13, color: T.textSecondary, margin: 0 }}>
            {profile.businessName}
          </p>
        </div>

        {/* Steps list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
          {GEN_STEPS.map((s, i) => {
            const done    = i < genStep;
            const active  = i === genStep;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 700,
                  background: done ? T.green : active ? T.accent : T.surfaceAlt,
                  color: done || active ? "#0A0A0A" : T.textTertiary,
                  border: `1px solid ${done ? T.green : active ? T.accent : T.border}`,
                  transition: "all 0.4s ease",
                }}>
                  {done ? "✓" : i + 1}
                </div>
                <span style={{
                  fontFamily: T.fontSans, fontSize: 13,
                  color: done ? T.textSecondary : active ? T.text : T.textTertiary,
                  fontWeight: active ? 600 : 400,
                  transition: "color 0.4s ease",
                }}>{s.label}</span>
                {active && (
                  <div style={{ marginLeft: "auto", width: 16, height: 16, borderRadius: "50%", border: `2px solid ${T.border}`, borderTopColor: T.accent, animation: "spin 0.8s linear infinite", flexShrink: 0 }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div style={{ height: 4, background: T.border, borderRadius: 4, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 4,
            background: `linear-gradient(to right, ${T.accent}, ${T.blue})`,
            width: `${step.pct}%`,
            transition: "width 0.8s ease",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
          <span style={{ fontFamily: T.fontMono, fontSize: 10, color: T.textTertiary }}>{step.pct}%</span>
        </div>
      </div>
    );
  }

  if (!blog) return null;
  const bookingUrl = profile.bookingUrl || "";
  const year = new Date().getFullYear();
  // Insert newsletter mid-article (after ~40% of sections, min section index 2)
  const newsletterInsertIdx = Math.max(2, Math.floor((blog.sections?.length || 0) * 0.4));

  return (
    <div ref={blogRef} style={{ display: "flex", flexDirection: "column", gap: 18, animation: "fadeIn 0.3s ease" }}>
      <input ref={imageInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageFile} />

      {/* ── Toolbar ── */}
      <div style={{ background: T.surface, borderRadius: T.radius, border: `1px solid ${T.border}`, position: "sticky", top: 52, zIndex: 10 }}>
        <ReadingProgressBar progress={progress} />
        {/* Row 1: nav + copy */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, padding: "11px 16px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Button variant="ghost" size="sm" onClick={onBack}>Left New blog</Button>
            <Button variant="secondary" size="sm" onClick={onRegenerate}>Regenerate</Button>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {blog.wordCount > 0 && (
              <span style={{ fontFamily: T.fontSans, fontSize: 10, fontWeight: 600, color: T.textTertiary, padding: "4px 10px", background: T.surfaceAlt, borderRadius: 999, border: `1px solid ${T.border}` }}>~{blog.wordCount} words</span>
            )}
            {blog.readingTime && (
              <span style={{ fontFamily: T.fontSans, fontSize: 10, fontWeight: 600, color: T.textTertiary, padding: "4px 10px", background: T.surfaceAlt, borderRadius: 999, border: `1px solid ${T.border}` }}>{blog.readingTime}</span>
            )}
            <Button variant="secondary" size="sm" onClick={() => copyAs("text")}>{copied ? "Copied!" : "Copy Text"}</Button>
            <Button variant="secondary" size="sm" onClick={() => copyAs("html")}>{copied ? "Copied!" : "Copy HTML"}</Button>

            {/* ── Save divider ── */}
            <div style={{ width: 1, height: 18, background: T.border, margin: "0 2px" }} />

            <button
              onClick={() => onSave("draft")}
              style={{
                fontFamily: T.fontSans, fontSize: 12, fontWeight: 600,
                padding: "6px 14px", borderRadius: 999,
                border: `1px solid ${T.border}`,
                background: "transparent", color: T.textSecondary,
                cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.color = T.text; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSecondary; }}
            >Save Draft</button>

            <button
              onClick={() => onSave("published")}
              style={{
                fontFamily: T.fontSans, fontSize: 12, fontWeight: 700,
                padding: "6px 16px", borderRadius: 999,
                border: "none", background: T.accent, color: "#0A0A0A",
                cursor: "pointer", boxShadow: T.shadowPink, transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = T.accentHover; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = T.accent; e.currentTarget.style.transform = "none"; }}
            >Publish</button>
          </div>
        </div>
        {/* Row 2: formatting */}
        <div style={{ display: "flex", alignItems: "center", gap: 2, padding: "6px 12px", flexWrap: "wrap" }}>
          <FmtBtn label={<b>B</b>} title="Bold" onClick={() => exec("bold")} active={activeFormats.bold} />
          <FmtBtn label={<i>I</i>} title="Italic" onClick={() => exec("italic")} active={activeFormats.italic} />
          <FmtBtn label={<u>U</u>} title="Underline" onClick={() => exec("underline")} active={activeFormats.underline} />
          <FmtBtn label={<s>S</s>} title="Strikethrough" onClick={() => exec("strikeThrough")} active={activeFormats.strikeThrough} />
          <FmtDivider />
          <FmtBtn label="H2" title="Heading 2" onClick={() => exec("formatBlock", "<h2>")} />
          <FmtBtn label="H3" title="Heading 3" onClick={() => exec("formatBlock", "<h3>")} />
          <FmtDivider />
          <FmtBtn label="*" title="Bullet list" onClick={() => exec("insertUnorderedList")} />
          <FmtBtn label="1." title="Numbered list" onClick={() => exec("insertOrderedList")} />
          <FmtDivider />
          <FmtBtn label="IMG" title="Insert image" onClick={handleImgClick} />

          {/* Link button with anchored popup */}
          <div style={{ position: "relative" }}>
            <FmtBtn
              label="🔗"
              title="Insert link"
              onClick={openLinkPopup}
              active={showLinkPopup}
            />
            {showLinkPopup && (
              <div style={{
                position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 200,
                display: "flex", alignItems: "center", gap: 6,
                background: T.surface, border: `1px solid ${T.border}`,
                borderRadius: T.radiusSm, padding: "6px 10px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                whiteSpace: "nowrap",
              }}>
                <input
                  ref={linkInputRef}
                  value={linkUrl}
                  onChange={e => setLinkUrl(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") insertLink(); if (e.key === "Escape") { setShowLinkPopup(false); setLinkUrl(""); } }}
                  placeholder="https://example.com"
                  style={{
                    fontFamily: T.fontSans, fontSize: 12, width: 220,
                    background: T.surfaceAlt, border: `1px solid ${T.border}`,
                    borderRadius: 6, padding: "5px 10px", color: T.text, outline: "none",
                  }}
                  onFocus={e => e.target.style.borderColor = T.accent}
                  onBlur={e => e.target.style.borderColor = T.border}
                />
                <button onClick={insertLink} style={{
                  fontFamily: T.fontSans, fontSize: 11, fontWeight: 700,
                  padding: "5px 12px", borderRadius: 6, border: "none",
                  background: T.accent, color: "#0A0A0A", cursor: "pointer",
                }}>Insert</button>
                <button onClick={() => { setShowLinkPopup(false); setLinkUrl(""); }} style={{
                  fontFamily: T.fontSans, fontSize: 11,
                  padding: "5px 8px", borderRadius: 6,
                  border: `1px solid ${T.border}`, background: "transparent",
                  color: T.textTertiary, cursor: "pointer",
                }}>✕</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* ── BLOG DOCUMENT ── */}
      {/* ═══════════════════════════════════════════ */}
      <div style={{ background: T.surface, borderRadius: T.radiusLg, border: `1px solid ${T.border}`, overflow: "hidden" }}>

        {/* Hero image — full width, tall, gradient */}
        {blog.heroImage && <HeroImage query={blog.heroImage} onDelete={removeHeroImage} />}

        {/* Title area */}
        <div style={{ padding: blog.heroImage ? "32px 56px 20px" : "52px 56px 20px" }}>

          {/* Category + date badges above title */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <span style={{
              fontFamily: T.fontSans, fontSize: 10, fontWeight: 700,
              padding: "3px 13px", borderRadius: 999,
              background: T.accentLight, color: T.accent, letterSpacing: "0.5px", textTransform: "uppercase",
            }}>{profile.industry}</span>
            <span style={{ fontFamily: T.fontSans, fontSize: 11, color: T.textTertiary }}>{currentMonth} {year}</span>
          </div>

          {/* Title — large, Instrument Serif */}
          <h1
            contentEditable suppressContentEditableWarning
            onBlur={e => setBlog(b => ({ ...b, title: e.target.innerText }))}
            style={{
              fontFamily: T.fontSerif, fontSize: 44, fontWeight: 700, color: T.text,
              margin: "0 0 22px", lineHeight: 1.18, outline: "none",
              letterSpacing: "-0.5px", cursor: "text",
            }}
          >{blog.title}</h1>

          {/* Author meta row */}
          <AuthorMetaRow
            businessName={profile.businessName}
            industry={profile.industry}
            year={year}
            readingTime={blog.readingTime}
          />

        </div>

        {/* Body */}
        <div style={{ padding: "8px 56px 52px" }}>

          {/* GEO Quick Answer — BLUF box */}
          <GeoAnswerBox text={blog.geoAnswer} />

          {/* Introduction — large, primary color */}
          {blog.introduction && (
            <div
              contentEditable suppressContentEditableWarning
              onBlur={e => setBlog(b => ({ ...b, introduction: e.target.innerText }))}
              style={{
                fontFamily: T.fontSans, fontSize: 17, lineHeight: 1.88, color: T.text,
                marginBottom: 28, outline: "none", fontWeight: 400,
              }}
            >{blog.introduction}</div>
          )}

          {/* What You'll Learn */}
          {blog.whatYouWillLearn && blog.whatYouWillLearn.length > 0 && (
            <div style={{ margin: "20px 0 24px" }}>
              <h3 style={{ fontFamily: T.fontSans, fontSize: 13, fontWeight: 700, color: T.textSecondary, textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 10px" }}>What You'll Learn</h3>
              <BulletList items={blog.whatYouWillLearn} color={T.text} />
            </div>
          )}

          {/* Who This Is For */}
          {blog.whoThisIsFor && (
            <p style={{ fontFamily: T.fontSans, fontSize: 14, color: T.textSecondary, margin: "0 0 20px", lineHeight: 1.7 }}>
              <strong style={{ color: T.text }}>Who this is for:</strong> {blog.whoThisIsFor}
            </p>
          )}

          {/* Quick Summary / Key Insights */}
          {(blog.quickSummary || blog.keyInsights) && (
            <div style={{ margin: "20px 0 24px" }}>
              <h3 style={{ fontFamily: T.fontSans, fontSize: 13, fontWeight: 700, color: T.textSecondary, textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 10px" }}>{blog.quickSummary ? "Quick Summary" : "Key Insights"}</h3>
              <BulletList items={blog.quickSummary || blog.keyInsights} color={T.text} />
            </div>
          )}

          {/* Key Takeaways */}
          {blog.keyTakeaways && blog.keyTakeaways.length > 0 && (
            <div style={{ margin: "20px 0 28px" }}>
              <h3 style={{ fontFamily: T.fontSans, fontSize: 13, fontWeight: 700, color: T.textSecondary, textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 10px" }}>Key Takeaways</h3>
              <BulletList items={blog.keyTakeaways} color={T.text} />
            </div>
          )}

          {/* Pull Quote */}
          <PullQuoteBlock text={blog.pullQuote} />

          {/* Table of Contents */}
          <TableOfContents sections={blog.sections} />

          {/* ── SECTIONS ── */}
          {blog.sections.map((section, idx) => {
            const stepNum = getStepNumber(section.heading);
            return (
              <React.Fragment key={idx}>
                {/* Newsletter inserted mid-article */}
                {idx === newsletterInsertIdx && idx > 0 && (
                  <InlineNewsletter businessName={profile.businessName} />
                )}

                <div style={{ marginBottom: 36, marginTop: idx === 0 ? 8 : 20 }}>

                  {/* Section image */}
                  {section.image && <SectionImage query={section.image} onDelete={() => removeSectionImage(idx)} />}

                  {/* Section heading row */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: stepNum !== null ? 16 : 0, marginBottom: 12 }}>
                    {/* Numbered step badge for how-to */}
                    {stepNum !== null && (
                      <div style={{
                        width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                        background: T.accent, color: "#0A0A0A",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: T.fontSans, fontSize: 15, fontWeight: 800,
                        boxShadow: T.shadowPink, marginTop: 3,
                      }}>{stepNum}</div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                        <h2
                          contentEditable suppressContentEditableWarning
                          onBlur={e => setBlog(b => ({ ...b, sections: b.sections.map((s, i) => i === idx ? { ...s, heading: e.target.innerText } : s) }))}
                          style={{ fontFamily: T.fontSans, fontSize: 22, fontWeight: 700, color: T.text, margin: 0, outline: "none", flex: 1, lineHeight: 1.3 }}
                        >{section.heading}</h2>
                        <button onClick={() => rewriteSection(idx)} disabled={rewriting}
                          style={{
                            flexShrink: 0, fontFamily: T.fontSans, fontSize: 10, fontWeight: 600,
                            padding: "5px 12px", borderRadius: 999, border: `1px solid ${T.border}`,
                            background: "transparent", color: T.textSecondary,
                            cursor: rewriting ? "not-allowed" : "pointer", transition: "all 0.15s",
                            opacity: rewriting && rewriteIdx !== idx ? 0.35 : 1,
                            display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap",
                          }}
                          onMouseEnter={e => { if (!rewriting) { e.currentTarget.style.borderColor = T.accent + "88"; e.currentTarget.style.color = T.accent; e.currentTarget.style.background = T.accentLight; } }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSecondary; e.currentTarget.style.background = "transparent"; }}
                        >{rewriting && rewriteIdx === idx ? "Rewriting..." : "* Rewrite"}</button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div
                    contentEditable suppressContentEditableWarning
                    onBlur={e => setBlog(b => ({ ...b, sections: b.sections.map((s, i) => i === idx ? { ...s, content: e.target.innerText } : s) }))}
                    style={{
                      fontFamily: T.fontSans, fontSize: 15, lineHeight: 1.88, color: T.textSecondary,
                      outline: "none", minHeight: 36, padding: "4px 8px", borderRadius: T.radiusSm,
                      margin: "-4px -8px", transition: "background 0.15s", whiteSpace: "pre-wrap",
                    }}
                    onFocus={e => { e.currentTarget.style.background = T.surfaceAlt; e.currentTarget.style.boxShadow = `inset 0 0 0 1px ${T.accent}33`; }}
                    onMouseEnter={e => { if (document.activeElement !== e.currentTarget) e.currentTarget.style.background = T.surfaceAlt; }}
                    onMouseLeave={e => { if (document.activeElement !== e.currentTarget) e.currentTarget.style.background = "transparent"; }}
                    onBlurCapture={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none"; }}
                  >{section.content}</div>

                  <ExampleBox text={section.example} />
                  <BulletList items={section.bulletPoints} />
                  <ProTipBox text={section.proTip} />
                  <StatBox stat={section.statistic} />
                  <InlineCtaBlock cta={section.inlineCta} bookingUrl={bookingUrl} />

                  {idx < blog.sections.length - 1 && (
                    <div style={{ marginTop: 30, height: 1, background: T.borderLight }} />
                  )}
                </div>
              </React.Fragment>
            );
          })}

          {/* ── Common Mistakes ── */}
          {blog.commonMistakes && blog.commonMistakes.length > 0 && (
            <div style={{ margin: "28px 0" }}>
              <h2 style={{ fontFamily: T.fontSans, fontSize: 20, fontWeight: 700, color: T.text, margin: "0 0 12px", letterSpacing: "-0.2px" }}>Common Mistakes to Avoid</h2>
              <BulletList items={blog.commonMistakes} color={T.text} />
            </div>
          )}

          {/* ── Tools & Resources ── */}
          {blog.toolsAndResources && blog.toolsAndResources.length > 0 && (
            <div style={{ margin: "28px 0" }}>
              <h2 style={{ fontFamily: T.fontSans, fontSize: 20, fontWeight: 700, color: T.text, margin: "0 0 14px", letterSpacing: "-0.2px" }}>Tools &amp; Resources</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {blog.toolsAndResources.map((tool, i) => <ToolCard key={i} tool={tool} />)}
              </div>
            </div>
          )}

          {/* ── Bonus Tips ── */}
          {blog.bonusTips && blog.bonusTips.length > 0 && (
            <div style={{ margin: "28px 0" }}>
              <h2 style={{ fontFamily: T.fontSans, fontSize: 20, fontWeight: 700, color: T.text, margin: "0 0 12px", letterSpacing: "-0.2px" }}>Bonus Tips</h2>
              <BulletList items={blog.bonusTips} color={T.text} />
            </div>
          )}

          {/* ── Predictions ── */}
          {blog.predictions && blog.predictions.length > 0 && (
            <div style={{ margin: "28px 0" }}>
              <h2 style={{ fontFamily: T.fontSans, fontSize: 20, fontWeight: 700, color: T.text, margin: "0 0 12px", letterSpacing: "-0.2px" }}>What's Coming Next</h2>
              <BulletList items={blog.predictions} color={T.text} />
            </div>
          )}

          {/* ── What To Do Now ── */}
          {blog.whatToDoNow && blog.whatToDoNow.length > 0 && (
            <div style={{ margin: "28px 0" }}>
              <h2 style={{ fontFamily: T.fontSans, fontSize: 20, fontWeight: 700, color: T.text, margin: "0 0 12px", letterSpacing: "-0.2px" }}>What You Should Do Now</h2>
              <BulletList items={blog.whatToDoNow} color={T.text} />
            </div>
          )}

          {/* ── Quick Recap ── */}
          {blog.quickRecap && blog.quickRecap.length > 0 && (
            <div style={{ margin: "28px 0" }}>
              <h2 style={{ fontFamily: T.fontSans, fontSize: 20, fontWeight: 700, color: T.text, margin: "0 0 12px", letterSpacing: "-0.2px" }}>Quick Recap</h2>
              <BulletList items={blog.quickRecap} color={T.text} />
            </div>
          )}

          {/* ── Expert Tip ── */}
          {blog.expertTip && (
            <ProTipBox text={blog.expertTip} />
          )}

          {/* ── FAQ — accordion ── */}
          {blog.faq && blog.faq.length > 0 && (
            <div style={{ marginTop: 32, marginBottom: 32 }}>
              <h2 style={{ fontFamily: T.fontSans, fontSize: 24, fontWeight: 700, color: T.text, margin: "0 0 18px", letterSpacing: "-0.3px" }}>Frequently Asked Questions</h2>
              {blog.faq.map((item, i) => (
                <div key={i} style={{
                  marginBottom: 8, borderRadius: T.radius, overflow: "hidden",
                  border: `1px solid ${faqOpen.has(i) ? T.accent + "55" : T.border}`,
                  background: faqOpen.has(i) ? T.surfaceAlt : T.surface,
                  transition: "all 0.2s",
                }}>
                  <button
                    onClick={() => toggleFaq(i)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14,
                      padding: "17px 22px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left",
                    }}
                  >
                    <span style={{ fontFamily: T.fontSans, fontSize: 14, fontWeight: 700, color: faqOpen.has(i) ? T.accent : T.text, lineHeight: 1.4, flex: 1 }}>
                      {item.question}
                    </span>
                    <span style={{
                      fontFamily: T.fontSans, fontSize: 18, color: faqOpen.has(i) ? T.accent : T.textTertiary,
                      transform: faqOpen.has(i) ? "rotate(45deg)" : "none",
                      transition: "transform 0.2s, color 0.2s", flexShrink: 0, lineHeight: 1,
                    }}>+</span>
                  </button>
                  {faqOpen.has(i) && (
                    <div style={{ padding: "0 22px 20px" }}>
                      <p style={{ fontFamily: T.fontSans, fontSize: 14, color: T.textSecondary, margin: 0, lineHeight: 1.8 }}>{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── Related Questions / People Also Ask ── */}
          {blog.relatedQuestions && blog.relatedQuestions.length > 0 && (
            <div style={{ margin: "16px 0 28px" }}>
              <SectionLabel>People Also Ask</SectionLabel>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {blog.relatedQuestions.map((q, i) => (
                  <span key={i}
                    style={{
                      fontFamily: T.fontSans, fontSize: 12, padding: "7px 16px", borderRadius: 999,
                      background: T.surfaceAlt, border: `1px solid ${T.border}`, color: T.textSecondary,
                      cursor: "default", transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.color = T.text; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSecondary; }}
                  >{q}</span>
                ))}
              </div>
            </div>
          )}

          {/* ── Final CTA ── */}
          <div style={{
            marginTop: 20, padding: "44px 40px", textAlign: "center",
            background: `linear-gradient(135deg, rgba(255, 168, 205, 0.12) 0%, rgba(77,101,255,0.08) 100%)`,
            borderRadius: T.radiusLg, border: `1px solid ${T.accent}44`,
          }}>
            <div style={{ fontFamily: T.fontSans, fontSize: 10, fontWeight: 700, color: T.accent, textTransform: "uppercase", letterSpacing: "1.4px", marginBottom: 16 }}>
              Ready to Transform Your Look?
            </div>
            <p
              contentEditable suppressContentEditableWarning
              onBlur={e => setBlog(b => ({ ...b, cta: e.target.innerText }))}
              style={{
                fontFamily: T.fontSerif, fontSize: 22, fontStyle: "italic", color: T.text,
                margin: "0 auto 28px", fontWeight: 400, lineHeight: 1.65, outline: "none",
                maxWidth: 560, display: "block",
              }}
            >{blog.cta || `Ready to book your appointment at ${profile.businessName}? We would love to help you look and feel your very best.`}</p>
            <CtaButton label={`Book at ${profile.businessName}`} url={bookingUrl} large />
            {bookingUrl && (
              <p style={{ fontFamily: T.fontSans, fontSize: 11, color: T.textTertiary, marginTop: 14 }}>
                Easy online booking &middot; No deposit required &middot; Cancel anytime
              </p>
            )}
          </div>

          {/* ── Related Posts ── */}
          <RelatedPostsSection suggestions={blog.relatedPostSuggestions} />

          {/* ── Author Bio Card ── */}
          <AuthorBioCard
            businessName={profile.businessName}
            industry={profile.industry}
            location={profile.location}
          />
        </div>
      </div>
    </div>
  );
}
