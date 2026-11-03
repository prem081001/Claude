// Generates reel-catalogue.html: one 18s CSS animation timeline.
const fs = require('fs');
const D = 18, pct = t => t <= 0 ? 0 : t >= D ? 100 : +((t - 0.0004) / D * 100).toFixed(6);
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
// a scene/element is fully hidden (opacity 0 + visibility hidden) outside its time range
const scene = (sel, a, b) => anim(sel, [[0, { opacity: 0, visibility: 'hidden' }, 'step-end'], [a, { opacity: 1, visibility: 'visible' }, 'step-end'], ...(b ? [[b, { opacity: 0, visibility: 'hidden' }]] : [])]);
const show = (sel, a, b) => scene(sel, a, b);
const inOut = (sel, t, end, from, to, dur) => anim(sel, [[0, { opacity: 0, transform: from }, 'step-end'], [t, { opacity: 1, transform: from }, EO], [t + dur, { opacity: 1, transform: to }, 'step-end'], ...(end ? [[end, { opacity: 0, transform: to }]] : [])]);
const sx = (sel, t, d) => anim(sel, [[0, { transform: 'scaleX(0)' }], [t, { transform: 'scaleX(0)' }, EO], [t + d, { transform: 'scaleX(1)' }]]);

const S = '#E8E2D7', TL = '#17414D', TC = '#C65A33', INK = '#152226';
const labels = ['Porcelain<br>Tile', 'Vanity<br>Unit', 'Shaker<br>Kitchen'], tags = ['Missing specs', 'Unclear titles', 'Unoptimised images'];
const pills = ['Matt finish', '600 x 600mm', 'Brassware', 'Shaker style'];
const sw = [
  `<div class="sw" style="width:140px;height:140px;background-color:${TL};background-image:linear-gradient(90deg,${S} 4px,transparent 4px),linear-gradient(${S} 4px,transparent 4px);background-size:35px 35px"></div>`,
  `<div class="sw" style="width:190px;height:120px;background:${TL};border-radius:14px;position:relative"><i style="left:30px;top:14px;width:130px;height:30px;background:${S};border-radius:50%"></i><i style="left:36px;top:84px;width:40px;height:8px;background:${TC};border-radius:4px"></i><i style="left:114px;top:84px;width:40px;height:8px;background:${TC};border-radius:4px"></i></div>`,
  `<div class="sw" style="width:120px;height:170px;background:${TL};border-radius:6px;position:relative"><i style="left:14px;top:14px;right:14px;bottom:14px;border:5px solid ${S}"></i><i style="right:24px;top:80px;width:14px;height:14px;background:${TC};border-radius:50%"></i></div>`];
const content = (i, a) => `<div class="lb">${labels[i]}</div>
<div class="fr"><div class="fr2"${a ? ` id="f2_${i}"` : ''}></div><div class="swc"><div${a ? ` id="sw${i}"` : ''}>${sw[i]}</div></div>${a ? `<div class="bd" id="bd${i}">Optimised</div>` : ''}</div>
<div class="row ttl"><div class="blank"></div><div class="fill tl"${a ? ` id="tf${i}"` : ''}></div></div>
${[100, 70].map((w, k) => `<div class="row dl" style="width:${w}%"><div class="blank"></div><div class="fill dk"${a ? ` id="df${i}_${k}"` : ''}></div></div>`).join('')}`;

