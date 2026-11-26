// Frame-exact capture: one 1080x1920 PNG per frame, driven by window.setFrame(n).
const pp=require('puppeteer-core'), path=require('path'), fs=require('fs');
const OUT=path.join(__dirname,'frames');
(async()=>{
  fs.rmSync(OUT,{recursive:true,force:true}); fs.mkdirSync(OUT,{recursive:true});
  const b=await pp.launch({executablePath:'/opt/pw-browsers/chromium',headless:true,
    args:['--no-sandbox','--disable-gpu','--hide-scrollbars','--force-device-scale-factor=1',
          '--force-color-profile=srgb','--disable-lcd-text','--font-render-hinting=none']});
  const p=await b.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
  await p.setViewport({width:1080,height:1920,deviceScaleFactor:1});
  await p.goto('file://'+path.join(__dirname,'index.html'),{waitUntil:'load'});
  await p.waitForFunction('window.__ready===true',{timeout:20000});
  await p.evaluate(()=>document.fonts.ready);
  const total=await p.evaluate(()=>window.TOTAL_FRAMES);
  console.log('capturing '+total+' frames at 1080x1920');
  for(let f=0;f<total;f++){
    await p.evaluate(n=>window.setFrame(n),f);
    await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    await p.screenshot({path:path.join(OUT,String(f).padStart(4,'0')+'.png'),optimizeForSpeed:true});
    if(f%100===0) console.log('  '+f);
  }
  if(errs.length) console.log('PAGE ERRORS: '+errs.slice(0,5).join(' | '));
  await b.close();
  console.log('done: '+fs.readdirSync(OUT).length+' frames');
})().catch(e=>{console.error(e);process.exit(1)});
