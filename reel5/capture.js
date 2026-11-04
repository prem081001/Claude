const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const OUT = process.argv[2], MODE = process.argv[3] || 'sweep', FR = path.join(OUT, 'frames5');
const CHECK = () => {
  const issues = [];
  const scenes = [...document.querySelectorAll('.sc')].filter(e => getComputedStyle(e).display !== 'none');
  if (scenes.length !== 1) issues.push('scene count ' + scenes.length);
  const eff = e => { let o = 1; for (let x = e; x && x !== document.body; x = x.parentElement) o *= parseFloat(getComputedStyle(x).opacity); return o; };
  const sc = scenes[0]; if (!sc) return issues;
  sc.querySelectorAll('*').forEach(e => {
    const own = [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    const r = e.getBoundingClientRect(); if (!r.width || eff(e) < 0.9) return;
    if (own) {
      const fs = parseFloat(getComputedStyle(e).fontSize), cls = e.className || '';
      const min = /\bhl\b/.test(cls) ? 80 : /\bpl\b/.test(cls) ? 40 : 30;
      if (fs < min) issues.push(`small text ${e.id || cls} ${fs}<${min}`);
      if (r.top < 340 || r.bottom > 1480) issues.push(`outside safe ${e.id || cls} ${Math.round(r.top)}-${Math.round(r.bottom)}`);
      if (r.left < 24 || r.right > 1056) issues.push(`outside width ${e.id || cls} ${Math.round(r.left)}-${Math.round(r.right)}`);
    }
  });
  // containment inside framed boxes
  sc.querySelectorAll('#card1,#f2,#namebox,#boxA,#boxB,#imgarea,.plat,#e1,#pimg,#imgbox,.tile,#grid2,#chips2').forEach(f => {
    const fr = f.getBoundingClientRect(); if (!fr.width) return;
    f.querySelectorAll('*').forEach(e => { const r = e.getBoundingClientRect(); if (!r.width || eff(e) < 0.9) return; if (e.id === 'strike') return; if (r.left < fr.left - 1 || r.right > fr.right + 1 || r.top < fr.top - 1 || r.bottom > fr.bottom + 1) issues.push(`overhang ${e.id || e.className} in ${f.id || f.className}`); });
    if (f.scrollWidth > f.clientWidth + 1 && getComputedStyle(f).overflow !== 'hidden') issues.push('scroll overflow ' + (f.id || f.className));
  });
  return issues;
};
(async () => {
  fs.mkdirSync(FR, { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.resolve(__dirname, 'reel-listings.html'));
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  console.log('font loaded:', await p.evaluate(() => document.fonts.check('800 40px "Libre Franklin"') && document.fonts.check('400 20px "Libre Franklin"')), 'chromium', b.version());
  await p.evaluate(() => document.getAnimations().forEach(a => a.pause()));
  // animations inside display:none scenes only exist once the scene is shown: pause + time every animation, repeat until none are new
  const seek = ms => p.evaluate(ms => { let prev = -1; for (let i = 0; i < 6; i++) { const all = document.getAnimations(); all.forEach(a => { a.pause(); a.currentTime = ms; }); void document.body.offsetHeight; if (all.length === prev) break; prev = all.length; } return prev; }, ms);
  const seen = new Map();
  for (let f = 0; f < 600; f++) {
    await seek(f * 1000 / 30);
    const iss = await p.evaluate(CHECK);
    iss.forEach(i => { if (!seen.has(i)) seen.set(i, f); });
    if (MODE === 'render') await p.screenshot({ path: path.join(FR, String(f).padStart(4, '0') + '.png') });
  }
  console.log('issues:', seen.size ? JSON.stringify([...seen]) : 'none');
  // vertical centring of each scene (layout box of content)
  for (const [id, t] of [['s0', 2.9], ['s1', 3.5], ['b1', 5.5], ['b2', 7.5], ['b3', 9.5], ['b4', 11.5], ['pf', 13.9], ['rv', 16.5], ['en', 19.5]]) {
    await seek(t * 1000);
    console.log('centre', id, await p.evaluate(id => { const c = document.querySelector('#' + id + ' .ctr'); const k = [...c.children].map(e => e.getBoundingClientRect()); const top = Math.min(...k.map(r => r.top)), bot = Math.max(...k.map(r => r.bottom)); return [Math.round(top), Math.round(bot), Math.round((top + bot) / 2)]; }, id));
  }
  await b.close();
  if (MODE === 'render') execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', '30', '-i', path.join(FR, '%04d.png'), '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', '30', '-an', '-movflags', '+faststart', path.resolve(__dirname, 'reel-listings-silent.mp4')]);
  console.log('done', MODE);
})();
