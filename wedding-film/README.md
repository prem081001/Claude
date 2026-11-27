# Prem & Vasudha — animated save-the-date

9:16 WhatsApp status. **1080x1920 · 15.000s · 30fps · 450 frames · H.264 + AAC · 5.3 MB · -13.9 LUFS**

## Build

    npm i puppeteer-core
    python3 -I gen_audio.py     # -> audio/bed.wav + the four sfx wavs
    node capture.js             # -> frames/0000.png … 0449.png
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

Three beats: **he asks → she says yes → save the date.**

| s | scene | beats |
|---|-------|-------|
| 0–5 | he asks | he kneels with the ring, she brings both hands to her face; a rotating glint on the ring and marigold petals expanding outward at 2.2s; the shot pushes in slowly |
| 5–8.8 | she says yes | both arms up, a double hop of joy, one confetti burst falling with horizontal sway |
| 8.8–15 | save the date | the mandap draws itself via stroke-dashoffset with swaying marigold strings; PREM & VASUDHA (9.25s) → 24 . 01 . 2027 (11.35s) → SAVE THE DATE (13.05s), couple holding hands below |

Transitions are gold light curtains at 5 and 8.8s. No text before 8.8s.
All titles sit inside the 12% safe margin.

`--dur` on `:root` is set from `DUR` at load, so the CSS animation length can
never drift out of step with the timeline constant.

## Audio

`audio/track.mp3` is a generated Indian wedding instrumental — sitar and bansuri
over tabla and dholak, with shehnai and strings. It runs 23.7s with a quiet
intro, a lift at 10s and a settle at 21s, so `encode.sh` starts it **6s in**:
that lands the lift just before the celebration at 5s and the settle on the
final title, giving the 15s cut the whole arc. Fades in 1.2s, out over 1.7s.

Over the top sit four effects synthesised by `gen_audio.py` with numpy alone:
whoosh @4.7/8.5s (the two transitions), sparkle @2.0s under the petals and a
bell @8.8s as the date card opens, all 14–18 dB under the music.

Loudness is set by a **two-pass** `loudnorm`: pass one measures the finished mix,
pass two normalises with those numbers. Single-pass lands about 2 dB hot — this
hits **-13.9 LUFS integrated, -3.3 dBTP**, right for a phone speaker.

Replace `audio/track.mp3` with any other track and re-run `./encode.sh`; delete it
and the script falls back to the synthesised bed from `gen_audio.py`.

`index_svg_backup.html` is the earlier all-SVG version, kept for reference.
