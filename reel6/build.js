// Generates reel-ai-visibility.html: one 20s CSS animation timeline. Scenes are display:none outside their range.
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
const showAt = (sel, a, b) => anim(sel, [[0, { opacity: 0 }, 'step-end'], [a, { opacity: 1 }, 'step-end'], ...(b ? [[b, { opacity: 0 }]] : [])]);
const sx = (sel, t, d) => anim(sel, [[0, { transform: 'scaleX(0)' }], [t, { transform: 'scaleX(0)' }, EO], [t + d, { transform: 'scaleX(1)' }]]);
const clip = (sel, t, d, ease) => anim(sel, [[0, { 'clip-path': 'inset(0 100% 0 0)' }], [t, { 'clip-path': 'inset(0 100% 0 0)' }, ease || EO], [t + d, { 'clip-path': 'inset(0 0 0 0)' }]]);
const UP = 'translateY(14px)', Z = 'translateY(0px)';

scene('#s0', 0, 4); scene('#s1', 4, 5); scene('#c1', 5, 7); scene('#c2', 7, 9); scene('#c3', 9, 11); scene('#c4', 11, 13); scene('#hn', 13, 15); scene('#rv', 15, 17); scene('#en', 17);
// hook (0-4): every line is on screen well before 4.0 and stays until the cut
inOut('#h0a', 0, UP, Z, .2); inOut('#h0b', .4, UP, Z, .2); inOut('#h0c', .8, UP, Z, .2); inOut('#h0d', 1.2, UP, Z, .2); inOut('#h0e', 1.8, UP, Z, .2);
// check 1 (5-7): bar slides away, box opens
anim('#bar1', [[0, { 'clip-path': 'inset(0 0 0 0)' }], [5.8, { 'clip-path': 'inset(0 0 0 0)' }, EIO], [6.2, { 'clip-path': 'inset(0 0 0 100%)' }]]);
anim('#fr1', [[0, { top: '105px', height: '190px' }], [6.2, { top: '105px', height: '190px' }, EIO], [6.65, { top: '0px', height: '400px' }]]);
hideAt('#chB', 6.2); showAt('#chO', 6.2); [0, 1, 2].forEach(i => inOut(`#ln${i}`, 6.75 + .08 * i, 'translateY(8px)', Z, .15));
// check 2 (7-9): the same text moves from the PDF onto the product card
hideAt('#pdftxt', 8.0); showAt('#cardtxt', 8.0);
// check 3 (9-11): ticks drawn with lines
[0, 1, 2].forEach(i => clip(`#tk${i}`, 9.6 + .3 * i, .25));
// check 4 (11-13): tags rotate
[0, 1, 2].forEach(i => showAt(`#on${i}`, 11.0 + .65 * i, i < 2 ? 11.0 + .65 * (i + 1) : null));
// honest line, reveal, end
inOut('#n0', 13.0, UP, Z, .2); inOut('#n1', 13.5, UP, Z, .2);
inOut('#r0', 15.0, UP, Z, .2); inOut('#r1', 15.45, UP, Z, .2); inOut('#r2', 15.9, UP, Z, .2); sx('#rbar', 16.4, .3);
inOut('#e0', 17.0, UP, Z, .2); inOut('#e1', 17.4, 'translateY(18px)', Z, .25); inOut('#e2', 17.85, UP, Z, .2);

