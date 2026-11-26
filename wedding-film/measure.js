const pp=require('puppeteer-core'),path=require('path');
(async()=>{
const b=await pp.launch({executablePath:'/opt/pw-browsers/chromium',headless:true,args:['--no-sandbox','--disable-gpu','--font-render-hinting=none']});
const p=await b.newPage(); await p.setViewport({width:1080,height:1920,deviceScaleFactor:1});
await p.goto('file://'+path.join(__dirname,'index.html'),{waitUntil:'load'});
await p.waitForFunction('window.__ready===true'); await p.evaluate(()=>document.fonts.ready);
for(const t of [19,13.5]){
  await p.evaluate(n=>window.setFrame(n),Math.round(t*30));
  await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
  const r=await p.evaluate(()=>{
    const g=(sel)=>{const e=document.querySelector(sel); if(!e)return null;
      const b=e.getBoundingClientRect(); return [Math.round(b.x+b.width/2),Math.round(b.y+b.height/2)];};
    return { premHandR:g('#pm .fore-r circle'), vasuHandL:g('#vs .fore-l circle'),
             vasuHandR:g('#vs .fore-r circle'), vasuFace:g('#vs .head circle'),
             premFeet:g('#pm .shin-r path'), ring:g('#pm .an-ringhold circle') };
  });
  console.log('t='+t, JSON.stringify(r));
}
// text safe-margin check
await p.evaluate(()=>window.setFrame(650));
const tx=await p.evaluate(()=>[...document.querySelectorAll('.tx')].map(e=>{
  const s=getComputedStyle(e); const probe=document.createElement('span');
  probe.style.cssText='position:absolute;visibility:hidden;white-space:nowrap;font:'+s.font+';letter-spacing:'+s.letterSpacing;
  probe.textContent=e.textContent; document.body.appendChild(probe);
  const w=probe.getBoundingClientRect().width; probe.remove();
  return [e.id, Math.round(w), w<=1080*0.76?'ok':'OVER'];}));
console.log('safe area 820.8px ->',JSON.stringify(tx));
await b.close()})();
