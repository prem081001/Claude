// reel-grow-slow.html: ONE HTML file on a CSS timeline. "The customer dot" journeys through every scene.
// Scene display + dot + ripple use global keyframes (20s). Everything inside a scene uses CSS animation-delay
// relative to that scene's start (data-t0), so the file also plays correctly live in a browser.
const fs = require('fs');
const D = 30, pct = t => t <= 0 ? 0 : t >= D ? 100 : +((t - 0.0004) / D * 100).toFixed(6);
let css = '', n = 0, rules = '';
function anim(sel, frames) {
  frames = frames.slice();
  if (frames[0][0] > 0) frames.unshift([0, frames[0][1]]);
  if (frames[frames.length - 1][0] < D) frames.push([D, frames[frames.length - 1][1]]);
  const name = 'k' + n++;
  css += `@keyframes ${name}{` + frames.map(([t, p, e]) => `${pct(t)}%{${Object.entries(p).map(([a, b]) => a + ':' + b).join(';')}${e ? ';animation-timing-function:' + e : ''}}`).join('') + '}\n';
  rules += `${sel}{animation:${name} ${D}s linear both}\n`;
}
const T = '#17414D', S = '#E8E2D7', C = '#C65A33', K = '#152226';
const SEG = [[0, 4, 0, 4], [4, 5, 4, 6], [5, 7, 6, 10], [7, 9, 10, 14], [9, 11, 14, 18], [11, 13, 18, 22], [13, 16, 22, 26], [16, 20, 26, 30]];
const M = t => { for (const [a, b, A, B] of SEG) if (t <= b + 1e-9) return +(A + (t - a) * (B - A) / (b - a)).toFixed(4); return 30; };
const KS = { s0: 1, s1: 2, s2: 2, s3: 2, s4: 2, s5: 2, s6: 4 / 3, s7: 1 };
const EO = 'cubic-bezier(.2,.7,.2,1)', EI = 'cubic-bezier(.5,0,1,.8)', EIO = 'ease-in-out';
const scene = (sel, a, b) => (a = M(a), b = b && M(b), anim(sel, [...(a > 0 ? [[0, { display: 'none' }, 'step-end']] : []), [a, { display: 'block' }, 'step-end'], ...(b ? [[b, { display: 'none' }]] : [])]));
scene('#s0', 0, 4); scene('#s1', 4, 5); scene('#s2', 5, 7); scene('#s3', 7, 9); scene('#s4', 9, 11); scene('#s5', 11, 13); scene('#s6', 13, 16); scene('#s7', 16);

// ---------- THE CUSTOMER DOT (global journey; end of each scene = start of the next)
const dp = (t, x, y, s, o, e) => [M(t), { transform: `translate(${x - 40}px,${y - 40}px) scale(${s})`, opacity: o }, e];
const REST = [540, 1420], E2 = [800, 1038], E3 = [846, 890], E4 = [680, 1017], E5 = [672, 845], E6 = [710, 1180];
anim('#dot', [
  dp(0, 540, 380, .5, 0, 'step-end'), dp(1.5, 540, 380, .5, 1, EI), dp(1.95, 540, 943, 1, 1, EO), dp(2.2, 540, 925, 1, 1, EI), dp(2.45, 540, 943, 1, 1, EIO), dp(3.0, 540, 943, 1, 1, EIO),
  dp(3.5, ...REST, 1, 1, 'linear'), dp(4.4, ...REST, 1, 1, EO), dp(4.55, ...REST, 1.35, 1, EI), dp(4.7, ...REST, 1, 1, 'linear'), dp(5.55, ...REST, 1, 1, EIO), dp(6.2, ...E2, 1, 1, 'linear'),
  dp(7.0, ...E2, 1, 1, EO), dp(7.25, 517, 810, 1, 1, EI), dp(7.5, 234, 890, 1, 1, EO), dp(7.75, 387, 800, 1, 1, EI), dp(8.0, 540, 890, 1, 1, EO), dp(8.25, 693, 800, 1, 1, EI), dp(8.5, ...E3, 1, 1, 'linear'),
  dp(9.0, ...E3, 1, 1, EIO), dp(9.7, 735, 1110, 1, 1, EIO), dp(10.3, 680, 1087, 1, 1, 'linear'), dp(11.0, ...E4, 1, 1, 'linear'), dp(12.3, ...E4, 1, 1, EIO), dp(12.7, ...E5, 1, 1, 'linear'),
  dp(13.5, ...E5, 1, 1, EI), dp(14.1, 610, 1130, 1, 1, EO), dp(14.3, 640, 1090, 1, 1, EI), dp(14.5, 670, 1140, 1, 1, EO), dp(14.7, 690, 1110, 1, 1, EI), dp(14.95, ...E6, 1, 1, 'step-end'), dp(16.0, ...E6, 1, 0)]);