const check = (id, hl, pl, vis) => `<div id="${id}" class="sc chk"><div class="ctr"><div class="hl">${hl}</div><div class="pl">${pl}</div><div class="vis">${vis}</div></div></div>`;
const html = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>Ecommerce Experts UK AI visibility reel</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;800&display=block" rel="stylesheet">
<style>
:root{--teal:#17414D;--stone:#E8E2D7;--terra:#C65A33;--ink:#152226}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1920px;overflow:hidden;background:var(--ink);font-family:'Libre Franklin',sans-serif;color:var(--ink)}
.sc{position:absolute;inset:0;display:block}
.ctr{position:absolute;left:0;top:340px;width:1080px;height:1140px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 50px}
.hl{font-weight:800;font-size:92px;line-height:100px;text-align:center}
.pl{font-weight:400;font-size:42px;line-height:54px;text-align:center}
.chip{display:inline-block;background:var(--terra);color:#fff;font-size:30px;line-height:48px;height:48px;padding:0 22px;border-radius:24px;white-space:nowrap;font-weight:400}
.chipt{display:inline-block;background:var(--teal);color:var(--stone);font-size:30px;line-height:48px;height:48px;padding:0 22px;border-radius:24px;white-space:nowrap;font-weight:400}
.frame{background:var(--stone);border:6px solid var(--stone);color:var(--ink)}
#s0{background:var(--ink)}#s0 .hl{color:var(--stone)}
#h0e{color:var(--terra);margin-top:44px;font-size:44px;line-height:56px;font-weight:400;text-align:center}
#s1{background:var(--stone)}#s1 .hl{color:var(--teal);font-size:112px;line-height:120px}
.chk{background:var(--teal)}.chk .hl{color:var(--stone)}.chk .pl{color:var(--stone);max-width:940px;margin-top:22px}.vis{margin-top:44px}
/* 1 */
#v1{position:relative;width:760px;height:400px}
#fr1{position:absolute;left:0;width:760px;overflow:hidden}
#fr1 .lab{position:absolute;left:24px;top:20px;font-size:48px;line-height:56px;font-weight:800}
#fr1 .chipw{position:absolute;right:24px;top:24px}
#bar1{position:absolute;left:0;right:0;top:106px;height:52px;background:var(--terra)}
#fr1 .ln{position:absolute;left:24px;height:26px;background:rgba(21,34,38,.55);border-radius:3px}
/* 2 */
#v2{display:flex;gap:40px;width:920px;height:400px;align-items:center}
.bx2{width:440px;height:380px;padding:20px;position:relative}
.bx2 .lbl{position:absolute;left:20px;top:20px}
#pdftxt,#spot{position:absolute;left:20px;right:20px;font-size:40px;line-height:50px;font-weight:800}
#pdftxt{top:100px}
.noise{position:absolute;left:20px;height:20px;background:rgba(21,34,38,.2);border-radius:3px}
#img2{position:absolute;left:20px;right:20px;top:84px;height:110px;border:5px solid var(--ink);border-radius:4px}
#spot{top:212px;height:124px;border:4px dashed var(--ink);border-radius:4px;padding:10px 14px}
#cardtxt{font-size:40px;line-height:50px;font-weight:800}
/* 3 */
#v3{width:900px;display:flex;flex-direction:column;gap:16px}
.row3{height:110px;display:flex;align-items:center;padding:0 24px;gap:22px}
.row3 b{font-size:34px;font-weight:800;width:180px;flex:none}.row3 span.t{font-size:40px;line-height:52px;white-space:nowrap}
.tickw{margin-left:auto;width:64px;height:64px;position:relative;flex:none}
.tickw>div{position:absolute;inset:0}.tick{position:absolute;left:18px;top:6px;width:20px;height:40px;border-right:8px solid var(--terra);border-bottom:8px solid var(--terra);transform:rotate(45deg)}
/* 4 */
#v4{width:880px;padding:36px 40px;height:300px}
#v4 .ttl{font-size:62px;line-height:72px;font-weight:800}
#tags{display:flex;gap:18px;margin-top:34px}
.tg{position:relative;border:4px solid var(--ink);border-radius:28px;height:56px;padding:0 24px;font-size:32px;line-height:48px;white-space:nowrap}
.tg .on{position:absolute;left:-4px;top:-4px;right:-4px;bottom:-4px;background:var(--terra);color:#fff;border-radius:28px;padding:0 24px;line-height:56px}
/* honest, reveal, end */
#hn{background:var(--stone)}#hn .hl{color:var(--teal);font-size:100px;line-height:110px}#n1{color:var(--terra);margin-top:40px;font-size:50px;line-height:62px;font-weight:400}
#rv{background:var(--teal)}#rv .hl{color:var(--stone);font-size:130px;line-height:136px}#rbar{width:260px;height:14px;background:var(--terra);margin-top:40px}
#en{background:var(--ink)}#en .hl{color:var(--stone);font-size:104px;line-height:112px}
#e1{margin-top:32px;background:var(--terra);color:var(--stone);font-weight:800;font-size:220px;line-height:230px;padding:10px 90px;text-align:center}
#e2{margin-top:56px;color:var(--stone);font-size:58px;line-height:70px;font-weight:400}
${rules}${css}
</style></head><body>
<div id="s0" class="sc"><div class="ctr"><div id="h0a" class="hl">When customers</div><div id="h0b" class="hl">ask AI where</div><div id="h0c" class="hl">to buy, will it</div><div id="h0d" class="hl">find you?</div>
 <div id="h0e">Bathroom, tile and kitchen retailers.</div></div></div>
<div id="s1" class="sc"><div class="ctr"><div class="hl">Here’s what<br>we check.</div></div></div>
${check('c1', 'Can it reach<br>your site?', 'Nothing on your site is blocking it out.',
  `<div id="v1"><div id="fr1" class="frame"><div class="lab">Your site</div><div class="chipw"><span id="chB" class="chip" style="position:absolute;right:0">Blocked</span><span id="chO" class="chipt" style="position:absolute;right:0">Open</span></div>
   <div id="ln0" class="ln" style="top:110px;width:620px"></div><div id="ln1" class="ln" style="top:160px;width:520px"></div><div id="ln2" class="ln" style="top:210px;width:580px"></div><div id="bar1"></div></div></div>`)}
${check('c2', 'Is your product<br>info readable?', 'Sizes, finishes and materials as plain text, not hidden in images or PDFs.',
  `<div id="v2"><div id="pdfbox" class="frame bx2"><span class="chip lbl">PDF</span><div id="pdftxt">Matt finish,<br>600 x 300mm</div><div class="noise" style="top:250px;width:360px"></div><div class="noise" style="top:284px;width:300px"></div><div class="noise" style="top:318px;width:330px"></div></div>
   <div id="cardbox" class="frame bx2"><span class="chipt lbl">Product page</span><div id="img2"></div><div id="spot"><div id="cardtxt">Matt finish,<br>600 x 300mm</div></div></div></div>`)}
${check('c3', 'Are your details<br>consistent?', 'Same name, address and opening hours everywhere you appear.',
  `<div id="v3">${['Website', 'Google', 'Social'].map((l, i) => `<div class="frame row3"><b>${l}</b><span class="t">Opening hours: 9 to 5</span><div class="tickw"><div id="tk${i}"><div class="tick"></div></div></div></div>`).join('')}</div>`)}
${check('c4', 'Are your<br>pages clear?', 'Categories and products that say exactly what they are.',
  `<div id="v4" class="frame"><div class="ttl">Wall-hung basins</div><div id="tags">${['Bathroom', 'Tile', 'Kitchen'].map((t, i) => `<div class="tg">${t}<div id="on${i}" class="on">${t}</div></div>`).join('')}</div></div>`)}
<div id="hn" class="sc"><div class="ctr"><div id="n0" class="hl">No one can<br>guarantee a<br>mention.</div><div id="n1">We make sure you’re easy to find.</div></div></div>
<div id="rv" class="sc"><div class="ctr"><div id="r0" class="hl">Meet</div><div id="r1" class="hl">Ecommerce</div><div id="r2" class="hl">Experts UK.</div><div id="rbar"></div></div></div>
<div id="en" class="sc"><div class="ctr"><div id="e0" class="hl">Message us<br>the word</div><div id="e1">AI</div><div id="e2">ecommerceexpertsuk.com</div></div></div>
</body></html>`;
fs.writeFileSync(__dirname + '/reel-ai-visibility.html', html);
console.log('ok', n);
