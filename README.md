# md-paper

The engine behind [MarkDownPAPER](https://github.com/LuCazzola/MarkDownPAPER) — a build system for academic paper websites written in Markdown.

This repo contains only the engine source. You do not clone or edit this directly.  
See [MarkDownPAPER](https://github.com/LuCazzola/MarkDownPAPER) for the full guide on creating a paper.

---

## Using as a submodule

In your paper repo:

```bash
git submodule add https://github.com/LuCazzola/md-paper md-paper
```

### Updating

```bash
git submodule update --remote md-paper
git add md-paper
git commit -m "Update md-paper engine"
```

---

## What's inside

```
md-paper/
├── src/
│   ├── _internal/         ← React components and rendering logic
│   └── main.tsx           ← entry point (wires publication.ts + content.md)
├── vite.config.ts         ← dual-mode build (standalone + submodule)
├── tailwind.config.cjs
├── postcss.config.js
├── tsconfig.json
├── package.json           ← all dependencies
└── types.ts               ← re-exports Publication, Theme, COMING_SOON
```

---

## License

Open source — free to use with attribution.
