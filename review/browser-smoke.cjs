/* CI only: test the public mock preview locally. No real Supabase or social media. */
'use strict';
const assert=require('node:assert/strict');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('playwright');
const root=__dirname;
const mime={'.js':'application/javascript','.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png'};
function server(){return http.createServer((req,res)=>{
 const requested=new URL(req.url,'http://127.0.0.1');
 const target=path.resolve(root,'.'+(requested.pathname==='/'?'/index.html':requested.pathname));
 if(!target.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
 fs.readFile(target,(error,body)=>{
  if(error){res.writeHead(404);res.end('not found');return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream'});res.end(body);
 });
});}
(async()=>{
 const host=server();await new Promise(done=>host.listen(0,'127.0.0.1',done));
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  for(const device of [{name:'desktop',width:1365,height:900},{name:'mobile',width:390,height:844}]){
   const ctx=await browser.newContext({viewport:{width:device.width,height:device.height},serviceWorkers:'block'});
   const page=await ctx.newPage();const failures=[];
   page.on('pageerror',error=>failures.push(error.message));
   await page.route('**/*',route=>route.request().url().startsWith('http://127.0.0.1:')?route.continue():route.abort('blockedbyclient'));
   await page.goto('http://127.0.0.1:'+host.address().port+'/?workspace=v2',{waitUntil:'load'});
   await page.locator('#dashboard .ccv2-shell').waitFor({timeout:15000});
   // Exercise the real V2 drawer: a locally edited deadline must survive GPT handoff.
   const handoffButton=page.locator('[data-ccv2-handoff]').first();
   await handoffButton.waitFor();
   const handoffId=await handoffButton.getAttribute('data-ccv2-handoff');
   const handoffClient=await page.locator('#client').inputValue();
   await handoffButton.click();
   const handoffPrompt=await page.locator('#ccv2-handoff textarea[readonly]').inputValue();
   const requestId=handoffPrompt.match(/"request_id":"([0-9a-f-]+)"/i)?.[1];
   assert.ok(requestId,'handoff request ID must be present');
   await page.locator('#ccv2-handoff textarea:not([readonly])').fill(JSON.stringify({
    schema:'content-center-handoff/1',request_id:requestId,client_id:handoffClient,
    content_item_id:handoffId,changes:{caption:'Безопасно улучшенный текст'}
   }));
   await page.locator('#ccv2-handoff button',{hasText:'Проверить ответ'}).click();
   assert.equal(await page.locator('#ccv2-handoff button',{hasText:'Перенести в редактор'}).isEnabled(),true);
   await page.evaluate(id=>{openDrawer(id);document.getElementById('dDue').value='2026-10-19T15:00';},handoffId);
   await page.evaluate(()=>document.querySelector('#ccv2-handoff button.ccv2-create').click());
   assert.match(await page.locator('#ccv2-handoff .ccv2-handoff-message').innerText(),/несохранённые правки/i);
   assert.equal(await page.locator('#dDue').inputValue(),'2026-10-19T15:00');
   await page.evaluate(()=>closeDrawer());
   assert.equal(await page.locator('#authLayer.on').count(),0,'mock owner login failed');
   assert.equal(await page.locator('#clientCreateBtnV9').count(),1);
   assert.match(await page.locator('#ccv2-review-notice').innerText(),/ТЕСТОВАЯ V2/);
   assert.equal(await page.locator('#client option').count(),2,'mock should contain exactly two clients');
   await page.locator('#clientCreateBtnV9').click();
   await page.locator('#cm_name').fill('Новая компания '+device.name);
   await page.locator('#cm_business_type').fill('Туризм');
   for(let step=1;step<=5;step++){
    await page.locator('#clientManagerV9 button',{hasText:'Продолжить'}).click();
    assert.match(await page.locator('#clientManagerV9 .ccv2-client-progress').innerText(),new RegExp('Шаг '+(step+1)+' из 6'));
   }
   page.once('dialog',dialog=>dialog.dismiss());
   await page.locator('#clientManagerSaveV9').click();
   await page.waitForFunction(()=>document.querySelectorAll('#client option').length===3);
   await page.locator('#clientManagerV9.on').waitFor({state:'hidden'});
   assert.equal(await page.locator('#contentModal.on').count(),0,'declined create-first-item must not auto-create content');
   assert.equal(failures.length,0,device.name+' JS errors: '+failures.join('; '));
   console.log('PASS',device.name,'mock-only owner, workspace, client wizard and save');
   await ctx.close();
  }
 }finally{await browser.close();await new Promise(done=>host.close(done));}
})().catch(error=>{console.error(error);process.exitCode=1;});
