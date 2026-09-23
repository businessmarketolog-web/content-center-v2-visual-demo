/* Visual grouping, status rollup and cross-card navigation. No write/publish API. */
(function(root){
'use strict';
const D=root.CCV2SeriesData,e=escapeHtml;
const LABELS={draft:'Черновик',production:'В работе',review:'Согласование',approved:'Одобрено (демо)',scheduled:'В календаре (демо)',failed:'Требует внимания',published:'Без подтверждения площадки'};
let selected=null;
function groups(){return D.derive(items(),state.clientId);}
function group(id){return D.forClient(items(),state.clientId,id);}
function open(id){if(!group(id)){toast('Серия этого клиента не найдена.');return;}if(!$('overlay').hidden)closeDrawer();selected={id,clientId:state.clientId};state.view='series';root.render();}
function back(){selected=null;state.view='series';root.render();}
function card(item){
 const validId=e(item.id),statusText=LABELS[item.status]||'Без статуса';
 return '<button class="series-material" data-action="series-material" data-id="'+validId+'" type="button">'+
 '<img src="'+e(item.img||IMG.coast)+'" alt=""><span class="series-material-body"><strong>'+e(item.title)+'</strong><small>'+e(item.channel)+' · '+e(item.format)+' · версия '+Number(item.version||1)+'</small></span>'+
 '<span class="series-state state-'+e(item.status)+'">'+e(statusText)+'</span><span class="series-chevron">↗</span></button>';
}
function detail(g){
 const percentage=Math.round(g.ready/g.total*100);
 return '<div class="series-titlebar"><div><div class="section-eyebrow">СЕРИЯ МАТЕРИАЛОВ · ДЕМО</div><h2>'+e(g.title)+'</h2><p>Один бриф — '+g.total+' независимых карточек. Каждая проходит собственную проверку и согласование.</p></div><button class="soft-btn" type="button" data-action="series-back">← Ко всем сериям</button></div>'+
 '<div class="series-summary"><div class="series-summary-head"><strong>Прогресс серии</strong><span>'+g.ready+' из '+g.total+' одобрено или внесено в демокалендарь</span></div>'+
 '<div class="series-progress-track" role="progressbar" aria-label="Готовность серии по статусам демоверсии" aria-valuemin="0" aria-valuemax="'+g.total+'" aria-valuenow="'+g.ready+'"><span style="width:'+percentage+'%"></span></div>'+
 '<div class="series-kpis"><span><b>'+g.work+'</b> В работе</span><span><b>'+g.review+'</b> На согласовании</span><span><b>'+g.ready+'</b> Одобрено / в плане</span></div></div>'+
 '<div class="series-detail-panel"><div class="series-detail-top"><div><div class="mini-label">МАТЕРИАЛЫ ОДНОЙ ЗАДАЧИ</div><h3>Откройте любой формат</h3></div><span class="status draft">'+g.total+' материала</span></div><div class="series-materials">'+g.cards.map(card).join('')+'</div></div>'+
 '<div class="note-panel"><strong>Как работать с серией:</strong> сначала доведите каждый формат до согласования в «Этапах», затем назначьте даты. Одобрение одного Reels не одобряет остальные карточки. Статусы в демоверсии не означают реальную отправку.</div>';
}
function overview(list){
 return '<div class="series-titlebar"><div><div class="section-eyebrow">КОНТЕНТ-ПРОИЗВОДСТВО · ДЕМО</div><h2>Серии материалов</h2><p>Все форматы одной идеи собраны вместе. Внутри — отдельные карточки, тексты, статусы и согласования.</p></div><button type="button" class="primary-btn" data-action="new">＋ Создать серию</button></div>'+
 '<div class="series-overview-grid">'+(list.length?list.map(g=>'<button type="button" class="series-overview-card" data-action="series-open" data-id="'+e(g.id)+'">'+
 '<div class="series-overview-top"><span class="series-icon">▤</span><span class="series-count">'+g.total+' формата(ов)</span></div><h3>'+e(g.title)+'</h3><p>'+e(g.channels.join(' · '))+' · '+e(g.formats.join(', '))+'</p>'+
 '<div class="series-progress-track"><span style="width:'+Math.round(g.ready/g.total*100)+'%"></span></div>'+
 '<div class="series-overview-foot"><span>'+g.ready+' готовы · '+g.review+' на согласовании</span><strong>Открыть серию ↗</strong></div></button>').join(''):
 '<div class="series-empty"><span class="series-empty-symbol">▤</span><strong>Серий пока нет</strong><p>Создайте задачу и выберите несколько форматов — здесь появится её общая карточка.</p><button type="button" class="primary-btn" data-action="new">＋ Создать первую серию</button></div>')+'</div>';
}
function render(){
 const list=groups(),g=selected?.clientId===state.clientId?group(selected.id):null;
 if(selected&&!g)selected=null;
 return g?detail(g):overview(list);
}
function dashboardTeaser(){
 const list=groups();
 if(!list.length)return '<div class="series-teaser"><div><span>▤</span><strong>Одна идея — несколько форматов</strong><small>Создайте задачу, чтобы связать Reels, Stories, посты и Telegram.</small></div><button class="soft-btn" type="button" data-nav="series">Серии ↗</button></div>';
 const g=list[0];
 return '<div class="series-teaser"><div><span>▤</span><strong>'+e(g.title)+'</strong><small>'+g.total+' связанных карточек · '+g.review+' на согласовании · '+g.ready+' в плане или одобрено</small></div><button class="soft-btn" data-action="series-open" data-id="'+e(g.id)+'" type="button">Открыть серию ↗</button></div>';
}
function action(name,id){
 if(name==='back'){back();return;}
 if(name==='open'){open(id);return;}
 if(name==='material'){
  const x=byId(id),g=selected?.clientId===state.clientId?group(selected.id):null;
  if(!g||!x||!g.cards.some(z=>z.id===x.id)){toast('Материал не относится к открытой серии этого клиента.');return;}
  CCV2FlowUI.seed([x]);openDrawer(x.id,'pipeline');return;
 }
}
root.CCV2SeriesUI=Object.freeze({render,dashboardTeaser,action,back});
if(typeof root.render==='function')root.render();
})(typeof window==='undefined'?globalThis:window);
