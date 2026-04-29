<!--
  content.md — paper body
  Reference media from publication.ts by 1-based index using [MEDIA:N] tokens.
  See README.md for the full token reference.
-->

### Overview

This is a demo of **md-paper** — a Markdown-native template for publishing academic paper pages on GitHub Pages. Everything you see here is written in plain Markdown. No HTML, no JSX.

You can use all standard formatting: **bold**, *italic*, `inline code`, [links](https://github.com/LuCazzola/md-paper), math ($E = mc^2$), and tables.

| Feature | How |
|---|---|
| Single figure | `[MEDIA:N]` |
| Carousel | `[MEDIA:1-4]` |
| Multi-column | `[MEDIA-MULTICOL]` block |
| Math | KaTeX — `$...$` and `$$...$$` |
| Spacing | `[SPACING:large]` |

### Single figure

A single item displayed full-width. The `{...}` after the token renders as a Markdown caption block above the media.

[MEDIA:1]{**Figure 1 — Neural Architecture Overview.** The `MEDIA:1` token embeds item 1 from your media list at full width. The text inside `{...}` is rendered as Markdown — **bold**, *italic*, `code`, math ($\alpha, \beta$), all work.}

[SPACING:medium]

### Scaled figure

Add `:0.6` to constrain the item to 60% of the container width — useful for diagrams that don't need the full column.

[MEDIA:2:0.55]{**Figure 2 — Experimental Setup** (shown at 55% width via `[MEDIA:2:0.55]`).}

[SPACING:medium]

### Carousel

List a range or comma-separated indices to get a carousel. The `‹` `›` arrows and dot indicators are generated automatically.

[MEDIA:1-4]{**Figures 1–4.** A carousel produced by `[MEDIA:1-4]`. Use `[MEDIA:1,3]` for non-contiguous picks.}

[SPACING:medium]

### Video

Videos autoplay muted and loop by default — ideal for showing motion or animations.

[MEDIA:5]{**Video 1 — Method Demo.** The `[MEDIA:5]` token embeds a video. Autoplay, muted, looping. Set `audio: true` in `publication.ts` to enable sound.}

[SPACING:medium]

### Multi-Column support

The `[MEDIA-MULTICOL]` block places columns next to each other. Columns collapse to a single column on mobile automatically. The scale factor (here `1.1`) lets the block extend slightly beyond the normal content width.

[MEDIA-MULTICOL:1.1]
[MEDIA:5]{**Ours.** A side-by-side column with a video on the left. Caption text is Markdown — *italic*, **bold**, and $\LaTeX$ all work.}
[MEDIA:6]{**Baseline.** The right column. Use as many columns as you need — the grid adapts.}
[/MEDIA-MULTICOL]

[SPACING:medium]

### Math

Full KaTeX support, inline and block:

The loss function is defined as $\mathcal{L} = \mathcal{L}_\text{rec} + \lambda \mathcal{L}_\text{KL}$.

$$
\mathcal{L}_\text{KL} = -\frac{1}{2} \sum_{j=1}^{J} \left(1 + \log \sigma_j^2 - \mu_j^2 - \sigma_j^2\right)
$$

[SPACING:large]

## Cite us

```bibtex
@article{author2025yourpaper,
  title   = {Your Paper Title},
  author  = {Author, A. and Coauthor, B.},
  journal = {arXiv preprint arXiv:XXXX.XXXXX},
  year    = {2025},
}
```
