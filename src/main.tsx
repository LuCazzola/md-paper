/**
 * main.tsx  —  entry point
 * Wires publication.ts + content.md into the page renderer.
 * You do NOT need to edit this file.
 */
import React from "react";
import ReactDOM from "react-dom/client";
import PublicationPage from "@/_internal/PublicationPage";
import "@/_internal/index.css";

// In paper mode (PAPER_MODE=1), Vite root = paper repo root,
// so absolute paths "/publication.ts" and "/content.md" resolve there.
// In standalone demo mode, root = md-paper/, same result.
import publication from "/publication.ts";
import content from "/content.md?raw";

const base = import.meta.env.BASE_URL.replace(/\/$/, "");
const resolve = (p?: string) => (p && p.startsWith("/") ? base + p : p);

if (publication.media) {
  publication.media = publication.media.map((m) => ({ ...m, src: resolve(m.src) ?? m.src }));
}
if (publication.supplementary) publication.supplementary = resolve(publication.supplementary);
if (publication.pdf)           publication.pdf           = resolve(publication.pdf);

publication.content = content;

if (publication.title) document.title = publication.title;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PublicationPage pub={publication} />
  </React.StrictMode>
);
