#!/usr/bin/env bash
# Re-encode the hero animation and its poster for the web.
#
#   bash scripts/encode-hero.sh path/to/mixua_16x9.mp4 path/to/mixua_16x9_poster.png
#
# Writes media/hero.mp4 and media/hero-poster.webp (plus public/og-image.jpg for link
# previews). Swapping in a new cut is just: run this, rebuild, commit the three files.
#
# Video: H.264 High, 1600 px wide, no audio track, CRF 25 with -tune animation (flat colours
# and text compress well), +faststart so playback starts before the download finishes.
# A 65 s 1080p cut comes out at about 3.5 MB; raise CRF if a longer cut exceeds ~5 MB.
# The current cut is silent, so audio is dropped (-an). If a later cut has sound, replace
# -an with -c:a aac -b:a 96k; the page's "Player controls" button then exposes the volume.
set -euo pipefail

src_video="${1:?usage: encode-hero.sh <video.mp4> <poster.png>}"
src_poster="${2:?usage: encode-hero.sh <video.mp4> <poster.png>}"
root="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$root/media" "$root/public"

ffmpeg -y -i "$src_video" -an \
  -vf "scale=1600:-2:flags=lanczos" \
  -c:v libx264 -preset veryslow -tune animation -crf 25 \
  -pix_fmt yuv420p -profile:v high -movflags +faststart \
  "$root/media/hero.mp4"

ffmpeg -y -i "$src_poster" -vf "scale=1600:-2:flags=lanczos" \
  -c:v libwebp -quality 82 -compression_level 6 \
  "$root/media/hero-poster.webp"

ffmpeg -y -i "$src_poster" -vf "scale=1200:-2:flags=lanczos" -q:v 4 \
  "$root/public/og-image.jpg"

ls -l "$root/media/hero.mp4" "$root/media/hero-poster.webp" "$root/public/og-image.jpg"
