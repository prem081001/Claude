const pp=require('puppeteer-core'),path=require('path'),fs=require('fs');
const OUT=process.argv[2]||'shots';
const FRAMES=process.argv.slice(3).map(Number);
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});
 const b=await pp.launch({executablePath:'/opt/pw-browsers/chromium',headless:true,
   args:['--no-sandbox','--disable-gpu','--hide-scrollbars','--force-device-scale-factor=1',
         '--force-color-profile=srgb','--font-render-hinting=none']});
 const p=await b.newPage();
 const errs=[]; p.on('pageerror',e=>errs.push(String(e))); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.setViewport({width:1080,height:1920,deviceScaleFactor:1});
 await p.goto('file://'+path.join(__dirname,'index.html'),{waitUntil:'load'});
 await p.waitForFunction('window.__ready===true',{timeout:20000});
 await p.evaluate(()=>document.fonts.ready);
 for(const f of FRAMES){
   await p.evaluate(n=>window.setFrame(n),f);
   await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   await p.screenshot({path:path.join(OUT,'f'+String(f).padStart(4,'0')+'.png')});
 }
 if(errs.length) console.log('PAGE ERRORS:\n'+errs.slice(0,8).join('\n'));
 else console.log('no page errors');
 await b.close(); console.log('shots:',FRAMES.join(','));
})().catch(e=>{console.error(e);process.exit(1)});
