const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const OUT = process.argv[2], FR = path.join(OUT, 'frames2');
(async () => {
  fs.mkdirSync(FR, { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.resolve(__dirname, 'reel-product-listing.html'));
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  console.log('font loaded:', await p.evaluate(() => document.fonts.check('800 40px "Libre Franklin"') && document.fonts.check('400 20px "Libre Franklin"')));
  await p.evaluate(() => document.getAnimations().forEach(a => a.pause()));
  const seek = ms => p.evaluate(ms => document.getAnimations().forEach(a => { a.currentTime = ms; }), ms);
  // pre-flight checks (not a render)
  await seek(13900);
  console.log('fix overflow:', JSON.stringify(await p.evaluate(() => { const o = []; document.querySelectorAll('.blk').forEach(bk => { const fr = bk.getBoundingClientRect(); bk.querySelectorAll('.c *').forEach(e => { const r = e.getBoundingClientRect(); if (r.width && (r.right > fr.right - 70 || r.left < fr.left || r.bottom > fr.bottom + 1 || r.top < fr.top - 1)) o.push([bk.id, e.id || e.className, Math.round(fr.right - r.right), Math.round(r.top - fr.top), Math.round(fr.bottom - r.bottom)]); }); }); return o; })));
  console.log('labels bottom max:', await p.evaluate(() => Math.max(...[...document.querySelectorAll('.lab')].map(e => Math.round(e.getBoundingClientRect().bottom)))));
  await seek(16000);
  console.log('page overflow:', JSON.stringify(await p.evaluate(() => { const o = []; document.querySelectorAll('.blk').forEach(bk => { const fr = bk.getBoundingClientRect(); bk.querySelectorAll('.pc, .pc *').forEach(e => { const r = e.getBoundingClientRect(); if (r.width && (r.right > fr.right + 1 || r.left < fr.left - 1 || r.bottom > fr.bottom + 1 || r.top < fr.top - 1)) o.push([bk.id, e.className, Math.round(r.right - fr.right), Math.round(r.bottom - fr.bottom)]); }); }); return o; })));
  console.log('page rects:', JSON.stringify(await p.evaluate(() => [...document.querySelectorAll('.blk')].map(e => { const r = e.getBoundingClientRect(); return [e.id, Math.round(r.top), Math.round(r.bottom)]; }))));
  await seek(19000);
  console.log('end rect:', JSON.stringify(await p.evaluate(() => { const r = document.querySelector('#end').getBoundingClientRect(); return [Math.round(r.top), Math.round(r.bottom)]; })));
  for (let f = 0; f < 600; f++) { await seek(f * 1000 / 30); await p.screenshot({ path: path.join(FR, String(f).padStart(4, '0') + '.png') }); }
  await b.close();
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', '30', '-i', path.join(FR, '%04d.png'), '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', '30', '-an', '-movflags', '+faststart', path.resolve(__dirname, 'reel-product-listing-silent.mp4')]);
  console.log('done');
})();
