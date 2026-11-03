// Generates reel-product-listing-v3.html: one 20s CSS animation timeline.
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
const clip = (sel, t, d, ease) => anim(sel, [[0, { 'clip-path': 'inset(0 100% 0 0)' }], [t, { 'clip-path': 'inset(0 100% 0 0)' }, ease || EO], [t + d, { 'clip-path': 'inset(0 0 0 0)' }]]);
const burst = (sel, a, b) => anim(sel, [[0, { opacity: 0, transform: 'scale(.5)' }, 'step-end'], [a, { opacity: 1, transform: 'scale(.5)' }, EO], [a + .12, { opacity: 1, transform: 'scale(1.06)' }, 'ease-in-out'], [a + .24, { opacity: 1, transform: 'scale(1)' }, 'step-end'], [b, { opacity: 0, transform: 'scale(1)' }]]);

const cards = [
  { oname: 'BASIN 550 WHT CTOP', odesc: 'ceramic basin. 1 tap hole. see spec', name: 'White Countertop Basin, 550mm', d1: 'Sits on your worktop.', d2: 'One tap hole.', cat: 'Basins &gt; Countertop basins', catLen: 26, chip: 'Colour: White', draw: 'basin' },
  { oname: 'TILE 600X300 GRY MT', odesc: 'porcelain. see data sheet', name: 'Grey Matt Wall Tile, 600 x 300mm', d1: 'Porcelain wall tile.', d2: 'Matt grey finish.', cat: 'Tiles &gt; Wall tiles', catLen: 18, chip: 'Finish: Matt', draw: 'tile' },
  { oname: 'TAP KIT BRS PULLOUT', odesc: 'brass mixer. spec attached', name: 'Brushed Brass Pull-Out Kitchen Tap', d1: 'Brass kitchen mixer.', d2: 'Pull-out spray head.', cat: 'Kitchen &gt; Taps', catLen: 14, chip: 'Finish: Brass', draw: 'tap' }];
const I = (s, c) => `<i style="${s};background:${c || '#152226'}"></i>`;
const draws = {
  basin: I('left:6%;width:88%;top:72%;height:8%') + I('left:22%;width:56%;top:44%;height:28%;border-radius:0 0 50% 50%/0 0 100% 100%') + I('left:27%;width:46%;top:46%;height:20%;border-radius:0 0 50% 50%/0 0 100% 100%', '#E8E2D7') + I('left:48%;width:5%;top:18%;height:28%') + I('left:48%;width:20%;top:18%;height:5%') + I('left:45%;width:11%;top:12%;height:6%', '#C65A33'),
  tile: [12, 39, 66].map(t => [6, 52].map(l => `<i style="left:${l}%;top:${t}%;width:42%;height:22%;border:4px solid #152226;${t === 66 && l === 52 ? 'background:#C65A33' : ''}"></i>`).join('')).join(''),
  tap: I('left:30%;width:40%;top:78%;height:8%') + I('left:46%;width:8%;top:34%;height:46%') + I('left:46%;width:36%;top:28%;height:9%;border-radius:5px') + I('left:76%;width:10%;top:37%;height:22%;border-radius:4px') + I('left:54%;width:18%;top:54%;height:5%', '#C65A33') };

