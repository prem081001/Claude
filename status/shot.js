const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.goto('file:///home/user/Claude/status/card.html');await p.screenshot({path:'/home/user/Claude/status/new-year-status.png'});await b.close()})()
