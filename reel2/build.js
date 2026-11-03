// Generates reel-product-listing.html: one 20s CSS animation timeline.
const fs = require('fs');
const D = 20, pct = t => +(t / D * 100).toFixed(5);
let css = '', n = 0, rules = '';
function anim(sel, frames) {
  frames = frames.slice();
  if (frames[0][0] > 0) frames.unshift([0, frames[0][1]]);
  if (frames[frames.length - 1][0] < D) frames.push([D, frames[frames.length - 1][1]]);
  const name = 'k' + n++;
  css += `@keyframes ${name}{` + frames.map(([t, p, e]) => `${pct(t)}%{${Object.entries(p).map(([a, b]) => a + ':' + b).join(';')}${e ? ';animation-timing-function:' + e : ''}}`).join('') + '}\n';
  rules += `${sel}{animation:${name} ${D}s linear both}\n`;
}
const EO = 'cubic-bezier(.2,.7,.2,1)', EIO = 'cubic-bezier(.65,0,.35,1)';
const show = (sel, a, b) => anim(sel, [[0, { opacity: 0 }, 'step-end'], [a, { opacity: 1 }, 'step-end'], ...(b ? [[b, { opacity: 0 }]] : [])]);
const hideAt = (sel, b) => anim(sel, [[0, { opacity: 1 }, 'step-end'], [b, { opacity: 0 }]]);
const clip = (sel, t, d, ease) => anim(sel, [[0, { 'clip-path': 'inset(0 100% 0 0)' }], [t, { 'clip-path': 'inset(0 100% 0 0)' }, ease], [t + d, { 'clip-path': 'inset(0 0 0 0)' }]]);
const pop = (sel, t, d) => anim(sel, [[0, { opacity: 0, transform: 'translateY(8px)' }, 'step-end'], [t, { opacity: 1, transform: 'translateY(8px)' }, EO], [t + d, { opacity: 1, transform: 'translateY(0px)' }]]);
const tickPop = (sel, t) => anim(sel, [[0, { opacity: 0, transform: 'scale(0)' }, 'step-end'], [t, { opacity: 1, transform: 'scale(0)' }, 'ease-out'], [t + .16, { opacity: 1, transform: 'scale(1.15)' }, 'ease-in-out'], [t + .3, { opacity: 1, transform: 'scale(1)' }, 'step-end'], [14.0, { opacity: 0, transform: 'scale(1)' }]]);

const basin = `<div class="ib"><i style="left:6%;width:88%;top:72%;height:8%;background:#152226"></i><i style="left:22%;width:56%;top:44%;height:28%;background:#152226;border-radius:0 0 50% 50%/0 0 100% 100%"></i><i style="left:27%;width:46%;top:46%;height:20%;background:#E8E2D7;border-radius:0 0 50% 50%/0 0 100% 100%"></i><i style="left:48%;width:5%;top:18%;height:28%;background:#152226"></i><i style="left:48%;width:20%;top:18%;height:5%;background:#152226"></i><i style="left:45%;width:11%;top:12%;height:6%;background:#C65A33"></i></div>`;
const SH0 = '0px 0px 0px rgba(21,34,38,0)', SH1 = '0px 12px 0px rgba(21,34,38,.3)';
// stack geometry and page geometry
const B = {
  code: { y: 620, h: 88, label: 'Code' }, title: { y: 750, h: 88, label: 'Title' }, desc: { y: 880, h: 128, label: 'Description' },
  img: { y: 1050, h: 88, label: 'Image' }, cat: { y: 1180, h: 88, label: 'Category' }, fil: { y: 1310, h: 88, label: 'Filters' } };
const PG = { title: [548, 774, 432, 120], desc: [548, 906, 432, 150], img: [100, 774, 420, 420], cat: [100, 690, 880, 64], fil: [548, 1068, 432, 126] };
const T0 = { title: 3.0, desc: 5.2, img: 7.4, cat: 9.6, fil: 11.8 };
const inner = {
  code: `<div class="c"><div class="tx"><span class="old">BSN550WH</span></div></div>`,
  title: `<div class="c"><div class="tx"><span class="old">BASIN 550 WHT CTOP</span><span class="new ty" id="nt">White Countertop Basin, 550mm</span></div></div>`,
  desc: `<div class="c"><div class="tx"><span class="old">ceramic basin. 1 tap hole. see spec</span><span class="new"><span class="ty" id="nd1">Ceramic countertop basin.</span><span class="ty" id="nd2">Fits on a worktop, with one tap hole.</span></span></div></div>`,
  img: `<div class="c"><div class="tx"><span class="old">IMG_4021.jpg</span><span class="new ty" id="ni" style="font-size:31px">white-countertop-basin-550mm.jpg</span></div><div class="slot"><div class="ibx" id="ibx">${basin}</div></div></div>`,
  cat: `<div class="c"><div class="tx"><span class="new ty" id="nc">Basins &gt; Countertop basins</span></div></div><div class="dash" id="dc"></div>`,
  fil: `<div class="c"><div class="chips"><span class="chip" id="nf1">Colour: White</span><span class="chip" id="nf2">Fitting: Countertop</span></div></div><div class="dash" id="df"></div>` };