const RIPS = [[1.95, 540, 943], [2.45, 540, 943], [6.25, ...E2], [7.5, 234, 890], [8.0, 540, 890], [8.5, ...E3], [10.3, 680, 1087], [12.7, ...E5], [14.95, ...E6]];
const rf = [[0, { opacity: 0, transform: 'translate(0px,0px) scale(.6)' }, 'step-end']];
RIPS.forEach(([t0, x, y]) => { const t = M(t0); rf.push([t, { opacity: .9, transform: `translate(${x - 40}px,${y - 40}px) scale(.6)` }, EO], [t + .3, { opacity: 0, transform: `translate(${x - 40}px,${y - 40}px) scale(2.2)` }, 'step-end']); });
anim('#rip', rf);

// ---------- helpers (scene-relative delays)
const a = (l, t, w, h, inner, cls = '', st = '') => `<div class="a ${cls}" style="left:${l}px;top:${t}px;width:${w}px;height:${h}px;${st}">${inner}</div>`;
const words = (lines, d, cls = 'w') => { let i = 0; return lines.map(l => l.split(' ').map(x => `<span class="${cls}" style="--wd:${(d + .12 * i++).toFixed(2)}s">${x}</span>`).join(' ')).join('<br>'); };
const hl = (lines, top, fs, lh, color, d, cls = 'w', id = '') => a(0, top, 1080, lines.length * lh, words(lines, d, cls), 'hl', `font-size:${fs}px;line-height:${lh}px;color:${color};${id}`);
const pl = (text, top, d, color, h = 108) => a(60, top, 960, h, text, 'pl rise', `color:${color};animation-delay:${d}s`);
let F = .55;
const dr = (tag, attrs, d, dur = .3) => `<${tag} ${attrs} pathLength="1" class="dr" style="animation-delay:${(d * F).toFixed(2)}s,${(d * F + dur).toFixed(2)}s"/>`;
const SW = 6;
const rrect = (x, y, w, h, r, fill, d, extra = '') => dr('rect', `x="${x + 3}" y="${y + 3}" width="${w - 6}" height="${h - 6}" rx="${r}" fill="${fill}" stroke="${K}" stroke-width="${SW}" stroke-linejoin="round" ${extra}`, d);
const svgBox = (w, h, inner) => `<svg class="a" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="left:0;top:0">${inner}</svg>`;
// illustrations drawn in a 200 box and displayed at px (line weight stays 6px)
function ill(kind, px, d) {
  const k = 200 / px, s = SW * k, L = (kk, col, w, path, dd, fill = 'none') => dr('path', `d="${path}" fill="${fill}" stroke="${col}" stroke-width="${w * k}" stroke-linecap="round" stroke-linejoin="round"`, dd);
  let g = '';
  if (kind === 'basin') g = dr('path', `d="M24 30 V176" fill="none" stroke="${T}" stroke-width="${s}" stroke-linecap="round"`, d) + dr('path', `d="M24 92 H178 C178 144 146 166 108 166 H24 Z" fill="${S}" stroke="${T}" stroke-width="${s}" stroke-linejoin="round"`, d + .12) + dr('path', `d="M66 92 V58 H94 V72" fill="none" stroke="${T}" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"`, d + .3);
  if (kind === 'tile') for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) g += dr('rect', `x="${17 + i * 58}" y="${17 + j * 58}" width="50" height="50" rx="7" fill="${(i + j) % 2 ? C : T}" stroke="${T}" stroke-width="${s}" stroke-linejoin="round"`, d + (i + j) * .05, .3);
  if (kind === 'tap') { const P = 'M96 160 V76 Q96 34 138 34 Q176 34 176 76 V100', Q = 'M96 112 H58'; g = L(0, T, 40, P, d) + L(0, T, 30, Q, d) + L(0, C, 28, P, d + .05) + L(0, C, 18, Q, d + .05) + dr('rect', `x="58" y="154" width="84" height="24" rx="9" fill="${C}" stroke="${T}" stroke-width="${s}"`, d + .3); }
  return `<svg class="a ill" width="${px}" height="${px}" viewBox="0 0 200 200">${g}</svg>`;
}
// product card: outlined frame draws first, then fills; the image area holds an illustration; label below
function pcard(x, y, w, h, kind, label, d, ih, px) {
  const body = svgBox(w, h, rrect(0, 0, w, h, 22, S, d) + rrect(16, 16, w - 32, ih, 14, S, d + .25))
    + a((w - px) / 2, 16 + (ih - px) / 2, px, px, ill(kind, px, d + .5)) + a(0, 16 + ih + 12, w, 46, label, 'lab fade', `animation-delay:${(d + .9).toFixed(2)}s`);
  return a(x, y, w, h, a(0, 0, w, h, body, 'frame rise', `animation-delay:${d}s`), 'fl', `animation-delay:${(d * 0.37).toFixed(2)}s`);
}
// tile-grid wipe: a 6x4 grid of squares (in the surface colour) scales away to reveal what is underneath
const tilegrid = (x, y, w, h, col, d) => { let c = ''; for (let j = 0; j < 4; j++) for (let i = 0; i < 6; i++) c += `<div class="a tc" style="left:${i * w / 6}px;top:${j * h / 4}px;width:${w / 6 + 1}px;height:${h / 4 + 1}px;background:${col};animation-delay:${(d + (i + j) * .05).toFixed(2)}s"></div>`; return a(x, y, w, h, c); };
const scn = (id, t0, bg, inner) => `<div id="${id}" class="sc" data-t0="${t0}" style="background:${bg}">${inner}</div>`;

