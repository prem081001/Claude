// Generates reel-catalogue.html: one 18s CSS animation timeline.
const fs = require('fs');
const D = 18, pct = t => +(t / D * 100).toFixed(5);
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
// hard appear, short settle, optional hard removal
const inOut = (sel, t, end, from, to, dur) => anim(sel, [[0, { opacity: 0, transform: from }, 'step-end'], [t, { opacity: 1, transform: from }, EO], [t + dur, { opacity: 1, transform: to }, 'step-end'], ...(end ? [[end, { opacity: 0, transform: to }]] : [])]);
const sx = (sel, t, d) => anim(sel, [[0, { transform: 'scaleX(0)' }], [t, { transform: 'scaleX(0)' }, EO], [t + d, { transform: 'scaleX(1)' }]]);

const S = '#E8E2D7', TL = '#17414D', TC = '#C65A33', INK = '#152226';
const labels = ['Porcelain Tile', 'Vanity Unit', 'Shaker Kitchen'], tags = ['Missing specs', 'Unclear titles', 'Unoptimised images'];
const pills = ['Matt finish', '600 x 600mm', 'Brassware', 'Shaker style'];
const sw = [
  `<div class="sw" style="width:140px;height:140px;background-color:${TL};background-image:linear-gradient(90deg,${S} 4px,transparent 4px),linear-gradient(${S} 4px,transparent 4px);background-size:35px 35px"></div>`,
  `<div class="sw" style="width:190px;height:120px;background:${TL};border-radius:14px;position:relative"><i style="left:30px;top:14px;width:130px;height:30px;background:${S};border-radius:50%"></i><i style="left:36px;top:84px;width:40px;height:8px;background:${TC};border-radius:4px"></i><i style="left:114px;top:84px;width:40px;height:8px;background:${TC};border-radius:4px"></i></div>`,
  `<div class="sw" style="width:120px;height:170px;background:${TL};border-radius:6px;position:relative"><i style="left:14px;top:14px;right:14px;bottom:14px;border:5px solid ${S}"></i><i style="right:24px;top:80px;width:14px;height:14px;background:${TC};border-radius:50%"></i></div>`];
const content = (i, anim_) => `<div class="lb">${labels[i]}</div>
<div class="fr"><div class="fr2"${anim_ ? ` id="f2_${i}"` : ''}></div><div class="swc"><div${anim_ ? ` id="sw${i}"` : ''}>${sw[i]}</div></div>${anim_ ? `<div class="bd" id="bd${i}">Image optimised</div>` : ''}</div>
<div class="row ttl"><div class="blank"></div><div class="fill tl"${anim_ ? ` id="tf${i}"` : ''}></div></div>
${[100, 85, 55].map((w, k) => `<div class="row dl" style="width:${w}%"><div class="blank"></div><div class="fill dk"${anim_ ? ` id="df${i}_${k}"` : ''}></div></div>`).join('')}`;

