import React, { useState, useEffect } from "react";
import { T } from "./constants";
import { fetchUnsplashUrl } from "./imageService";

function useUnsplashThumb(query) {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (!query) return;
    fetchUnsplashUrl(query || "beauty salon", "landscape").then(setUrl);
  }, [query]);
  return url;
}

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ── Pill action button ──
function ActionBtn({ label, onClick, color, bg, border }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: T.fontSans, fontSize: 11, fontWeight: 600,
        padding: "5px 13px", borderRadius: 999,
        border: `1px solid ${border || T.border}`,
        background: bg || "transparent",
        color: color || T.textSecondary,
        cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap",
      }}
      onMouseEnter={e => { e.currentTarget.style.opacity = "0.78"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
    >{label}</button>
  );
}

// ── Blog card ──
function BlogCard({ blog, onEdit, onPublishToggle, onDelete, bookingUrl }) {
  const [linkCopied, setLinkCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isPublished = blog.status === "published";
  const thumbUrl = useUnsplashThumb(blog.heroImage);

  const copyLink = () => {
    const slug = (blog.title || "blog-post")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const base = bookingUrl?.replace(/\/$/, "") || "https://yoursalon.com";
    navigator.clipboard.writeText(`${base}/blog/${slug}`);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2200);
  };

  return (
    <div
      style={{
        borderRadius: T.radiusLg, overflow: "hidden",
        background: T.surface, border: `1px solid ${T.border}`,
        display: "flex", flexDirection: "column",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHover; e.currentTarget.style.boxShadow = T.shadowMd; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = "none"; }}
    >
      {/* Hero thumbnail */}
      <div style={{ position: "relative", height: 155, overflow: "hidden", background: T.surfaceAlt, flexShrink: 0 }}>
        {thumbUrl ? (
          <img
            src={thumbUrl}
            alt={blog.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: T.fontSerif, fontSize: 36, color: T.textTertiary }}>
              {blog.heroImage ? "…" : "*"}
            </div>
          </div>
        )}

        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(10,10,10,0.55) 100%)" }} />

        {/* Status badge */}
        <div style={{
          position: "absolute", top: 10, left: 10,
          fontFamily: T.fontSans, fontSize: 9, fontWeight: 700,
          padding: "3px 10px", borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.6px",
          background: isPublished ? T.green : "rgba(26,26,26,0.85)",
          color: isPublished ? "#0A0A0A" : T.textSecondary,
          backdropFilter: "blur(6px)",
          border: isPublished ? "none" : `1px solid ${T.border}`,
        }}>
          {isPublished ? "Published" : "Draft"}
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: "16px 18px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        <h3 style={{
          fontFamily: T.fontSerif, fontSize: 16, fontWeight: 700, color: T.text,
          margin: 0, lineHeight: 1.4,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {blog.title || "Untitled"}
        </h3>

        {/* Meta */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          {blog.updatedAt && (
            <span style={{ fontFamily: T.fontSans, fontSize: 11, color: T.textTertiary }}>
              {formatDate(blog.updatedAt)}
            </span>
          )}
          {blog.readingTime && (
            <>
              <span style={{ color: T.textTertiary, fontSize: 10 }}>·</span>
              <span style={{ fontFamily: T.fontSans, fontSize: 11, color: T.textTertiary }}>{blog.readingTime}</span>
            </>
          )}
          {blog.wordCount > 0 && (
            <>
              <span style={{ color: T.textTertiary, fontSize: 10 }}>·</span>
              <span style={{ fontFamily: T.fontSans, fontSize: 11, color: T.textTertiary }}>~{blog.wordCount} words</span>
            </>
          )}
        </div>

        {/* Keyword chips */}
        {blog.keywords?.length > 0 && (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {blog.keywords.slice(0, 3).map((kw, i) => (
              <span key={i} style={{
                fontFamily: T.fontMono, fontSize: 9, fontWeight: 500,
                padding: "2px 7px", background: T.accentLight, color: T.accent, borderRadius: 4,
              }}>{kw}</span>
            ))}
          </div>
        )}
      </div>

      {/* Action bar */}
      <div style={{
        padding: "10px 18px 14px",
        display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap",
        borderTop: `1px solid ${T.border}`,
      }}>
        <ActionBtn
          label="Edit"
          onClick={() => onEdit(blog.id)}
          border={`${T.accent}44`}
          color={T.accent}
          bg={T.accentLight}
        />

        <ActionBtn
          label={linkCopied ? "Copied!" : "Copy Link"}
          onClick={copyLink}
          border={linkCopied ? `${T.green}55` : T.border}
          color={linkCopied ? T.green : T.textSecondary}
          bg={linkCopied ? T.greenLight : "transparent"}
        />

        <ActionBtn
          label={isPublished ? "Unpublish" : "Publish"}
          onClick={() => onPublishToggle(blog.id)}
          border={isPublished ? `${T.danger}44` : `${T.green}55`}
          color={isPublished ? T.danger : T.green}
          bg={isPublished ? T.dangerLight : T.greenLight}
        />

        {/* Delete with confirmation */}
        <div style={{ marginLeft: "auto" }}>
          {confirmDelete ? (
            <div style={{ display: "flex", gap: 5 }}>
              <button
                onClick={() => { onDelete(blog.id); setConfirmDelete(false); }}
                style={{
                  fontFamily: T.fontSans, fontSize: 10, fontWeight: 700,
                  padding: "4px 10px", borderRadius: 999,
                  border: `1px solid ${T.danger}`, background: T.dangerLight,
                  color: T.danger, cursor: "pointer",
                }}
              >Delete</button>
              <button
                onClick={() => setConfirmDelete(false)}
                style={{
                  fontFamily: T.fontSans, fontSize: 10, fontWeight: 600,
                  padding: "4px 10px", borderRadius: 999,
                  border: `1px solid ${T.border}`, background: "transparent",
                  color: T.textTertiary, cursor: "pointer",
                }}
              >Cancel</button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              style={{
                fontFamily: T.fontSans, fontSize: 11, fontWeight: 500,
                padding: "5px 8px", borderRadius: 999, border: "none",
                background: "transparent", color: T.textTertiary, cursor: "pointer", transition: "color 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = T.danger; }}
              onMouseLeave={e => { e.currentTarget.style.color = T.textTertiary; }}
              title="Delete blog"
            >Delete</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Stats strip ──
function StatsStrip({ total, published, drafts }) {
  const items = [
    { label: "Total", value: total, color: T.textSecondary },
    { label: "Published", value: published, color: T.green },
    { label: "Drafts", value: drafts, color: T.textTertiary },
  ];
  return (
    <div style={{ display: "flex", gap: 24 }}>
      {items.map(({ label, value, color }) => (
        <div key={label} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div style={{ fontFamily: T.font, fontSize: 22, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
          <div style={{ fontFamily: T.fontSans, fontSize: 10, fontWeight: 600, color: T.textTertiary, textTransform: "uppercase", letterSpacing: "0.8px" }}>{label}</div>
        </div>
      ))}
    </div>
  );
}

// ── Main screen ──
export default function BlogsScreen({ blogs, onNewBlog, onEdit, onPublishToggle, onDelete, profile }) {
  const publishedCount = blogs.filter(b => b.status === "published").length;
  const draftCount = blogs.filter(b => b.status === "draft").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, animation: "fadeIn 0.3s ease" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <div style={{ fontFamily: T.fontSans, fontSize: 10, fontWeight: 700, color: T.accent, textTransform: "uppercase", letterSpacing: "1.2px", marginBottom: 6 }}>
              {profile.businessName}
            </div>
            <h1 style={{ fontFamily: T.font, fontSize: 28, fontWeight: 700, color: T.text, margin: 0, letterSpacing: "-0.4px", lineHeight: 1.2 }}>
              My Blog Posts
            </h1>
          </div>
          {blogs.length > 0 && (
            <StatsStrip total={blogs.length} published={publishedCount} drafts={draftCount} />
          )}
        </div>

        <button
          onClick={onNewBlog}
          style={{
            fontFamily: T.fontSans, fontSize: 13, fontWeight: 700,
            padding: "12px 24px", borderRadius: 999,
            background: T.accent, color: "#0A0A0A",
            border: "none", cursor: "pointer", boxShadow: T.shadowPink, transition: "all 0.15s",
            whiteSpace: "nowrap", alignSelf: "flex-start",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = T.accentHover; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(255,168,205,0.45)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = T.accent; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = T.shadowPink; }}
        >+ Create New Blog</button>
      </div>

      {/* Empty state */}
      {blogs.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "80px 32px",
          background: T.surface, borderRadius: T.radiusLg, border: `1px solid ${T.border}`,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%", margin: "0 auto 20px",
            background: T.accentLight, border: `1px solid ${T.accent}44`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26, color: T.accent,
          }}>*</div>
          <h2 style={{ fontFamily: T.font, fontSize: 20, fontWeight: 700, color: T.text, margin: "0 0 8px" }}>No blogs yet</h2>
          <p style={{ fontFamily: T.fontSans, fontSize: 13, color: T.textSecondary, margin: "0 0 28px", lineHeight: 1.7, maxWidth: 380, marginLeft: "auto", marginRight: "auto" }}>
            Create your first SEO and GEO-optimized blog post to start attracting new clients through search and AI.
          </p>
          <button
            onClick={onNewBlog}
            style={{
              fontFamily: T.fontSans, fontSize: 13, fontWeight: 700,
              padding: "12px 30px", borderRadius: 999,
              background: T.accent, color: "#0A0A0A",
              border: "none", cursor: "pointer", boxShadow: T.shadowPink, transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = T.accentHover; }}
            onMouseLeave={e => { e.currentTarget.style.background = T.accent; }}
          >Create Your First Blog</button>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
          gap: 16,
        }}>
          {blogs.map(blog => (
            <BlogCard
              key={blog.id}
              blog={blog}
              onEdit={onEdit}
              onPublishToggle={onPublishToggle}
              onDelete={onDelete}
              bookingUrl={profile.bookingUrl}
            />
          ))}
        </div>
      )}
    </div>
  );
}