// geometry (all scenes centred on y=910 inside the 340-1480 safe area)
const CW = 336, CG = 12, L0 = 24, NW = 243, NG = 10, NL = 306, CH = 530;
const TOP2 = 535, TOP3 = 683; // card top: scene 2 / scene 3
let cardsHtml = '', gridHtml = '';
labels.forEach((_, i) => {
  const Lf = L0 + (CW + CG) * i, Ls = NL + (NW + NG) * i, t = 3.0 + .3 * i;
  cardsHtml += `<div class="pc" id="c${i}" style="top:${TOP2}px;left:${Lf}px;width:${CW}px">${content(i, true)}<div class="tg" id="tg${i}"><span class="tgi" id="tgi${i}">${tags[i]}</span></div></div>\n`;
  const A = (o, tr, l, w, tp) => ({ opacity: o, transform: tr, left: l + 'px', width: w + 'px', top: tp + 'px' });
  anim(`#c${i}`, [[0, A(0, 'translateY(24px)', Lf, CW, TOP2), 'step-end'], [t, A(1, 'translateY(24px)', Lf, CW, TOP2), EO], [t + .35, A(1, 'translateY(0px)', Lf, CW, TOP2), 'step-end'],
    [7.0, A(1, 'translateY(0px)', Lf, CW, TOP3), 'step-end'], [12.0, A(1, 'translateY(0px)', Lf, CW, TOP3), EIO], [12.3, A(1, 'translateY(0px)', Ls, NW, TOP3), 'step-end'], [14.0, A(0, 'translateY(0px)', Ls, NW, TOP3)]]);
  show(`#tg${i}`, t + .6, 7.0);
  const pf = [[0, { transform: 'scale(1)' }]]; for (let p = t + .9; p + .8 < 7.0; p += 1.1) pf.push([p, { transform: 'scale(1)' }, 'ease-in-out'], [p + .4, { transform: 'scale(1.06)' }, 'ease-in-out'], [p + .8, { transform: 'scale(1)' }]);
  anim(`#tgi${i}`, pf);
  const ts = 7.2 + .5 * i;
  inOut(`#sw${i}`, ts, null, 'scale(.85)', 'scale(1)', .25); show(`#f2_${i}`, ts); show(`#bd${i}`, ts + .3, 14.0);
  const tt = 9.2 + .45 * i; sx(`#tf${i}`, tt, .4); [0, 1].forEach(k => sx(`#df${i}_${k}`, tt + .5 + .15 * k, .3));
  inOut(`#pl${i}`, 12.32 + .15 * i, 14.0, 'translateX(-300px)', 'translateX(0px)', .22);
  gridHtml += `<div class="gc" style="left:${Lf}px">${content(i, false)}</div>\n`;
});
// 4th pill
const pillHtml = pills.map((p, i) => `<div class="pill" id="pl${i}">${p}</div>`).join('');
inOut('#pl3', 12.32 + .45, 14.0, 'translateX(-300px)', 'translateX(0px)', .22);

// scene 1: three trade labels, then text, then the question box
[0, 1, 2].forEach(i => inOut(`#lab${i}`, .2 + .35 * i, null, 'scale(.7)', 'scale(1)', .3));
inOut('#t1a', 1.1, null, 'translateY(14px)', 'translateY(0px)', .18); inOut('#t1b', 1.5, null, 'translateY(14px)', 'translateY(0px)', .18);
inOut('#box1', 2.0, null, 'translateY(18px)', 'translateY(0px)', .3);
// scenes (each fully hidden outside its range)
scene('#sc1', 0, 3.0); scene('#sc23', 3.0, 14.0); scene('#sc4', 14.0);
show('#t2', 4.2, 7.0); show('#t3', 7.0, 14.0); show('#prog', 7.0, 14.0);
anim('#pfill', [[0, { transform: 'scaleX(0)' }], [7.0, { transform: 'scaleX(0)' }, 'linear'], [14.0, { transform: 'scaleX(1)' }]]);
show('#st1', 7.0, 9.0); show('#st2', 9.0, 12.0); show('#st3', 12.0, 14.0);
show('#sb', 12.3, 14.0);