// ================= scenes
// S0 hook (0-4): text word by word, three cards slide up, the dot drops and bounces on the middle card
F = .55 * KS.s0;
const s0 = hl(['Want more customers', 'finding your', 'showroom online?'], 537, 84, 92, S, 0) + a(60, 837, 960, 56, 'Bathroom, tile and kitchen retailers.', 'pl rise', `color:${C};font-size:44px;line-height:56px;animation-delay:.5s`)
  + pcard(90, 983, 288, 300, 'basin', 'Bathroom', .7, 200, 170) + pcard(396, 983, 288, 300, 'tile', 'Tile', .85, 200, 170) + pcard(702, 983, 288, 300, 'tap', 'Kitchen', 1.0, 200, 170);
// S1 (4-5): how we bring them in, four labelled routes
const route = (x, y, t, d) => a(x, y, 440, 110, svgBox(440, 110, rrect(0, 0, 440, 110, 22, T, d)) + a(0, 0, 440, 110, t, 'route fade', `animation-delay:${d + .3}s`), 'frame');
F = .55 * KS.s1;
const s1 = hl(['Here’s how', 'we bring', 'them in.'], 607, 104, 112, T, 0) + route(92, 977, 'Google Ads', 0) + route(548, 977, 'Google Shopping', .05) + route(92, 1103, 'Social media', .1) + route(548, 1103, 'Email marketing', .15);
// S2 Google Ads (5-7): a search bar types, an Ad result draws in at the top, the dot taps it
F = .55 * KS.s2;
const s2 = hl(['Google Ads'], 563, 92, 100, S, 0) + pl('Your shop in front of people searching', 685, .3, S)
  + `<div class="a dft" style="left:0;top:0;width:1080px;height:1920px">`
  + a(100, 833, 880, 110, svgBox(880, 110, rrect(0, 0, 880, 110, 55, S, .3)) + a(40, 25, 560, 60, '<span class="type" style="animation-delay:.75s">walk-in shower</span>', '', 'font-size:48px;line-height:60px') + a(610, 31, 260, 48, '<span class="chip">Google search</span>', 'fade', 'animation-delay:.6s'), 'frame')
  + a(100, 963, 880, 150, svgBox(880, 150, rrect(0, 0, 880, 150, 22, S, .85)) + a(28, 24, 90, 48, '<span class="chip">Ad</span>', 'fade', 'animation-delay:1.1s') + a(132, 20, 700, 56, 'Walk-in showers', 'rt fade', 'animation-delay:1.1s') + a(28, 88, 700, 40, 'yourshop.co.uk', 'ru fade', 'animation-delay:1.2s'), 'frame')
  + a(100, 1127, 880, 130, svgBox(880, 130, rrect(0, 0, 880, 130, 22, S, 1.0)) + a(28, 16, 800, 56, 'Shower trays and screens', 'rt fade', 'animation-delay:1.25s') + a(28, 76, 700, 40, 'yourshop.co.uk', 'ru fade', 'animation-delay:1.3s'), 'frame') + `</div>` + tilegrid(100, 1127, 880, 130, T, 1.0);
