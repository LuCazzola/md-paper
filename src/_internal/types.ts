export type Theme = {
  /** Primary accent color used for headings and highlights (CSS color string). */
  accentColor?: string;
  /** Base body font size in px (default 16). Scales the whole page. */
  baseFontSize?: number;
  /** Font size of the paper title in px (default 48, clamped on small screens). */
  titleFontSize?: number;
  /** Font size of author names in px (default 18). */
  authorFontSize?: number;
  /** Font size inside the abstract box in px (default 16). */
  abstractFontSize?: number;
  /** Font size inside markdown body sections in px (default 16). */
  contentFontSize?: number;
  /** Font size of section headings (h2/h3) in px (default 22). */
  headingFontSize?: number;
  /** Font family for body text (default "Lato, sans-serif"). */
  bodyFont?: string;
  /** Font family for headings (default "Patua One, serif"). */
  headingFont?: string;
  /** Max width of the main content column in px (default 1200). */
  contentMaxWidth?: number;
  /** Background color of the page (default "#fff"). */
  pageBackground?: string;
  /** Background color of text/abstract blocks (default "#f7f7f7"). */
  blockBackground?: string;
};

export type MediaItem = {
  type: "image" | "video" | "embed";
  src: string;
  caption?: string;
  title?: string;
  poster?: string;
  /** set true to allow audio on videos (default: muted autoplay) */
  audio?: boolean;
};

export type Publication = {
  title: string;
  /** Visual theme overrides — all fields are optional */
  theme?: Theme;
  /** Array of [displayName, optionalProfileURL] */
  authors: Array<[string, string?]>;
  affiliations?: string;
  venue?: string;
  year?: string;
  pdf?: string;
  /** Link to the paper — arXiv, publisher, or any URL */
  paper?: string;
  code?: string;
  /** Main teaser image shown below the buttons */
  image?: string;
  media?: MediaItem[];
  /** 1-based index into media[] to use as standalone teaser (overrides `image`) */
  teaserIndex?: number;
  supplementary?: string;
  tags?: string[];
  abstract?: string;
  /** Raw markdown string — populated automatically from content.md via main.tsx */
  content?: string;
  /** URL of your main portfolio/site shown in the top-left "Back to site" link */
  siteUrl?: string;
};
