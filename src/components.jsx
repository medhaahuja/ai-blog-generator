import React from "react";
import { T } from "./constants";

// ── Exact Zoca SVG wordmark ──
export function ZocaLogo({ height = 18, color = "#F3EDFD" }) {
  return (
    <svg
      width={81 * (height / 20)}
      height={height}
      viewBox="0 0 81 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M70.3617 0.12793C64.8957 0.12793 60.4604 4.54154 60.4255 9.99946C60.3903 15.4999 64.9259 20.0003 70.4266 20.0003H80.0633C80.1931 20.0003 80.2981 19.8952 80.2981 19.7657V10.0641C80.2983 4.57646 75.8498 0.12793 70.3617 0.12793ZM78.125 17.877C78.0838 17.9182 78.0299 17.939 77.9754 17.939C77.929 17.939 77.8824 17.9236 77.8436 17.8929L73.4307 14.3735C72.6053 14.9755 71.5991 15.3443 70.5086 15.3821C67.5107 15.486 65.0768 13.1673 65.0413 10.1678C65.0064 7.20065 67.4182 4.78861 70.3854 4.82327C73.3841 4.85819 75.7031 7.29109 75.6004 10.2882C75.5629 11.3792 75.1943 12.3862 74.5921 13.2116L78.1399 17.5945C78.2079 17.6784 78.2014 17.8004 78.125 17.877Z" fill={color} />
      <path d="M68.0425 9.07982C67.5687 9.88827 67.551 10.5547 67.2166 10.8502C67.0105 11.0324 66.6936 10.9964 66.5262 10.7783C66.0251 10.1249 66.3467 9.14758 66.539 8.62373C66.7652 8.00893 67.049 7.56275 67.5557 7.10953C68.1298 6.59611 68.7809 6.38031 69.2682 6.72407C69.8142 7.27163 68.698 7.9615 68.0425 9.07982Z" fill={color} />
      <path d="M29.2814 0C23.7881 0 19.3369 4.45246 19.3369 9.94404C19.3369 15.4356 23.7894 19.8885 29.2814 19.8885C34.7734 19.8885 39.2259 15.4356 39.2259 9.94404C39.2259 4.45246 34.773 0 29.2814 0ZM29.2814 14.6715C26.6737 14.6715 24.5527 12.5504 24.5527 9.94404C24.5527 7.33767 26.6737 5.21703 29.2814 5.21703C31.889 5.21703 34.0088 7.3381 34.0088 9.94404C34.0088 12.55 31.8878 14.6715 29.2814 14.6715Z" fill={color} />
      <path d="M55.0745 12.4649C54.2479 13.7902 52.8037 14.6719 51.0724 14.6719C49.0331 14.6719 47.2907 13.3745 46.6294 11.5618C46.4448 11.0577 46.3432 10.5133 46.3432 9.9449C46.3432 9.37651 46.4448 8.83211 46.6294 8.32797C47.2907 6.51486 49.0922 5.21745 51.0724 5.21745C52.749 5.21745 54.2247 6.09441 55.0642 7.41363L59.5861 4.7973C57.8553 1.92148 54.731 0 51.0724 0C46.7754 0 43.1158 2.7263 41.7254 6.54141C41.3382 7.60281 41.1279 8.74944 41.1279 9.94404C41.1279 11.1386 41.3387 12.2853 41.7254 13.3467C43.1158 17.1635 46.835 19.8885 51.0724 19.8885C54.6871 19.8885 57.8507 17.9589 59.5919 15.075L55.0745 12.4649Z" fill={color} />
      <path d="M17.8565 5.49459L7.76857 14.1091C7.64993 14.2102 7.72146 14.4042 7.87737 14.4042H17.6899C17.7824 14.4042 17.8578 14.4792 17.8578 14.5721V19.1535C17.8578 19.246 17.7829 19.3214 17.6899 19.3214H0.167904C0.0753856 19.3214 0 19.2465 0 19.1535V14.4085C0 14.4085 0.000428327 14.4055 0.00171331 14.4047L10.0893 5.7897C10.2079 5.68862 10.1364 5.49459 9.98046 5.49459H0.167904C0.0753856 5.49459 0 5.41963 0 5.32668V0.747006C0 0.654487 0.0749573 0.579102 0.167904 0.579102H17.6903C17.7829 0.579102 17.8583 0.654059 17.8583 0.747006V5.49073C17.8583 5.49073 17.8578 5.49373 17.8565 5.49459Z" fill={color} />
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
