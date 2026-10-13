'use strict';
const { chromium, webkit }=require('playwright');
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),mock=fs.readFileSync(path.resolve(__dirname,'../../review/mock-supabase.js'),'utf8');
const engine=process.env.BROWSER_ENGINE==='webkit'?'webkit':'chromium';
(async()=>{
 const host=http.createServer((req,res)=>{
  const name=new URL(req.url,'http://localhost').pathname;
  const p=path.resolve(root,'.'+(name==='/'?'/index.html':name));
  if(!p.startsWith(root+path.sep)||!fs.existsSync(p)||!fs.statSync(p).isFile()){res.writeHead(404);return res.end('missing')}
  res.setHeader('Content-Type',p.endsWith('.js')?'application/javascript':p.endsWith('.html')?'text/html':p.endsWith('.css')?'text/css':'application/octet-stream');
  fs.createReadStream(p).pipe(res);
 });
 await new Promise(r=>host.listen(0,'127.0.0.1',r));
 const browser=await (engine==='webkit'?webkit:chromium).launch();
 try{
  for(const width of [1440,390]){
   const context=await browser.newContext({viewport:{width,height:850},serviceWorkers:'block'});
   const page=await context.newPage(),errors=[],outside=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.route('**/*',route=>{
    const url=new URL(route.request().url());
    if(url.hostname==='cdn.jsdelivr.net')return route.fulfill({body:mock,contentType:'application/javascript'});
    if(url.origin==='http://127.0.0.1:'+host.address().port)return route.continue();
    outside.push(url.origin);return route.abort();
   });
   await page.goto('http://127.0.0.1:'+host.address().port+'/',{waitUntil:'load'});
   assert.equal(new URL(page.url()).searchParams.get('workspace'),'v2');
   await page.locator('#dashboard .ccv2-shell').waitFor({timeout:12000});
   assert.match(await page.locator('#cc-real-review-banner').innerText(),/ПРОВЕРКА НАСТОЯЩЕГО ВХОДА/);
   assert.equal(await page.evaluate(()=>window.CCV2AuthReview?.prefix),'[V2 QA] ');
   assert.deepEqual(errors,[]);
   assert.deepEqual(outside,[]);
   console.log('PASS',engine,width);
   await context.close();
  }
 }finally{await browser.close();await new Promise(r=>host.close(r))}
})().catch(e=>{console.error(e);process.exitCode=1});
