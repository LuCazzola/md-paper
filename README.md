# MD-Paper

Publish an academic paper page on GitHub Pages by editing three plain-text files — no HTML, no build knowledge required.

Projects build with MD-Paper
* [Kinetic Mining in Context: Few-Shot Action Synthesis via Text-to-Motion Distillation](https://lucazzola.github.io/kinemic-page/)

## Quick start

1. Click **Use this template** on GitHub to create your repo
2. Go to **Settings → Pages → Source → GitHub Actions**
3. Edit the three files below and push — your page deploys automatically

## Files you edit

| File | What goes in it |
|---|---|
| `src/publication.ts` | Title, authors, links, media list, optional theme |
| `src/content.md` | Paper body in Markdown |
| `public/assets/media/` | Images and videos |

Also update `<title>` and `<meta name="description">` in `index.html`.

## Guides

- [Filling out publication.ts](docs/publication.md)
- [Writing content.md — media tokens and layout](docs/content.md)
- [Deploying to GitHub Pages](docs/deploy.md)

## Local preview

```bash
npm install
npm run dev
```

## License

Free to use — attribution appreciated.  
If md-paper is useful for your work, a link back to this repo is welcome.
