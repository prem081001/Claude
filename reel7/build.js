// Generates reel-shop-owners.html: one 20s CSS animation timeline. Scenes are display:none outside their range.
const fs = require('fs');
const D = 20, pct = t => t <= 0 ? 0 : t >= D ? 100 : +((t - 0.0004) / D * 100).toFixed(6);
let css = '', n = 0, rules = '';
function anim(sel, frames) {
  frames = frames.slice();
  if (frames[0][0] > 0) frames.unshift([0, frames[0][1]]);
  if (frames[frames.length - 1][0] < D) frames.push([D, frames[frames.length - 1][1]]);
  const name = 'k' + n++;
  css += `@keyframes ${name}{` + frames.map(([t, p, e]) => `${pct(t)}%{${Object.entries(p).map(([a, b]) => a + ':' + b).join(';')}${e ? ';animation-timing-function:' + e : ''}}`).join('') + '}\n';
  rules += `${sel}{animation:${name} ${D}s linear both}\n`;
}
const EO = 'cubic-bezier(.2,.7,.2,1)';
const scene = (sel, a, b) => anim(sel, [...(a > 0 ? [[0, { display: 'none' }, 'step-end']] : []), [a, { display: 'block' }, 'step-end'], ...(b ? [[b, { display: 'none' }]] : [])]);
const inOut = (sel, t, from, to, dur) => anim(sel, t <= 0 ? [[0, { opacity: 1, transform: from }, EO], [dur, { opacity: 1, transform: to }]] : [[0, { opacity: 0, transform: from }, 'step-end'], [t, { opacity: 1, transform: from }, EO], [t + dur, { opacity: 1, transform: to }]]);
const hideAt = (sel, b) => anim(sel, [[0, { opacity: 1 }, 'step-end'], [b, { opacity: 0 }]]);
const sx = (sel, t, d) => anim(sel, [[0, { transform: 'scaleX(0)' }], [t, { transform: 'scaleX(0)' }, EO], [t + d, { transform: 'scaleX(1)' }]]);
const clip = (sel, t, d) => anim(sel, [[0, { 'clip-path': 'inset(0 100% 0 0)' }], [t, { 'clip-path': 'inset(0 100% 0 0)' }, EO], [t + d, { 'clip-path': 'inset(0 0 0 0)' }]]);
const UP = 'translateY(14px)', Z = 'translateY(0px)';

scene('#s0', 0, 4); scene('#s1', 4, 5); scene('#b1', 5, 7); scene('#b2', 7, 9); scene('#b3', 9, 11); scene('#tr', 11, 13); scene('#rv', 13, 16); scene('#en', 16);
// hook: all lines on screen by 1.4s and held until the cut at 4.0
inOut('#h0a', 0, UP, Z, .2); inOut('#h0b', .4, UP, Z, .2); inOut('#h0c', .8, UP, Z, .2); inOut('#h0d', 1.4, UP, Z, .2);
// beat 1: four platform labels in turn
[0, 1, 2, 3].forEach(i => inOut(`#pl${i}`, 5.3 + .3 * i, 'translateY(16px)', Z, .2));
// beat 2: messy row becomes a clean card, then the filter chip snaps on
[0, 1, 2].forEach(i => inOut(`#cell${i}`, 7.15 + .15 * i, UP, Z, .2));
hideAt('#rowwrap', 8.0); inOut('#card1', 8.0, 'translateY(18px)', Z, .25); inOut('#chipM', 8.4, 'translateX(24px)', 'translateX(0px)', .15);
// beat 3: checklist ticks
[0, 1, 2].forEach(i => clip(`#tk${i}`, 9.6 + .35 * i, .25));
// trades
inOut('#t0', 11.0, UP, Z, .2); inOut('#t1', 11.45, UP, Z, .2); inOut('#t2', 11.9, UP, Z, .2); inOut('#t3', 12.4, UP, Z, .2);
// reveal + end
inOut('#r0', 13.0, UP, Z, .2); inOut('#r1', 13.45, UP, Z, .2); inOut('#r2', 13.9, UP, Z, .2); sx('#rbar', 14.4, .3);
inOut('#e0', 16.0, UP, Z, .2); inOut('#e1', 16.4, 'translateY(18px)', Z, .25); inOut('#e2', 16.85, UP, Z, .2);

