// Generates reel-listings.html: one 20s CSS animation timeline. Scenes are display:none outside their range.
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
const EO = 'cubic-bezier(.2,.7,.2,1)', EIO = 'cubic-bezier(.65,0,.35,1)';
const scene = (sel, a, b) => anim(sel, [...(a > 0 ? [[0, { display: 'none' }, 'step-end']] : []), [a, { display: 'block' }, 'step-end'], ...(b ? [[b, { display: 'none' }]] : [])]);
const inOut = (sel, t, from, to, dur) => anim(sel, t <= 0 ? [[0, { opacity: 1, transform: from }, EO], [dur, { opacity: 1, transform: to }]] : [[0, { opacity: 0, transform: from }, 'step-end'], [t, { opacity: 1, transform: from }, EO], [t + dur, { opacity: 1, transform: to }]]);
const hideAt = (sel, b) => anim(sel, [[0, { opacity: 1 }, 'step-end'], [b, { opacity: 0 }]]);
const showAt = (sel, a) => anim(sel, [[0, { opacity: 0 }, 'step-end'], [a, { opacity: 1 }]]);
const sx = (sel, t, d) => anim(sel, [[0, { transform: 'scaleX(0)' }], [t, { transform: 'scaleX(0)' }, EO], [t + d, { transform: 'scaleX(1)' }]]);
const clip = (sel, t, d, ease) => anim(sel, [[0, { 'clip-path': 'inset(0 100% 0 0)' }], [t, { 'clip-path': 'inset(0 100% 0 0)' }, ease || EO], [t + d, { 'clip-path': 'inset(0 0 0 0)' }]]);
const UP = 'translateY(14px)', Z = 'translateY(0px)';

// ---- scene time ranges
scene('#s0', 0, 3); scene('#s1', 3, 4); scene('#b1', 4, 6); scene('#b2', 6, 8); scene('#b3', 8, 10); scene('#b4', 10, 12); scene('#pf', 12, 14); scene('#rv', 14, 17); scene('#en', 17);
// ---- 0-3 hook
inOut('#h0a', 0, UP, Z, .2); inOut('#h0b', .45, UP, Z, .2); inOut('#h0c', .9, UP, Z, .2); inOut('#h0d', 1.6, UP, Z, .2);
// ---- beat 1 (4-6): messy row -> clean card
[0, 1, 2].forEach(i => inOut(`#cell${i}`, 4.25 + .15 * i, UP, Z, .2));
hideAt('#rowwrap', 5.0); inOut('#card1', 5.0, 'translateY(18px)', Z, .25);
// ---- beat 2 (6-8): chips snap on, tiles filter
inOut('#chipA', 6.55, 'translateX(28px)', 'translateX(0px)', .15); inOut('#chipB', 6.95, 'translateX(28px)', 'translateX(0px)', .15);
[2, 3, 4, 5].forEach(i => anim(`#tile${i}`, [[0, { opacity: 1 }, 'step-end'], [7.25, { opacity: .25 }]])); [0, 1].forEach(i => showAt(`#hi${i}`, 7.25));
// ---- beat 3 (8-10): image resizes, file name changes
anim('#imgbox', [[0, { width: '700px', height: '150px' }], [8.45, { width: '700px', height: '150px' }, EIO], [8.95, { width: '300px', height: '300px' }]]);
hideAt('#fnold', 9.05); clip('#fnnew', 9.05, .55, 'steps(29,end)');
// ---- beat 4 (10-12): old text crossed out, fuller text replaces it
sx('#strike', 10.5, .3); inOut('#boxB', 10.85, 'translateY(14px)', Z, .2); clip('#newdesc', 10.9, .6);
// ---- platforms (12-14)
['p0', 'p1', 'p2', 'p3'].forEach((id, i) => inOut(`#${id}`, 12.0 + .35 * i, 'translateY(16px)', Z, .2)); inOut('#pline', 13.3, UP, Z, .2);
// ---- reveal (14-17)
inOut('#r0', 14.0, UP, Z, .2); inOut('#r1', 14.45, UP, Z, .2); inOut('#r2', 14.9, UP, Z, .2); sx('#rbar', 15.4, .3);
// ---- end card (17-20)
inOut('#e0', 17.0, UP, Z, .2); inOut('#e1', 17.4, 'translateY(18px)', Z, .25); inOut('#e2', 17.85, UP, Z, .2);

