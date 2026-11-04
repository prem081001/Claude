// Generates reel-shop-owners-slow.html: one 20s CSS timeline, flat SVG/CSS illustrations, scenes display:none outside range.
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
const SEG = [[0, 4, 0, 5], [4, 5, 5, 7], [5, 7, 7, 11], [7, 9, 11, 15], [9, 11, 15, 19], [11, 13, 19, 23], [13, 16, 23, 26], [16, 20, 26, 30]];
const M = t => { for (const [a, b, A, B] of SEG) if (t <= b + 1e-9) return +(A + (t - a) * (B - A) / (b - a)).toFixed(4); return 30; };
const EO = 'cubic-bezier(.2,.7,.2,1)';
const scene = (sel, a, b) => (a = M(a), b = b && M(b), anim(sel, [...(a > 0 ? [[0, { display: 'none' }, 'step-end']] : []), [a, { display: 'block' }, 'step-end'], ...(b ? [[b, { display: 'none' }]] : [])]));
// elements slide or scale in over 0.3s with ease-out
const inn = (sel, t, from, to = 'none') => (t = M(t), anim(sel, t <= 0 ? [[0, { opacity: 1, transform: from }, EO], [.3, { opacity: 1, transform: to }]] : [[0, { opacity: 0, transform: from }, 'step-end'], [t, { opacity: 1, transform: from }, EO], [t + .3, { opacity: 1, transform: to }]]));
const hideAt = (sel, b) => anim(sel, [[0, { opacity: 1 }, 'step-end'], [M(b), { opacity: 0 }]]);
const clip = (sel, t, d) => (t = M(t), anim(sel, [[0, { 'clip-path': 'inset(0 100% 0 0)' }], [t, { 'clip-path': 'inset(0 100% 0 0)' }, EO], [t + d, { 'clip-path': 'inset(0 0 0 0)' }]]));
const UP = 'translateY(24px) scale(1)', SC = 'scale(.94)', RI = 'translateX(-60px)', Z0 = 'translateY(0px) scale(1)', S1 = 'scale(1)', X0 = 'translateX(0px)';
const T = '#17414D', S = '#E8E2D7', C = '#C65A33', K = '#152226';

scene('#s0', 0, 4); scene('#s1', 4, 5); scene('#b1', 5, 7); scene('#b2', 7, 9); scene('#b3', 9, 11); scene('#tr', 11, 13); scene('#rv', 13, 16); scene('#en', 16);
// 0-4 hook: everything is on screen by 1.5s and held until the cut at 4.0
['h0a', 'h0b', 'h0c', 'h0d'].forEach((id, i) => inn(`#${id}`, .15 * i, UP, Z0)); inn('#w0', .6, SC, S1); [0, 1, 2].forEach(i => inn(`#c0${i}`, .9 + .15 * i, UP, Z0));
// 4-5
inn('#h1', 4.0, UP, Z0); inn('#w1', 4.15, SC, S1); inn('#c1', 4.3, UP, Z0);
// 5-7 website
inn('#b1h', 5.0, UP, Z0); inn('#b1l', 5.15, UP, Z0); inn('#w2', 5.3, SC, S1); [0, 1, 2].forEach(i => inn(`#mc${i}`, 5.6 + .15 * i, UP, Z0)); [0, 1, 2, 3].forEach(i => inn(`#pl${i}`, 6.05 + .15 * i, UP, Z0));
// 7-9 products
inn('#b2h', 7.0, UP, Z0); inn('#b2l', 7.15, UP, Z0); inn('#sheet', 7.3, SC, S1); [0, 1, 2].forEach(i => inn(`#cell${i}`, 7.5 + .15 * i, UP, Z0));
hideAt('#sheet', 8.0); inn('#win2', 8.0, SC, S1); inn('#chipM', 8.45, RI, X0);
// 9-11 search results
inn('#b3h', 9.0, UP, Z0); inn('#b3l', 9.15, UP, Z0); inn('#w3', 9.3, SC, S1); [0, 1, 2].forEach(i => inn(`#rw${i}`, 9.5 + .15 * i, UP, Z0)); [0, 1, 2].forEach(i => clip(`#tk${i}`, 9.95 + .3 * i, .25));
// 11-13 trades
[0, 1, 2].forEach(i => inn(`#tr${i}`, 11.0 + .4 * i, RI, X0)); inn('#trl', 12.25, UP, Z0);
// 13-16 reveal
['r0', 'r1', 'r2'].forEach((id, i) => inn(`#${id}`, 13.0 + .15 * i, UP, Z0)); inn('#w4', 13.5, SC, S1); [0, 1, 2].forEach(i => inn(`#rc${i}`, 13.8 + .15 * i, UP, Z0));
// 16-20 end card (everything in by 17.0, still for the last 3s)
inn('#e0', 16.0, UP, Z0); inn('#e1', 16.15, SC, S1); inn('#e2', 16.3, UP, Z0); [0, 1, 2].forEach(i => inn(`#ec${i}`, 16.5 + .15 * i, UP, Z0));

