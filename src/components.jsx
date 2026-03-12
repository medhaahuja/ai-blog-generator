import React from "react";
import { T } from "./constants";

// ── Custom M logo ──
export function ZocaLogo({ height = 18, color = "#F3EDFD" }) {
  const w = height * 1.1;
  return (
    <svg width={w} height={height} viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Hexagon background */}
      <path d="M11 0L21 5.5V14.5L11 20L1 14.5V5.5L11 0Z" fill="#FFA8CD" fillOpacity="0.15" />
      <path d="M11 0L21 5.5V14.5L11 20L1 14.5V5.5L11 0Z" stroke="#FFA8CD" strokeWidth="1.2" strokeLinejoin="round" />
      {/* Letter M */}
      <path d="M5.5 14V6L11 11L16.5 6V14" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

// Legacy Logo wrapper kept for compatibility
export function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <ZocaLogo height={18} color={T.text} />
    </div>
  );
}

export function StepIndicator({ current, total }) {
  return (
    <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{
          width: i === current ? 22 : 6,
          height: 6,
          borderRadius: 3,
          background: i < current
            ? T.green
            : i === current
              ? T.accent
              : T.border,
          transition: "all 0.35s ease",
        }} />
      ))}
    </div>
  );
}

export function Button({ children, variant = "primary", size = "md", onClick, disabled, style: s }) {
  const base = {
    fontFamily: T.fontSans,
    fontWeight: 600,
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    borderRadius: "999px",
    transition: "all 0.2s ease",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    opacity: disabled ? 0.38 : 1,
    letterSpacing: "0.02em",
    whiteSpace: "nowrap",
  };
  const sizes = {
    sm: { fontSize: 12, padding: "7px 16px" },
    md: { fontSize: 13, padding: "11px 24px" },
    lg: { fontSize: 14, padding: "14px 32px" },
  };
  const variants = {
    primary: {
      background: T.accent,
      color: "#0A0A0A",
      boxShadow: disabled ? "none" : T.shadowPink,
    },
    secondary: {
      background: "transparent",
      color: T.text,
      border: `1px solid ${T.border}`,
    },
    ghost: {
      background: "transparent",
      color: T.textSecondary,
    },
    blue: {
      background: T.blue,
      color: "#fff",
      boxShadow: disabled ? "none" : T.shadowBlue,
    },
    danger: {
      background: T.dangerLight,
      color: T.danger,
      border: `1px solid ${T.danger}44`,
    },
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{ ...base, ...sizes[size], ...variants[variant], ...s }}
      onMouseEnter={e => {
        if (disabled) return;
        if (variant === "primary") {
          e.currentTarget.style.background = T.accentHover;
          e.currentTarget.style.boxShadow = "0 6px 30px rgba(255,168,205,0.45)";
          e.currentTarget.style.transform = "translateY(-1px)";
        } else if (variant === "secondary") {
          e.currentTarget.style.borderColor = T.borderHover;
          e.currentTarget.style.background = T.surfaceAlt;
        } else if (variant === "blue") {
          e.currentTarget.style.boxShadow = "0 6px 30px rgba(77,101,255,0.50)";
          e.currentTarget.style.transform = "translateY(-1px)";
        } else if (variant === "ghost") {
          e.currentTarget.style.color = T.text;
        }
      }}
      onMouseLeave={e => {
        if (disabled) return;
        e.currentTarget.style.background = variants[variant].background;
        e.currentTarget.style.boxShadow = variants[variant].boxShadow || "none";
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.borderColor = variants[variant].border ? T.border : undefined;
        e.currentTarget.style.color = variants[variant].color;
      }}
    >
      {children}
    </button>
  );
}

export function Input({ label, value, onChange, placeholder, optional, textarea, autoFocus }) {
  const Tag = textarea ? "textarea" : "input";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {label && (
        <label style={{
          fontFamily: T.fontSans, fontSize: 11, fontWeight: 600,
          color: T.textSecondary, letterSpacing: "0.08em", textTransform: "uppercase",
        }}>
          {label}{optional && <span style={{ color: T.textTertiary, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}> (optional)</span>}
        </label>
      )}
      <Tag
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        style={{
          fontFamily: T.fontSans, fontSize: 14, fontWeight: 400,
          padding: "12px 16px",
          border: `1px solid ${T.border}`,
          borderRadius: T.radiusSm,
          background: T.surface,
          color: T.text,
          outline: "none",
          resize: textarea ? "vertical" : undefined,
          minHeight: textarea ? 90 : undefined,
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
        onFocus={e => {
          e.target.style.borderColor = T.accent;
          e.target.style.boxShadow = `0 0 0 3px ${T.accentGlow}`;
        }}
        onBlur={e => {
          e.target.style.borderColor = T.border;
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  );
}

export function MultiSelect({ label, options, selected, onChange, max = 5 }) {
  const toggle = (opt) => {
    if (selected.includes(opt)) onChange(selected.filter(s => s !== opt));
    else if (selected.length < max) onChange([...selected, opt]);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {label && (
        <label style={{
          fontFamily: T.fontSans, fontSize: 11, fontWeight: 600,
          color: T.textSecondary, letterSpacing: "0.08em", textTransform: "uppercase",
        }}>
          {label} <span style={{ color: T.textTertiary, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>({selected.length}/{max})</span>
        </label>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {options.map(opt => {
          const active = selected.includes(opt);
          return (
            <button key={opt} onClick={() => toggle(opt)} style={{
              fontFamily: T.fontSans, fontSize: 12, fontWeight: active ? 600 : 400,
              padding: "6px 14px", borderRadius: "999px",
              border: `1px solid ${active ? T.accent : T.border}`,
              background: active ? T.accentLight : "transparent",
              color: active ? T.accent : T.textSecondary,
              cursor: "pointer", transition: "all 0.15s",
            }}>
              {active ? "✓ " : ""}{opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
