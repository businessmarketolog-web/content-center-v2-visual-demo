const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(__dirname+'/workflow-model.js','utf8');
function module(){const context={Date};vm.runInNewContext(source,context);return context.CCV2FlowData;}
function card(overrides={}){return {id:'draft-demo-1',client_id:'demo-client-1',title:'Первый обзор отеля',format:'Reels',channel:'Instagram',caption:'Короткий рассказ об отеле',notes:'Для пар',img:'',status:'draft',scheduledAt:null,comments:[],...overrides};}
const img='https://images.unsplash.com/photo-1533105079780-92b9be482077?w=900&q=78';
test('visual material must have actual image before demo review',()=>{
 const m=module(),x=card();m.begin(x);
 assert.throws(()=>m.requestReview(x),/демофото/);
 m.attachSample(x,img);assert.equal(x.version,2);
 m.requestReview(x);assert.equal(x.status,'review');assert.equal(x.review.version,2);
 assert.throws(()=>m.requestReview(x),/следующем этапе/);
 m.approve(x);assert.equal(x.status,'approved');assert.equal(m.isApproved(x),true);
 const future=new Date(Date.now()+3*86400000).toISOString();
 m.schedule(x,future);assert.equal(x.status,'scheduled');assert.equal(x.scheduledAt,future);
 assert.equal(x.events[0].kind,'scheduled');
});
test('changing already approved or scheduled copy invalidates approval and removes scheduled date',()=>{
 const m=module(),x=card({format:'Пост',img:''});m.begin(x);m.requestReview(x);m.approve(x);
 const oldFingerprint=x.approval.fingerprint;
 m.schedule(x,new Date(Date.now()+86400000).toISOString());
 const wasChanged=m.applyEdit(x,{caption:'Исправленный текст после одобрения'});
 assert.equal(wasChanged,true);assert.equal(x.version,2);
 assert.equal(x.status,'production');assert.equal(x.scheduledAt,null);assert.equal(x.review,null);assert.equal(x.approval,null);
 assert.equal(m.isApproved(x),false);
 assert.notEqual(m.fingerprint(x),oldFingerprint);
 assert.throws(()=>m.schedule(x,new Date(Date.now()+86400000).toISOString()),/одобренную/);
 assert.throws(()=>m.approve(x),/актуальной/);
 m.requestReview(x);m.approve(x);assert.equal(x.approval.version,2);
});
test('returning reviewed material to work invalidates its previous review',()=>{
 const m=module(),x=card({format:'Пост'});m.requestReview(x);
 m.returnToWork(x);assert.equal(x.status,'production');assert.equal(x.review,null);
 assert.throws(()=>m.approve(x),/актуальной/);
});
test('rejects past date, unapproved scheduling, arbitrary media URL and unchanged edits',()=>{
 const m=module(),x=card({format:'Пост'});assert.throws(()=>m.schedule(x,new Date(Date.now()+86400000).toISOString()),/одобренную/);
 assert.throws(()=>m.attachSample(x,'https://evil.example.com/tracker.jpg'),/формата|формат/);
 m.begin(x);m.requestReview(x);m.approve(x);
 assert.throws(()=>m.schedule(x,new Date(Date.now()-86400000).toISOString()),/будущие/);
 assert.equal(m.applyEdit(x,{caption:x.caption}),false);assert.equal(m.isApproved(x),true);
});
test('review requires filling placeholders; price statement requires human verification but cannot be silently marked verified',()=>{
 const m=module(),x=card({format:'Пост',caption:'Тур за 200 000 ₽ до [указать дату]'});
 assert.throws(()=>m.requestReview(x),/шаблонные поля/);
 m.applyEdit(x,{caption:'Тур за 200 000 ₽, условия уточняются'});
 assert.ok(m.issues(x).some(s=>s.includes('первоисточнику')));
 m.requestReview(x);assert.equal(x.status,'review');assert.equal(m.issues(x).length,1);
});
