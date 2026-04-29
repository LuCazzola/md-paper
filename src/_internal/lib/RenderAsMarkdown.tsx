/**
 * Renders a markdown string that may contain special media tokens:
 *
 *   [MEDIA:1]                       single media item (1-based index)
 *   [MEDIA:1:0.8]                   single item at 80% of max width
 *   [MEDIA:1-6]                     carousel of items 1 through 6
 *   [MEDIA:1,3,5]                   carousel of items 1, 3, 5
 *   [MEDIA:1-6]{Caption **text**}   carousel with a markdown caption block above
 *
 *   [MEDIA-MULTICOL:1.2]
 *   [MEDIA:1-3]{Left caption}
 *   [MEDIA:4-6]{Right caption}
 *   [/MEDIA-MULTICOL]               multi-column layout (scale > 1 = wider than container)
 *
 *   [SPACING:small|medium|large|xlarge]   vertical gap
 */
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
// @ts-ignore
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";
import MediaCarousel from "@/_internal/components/MediaCarousel";
import type { MediaItem } from "@/_internal/types";

type Part =
  | { kind: "text"; text: string }
  | { kind: "media"; indices: (number | "placeholder")[]; scale?: number; caption?: string }
  | { kind: "multicol"; scale: number; cols: { indices: (number | "placeholder")[]; caption?: string }[] }
  | { kind: "space"; size: string };

function parseIndices(raw: string): (number | "placeholder")[] {
  const out: (number | "placeholder")[] = [];
  for (const t of raw.split(/[,\s]+/).filter(Boolean)) {
    if (t === "?") { out.push("placeholder"); continue; }
    if (t.includes("-")) {
      const [a, b] = t.split("-").map((s) => parseInt(s.trim(), 10));
      if (!isNaN(a) && !isNaN(b)) { for (let k = Math.min(a, b); k <= Math.max(a, b); k++) out.push(k - 1); continue; }
    }
    const n = parseInt(t, 10);
    if (!isNaN(n)) out.push(n - 1);
  }
  return out;
}

const mimeFor = (src?: string) => { const e = src?.split("?")[0].split(".").pop()?.toLowerCase(); return e === "mp4" ? "video/mp4" : e === "webm" ? "video/webm" : e === "ogv" || e === "ogg" ? "video/ogg" : undefined; };
const videoSources = (s?: string) => { if (!s) return [] as string[]; const [p, q] = s.split("?"); const e = p.split(".").pop()?.toLowerCase() ?? ""; const b = p.replace(/\.[^.]+$/, ""); const qs = q ? `?${q}` : ""; const c = [s]; if (e === "mp4") c.push(`${b}.webm${qs}`); else if (e === "webm") c.push(`${b}.mp4${qs}`); else { c.push(`${b}.mp4${qs}`); c.push(`${b}.webm${qs}`); } return [...new Set(c)]; };

