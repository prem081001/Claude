const puppeteer=require('puppeteer-core'),path=require('path');
(async()=>{
const b=await puppeteer.launch({executablePath:'/opt/pw-browsers/chromium',headless:true,args:['--no-sandbox','--disable-gpu','--font-render-hinting=none']});
const p=await b.newPage();
await p.setViewport({width:1080,height:1920,deviceScaleFactor:1});
await p.goto('file://'+path.join(__dirname,'index.html'),{waitUntil:'load'});
await p.waitForFunction('window.__ready===true'); await p.evaluate(()=>document.fonts.ready);
const r=await p.evaluate(()=>{
  const safe=1080-2*129.6; const out=[];
  document.querySelectorAll('.line,.nm,.dateline,#save-the-date').forEach(e=>{
    const w=e.getBoundingClientRect().width;
    out.push([e.id||e.className, Math.round(w), Math.round(e.scrollWidth), w>safe?'OVER':'ok']);
  });
  return {safe:Math.round(safe), out};
});
console.log(JSON.stringify(r,null,1)); await b.close();
})();
