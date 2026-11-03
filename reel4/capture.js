const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const OUT = process.argv[2], FR = path.join(OUT, 'frames4');
(async () => {
  fs.mkdirSync(FR, { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.resolve(__dirname, 'reel-catalogue.html'));
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  console.log('font loaded:', await p.evaluate(() => document.fonts.check('800 40px "Libre Franklin"') && document.fonts.check('400 20px "Libre Franklin"')));
  await p.evaluate(() => document.getAnimations().forEach(a => a.pause()));
  const seek = ms => p.evaluate(ms => document.getAnimations().forEach(a => { a.currentTime = ms; }), ms);
  const bounds = async (ms, sel) => { await seek(ms); return JSON.stringify(await p.evaluate(sel => [...document.querySelectorAll(sel)].filter(e => getComputedStyle(e).visibility !== 'hidden' && getComputedStyle(e).opacity > 0).map(e => { const r = e.getBoundingClientRect(); return [e.id || e.className, Math.round(r.top), Math.round(r.bottom), Math.round(r.left), Math.round(r.right)]; }), sel)); };
  const vis = async ms => { await seek(ms); return JSON.stringify(await p.evaluate(() => ['sc1', 'sc23', 'sc4', 'c0', 'c1', 'c2'].map(id => { const e = document.getElementById(id), c = getComputedStyle(e); return [id, c.opacity, c.visibility]; }))); };
  for (const ms of [1000, 2800, 2999, 3000, 5000, 13000, 16000]) console.log('vis', ms, await vis(ms));
  console.log('s1', await bounds(2800, '#lab0,#lab1,#lab2,#t1a,#t1b,#box1')); console.log('s2', await bounds(6500, '.pc,#t2,.tgi')); console.log('s3', await bounds(13900, '.pc,#t3,#sb,#prog,#st3,.pill')); console.log('s4', await bounds(16000, '.gc,#cta,#foot'));
  const over = async (ms, root, kids) => { await seek(ms); return JSON.stringify(await p.evaluate(([root, kids]) => { const o = []; document.querySelectorAll(root).forEach(bk => { const fr = bk.getBoundingClientRect(), cs = getComputedStyle(bk); const bw = parseFloat(cs.borderLeftWidth) + parseFloat(cs.paddingLeft); bk.querySelectorAll(kids).forEach(e => { const r = e.getBoundingClientRect(); if (r.width && (r.right > fr.right - 2 || r.left < fr.left + 2 || r.bottom > fr.bottom - 2 || r.top < fr.top + 2)) o.push([e.id || e.className, Math.round(fr.right - r.right), Math.round(r.left - fr.left), Math.round(fr.bottom - r.bottom)]); }); }); return o; }, [root, kids])); };
  console.log('o1', await over(2800, '#box1', '*')); console.log('o2', await over(6500, '.pc', '.lb,.tgi,.fr,.row')); console.log('o2f', await over(6500, '.fr', '.bd')); console.log('o3', await over(13900, '.pc', '.lb,.fr,.row')); console.log('o3f', await over(13900, '.fr', '.bd'));
  console.log('o3sb', await over(13900, '#sb', '.pill,.lb')); console.log('o4', await over(16000, '.gc', '.lb,.fr,.row')); console.log('o4c', await over(16000, '#cta', '*'));
  console.log('labrow', await bounds(2800, '#labrow'));
  if (process.argv[3] === 'check') { for (const t of [1, 2.8, 5, 13, 16]) { await seek(t * 1000); await p.screenshot({ path: path.join(OUT, 'check_' + t + 's.png') }); } await b.close(); return; }
  for (let f = 0; f < 540; f++) { await seek(f * 1000 / 30); await p.screenshot({ path: path.join(FR, String(f).padStart(4, '0') + '.png') }); }
  await b.close();
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', '30', '-i', path.join(FR, '%04d.png'), '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', '30', '-an', '-movflags', '+faststart', path.resolve(__dirname, 'reel-catalogue-silent.mp4')]);
  console.log('done');
})();
