import React, { useState } from "react";
import { T, INDUSTRIES, CLIENT_TYPES } from "./constants";
import { ZocaLogo, Button } from "./components";

const STEP_LABELS = {
  1: "Business Details",
  2: "Audience",
  3: "Style",
};

// ── Pill button ──
function Pill({ label, active, onClick, removable }) {
  return (
    <button onClick={onClick} style={{
      fontFamily: T.fontSans, fontSize: 13, fontWeight: active ? 600 : 400,
      padding: removable ? "6px 10px 6px 14px" : "8px 16px",
      borderRadius: "999px",
      border: `1px solid ${active ? T.accent : T.border}`,
      background: active ? T.accentLight : "transparent",
      color: active ? T.accent : T.textSecondary,
      cursor: "pointer", transition: "all 0.15s",
      display: "inline-flex", alignItems: "center", gap: 6, whiteSpace: "nowrap",
    }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.color = T.text; } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSecondary; } }}
    >
      {label}
      {removable && (
        <span style={{
          fontSize: 14, lineHeight: 1, color: T.accent, opacity: 0.7,
          fontWeight: 400, marginTop: -1,
        }}>×</span>
      )}
    </button>
  );
}

// ── Shared page wrapper ──
function Page({ step, children }) {
  const isWelcome = step === 0;
  const progress = isWelcome ? 0 : (step / 3) * 100;

  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", flexDirection: "column" }}>
      {/* Top nav */}
      <div style={{ padding: "22px 48px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <ZocaLogo height={16} color={T.text} />
        {!isWelcome && (
          <div style={{ fontFamily: T.fontSans, fontSize: 12, fontWeight: 600, color: T.textSecondary, letterSpacing: "0.02em" }}>
            <span style={{ color: T.accent }}>Step {step} of 3</span>
            <span style={{ color: T.textTertiary }}> — {STEP_LABELS[step]}</span>
          </div>
        )}
      </div>

      {/* Progress bar (steps only) */}
      {!isWelcome && (
        <div style={{ height: 2, background: T.border, position: "relative" }}>
          <div style={{
            position: "absolute", left: 0, top: 0, height: "100%",
            width: `${progress}%`, background: T.accent,
            transition: "width 0.4s ease",
            boxShadow: `0 0 8px ${T.accentGlow}`,
          }} />
        </div>
      )}

      {/* Content */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "32px 48px 56px",
      }}>
        <div style={{ width: "100%", maxWidth: 560, animation: "fadeSlideIn 0.28s ease" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Step heading block ──
function StepHead({ label, title, subtitle }) {
  return (
    <div style={{ marginBottom: 36 }}>
      {label && (
        <div style={{
          fontFamily: T.fontSans, fontSize: 10, fontWeight: 700,
          color: T.accent, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 14,
        }}>
          {label}
        </div>
      )}
      <h1 style={{
        fontFamily: T.font, fontSize: 34, fontWeight: 700, color: T.text,
        margin: 0, lineHeight: 1.15, letterSpacing: "-0.4px",
      }}>
        {title}
      </h1>
      {subtitle && (
        <p style={{
          fontFamily: T.fontSans, fontSize: 14, color: T.textSecondary,
          marginTop: 12, lineHeight: 1.65, maxWidth: 480,
        }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ── Underline big input ──
function BigInput({ value, onChange, placeholder, onKeyDown, autoFocus }) {
  return (
    <input
      value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} autoFocus={autoFocus} onKeyDown={onKeyDown}
      style={{
        fontFamily: T.font, fontSize: 26, fontWeight: 600,
        padding: "0 0 12px", border: "none", borderBottom: `2px solid ${T.border}`,
        background: "transparent", color: T.text, outline: "none", width: "100%",
        transition: "border-color 0.2s",
      }}
      onFocus={e => e.target.style.borderBottomColor = T.accent}
      onBlur={e => e.target.style.borderBottomColor = T.border}
    />
  );
}

// ── Helper text ──
function Helper({ children }) {
  return (
    <p style={{ fontFamily: T.fontSans, fontSize: 11, color: T.textTertiary, margin: "8px 0 0", lineHeight: 1.5 }}>
      {children}
    </p>
  );
}

// ── Field label ──
function FieldLabel({ children }) {
  return (
    <div style={{
      fontFamily: T.fontSans, fontSize: 10, fontWeight: 700,
      color: T.textSecondary, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10,
    }}>
      {children}
    </div>
  );
}

// ── Nav row ──
function NavRow({ onBack, onContinue, continueLabel = "Continue →", disabled }) {
  return (
    <div style={{ marginTop: 48, display: "flex", justifyContent: onBack ? "space-between" : "flex-end", alignItems: "center" }}>
      {onBack && <Button variant="ghost" size="md" onClick={onBack}>← Back</Button>}
      <Button variant="primary" size="lg" onClick={onContinue} disabled={disabled}>
        {continueLabel}
      </Button>
    </div>
  );
}


export default function OnboardingScreen({ profile, setProfile, onComplete }) {
  const [step, setStep]                   = useState(0);
  const [customIndustry, setCustomIndustry] = useState("");
  const [showCustomIndustry, setShowCustomIndustry] = useState(false);
  const [extraIndustries, setExtraIndustries] = useState([]);
  const [customClients, setCustomClients] = useState([]);
  const [clientInput, setClientInput]     = useState("");

  const allClients = [...CLIENT_TYPES, ...customClients];

  // ── Handlers ──
  const selectIndustry = (ind) => {
    if (ind === "__other__") { setShowCustomIndustry(true); setProfile(p => ({ ...p, industry: "" })); }
    else { setShowCustomIndustry(false); setCustomIndustry(""); setProfile(p => ({ ...p, industry: ind })); }
  };

  const confirmCustomIndustry = () => {
    const val = customIndustry.trim();
    if (val) {
      setExtraIndustries(prev => prev.includes(val) ? prev : [...prev, val]);
      setProfile(p => ({ ...p, industry: val }));
      setShowCustomIndustry(false);
      setCustomIndustry("");
    }
  };

  const addClient = () => {
    const val = clientInput.trim();
    if (val && !allClients.includes(val)) {
      setCustomClients(prev => [...prev, val]);
      setProfile(p => ({ ...p, clientType: val }));
      setClientInput("");
    }
  };

  const canStep1 = profile.businessName.trim() && profile.industry;

  // ════════════════════════════════════════════
  // WELCOME
  // ════════════════════════════════════════════
  if (step === 0) return (
    <Page step={0}>
      <div style={{ textAlign: "center" }}>
        {/* Glow badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "6px 14px", borderRadius: 999,
          background: T.accentLight, border: `1px solid ${T.accent}44`,
          fontFamily: T.fontSans, fontSize: 11, fontWeight: 600, color: T.accent,
          letterSpacing: "0.06em", textTransform: "uppercase",
          marginBottom: 28,
        }}>
          ✦ AI-Powered Blog Generator
        </div>

        <h1 style={{
          fontFamily: T.font, fontSize: 44, fontWeight: 700, color: T.text,
          margin: "0 0 20px", lineHeight: 1.1, letterSpacing: "-0.8px",
        }}>
          Increase Your Sales<br />
          <span style={{ color: T.accent }}>with AI-Powered Blogs</span>
        </h1>

        <p style={{
          fontFamily: T.fontSans, fontSize: 15, color: T.textSecondary,
          margin: "0 auto 36px", maxWidth: 420, lineHeight: 1.7,
        }}>
          Generate blog posts that help your business show up when customers search
          for what you offer — and turn those searches into sales.
        </p>

        {/* Feature bullets */}
        <div style={{
          display: "flex", flexDirection: "column", gap: 12,
          textAlign: "left", maxWidth: 320, margin: "0 auto 40px",
          padding: "20px 24px", background: T.surface,
          border: `1px solid ${T.border}`, borderRadius: T.radius,
        }}>
          {[
            { icon: "⚡", text: "Create your first blog in under 60 seconds" },
            { icon: "✍️", text: "No writing required" },
            { icon: "✏️", text: "You can edit everything later" },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 16 }}>{icon}</span>
              <span style={{ fontFamily: T.fontSans, fontSize: 13, color: T.textSecondary, fontWeight: 500 }}>{text}</span>
            </div>
          ))}
        </div>

        <Button variant="primary" size="lg" onClick={() => setStep(1)} style={{ minWidth: 200, justifyContent: "center" }}>
          Get started →
        </Button>

        <p style={{ fontFamily: T.fontSans, fontSize: 11, color: T.textTertiary, marginTop: 14 }}>
          Free to use · No credit card required
        </p>
      </div>
    </Page>
  );

  // ════════════════════════════════════════════
  // STEP 1 — Business Details
  // ════════════════════════════════════════════
  if (step === 1) return (
    <Page step={1}>
      <StepHead
        title="Tell us about your business"
        subtitle="We'll use this information to generate blog topics that help customers find you on Google."
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {/* Business Name */}
        <div>
          <FieldLabel>Business Name</FieldLabel>
          <BigInput
            value={profile.businessName}
            onChange={v => setProfile(p => ({ ...p, businessName: v }))}
            placeholder="Zomato"
            autoFocus
            onKeyDown={e => e.key === "Enter" && canStep1 && setStep(2)}
          />
        </div>

        {/* Industry */}
        <div>
          <FieldLabel>Industry</FieldLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[...INDUSTRIES, ...extraIndustries].map(ind => (
              <Pill key={ind} label={ind}
                active={profile.industry === ind && !showCustomIndustry}
                onClick={() => selectIndustry(ind)}
              />
            ))}
            <Pill label="+ Other" active={showCustomIndustry} onClick={() => selectIndustry("__other__")} />
          </div>

          {showCustomIndustry && (
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <input
                value={customIndustry} onChange={e => setCustomIndustry(e.target.value)}
                onKeyDown={e => e.key === "Enter" && confirmCustomIndustry()}
                placeholder="e.g. Event Planning, Non-profit…" autoFocus
                style={{
                  flex: 1, fontFamily: T.fontSans, fontSize: 13, padding: "10px 14px",
                  borderRadius: T.radiusSm, border: `1px solid ${T.accent}`,
                  background: T.surface, color: T.text, outline: "none",
                  boxShadow: `0 0 0 3px ${T.accentGlow}`,
                }}
              />
              <button onClick={confirmCustomIndustry} disabled={!customIndustry.trim()} style={{
                fontFamily: T.fontSans, fontSize: 12, fontWeight: 600,
                padding: "10px 18px", borderRadius: T.radiusSm, border: "none",
                background: customIndustry.trim() ? T.accent : T.border,
                color: customIndustry.trim() ? "#0A0A0A" : T.textTertiary,
                cursor: customIndustry.trim() ? "pointer" : "not-allowed", flexShrink: 0,
              }}>
                Set →
              </button>
            </div>
          )}
        </div>

        {/* Location */}
        <div>
          <FieldLabel>Location <span style={{ fontWeight: 400, textTransform: "none", color: T.textTertiary, letterSpacing: 0 }}>(optional)</span></FieldLabel>
          <BigInput
            value={profile.location}
            onChange={v => setProfile(p => ({ ...p, location: v }))}
            placeholder="Austin, Texas"
          />
          <Helper>Your location helps us create blog content that ranks for local searches.</Helper>
        </div>
      </div>

      <NavRow onContinue={() => setStep(2)} disabled={!canStep1} />
    </Page>
  );

  // ════════════════════════════════════════════
  // STEP 2 — Audience
  // ════════════════════════════════════════════
  if (step === 2) return (
    <Page step={2}>
      <StepHead
        title="Who are your customers?"
        subtitle="This helps us tailor blog content to the right audience and speak their language."
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Customer type pills */}
        <div>
          <FieldLabel>Customer type <span style={{ fontWeight: 400, textTransform: "none", color: T.textTertiary, letterSpacing: 0 }}>(optional)</span></FieldLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {allClients.map(ct => (
              <Pill key={ct} label={ct}
                active={profile.clientType === ct}
                onClick={() => setProfile(p => ({ ...p, clientType: p.clientType === ct ? "" : ct }))}
              />
            ))}
          </div>
        </div>

        {/* Add custom client */}
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={clientInput} onChange={e => setClientInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addClient()}
            placeholder="Add a customer type…"
            style={{
              flex: 1, fontFamily: T.fontSans, fontSize: 13,
              padding: "9px 14px", borderRadius: 999,
              border: `1px solid ${T.border}`,
              background: T.surface, color: T.text, outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={e => e.target.style.borderColor = T.accent}
            onBlur={e => e.target.style.borderColor = T.border}
          />
          <button onClick={addClient} disabled={!clientInput.trim()} style={{
            fontFamily: T.fontSans, fontSize: 12, fontWeight: 600,
            padding: "9px 18px", borderRadius: 999, border: "none",
            background: clientInput.trim() ? T.accentLight : "transparent",
            color: clientInput.trim() ? T.accent : T.textTertiary,
            border: `1px solid ${clientInput.trim() ? T.accent + "44" : T.border}`,
            cursor: clientInput.trim() ? "pointer" : "not-allowed", flexShrink: 0,
          }}>
            + Add
          </button>
        </div>

        <Helper>Not sure? Leave this blank — we'll write for a general audience.</Helper>
      </div>

      <NavRow onBack={() => setStep(1)} onContinue={() => setStep(3)} />
    </Page>
  );

  // ════════════════════════════════════════════
  // STEP 3 — Style
  // ════════════════════════════════════════════
  return (
    <Page step={3}>
      <StepHead
        title="What makes you stand out?"
        subtitle="Give your blogs a unique voice. The more specific you are, the better your content will be."
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {/* Unique angle */}
        <div>
          <FieldLabel>Your unique angle <span style={{ fontWeight: 400, textTransform: "none", color: T.textTertiary, letterSpacing: 0 }}>(optional)</span></FieldLabel>
          <textarea
            value={profile.unique}
            onChange={e => setProfile(p => ({ ...p, unique: e.target.value }))}
            placeholder="e.g. We only use organic products and specialize in color-safe treatments for fine hair…"
            rows={4}
            autoFocus
            style={{
              width: "100%", fontFamily: T.fontSans, fontSize: 13, fontWeight: 400,
              padding: "12px 16px", borderRadius: T.radiusSm,
              border: `1px solid ${T.border}`, background: T.surface, color: T.text,
              outline: "none", resize: "none", lineHeight: 1.65,
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onFocus={e => { e.target.style.borderColor = T.accent; e.target.style.boxShadow = `0 0 0 3px ${T.accentGlow}`; }}
            onBlur={e => { e.target.style.borderColor = T.border; e.target.style.boxShadow = "none"; }}
          />
          <Helper>This shapes your blog's tone and helps you stand out from competitors.</Helper>
        </div>

        {/* Booking URL */}
        <div>
          <FieldLabel>Website / Sales page URL <span style={{ fontWeight: 400, textTransform: "none", color: T.textTertiary, letterSpacing: 0 }}>(optional)</span></FieldLabel>
          <input
            value={profile.bookingUrl}
            onChange={e => setProfile(p => ({ ...p, bookingUrl: e.target.value }))}
            placeholder="https://yourbusiness.com"
            style={{
              width: "100%", fontFamily: T.fontSans, fontSize: 13, fontWeight: 400,
              padding: "12px 16px", borderRadius: T.radiusSm,
              border: `1px solid ${T.border}`, background: T.surface, color: T.text,
              outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onFocus={e => { e.target.style.borderColor = T.accent; e.target.style.boxShadow = `0 0 0 3px ${T.accentGlow}`; }}
            onBlur={e => { e.target.style.borderColor = T.border; e.target.style.boxShadow = "none"; }}
          />
          <Helper>We'll add this to your blog's call-to-action so readers can visit your site.</Helper>
        </div>
      </div>

      <div style={{ marginTop: 48, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Button variant="ghost" size="md" onClick={() => setStep(2)}>← Back</Button>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={onComplete}
            style={{
              fontFamily: T.fontSans, fontSize: 12, fontWeight: 500,
              background: "none", border: "none", color: T.textTertiary,
              cursor: "pointer", padding: "4px 8px",
              transition: "color 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = T.textSecondary}
            onMouseLeave={e => e.currentTarget.style.color = T.textTertiary}
          >
            Skip this step
          </button>
          <Button variant="primary" size="lg" onClick={onComplete} disabled={!profile.businessName.trim() || !profile.industry}>
            Launch Blog Studio →
          </Button>
        </div>
      </div>
    </Page>
  );
}