const CW = 326, GAP = 14, L0 = 37;
const colors = ['#8A8F8D', '#A9ABA6', '#C9C6BF', '#E8E2D7'];
const W = { w1: 7.0, w2: 9.6, w3: 12.3 };
let stackA = '', rowB = '', grid = '';
cards.forEach((c, i) => {
  stackA += `<div class="sa"><b class="mono">${c.oname}</b><span class="mono">${c.odesc}</span><span class="mono">Category: (blank)</span></div>`;
  const left = L0 + i * (CW + GAP);
  rowB += `<div class="bc" id="bc${i}" style="left:${left}px"><div class="g nb"><span class="mono on" id="on${i}">${c.oname}</span><span class="nn" id="nn${i}">${c.name}</span></div>
 <div class="g db"><span class="mono od" id="od${i}">${c.odesc}</span><span class="nd"><span class="ty" id="nda${i}">${c.d1}</span><span class="ty" id="ndb${i}">${c.d2}</span></span></div>
 <div class="g cb"><span class="mono oc" id="oc${i}">Category: (blank)</span><span class="nc ty" id="nc${i}">${c.cat}</span></div>
 <div class="fb"><span class="chipf" id="nf${i}">${c.chip}</span></div></div>\n`;
  grid += `<div class="gc" style="left:${left}px"><div class="img"><div class="ib">${draws[c.draw]}</div></div><div class="gt">${c.name}</div><div class="gd">${c.d1}<br>${c.d2}</div><div class="gcat">${c.cat}</div><span class="chipf">${c.chip}</span></div>\n`;
  const t1 = W.w1 + .4 + .45 * i, t2 = W.w2 + .4 + .45 * i, t3 = W.w3 + .4 + .45 * i;
  anim(`#bc${i}`, [[0, { 'background-color': colors[0], transform: 'scale(1)' }], [t1, { 'background-color': colors[0], transform: 'scale(1)' }, EO], [t1 + .25, { 'background-color': colors[1], transform: 'scale(1.01)' }],
    [t2, { 'background-color': colors[1], transform: 'scale(1.01)' }, EO], [t2 + .25, { 'background-color': colors[2], transform: 'scale(1.02)' }],
    [t3, { 'background-color': colors[2], transform: 'scale(1.02)' }, EO], [t3 + .25, { 'background-color': colors[3], transform: 'scale(1.03)' }]]);
  hideAt(`#on${i}`, t1); clip(`#nn${i}`, t1, .35);
  hideAt(`#od${i}`, t2); clip(`#nda${i}`, t2, .55, `steps(${c.d1.length},end)`); clip(`#ndb${i}`, t2 + .6, .4, `steps(${c.d2.length},end)`);
  hideAt(`#oc${i}`, t3);
  anim(`#nc${i}`, [[0, { opacity: 0, transform: 'translateX(-30px)' }, 'step-end'], [t3, { opacity: 1, transform: 'translateX(-30px)' }, EO], [t3 + .18, { opacity: 1, transform: 'translateX(0px)' }]]);
  anim(`#nf${i}`, [[0, { opacity: 0, transform: 'scale(.7)' }, 'step-end'], [t3 + .3, { opacity: 1, transform: 'scale(.7)' }, EO], [t3 + .45, { opacity: 1, transform: 'scale(1)' }]]);
});
// scene timing (hard cuts)
hideAt('#h1', 3.0); show('#h2', 3.0, 7.0);
anim('#isnt', [[0, { color: '#fff' }, 'step-end'], [4.3, { color: '#C65A33' }]]);
const T = (x, y, s) => `translate(${x}px,${y}px) scale(${s})`;
anim('#stackA', [[0, { transform: T(0, 0, 1), opacity: 1 }], [3.0, { transform: T(0, 0, 1), opacity: 1 }, 'linear'], [3.06, { transform: T(-22, 0, 1), opacity: 1 }, 'linear'], [3.12, { transform: T(20, 0, 1), opacity: 1 }, 'linear'], [3.18, { transform: T(-14, 0, 1), opacity: 1 }, 'linear'], [3.24, { transform: T(10, 0, 1), opacity: 1 }, 'linear'], [3.3, { transform: T(0, 0, 1), opacity: 1 }, EIO], [3.7, { transform: T(0, 0, 1), opacity: 1 }, EIO], [4.2, { transform: T(650, 462, .3), opacity: 1 }, 'step-end'], [7.0, { transform: T(650, 462, .3), opacity: 0 }]]);
burst('#w1', W.w1, W.w2); burst('#w2', W.w2, W.w3); burst('#w3', W.w3, 15.0);
show('#rowB', 7.0, 15.0);
show('#h3', 15.0, 17.0); show('#grid', 15.0, 17.0);
show('#end', 17.0);

