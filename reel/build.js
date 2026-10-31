// Generates reel.html: one 20s CSS animation timeline (all keyframes are percentages of 20s).
const fs = require('fs');
const D = 20, pct = t => +(t / D * 100).toFixed(5);
let css = '', n = 0, rules = '';
function anim(sel, frames) {
  frames = frames.slice();
  if (frames[0][0] > 0) frames.unshift([0, frames[0][1]]);
  if (frames[frames.length - 1][0] < D) frames.push([D, frames[frames.length - 1][1]]);
  const name = 'k' + n++;
  css += `@keyframes ${name}{` + frames.map(([t, p, e]) =>
    `${pct(t)}%{${Object.entries(p).map(([a, b]) => a + ':' + b).join(';')}${e ? ';animation-timing-function:' + e : ''}}`).join('') + '}\n';
  rules += `${sel}{animation:${name} ${D}s linear both}\n`;
}
const EO = 'cubic-bezier(.2,.7,.2,1)', EIO = 'cubic-bezier(.65,0,.35,1)';
const show = (sel, a, b) => anim(sel, [[0, { opacity: 0 }, 'step-end'], [a, { opacity: 1 }, 'step-end'], ...(b ? [[b, { opacity: 0 }]] : [])]);
const sx = (sel, t, d) => anim(sel, [[0, { transform: 'scaleX(0)' }], [t, { transform: 'scaleX(0)' }, EO], [t + d, { transform: 'scaleX(1)' }]]);
const clip = (sel, t, d, from, ease) => anim(sel, [[0, { 'clip-path': from }], [t, { 'clip-path': from }, ease || EO], [t + d, { 'clip-path': 'inset(0 0 0 0)' }]]);
const R = 'inset(0 100% 0 0)', T = 'inset(0 0 100% 0)';
const pop = (sel, t, d, x, y) => anim(sel, [[0, { opacity: 0, transform: `translate(${x}px,${y}px)` }, 'step-end'], [t, { opacity: 1, transform: `translate(${x}px,${y}px)` }, EO], [t + d, { opacity: 1, transform: 'translate(0px,0px)' }]]);

