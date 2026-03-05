import React from "react";
import { T, BLOG_FORMATS } from "./constants";

export default function FormatScreen({ topic, onSelect }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, animation: "fadeIn 0.3s ease" }}>

      {/* Header */}
      <div>
        <h2 style={{
          fontFamily: T.font, fontSize: 24, fontWeight: 700, color: T.text,
          margin: 0, letterSpacing: "-0.3px",
        }}>
          Pick a format
        </h2>
        <p style={{ fontFamily: T.fontSans, fontSize: 13, color: T.textSecondary, marginTop: 6 }}>
          Writing about: <span style={{ color: T.text, fontWeight: 600 }}>{topic.title}</span>
        </p>
      </div>

      {/* Format cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {BLOG_FORMATS.map(fmt => {
          const recommended = fmt.id === topic.recommendedFormat;
          return (
            <button key={fmt.id} onClick={() => onSelect(fmt.id)} style={{
              textAlign: "left",
              background: recommended ? T.accentLight : T.surface,
              border: `1px solid ${recommended ? T.accent + "55" : T.border}`,
              borderRadius: T.radius, padding: "15px 18px", cursor: "pointer",
              transition: "all 0.18s", display: "flex", alignItems: "center", gap: 14,
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = T.accent + "88";
                e.currentTarget.style.background = recommended ? T.accentLight : T.surfaceHover;
                e.currentTarget.style.boxShadow = `0 0 0 1px ${T.accent}44, ${T.shadowPink}`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = recommended ? T.accent + "55" : T.border;
                e.currentTarget.style.background = recommended ? T.accentLight : T.surface;
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Icon */}
              <div style={{
                width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                background: recommended ? T.accentLight : T.surfaceAlt,
                border: `1px solid ${recommended ? T.accent + "44" : T.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20,
              }}>
                {fmt.icon}
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                  <span style={{ fontFamily: T.fontSans, fontSize: 13, fontWeight: 700, color: T.text }}>
                    {fmt.name}
                  </span>
                  {recommended && (
                    <span style={{
                      fontFamily: T.fontSans, fontSize: 9, fontWeight: 700,
                      padding: "2px 8px", borderRadius: 999,
                      background: T.accent, color: "#0A0A0A",
                      textTransform: "uppercase", letterSpacing: "0.5px",
                    }}>
                      Recommended
                    </span>
                  )}
                </div>
                <p style={{ fontFamily: T.fontSans, fontSize: 12, color: T.textSecondary, margin: 0, lineHeight: 1.5 }}>
                  {fmt.desc}
                </p>
              </div>

              <span style={{ color: T.textTertiary, fontSize: 16, flexShrink: 0 }}>→</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
