import React, { useState, useEffect } from "react";
import { FileText, ExternalLink, Code, Download } from "lucide-react";
import type { Publication, MediaItem } from "@/_internal/types";
import RenderAsMarkdown from "@/_internal/lib/RenderAsMarkdown";
import MediaCarousel from "@/_internal/components/MediaCarousel";
import ThreeBallSeparator from "@/_internal/components/ThreeBallSeparator";

// ─── small helpers ────────────────────────────────────────────────────────────

const mimeFor = (src?: string) => { const e = src?.split("?")[0].split(".").pop()?.toLowerCase(); return e === "mp4" ? "video/mp4" : e === "webm" ? "video/webm" : e === "ogv" || e === "ogg" ? "video/ogg" : undefined; };
const videoSources = (s?: string) => { if (!s) return [] as string[]; const [p, q] = s.split("?"); const e = p.split(".").pop()?.toLowerCase() ?? ""; const b = p.replace(/\.[^.]+$/, ""); const qs = q ? `?${q}` : ""; const c = [s]; if (e === "mp4") c.push(`${b}.webm${qs}`); else if (e === "webm") c.push(`${b}.mp4${qs}`); else { c.push(`${b}.mp4${qs}`); c.push(`${b}.webm${qs}`); } return [...new Set(c)]; };

const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)} onBlur={() => setShow(false)}>
      {children}
      {show && <span role="tooltip" style={{ position: "absolute", top: -36, left: "50%", transform: "translateX(-50%)", background: "#111", color: "#fff", padding: "6px 8px", borderRadius: 6, fontSize: 12, whiteSpace: "nowrap", zIndex: 1000 }}>{text}</span>}
    </span>
  );
};

const VideoEl: React.FC<{ src: string }> = ({ src }) => (
  <video controls loop autoPlay muted playsInline style={{ width: "100%", borderRadius: 8, background: "transparent" }}>
    {videoSources(src).map((s, i) => <source key={i} src={s} {...(mimeFor(s) ? { type: mimeFor(s) } : {})} />)}
  </video>
);

// ─── button styles ────────────────────────────────────────────────────────────

const BTN_CSS = `
.pub-btn { display:inline-flex;align-items:center;gap:8px;border-radius:6px;padding:8px 12px;font-size:14px;font-weight:500;text-decoration:none;border:none;cursor:pointer;transition:filter 150ms ease,transform 150ms ease; }
.pub-btn:hover  { filter:brightness(1.15);transform:translateY(-1px); }
.pub-btn:active { filter:brightness(0.92);transform:translateY(0); }
.pub-btn-red   { background:#c0392b;color:#fff; }
.pub-btn-blue  { background:#0b69ff;color:#fff; }
.pub-btn-black { background:#111;color:#fff; }
.pub-btn-off   { background:transparent;color:#999;border:1px solid #ddd;opacity:0.6;cursor:not-allowed;pointer-events:none; }
`;

const btnRed   = "pub-btn pub-btn-red";
const btnBlue  = "pub-btn pub-btn-blue";
const btnBlack = "pub-btn pub-btn-black";
const btnOff   = "pub-btn pub-btn-off";

// ─── component ────────────────────────────────────────────────────────────────

