#!/usr/bin/env bash
# 450 PNGs + music + 3 synthesised effects -> H.264 / AAC MP4  (15s)
set -euo pipefail
cd "$(dirname "$0")"

# The generated track runs 23.7s with a quiet intro, a lift at 10s and a settle
# at 21s. Starting 6s in lands the lift just before the celebration at 5s and
# the settle on the final title, so the 15s cut gets the whole arc.
if [ -f audio/track.mp3 ]; then BEDIN=( -ss 6 -i audio/track.mp3 ); echo "using audio/track.mp3 from 6s"; \
else BEDIN=( -i audio/bed.wav ); echo "using the synthesised bed"; fi

# whoosh on the two transitions · sparkle under the petals · bell as the date card opens
MIX="[1:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:15,asetpts=N/SR/TB,\
afade=t=in:st=0:d=1.2,afade=t=out:st=13.3:d=1.7,volume=1.0[bed];\
[3:a]asplit=2[w1][w2];\
[w1]adelay=4700|4700,volume=0.12[wh1];\
[w2]adelay=8500|8500,volume=0.12[wh2];\
[2:a]adelay=2000|2000,volume=0.18[shim];\
[4:a]adelay=8800|8800,volume=0.20[bell];\
[bed][wh1][wh2][shim][bell]amix=inputs=5:duration=first:normalize=0,\
atrim=0:15,asetpts=N/SR/TB"

IN=( "${BEDIN[@]}" -i audio/sfx_shimmer.wav -i audio/sfx_whoosh.wav -i audio/sfx_bell.wav )

# --- pass 1: measure the finished mix so loudnorm can hit -14 LUFS exactly ---
echo "measuring loudness…"
MEAS=$(ffmpeg -hide_banner -nostats -f lavfi -t 15 -i anullsrc "${IN[@]}" \
  -filter_complex "${MIX},loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json[a]" \
  -map "[a]" -f null - 2>&1 | sed -n '/^{/,/^}/p')
get(){ echo "$MEAS" | grep "\"$1\"" | sed 's/.*: *"\([^"]*\)".*/\1/'; }
MI=$(get input_i); MTP=$(get input_tp); MLRA=$(get input_lra); MTH=$(get input_thresh)
echo "  measured I=$MI TP=$MTP LRA=$MLRA"

# --- pass 2: encode ---
ffmpeg -y -loglevel error \
  -framerate 30 -i frames/%04d.png "${IN[@]}" \
  -filter_complex "${MIX},\
loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$MI:measured_TP=$MTP:measured_LRA=$MLRA:measured_thresh=$MTH:linear=true,\
aresample=48000[aout]" \
  -map 0:v -map "[aout]" \
  -c:v libx264 -preset slow -crf 21 \
  -profile:v high -level 4.0 -pix_fmt yuv420p \
  -x264-params "keyint=60:min-keyint=30:scenecut=0" \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -c:a aac -b:a 192k -ar 48000 -ac 2 \
  -movflags +faststart -shortest \
  save-the-date.mp4
