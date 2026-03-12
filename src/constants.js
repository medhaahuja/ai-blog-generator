// ── Design Tokens ──
export const T = {
  // Backgrounds
  bg: "#0A0A0A",
  surface: "#111111",
  surfaceAlt: "#1A1A1A",
  surfaceHover: "#161616",

  // Borders
  border: "#242424",
  borderLight: "#1C1C1C",
  borderHover: "#333333",

  // Typography
  text: "#F3EDFD",
  textSecondary: "#9A93B0",
  textTertiary: "#4D4860",

  // Accent pink
  accent: "#FFA8CD",
  accentLight: "rgba(255, 168, 205, 0.10)",
  accentHover: "#FFB8D8",
  accentGlow: "rgba(255, 168, 205, 0.22)",

  // Accent blue
  blue: "#4D65FF",
  blueLight: "rgba(77, 101, 255, 0.12)",
  blueGlow: "rgba(77, 101, 255, 0.25)",

  // Supporting
  green: "#00D2A0",
  greenLight: "rgba(0, 210, 160, 0.10)",
  warm: "#FF9A5C",
  warmLight: "rgba(255, 154, 92, 0.10)",
  warmBorder: "rgba(255, 154, 92, 0.25)",
  danger: "#FF5C8A",
  dangerLight: "rgba(255, 92, 138, 0.10)",

  // Shadows
  shadow: "0 1px 4px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)",
  shadowMd: "0 4px 20px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.3)",
  shadowLg: "0 16px 48px rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.4)",
  shadowPink: "0 4px 24px rgba(255, 168, 205, 0.30)",
  shadowBlue: "0 4px 24px rgba(77, 101, 255, 0.35)",

  // Shape
  radius: "12px",
  radiusSm: "8px",
  radiusLg: "16px",

  // Typography — Montserrat
  font: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif",
  fontSans: "'Montserrat', -apple-system, sans-serif",
  fontSerif: "'Instrument Serif', Georgia, serif",
  fontMono: "'JetBrains Mono', monospace",
};

// ── Industry options ──
export const INDUSTRIES = [
  "Education & Tutoring",
  "Art & Music",
  "Finance & Accounting",
  "Healthcare & Wellness",
  "Food & Beverage",
  "Retail & E-commerce",
  "Technology & Software",
  "Real Estate",
  "Legal Services",
  "Fitness & Sports",
  "Beauty & Personal Care",
  "Travel & Hospitality",
  "Photography & Media",
  "Interior Design",
  "Coaching & Consulting",
];

export const BLOG_FORMATS = [
  { id: "how-to", name: "How-To Guide", desc: "Step-by-step instructions your clients can follow", icon: "📋" },
  { id: "listicle", name: "Listicle", desc: "Numbered tips or recommendations, easy to scan", icon: "📝" },
  { id: "faq", name: "Q&A / FAQ", desc: "Answer common client questions — great for Google snippets", icon: "❓" },
  { id: "explainer", name: "Deep Dive", desc: "Educational content that builds your expertise and trust", icon: "🔬" },
  { id: "seasonal", name: "Seasonal / Trend", desc: "Timely content tied to current season or trends", icon: "🌸" },
];

export const CLIENT_TYPES = [
  "Students",
  "Young Professionals",
  "Families",
  "Seniors",
  "Businesses (B2B)",
  "Local Community",
  "Luxury Clients",
];

export const CATEGORY_LABELS = {
  "trending":        { label: "Trending",        color: T.danger, bg: T.dangerLight },
  "low-competition": { label: "Low Competition", color: T.green,  bg: T.greenLight },
  "client-questions":{ label: "Client Q",        color: T.blue,   bg: T.blueLight },
  "seasonal":        { label: "Seasonal",        color: T.warm,   bg: T.warmLight },
  "educational":     { label: "Educational",     color: T.accent, bg: T.accentLight },
};

// ── Helpers ──
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
export const currentMonth = months[new Date().getMonth()];
export const currentSeason = (() => {
  const m = new Date().getMonth();
  if (m >= 2 && m <= 4) return "spring";
  if (m >= 5 && m <= 7) return "summer";
  if (m >= 8 && m <= 10) return "fall";
  return "winter";
})();
