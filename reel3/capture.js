const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const OUT = process.argv[2], FR = path.join(OUT, 'frames3');
(async () => {
  fs.mkdirSync(FR, { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.resolve(__dirname, 'reel-product-listing-v3.html'));
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  console.log('font loaded:', await p.evaluate(() => document.fonts.check('800 40px "Libre Franklin"') && document.fonts.check('400 20px "Libre Franklin"')));
  await p.evaluate(() => document.getAnimations().forEach(a => a.pause()));
  const seek = ms => p.evaluate(ms => document.getAnimations().forEach(a => { a.currentTime = ms; }), ms);
  const bounds = async (ms, sel) => { await seek(ms); return JSON.stringify(await p.evaluate(sel => [...document.querySelectorAll(sel)].map(e => { const r = e.getBoundingClientRect(); return [e.id || e.className, Math.round(r.top), Math.round(r.bottom), Math.round(r.left), Math.round(r.right)]; }), sel)); };
  console.log('h1', await bounds(1000, '#h1')); console.log('h2', await bounds(5000, '#h2'));
  console.log('stackA', await bounds(1000, '#stackA')); console.log('words', await bounds(8000, '#w1')); console.log('h3', await bounds(16000, '#h3'));
  console.log('end', await bounds(19000, '#end, #end .cta'));
  const over = async (ms, root, kids) => { await seek(ms); return JSON.stringify(await p.evaluate(([root, kids]) => { const o = []; document.querySelectorAll(root).forEach(bk => { const fr = bk.getBoundingClientRect(); bk.querySelectorAll(kids).forEach(e => { const r = e.getBoundingClientRect(); if (r.width && (r.right > fr.right + 1 || r.left < fr.left - 1 || r.bottom > fr.bottom + 1 || r.top < fr.top - 1)) o.push([e.id || e.className, Math.round(fr.right - r.right), Math.round(fr.bottom - r.bottom)]); }); }); return o; }, [root, kids])); };
  console.log('stackA overflow', await over(1000, '.sa', '*')); console.log('row overflow', await over(14900, '.bc', '*')); console.log('grid overflow', await over(16000, '.gc', '*'));
  console.log('row cards', await bounds(14900, '.bc')); console.log('grid cards', await bounds(16000, '.gc'));
  for (let f = 0; f < 600; f++) { await seek(f * 1000 / 30); await p.screenshot({ path: path.join(FR, String(f).padStart(4, '0') + '.png') }); }
  await b.close();
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', '30', '-i', path.join(FR, '%04d.png'), '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', '30', '-an', '-movflags', '+faststart', path.resolve(__dirname, 'reel-product-listing-v3-silent.mp4')]);
  console.log('done');
})();
