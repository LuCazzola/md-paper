/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │  publication.ts  —  YOUR PAPER'S METADATA                               │
 * │                                                                         │
 * │  Fill in every field that applies to your paper.                        │
 * │  Leave optional fields as undefined (or remove them) to hide them.      │
 * │                                                                         │
 * │  Media files go in:  public/assets/media/                               │
 * │  Other files (PDF, zips) go in:  public/assets/resources/               │
 * │                                                                         │
 * │  Use plain paths starting with "/" — the base URL is added automatically.│
 * └─────────────────────────────────────────────────────────────────────────┘
 */
import type { Publication, Theme } from "@/_internal/types";

// ── theme (all fields are optional — remove any line to use the default) ──────
const theme: Theme = {
  accentColor:     "#0a4b7c",   // headings, title color  (any CSS color)
  pageBackground:  "#ffffff",   // page background
  blockBackground: "#f7f7f7",   // abstract / text-block background
  baseFontSize:    16,          // root font size in px (scales everything)
  titleFontSize:   48,          // paper title, max px (clamped on small screens)
  authorFontSize:  18,          // author list font size in px
  headingFontSize: 22,          // h2/h3 inside abstract & content
  abstractFontSize:16,          // abstract body text in px
  contentFontSize: 16,          // markdown body text in px
  mediaTitleFontSize:  18,      // media item title font size in px
  mediaCaptionFontSize:13,      // media item caption font size in px
  contentMaxWidth: 1200,        // max column width in px
  bodyFont:        "Lato, sans-serif",
  headingFont:     '"Patua One", serif',
};

const publication: Publication = {
  // ── required ──────────────────────────────────────────────────────────────
  title: "Your Paper Title",
  theme,

  // Each author is [displayName, optionalProfileURL]
  authors: [
    ["A. Author",  "https://scholar.google.com/"],
    ["B. Coauthor"],   // no link → just plain text
  ],

  // ── venue & year ──────────────────────────────────────────────────────────
  venue: "(CONF) Full Conference Name",
  year:  "2025",

  // ── optional text ─────────────────────────────────────────────────────────
  affiliations: "University X; Institute Y",
  teaserIndex: 6,   // 1-based index into media[] to show below the buttons
  abstract: `Your abstract text goes here. It will be shown in a grey box below the buttons. You can write multiple sentences — just keep it as a plain string (no markdown here).`,

  // ── links (remove or set to undefined to show a greyed-out button) ────────
  paper:         "https://arxiv.org/abs/XXXX.XXXXX",   // arXiv, publisher, or any URL
  pdf:           undefined,
  code:          undefined,
  supplementary: undefined,

  // ── back-link shown top-left ───────────────────────────────────────────────
  siteUrl: "https://your-portfolio.github.io/",

  // ── media list — referenced in content.md by 1-based index ────────────────
  // Paths are relative to public/assets/ — just start with "/"
  media: [
    // 1 — single image example
    {
      type:    "image",
      src:     "/media/demo/figure1.jpg",
      title:   "Neural Architecture Overview",
      caption: "High-level diagram of the proposed architecture.",
    },
    // 2 — second image (used in side-by-side)
    {
      type:    "image",
      src:     "/media/demo/figure2.jpg",
      title:   "Experimental Setup",
      caption: "The physical setup used during data collection.",
    },
    // 3 — third image (carousel)
    {
      type:    "image",
      src:     "/media/demo/figure3.jpg",
      title:   "Quantitative Results",
      caption: "Performance curves across all benchmarks.",
    },
    // 4 — fourth image (carousel)
    {
      type:    "image",
      src:     "/media/demo/figure4.jpg",
      title:   "Ablation Study",
      caption: "Component-wise contribution to final accuracy.",
    },
    // 5 — first video
    {
      type:    "video",
      src:     "/media/demo/demo_video1.mp4",
      title:   "Method Demo",
      caption: "The model running in real time on a held-out test sequence.",
    },
    // 6 — second video (used in side-by-side comparison)
    {
      type:    "video",
      src:     "/media/demo/demo_video2.mp4",
      title:   "Baseline Comparison",
      caption: "The previous state-of-the-art on the same input.",
    },
  ],
};

export default publication;