// S3 Google Shopping (7-9): three floating product tiles, the dot hops across them
F = .55 * KS.s3;
const s3 = hl(['Google Shopping'], 608, 92, 100, T, 0) + pl('Your products shown with a photo, right in Google', 730, .3, K)
  + pcard(90, 882, 288, 330, 'basin', 'Basin', .2, 230, 190) + pcard(396, 882, 288, 330, 'tile', 'Tile', .35, 230, 190) + pcard(702, 882, 288, 330, 'tap', 'Tap', .5, 230, 190);
// S4 Social media marketing (9-11): phone with three posts scrolling up; the dot taps a heart
const post = (i, kind, label) => a(20, 24 + i * 222, 316, 200, svgBox(316, 200, rrect(0, 0, 316, 200, 18, S, .5 + i * .15) + rrect(12, 12, 292, 130, 12, S, .6 + i * .15)) + a(93, 17, 130, 120, ill(kind, 120, .8 + i * .15)) + a(0, 148, 316, 44, label, 'lab fade', `animation-delay:${1 + i * .1}s`), 'frame');
const heart = a(256, 246 + 14, 56, 56, `<svg class="a" width="56" height="56" viewBox="0 0 100 100"><path d="M50 86 C10 58 6 34 24 22 C38 14 50 24 50 34 C50 24 62 14 76 22 C94 34 90 58 50 86 Z" pathLength="1" fill="none" stroke="${K}" stroke-width="10.7" stroke-linejoin="round" class="dr heart" style="animation-delay:1.0s,1.5s,2.6s"/></svg>`);
F = .55 * KS.s4;
const s4 = hl(['Social media', 'marketing'], 447, 92, 100, S, 0) + pl('Your showroom and products where customers scroll', 669, .35, S)
  + a(350, 813, 380, 560, svgBox(380, 560, rrect(0, 0, 380, 560, 44, S, .3)) + a(0, 10, 380, 40, 'Social feed', 'lab fade', 'font-size:30px;line-height:40px;animation-delay:.7s')
    + a(12, 56, 356, 474, `<div class="a scroll" style="left:0;top:0;width:356px;height:760px">${post(0, 'basin', 'Bathroom') + post(1, 'tile', 'Tile') + post(2, 'tap', 'Kitchen') + heart}</div>`, 'clipbox'), 'frame dft');
// S5 Email marketing (11-13): envelope draws, flap opens, a product card slides out of it
const env = `<svg class="a" width="640" height="540" viewBox="0 0 640 540" style="left:0;top:0">${rrect(0, 180, 640, 360, 24, T, .15)}<polygon points="6,174 634,174 320,20" fill="${C}" stroke="${K}" stroke-width="6" stroke-linejoin="round" class="openflap"/></svg>`;
const pocket = `<svg class="a" width="640" height="540" viewBox="0 0 640 540" style="left:0;top:0">${dr('path', `d="M6 186 L320 380 L634 186 V516 Q634 534 616 534 H24 Q6 534 6 516 Z" fill="${T}" stroke="${K}" stroke-width="6" stroke-linejoin="round"`, .3)}<polygon points="6,186 634,186 320,380" fill="${C}" stroke="${K}" stroke-width="6" stroke-linejoin="round" pathLength="1" class="closedflap"/></svg>`;
F = .55 * KS.s5;
const s5 = hl(['Email marketing'], 505, 92, 100, T, 0) + pl('Stay in touch with the customers you already have', 627, .35, K)
  + a(220, 775, 640, 540, env + a(170, 230, 300, 300, pcard(0, 0, 300, 300, 'basin', 'Basin, 500mm', .5, 180, 150), 'cardout') + pocket + a(120, 440, 400, 50, 'Your newsletter', 'lab fade', 'color:' + S + ';font-size:38px;line-height:50px;animation-delay:.9s'), 'dft');