const html = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>Ecommerce Experts UK listings reel</title>
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
.pl{font-weight:400;font-size:42px;line-height:54px;text-align:center}
.chip{display:inline-block;background:var(--terra);color:#fff;font-size:30px;line-height:48px;height:48px;padding:0 22px;border-radius:24px;white-space:nowrap;font-weight:400}
.chipt{display:inline-block;background:var(--teal);color:var(--stone);font-size:30px;line-height:48px;height:48px;padding:0 22px;border-radius:24px;white-space:nowrap;font-weight:400}
.lbl{font-size:30px;line-height:40px;font-weight:800;color:var(--teal)}
.beat{background:var(--stone)}.beat .hl{color:var(--teal)}.beat .pl{color:var(--ink);max-width:940px;margin-top:22px}
.vis{margin-top:44px}
/* hook */
#s0{background:var(--ink)}#s0 .hl{color:var(--stone)}#h0d{color:var(--terra);margin-top:44px;max-width:920px;font-weight:400}
#s1{background:var(--stone)}#s1 .hl{color:var(--teal);font-size:112px;line-height:120px}
/* b1 */
#v1{position:relative;width:960px;height:360px}
#rowwrap{position:absolute;left:0;right:0;top:70px;display:flex;flex-direction:column;align-items:center}
#row1{display:flex;gap:10px;align-items:flex-start;margin-top:14px}
.cell{font-family:ui-monospace,Menlo,Consolas,'DejaVu Sans Mono','Liberation Mono',monospace;font-size:30px;line-height:40px;background:rgba(21,34,38,.12);border:3px solid var(--ink);white-space:nowrap}
#cell0{padding:18px 14px;margin-top:18px}#cell1{padding:28px 22px}#cell2{padding:10px 16px;margin-top:36px}
#card1{position:absolute;left:30px;top:20px;width:900px;height:320px;background:var(--stone);border:5px solid var(--ink);display:flex;gap:30px;padding:24px;align-items:center}
#pimg{width:220px;height:220px;border:5px solid var(--ink);position:relative;flex:none}
#pimg i{position:absolute;display:block;background:var(--teal)}
#pinfo{display:flex;flex-direction:column;align-items:flex-start;gap:20px;flex:1}
#ptitle{font-weight:800;font-size:46px;line-height:54px;color:var(--ink)}
/* b2 */
#f2{width:900px;border:5px solid var(--ink);padding:24px;background:var(--stone)}
.hdr{display:flex;justify-content:space-between;align-items:center;height:56px}.hdr b{font-size:42px;line-height:56px;font-weight:800;color:var(--ink)}
#chips2{display:flex;gap:14px;height:52px;margin-top:16px;align-items:center}
#grid2{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:20px}
.tile{position:relative;height:128px;border:4px solid var(--ink);background-color:var(--stone);background-image:linear-gradient(90deg,var(--teal) 3px,transparent 3px),linear-gradient(var(--teal) 3px,transparent 3px);background-size:32px 32px}
.hi{position:absolute;inset:0;border:6px solid var(--terra)}
/* b3 */
#v3{width:900px;display:flex;flex-direction:column;align-items:center}
#imgarea{height:300px;width:900px;display:flex;align-items:center;justify-content:center}
#imgbox{border:5px solid var(--ink);position:relative;background:rgba(21,34,38,.08);overflow:hidden}
#imgbox i{position:absolute;display:block;background:var(--ink)}
#namebox{margin-top:24px;width:900px;height:92px;border:5px solid var(--ink);display:grid;align-items:center;padding:0 24px;background:var(--stone)}
#namebox>*{grid-area:1/1;justify-self:start;font-size:40px;line-height:52px;white-space:nowrap}
#fnnew{font-weight:800;color:var(--ink)}#fnold{color:var(--ink)}
#tag3{margin-top:24px}
/* b4 */
#v4{width:900px}
#boxA,#boxB{border:5px solid var(--ink);padding:16px 24px;background:var(--stone)}
#boxA{margin-bottom:22px;margin-top:8px}#boxB{margin-top:8px}
#boxA .mono{font-size:40px;line-height:52px;position:relative;display:inline-block}
#strike{position:absolute;left:-6px;right:-6px;top:24px;height:6px;background:var(--terra);transform-origin:left center}
#newdesc{font-size:40px;line-height:52px;color:var(--ink)}
/* platforms */
#pf{background:var(--stone)}
.plat{width:860px;background:var(--teal);color:var(--stone);font-weight:800;font-size:80px;line-height:96px;text-align:center;margin-top:14px;border-radius:4px}
#p0{margin-top:0}#pline{color:var(--teal);margin-top:34px}
/* reveal + end */
#rv{background:var(--teal)}#rv .hl{color:var(--stone);font-size:130px;line-height:136px}
#rbar{width:260px;height:14px;background:var(--terra);margin-top:40px}
#en{background:var(--ink)}#en .hl{color:var(--stone);font-size:104px;line-height:112px}
#e1{margin-top:32px;background:var(--terra);color:var(--stone);font-weight:800;font-size:140px;line-height:150px;padding:14px 60px;text-align:center}
#e2{margin-top:56px;color:var(--stone);font-size:58px;line-height:70px;font-weight:400}
${rules}${css}
</style></head><body>
<div id="s0" class="sc"><div class="ctr">
 <div id="h0a" class="hl">Are you looking for</div><div id="h0b" class="hl">someone to handle</div><div id="h0c" class="hl">your listings?</div>
 <div id="h0d" class="pl">Bathroom, tile and kitchen showrooms and retailers.</div></div></div>
<div id="s1" class="sc"><div class="ctr"><div class="hl">Here’s what<br>we handle.</div></div></div>

<div id="b1" class="sc beat"><div class="ctr"><div class="hl">Creating your<br>listings</div>
 <div class="pl">Every product from your supplier’s files, uploaded to your site</div>
 <div id="v1" class="vis"><div id="rowwrap"><div class="lbl">Supplier file</div><div id="row1"><div id="cell0" class="cell">BSN-0412</div><div id="cell1" class="cell">wh bsn 500</div><div id="cell2" class="cell">ceramic. see spec</div></div></div>
  <div id="card1"><div id="pimg"><i style="left:22%;top:34%;width:56%;height:30%;border-radius:0 0 40px 40px"></i><i style="left:12%;top:28%;width:76%;height:6%"></i></div>
   <div id="pinfo"><div id="ptitle">Wall-hung basin, 500mm</div><span class="chip">Bathroom</span></div></div></div></div></div>

<div id="b2" class="sc beat"><div class="ctr"><div class="hl">Categories and<br>filters</div>
 <div class="pl">So customers can find the right size and finish</div>
 <div class="vis"><div id="f2"><div class="hdr"><b>Wall tiles</b><span class="chip">Tile</span></div>
  <div id="chips2"><span id="chipA" class="chipt">Matt</span><span id="chipB" class="chipt">600 x 300mm</span></div>
  <div id="grid2">${[0, 1, 2, 3, 4, 5].map(i => `<div id="tile${i}" class="tile">${i < 2 ? `<div id="hi${i}" class="hi"></div>` : ''}</div>`).join('')}</div></div></div></div></div>

<div id="b3" class="sc beat"><div class="ctr"><div class="hl">Product images</div>
 <div class="pl">Resized and named properly</div>
 <div id="v3" class="vis"><div id="imgarea"><div id="imgbox"><i style="left:38%;top:30%;width:9%;height:48%"></i><i style="left:38%;top:30%;width:30%;height:9%"></i><i style="left:62%;top:30%;width:6%;height:20%"></i><i style="left:24%;top:78%;width:40%;height:7%"></i></div></div>
  <div id="namebox"><span id="fnold" class="mono">IMG_4471.jpg</span><span id="fnnew">brushed-brass-kitchen-tap.jpg</span></div>
  <span id="tag3" class="chip">Kitchen</span></div></div></div>

<div id="b4" class="sc beat"><div class="ctr"><div class="hl">Keeping it<br>up to date</div>
 <div class="pl">Content on products already live</div>
 <div id="v4" class="vis"><div class="lbl">Before</div><div id="boxA"><span class="mono">tap. chrome.<span id="strike"></span></span></div>
  <div id="boxB"><div class="lbl" style="margin-bottom:6px">Now</div><div id="newdesc">Single-lever basin mixer tap in chrome. Fits standard one-hole basins.</div></div></div></div></div>

<div id="pf" class="sc"><div class="ctr"><div id="p0" class="plat">Shopify</div><div id="p1" class="plat">WordPress</div><div id="p2" class="plat">Magento</div><div id="p3" class="plat">WooCommerce</div>
 <div id="pline" class="pl">On the platform you already use.</div></div></div>

<div id="rv" class="sc"><div class="ctr"><div id="r0" class="hl">Meet</div><div id="r1" class="hl">Ecommerce</div><div id="r2" class="hl">Experts UK.</div><div id="rbar"></div></div></div>

<div id="en" class="sc"><div class="ctr"><div id="e0" class="hl">Message us<br>the word</div><div id="e1">LISTINGS</div><div id="e2">ecommerceexpertsuk.com</div></div></div>
</body></html>`;
fs.writeFileSync(__dirname + '/reel-listings.html', html);
console.log('ok', n);