const beat = (id, hl, pl, vis) => `<div id="${id}" class="sc chk"><div class="ctr"><div class="hl">${hl}</div><div class="pl">${pl}</div><div class="vis">${vis}</div></div></div>`;
const html = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>Ecommerce Experts UK shop owners reel</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;800&display=block" rel="stylesheet">
<style>
:root{--teal:#17414D;--stone:#E8E2D7;--terra:#C65A33;--ink:#152226}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1920px;overflow:hidden;background:var(--ink);font-family:'Libre Franklin',sans-serif;color:var(--ink)}
.sc{position:absolute;inset:0;display:block}
.ctr{position:absolute;left:0;top:340px;width:1080px;height:1140px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 50px}
.mono{font-family:ui-monospace,Menlo,Consolas,'DejaVu Sans Mono','Liberation Mono',monospace}
.hl{font-weight:800;font-size:92px;line-height:100px;text-align:center}
.pl{font-weight:400;font-size:42px;line-height:54px;text-align:center;text-wrap:balance}
.chipt{display:inline-block;background:var(--teal);color:var(--stone);font-size:30px;line-height:48px;height:48px;padding:0 22px;border-radius:24px;white-space:nowrap;font-weight:400}
.frame{background:var(--stone);border:6px solid var(--stone);color:var(--ink)}
#s0{background:var(--ink)}#s0 .hl{color:var(--stone)}#h0d{color:var(--terra);margin-top:44px;font-size:48px;line-height:60px;font-weight:400;text-align:center}
#s1{background:var(--stone)}#s1 .hl{color:var(--teal);font-size:112px;line-height:120px}
.chk{background:var(--teal)}.chk .hl{color:var(--stone)}.chk .pl{color:var(--stone);max-width:940px;margin-top:22px}.vis{margin-top:44px}
/* 1 */
#g1{display:grid;grid-template-columns:1fr 1fr;gap:20px;width:960px}
.plat{height:130px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:52px}
/* 2 */
#v2{position:relative;width:960px;height:340px}
#rowwrap{position:absolute;left:0;right:0;top:50px;display:flex;flex-direction:column;align-items:center;color:var(--stone)}
#rowwrap .lbl{font-size:30px;line-height:40px;font-weight:800}
#row1{display:flex;gap:10px;align-items:flex-start;margin-top:14px}
.cell{font-family:ui-monospace,Menlo,Consolas,'DejaVu Sans Mono','Liberation Mono',monospace;font-size:30px;line-height:40px;background:var(--stone);color:var(--ink);border:3px solid var(--ink);white-space:nowrap}
#cell0{padding:18px 14px;margin-top:18px}#cell1{padding:28px 22px}#cell2{padding:10px 16px;margin-top:36px}
#card1{position:absolute;left:40px;top:10px;width:880px;height:320px;display:flex;gap:30px;padding:24px;align-items:center}
#pimg{width:220px;height:220px;border:5px solid var(--ink);position:relative;flex:none}
#pimg i{position:absolute;display:block;background:var(--teal)}
#pinfo{display:flex;flex-direction:column;align-items:flex-start;gap:20px;flex:1}
#ptitle{font-weight:800;font-size:46px;line-height:54px}
/* 3 */
#v3{width:900px;display:flex;flex-direction:column;gap:16px}
.row3{height:116px;display:flex;align-items:center;padding:0 28px;gap:22px}
.row3 .t{font-size:44px;line-height:56px;font-weight:800;white-space:nowrap}
.tickw{margin-left:auto;width:64px;height:64px;position:relative;flex:none}.tickw>div{position:absolute;inset:0}
.tick{position:absolute;left:18px;top:6px;width:20px;height:40px;border-right:8px solid var(--terra);border-bottom:8px solid var(--terra);transform:rotate(45deg)}
/* trades, reveal, end */
#tr{background:var(--stone)}#tr .hl{color:var(--teal);font-size:140px;line-height:148px}#t3{color:var(--ink);margin-top:36px;max-width:900px;font-size:44px;line-height:56px}
#rv{background:var(--teal)}#rv .hl{color:var(--stone);font-size:130px;line-height:136px}#rbar{width:260px;height:14px;background:var(--terra);margin-top:40px}
#en{background:var(--ink)}#en .hl{color:var(--stone);font-size:104px;line-height:112px}
#e1{margin-top:32px;background:var(--terra);color:var(--stone);font-weight:800;font-size:200px;line-height:210px;padding:10px 70px;text-align:center}
#e2{margin-top:56px;color:var(--stone);font-size:58px;line-height:70px;font-weight:400}
${rules}${css}
</style></head><body>
<div id="s0" class="sc"><div class="ctr"><div id="h0a" class="hl">Own a bathroom,</div><div id="h0b" class="hl">tile or kitchen</div><div id="h0c" class="hl">website in the UK?</div><div id="h0d">This is for you.</div></div></div>
<div id="s1" class="sc"><div class="ctr"><div class="hl">Here’s how<br>we help.</div></div></div>
${beat('b1', 'Your website', 'Built and looked after on the platform you use', `<div id="g1">${['Shopify', 'WordPress', 'Magento', 'WooCommerce'].map((p, i) => `<div id="pl${i}" class="frame plat">${p}</div>`).join('')}</div>`)}
${beat('b2', 'Your products', 'Listed clearly, with the right categories and filters',
  `<div id="v2"><div id="rowwrap"><div class="lbl">Supplier file</div><div id="row1"><div id="cell0" class="cell">BSN-0412</div><div id="cell1" class="cell">wh bsn 500</div><div id="cell2" class="cell">ceramic. see spec</div></div></div>
   <div id="card1" class="frame"><div id="pimg"><i style="left:22%;top:34%;width:56%;height:30%;border-radius:0 0 40px 40px"></i><i style="left:12%;top:28%;width:76%;height:6%"></i></div><div id="pinfo"><div id="ptitle">Wall-hung basin, 500mm</div><span id="chipM" class="chipt">Matt</span></div></div></div>`)}
${beat('b3', 'Your search<br>results', 'An SEO audit to see what’s holding your site back',
  `<div id="v3">${['Pages found', 'Titles clear', 'Product info readable'].map((l, i) => `<div class="frame row3"><span class="t">${l}</span><div class="tickw"><div id="tk${i}"><div class="tick"></div></div></div></div>`).join('')}</div>`)}
<div id="tr" class="sc"><div class="ctr"><div id="t0" class="hl">Bathroom.</div><div id="t1" class="hl">Tile.</div><div id="t2" class="hl">Kitchen.</div><div id="t3" class="pl">Retailers and showroom owners across the UK</div></div></div>
<div id="rv" class="sc"><div class="ctr"><div id="r0" class="hl">Meet</div><div id="r1" class="hl">Ecommerce</div><div id="r2" class="hl">Experts UK.</div><div id="rbar"></div></div></div>
<div id="en" class="sc"><div class="ctr"><div id="e0" class="hl">Message us<br>the word</div><div id="e1">SHOP</div><div id="e2">ecommerceexpertsuk.com</div></div></div>
</body></html>`;
fs.writeFileSync(__dirname + '/reel-shop-owners.html', html);
console.log('ok', n);
