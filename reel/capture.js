const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const OUT = process.argv[2], FR = path.join(OUT, 'frames');
(async () => {
  fs.mkdirSync(FR, { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.resolve(__dirname, 'reel.html'));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(500);
  const fontOk = await p.evaluate(() => document.fonts.check('800 40px "Libre Franklin"') && document.fonts.check('400 20px "Libre Franklin"'));
  console.log('font loaded:', fontOk);
  await p.evaluate(() => document.getAnimations().forEach(a => a.pause()));
  const seek = ms => p.evaluate(ms => document.getAnimations().forEach(a => { a.currentTime = ms; }), ms);
  // pre-flight checks (not a render)
  const rep = [];
  const chk = async (ms, sel) => { await seek(ms); rep.push(...await p.evaluate(sel => [...document.querySelectorAll(sel)].map(e => { const r = e.getBoundingClientRect(); return [sel, Math.round(r.top), Math.round(r.bottom), Math.round(r.left), Math.round(r.right)]; }), sel)); };
  await chk(1000, '#h1'); await chk(15000, '#h2'); await chk(19500, '#end .nm, #end .url, #end .cta'); await chk(15000, '.tile'); await chk(15000, '#lvl');
  rep.forEach(r => console.log(r.join(' ')));
  await seek(14700);
  const over = await p.evaluate(() => { const out = []; document.querySelectorAll('.art').forEach((f, i) => { const fr = f.getBoundingClientRect(); f.querySelectorAll('*').forEach(e => { const r = e.getBoundingClientRect(); if (r.width && (r.left < fr.left - 1 || r.right > fr.right + 1 || r.top < fr.top - 1 || r.bottom > fr.bottom + 1)) out.push([i, e.id || e.className || e.textContent.slice(0, 20), Math.round(r.left - fr.left), Math.round(fr.right - r.right)]); }); }); return out; });
  console.log('face overflow:', JSON.stringify(over));
  console.log('digits in text:', /\d/.test(await p.evaluate(() => document.body.innerText)));
  for (let f = 0; f < 600; f++) {
    await seek(f * 1000 / 30);
    await p.screenshot({ path: path.join(FR, String(f).padStart(4, '0') + '.png') });
  }
  await b.close();
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', '30', '-i', path.join(FR, '%04d.png'), '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', '30', '-an', '-movflags', '+faststart', path.resolve(__dirname, 'reel-client-ad-silent.mp4')]);
  console.log('done');
})();