// layout
const TW = 456, TH = 268, G = 12, GL = 78, GT = 640;
const labels = ['Product listings', 'Web design and upkeep', 'SEO', 'Google and Meta ads', 'Social media', ''];
const FL = [3, 5.2, 7.4, 9.6, 11.8, 14.0];           // flip starts (6th at the 14s mark)
const art = [
`<div id="a1i" class="ab ink-b" style="left:40px;top:28px;width:130px;height:130px;border-radius:6px"><div class="ab terra" style="left:18px;right:18px;bottom:18px;height:50px;border-radius:4px"></div><div class="ab ink" style="left:18px;top:18px;width:36px;height:36px;border-radius:50%"></div></div>
 <div id="a1t" class="ab ink o-l" style="left:196px;top:34px;width:210px;height:20px;border-radius:4px"></div>
 <div id="a1l1" class="ab ink2 o-l" style="left:196px;top:76px;width:220px;height:10px;border-radius:3px"></div>
 <div id="a1l2" class="ab ink2 o-l" style="left:196px;top:98px;width:196px;height:10px;border-radius:3px"></div>
 <div id="a1l3" class="ab ink2 o-l" style="left:196px;top:120px;width:140px;height:10px;border-radius:3px"></div>
 <div id="a1b" class="ab terra o-l" style="left:196px;top:148px;width:110px;height:26px;border-radius:4px"></div>`,
`<div id="a2br" class="ab ink-b" style="left:40px;top:14px;width:376px;height:100px;border-radius:8px;overflow:hidden">
   <div class="ab ink" style="left:0;top:0;right:0;height:22px"></div>
   <div class="ab stone" style="left:10px;top:7px;width:8px;height:8px;border-radius:50%"></div><div class="ab stone" style="left:24px;top:7px;width:8px;height:8px;border-radius:50%"></div><div class="ab stone" style="left:38px;top:7px;width:8px;height:8px;border-radius:50%"></div>
   <div id="a2h" class="ab terra" style="left:12px;top:32px;width:100px;height:48px;border-radius:4px"></div>
   <div id="a2l1" class="ab ink2 o-l" style="left:126px;top:36px;width:210px;height:9px;border-radius:3px"></div>
   <div id="a2l2" class="ab ink2 o-l" style="left:126px;top:54px;width:170px;height:9px;border-radius:3px"></div>
   <div id="a2l3" class="ab ink2 o-l" style="left:126px;top:72px;width:190px;height:9px;border-radius:3px"></div></div>
 <div class="ab chips" style="left:40px;top:124px;width:376px">${['WordPress','Shopify','Magento','WooCommerce'].map((c,i)=>`<span id="a2c${i}" class="chip">${c}</span>`).join('')}</div>`,
`<div id="a3bar" class="ab ink-b" style="left:40px;top:16px;width:376px;height:46px;border-radius:23px"><span id="a3q" class="ty" style="left:20px;top:7px;font-size:22px">shower screens</span></div>
 <div class="ab" style="left:44px;top:78px;width:370px">
  <div><span id="a3t" class="ty" style="font-weight:800;font-size:27px;line-height:34px">Walk-in showers</span></div>
  <div><span id="a3u" class="ty" style="color:#C65A33;font-size:19px;line-height:26px">yourshop.co.uk/showers</span></div>
  <div><span id="a3d" class="ty" style="font-size:20px;line-height:30px">Screens, trays and enclosures.</span></div></div>`,
`<div id="a4c" class="ab ink-b" style="left:103px;top:12px;width:250px;height:176px;border-radius:8px;overflow:hidden">
   <div class="ab" style="left:10px;top:3px;font-size:15px;line-height:22px">Sponsored</div>
   <div class="ab terra" style="left:10px;top:28px;width:220px;height:62px;border-radius:4px"></div>
   <div class="ab ink" style="left:10px;top:102px;width:170px;height:10px;border-radius:3px"></div>
   <div class="ab ink2" style="left:10px;top:120px;width:120px;height:9px;border-radius:3px"></div>
   <div class="ab ink" style="left:10px;top:136px;width:96px;height:24px;border-radius:12px"></div></div>`,
`<div id="a5p" class="ab ink-b" style="left:158px;top:12px;width:140px;height:178px;border-radius:8px;overflow:hidden">
   <div class="ab terra" style="left:8px;top:8px;width:18px;height:18px;border-radius:50%"></div>
   <div class="ab ink2" style="left:32px;top:13px;width:70px;height:8px;border-radius:3px"></div>
   <div class="ab ink-b" style="left:8px;top:34px;width:104px;height:104px;border-width:4px;overflow:hidden;border-radius:4px">
     <div class="ab terra" style="right:14px;top:12px;width:34px;height:34px;border-radius:50%"></div>
     <div class="ab ink" style="left:0;right:0;bottom:0;height:34px"></div></div>
   <div class="ab ink2" style="left:8px;top:148px;width:90px;height:8px;border-radius:3px"></div></div>`,
''];
let tilesHtml = '';
for (let i = 0; i < 6; i++) {
  const col = i % 2, row = i >> 1, left = GL + col * (TW + G), top = GT + row * (TH + G);
  tilesHtml += `<div class="tile" id="t${i}" style="left:${left}px;top:${top}px"><div class="inner" id="n${i}">
   <div class="face blank"></div>
   <div class="face art${i === 5 ? ' terrafill' : ''}">${art[i]}${labels[i] ? `<div class="label">${labels[i]}</div>` : ''}</div></div></div>\n`;
  // lay: slide in from the nearest edge with a small settle; exit to the edge
  const off = col ? 600 : -600, s = 0.25 + i * 0.42, ex = 17.0 + i * 0.04, T0 = `translateX(${off}px) scale(1)`, T1 = 'translateX(0px) scale(1)';
  anim(`#t${i}`, [[0, { transform: T0 }], [s, { transform: T0 }, EO], [s + 0.38, { transform: T1 }, 'ease-in-out'], [s + 0.48, { transform: 'translateX(0px) scale(.985)' }, 'ease-out'], [s + 0.62, { transform: T1 }], [ex, { transform: T1 }, 'cubic-bezier(.5,0,.9,.6)'], [ex + 0.6, { transform: T0 }]]);
  const f = FL[i];
  anim(`#n${i}`, [[0, { transform: 'rotateY(0deg) scale(1)' }], [f, { transform: 'rotateY(0deg) scale(1)' }, 'ease-in'], [f + 0.3, { transform: 'rotateY(90deg) scale(1.04)' }, 'ease-out'], [f + 0.6, { transform: 'rotateY(180deg) scale(1)' }]]);
}
// content animations (start 0.65s after each flip)
let c = FL[0] + 0.65;
clip('#a1i', c, 0.4, T); sx('#a1t', c + .15, .35); sx('#a1l1', c + .4, .3); sx('#a1l2', c + .55, .3); sx('#a1l3', c + .7, .3); sx('#a1b', c + .95, .25);
c = FL[1] + 0.65;
clip('#a2br', c, 0.5, R); clip('#a2h', c + .5, .3, T); sx('#a2l1', c + .6, .3); sx('#a2l2', c + .75, .3); sx('#a2l3', c + .9, .3);
[0, 1, 2, 3].forEach(i => pop(`#a2c${i}`, c + 1.0 + i * .22, .22, 0, 8));
c = FL[2] + 0.65;
clip('#a3bar', c, .4, R); clip('#a3q', c + .3, .4, R, 'steps(14,end)'); clip('#a3t', c + .85, .5, R, 'steps(15,end)'); clip('#a3u', c + 1.35, .4, R, 'steps(22,end)'); clip('#a3d', c + 1.75, .5, R, 'steps(30,end)');
c = FL[3] + 0.65;
anim('#a4c', [[0, { opacity: 0, transform: 'translateX(260px)' }, 'step-end'], [c, { opacity: 1, transform: 'translateX(260px)' }, EO], [c + .5, { opacity: 1, transform: 'translateX(-8px)' }, 'ease-in-out'], [c + .75, { opacity: 1, transform: 'translateX(0px)' }]]);
c = FL[4] + 0.65;
anim('#a5p', [[0, { opacity: 0, transform: 'translateY(-260px)' }, 'step-end'], [c, { opacity: 1, transform: 'translateY(-260px)' }, EO], [c + .5, { opacity: 1, transform: 'translateY(8px)' }, 'ease-in-out'], [c + .75, { opacity: 1, transform: 'translateY(0px)' }]]);
// text, level, end card (hard cuts)
show('#h1', 0.0001, 3.0); anim('#h1', [[0, { opacity: 1 }, 'step-end'], [3.0, { opacity: 0 }]]);
show('#h2', 14.0, 17.0);
anim('#lvl', [[0, { transform: 'translateX(-1100px)' }], [14.3, { transform: 'translateX(-1100px)' }, EIO], [15.5, { transform: 'translateX(0px)' }], [17.0, { transform: 'translateX(0px)' }, 'cubic-bezier(.5,0,.9,.6)'], [17.7, { transform: 'translateX(-1100px)' }]]);
anim('#bub', [[0, { transform: 'translateX(-66px)' }], [14.3, { transform: 'translateX(-66px)' }, EIO], [15.5, { transform: 'translateX(44px)' }, EIO], [15.95, { transform: 'translateX(-18px)' }, EIO], [16.3, { transform: 'translateX(7px)' }, EIO], [16.65, { transform: 'translateX(0px)' }]]);
show('#end', 17.9);

