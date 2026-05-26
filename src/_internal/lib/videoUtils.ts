export const mimeFor = (src?: string): string | undefined => {
  const ext = src?.split("?")[0].split(".").pop()?.toLowerCase();
  if (ext === "mp4")  return "video/mp4";
  if (ext === "webm") return "video/webm";
  if (ext === "ogv" || ext === "ogg") return "video/ogg";
};

export const videoSources = (s?: string): string[] => {
  if (!s) return [];
  const [path, query] = s.split("?");
  const ext  = path.split(".").pop()?.toLowerCase() ?? "";
  const base = path.replace(/\.[^.]+$/, "");
  const q    = query ? `?${query}` : "";
  const c    = [s];
  if (ext === "mp4")  c.push(`${base}.webm${q}`);
  else if (ext === "webm") c.push(`${base}.mp4${q}`);
  else { c.push(`${base}.mp4${q}`); c.push(`${base}.webm${q}`); }
  return [...new Set(c)];
};
