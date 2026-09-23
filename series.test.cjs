const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const src=fs.readFileSync(__dirname+'/series-model.js','utf8');
function model(){const scope={};vm.runInNewContext(src,scope);return scope.CCV2SeriesData;}
const demo=(id,clientId,status,other={})=>({id,client_id:clientId,bundleId:'bundle-1',bundleTitle:'Демо: одна идея',title:'Демо: одна идея · Пост',format:'Пост',channel:'Telegram',status,...other});
test('related cards are grouped without mutating input; all statuses remain card-specific',()=>{
 const cards=[demo('a','one','draft'),demo('b','one','review'),demo('c','one','approved'),demo('d','one','scheduled')];
 const before=JSON.stringify(cards),out=model().derive(cards,'one');
 assert.equal(out.length,1);assert.equal(out[0].total,4);assert.equal(out[0].work,1);
 assert.equal(out[0].review,1);assert.equal(out[0].ready,2);assert.equal(out[0].remaining,2);
 assert.equal(JSON.stringify(cards),before);
});
test('foreign-client bundle with same ID and ungrouped items cannot leak into current client',()=>{
 const cards=[demo('a','one','production'),demo('foreign','two','approved'),{id:'legacy',client_id:'one',status:'draft',title:'Без серии'}];
 const D=model(),g=D.derive(cards,'one');
 assert.equal(g.length,1);assert.equal(g[0].total,1);assert.equal(g[0].cards[0].id,'a');
 assert.equal(D.forClient(cards,'one','missing'),null);
 assert.equal(D.forClient(cards,'two','bundle-1').cards[0].id,'foreign');
 assert.equal(D.derive(cards,null).length,0);
});
test('separate bundles and format channels are counted once per series',()=>{
 const cards=[demo('a','one','review',{format:'Reels',channel:'Instagram',bundleId:'x'}),demo('b','one','approved',{format:'Пост',channel:'Telegram',bundleId:'x'}),demo('c','one','draft',{bundleId:'y',bundleTitle:'Другой бриф'})];
 const groups=model().derive(cards,'one');
 assert.equal(groups.length,2);assert.equal(groups[0].total,2);assert.equal(groups[0].formats.length,2);assert.equal(groups[0].channels.length,2);
 assert.equal(groups[1].title,'Другой бриф');
});
