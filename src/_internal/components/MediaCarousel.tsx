import React, { useEffect, useRef, useState } from "react";
import { mimeFor, videoSources } from "@/_internal/lib/videoUtils";

type Item =
  | { type: "image"; src: string; caption?: string; title?: string }
  | { type: "video"; src: string; poster?: string; caption?: string; title?: string; audio?: boolean }
  | { type: "embed"; src: string; caption?: string; title?: string };

const MediaCarousel: React.FC<{ items: Item[]; titleFontSize?: number; captionFontSize?: number }> = ({
  items,
  titleFontSize = 16,
  captionFontSize = 13,
}) => {
  const [ci, setCi] = useState(0);
  const [containerHeight, setContainerHeight] = useState<number | undefined>(undefined);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);

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
    el.querySelectorAll("img, video").forEach((m) => {
      m.addEventListener("load", measureActive, { once: true });
      m.addEventListener("loadedmetadata", measureActive, { once: true });
    });
    return () => ro.disconnect();
  }, [ci]);

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

  const W = items.length;
  const go = (dir: number) => setCi((c) => (c + dir + W) % W);

  return (
    <div className="w-full">
      <div style={{
        position: "relative",
        width: "100%",
        height: containerHeight ? `${containerHeight}px` : "auto",
        overflow: "hidden",
        borderRadius: 8,
        background: "#fff",
        transition: "height 300ms ease",
      }}>
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

        {W > 1 && <>
          <button onClick={() => go(-1)} aria-label="Previous"
            style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", background: "rgba(200,200,200,0.85)", borderRadius: "50%", width: 32, height: 32, border: "none", cursor: "pointer", zIndex: 10, fontSize: 20, lineHeight: 1 }}>‹</button>
          <button onClick={() => go(1)} aria-label="Next"
            style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "rgba(200,200,200,0.85)", borderRadius: "50%", width: 32, height: 32, border: "none", cursor: "pointer", zIndex: 10, fontSize: 20, lineHeight: 1 }}>›</button>
        </>}
      </div>

      {items[ci]?.caption && (
        <div style={{ fontSize: captionFontSize, color: "#666", marginTop: 8 }}>{items[ci].caption}</div>
      )}

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
