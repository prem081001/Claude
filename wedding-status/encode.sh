#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
ffmpeg -y -loglevel error \
  -framerate 30 -i frames/%04d.png \
  -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=48000 \
  -shortest \
  -c:v libx264 -preset slow -crf 19 \
  -profile:v high -level 4.0 -pix_fmt yuv420p \
  -x264-params "keyint=60:min-keyint=30:scenecut=0" \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -c:a aac -b:a 64k \
  -movflags +faststart \
  save-the-date.mp4
