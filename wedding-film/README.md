# Prem & Vasudha — animated save-the-date

9:16 WhatsApp status film. **1080x1920 · 22.000s · 30fps · 660 frames · H.264 + AAC · 4.2 MB**

## Build

    npm i puppeteer-core
    python3 -I gen_audio.py     # -> audio/bed.wav + the four sfx wavs
    node capture.js             # -> frames/0000.png … 0659.png
    ./encode.sh                 # -> save-the-date.mp4

`index.html` is self-contained: inline CSS + JS, inline SVG, no network, system fonts only.

## Determinism

Every animation is a CSS `@keyframes` spanning the full 22s, declared `animation-play-state:
paused`, with `animation-delay: var(--t)`. `setFrame(n)` sets `--t` to `-(n/30)s`, which scrubs
every animation on the page to exactly that instant. No clock, no requestAnimationFrame timing —
frame n renders identically on every run and in any order. `gen_audio.py` is seeded, so the
soundtrack is byte-identical too.

## Character rig

Each character is a **nested `<svg>`** with its own viewBox, so `transform-box: view-box` resolves
joint coordinates in character-local space. Groups: `head`, `torso`, `arm-l/r` → `fore-l/r`,
`leg-l/r` → `shin-l/r`, each with `transform-origin` at its joint. Limbs rotate from the joint and
nest correctly (rotating an upper arm carries its forearm and hand).

Joints, local units (feet at y=0, y negative upward):
hips ±15,-96 · knees -48 · shoulders ±33,-176 · elbows -134 · neck -186 · head centre -222 r36

The scene-3 kneel is solved rather than eyeballed. With hip drop `d`, the back knee reaches the
floor when `54·cos(back thigh) = 96-d` and the front foot stays planted when
`54·cos(front thigh) = 44-d`. At `d=42` that gives back thigh 6°, front thigh 86° — which is why
the front thigh ends up near horizontal, as in a real proposal kneel.

## Timeline

| s | scene | beats |
|---|-------|-------|
| 0–5 | the message | Vasudha seated with her phone, typing bubble with three bouncing dots; his phone buzzes at 3.0s, eyebrows lift, head comes up; a heart drifts off frame |
| 5–10 | the families | four muted characters fade up staggered, all turn their heads to centre, one throws both arms up and hops; one confetti burst falls with horizontal sway |
| 10–15 | the ring | Prem kneels (1.4s, eased, with a squash on the landing), ring raised with a rotating glint; her hands come to her face; marigold petals expand outward |
| 15–22 | the date | mandap draws itself via stroke-dashoffset, marigold strings sway; PREM & VASUDHA (15.25s) → 24 . 01 . 2027 (18.25s) → SAVE THE DATE (20.25s), couple swaying below |

Transitions are gold light curtains at 5 / 10 / 15s — no hard cuts. No text before 15s.
All text sits inside the 12% safe margin (measured: 800 / 483 / 496 px against 821 px usable).

## Audio

No `audio/track.mp3` was present, so `gen_audio.py` synthesises everything with numpy:

- **bed** — F major, four chords of 5.5s (Fmaj7 · Dm7 · B♭maj7 · Csus4): detuned sine pad,
  plucked arpeggio at 80bpm eighths, 55 Hz pulse every 1.5s. Fade in 1.5s, out over the last 2s.
- **effects** — phone buzz @3s (AM rumble), whoosh @4.7/9.7/14.7s (noise through a sweeping
  one-pole lowpass), sparkle @12s (16 staggered high partials), bell @15s (inharmonic partials).

Mixed in one `filter_complex`; effects sit at 0.12–0.16 gain, i.e. **16–18 dB under** the bed.
Final mix normalised with `loudnorm` to **-14.1 LUFS integrated**, -1.5 dBTP.

Drop your own `audio/track.mp3` into `audio/` and `encode.sh` uses it instead of the synth bed;
it is trimmed to 22s and gets the same fades, effects and normalisation.
