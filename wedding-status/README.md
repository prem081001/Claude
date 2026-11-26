# Prem & Vasudha — Save The Date (9:16 trailer)

1080x1920 · 15s · 30fps · 450 frames · H.264 / yuv420p

## Build

    npm i puppeteer-core
    node capture.js      # renders frames/0000.png … 0449.png
    ./encode.sh          # -> save-the-date.mp4

`index.html` is self-contained (inline CSS + JS, no network, no fonts to fetch).
The timeline is purely frame-indexed: `window.setFrame(n)` for n in 0..449 is a
pure function of n, so every capture run is byte-identical. Nothing reads a clock.

## Dropping in your photo

Replace `<div id="photo-1">` (around line 100 of index.html) with your image, or
just add a `background-image` to it:

    #photo-1 { background-image: url('photo.jpg'); }

Keep `background-size: cover`. The Ken Burns push (scale 1.00 → 1.13 with a slow
drift) is applied by JS to that element, so any image inherits it.
The visible window is the 2.39:1 letterbox: 1080 x 452.

## Timeline

| frames    | time        | beat |
|-----------|-------------|------|
| 0–59      | 0.0–2.0s    | black, "THIS JANUARY" fades up |
| 60–89     | 2.0–3.0s    | hard cut, "A STORY / THAT WAITED" stamps |
| 90–119    | 3.0–4.0s    | hard cut, "FOR THE RIGHT / PERSON" stamps |
| 120–179   | 4.0–6.0s    | letterbox bars slide in, Ken Burns push on #photo-1 |
| 180–239   | 6.0–8.0s    | 3 flash cuts @ 20f: TWO FAMILIES / ONE CELEBRATION / ONE DATE |
| 240–329   | 8.0–11.0s   | black, PREM … & … VASUDHA (0.4s pause between each) |
| 330–389   | 11.0–13.0s  | title card slams in: 24 . 01 . 2027 |
| 390–449   | 13.0–15.0s  | SAVE THE DATE, then slow fade to black |

Film grain (14 pre-seeded canvas tiles, cycled per frame), a vignette and a
sub-pixel film-gate weave run across all 450 frames.

All text sits inside a 12% safe margin (821px of usable width) — verified with
`node measure.js`, including at the peak of every stamp/slam overshoot.