// S6 reveal (13-16): shopfront draws, the dot walks to the door, words slam in
const shop = `<svg class="a" width="760" height="560" viewBox="0 0 760 560" style="left:0;top:0">
 ${rrect(20, 100, 720, 460, 18, S, .3)}
 ${dr('path', `d="M3 3 H757 V66 ${Array.from({ length: 8 }, () => 'a47.125 47.125 0 0 1 -94.25 0').join(' ')} Z" fill="${C}" stroke="${K}" stroke-width="6" stroke-linejoin="round"`, 0)}
 ${rrect(60, 170, 300, 260, 16, S, .6)}${rrect(440, 200, 220, 360, 14, T, .8)}${dr('circle', 'cx="630" cy="390" r="13" fill="' + C + '" stroke="' + K + '" stroke-width="6"', 1.1, .25)}</svg>`;
F = .55 * KS.s6;
const s6 = hl(['Meet Ecommerce', 'Experts UK.'], 506, 96, 104, S, 1.5, 'w slam')
  + a(160, 754, 760, 560, shop + a(0, 6, 760, 56, 'Showroom', 'lab fade', `color:${S};font-size:44px;line-height:56px;font-weight:800;animation-delay:.5s`) + a(72, 215, 130, 130, ill('basin', 130, .9)) + a(222, 220, 120, 120, ill('tile', 120, 1.0)) + tilegrid(66, 176, 288, 248, S, .95), 'frame dft');
// S7 end (16-20): the dot grows into a speech bubble
F = .55 * KS.s7;
const s7 = `<div id="bub" class="a"></div>
 <svg class="a" width="1080" height="1920" viewBox="0 0 1080 1920" style="left:0;top:0"><path d="M150 1097 L160 1162 L255 1097" fill="${S}" stroke="${K}" stroke-width="6" stroke-linejoin="round" pathLength="1" class="dr" style="animation-delay:.9s,1.3s;animation-duration:.4s,.2s"/></svg>`
  + hl(['Message us', 'the word'], 631, 96, 104, K, .85) + a(290, 865, 500, 180, 'GROW', 'grow', `animation-delay:1.55s`) + a(60, 1190, 960, 70, 'ecommerceexpertsuk.com', 'url', 'animation-delay:1.95s');

