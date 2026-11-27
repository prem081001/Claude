// Character sheet: loads the real index.html, strips the backdrop, and shoots
// each lead large. What you see here IS the rig that renders the film.
const pp=require('puppeteer-core'), path=require('path'), fs=require('fs');
(async()=>{
  fs.mkdirSync('sheet',{recursive:true});
  const b=await pp.launch({executablePath:'/opt/pw-browsers/chromium',headless:true,
    args:['--no-sandbox','--disable-gpu','--hide-scrollbars','--force-color-profile=srgb','--font-render-hinting=none']});
  const p=await b.newPage();
  await p.setViewport({width:1080,height:1920,deviceScaleFactor:2});
  await p.goto('file://'+path.join(__dirname,'index.html'),{waitUntil:'load'});
  await p.waitForFunction('window.__ready===true'); await p.evaluate(()=>document.fonts.ready);
  // plain backdrop so the characters read clearly
  await p.evaluate(()=>{
    document.getElementById('grain').style.display='none';
    document.getElementById('vig').style.display='none';
    document.getElementById('copy').style.display='none';
    document.querySelectorAll('#root > rect, #root > ellipse, #bokeh, #scene4bg, #confetti, #petals, #sc2bg')
      .forEach(e=>e.style.display='none');
    document.getElementById('root').insertAdjacentHTML('afterbegin',
      '<rect width="1080" height="1920" fill="#f3e9dc"/>');
  });
  const shot=async(name,frame,fn)=>{
    await p.evaluate(n=>window.setFrame(n),frame);
    if(fn) await p.evaluate(fn);
    await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    await p.screenshot({path:'sheet/'+name+'.png'});
    console.log('  '+name);
  };
  // hero: both leads centred and large, neutral standing pose (frame 500 = 16.7s)
  await shot('hero',500,()=>{
    document.querySelector('.an-pos-prem').style.cssText=
      'transform-box:view-box;transform-origin:540px 1480px;animation:none;transform:translate(-260px,150px) scale(1.5)';
    document.querySelector('.an-pos-vasu').style.cssText=
      'transform-box:view-box;transform-origin:540px 1480px;animation:none;transform:translate(258px,150px) scale(1.5)';
  });
  // the story poses, straight out of the timeline — same rig, no cheating
  const poses=[['p1-phone',70],['p2-surprise',112],['p3-turn',232],['p4-cheer',258],
               ['p5-kneel',400],['p6-gasp',416],['p7-hold',560]];
  for(const [nm,fr] of poses){
    await shot(nm,fr,()=>{
      document.querySelectorAll('.an-pos-prem,.an-pos-vasu').forEach((g,i)=>{
        g.style.cssText='transform-box:view-box;transform-origin:540px 1480px;animation:none;'+
          'transform:translate('+(i?300:-300)+'px,150px) scale(1.42)';
      });
    });
  }
  await b.close(); console.log('sheet done');
})().catch(e=>{console.error(e);process.exit(1)});