// ---- reusable illustrations (6px line, brand colours only)
const A = 'vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"';
const defs = `<svg width="0" height="0" style="position:absolute"><defs>
<g id="basin"><line x1="24" y1="30" x2="24" y2="176" stroke="${T}" stroke-width="6" ${A}/><path d="M24 92 H178 C178 144 146 166 108 166 H24 Z" fill="${S}" stroke="${T}" stroke-width="6" ${A}/><path d="M66 92 V58 H94 V72" fill="none" stroke="${T}" stroke-width="6" ${A}/></g>
<g id="tile">${[0, 1, 2].map(j => [0, 1, 2].map(i => `<rect x="${17 + i * 58}" y="${17 + j * 58}" width="50" height="50" rx="7" fill="${(i + j) % 2 ? C : T}" stroke="${T}" stroke-width="6" ${A}/>`).join('')).join('')}</g>
<g id="tap"><path d="M96 160 V76 Q96 34 138 34 Q176 34 176 76 V100" fill="none" stroke="${T}" stroke-width="40" ${A}/><path d="M96 112 H58" fill="none" stroke="${T}" stroke-width="30" ${A}/><path d="M96 160 V76 Q96 34 138 34 Q176 34 176 76 V100" fill="none" stroke="${C}" stroke-width="28" ${A}/><path d="M96 112 H58" fill="none" stroke="${C}" stroke-width="18" ${A}/><rect x="58" y="154" width="84" height="24" rx="9" fill="${C}" stroke="${T}" stroke-width="6" ${A}/></g>
</defs></svg>`;
const ill = (id, px) => `<svg class="ill" width="${px}" height="${px}" viewBox="0 0 200 200"><use href="#${id}"/></svg>`;
const win = (id, body, extra = '') => `<div id="${id}" class="win ${extra}"><div class="bar"><i class="d"></i><i class="d"></i><i class="d"></i><div class="url">yourshop.co.uk</div></div><div class="body">${body}</div></div>`;
const card = (id, il, px, ih, name, cls = '') => `<div id="${id}" class="card ${cls}"><div class="img" style="height:${ih}px">${ill(il, px)}</div><div class="nm">${name}</div></div>`;
const trio = (p, cls, px, ih) => [['basin', 'Bathroom'], ['tile', 'Tile'], ['tap', 'Kitchen']].map(([il, nm], i) => card(`${p}${i}`, il, px, ih, nm, cls)).join('');
const scn = (id, hl, pl, vis) => `<div id="${id}" class="sc chk"><div class="ctr"><div id="${id}h" class="hl">${hl}</div><div id="${id}l" class="pl">${pl}</div><div class="vis">${vis}</div></div></div>`;

