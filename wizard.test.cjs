const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const src=fs.readFileSync(__dirname+'/wizard-model.js','utf8');
function model(){const scope={};vm.runInNewContext(src,scope);return scope.CCV2WizardData;}
const base={name:'Тревел Студио',niche:'Туризм',goals:['Заявки','Экспертность'],channels:['Instagram','Telegram'],formats:['Reels','Пост','Stories']};
test('client form validates and returns separate immutable-like normalized data',()=>{
 const M=model(),v=M.validateClient(base,[]);assert.equal(v.name,'Тревел Студио');
 assert.equal(v.channels.length,2);assert.equal(v.formats.length,3);
 assert.throws(()=>M.validateClient({...base,name:' трЕвел СТУДИО '},[{name:'Тревел Студио'}]),/уже есть/);
 assert.throws(()=>M.validateClient({...base,goals:[]},[]),/хотя бы одну/);
 assert.throws(()=>M.validateClient({...base,channels:['Telegram'],formats:['Reels']},[]),/несовместимы/);
});
test('material bundle is split by permitted channel and format and belongs only to selected client',()=>{
 const M=model();
 const plan=M.validateMaterials({title:'Тестовый обзор',brief:'Только демо',caption:'Сначала проверка',channels:['Instagram','Telegram'],formats:['Reels','Пост','Stories']});
 assert.equal(plan.variants.length,4);
 assert.equal(plan.variants.filter(x=>x.channel==='Telegram').length,1);
 const ids=plan.variants.map((_,i)=>'demo-'+i);
 const cards=M.createDemoBundle(plan,'test-client','bundle-id',ids);
 assert.equal(cards.length,4);
 assert.ok(cards.every(c=>c.client_id==='test-client'&&c.status==='draft'&&c.bundleId==='bundle-id'));
 assert.equal(new Set(cards.map(c=>c.id)).size,4);
 assert.ok(!cards.some(c=>c.channel==='Telegram'&&c.format!=='Пост'));
});
test('rejects duplicate bundle IDs and missing content combinations',()=>{
 const M=model();
 assert.throws(()=>M.validateMaterials({title:'а',channels:['Instagram'],formats:['Пост']}),/название/);
 assert.throws(()=>M.validateMaterials({title:'Подготовить материал',channels:['Telegram'],formats:['Reels']}),/Нет подходящих/);
 const plan=M.validateMaterials({title:'Подготовить материал',channels:['Instagram'],formats:['Reels','Stories']});
 assert.throws(()=>M.createDemoBundle(plan,'c','b',['one','one']),/Некорректная/);
});
console.log('WIZARD_MODEL_TESTS=READY');