const page = {
  title: `<div class="pc ptitle">White Countertop<br>Basin, 550mm</div>`,
  desc: `<div class="pc pdesc">Ceramic countertop basin.<br>Fits on a worktop, with<br>one tap hole.</div>`,
  img: `<div class="pc pimg">${basin.replace('class="ib"', 'class="ib big"')}</div>`,
  cat: `<div class="pc pcrumb">Basins <b>&gt;</b> Countertop basins</div>`,
  fil: `<div class="pc pchips"><span class="pchip">Colour: White</span><span class="pchip">Fitting: Countertop</span></div>`, code: '' };
let html = '';
for (const k of Object.keys(B)) {
  const { y, h, label } = B[k], t0 = T0[k];
  html += `<div class="blk" id="b_${k}" style="left:100px;top:${y}px;width:800px;height:${h}px">${inner[k]}${page[k]}${t0 ? `<div class="sel" id="s_${k}"></div>` : ''}</div>
<div class="lab" id="l_${k}" style="left:102px;top:${y + h + 4}px">${label}</div>\n`;
  hideAt(`#l_${k}`, 14.0);
  const base = { left: '100px', top: y + 'px', width: '800px', height: h + 'px' };
  const lift = { transform: 'translate(0px,-12px)', 'box-shadow': SH1 }, flat = { transform: 'translate(0px,0px)', 'box-shadow': SH0 };
  if (k === 'code') anim(`#b_${k}`, [[0, { ...flat }], [14.0, { ...flat }, 'ease-out'], [14.3, { ...lift }, EIO], [15.0, { transform: 'translate(-1200px,-12px)', 'box-shadow': SH1 }]]);
  else {
    const [pl, pt, pw, ph] = PG[k], to = { left: pl + 'px', top: pt + 'px', width: pw + 'px', height: ph + 'px' };
    anim(`#b_${k}`, [[0, { ...base, ...flat }], [14.0, { ...base, ...flat }, 'ease-out'], [14.3, { ...base, ...lift }, EIO], [14.95, { ...to, ...lift }, 'ease-in'], [15.15, { ...to, ...flat }]]);
    show(`#b_${k} .pc`, 15.15);
    hideAt(`#b_${k} .c`, 14.0);
  }
  if (t0) {
    html += `<div class="tkc" id="tk_${k}" style="top:${y + h / 2 - 28}px"><div class="tkm"></div></div>\n`;
    tickPop(`#tk_${k}`, t0 + (k === 'desc' ? 1.5 : k === 'fil' ? 1.3 : 1.2));
    show(`#s_${k}`, t0, t0 + 1.9);
  }
}
// field changes
let t = T0.title; hideAt('.blk#b_title .old', t); clip('#nt', t + .05, 1.0, 'steps(29,end)');
t = T0.desc; hideAt('.blk#b_desc .old', t); clip('#nd1', t + .05, .6, 'steps(25,end)'); clip('#nd2', t + .7, .7, 'steps(37,end)');
t = T0.img; hideAt('.blk#b_img .old', t); clip('#ni', t + .05, 1.1, 'steps(32,end)');
anim('#ibx', [[0, { width: '104px', height: '34px' }], [t + .1, { width: '104px', height: '34px' }, EIO], [t + .8, { width: '64px', height: '64px' }]]);
t = T0.cat; hideAt('#dc', t); clip('#nc', t + .05, .9, 'steps(25,end)');
t = T0.fil; hideAt('#df', t); pop('#nf1', t + .2, .25); pop('#nf2', t + .7, .25);
// headings, stack, end card (hard cuts)
anim('#h1', [[0, { opacity: 1 }, 'step-end'], [3.0, { opacity: 0 }]]);
show('#h2', 14.0, 17.0);
anim('#stack', [[0, { transform: 'translateX(1200px)', opacity: 1 }], [0.25, { transform: 'translateX(1200px)', opacity: 1 }, EO], [0.85, { transform: 'translateX(-8px)', opacity: 1 }, 'ease-in-out'], [1.05, { transform: 'translateX(0px)', opacity: 1 }, 'step-end'], [17.0, { transform: 'translateX(0px)', opacity: 0 }]]);
show('#end', 17.0);

