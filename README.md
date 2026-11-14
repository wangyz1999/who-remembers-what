# Who Remembers What? Project page

Project page for the paper **Who Remembers What? Multi-Granularity Memory Extraction for
Multi-User, Multi-Agent Interaction** (MixUA, CrossLearnBench), [arXiv:2611.10439](https://arxiv.org/abs/2611.10439).

A single static page: Vite + Tailwind CSS v4 + vanilla TypeScript. Inter is self-hosted
through `@fontsource-variable/inter`, so the page makes no third-party requests.

## Run and build

```bash
npm ci
npm run dev       # http://localhost:5173
npm run build     # type-check, then build to dist/
npm run preview   # serve dist/ at http://localhost:4173
```

## Deploy (GitHub Pages)

1. Push this repository to GitHub.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Every push to `main` runs `.github/workflows/deploy.yml`, which builds and publishes `dist/`.

The Vite `base` comes from the `BASE_PATH` environment variable (`vite.config.ts`). The
workflow sets it to `/<repo-name>/` from the repository name, so renaming the repository needs
no code change. For a user site (`<user>.github.io`) or a custom domain, set `BASE_PATH: /`
in the workflow. `SITE_URL` (also set by the workflow) only fills the social-card meta tags.

## Content

Every sentence and number on the page is taken from the paper. Edit `index.html` directly;
`src/main.ts` only draws the scope-matrix tiles, drives the hero video buttons and the BibTeX
copy button, and `src/style.css` holds the palette (taken from the paper's figures).

Placeholders to fill in are marked `TODO(author)` in `index.html`:

- Code and Data buttons (commented out; no public link yet).
- The BibTeX entry is a draft built from the arXiv id; replace it with arXiv's own export or
  the venue entry.
- Optional homepage links for the author names.

## Media

All media lives in `media/` (processed and fingerprinted by Vite) plus `public/og-image.jpg`
(stable URL for link previews). Keep it small: large binaries do not belong in this repo.

### Hero video

```bash
bash scripts/encode-hero.sh path/to/mixua_16x9.mp4 path/to/mixua_16x9_poster.png
npm run build
```

This writes `media/hero.mp4` (H.264, 1600 px wide, CRF 25, `-tune animation`, `+faststart`,
no audio), `media/hero-poster.webp`, and `public/og-image.jpg`. The page references these
fixed names, so a new cut is a drop-in replacement. The exact ffmpeg command is in the script.

### Figures

Figures are rasterised from the paper's PDF figures to WebP at about twice their display width:

```bash
uv run --with pymupdf --with pillow python scripts/make-image.py <figure.pdf> media/figures/<name>.webp --width 2000
```

| File | Paper figure | Width |
|---|---|---|
| `overview.webp` | Fig. 1, what MixUA adds to single user-agent memory | 1200 |
| `settings-1..4.webp` | Fig. 2, the four settings, one panel each (`--clip ... --pad 4 --alpha`) | 640 / 680 / 640 / 760 |
| `framework.webp` | Fig. 3, the cross-learning loop | 2200 |
| `results-scheduled.webp` | Fig. 4, scheduled task assignment | 2000 |
| `results-scaling.webp` | Fig. 5, number of users | 2000 |
| `results-random.webp` | Fig. 6, random task assignment | 2000 |
| `task-suites.webp` | Fig. 14, task suites by topic | 2000 |

The four panel crops of Fig. 2 use, in PDF points: `-3,-3,494,538`, `506,-3,1035,538`,
`1047,-3,1534,538`, `1545,-3,2134,538`. The four-scope matrix on the page is drawn in HTML/SVG
(after the paper's Fig. 16), not an image.
