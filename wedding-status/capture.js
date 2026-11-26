// Frame-exact capture: 1080x1920 PNG per frame, driven by window.setFrame(n).
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const OUT = process.argv[2] || path.join(__dirname, 'frames');

(async () => {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: '/opt/pw-browsers/chromium',
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--force-color-profile=srgb',
      '--disable-lcd-text',
      '--font-render-hinting=none',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
  await page.goto('file://' + path.join(__dirname, 'index.html'), { waitUntil: 'load' });
  await page.waitForFunction('window.__ready === true');
  await page.evaluate(() => document.fonts.ready);

  const total = await page.evaluate(() => window.TOTAL_FRAMES);
  console.log('capturing ' + total + ' frames at 1080x1920');

  for (let f = 0; f < total; f++) {
    await page.evaluate((n) => window.setFrame(n), f);
    // one rAF so the style writes are composited before the shot
    await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
    await page.screenshot({
      path: path.join(OUT, String(f).padStart(4, '0') + '.png'),
      captureBeyondViewport: false,
      optimizeForSpeed: true,
    });
    if (f % 50 === 0) console.log('  frame ' + f);
  }

  await browser.close();
  console.log('done: ' + fs.readdirSync(OUT).length + ' frames');
})().catch(e => { console.error(e); process.exit(1); });
