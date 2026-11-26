#!/usr/bin/env bash
# 660 PNGs + synthesised bed + 4 effects -> H.264 / AAC MP4
set -euo pipefail
cd "$(dirname "$0")"

# If you drop your own audio/track.mp3 in, it is used instead of the synth bed.
if [ -f audio/track.mp3 ]; then BED=audio/track.mp3; echo "using audio/track.mp3"; \
else BED=audio/bed.wav; echo "using the synthesised bed"; fi

# Effects sit 16-18 dB under the music so they stay underneath it:
#   buzz 3s · whoosh 5s/10s/15s (the three scene transitions) · shimmer 12s · bell 15s
ffmpeg -y -loglevel error \
  -framerate 30 -i frames/%04d.png \
  -i "$BED" \
  -i audio/sfx_buzz.wav -i audio/sfx_whoosh.wav \
  -i audio/sfx_shimmer.wav -i audio/sfx_bell.wav \
  -filter_complex "\
    [1:a]atrim=0:22,asetpts=N/SR/TB,\
         afade=t=in:st=0:d=1.5,afade=t=out:st=20:d=2,volume=1.0[bed];\
    [3:a]asplit=3[w1][w2][w3];\
    [2:a]adelay=3000|3000,volume=0.13[buzz];\
    [w1]adelay=4700|4700,volume=0.12[wh1];\
    [w2]adelay=9700|9700,volume=0.12[wh2];\
    [w3]adelay=14700|14700,volume=0.12[wh3];\
    [4:a]adelay=12000|12000,volume=0.15[shim];\
    [5:a]adelay=15000|15000,volume=0.16[bell];\
    [bed][buzz][wh1][wh2][wh3][shim][bell]amix=inputs=7:duration=first:normalize=0,\
    loudnorm=I=-14:TP=-1.5:LRA=11,\
    atrim=0:22,asetpts=N/SR/TB,aresample=48000[aout]" \
  -map 0:v -map "[aout]" \
  -c:v libx264 -preset slow -crf 21 \
  -profile:v high -level 4.0 -pix_fmt yuv420p \
  -x264-params "keyint=60:min-keyint=30:scenecut=0" \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -c:a aac -b:a 192k -ar 48000 -ac 2 \
  -movflags +faststart -shortest \
  save-the-date.mp4
