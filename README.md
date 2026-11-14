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

The page is meant to be skimmed in a few minutes: after the hero, a TL;DR with the headline
numbers, the four scopes, how it works, three results, the benchmark in one line, and BibTeX.
Every sentence and number is taken from the paper. Edit `index.html` directly; `src/main.ts`
draws the scope-matrix tiles, drives the hero video and BibTeX copy buttons, and points the
"open full size" figure links at the built image URLs. `src/style.css` holds the palette
(taken from the paper's figures).

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

This writes `media/hero.mp4` (H.264, 1600 px wide, CRF 25, `-tune animation`, `+faststart`;
a soundtrack, if the source has one, is kept as 96 kb/s AAC), `media/hero-poster.webp`, and
`public/og-image.jpg`. The page references these fixed names, so a new cut is a drop-in
replacement. The exact ffmpeg command is in the script.

### Figures

Figures are rasterised from the paper's PDF figures to WebP at about twice their display width;
the three result images are single panels cut out with `--clip` (in PDF points):

```bash
uv run --with pymupdf --with pillow python scripts/make-image.py <figure.pdf> media/figures/<name>.webp --width 2200
```

| File | Paper figure | Width | Clip |
|---|---|---|---|
| `framework.webp` | Fig. 3, the cross-learning loop | 2200 | |
| `finding-tradeoff.webp` | Fig. 4b, utility gain against preference retention | 1000 | `280,0,494,128.17` |
| `finding-random.webp` | Fig. 6a, cumulative pass rate over 8 rounds | 800 | `0,0,142,131.2` |
| `finding-scale.webp` | Fig. 5c, preference retention at 5, 20, 100 users | 900 | `327,24,495.6,136.3` |

The Fig. 5c crop drops the figure's shared legend, so the page draws that legend in HTML.
The four-scope matrix is drawn in HTML/SVG (after the paper's Fig. 16), not an image.
