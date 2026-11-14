import '@fontsource-variable/inter';
import '@fontsource-variable/inter/wght-italic.css';
import './style.css';

/* Scope matrix tiles ------------------------------------------------------------------
 * Four users (rows) x five agents (columns), as in the paper's matrix figure. The pair
 * that wrote the entry is row 2, column 3; each scope shades the region that may read it. */
type Scope = 'pair' | 'user' | 'agent' | 'global';

const SCOPE_COLORS: Record<Scope, { solid: string; light: string }> = {
  pair: { solid: '#8B5CF6', light: '#E7DDFD' },
  user: { solid: '#12A38A', light: '#D2F1E9' },
  agent: { solid: '#E8930A', light: '#FDEBC6' },
  global: { solid: '#2F7FEA', light: '#D7E7FC' },
};

const ROWS = 4;
const COLS = 5;
const ORIGIN = { r: 1, c: 2 };

function inScope(scope: Scope, r: number, c: number): boolean {
  switch (scope) {
    case 'pair':
      return r === ORIGIN.r && c === ORIGIN.c;
    case 'user':
      return r === ORIGIN.r;
    case 'agent':
      return c === ORIGIN.c;
    case 'global':
      return true;
  }
}

function tilesSvg(scope: Scope): string {
  const size = 18;
  const gap = 4;
  const { solid, light } = SCOPE_COLORS[scope];
  const width = COLS * size + (COLS - 1) * gap;
  const height = ROWS * size + (ROWS - 1) * gap;
  let rects = '';
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = c * (size + gap);
      const y = r * (size + gap);
      const origin = r === ORIGIN.r && c === ORIGIN.c;
      if (origin) {
        rects += `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="4" fill="${solid}" stroke="#101A33" stroke-width="2.2"/>`;
      } else if (inScope(scope, r, c)) {
        rects += `<rect x="${x + 0.6}" y="${y + 0.6}" width="${size - 1.2}" height="${size - 1.2}" rx="3.6" fill="${light}" stroke="${solid}" stroke-width="1.2"/>`;
      } else {
        rects += `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="4" fill="#EEF1F6"/>`;
      }
    }
  }
  return `<svg viewBox="-2 -2 ${width + 4} ${height + 4}" aria-hidden="true" focusable="false">${rects}</svg>`;
}

document.querySelectorAll<HTMLElement>('[data-tiles]').forEach((el) => {
  const scope = el.dataset.tiles as Scope;
  if (scope in SCOPE_COLORS) el.outerHTML = tilesSvg(scope);
});

/* Hero video --------------------------------------------------------------------------- */
function setupVideo(): void {
  const video = document.querySelector<HTMLVideoElement>('#hero-video');
  if (!video) return;

  // Respect a reduced-motion preference; native controls let the viewer start it.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    video.removeAttribute('autoplay');
    video.pause();
  }
}

/* Copy BibTeX ------------------------------------------------------------------------- */
function setupCopy(): void {
  const button = document.querySelector<HTMLButtonElement>('#copy-bib');
  const source = document.querySelector<HTMLElement>('#bibtex');
  const status = document.querySelector<HTMLElement>('#copy-status');
  if (!button || !source) return;
  const label = button.querySelector('[data-label]');
  let timer: number | undefined;

  const fallbackCopy = (text: string): boolean => {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    area.remove();
    return ok;
  };

  button.addEventListener('click', async () => {
    const text = source.innerText.trim();
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch {
      ok = fallbackCopy(text);
    }
    const message = ok ? 'Copied' : 'Press Ctrl+C to copy';
    if (label) label.textContent = message;
    if (status) status.textContent = ok ? 'BibTeX copied to clipboard' : message;
    if (!ok) {
      const range = document.createRange();
      range.selectNodeContents(source);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      if (label) label.textContent = 'Copy';
    }, 2000);
  });
}

// "Open figure full size" links: Vite fingerprints the <img> sources into assets/ but leaves
// <a href> alone, so point each link at its image's built URL.
function setupFigureLinks(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="./media/"]').forEach((a) => {
    const img = a.querySelector('img');
    if (img) a.href = img.src;
  });
}

setupVideo();
setupCopy();
setupFigureLinks();
