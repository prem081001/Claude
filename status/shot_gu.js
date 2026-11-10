const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file:///home/user/Claude/status/card_gu.html');await p.screenshot({path:'/home/user/Claude/status/shree-umiya-kirana-new-year-gujarati.png'});await b.close()})()
