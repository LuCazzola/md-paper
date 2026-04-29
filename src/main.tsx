/**
 * main.tsx  —  entry point
 *
 * Wires publication.ts + content.md into the page renderer.
 * You do NOT need to edit this file.
 */
import React from "react";
import ReactDOM from "react-dom/client";
import PublicationPage from "@/_internal/PublicationPage";
import publication from "./publication";
import "@/_internal/index.css";
import content from "./content.md?raw";

// Resolve asset paths: prepend BASE_URL/assets to any src/image/supplementary
// that starts with "/" so publication.ts can use plain paths like "/media/foo.jpg"
const base = import.meta.env.BASE_URL.replace(/\/$/, "") + "/assets";
const resolve = (p?: string) => (p && p.startsWith("/") ? base + p : p);

if (publication.media) {
  publication.media = publication.media.map((m) => ({ ...m, src: resolve(m.src) ?? m.src }));
}
if (publication.image)         publication.image         = resolve(publication.image);
if (publication.supplementary) publication.supplementary = resolve(publication.supplementary);
if (publication.pdf)           publication.pdf           = resolve(publication.pdf);

publication.content = content;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PublicationPage pub={publication} />
  </React.StrictMode>
);