const html = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>Ecommerce Experts UK illustrated shop owners reel</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;800&display=block" rel="stylesheet">
<style>
:root{--teal:${T};--stone:${S};--terra:${C};--ink:${K}}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1920px;overflow:hidden;background:var(--ink);font-family:'Libre Franklin',sans-serif;color:var(--ink)}
.sc{position:absolute;inset:0;display:block}
.ctr{position:absolute;left:0;top:340px;width:1080px;height:1140px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 50px}
.mono{font-family:ui-monospace,Menlo,Consolas,'DejaVu Sans Mono','Liberation Mono',monospace}
.hl{font-weight:800;font-size:92px;line-height:100px;text-align:center}
.pl{font-weight:400;font-size:42px;line-height:54px;text-align:center;text-wrap:balance}
.chip{display:inline-block;background:var(--terra);color:#fff;font-size:30px;line-height:48px;height:48px;padding:0 22px;border-radius:24px;white-space:nowrap;font-weight:400}
.chipt{display:inline-block;background:var(--teal);color:var(--stone);font-size:30px;line-height:48px;height:48px;padding:0 22px;border-radius:24px;white-space:nowrap;font-weight:400}
.ill{display:block}
.win{width:960px;border:6px solid var(--ink);border-radius:24px;overflow:hidden;background:var(--teal)}
.bar{height:82px;background:var(--stone);border-bottom:6px solid var(--ink);display:flex;align-items:center;gap:12px;padding:0 20px}
.d{display:block;width:18px;height:18px;border-radius:50%;background:var(--ink);flex:none}
.url{margin-left:10px;flex:1;height:50px;border:6px solid var(--ink);border-radius:25px;background:var(--stone);font-size:30px;line-height:36px;padding:0 18px;white-space:nowrap;color:var(--ink)}
.body{padding:24px}
.card{background:var(--stone);border:6px solid var(--ink);border-radius:20px;padding:12px;flex:none}
.img{border:6px solid var(--ink);border-radius:14px;background:var(--stone);display:flex;align-items:center;justify-content:center}
.nm{font-weight:800;font-size:34px;line-height:44px;text-align:center;margin-top:10px}
.cards3{display:flex;gap:18px}.card.s{width:288px}
.chk{background:var(--teal)}.chk .hl{color:var(--stone)}.chk .pl{color:var(--stone);max-width:940px;margin-top:22px}.vis{margin-top:40px}
#s0{background:var(--ink)}#s0 .hl{color:var(--stone)}#h0d{color:var(--terra);margin-top:30px;font-size:48px;line-height:60px;font-weight:400;text-align:center;margin-bottom:46px}
#s1{background:var(--stone)}#s1 .hl{color:var(--teal);font-size:112px;line-height:120px}#h1{margin-bottom:44px}
#c1{display:flex;gap:30px;align-items:center;width:100%}#c1 .img{width:300px;height:300px}#c1 .info{display:flex;flex-direction:column;align-items:flex-start;gap:18px;flex:1}#c1 .pn{font-weight:800;font-size:46px;line-height:54px}
/* b1 */
#w2 .nav{height:44px;background:var(--stone);border-radius:22px}#w2 .hero{height:96px;background:var(--terra);border-radius:16px;margin-top:14px}
#w2 .mini{display:flex;gap:14px;margin-top:14px}.card.m{width:290px}.card.m .img{height:130px}.card.m .nm{font-size:30px;line-height:40px;margin-top:6px}
#pills{display:grid;grid-template-columns:1fr 1fr;gap:14px;width:960px;margin-top:22px}
.plat{height:66px;background:var(--stone);border:6px solid var(--ink);border-radius:33px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:38px}
/* b2 */
#v2{position:relative;width:960px;height:456px}
#sheet{position:absolute;left:0;top:0;width:960px;height:456px;border:6px solid var(--ink);border-radius:24px;background:var(--stone);padding:20px}
#tbl{display:grid;grid-template-columns:230px 270px 1fr;gap:6px;background:var(--ink);border:6px solid var(--ink);margin-top:16px}
#tbl>div{background:var(--stone);display:flex;min-height:72px;padding:0 14px}
#tbl .mc{font-family:ui-monospace,Menlo,Consolas,'DejaVu Sans Mono','Liberation Mono',monospace;font-size:30px;line-height:40px}
#win2{position:absolute;left:0;top:10px}
#win2 .pc{display:flex;gap:28px;align-items:center}#win2 .img{width:250px;height:250px;flex:none}#win2 .info{display:flex;flex-direction:column;align-items:flex-start;gap:18px;flex:1}#win2 .pn{font-weight:800;font-size:44px;line-height:52px}
/* b3 */
#w3 .rowc{height:104px;background:var(--stone);border:6px solid var(--ink);border-radius:20px;display:flex;align-items:center;padding:0 24px;margin-top:14px}#w3 .rowc:first-child{margin-top:0}
#w3 .t{font-size:42px;line-height:52px;font-weight:800;white-space:nowrap}
.tickw{margin-left:auto;width:64px;height:64px;position:relative;flex:none}.tickw>div{position:absolute;inset:0}
.tick{position:absolute;left:18px;top:6px;width:20px;height:40px;border-right:6px solid var(--terra);border-bottom:6px solid var(--terra);transform:rotate(45deg)}
/* trades */
#tr{background:var(--stone)}.trr{display:flex;align-items:center;gap:36px;width:880px;margin-top:14px}.trr:first-child{margin-top:0}.trr .card{width:200px;height:200px;padding:8px}.trr .img{height:172px}
.trr .w{font-weight:800;font-size:112px;line-height:120px;color:var(--teal)}#trl{color:var(--ink);margin-top:30px;max-width:900px;font-size:44px;line-height:56px}
/* reveal + end */
#rv{background:var(--teal)}#rv .hl{color:var(--stone);font-size:108px;line-height:116px}#r2{margin-bottom:40px}
#en{background:var(--ink)}#en .hl{color:var(--stone);font-size:92px;line-height:100px}
#e1{margin-top:26px;background:var(--terra);color:var(--stone);font-weight:800;font-size:150px;line-height:160px;padding:10px 60px;text-align:center}
#e2{margin-top:36px;color:var(--stone);font-size:58px;line-height:70px;font-weight:400}
#strip{display:flex;gap:20px;margin-top:44px}.card.e{width:280px}.card.e .img{height:150px}.card.e .nm{font-size:30px;line-height:40px;margin-top:6px}
${rules}${css}
</style></head><body>${defs}
<div id="s0" class="sc"><div class="ctr"><div id="h0a" class="hl">Own a bathroom,</div><div id="h0b" class="hl">tile or kitchen</div><div id="h0c" class="hl">website in the UK?</div><div id="h0d">This is for you.</div>
 ${win('w0', `<div class="cards3">${trio('c0', 's', 200, 220)}</div>`)}</div></div>
<div id="s1" class="sc"><div class="ctr"><div id="h1" class="hl">Here’s how<br>we help.</div>
 ${win('w1', `<div id="c1" class="card"><div class="img">${ill('basin', 260)}</div><div class="info"><div class="pn">Wall-hung basin, 500mm</div><span class="chipt">Matt</span></div></div>`)}</div></div>
${scn('b1', 'Your website', 'Built and looked after on the platform you use', `${win('w2', `<div class="nav"></div><div class="hero"></div><div class="mini">${[['basin', 'Basin'], ['tile', 'Tile'], ['tap', 'Tap']].map(([il, nm], i) => card(`mc${i}`, il, 110, 130, nm, 'm')).join('')}</div>`)}<div id="pills">${['Shopify', 'WordPress', 'Magento', 'WooCommerce'].map((p, i) => `<div id="pl${i}" class="plat">${p}</div>`).join('')}</div>`)}
${scn('b2', 'Your products', 'Listed clearly, with the right categories and filters', `<div id="v2"><div id="sheet"><span class="chip">Supplier file</span><div id="tbl"><div></div><div></div><div></div><div id="cell0" class="mc" style="align-items:flex-start;padding-top:8px;min-height:116px">BSN-0412</div><div id="cell1" class="mc" style="align-items:center;min-height:116px">wh bsn 500</div><div id="cell2" class="mc" style="align-items:flex-end;padding-bottom:8px;min-height:116px">ceramic. see spec</div><div></div><div></div><div></div></div></div>
  ${win('win2', `<div class="pc card"><div class="img">${ill('basin', 220)}</div><div class="info"><div class="pn">Wall-hung basin, 500mm</div><span id="chipM" class="chipt">Matt</span></div></div>`)}</div>`)}
${scn('b3', 'Your search<br>results', 'An SEO audit to see what’s holding your site back', win('w3', ['Pages found', 'Titles clear', 'Product info readable'].map((l, i) => `<div id="rw${i}" class="rowc"><span class="t">${l}</span><div class="tickw"><div id="tk${i}"><div class="tick"></div></div></div></div>`).join('')))}
<div id="tr" class="sc"><div class="ctr">${[['basin', 'Bathroom.'], ['tile', 'Tile.'], ['tap', 'Kitchen.']].map(([il, w], i) => `<div id="tr${i}" class="trr"><div class="card"><div class="img">${ill(il, 150)}</div></div><div class="w">${w}</div></div>`).join('')}<div id="trl" class="pl">Retailers and showroom owners across the UK</div></div></div>
<div id="rv" class="sc"><div class="ctr"><div id="r0" class="hl">Meet</div><div id="r1" class="hl">Ecommerce</div><div id="r2" class="hl">Experts UK.</div>${win('w4', `<div class="cards3">${trio('rc', 's', 200, 220)}</div>`)}</div></div>
<div id="en" class="sc"><div class="ctr"><div id="e0" class="hl">Message us<br>the word</div><div id="e1">SHOP</div><div id="e2">ecommerceexpertsuk.com</div><div id="strip">${trio('ec', 'e', 130, 150)}</div></div></div>
</body></html>`;
fs.writeFileSync(__dirname + '/reel-shop-owners-slow.html', html);
console.log('ok', n);
