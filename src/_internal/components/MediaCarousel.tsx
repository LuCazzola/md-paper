import React, { useEffect, useRef, useState, useCallback } from "react";

type Item =
  | { type: "image"; src: string; caption?: string; title?: string }
  | { type: "video"; src: string; poster?: string; caption?: string; title?: string; audio?: boolean }
  | { type: "embed"; src: string; caption?: string; title?: string };

const mimeFor = (src?: string) => {
  const ext = src?.split("?")[0].split(".").pop()?.toLowerCase();
  if (ext === "mp4") return "video/mp4";
  if (ext === "webm") return "video/webm";
  if (ext === "ogv" || ext === "ogg") return "video/ogg";
};

const videoSources = (s?: string) => {
  if (!s) return [] as string[];
  const [path, query] = s.split("?");
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  const base = path.replace(/\.[^.]+$/, "");
  const q = query ? `?${query}` : "";
  const c = [s];
  if (ext === "mp4") c.push(`${base}.webm${q}`);
  else if (ext === "webm") c.push(`${base}.mp4${q}`);
  else { c.push(`${base}.mp4${q}`); c.push(`${base}.webm${q}`); }
  return [...new Set(c)];
};

const MediaCarousel: React.FC<{ items: Item[]; titleFontSize?: number; captionFontSize?: number }> = ({
  items,
  titleFontSize = 16,
  captionFontSize = 13,
}) => {
  const hasClones = items.length > 1;
  const slides = hasClones ? [items[items.length - 1], ...items, items[0]] : items;
  const [si, setSi] = useState(hasClones ? 1 : 0);
  const [noTransition, setNoTransition] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);

  const ci = items.length > 0 ? ((si - 1 + items.length) % items.length) : 0;
  const W = slides.length;

  // Sync video play/pause on slide change
  useEffect(() => {
    slideRefs.current.forEach((el, idx) => {
      const v = el?.querySelector("video") as HTMLVideoElement | null;
      if (!v) return;
      try {
        if (idx === si) { v.currentTime = 0; v.play()?.catch(() => {}); }
        else { v.pause(); if (!isNaN(v.duration)) v.currentTime = 0; }
      } catch {}
    });
  }, [si]);

  // Infinite-loop jump: after transition ends, silently jump clone → real slide
  useEffect(() => {
    const el = trackRef.current;
    if (!el || !hasClones) return;
    const onEnd = () => {
      if (si === slides.length - 1) { setNoTransition(true); setSi(1); requestAnimationFrame(() => requestAnimationFrame(() => setNoTransition(false))); }
      else if (si === 0)            { setNoTransition(true); setSi(slides.length - 2); requestAnimationFrame(() => requestAnimationFrame(() => setNoTransition(false))); }
    };
    el.addEventListener("transitionend", onEnd);
    return () => el.removeEventListener("transitionend", onEnd);
  }, [si, slides.length, hasClones]);

  useEffect(() => { slideRefs.current = slideRefs.current.slice(0, slides.length); }, [slides.length]);

  return (
    <div className="w-full">
      {/* Viewport: clips the sliding track, height is driven by current slide content */}
      <div style={{ position: "relative", width: "100%", overflow: "hidden", borderRadius: 8, background: "#fff" }}>
        {/* Track: all slides laid out side by side, each 1/W of the total width */}
        <div
          ref={trackRef}
          style={{
            display: "flex",
            width: `${W * 100}%`,
            transition: noTransition ? "none" : "transform 420ms ease",
            transform: `translateX(-${(si / W) * 100}%)`,
            alignItems: "flex-start",   // each slide shrinks to its own height
          }}
        >
          {slides.map((it, i) => {
            const ri = hasClones ? ((i - 1 + items.length) % items.length) : i;
            const dist = Math.min(Math.abs(ri - ci), Math.max(items.length, 1) - Math.abs(ri - ci));
            const heavy = dist <= 1;
            const Title = it.title
              ? <div style={{ fontSize: titleFontSize, fontWeight: 600, marginBottom: 6, textAlign: "center" }}>{it.title}</div>
              : null;

            return (
              <div
                key={i}
                ref={(el) => (slideRefs.current[i] = el)}
                style={{ width: `${100 / W}%`, flexShrink: 0, boxSizing: "border-box" }}
              >
                {Title}
                {it.type === "image" && (
                  <img
                    src={it.src}
                    alt={it.caption ?? "media"}
                    loading="lazy"
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                )}
                {it.type === "video" && (
                  heavy
                    ? <video
                        controls loop playsInline preload="metadata"
                        {...(!(it as any).audio ? { autoPlay: true, muted: true } : {})}
                        poster={(it as any).poster}
                        style={{ width: "100%", height: "auto", display: "block", background: "#000" }}
                      >
                        {videoSources(it.src).map((s, j) => <source key={j} src={s} {...(mimeFor(s) ? { type: mimeFor(s) } : {})} />)}
                      </video>
                    : <div style={{ width: "100%", aspectRatio: "16/9", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", opacity: 0.7 }}>Video</div>
                )}
                {it.type === "embed" && (
                  heavy
                    ? <iframe src={it.src} title={it.caption ?? "embed"} allowFullScreen style={{ border: 0, width: "100%", aspectRatio: "16/9", display: "block" }} />
                    : <div style={{ width: "100%", aspectRatio: "16/9", background: "#eee", display: "flex", alignItems: "center", justifyContent: "center", color: "#666" }}>Embed</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Prev / Next arrows */}
        {hasClones && (
          <>
            <button onClick={() => setSi((s) => s - 1)} aria-label="Previous"
              style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", background: "rgba(200,200,200,0.85)", borderRadius: "50%", width: 32, height: 32, border: "none", cursor: "pointer", zIndex: 5, fontSize: 20, lineHeight: 1 }}>‹</button>
            <button onClick={() => setSi((s) => s + 1)} aria-label="Next"
              style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "rgba(200,200,200,0.85)", borderRadius: "50%", width: 32, height: 32, border: "none", cursor: "pointer", zIndex: 5, fontSize: 20, lineHeight: 1 }}>›</button>
          </>
        )}
      </div>

      {/* Caption for current slide */}
      {items[ci]?.caption && (
        <div style={{ fontSize: captionFontSize, color: "#666", marginTop: 8 }}>{items[ci].caption}</div>
      )}

      {/* Dot indicators */}
      {hasClones && (
        <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "center" }}>
          {items.map((_, i) => (
            <button key={i} onClick={() => setSi(i + (hasClones ? 1 : 0))} aria-label={`Slide ${i + 1}`}
              style={{ width: 8, height: 8, borderRadius: "50%", background: i === ci ? "var(--md-accent)" : "#ccc", border: "none", cursor: "pointer", padding: 0 }} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaCarousel;