const out = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>Ecommerce Experts UK spreadsheet to product page reel</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;800&display=block" rel="stylesheet">
<style>
:root{--teal:#17414D;--stone:#E8E2D7;--terra:#C65A33;--ink:#152226}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1920px;overflow:hidden;background:var(--teal);font-family:'Libre Franklin',sans-serif;color:var(--ink)}
.mono{font-family:ui-monospace,Menlo,Consolas,'DejaVu Sans Mono','Liberation Mono',monospace}
.h{position:absolute;left:0;width:1080px;text-align:center;color:#fff;font-weight:800}
#h1{top:350px;font-size:110px;line-height:120px}#h2{top:370px;font-size:116px;line-height:122px}#h3{top:350px;font-size:120px;line-height:130px}
.w{position:absolute;left:0;width:1080px;top:440px;text-align:center;color:var(--stone);font-weight:800;font-size:132px;line-height:140px}
#stackA{position:absolute;left:130px;top:800px;width:820px;transform-origin:0 0}
.sa{width:820px;height:210px;margin-bottom:12px;background:#8A8F8D;padding:22px 28px;display:flex;flex-direction:column;justify-content:space-between;color:rgba(21,34,38,.85)}
.sa b{font-size:26px;line-height:34px;font-weight:700}.sa span{font-size:21px;line-height:30px}
.bc{position:absolute;top:820px;width:${CW}px;height:400px;padding:16px;border-radius:6px;background:#8A8F8D;box-shadow:inset 0 -6px 0 rgba(21,34,38,.12)}
.g{display:grid}.g>*{grid-area:1/1;justify-self:start;align-self:start}
.nb{min-height:152px}.db{min-height:84px;margin-top:10px}.cb{min-height:34px;margin-top:12px}
.on{font-size:24px;line-height:32px;font-weight:700}.od{font-size:20px;line-height:26px}.oc{font-size:20px;line-height:26px}
.nn{display:block;font-weight:800;font-size:32px;line-height:38px}
.nd{display:flex;flex-direction:column;font-size:26px;line-height:34px;font-weight:400}
.ty{display:block;width:max-content;white-space:nowrap}
.nc{font-size:22px;line-height:30px;font-weight:400}
.fb{margin-top:12px;height:48px}
.chipf{display:inline-block;background:var(--terra);color:var(--stone);border-radius:24px;height:46px;padding:0 22px;font-size:24px;line-height:46px;font-weight:400;white-space:nowrap;transform-origin:left center}
#grid .chipf{margin-top:2px}
.gc{position:absolute;top:650px;width:${CW}px;height:660px;padding:16px;background:var(--stone);border-radius:6px;box-shadow:inset 0 -6px 0 rgba(21,34,38,.12)}
.img{height:230px;border:4px solid var(--ink);border-radius:4px;overflow:hidden}.ib{position:relative;width:100%;height:100%}.ib i{position:absolute;display:block}
.gt{margin-top:14px;min-height:154px;font-weight:800;font-size:32px;line-height:38px}
.gd{margin-top:10px;font-size:26px;line-height:34px;height:68px}
.gcat{margin-top:14px;font-size:22px;line-height:30px;white-space:nowrap}
.gc .chipf{margin-top:12px}
#end{position:absolute;left:0;width:1080px;top:590px;text-align:center}
#end .nm{color:#fff;font-weight:800;font-size:112px;line-height:118px}
#end .url{color:#fff;font-weight:400;font-size:54px;line-height:60px;margin-top:40px}
#end .sm{color:#fff;font-weight:400;font-size:38px;line-height:46px;margin-top:26px}
#end .cta{display:inline-block;margin-top:48px;background:var(--stone);color:var(--terra);font-weight:800;font-size:46px;line-height:56px;padding:30px 48px;border-radius:6px;box-shadow:inset 0 -6px 0 rgba(21,34,38,.12)}
${rules}${css}
</style></head><body>
<div id="h1" class="h">Would you buy<br>from these?</div>
<div id="h2" class="h">A supplier<br>spreadsheet<br><span id="isnt">isn’t</span> a<br>product page.</div>
<div id="stackA">${stackA}</div>
<div id="w1" class="w">Name it.</div><div id="w2" class="w">Describe it.</div><div id="w3" class="w">Sort it.</div>
<div id="rowB">${rowB}</div>
<div id="h3" class="h">That’s a<br>product page.</div>
<div id="grid">${grid}</div>
<div id="end"><div class="nm">Ecommerce<br>Experts UK</div><div class="url">ecommerceexpertsuk.com</div><div class="sm">Bathroom, tile and kitchen.</div><div class="cta">We turn it into one.<br>Tell us about your shop.</div></div>
</body></html>`;
fs.writeFileSync(__dirname + '/reel-product-listing-v3.html', out);
console.log('ok', n);
