import React, { useEffect, useRef, useState } from "react";

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
  const [ci, setCi] = useState(0);
  const [containerHeight, setContainerHeight] = useState<number | undefined>(undefined);
  const [sliding, setSliding] = useState(false);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Measure active slide and update container height
  const measureActive = () => {
    const el = slideRefs.current[ci];
    if (!el) return;
    const h = el.getBoundingClientRect().height || el.scrollHeight;
    if (h > 0) setContainerHeight(h);
  };

  useEffect(() => {
    measureActive();
    const el = slideRefs.current[ci];
    if (!el) return;
    const ro = new ResizeObserver(measureActive);
    ro.observe(el);
    // Re-measure when media loads
    el.querySelectorAll("img, video").forEach((m) => {
      m.addEventListener("load", measureActive, { once: true });
      m.addEventListener("loadedmetadata", measureActive, { once: true });
    });
    return () => ro.disconnect();
  }, [ci]);

  // Pause/play videos on slide change
  useEffect(() => {
    slideRefs.current.forEach((el, idx) => {
      const v = el?.querySelector("video") as HTMLVideoElement | null;
      if (!v) return;
      try {
        if (idx === ci) { v.currentTime = 0; v.play()?.catch(() => {}); }
        else v.pause();
      } catch {}
    });
  }, [ci]);

  const go = (dir: number) => {
    if (sliding) return;
    setCi((c) => (c + dir + items.length) % items.length);
  };

  const W = items.length;

  return (
    <div className="w-full">
      {/* Viewport — clips the track, height follows active slide */}
      <div style={{
        position: "relative",
        width: "100%",
        height: containerHeight ? `${containerHeight}px` : "auto",
        overflow: "hidden",
        borderRadius: 8,
        background: "#fff",
        transition: "height 300ms ease",
      }}>
        {/* Track — all slides in a row, shifted by translateX */}
        <div style={{
          display: "flex",
          width: `${W * 100}%`,
          transform: `translateX(-${(ci / W) * 100}%)`,
          transition: "transform 380ms cubic-bezier(0.4,0,0.2,1)",
          alignItems: "flex-start",
          willChange: "transform",
        }}>
          {items.map((it, i) => {
            const near = Math.abs(i - ci) <= 1 || Math.abs(i - ci) >= W - 1;
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
                  <img src={it.src} alt={it.caption ?? "media"} loading="lazy"
                    style={{ width: "100%", height: "auto", display: "block" }} />
                )}
                {it.type === "video" && (near
                  ? <video controls loop playsInline preload="metadata"
                      {...(!(it as any).audio ? { autoPlay: i === ci, muted: true } : {})}
                      poster={(it as any).poster}
                      style={{ width: "100%", height: "auto", display: "block", background: "#000", borderRadius: 4 }}>
                      {videoSources(it.src).map((s, j) => <source key={j} src={s} {...(mimeFor(s) ? { type: mimeFor(s) } : {})} />)}
                    </video>
                  : <div style={{ width: "100%", aspectRatio: "16/9", background: "#000" }} />
                )}
                {it.type === "embed" && (near
                  ? <iframe src={it.src} title={it.caption ?? "embed"} allowFullScreen
                      style={{ border: 0, width: "100%", aspectRatio: "16/9", display: "block" }} />
                  : <div style={{ width: "100%", aspectRatio: "16/9", background: "#eee" }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Arrows */}
        {W > 1 && <>
          <button onClick={() => go(-1)} aria-label="Previous"
            style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", background: "rgba(200,200,200,0.85)", borderRadius: "50%", width: 32, height: 32, border: "none", cursor: "pointer", zIndex: 10, fontSize: 20, lineHeight: 1 }}>‹</button>
          <button onClick={() => go(1)} aria-label="Next"
            style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "rgba(200,200,200,0.85)", borderRadius: "50%", width: 32, height: 32, border: "none", cursor: "pointer", zIndex: 10, fontSize: 20, lineHeight: 1 }}>›</button>
        </>}
      </div>

      {/* Caption */}
      {items[ci]?.caption && (
        <div style={{ fontSize: captionFontSize, color: "#666", marginTop: 8 }}>{items[ci].caption}</div>
      )}

      {/* Dots */}
      {W > 1 && (
        <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "center" }}>
          {items.map((_, i) => (
            <button key={i} onClick={() => setCi(i)} aria-label={`Slide ${i + 1}`}
              style={{ width: 8, height: 8, borderRadius: "50%", background: i === ci ? "var(--md-accent)" : "#ccc", border: "none", cursor: "pointer", padding: 0 }} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaCarousel;