const out = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>Ecommerce Experts UK product listing reel</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;800&display=block" rel="stylesheet">
<style>
:root{--teal:#17414D;--stone:#E8E2D7;--terra:#C65A33;--ink:#152226}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1920px;overflow:hidden;background:var(--teal);font-family:'Libre Franklin',sans-serif;color:var(--ink)}
.h{position:absolute;left:0;width:1080px;top:350px;text-align:center;color:#fff;font-weight:800;font-size:76px;line-height:86px}
#stack{position:absolute;left:0;top:0;width:1080px;height:1920px}
.blk{position:absolute;background:var(--stone);border-radius:4px}
.c{position:absolute;inset:0;display:flex;align-items:center;justify-content:space-between;padding:0 22px;overflow:hidden;border-radius:4px}
.tx{display:grid;flex:1}.tx>*{grid-area:1/1;align-self:center;justify-self:start}
.old{font-family:ui-monospace,Menlo,Consolas,'DejaVu Sans Mono','Liberation Mono',monospace;font-size:30px;line-height:40px}
.new{font-weight:400;font-size:34px;line-height:42px;display:flex;flex-direction:column}
.ty{display:block;width:max-content;white-space:nowrap}
.new .ty{width:max-content}
.slot{width:110px;height:64px;display:flex;align-items:center;justify-content:center}
.ibx{border:3px solid var(--ink);background:var(--stone);width:104px;height:34px;overflow:hidden}
.ib{position:relative;width:100%;height:100%}.ib i{position:absolute;display:block}
.chips{display:flex;gap:14px}.chip{border:3px solid var(--ink);border-radius:25px;height:50px;padding:0 20px;font-size:27px;line-height:44px;font-weight:400;white-space:nowrap}
.dash{position:absolute;inset:8px;border:3px dashed rgba(198,90,51,.6);border-radius:3px}
.sel{position:absolute;inset:-7px;border:4px solid #fff;border-radius:6px}
.lab{position:absolute;color:#fff;font-weight:400;font-size:24px;line-height:28px}
.tkc{position:absolute;left:924px;width:56px;height:56px;border-radius:50%;background:var(--terra)}
.tkm{position:absolute;left:19px;top:9px;width:16px;height:28px;border-right:6px solid var(--stone);border-bottom:6px solid var(--stone);transform:rotate(45deg)}
.pc{position:absolute;inset:0;border-radius:4px;overflow:hidden}
.ptitle{border-left:10px solid var(--terra);padding:14px 20px;font-weight:800;font-size:38px;line-height:46px}
.pdesc{padding:18px 22px;font-size:28px;line-height:38px;font-weight:400}
.pimg{border:5px solid var(--ink)}.ib.big{width:100%;height:100%}
.pcrumb{padding:0 24px;font-size:30px;line-height:64px;font-weight:400}.pcrumb b{color:var(--terra);font-weight:800;padding:0 6px}
.pchips{display:flex;flex-direction:column;gap:10px;padding:14px 22px}
.pchip{width:max-content;background:var(--terra);color:var(--stone);border-radius:23px;height:46px;padding:0 22px;font-size:26px;line-height:46px;font-weight:400}
#end{position:absolute;left:0;width:1080px;top:640px;text-align:center}
#end .nm{color:#fff;font-weight:800;font-size:112px;line-height:118px}
#end .url{color:#fff;font-weight:400;font-size:54px;line-height:60px;margin-top:44px}
#end .cta{display:inline-block;margin-top:60px;background:var(--stone);color:var(--terra);font-weight:800;font-size:48px;line-height:58px;padding:30px 48px;border-radius:6px;box-shadow:inset 0 -6px 0 rgba(21,34,38,.12)}
${rules}${css}
</style></head><body>
<div id="h1" class="h">This is what your<br>supplier sends.</div>
<div id="h2" class="h">This is what your<br>customer needs to see.</div>
<div id="stack">
${html}</div>
<div id="end"><div class="nm">Ecommerce<br>Experts UK</div><div class="url">ecommerceexpertsuk.com</div><div class="cta">We list your range.<br>Tell us about your shop.</div></div>
</body></html>`;
fs.writeFileSync(__dirname + '/reel-product-listing.html', out);
console.log('ok', n);