export default function RenderAsMarkdown(content: string, media: MediaItem[] = [], opts?: { math?: boolean; mediaTitleFontSize?: number; mediaCaptionFontSize?: number }): React.ReactNode {
  if (!content) return null;

  const mdPlugins = [remarkGfm, ...(opts?.math ? [remarkMath] : [])];
  const rhPlugins = opts?.math ? [(rehypeKatex as any), (rehypeRaw as any)] : [];

  // ── parse ──────────────────────────────────────────────────────────────────
  // Protect backtick-fenced spans (inline code, table cell literals) so their
  // content is never mistaken for real tokens.
  const codeStash: string[] = [];
  const protect = (src: string) =>
    src.replace(/`[^`]*`/g, (m) => { codeStash.push(m); return `\x00CODE${codeStash.length - 1}\x00`; });
  const restore = (src: string) =>
    src.replace(/\x00CODE(\d+)\x00/g, (_, i) => codeStash[Number(i)]);

  const safeContent = protect(content);

  const multicolMap = new Map<string, { scale: number; cols: { indices: (number | "placeholder")[]; caption?: string }[] }>();
  const processed = safeContent.replace(/\[MEDIA-MULTICOL:([0-9.]+)\]([\s\S]*?)\[\/MEDIA-MULTICOL\]/gi, (_, scale, block) => {
    const cols: { indices: (number | "placeholder")[]; caption?: string }[] = [];
    let m: RegExpExecArray | null;
    // Trim surrounding whitespace/newlines from each column token before matching
    const re = /\[MEDIA:([0-9?\-\s,]+)\](?:\{([^}]*)\})?/gi;
    while ((m = re.exec(block)) !== null) cols.push({ indices: parseIndices(m[1]), caption: m[2]?.trim() });
    const id = `__MC_${multicolMap.size}__`;
    multicolMap.set(id, { scale: parseFloat(scale), cols });
    return id;
  });

  const parts: Part[] = [];
  const re = /\[MEDIA:([0-9?\-\s,]+)(?::([0-9.]+))?\](?:\{([^}]*)\})?|\[SPACING:(small|medium|large|xlarge)\]|(__MC_\d+__)/gi;
  let last = 0, m: RegExpExecArray | null;
  while ((m = re.exec(processed)) !== null) {
    if (m.index > last) parts.push({ kind: "text", text: processed.slice(last, m.index) });
    if (m[5]) { const d = multicolMap.get(m[5]); if (d) parts.push({ kind: "multicol", ...d }); }
    else if (m[1]) parts.push({ kind: "media", indices: parseIndices(m[1]), scale: m[2] ? parseFloat(m[2]) : undefined, caption: m[3]?.trim() });
    else if (m[4]) parts.push({ kind: "space", size: m[4] });
    last = re.lastIndex;
  }
  if (last < processed.length) parts.push({ kind: "text", text: processed.slice(last) });

  // Restore protected code spans in all string fields
  for (const p of parts) {
    if (p.kind === "text") {
      p.text = restore(p.text);
    } else if (p.kind === "media" && p.caption) {
      p.caption = restore(p.caption);
    } else if (p.kind === "multicol") {
      for (const col of p.cols) { if (col.caption) col.caption = restore(col.caption); }
    }
  }

  // ── helpers ────────────────────────────────────────────────────────────────
  const resolve = (idx: number | "placeholder"): MediaItem | null =>
    idx === "placeholder" ? null : (media[idx as number] ?? null);

  const titleFs   = opts?.mediaTitleFontSize   ?? 18;
  const captionFs = opts?.mediaCaptionFontSize ?? 13;

  const renderItem = (it: MediaItem | null, key: React.Key) => {
    if (!it) return <div key={key} style={{ color: "#999", fontSize: captionFs }}>Missing media</div>;
    const Title = it.title ? <div style={{ textAlign: "center", fontSize: titleFs, fontWeight: 600, marginBottom: 8 }}>{it.title}</div> : null;
    const Caption = it.caption ? <figcaption style={{ fontSize: captionFs, color: "#666", marginTop: 6 }}>{it.caption}</figcaption> : null;
    if (it.type === "image") return <figure key={key} style={{ margin: 0 }}>{Title}<img src={it.src} alt={(it as any).alt ?? "media"} loading="lazy" style={{ width: "100%", borderRadius: 8, display: "block" }} />{Caption}</figure>;
    if (it.type === "video") return (
      <figure key={key} style={{ margin: 0 }}>{Title}
        <video controls loop {...(!(it as any).audio ? { autoPlay: true, muted: true } : {})} playsInline poster={it.poster} style={{ width: "100%", borderRadius: 8, background: "transparent" }}>
          {videoSources(it.src).map((s, i) => <source key={i} src={s} {...(mimeFor(s) ? { type: mimeFor(s) } : {})} />)}
        </video>{Caption}
      </figure>
    );
    return <div key={key} style={{ aspectRatio: "16/9", borderRadius: 8, overflow: "hidden" }}>{Title}<iframe src={it.src} title={it.caption ?? "embed"} allowFullScreen style={{ width: "100%", height: "100%", border: 0 }} />{it.caption && <div style={{ fontSize: 13, color: "#666", marginTop: 6 }}>{it.caption}</div>}</div>;
  };

  const Md = ({ text }: { text: string }) => (
    <div className="markdown-body prose prose-lg max-w-none">
      <ReactMarkdown remarkPlugins={mdPlugins} rehypePlugins={rhPlugins}>{text}</ReactMarkdown>
    </div>
  );

  const fullBleed = (children: React.ReactNode, key: React.Key, bg: string, innerMax: number) => (
    <div key={key} style={{ marginTop: 12, background: bg, padding: 12, borderRadius: 8, width: "100vw", position: "relative", left: "50%", marginLeft: "-50vw" }}>
      <div style={{ maxWidth: innerMax, margin: "0 auto" }}>{children}</div>
    </div>
  );

  const CaptionBlock = ({ text }: { text?: string }) => text ? (
    <><div className="markdown-body prose prose-lg max-w-none" style={{ marginBottom: 8 }}><ReactMarkdown remarkPlugins={mdPlugins} rehypePlugins={rhPlugins}>{text}</ReactMarkdown></div><hr style={{ border: 0, borderTop: "1px solid rgba(15,23,42,0.06)", margin: "8px 0 16px" }} /></>
  ) : null;

  const spaceSizes: Record<string, string> = { small: "16px", medium: "32px", large: "48px", xlarge: "64px" };

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {parts.map((p, i) => {
        if (p.kind === "space") return <div key={i} style={{ height: spaceSizes[p.size] ?? "32px" }} />;

        if (p.kind === "text") {
          const block = p.text.trim();
          return block ? fullBleed(<Md text={block} />, i, "#f7f7f7", 1200) : null;
        }

        if (p.kind === "media") {
          const items = p.indices.map(resolve).filter((x): x is MediaItem => !!x);
          if (!items.length) return null;
          const scale = typeof p.scale === "number" ? Math.max(0.05, Math.min(1, p.scale)) : 1;
          const max = Math.round(1200 * scale);
          const inner = <><CaptionBlock text={p.caption} />{items.length === 1 ? renderItem(items[0], i) : <MediaCarousel items={items as any} titleFontSize={titleFs} captionFontSize={captionFs} />}</>;
          return fullBleed(inner, i, "#fff", max);
        }

        if (p.kind === "multicol") {
          const cid = `mc-${i}`;
          const max = Math.round(1200 * Math.max(0.05, p.scale));
          return (
            <React.Fragment key={i}>
              <style>{`
                @media(min-width:769px){#${cid} .col{display:flex;flex-direction:column;height:100%;min-width:0}#${cid} .media{flex:0 0 auto;margin-top:auto;min-width:0}#${cid} .grid{gap:2rem}}
                @media(max-width:768px){#${cid} .grid{grid-template-columns:1fr!important;gap:1.5rem}#${cid} .inner{padding:0 1rem}}
                #${cid} .media img,#${cid} .media video,#${cid} .media iframe{max-width:100%;width:100%;height:auto;display:block}
                #${cid} .media figure{max-width:100%;min-width:0;overflow:hidden;margin:0}
              `}</style>
              <div id={cid} style={{ marginTop: 12, background: "#fff", padding: 12, borderRadius: 8, width: "100vw", position: "relative", left: "50%", marginLeft: "-50vw" }}>
                <div className="inner" style={{ maxWidth: max, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
                  <div className="grid" style={{ display: "grid", gridTemplateColumns: `repeat(${p.cols.length},1fr)`, alignItems: "end" }}>
                    {p.cols.map((col, j) => {
                      const colItems = col.indices.map(resolve).filter((x): x is MediaItem => !!x);
                      return (
                        <div key={j} className="col">
                          {col.caption && <div className="markdown-body prose prose-lg max-w-none" style={{ marginBottom: 8 }}><ReactMarkdown remarkPlugins={mdPlugins} rehypePlugins={rhPlugins}>{col.caption}</ReactMarkdown></div>}
                          <div className="media">
                            {colItems.length === 0 ? <em style={{ color: "#999" }}>No media</em>
                              : colItems.length === 1 ? renderItem(colItems[0], `${i}-${j}`)
                              : <MediaCarousel items={colItems as any} titleFontSize={titleFs} captionFontSize={captionFs} />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        }

        return null;
      })}
    </div>
  );
}