const PublicationPage: React.FC<{ pub: Publication }> = ({ pub }) => {
  const [mediaIndex, setMediaIndex] = useState(0);

  useEffect(() => { try { window.scrollTo({ top: 0, left: 0 }); } catch {} }, []);

  const media: MediaItem[] = Array.isArray(pub.media) ? pub.media : [];
  const hasMedia = media.length > 0;

  // Show main media block when there's no content.md layout and no teaserIndex
  const showMain = (!!pub.image || hasMedia) && !pub.content && !pub.teaserIndex;

  const t = pub.theme ?? {};
  const accent     = t.accentColor     ?? "#0a4b7c";
  const pageBg     = t.pageBackground  ?? "#fff";
  const blockBg    = t.blockBackground ?? "#f7f7f7";
  const maxW       = t.contentMaxWidth ?? 1200;
  const bodyFont   = t.bodyFont        ?? "Lato, sans-serif";
  const headingFont = t.headingFont    ?? '"Patua One", serif';
  const baseFontSize = t.baseFontSize  ?? 16;

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--md-accent",       accent);
    root.style.setProperty("--md-heading-font", headingFont);
    root.style.fontSize   = `${baseFontSize}px`;
    root.style.fontFamily = bodyFont;
    root.style.background = pageBg;
    return () => {
      root.style.removeProperty("--md-accent");
      root.style.removeProperty("--md-heading-font");
      root.style.removeProperty("font-size");
      root.style.removeProperty("font-family");
      root.style.removeProperty("background");
    };
  }, [accent, headingFont, baseFontSize, bodyFont, pageBg]);

  return (
    <div style={{ background: pageBg, color: "#111", minHeight: "100vh", fontFamily: bodyFont, fontSize: baseFontSize }}>
      <style>{BTN_CSS}</style>

      {/* ── top bar ────────────────────────────────────────────────────────── */}
      <div style={{ borderBottom: "1px solid #e6e6e6" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "10px 28px", display: "flex", justifyContent: "space-between", fontSize: 13, color: "#666" }}>
          <a href={pub.siteUrl ?? "/"} style={{ color: "#666", textDecoration: "none" }}>← Back to site</a>
          <div>{pub.venue && pub.venue !== "?" ? <>{pub.venue} • {pub.year}</> : pub.year}</div>
        </div>
      </div>

      <main style={{ paddingTop: 28, paddingBottom: 60 }}>
        <div style={{ maxWidth: maxW, margin: "0 auto", padding: "0 28px" }}>

          {/* ── header ───────────────────────────────────────────────────────── */}
          <header style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: `clamp(28px, 5vw, ${t.titleFontSize ?? 48}px)`, lineHeight: 1.05, margin: 0, color: accent, fontFamily: t.headingFont }}>{pub.title}</h1>

            <div style={{ marginTop: 12, fontSize: t.authorFontSize ?? 18, fontWeight: 700, display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
              {pub.authors.map(([name, url], i) => (
                <span key={i}>
                  {url ? <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>{name}</a> : name}
                  {i < pub.authors.length - 1 && <span style={{ color: "#666" }}>, </span>}
                </span>
              ))}
            </div>

            {pub.affiliations && <div style={{ marginTop: 8, color: "#666", fontSize: 16 }}>{pub.affiliations}</div>}
            <div style={{ marginTop: 8, color: "#666", fontSize: 14 }}>
              {pub.venue && pub.venue !== "?" ? <>{pub.venue} • {pub.year}</> : pub.year}
            </div>

            {/* buttons — undefined = hidden, "placeholder" = coming soon, URL = active */}
            <div style={{ marginTop: 16, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              {pub.pdf === undefined ? null
                : pub.pdf === "placeholder"
                  ? <Tooltip text="Coming soon"><button disabled className={btnOff}><FileText size={16} /><span>Paper (PDF)</span></button></Tooltip>
                  : <a href={pub.pdf} download className={btnBlue}><FileText size={16} /><span>Paper (PDF)</span></a>}

              {pub.paper === undefined ? null
                : pub.paper === "placeholder"
                  ? <Tooltip text="Coming soon"><button disabled className={btnOff}><ExternalLink size={16} /><span>Paper</span></button></Tooltip>
                  : <a href={pub.paper} target="_blank" rel="noreferrer" className={btnRed}><ExternalLink size={16} /><span>Paper</span></a>}

              {pub.code === undefined ? null
                : pub.code === "placeholder"
                  ? <Tooltip text="Coming soon"><button disabled className={btnOff}><Code size={16} /><span>Code</span></button></Tooltip>
                  : <a href={pub.code} target="_blank" rel="noreferrer" className={btnBlack}><Code size={16} /><span>Code</span></a>}

              {pub.supplementary === undefined ? null
                : pub.supplementary === "placeholder"
                  ? <Tooltip text="Coming soon"><button disabled className={btnOff}><Download size={16} /><span>Supplementary</span></button></Tooltip>
                  : <a href={pub.supplementary} download className={btnBlue}><Download size={16} /><span>Supplementary</span></a>}
            </div>
          </header>

          {/* ── main media (only when no content.md) ─────────────────────────── */}
          {showMain && (
            <div style={{ marginTop: 56 }}>
              {pub.image ? (
                <img src={pub.image} alt={pub.title} style={{ width: "100%", objectFit: "cover", borderRadius: 8 }} />
              ) : media.length === 1 ? (
                media[0].type === "image" ? <img src={media[0].src} alt={pub.title} style={{ width: "100%", borderRadius: 8 }} />
                  : media[0].type === "video" ? <VideoEl src={media[0].src} />
                  : <iframe src={media[0].src} title={pub.title} style={{ width: "100%", height: 480, border: 0, borderRadius: 8 }} allowFullScreen />
              ) : (
                <>
                  <div style={{ borderRadius: 8, overflow: "hidden" }}>
                    {media[mediaIndex].type === "image" && <img src={media[mediaIndex].src} alt={pub.title} style={{ width: "100%" }} />}
                    {media[mediaIndex].type === "video" && <VideoEl src={media[mediaIndex].src} />}
                    {media[mediaIndex].type === "embed" && <iframe src={media[mediaIndex].src} title={pub.title} style={{ width: "100%", height: 480, border: 0 }} allowFullScreen />}
                  </div>
                  <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 8 }}>
                    <button onClick={() => setMediaIndex((n) => (n - 1 + media.length) % media.length)}>Prev</button>
                    {media.map((_, idx) => (
                      <button key={idx} onClick={() => setMediaIndex(idx)}
                        style={{ width: 10, height: 10, borderRadius: "50%", background: idx === mediaIndex ? "#111" : "#ccc", border: "none", padding: 0, cursor: "pointer" }} />
                    ))}
                    <button onClick={() => setMediaIndex((n) => (n + 1) % media.length)}>Next</button>
                  </div>
                  {media[mediaIndex]?.caption && <div style={{ marginTop: 8, color: "#555", fontSize: 13 }}>{media[mediaIndex].caption}</div>}
                </>
              )}
            </div>
          )}

          {/* ── teaser (when teaserIndex is set) ─────────────────────────────── */}
          {pub.teaserIndex && hasMedia && (() => {
            const teaser = media[pub.teaserIndex! - 1];
            if (!teaser) return null;
            return (
              <div style={{ marginTop: 40 }}>
                {teaser.type === "video" ? <VideoEl src={teaser.src} /> : teaser.type === "image" ? <img src={teaser.src} alt={pub.title} style={{ width: "100%", borderRadius: 8 }} /> : null}
                {teaser.caption && <div style={{ marginTop: 8, color: "#555", fontSize: 13, textAlign: "center" }}>{teaser.caption}</div>}
              </div>
            );
          })()}

          {/* ── abstract ─────────────────────────────────────────────────────── */}
          {pub.abstract && (
            <section style={{ background: blockBg, padding: 20, borderRadius: 8, marginTop: 20 }}>
              <h2 style={{ marginTop: 0, fontSize: t.headingFontSize ?? 22, color: accent, fontFamily: t.headingFont }}>Abstract</h2>
              <p style={{ marginBottom: 0, fontSize: t.abstractFontSize ?? 16 }}>{pub.abstract}</p>
            </section>
          )}

          {/* ── markdown content ──────────────────────────────────────────────── */}
          {pub.content && (
            <>
              <ThreeBallSeparator />
              <section style={{ marginBottom: 48, fontSize: t.contentFontSize ?? 16 }}>
                {RenderAsMarkdown(pub.content, media, { math: true, mediaTitleFontSize: t.mediaTitleFontSize, mediaCaptionFontSize: t.mediaCaptionFontSize })}
              </section>
            </>
          )}

        </div>
      </main>

      {/* ── footer ───────────────────────────────────────────────────────── */}
      <footer style={{ background: accent, padding: "28px", textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.75)", letterSpacing: "0.02em" }}>
        <div>© {new Date().getFullYear()} {pub.authors[0]?.[0] ?? "The Authors"}. All rights reserved.</div>
        <div style={{ marginTop: 6 }}>
          Page built with{" "}
          <a href="https://github.com/LuCazzola/md-paper" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "underline" }}>
            md-paper
          </a>
          {" · "}Open source, free to use with attribution.
        </div>
      </footer>
    </div>
  );
};

export default PublicationPage;