const out = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>Ecommerce Experts UK catalogue reel</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;800&display=block" rel="stylesheet">
<style>
:root{--teal:${TL};--stone:${S};--terra:${TC};--ink:${INK}}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1920px;overflow:hidden;background:var(--teal);font-family:'Libre Franklin',sans-serif;color:var(--ink)}
i{position:absolute;display:block}
.sc{position:absolute;inset:0;opacity:0;visibility:hidden}
.ctr{position:absolute;left:0;top:340px;width:1080px;height:1140px;display:flex;flex-direction:column;align-items:center;justify-content:center}
#bgs{position:absolute;inset:0;background:var(--stone)}
.t{position:absolute;left:0;width:1080px;text-align:center;font-weight:800}
#labrow{display:flex;gap:44px;margin-bottom:50px}
.lab{color:var(--stone);font-weight:800;font-size:88px;line-height:100px}
#t1a,#t1b{position:static;width:auto;color:var(--stone);font-size:60px;line-height:72px;font-weight:800}
#box1{margin-top:50px;width:940px;padding:40px;background:var(--terra);color:#fff;text-align:center;font-weight:800;font-size:70px;line-height:80px}
.pc{position:absolute;height:${CH}px;padding:12px;border:4px solid var(--ink);border-radius:6px;background:var(--stone)}
.lb{font-weight:800;font-size:34px;line-height:40px;height:80px;white-space:nowrap}
.fr{position:relative;margin-top:8px;height:246px;border:4px dashed var(--ink);border-radius:4px;overflow:hidden}
.fr2{position:absolute;inset:-4px;border:4px solid var(--ink);border-radius:4px}
.swc{position:absolute;inset:0 0 56px 0;display:flex;align-items:center;justify-content:center}
.sw i{position:absolute;display:block}
.bd{position:absolute;left:10px;bottom:10px;background:var(--terra);color:#fff;font-size:26px;line-height:38px;padding:0 12px;border-radius:3px;white-space:nowrap}
.row{position:relative}.ttl{height:24px;margin-top:18px;width:84%}.dl{height:14px;margin-top:10px}.ttl+.dl{margin-top:14px}
.blank{position:absolute;inset:0;background:rgba(21,34,38,.14);border-radius:3px}
.fill{position:absolute;inset:0;transform-origin:left center;border-radius:3px}.tl{background:var(--teal)}.dk{background:rgba(21,34,38,.55)}
.tg{position:absolute;left:12px;right:12px;bottom:14px;height:52px}
.tgi{display:inline-block;background:var(--terra);color:#fff;font-size:28px;line-height:52px;padding:0 14px;border-radius:26px;white-space:nowrap}
#t2{top:${TOP2 + CH + 52}px;color:var(--teal);font-size:72px;line-height:84px}
#t3{top:491px;color:var(--teal);font-size:70px;line-height:78px}
#prog{position:absolute;left:24px;top:1249px;width:1032px;height:22px;border-radius:11px;background:rgba(21,34,38,.15);overflow:hidden}
#pfill{position:absolute;inset:0;background:var(--teal);transform-origin:left center}
.st{top:1285px;color:var(--teal);font-size:36px;line-height:44px}
#sb{position:absolute;left:24px;top:${TOP3}px;width:270px;height:${CH}px;padding:12px;border:4px solid var(--ink);border-radius:6px;background:var(--stone);overflow:hidden}
#sb .lb{height:40px;margin-bottom:6px}
.pill{background:var(--teal);color:var(--stone);border-radius:27px;height:54px;line-height:54px;padding:0 16px;font-size:28px;margin-top:22px;white-space:nowrap;width:max-content}
#grid{position:relative;width:1080px;height:${CH}px}
.gc{position:absolute;top:0;width:${CW}px;height:${CH}px;padding:12px;border:4px solid var(--ink);border-radius:6px;background:var(--stone)}
.gc .fr{height:290px;border-style:solid}.gc .fr2{display:none}.gc .swc{bottom:0}.gc .swc>div{transform:scale(1.2)}
#cta{margin-top:40px;width:1032px;height:400px;background:var(--terra);color:var(--stone);display:flex;align-items:center;justify-content:center;text-align:center;font-weight:800;font-size:60px;line-height:78px}
#foot{margin-top:50px;text-align:center;color:#fff;font-size:36px;line-height:44px;font-weight:400}
${rules}${css}
</style></head><body>
<div id="sc1" class="sc"><div class="ctr">
 <div id="labrow"><div id="lab0" class="lab">Bathroom</div><div id="lab1" class="lab">Tile</div><div id="lab2" class="lab">Kitchen</div></div>
 <div id="t1a">Bathroom, tile and kitchen</div><div id="t1b">retailers and showrooms:</div>
 <div id="box1">Are your newest supplier ranges stuck offline?</div></div></div>
<div id="sc23" class="sc"><div id="bgs"></div>
${cardsHtml}
<div id="t2" class="t">Shoppers can’t buy<br>what they can’t see.</div>
<div id="t3" class="t">We create your<br>product listings.</div>
<div id="prog"><div id="pfill"></div></div>
<div id="st1" class="t st">Images</div><div id="st2" class="t st">Titles and descriptions</div><div id="st3" class="t st">Filters</div>
<div id="sb"><div class="lb">Filters</div>${pillHtml}</div></div>
<div id="sc4" class="sc"><div class="ctr"><div id="grid">${gridHtml}</div>
<div id="cta">Message us CATALOGUE<br>to see how we can help<br>you with listing.</div>
<div id="foot">Ecommerce Experts UK&nbsp;&nbsp;|&nbsp;&nbsp;ecommerceexpertsuk.com</div></div></div>
</body></html>`;
fs.writeFileSync(__dirname + '/reel-catalogue.html', out);
console.log('ok', n);