let cardsHtml = '', gridHtml = '';
labels.forEach((_, i) => {
  const Lf = 37 + 340 * i, Ls = 298 + 246 * i, t = 3.0 + .3 * i;
  cardsHtml += `<div class="pc" id="c${i}" style="top:590px;left:${Lf}px;width:326px">${content(i, true)}<div class="tg" id="tg${i}"><span class="tgi" id="tgi${i}">${tags[i]}</span></div></div>\n`;
  const A = (o, tr, l, w) => ({ opacity: o, transform: tr, left: l + 'px', width: w + 'px' });
  anim(`#c${i}`, [[0, A(0, 'translateY(24px)', Lf, 326)], [t, A(1, 'translateY(24px)', Lf, 326), EO], [t + .35, A(1, 'translateY(0px)', Lf, 326), 'step-end'], [12.0, A(1, 'translateY(0px)', Lf, 326), EIO], [12.45, A(1, 'translateY(0px)', Ls, 236), 'step-end'], [14.0, A(0, 'translateY(0px)', Ls, 236)]]);
  // tags: appear then pulse until the cut at 7s
  show(`#tg${i}`, t + .6, 7.0);
  const pf = [[0, { transform: 'scale(1)' }]]; for (let p = t + .9; p + .8 < 7.0; p += 1.1) pf.push([p, { transform: 'scale(1)' }, 'ease-in-out'], [p + .4, { transform: 'scale(1.07)' }, 'ease-in-out'], [p + .8, { transform: 'scale(1)' }]);
  anim(`#tgi${i}`, pf);
  // 7-9s swatch + badge, 9-12s title and description
  const ts = 7.2 + .5 * i;
  inOut(`#sw${i}`, ts, null, 'scale(.85)', 'scale(1)', .25); show(`#f2_${i}`, ts); show(`#bd${i}`, ts + .3, 14.0);
  const tt = 9.2 + .45 * i; sx(`#tf${i}`, tt, .4); [0, 1, 2].forEach(k => sx(`#df${i}_${k}`, tt + .5 + .15 * k, .3));
  inOut(`#pl${i}`, 12.55 + .3 * i, 14.0, 'translateX(-260px)', 'translateX(0px)', .4);
  gridHtml += `<div class="gc" style="left:${Lf}px">${content(i, false)}</div>\n`;
});
const pillHtml = pills.map((p, i) => `<div class="pill" id="pl${i}">${p}</div>`).join('');
// scene 1
const shapes = `<div class="s" id="sh0" style="left:145px;top:410px;width:380px;height:150px;border-radius:75px;background:${S}"><i style="left:20px;top:20px;right:20px;bottom:20px;border:5px solid ${TL};border-radius:55px"></i></div>
<div class="s" id="sh1" style="left:595px;top:405px;width:160px;height:160px;background-color:${S};background-image:linear-gradient(90deg,${TL} 5px,transparent 5px),linear-gradient(${TL} 5px,transparent 5px);background-size:40px 40px"></div>
<div class="s" id="sh2" style="left:825px;top:395px;width:110px;height:180px"><i style="left:6px;top:6px;width:98px;height:80px;border-top:28px solid ${S};border-right:28px solid ${S};border-top-right-radius:70px"></i><i style="left:6px;top:50px;width:28px;height:122px;background:${S}"></i><i style="left:76px;top:70px;width:28px;height:34px;background:${S}"></i><i style="left:-4px;top:168px;width:48px;height:10px;background:${S};border-radius:3px"></i></div>`;
[0, 1, 2].forEach(i => inOut(`#sh${i}`, .2 + .35 * i, 3.0, 'scale(.6)', 'scale(1)', .3));
inOut('#t1a', 1.1, 3.0, 'translateY(14px)', 'translateY(0px)', .18); inOut('#t1b', 1.5, 3.0, 'translateY(14px)', 'translateY(0px)', .18);
inOut('#box1', 2.0, 3.0, 'translateY(18px)', 'translateY(0px)', .3);
// scenes
show('#bgs', 3.0, 14.0);
show('#t2', 4.2, 7.0); show('#t3', 7.0, 14.0);
show('#prog', 7.0, 14.0);
anim('#pfill', [[0, { transform: 'scaleX(0)' }], [7.0, { transform: 'scaleX(0)' }, 'linear'], [14.0, { transform: 'scaleX(1)' }]]);
show('#st1', 7.0, 9.0); show('#st2', 9.0, 12.0); show('#st3', 12.0, 14.0);
show('#sb', 12.45, 14.0);
show('#s4', 14.0);

