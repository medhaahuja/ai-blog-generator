# Zoca Blog Studio

AI-powered blog generator for beauty & wellness small businesses. Built as a PM assignment prototype for Zoca.

## What it does

Helps salon, spa, and barbershop owners go from zero to a publishable, SEO-optimized blog post in under 2 minutes:

1. **Onboarding** — Tell us about your business (name, type, location, services)
2. **Topic suggestions** — AI generates 5 data-backed topic ideas with search volume and competition data
3. **Format selection** — Pick from How-To, Listicle, FAQ, Deep Dive, or Seasonal formats (with smart recommendations)
4. **Blog generation** — Full SEO-optimized blog with meta description, keywords, and local references
5. **Inline editor** — Click-to-edit sections, AI-powered rewrite, copy as HTML or plain text

## Setup

### Prerequisites
- Node.js 18+
- A Google Gemini API key (free) — get it from [Google AI Studio](https://aistudio.google.com/apikey)

### Install & Run

```bash
# Install dependencies
npm install

# Create a .env file with your API key
echo "VITE_GEMINI_API_KEY=your-gemini-api-key-here" > .env

# Start dev server
npm run dev
```

The app will open at `http://localhost:3000`.

### Deploy to GitHub Pages / Vercel / Netlify

```bash
# Build for production
npm run build

# The output is in /dist — deploy this folder
```

**Note on API key for deployment:** For a production deployment, you should set up a backend proxy to avoid exposing your API key in the frontend. For the prototype demo, the key is passed via environment variable. On Vercel/Netlify, add `VITE_GEMINI_API_KEY` as an environment variable in the dashboard.

## Tech Stack

- **React 18** with Vite
- **Google Gemini API** (gemini-2.0-flash, free tier) for content generation
- **Inline styles** — no external CSS framework needed
- **Google Fonts** — Instrument Serif + DM Sans

## Project Structure

```
src/
├── main.jsx          # Entry point
├── index.css         # Global styles & animations
├── App.jsx           # Main app orchestrator
├── constants.js      # Design tokens, service options, blog formats
├── api.js            # Claude API helper
├── components.jsx    # Shared UI components (Button, Input, etc.)
├── OnboardingScreen.jsx  # Business profile setup
├── TopicScreen.jsx       # AI topic suggestions
├── FormatScreen.jsx      # Blog format picker
└── EditorScreen.jsx      # Blog preview & inline editor
```

## Key Design Decisions

See the accompanying write-up document (`zoca-writeup.docx`) for full details on:
- Why the system suggests topics instead of asking users to prompt
- How 4 layers of SEO are handled invisibly
- The two-mode architecture (generate fast, edit at pace)
- What we'd build with more time (Writesonic-style 6-step pipeline)
