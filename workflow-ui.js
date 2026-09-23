/* V2 interactive demo board and material journey. Uses only in-memory mock objects. */
(function(root){
'use strict';
const D=root.CCV2FlowData;
const e=escapeHtml;
const COLUMNS=[
 ['failed','Требует внимания','Проверьте причину и верните в работу'],
 ['draft','Черновики','Идеи и первые тексты'],
 ['production','В работе','Редактирование и проверка'],
 ['review','Согласование','Версия ждёт решения'],
 ['approved','Одобрено','Можно назначить дату'],
 ['scheduled','В календаре','План, не реальная публикация']
];
const sample=IMG.resort;
function seed(items){
 for(const item of items){
  D.ensure(item);
  if(item.status==='review'&&!item.review)item.review={version:item.version,fingerprint:D.fingerprint(item),requestedAt:new Date().toISOString(),demoSeed:true};
  if(['approved','scheduled'].includes(item.status)&&!item.approval){
   item.review={version:item.version,fingerprint:D.fingerprint(item),requestedAt:new Date().toISOString(),demoSeed:true};
   item.approval={version:item.version,fingerprint:D.fingerprint(item),approvedAt:new Date().toISOString(),demoSeed:true};
  }
 }
}
function board(visible){
 seed(visible);
 return '<div class="flow-board-intro"><div><div class="section-eyebrow">ВИЗУАЛЬНЫЙ ПРОЦЕСС · ДЕМО</div><h2>От идеи до календаря</h2><p>Нажмите на карточку и пройдите следующие действия. Это не отправляет публикации и не меняет рабочие данные.</p></div><button class="soft-btn" type="button" data-action="flow-guide">Как пройти путь ↗</button></div>'+
 '<div class="flow-board" aria-label="Этапы производства контента">'+COLUMNS.map(([status,title,hint])=>{
  const matches=visible.filter(item=>item.status===status);
  return '<section class="flow-column flow-'+status+'"><div class="flow-column-head"><span class="flow-indicator"></span><h3>'+title+'</h3><b>'+matches.length+'</b></div><p class="flow-column-hint">'+hint+'</p><div class="flow-column-cards">'+(matches.length?matches.map(item=>
   '<button class="flow-board-card" type="button" data-action="flow-open" data-id="'+e(item.id)+'"><img src="'+e(item.img||IMG.coast)+'" alt=""><span class="flow-board-card-body"><strong>'+e(item.title)+'</strong><small>'+e(item.format)+' · '+e(item.channel)+' · версия '+item.version+'</small></span><span class="flow-card-arrow">↗</span></button>').join(''):'<div class="flow-column-empty">Нет материалов</div>')+'</div></section>';
 }).join('')+'</div>';
}
function btn(action,id,label,primary=false){
 return '<button class="'+(primary?'primary-btn':'soft-btn')+'" type="button" data-action="flow-'+action+'" data-id="'+e(id)+'">'+label+'</button>';
}
function panel(item){
 D.ensure(item);
 const list=D.issues(item),version=item.version,valid=D.isApproved(item),currentReview=item.review&&item.review.version===version&&item.review.fingerprint===D.fingerprint(item);
 let actions='';
 if(['draft','failed'].includes(item.status))actions+=btn('start',item.id,'Взять в работу',true);
 if(item.status==='production'){
  if(['Reels','Stories','Карусель'].includes(item.format)&&!item.img)actions+=btn('sample',item.id,'＋ Добавить демофото');
  actions+=btn('edit',item.id,'Редактировать');
  actions+=btn('submit',item.id,'Отправить на согласование',true);
 }
 if(item.status==='review'){
  actions+=btn('review',item.id,'Открыть замечания');
  actions+=btn('approve',item.id,'Одобрить эту версию',true);
  actions+=btn('return',item.id,'Вернуть на правки');
 }
 if(item.status==='approved'){
  actions+='<label class="field">Дата и время в календаре<input class="input" id="flow-schedule-date" type="datetime-local" value="'+e(localDatetime(offset(1,12)))+'"></label>';
  actions+=btn('schedule',item.id,'Запланировать',true);
  actions+=btn('return',item.id,'Вернуть на правки');
 }
 if(item.status==='scheduled'){
  actions+=btn('return',item.id,'Снять с плана и вернуть в работу');
  actions+='<p class="drawer-note">Материал внесён в демокалендарь на '+e(fmt(item.scheduledAt))+'. Соцсети ничего не получили.</p>';
 }
 if(item.status==='published')actions+='<p class="drawer-note">У демонстрационной карточки нет подтверждения реальной публикации.</p>';
 const warning=list.length?'<div class="flow-findings">'+list.map(text=>'<div class="flow-finding">! '+e(text)+'</div>').join('')+'</div>':'<div class="flow-findings flow-good">✓ Технические поля заполнены. Источники, права на медиа и актуальность фактов проверяются человеком.</div>';
 return '<div class="drawer-ey">ПРОИЗВОДСТВО · ДЕМОВЕРСИЯ</div><h2>'+e(item.title)+'</h2><p class="drawer-intro">'+e(project().name)+' · '+e(item.format)+' · '+e(item.channel)+'</p>'+
 '<img class="drawer-preview" src="'+e(item.img||IMG.coast)+'" alt="Демонстрационная обложка">'+status(item)+
 '<div class="flow-current"><span>Версия <strong>'+version+'</strong></span><span>'+(valid?'✓ Демо-согласование версии '+version:currentReview?'На согласовании версия '+version:'Нет действующего согласования')+'</span></div>'+
 '<div class="flow-mini-progress">'+D.STAGES.map((stage,i)=>'<span class="'+(stage===item.status?'active':D.STAGES.indexOf(item.status)>i?'done':'')+'">'+e(D.LABELS[stage])+'</span>').join('')+'</div>'+
 '<div class="drawer-subhead">Проверка перед следующим шагом</div>'+warning+
 '<div class="drawer-subhead">Следующее действие</div><div class="flow-actions">'+actions+'</div>'+
 (item.bundleId?'<button class="series-inline" type="button" data-action="series-open" data-id="'+e(item.bundleId)+'">▤ К остальным материалам серии ↗</button>':'')+'<div class="drawer-subhead">История демоматериала</div><div class="flow-history">'+(item.events.length?item.events.slice(0,7).map(h=>'<div><strong>Версия '+h.version+'</strong> '+e(h.desc)+'</div>').join(''):'<div>Материал добавлен в демонстрационную систему.</div>')+'</div>'+
 '<p class="drawer-note">Статусы и согласования в этом макете — только иллюстрация процесса. Подтверждения клиента и фактической публикации здесь нет.</p>';
}
function fail(msg){toast(msg);}
function change(item,action){
 try{
  if(action==='start')D.begin(item);
  else if(action==='sample')D.attachSample(item,sample);
  else if(action==='submit')D.requestReview(item);
  else if(action==='approve')D.approve(item);
  else if(action==='return')D.returnToWork(item);
  else if(action==='schedule')D.schedule(item,$('flow-schedule-date')?.value);
  else if(action==='edit'){openDrawer(item.id,'edit');return;}
  else if(action==='review'){openDrawer(item.id,'review');return;}
  else return;
  render();openDrawer(item.id,'pipeline');toast('Этап обновлён только в демоверсии.');
 }catch(err){fail(err.message||'Не удалось перейти к следующему этапу');}
}
function action(name,id){
 if(name==='guide'){
  closeDrawer();state.layout='board';state.view='production';state.filter='all';state.query='';render();
  toast('Откройте черновик на доске → «Взять в работу» → «Согласование» → «Одобрить» → «Запланировать».');
  return;
 }
 const item=byId(id);if(!item){fail('Материал этого клиента не найден');return;}
 if(name==='open'){seed([item]);openDrawer(id,'pipeline');return;}
 change(item,name);
}
root.CCV2FlowUI=Object.freeze({board,panel,seed,action});
})(typeof window==='undefined'?globalThis:window);
