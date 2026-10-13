'use strict';
const assert=require('node:assert/strict');
const test=require('node:test');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'..','safety-gate.js'),'utf8');
const backend='https://kywxggukoqalzhuykhmx.supabase.co';
const qaId='44444444-4444-4444-8444-444444444444';
const prodId='11111111-1111-4111-8111-111111111111';
const itemId='55555555-5555-4555-8555-555555555555';
const defaults={status:'draft',client_id:qaId,title:'Preview draft',media_urls:[],scheduled_at:null,due_at:null};
function harness(client=qaId){
 const outbound=[];
 const state={
  clientId:client,
  clients:[{id:qaId,name:'[V2 QA] New Client'},{id:prodId,name:'Real Existing Client'}],
  content:[{id:itemId,client_id:qaId,title:'Preview draft'}]
 };
 const win={fetch:async(req)=>{outbound.push(req);return {ok:true,status:200}}};
 const context={window:win,Request,URL,JSON,Error,state};
 vm.runInNewContext(src,context);
 async function call(route,method='GET',body){
  return win.fetch(backend+route,body?{method,headers:{'content-type':'application/json'},body:JSON.stringify(body)}:{method});
 }
 return {outbound,call,win,state};
}
test('existing public app connection remains real but separate',()=>{
 const app=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
 const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
 assert.match(app,/https:\/\/kywxggukoqalzhuykhmx\.supabase\.co/);
 assert.match(app,/storage:window\.sessionStorage/);
 assert.doesNotMatch(app,/navigator\.serviceWorker\.register/);
 assert.doesNotMatch(html,/owner-code-rotate\.js|mock-supabase\.js/);
 assert.match(html,/force-v2\.js/);
 assert.match(html,/safety-gate\.js/);
 assert.ok(html.indexOf('safety-gate.js')<html.indexOf('app.js'));
});
test('owner login and Supabase auth allowed, sensitive functions blocked',async()=>{
 const h=harness();
 await h.call('/functions/v1/claim-owner-v2','POST',{code:'fictional'});
 await h.call('/auth/v1/token?grant_type=refresh_token','POST',{refresh_token:'fictional'});
 await assert.rejects(h.call('/functions/v1/publish-content','POST',{id:'a'}),/заблокирована/);
 await assert.rejects(h.call('/functions/v1/rotate-owner-code','POST',{code:'fictional'}),/заблокирована/);
 await assert.rejects(h.call('/functions/v1/dispatch-telegram-notifications','POST',{}),/заблокирована/);
 assert.equal(h.outbound.length,2);
});
test('new client receives TEST prefix in actual RPC body',async()=>{
 const h=harness();
 await h.call('/rest/v1/rpc/owner_create_client','POST',{p_name:'New Client',p_business_type:'tourism',p_brand_rules:{}});
 assert.equal((await h.outbound[0].json()).p_name,'[V2 QA] New Client');
 await assert.rejects(h.call('/rest/v1/rpc/owner_update_client','POST',{p_name:'Hijack'}),/заблокирована/);
});
test('only QA client drafts without media or scheduled publishing can be saved',async()=>{
 const h=harness();
 await h.call('/rest/v1/content_items','POST',defaults);
 assert.equal(h.outbound.length,1);
 for(const bad of [
  {...defaults,client_id:prodId},
  {...defaults,status:'published'},
  {...defaults,scheduled_at:'2026-12-01T12:00:00Z'},
  {...defaults,due_at:'2026-12-01T10:00:00Z'},
  {...defaults,media_urls:['https://example.com/image.jpg']}
 ]){
  await assert.rejects(h.call('/rest/v1/content_items','POST',bad),/разрешены только черновики/);
 }
 assert.equal(h.outbound.length,1);
});
test('real-client selection cannot create any content even if client_id forged',async()=>{
 const h=harness(prodId);
 await assert.rejects(h.call('/rest/v1/content_items','POST',{...defaults,client_id:prodId}),/создайте и выберите клиента/);
 assert.equal(h.outbound.length,0);
});
test('edit allowed only for selected QA item; delete and other tables blocked',async()=>{
 const h=harness();
 await h.call('/rest/v1/content_items?id=eq.'+itemId,'PATCH',{title:'Edited'});
 await assert.rejects(h.call('/rest/v1/content_items?id=eq.'+prodId,'PATCH',{title:'Wrong'}),/только материалы/);
 await assert.rejects(h.call('/rest/v1/content_items?id=eq.'+itemId,'PATCH',{status:'published'}),/нельзя менять/);
 await assert.rejects(h.call('/rest/v1/content_items?id=eq.'+itemId,'DELETE'),/заблокирована/);
 await assert.rejects(h.call('/rest/v1/client_integrations','POST',{client_id:qaId}),/заблокирована/);
 await assert.rejects(h.call('/storage/v1/object/anything','POST',{}),/заблокирована/);
 assert.equal(h.outbound.length,1);
});
test('non-mutating select requests never require a QA client',async()=>{
 const h=harness(prodId);
 await h.call('/rest/v1/clients?select=*');
 await h.call('/rest/v1/content_items?select=*');
 assert.equal(h.outbound.length,2);
});
