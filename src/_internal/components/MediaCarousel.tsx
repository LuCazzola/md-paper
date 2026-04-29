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
  // Track which indices are "mounted" so off-screen videos stay paused but
  // nearby slides are pre-rendered for smooth transitions.
  const activeRef = useRef<HTMLDivElement | null>(null);
  const [containerHeight, setContainerHeight] = useState<number | undefined>(undefined);

  // Measure active slide height and sync it to the container
  useEffect(() => {
    if (!activeRef.current) return;
    const el = activeRef.current;
    const measure = () => setContainerHeight(el.getBoundingClientRect().height || el.scrollHeight || undefined);
    measure();
    // Re-measure after images/videos load
    const imgs = el.querySelectorAll("img, video");
    imgs.forEach((m) => {
      m.addEventListener("load", measure, { once: true });
      m.addEventListener("loadedmetadata", measure, { once: true });
    });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ci]);

  // Pause/play videos when slide changes
  useEffect(() => {
    document.querySelectorAll<HTMLVideoElement>(`[data-carousel-video]`).forEach((v) => {
      const idx = Number(v.dataset.carouselIndex ?? -1);
      try {
        if (idx === ci) { v.currentTime = 0; v.play()?.catch(() => {}); }
        else { v.pause(); }
      } catch {}
    });
  }, [ci]);

  const go = (dir: number) => setCi((c) => (c + dir + items.length) % items.length);

  return (
    <div className="w-full">
      {/* Container: height animates to match current slide */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: containerHeight ? `${containerHeight}px` : "auto",
          transition: "height 300ms ease",
          borderRadius: 8,
          overflow: "hidden",
          background: "#fff",
        }}
      >
        {items.map((it, i) => {
          const active = i === ci;
          const near = Math.min(Math.abs(i - ci), items.length - Math.abs(i - ci)) <= 1;
          const Title = it.title
            ? <div style={{ fontSize: titleFontSize, fontWeight: 600, marginBottom: 6, textAlign: "center" }}>{it.title}</div>
            : null;

          return (
            <div
              key={i}
              ref={active ? activeRef : undefined}
              style={{
                position: active ? "relative" : "absolute",
                top: 0, left: 0,
                width: "100%",
                opacity: active ? 1 : 0,
                // keep in DOM but invisible so measurements and video state are stable
                pointerEvents: active ? "auto" : "none",
                transition: "opacity 300ms ease",
                zIndex: active ? 1 : 0,
              }}
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
                near
                  ? <video
                      controls loop playsInline preload="metadata"
                      {...(!(it as any).audio ? { autoPlay: active, muted: true } : {})}
                      poster={(it as any).poster}
                      data-carousel-video
                      data-carousel-index={i}
                      style={{ width: "100%", height: "auto", display: "block", background: "#000", borderRadius: 4 }}
                    >
                      {videoSources(it.src).map((s, j) => <source key={j} src={s} {...(mimeFor(s) ? { type: mimeFor(s) } : {})} />)}
                    </video>
                  : <div style={{ width: "100%", aspectRatio: "16/9", background: "#000" }} />
              )}
              {it.type === "embed" && (
                near
                  ? <iframe src={it.src} title={it.caption ?? "embed"} allowFullScreen
                      style={{ border: 0, width: "100%", aspectRatio: "16/9", display: "block" }} />
                  : <div style={{ width: "100%", aspectRatio: "16/9", background: "#eee" }} />
              )}
            </div>
          );
        })}

        {/* Prev / Next arrows */}
        {items.length > 1 && (
          <>
            <button onClick={() => go(-1)} aria-label="Previous"
              style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", background: "rgba(200,200,200,0.85)", borderRadius: "50%", width: 32, height: 32, border: "none", cursor: "pointer", zIndex: 10, fontSize: 20, lineHeight: 1 }}>‹</button>
            <button onClick={() => go(1)} aria-label="Next"
              style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "rgba(200,200,200,0.85)", borderRadius: "50%", width: 32, height: 32, border: "none", cursor: "pointer", zIndex: 10, fontSize: 20, lineHeight: 1 }}>›</button>
          </>
        )}
      </div>

      {/* Caption */}
      {items[ci]?.caption && (
        <div style={{ fontSize: captionFontSize, color: "#666", marginTop: 8 }}>{items[ci].caption}</div>
      )}

      {/* Dot indicators */}
      {items.length > 1 && (
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