const out = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>Ecommerce Experts UK catalogue reel</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;800&display=block" rel="stylesheet">
<style>
:root{--teal:${TL};--stone:${S};--terra:${TC};--ink:${INK}}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1920px;overflow:hidden;background:var(--teal);font-family:'Libre Franklin',sans-serif;color:var(--ink)}
i{position:absolute;display:block}
#bgs{position:absolute;inset:0;background:var(--stone)}
.s{position:absolute}
.t{position:absolute;left:0;width:1080px;text-align:center;font-weight:800}
#t1a,#t1b{color:var(--stone);font-size:60px;line-height:72px}#t1a{top:640px}#t1b{top:712px}
#box1{position:absolute;left:70px;top:860px;width:940px;padding:54px 40px;background:var(--terra);color:#fff;text-align:center;font-weight:800;font-size:70px;line-height:80px}
.pc{position:absolute;height:500px;padding:16px;border:4px solid var(--ink);border-radius:6px;background:var(--stone)}
.lb{font-weight:800;font-size:22px;line-height:32px;height:32px;white-space:nowrap}
.fr{position:relative;margin-top:12px;height:240px;border:4px dashed var(--ink);border-radius:4px}
.fr2{position:absolute;inset:-4px;border:4px solid var(--ink);border-radius:4px}
.swc{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
.sw i{position:absolute;display:block}
.bd{position:absolute;left:8px;bottom:8px;background:var(--terra);color:#fff;font-size:22px;line-height:32px;padding:0 10px;border-radius:3px;white-space:nowrap}
.row{position:relative}.ttl{height:22px;margin-top:20px;width:82%}.dl{height:12px;margin-top:10px}.ttl+.dl{margin-top:14px}
.blank{position:absolute;inset:0;background:rgba(21,34,38,.14);border-radius:3px}
.fill{position:absolute;inset:0;transform-origin:left center;border-radius:3px}.tl{background:var(--teal)}.dk{background:rgba(21,34,38,.55)}
.tg{position:absolute;left:16px;right:16px;bottom:18px;height:46px}
.tgi{display:inline-block;background:var(--terra);color:#fff;font-size:26px;line-height:46px;padding:0 18px;border-radius:23px;white-space:nowrap}
#t2{top:1170px;color:var(--teal);font-size:72px;line-height:84px}
#t3{top:380px;color:var(--teal);font-size:66px;line-height:74px}
#prog{position:absolute;left:44px;top:1170px;width:992px;height:22px;border-radius:11px;background:rgba(21,34,38,.15);overflow:hidden}
#pfill{position:absolute;inset:0;background:var(--teal);transform-origin:left center}
.st{top:1214px;color:var(--teal);font-size:36px;line-height:44px}
#sb{position:absolute;left:44px;top:590px;width:240px;height:500px;padding:16px;border:4px solid var(--ink);border-radius:6px;background:var(--stone);overflow:hidden}
#sb .lb{margin-bottom:10px}
.pill{background:var(--teal);color:var(--stone);border-radius:25px;height:50px;line-height:50px;padding:0 20px;font-size:26px;margin-top:14px;white-space:nowrap;width:max-content}
.gc{position:absolute;top:380px;width:326px;height:400px;padding:16px;border:4px solid var(--ink);border-radius:6px;background:var(--stone)}
.gc .fr{height:200px;border-style:solid}.gc .fr2{display:none}
#cta{position:absolute;left:40px;top:840px;width:1000px;height:300px;background:var(--terra);color:var(--stone);display:flex;align-items:center;justify-content:center;text-align:center;font-weight:800;font-size:52px;line-height:66px}
#foot{position:absolute;left:0;width:1080px;top:1190px;text-align:center;color:#fff;font-size:30px;line-height:40px;font-weight:400}
${rules}${css}
</style></head><body>
<div id="bgs"></div>
${shapes}
<div id="t1a" class="t">Bathroom, tile and kitchen</div><div id="t1b" class="t">retailers and showrooms:</div>
<div id="box1">Are your newest supplier ranges stuck offline?</div>
${cardsHtml}
<div id="t2" class="t">Shoppers can’t buy<br>what they can’t see.</div>
<div id="t3" class="t">We create your<br>product listings.</div>
<div id="prog"><div id="pfill"></div></div>
<div id="st1" class="t st">Images</div><div id="st2" class="t st">Titles and descriptions</div><div id="st3" class="t st">Filters</div>
<div id="sb"><div class="lb">Filters</div>${pillHtml}</div>
<div id="s4"><div id="grid">${gridHtml}</div>
<div id="cta">Message us the word CATALOGUE<br>to get your products listed.</div>
<div id="foot">Ecommerce Experts UK&nbsp;&nbsp;|&nbsp;&nbsp;ecommerceexpertsuk.com</div></div>
</body></html>`;
fs.writeFileSync(__dirname + '/reel-catalogue.html', out);
console.log('ok', n);
