# Prem & Vasudha — animated save-the-date

9:16 WhatsApp status. **1080x1920 · 22.000s · 30fps · 660 frames · H.264 + AAC · 7.8 MB · -14.0 LUFS**

## Build

    npm i puppeteer-core
    python3 -I gen_audio.py     # -> audio/bed.wav + the four sfx wavs
    node capture.js             # -> frames/0000.png … 0659.png
    ./encode.sh                 # -> save-the-date.mp4

## How it is made

Cutout animation. The characters are illustrated PNG layers with alpha,
generated to a single style brief and trimmed to their content bounds, then
animated on a deterministic timeline. Everything around them — backdrop,
confetti, marigold petals, the mandap that draws itself, the typing bubble,
the gold-light transitions and the titles — is inline SVG/CSS.

`art/` holds the source illustrations; `art/t_*.png` are the trimmed layers the
page actually loads. Re-trim with an alpha threshold of 60 to drop the soft
glow the generator leaves around each subject, otherwise the figures float.

## Determinism

Every animation is a CSS `@keyframes` spanning the full 22s, declared
`animation-play-state: paused`, with `animation-delay: var(--t)`. `setFrame(n)`
sets `--t` to `-(n/30)s`, scrubbing the whole page to that instant. No clock, no
requestAnimationFrame timing — frame n renders identically on every run and in
any order. The page only reports `__ready` once every illustration has decoded,
so no frame can capture a half-loaded layer. `gen_audio.py` is seeded, so the
soundtrack is byte-identical too.

## Timeline

| s | scene | beats |
|---|-------|-------|
| 0–5 | the message | she sits with her phone, typing bubble with three bouncing dots; his phone buzzes at 3.0s and he looks up delighted; a heart drifts off frame |
| 5–10 | the families | two family groups fade up either side, the couple celebrate in the middle with a hop; one confetti burst falls with horizontal sway |
| 10–15 | the ring | he kneels with the ring, she brings both hands to her face, a rotating glint on the ring and marigold petals expanding outward |
| 15–22 | the date | the mandap draws itself via stroke-dashoffset with swaying marigold strings; PREM & VASUDHA (15.25s) → 24 . 01 . 2027 (18.25s) → SAVE THE DATE (20.25s) |

Transitions are gold light curtains at 5 / 10 / 15s. No text before 15s.
All titles sit inside the 12% safe margin.

## Audio

`audio/track.mp3` is a generated Indian wedding instrumental — sitar and bansuri
over tabla and dholak, with shehnai and strings. It has a real arc: a tender
intro, a festive lift at 10s that carries the proposal and the titles, and a
natural settle at the end. `encode.sh` trims it to 22s, fades in 1.5s and out
over the last 2s.

Over the top sit four effects synthesised by `gen_audio.py` with numpy alone:
phone buzz @3s, whoosh @4.7/9.7/14.7s (the three transitions), sparkle @12s and
bell @15s, all 14–18 dB under the music.

Loudness is set by a **two-pass** `loudnorm`: pass one measures the finished mix,
pass two normalises with those numbers. Single-pass lands about 2 dB hot — this
hits **-14.0 LUFS integrated, -2.5 dBTP**, right for a phone speaker.

Replace `audio/track.mp3` with any other track and re-run `./encode.sh`; delete it
and the script falls back to the synthesised bed from `gen_audio.py`.

`index_svg_backup.html` is the earlier all-SVG version, kept for reference.