const html = `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>Ecommerce Experts UK reel</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;800&display=block" rel="stylesheet">
<style>
:root{--teal:#17414D;--stone:#E8E2D7;--terra:#C65A33;--ink:#152226}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1920px;overflow:hidden;background:var(--teal);font-family:'Libre Franklin',sans-serif;color:var(--ink)}
.ab{position:absolute}.ink{background:var(--ink)}.ink2{background:rgba(21,34,38,.55)}.terra{background:var(--terra)}.stone{background:var(--stone)}
.ink-b{border:5px solid var(--ink)}.o-l{transform-origin:left center}
.tile{position:absolute;width:${TW}px;height:${TH}px;perspective:1600px}
.inner{position:absolute;inset:0;transform-style:preserve-3d}
.face{position:absolute;inset:0;border-radius:6px;overflow:hidden;backface-visibility:hidden;-webkit-backface-visibility:hidden;background:var(--stone);box-shadow:inset 0 -6px 0 rgba(21,34,38,.12)}
.art{transform:rotateY(180deg)}.terrafill{background:var(--terra);box-shadow:inset 0 -6px 0 rgba(21,34,38,.2)}
.label{position:absolute;left:0;right:0;bottom:20px;text-align:center;font-weight:400;font-size:30px;line-height:36px}
.chips{display:flex;flex-wrap:wrap;gap:8px}.chip{border:3px solid var(--ink);border-radius:15px;height:30px;padding:0 12px;font-size:19px;line-height:24px;font-weight:400}
.ty{position:absolute;white-space:nowrap}.ab>div>.ty{position:static;display:inline-block}
.h{position:absolute;left:0;width:1080px;top:350px;text-align:center;color:#fff;font-weight:800}
#h1{font-size:92px;line-height:102px}#h2{font-size:76px;line-height:86px}
#lvl{position:absolute;left:${GL}px;top:540px;width:${2 * GL + 0 + 924 - 2 * GL}px;height:80px;border-radius:8px;background:var(--terra);box-shadow:inset 0 -6px 0 rgba(21,34,38,.2)}
.hole{position:absolute;top:24px;width:70px;height:32px;border-radius:16px;background:var(--stone)}
#vial{position:absolute;left:352px;top:16px;width:220px;height:48px;border-radius:24px;background:var(--stone);border:5px solid var(--ink);overflow:hidden}
.tick{position:absolute;top:6px;width:4px;height:26px;background:var(--ink)}
#bub{position:absolute;left:75px;top:6px;width:60px;height:26px;border-radius:13px;background:#fff;border:3px solid var(--ink)}
#end{position:absolute;left:0;width:1080px;top:640px;text-align:center}
#end .nm{color:#fff;font-weight:800;font-size:112px;line-height:118px}
#end .url{color:#fff;font-weight:400;font-size:54px;line-height:60px;margin-top:44px}
#end .cta{display:inline-block;margin-top:64px;background:var(--stone);color:var(--terra);font-weight:800;font-size:54px;line-height:60px;padding:30px 48px;border-radius:6px;box-shadow:inset 0 -6px 0 rgba(21,34,38,.12)}
${rules}${css}
</style></head><body>
<div id="h1" class="h">Your shop is live.<br>Now what?</div>
<div id="h2" class="h">Listings. Web. SEO.<br>Ads. Social.</div>
${tilesHtml}
<div id="lvl"><div class="hole" style="left:60px"></div><div class="hole" style="right:60px"></div><div id="vial"><div class="tick" style="left:67px"></div><div class="tick" style="left:139px"></div><div id="bub"></div></div></div>
<div id="end"><div class="nm">Ecommerce<br>Experts UK</div><div class="url">ecommerceexpertsuk.com</div><div class="cta">Tell us about your shop.</div></div>
</body></html>`;
fs.writeFileSync(__dirname + '/reel.html', html);
console.log('ok', n, 'keyframe sets');
