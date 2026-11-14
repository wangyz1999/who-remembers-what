"""Turn a paper figure (PDF) or an illustration (PNG) into a compressed WebP for the page.

    uv run --with pymupdf --with pillow python scripts/make-image.py IN OUT --width 2000
    uv run --with pymupdf --with pillow python scripts/make-image.py fig.pdf out.webp \
        --width 640 --clip=-3,-3,494,538 --pad 4 --alpha   # one panel, in PDF points

A PDF is rasterised at exactly the zoom that gives --width pixels (about twice the width
the page displays it at, so text stays sharp on high-DPI screens). A raster input is
resized with Lanczos. Transparency is kept.

--pad grows the PDF page by that many points on every side before rendering, for figures
whose outermost outlines are drawn just past the page edge. --clip is always given in the
PDF's own coordinates. --alpha keeps the unpainted background transparent (so a rounded
panel keeps its rounded corners on any page colour).
"""

import argparse
import pathlib

import pymupdf
from PIL import Image


def render_pdf(
    path: pathlib.Path, width: int, clip: str | None, pad: float, alpha: bool
) -> Image.Image:
    page = pymupdf.open(path)[0]
    if pad:
        mb = page.mediabox
        page.set_mediabox(pymupdf.Rect(mb.x0 - pad, mb.y0 - pad, mb.x1 + pad, mb.y1 + pad))
    rect = page.rect
    if clip:
        x0, y0, x1, y1 = (float(v) + pad for v in clip.split(","))
        rect = pymupdf.Rect(x0, y0, x1, y1)
    zoom = width / rect.width
    pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), clip=rect, alpha=alpha)
    mode = "RGBA" if alpha else "RGB"
    return Image.frombytes(mode, (pix.width, pix.height), pix.samples)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("src", type=pathlib.Path)
    ap.add_argument("out", type=pathlib.Path)
    ap.add_argument("--width", type=int, required=True)
    ap.add_argument("--clip", help="x0,y0,x1,y1 in PDF points (PDF input only)")
    ap.add_argument("--pad", type=float, default=0.0, help="grow the PDF page by N points")
    ap.add_argument("--alpha", action="store_true", help="transparent background (PDF input)")
    ap.add_argument("--quality", type=int, default=86)
    args = ap.parse_args()

    if args.src.suffix.lower() == ".pdf":
        img = render_pdf(args.src, args.width, args.clip, args.pad, args.alpha)
    else:
        img = Image.open(args.src).convert("RGBA")
        h = round(img.height * args.width / img.width)
        img = img.resize((args.width, h), Image.LANCZOS)

    args.out.parent.mkdir(parents=True, exist_ok=True)
    img.save(args.out, "WEBP", quality=args.quality, method=6)
    print(f"{args.out}  {img.width}x{img.height}  {args.out.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    main()