const sd = (h, f) => h.replace(/animation-delay:(\d*\.?\d+)s(?=[;"'])/g, (m, x) => `animation-delay:${(parseFloat(x) * f).toFixed(2)}s`);
const html = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>Ecommerce Experts UK customer dot reel</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;800&display=block" rel="stylesheet">
<style>
:root{--teal:${T};--stone:${S};--terra:${C};--ink:${K}}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1920px;overflow:hidden;background:var(--ink);font-family:'Libre Franklin',sans-serif;color:var(--ink)}
.sc{position:absolute;inset:0;display:block;overflow:hidden}
.a{position:absolute}svg{display:block;overflow:visible}
.hl{font-weight:800;text-align:center}.pl{font-weight:400;font-size:42px;line-height:54px;text-align:center;text-wrap:balance}
.w{display:inline-block;opacity:0;animation:wordIn .25s ease-out var(--wd) both}.slam{animation-name:slam;animation-duration:.3s}
@keyframes wordIn{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
@keyframes slam{from{opacity:0;transform:scale(1.6)}to{opacity:1;transform:scale(1)}}
@keyframes draw{from{stroke-dashoffset:1.05}to{stroke-dashoffset:0}}
@keyframes fillIn{from{fill-opacity:0}to{fill-opacity:1}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes riseIn{from{opacity:0;transform:translateY(50px)}to{opacity:1;transform:translateY(0)}}
@keyframes floaty{from{transform:translateY(-6px)}to{transform:translateY(6px)}}
@keyframes drift{from{transform:scale(1)}to{transform:scale(1.03)}}
@keyframes tileOut{from{transform:scale(1)}to{transform:scale(0)}}
@keyframes typing{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes heartOn{from{stroke:${K}}to{stroke:${C}}}
@keyframes scrollUp{from{transform:translateY(0)}to{transform:translateY(-170px)}}
@keyframes flapClose{from{transform:scaleY(1)}to{transform:scaleY(0)}}
@keyframes flapOpen{from{transform:scaleY(0)}to{transform:scaleY(1)}}
@keyframes slideOut{from{transform:translateY(0)}to{transform:translateY(-200px)}}
@keyframes cardShow{from{opacity:0}to{opacity:1}}
@keyframes bubGrow{from{left:670px;top:1140px;width:80px;height:80px;border-radius:40px;background:${C};border-width:0}to{left:90px;top:576px;width:900px;height:524px;border-radius:70px;background:${S};border-width:6px}}
@keyframes popIn{from{opacity:0;transform:scale(.4)}to{opacity:1;transform:scale(1)}}
.dr{stroke-dasharray:1;stroke-dashoffset:1.05;animation:draw .3s ease-out both,fillIn .2s ease-out both}
.heart{animation:draw .3s ease-out both,fillIn .2s ease-out both,heartOn .15s linear both}
.rise{animation:riseIn .3s ease-out both}.fade{animation:fadeIn .3s ease-out both}.fl{position:absolute;inset:0;animation:floaty 3s ease-in-out infinite alternate}
.dft{transform-origin:50% 50%;animation:drift 4s ease-in-out infinite alternate}
.tc{animation:tileOut .25s ease-in both}.type{display:inline-block;white-space:nowrap;animation:typing .7s steps(14,end) both}
.scroll{animation:scrollUp 3.4s linear .6s both}.clipbox{overflow:hidden}
.openflap{transform-box:fill-box;transform-origin:50% 100%;animation:flapOpen .25s ease-out 1.6s both}
.closedflap{stroke-dasharray:1;stroke-dashoffset:1.05;transform-box:fill-box;transform-origin:50% 0%;animation:draw .3s ease-out .5s both,fillIn .2s ease-out 1.0s both,flapClose .2s ease-in 1.6s both}
.cardout{animation:slideOut .4s ease-out 1.9s both}
.lab{text-align:center;font-weight:800;font-size:34px;line-height:46px;color:var(--ink)}
.chip{display:inline-block;background:var(--terra);color:#fff;font-size:30px;line-height:48px;height:48px;padding:0 22px;border-radius:24px;white-space:nowrap}
.route{display:flex;align-items:center;justify-content:center;font-weight:800;font-size:38px;color:var(--stone)}
.rt{font-size:42px;line-height:56px;font-weight:800;white-space:nowrap}.ru{font-size:30px;line-height:40px;color:var(--teal);white-space:nowrap}
#bub{border:0 solid var(--ink);animation:bubGrow .7s cubic-bezier(.65,0,.35,1) both}
.grow{background:var(--terra);color:var(--stone);font-weight:800;font-size:150px;line-height:180px;text-align:center;animation:popIn .3s ease-out both}
.url{color:var(--stone);font-size:58px;line-height:70px;text-align:center;animation:riseIn .3s ease-out both}
#dot,#rip{position:absolute;left:0;top:0;width:80px;height:80px;border-radius:50%;z-index:20}
#dot{background:var(--terra)}#rip{border:6px solid var(--terra);z-index:19;opacity:0}
${rules}${css}
</style></head><body>
${sd(scn('s0', M(0), K, s0), .55 * KS.s0)}${sd(scn('s1', M(4), S, s1), .55 * KS.s1)}${sd(scn('s2', M(5), T, s2), .55 * KS.s2)}${sd(scn('s3', M(7), S, s3), .55 * KS.s3)}${sd(scn('s4', M(9), T, s4), .55 * KS.s4)}${sd(scn('s5', M(11), S, s5), .55 * KS.s5)}${sd(scn('s6', M(13), T, s6), .55 * KS.s6)}${scn('s7', M(16), K, s7)}
<div id="rip"></div><div id="dot"></div>
</body></html>`;
fs.writeFileSync(__dirname + '/reel-grow-slow.html', html);
console.log('ok', n);
