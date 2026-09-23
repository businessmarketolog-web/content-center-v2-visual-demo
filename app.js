'use strict';
const IMG={
  coast:'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=900&q=78',
  resort:'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=900&q=78',
  palms:'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=78',
  city:'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=900&q=78',
  nature:'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=900&q=78'
};
function offset(days,hour=11){
  const date=new Date();date.setDate(date.getDate()+days);date.setHours(hour,0,0,0);return date.toISOString();
}
const INITIAL=[
  {id:'atlas',name:'Атлас Тревел',initials:'AT',kind:'Туризм · демонстрационный клиент',items:[
    {id:'a1',title:'Обзор семейного курорта у моря',format:'Reels',channel:'Instagram',status:'review',caption:'Показываем территорию, пляж и семейные номера. Условия размещения уточняются.',img:IMG.resort,scheduledAt:offset(1,12),assignee:'Наташа',notes:'Клиент попросил заменить первый кадр.',comments:['Заменить обложку и проверить условия размещения.']},
    {id:'a2',title:'Пять идей для осеннего отпуска',format:'Карусель',channel:'Instagram',status:'production',caption:'Собрали пять идей для путешествия: море, природа и короткие поездки.',img:IMG.coast,scheduledAt:offset(2,17),assignee:'Наташа',notes:'Нужны финальные фотографии.',comments:[]},
    {id:'a3',title:'Чек-лист перед перелётом с ребёнком',format:'Пост',channel:'Telegram',status:'approved',caption:'Проверьте документы, багаж и необходимые вещи до вылета.',img:IMG.palms,scheduledAt:offset(3,10),assignee:'Владелец',notes:'Финальный текст подтверждён в демо.',comments:[]},
    {id:'a4',title:'Сторис: день на побережье',format:'Stories',channel:'Instagram',status:'draft',caption:'Короткая серия кадров с морем и прогулками.',img:'',scheduledAt:offset(4,11),assignee:'Наташа',notes:'Нужно добавить кадры.',comments:[]},
    {id:'a5',title:'Подборка городских маршрутов',format:'Пост',channel:'Telegram',status:'scheduled',caption:'Три идеи для прогулки по новому городу. Проверьте график работы мест перед поездкой.',img:IMG.city,scheduledAt:offset(5,9),assignee:'Владелец',notes:'План демонстрационный, реальная публикация не настроена.',comments:[]},
    {id:'a6',title:'Сроки и условия сезонной акции',format:'Пост',channel:'Instagram',status:'failed',caption:'Предложение действует до [указать дату]. Цена от 120 000 ₽.',img:IMG.nature,scheduledAt:offset(0,14),assignee:'Владелец',notes:'Демонстрационный статус ошибки. Ничего не отправлялось.',comments:[]},
    {id:'atlas-series-1',client_id:'atlas',bundleId:'atlas-autumn-demo',bundleTitle:'Осенний отдых у моря',title:'Осенний отдых у моря · Reels',format:'Reels',channel:'Instagram',status:'production',caption:'Ритм отпуска: море, неспешный завтрак и прогулки.',img:IMG.resort,scheduledAt:null,assignee:'Наташа',notes:'Одна демозадача на три формата. Для каждого нужен собственный просмотр.',comments:[]},
    {id:'atlas-series-2',client_id:'atlas',bundleId:'atlas-autumn-demo',bundleTitle:'Осенний отдых у моря',title:'Осенний отдых у моря · Stories',format:'Stories',channel:'Instagram',status:'review',caption:'Три коротких кадра: пляж, отель и прогулка.',img:IMG.palms,scheduledAt:null,assignee:'Наташа',notes:'Демосерия. Клиентские замечания относятся только к этой карточке.',comments:[]},
    {id:'atlas-series-3',client_id:'atlas',bundleId:'atlas-autumn-demo',bundleTitle:'Осенний отдых у моря',title:'Осенний отдых у моря · Пост',format:'Пост',channel:'Telegram',status:'approved',caption:'Небольшой план спокойного отдыха у моря.',img:IMG.coast,scheduledAt:null,assignee:'Владелец',notes:'Одобрено только в демоверсии, публикация не выполнена.',comments:[]}
  ]},
  {id:'studio',name:'Студия Форма',initials:'СФ',kind:'Дизайн · демонстрационный клиент',items:[
    {id:'b1',title:'Проект современной гостиной',format:'Карусель',channel:'Instagram',status:'production',caption:'Новый интерьер с мягким освещением и тёплым деревом.',img:IMG.nature,scheduledAt:offset(1,15),assignee:'Дизайнер',notes:'Ждём финальный рендер.',comments:[]},
    {id:'b2',title:'Как выбрать освещение для дома',format:'Пост',channel:'Telegram',status:'draft',caption:'Разбираем сценарии освещения для разных комнат.',img:'',scheduledAt:offset(4,13),assignee:'Владелец',notes:'Нужен черновик.',comments:[]}
  ]}
];
const nav=[
  {id:'dashboard',label:'Главная',mobile:'Главная',icon:'⌂'},
  {id:'production',label:'Материалы',mobile:'Материалы',icon:'▦'},
  {id:'calendar',label:'Календарь',mobile:'Календарь',icon:'◷'},
  {id:'approvals',label:'Согласование',mobile:'Соглас.',icon:'✓'},
  {id:'library',label:'Медиатека',mobile:'Медиа',icon:'▧'},
  {id:'series',label:'Серии материалов',mobile:'Серии',icon:'▤'},
  {id:'results',label:'Результаты',mobile:'Результаты',icon:'↗'},
  {id:'settings',label:'Настройки',mobile:'Настройки',icon:'⚙'}
];
const statusLabel={draft:'Черновик',production:'В работе',review:'Согласование',approved:'Одобрено',scheduled:'Запланировано',published:'Опубликовано',failed:'Ошибка'};
const statusOrder={failed:0,review:1,production:2,approved:3,scheduled:4,draft:5,published:6};
const state={projects:structuredClone(INITIAL),clientId:'atlas',view:'dashboard',filter:'all',query:'',layout:'grid',dayOffset:0,drawer:null,lastFocus:null};
const $=id=>document.getElementById(id);
const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const project=()=>state.projects.find(p=>p.id===state.clientId);
const items=()=>project().items;
const byId=id=>items().find(x=>x.id===id);
const fmt=date=>date?new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}).format(new Date(date)):'Без даты';
const dayLabel=date=>new Intl.DateTimeFormat('ru-RU',{weekday:'short',day:'numeric',month:'short'}).format(date);
function toast(message){
 const node=$('toast');node.textContent=message;node.hidden=false;
 clearTimeout(toast._timeout);toast._timeout=setTimeout(()=>node.hidden=true,3800);
}
function setView(view){
 if(!nav.some(x=>x.id===view))return;
 state.view=view;state.query='';state.filter='all';render();window.scrollTo({top:0,behavior:'instant'});
}
function setClient(){
 const idx=state.projects.findIndex(p=>p.id===state.clientId);state.clientId=state.projects[(idx+1)%state.projects.length].id;state.filter='all';state.query='';state.dayOffset=0;
 closeDrawer();render();toast('Демо-клиент изменён. Данные проектов не смешиваются.');
}
function renderNav(){
 const review=items().filter(x=>x.status==='review').length;
 $('side-nav').innerHTML=nav.map(n=>'<button type="button" data-nav="'+n.id+'" class="nav-btn '+(state.view===n.id?'active':'')+'" aria-current="'+(state.view===n.id?'page':'false')+'"><span class="nav-ico" aria-hidden="true">'+n.icon+'</span>'+n.label+(n.id==='approvals'&&review?'<span class="nav-count">'+review+'</span>':'')+'</button>').join('');
 $('mobile-nav').innerHTML=nav.slice(0,4).map(n=>'<button type="button" data-nav="'+n.id+'" class="mobile-tab '+(state.view===n.id?'active':'')+'" aria-current="'+(state.view===n.id?'page':'false')+'"><span aria-hidden="true">'+n.icon+'</span>'+n.mobile+'</button>').join('')+'<button type="button" data-action="more" class="mobile-tab '+(['library','series','results','settings'].includes(state.view)?'active':'')+'" aria-label="Дополнительные разделы"><span aria-hidden="true">⋯</span>Ещё</button>';
 const p=project();$('side-avatar').textContent=p.initials;$('side-client-name').textContent=p.name;
}
function image(item){return item.img||IMG.coast;}
function status(item){return '<span class="status '+escapeHtml(item.status)+'">'+(statusLabel[item.status]||'Без статуса')+'</span>';}
function renderDashboard(){
 const all=items(),review=all.filter(x=>x.status==='review').length;
 const failed=all.filter(x=>x.status==='failed').length;
 const approved=all.filter(x=>x.status==='approved').length;
 const planned=all.filter(x=>x.scheduledAt&&new Date(x.scheduledAt)>new Date()&&new Date(x.scheduledAt)-new Date()<7*86400000&&x.status!=='published').length;
 const priority=all.filter(x=>x.status!=='published').slice().sort((a,b)=>(statusOrder[a.status]??8)-(statusOrder[b.status]??8)).slice(0,4);
 const week=all.filter(x=>x.scheduledAt&&new Date(x.scheduledAt)>new Date()).slice().sort((a,b)=>new Date(a.scheduledAt)-new Date(b.scheduledAt)).slice(0,3);
 const today=new Date(),month=today.getMonth(),year=today.getFullYear(),first=new Date(year,month,1).getDay(),offset=(first+6)%7,days=new Date(year,month+1,0).getDate();
 const cells=Array.from({length:offset},()=>'<span></span>');
 for(let d=1;d<=days;d++){const has=all.some(x=>x.scheduledAt&&new Date(x.scheduledAt).getDate()===d&&new Date(x.scheduledAt).getMonth()===month);cells.push('<button class="mini-day '+(has?'has ':'')+(d===today.getDate()?'today':'')+'" data-action="calendar-day" data-day="'+d+'" title="Открыть календарь">'+d+'</button>');}
 return '<div class="dashboard-hero"><div class="hero-copy"><div class="hero-label">ВАШ КОНТЕНТ · В ОДНОМ МЕСТЕ</div><h2>Управляйте идеями.<br>Не теряйте важное.</h2><p>Клиент: '+escapeHtml(project().name)+'. От первой задачи до одобрения — без десятка отдельных таблиц.</p><button type="button" data-action="new" class="hero-btn">＋ Создать материал</button> <button type="button" data-action="switch-client" class="hero-btn" style="background:transparent;color:#d3f4ec">Сменить клиента ↗</button></div><div class="hero-art" aria-hidden="true"></div></div>'+
 '<div class="metric-grid">'+[
 ['Нужны действия',failed,'failed','alert','!'],['На согласовании',review,'review','','✓'],['Готово к выходу',approved,'approved','','↗'],['План на 7 дней',planned,'all','','◷']
 ].map(v=>'<button type="button" class="metric-card '+v[3]+'" data-action="metric" data-filter="'+v[2]+'"><span class="metric-top">'+v[0]+'<span class="metric-icon">'+v[4]+'</span></span><span class="metric-num">'+v[1]+'</span><span class="metric-note">Нажмите, чтобы посмотреть →</span></button>').join('')+'</div>'+
 (typeof CCV2SeriesUI==='undefined'?'':CCV2SeriesUI.dashboardTeaser())+'<div class="dashboard-cols"><section class="panel"><div class="panel-head"><div><div class="mini-label">ПРИОРИТЕТЫ НА СЕГОДНЯ</div><h3>Очередь материалов</h3></div><button class="panel-action" data-nav="production">Все материалы ↗</button></div><div class="task-list">'+(priority.map(x=>'<button class="task-card" data-action="open" data-id="'+escapeHtml(x.id)+'"><img class="task-thumb" src="'+escapeHtml(image(x))+'" alt=""><span class="task-body"><strong class="task-title">'+escapeHtml(x.title)+'</strong><small class="task-meta"><span class="status-dot"></span>'+escapeHtml(x.format)+' · '+escapeHtml(x.channel)+' · '+fmt(x.scheduledAt)+'</small></span>'+status(x)+'<span class="task-arrow">↗</span></button>').join('')||'<div class="empty"><strong>Пока всё готово</strong>Создайте новый материал.</div>')+'</div></section>'+
 '<div><section class="panel"><div class="panel-head"><div><div class="mini-label">ПРОИЗВОДСТВЕННЫЙ ЦИКЛ</div><h3>На что обратить внимание</h3></div></div>'+[
 ['Согласование','Материалы ожидают решения',review,'approvals','✓'],['Подготовка','Открытые черновики',all.filter(x=>x.status==='draft'||x.status==='production').length,'production','▤'],['Публикация','Готово к отправке (демо)',approved,'calendar','↗']
 ].map(row=>'<button type="button" class="check-row" data-nav="'+row[3]+'" style="background:transparent;border-left:0;border-right:0;border-bottom:0;width:100%;text-align:left"><span class="check-icon">'+row[4]+'</span><span class="check-copy"><strong>'+row[0]+'</strong><small>'+row[1]+'</small></span><span class="pill-count">'+row[2]+'</span></button>').join('')+'</section><section class="panel"><div class="panel-head"><div><div class="mini-label">БЛИЖАЙШИЕ ПУБЛИКАЦИИ</div><h3>В календаре</h3></div><button class="link-btn" data-nav="calendar">Открыть ↗</button></div>'+week.map(x=>'<button type="button" class="check-row" data-action="open" data-id="'+escapeHtml(x.id)+'" style="background:transparent;border-left:0;border-right:0;border-bottom:0;width:100%;text-align:left"><span class="check-icon">◷</span><span class="check-copy"><strong>'+escapeHtml(x.title)+'</strong><small>'+fmt(x.scheduledAt)+' · '+escapeHtml(x.channel)+'</small></span><span class="task-arrow">↗</span></button>').join('')+'</section></div></div>';
}
function card(x){
 return '<article class="material-card"><img class="material-image" src="'+escapeHtml(image(x))+'" alt=""><div class="material-card-body"><div>'+status(x)+'</div><div class="material-title">'+escapeHtml(x.title)+'</div>'+(x.bundleId?'<span class="wizard-related-badge">↔ Из серии материалов</span>':'')+'<div class="material-sub">'+escapeHtml(x.format)+' · '+escapeHtml(x.channel)+' · '+fmt(x.scheduledAt)+'</div><div class="material-foot"><span class="material-sub">'+escapeHtml(x.assignee||'Без исполнителя')+'</span><button type="button" data-action="open" data-id="'+escapeHtml(x.id)+'">Открыть ↗</button></div></div></article>';
}
function renderProduction(){
 const shown=items().filter(x=>(state.filter==='all'||x.status===state.filter)&&(x.title+' '+x.channel+' '+x.format).toLowerCase().includes(state.query.toLowerCase()));
 return '<div class="section-head"><div><div class="section-eyebrow">КАРТОЧКИ МАТЕРИАЛОВ</div><h2>Всё, что находится в работе</h2><p class="subtext">Один материал — одна карточка. Нажмите, чтобы отредактировать и проверить.</p></div><button class="primary-btn" data-action="new">＋ Новый материал</button></div>'+
 '<div class="toolbar"><div class="toolbar-left"><input id="material-search" class="input search-input" type="search" value="'+escapeHtml(state.query)+'" placeholder="Поиск по материалам…" aria-label="Поиск материалов"><select id="material-filter" class="select" aria-label="Статус"><option value="all">Все статусы</option>'+Object.keys(statusLabel).map(k=>'<option value="'+k+'" '+(k===state.filter?'selected':'')+'>'+statusLabel[k]+'</option>').join('')+'</select></div><div class="segmented" role="group" aria-label="Вид материалов"><button class="seg-btn '+(state.layout==='grid'?'active':'')+'" data-action="layout" data-layout="grid">▦ Карточки</button><button class="seg-btn '+(state.layout==='list'?'active':'')+'" data-action="layout" data-layout="list">≡ Список</button><button class="seg-btn '+(state.layout==='board'?'active':'')+'" data-action="layout" data-layout="board">◫ Этапы</button></div></div>'+
 (state.layout==='board'?CCV2FlowUI.board(shown):shown.length?'<div class="'+(state.layout==='grid'?'material-grid':'list-view')+'">'+shown.map(card).join('')+'</div>':'<div class="empty"><strong>Ничего не найдено</strong>Попробуйте другой фильтр или создайте материал.</div>');
}
function renderCalendar(){
 const anchor=new Date();anchor.setDate(anchor.getDate()+state.dayOffset);anchor.setHours(0,0,0,0);
 const start=new Date(anchor);start.setDate(start.getDate()-((start.getDay()+6)%7));
 return '<div class="section-head"><div><div class="section-eyebrow">ПЛАНИРОВАНИЕ</div><h2>Неделя публикаций</h2><p class="subtext">Это план, а не подтверждение реальной отправки в соцсети.</p></div><div class="toolbar-right"><button class="soft-btn" data-action="week-prev">←</button><button class="soft-btn" data-action="week-today">Сегодня</button><button class="soft-btn" data-action="week-next">→</button></div></div>'+
 '<div class="note-panel">Публикации в этом макете не отправляются в Instagram или Telegram. Календарь можно листать и открывать материалы.</div>'+
 '<div class="week-columns">'+Array.from({length:7},(_,i)=>{const date=new Date(start);date.setDate(start.getDate()+i);const events=items().filter(x=>x.scheduledAt&&new Date(x.scheduledAt).toDateString()===date.toDateString());return '<div class="week-col"><h3>'+new Intl.DateTimeFormat('ru-RU',{weekday:'long'}).format(date)+'<span>'+dayLabel(date)+'</span></h3>'+events.map(x=>'<button type="button" class="week-event" data-action="open" data-id="'+escapeHtml(x.id)+'"><strong>'+escapeHtml(x.title)+'</strong><small>'+fmt(x.scheduledAt)+' · '+escapeHtml(x.channel)+'</small></button>').join('')+'</div>';}).join('')+'</div>';
}
function renderApprovals(){
 const list=items().filter(x=>x.status==='review'||x.status==='approved');
 return '<div class="section-head"><div><div class="section-eyebrow">СОГЛАСОВАНИЕ</div><h2>Решения по материалам</h2><p class="subtext">Попробуйте открыть материал, добавить замечание или одобрить его в деморежиме.</p></div></div>'+
 '<div class="note-panel">Демо-клиент не получает настоящую ссылку на согласование. Действия ниже меняют только содержимое этой страницы.</div>'+
 '<section class="panel"><div class="panel-head"><h3>Материалы на рассмотрении</h3><span class="status review">'+list.length+' шт.</span></div>'+(list.length?list.map(x=>'<div class="approval-row"><img src="'+escapeHtml(image(x))+'" alt=""><div><strong>'+escapeHtml(x.title)+'</strong><small>'+escapeHtml(x.channel)+' · '+escapeHtml(x.format)+' · '+statusLabel[x.status]+'</small></div><button type="button" data-action="review" data-id="'+escapeHtml(x.id)+'">Посмотреть ↗</button></div>').join(''):'<div class="empty"><strong>Нет материалов на согласовании</strong>Попробуйте перевести черновик в этот статус.</div>')+'</section>';
}
function renderLibrary(){
 const media=items().filter(x=>Boolean(x.img));
 return '<div class="section-head"><div><div class="section-eyebrow">МЕДИАТЕКА</div><h2>Материалы для контента</h2><p class="subtext">Демонстрационные изображения для '+escapeHtml(project().name)+'.</p></div><button type="button" class="soft-btn" data-action="upload">＋ Добавить медиа</button></div>'+
 '<div class="note-panel">Загрузка файлов в демоверсии отключена, чтобы ничего не отправлять в рабочую медиатеку. Можно открыть связанную карточку.</div><div class="media-grid">'+media.map(x=>'<button class="media-item" data-action="open" data-id="'+escapeHtml(x.id)+'"><img src="'+escapeHtml(image(x))+'" alt=""><div>'+escapeHtml(x.title)+'<small>Используется в '+escapeHtml(x.format)+' · '+escapeHtml(x.channel)+'</small></div></button>').join('')+'</div>';
}
function renderResults(){
 return '<div class="section-head"><div><div class="section-eyebrow">АНАЛИТИКА</div><h2>Публикации и результаты</h2><p class="subtext">Раздел показывает, какие данные нужны для настоящей аналитики.</p></div></div>'+
 '<div class="note-panel"><strong>Данные площадок не подключены.</strong> Визуальная демоверсия не придумывает охваты, переходы, заявки и бронирования. После интеграции здесь появятся подтверждённые показатели.</div>'+
 '<div class="stat-blocks"><div class="stat-block"><small>Публикации с ответом площадки</small><strong>—</strong><small>Требуется интеграция Instagram / Telegram</small></div><div class="stat-block"><small>Заявки из контента</small><strong>—</strong><small>Нужна связь с источником обращений</small></div><div class="stat-block"><small>Охват и вовлечённость</small><strong>—</strong><small>Только фактическая статистика</small></div></div>';
}
function renderSettings(){
 return '<div class="section-head"><div><div class="section-eyebrow">НАСТРОЙКИ ПРОЕКТА</div><h2>'+escapeHtml(project().name)+'</h2><p class="subtext">Правила бренда и интеграции будут привязаны к конкретному клиенту.</p></div><button type="button" class="soft-btn" data-action="switch-client">Выбрать клиента ↗</button><button type="button" class="primary-btn" data-action="new-client">＋ Создать клиента</button></div>'+
 '<div class="dashboard-cols"><section class="panel"><div class="panel-head"><h3>Профиль клиента</h3></div><div class="check-row"><span class="check-icon">◇</span><span class="check-copy"><strong>Название</strong><small>'+escapeHtml(project().name)+'</small></span></div><div class="check-row"><span class="check-icon">✳</span><span class="check-copy"><strong>Направление</strong><small>'+escapeHtml(project().kind)+'</small></span></div><div class="check-row"><span class="check-icon">▤</span><span class="check-copy"><strong>Бренд-правила</strong><small>В реальном проекте подтягиваются из карточки клиента</small></span></div></section><div><section class="panel"><div class="panel-head"><h3>Подключения</h3></div><div class="check-row"><span class="check-icon">↗</span><span class="check-copy"><strong>Instagram</strong><small>В демоверсии отключён</small></span><span class="status draft">Демо</span></div><div class="check-row"><span class="check-icon">◉</span><span class="check-copy"><strong>Telegram</strong><small>В демоверсии отключён</small></span><span class="status draft">Демо</span></div></section></div></div>';
}
function render(){
 renderNav();
 const current=nav.find(n=>n.id===state.view);
 $('breadcrumb').textContent=(current?current.label:'Главная').toUpperCase();
 $('page-title').textContent=state.view==='dashboard'?'Сегодня в работе':current.label;
 $('view').innerHTML=({dashboard:renderDashboard,production:renderProduction,calendar:renderCalendar,approvals:renderApprovals,library:renderLibrary,results:renderResults,settings:renderSettings,series:()=>CCV2SeriesUI.render()}[state.view]||renderDashboard)();
}


function field(name,label,value='',kind='text',options=null){
  if(kind==='textarea')return '<label class="field">'+label+'<textarea class="textarea" name="'+name+'" rows="4">'+escapeHtml(value)+'</textarea></label>';
  if(kind==='select')return '<label class="field">'+label+'<select class="select" name="'+name+'">'+options.map(v=>'<option value="'+escapeHtml(v)+'" '+(v===value?'selected':'')+'>'+escapeHtml(statusLabel[v]||v)+'</option>').join('')+'</select></label>';
  return '<label class="field">'+label+'<input class="input" name="'+name+'" type="'+kind+'" value="'+escapeHtml(value)+'" '+(name==='title'?'required maxlength="160"':'')+'></label>';
}
function localDatetime(date){
  if(!date)return '';
  const d=new Date(date);if(Number.isNaN(d.getTime()))return '';
  const tz=new Date(d.getTime()-d.getTimezoneOffset()*60000);
  return tz.toISOString().slice(0,16);
}
function formHtml(item){
  const editing=Boolean(item);
  const prefill=state.drawer?.staged||{};
  const draft=item||{title:'',caption:'',format:'Пост',channel:'Instagram',status:'draft',img:'',scheduledAt:offset(1),assignee:'Владелец',notes:''};
  return '<div class="drawer-ey">'+(editing?'РЕДАКТИРОВАНИЕ · ДЕМО':'НОВЫЙ МАТЕРИАЛ · ДЕМО')+'</div><h2>'+ (editing?'Карточка материала':'Новый материал')+'</h2><p class="drawer-intro">Изменения появятся в демоверсии, но не будут сохранены в рабочей системе. После обновления страницы демоданные восстановятся.</p>'+
    '<form id="material-form" class="form">'+field('title','Название',prefill.title??draft.title)+
    '<div class="form-two">'+field('format','Формат',draft.format,'select',['Reels','Stories','Карусель','Пост'])+field('channel','Площадка',draft.channel,'select',['Instagram','Telegram'])+'</div>'+
    field('caption','Текст публикации',prefill.caption??draft.caption,'textarea')+
    field('notes','Бриф и примечания',prefill.brief??draft.notes,'textarea')+
    '<div class="form-two">'+field('status','Режим редактирования',['draft','production'].includes(draft.status)?draft.status:'production','select',['draft','production'])+'</div>'+
    '<p class="drawer-note">Здесь доступны черновик и работа над материалом. Для согласования, одобрения и планирования откройте «Материалы → Этапы» — там проверяются правила переходов.</p>'+
    '<div class="drawer-actions"><button type="button" class="soft-btn" data-action="close">Отмена</button><button type="submit" class="primary-btn">Сохранить в демо</button></div></form>';
}
function qa(item){return CCV2FlowData.issues(item);}
function detailHtml(item){
 const list=qa(item);return '<div class="drawer-ey">КАРТОЧКА МАТЕРИАЛА · ДЕМО</div><h2>'+escapeHtml(item.title)+'</h2><p class="drawer-intro">'+escapeHtml(project().name)+' · '+escapeHtml(item.channel)+' · '+escapeHtml(item.format)+' · '+fmt(item.scheduledAt)+'</p><img class="drawer-preview" src="'+escapeHtml(image(item))+'" alt="Демонстрационный визуал материала">'+status(item)+
 '<div class="flow-steps"><div class="flow-step '+(item.status==='draft'?'current':'')+'">Черновик</div><div class="flow-step '+(item.status==='production'?'current':'')+'">В работе</div><div class="flow-step '+(item.status==='review'?'current':'')+'">Согласование</div><div class="flow-step '+(['approved','scheduled','published'].includes(item.status)?'current':'')+'">Готово</div></div>'+
 (item.bundleId?'<button class="series-inline" type="button" data-action="series-open" data-id="'+escapeHtml(item.bundleId)+'">▤ Открыть всю серию материалов ↗</button>':'')+'<div class="drawer-subhead">Текст публикации</div><p style="font-size:12px;line-height:1.8;white-space:pre-wrap">'+escapeHtml(item.caption||'Текст пока не добавлен')+'</p>'+
 '<div class="drawer-subhead">Задача / примечания</div><p class="drawer-intro">'+escapeHtml(item.notes||'Нет дополнительных комментариев')+'</p>'+
 '<div class="drawer-subhead">Предпроверка</div><div class="drawer-note">'+(list.length?'Обнаружено замечаний: '+list.length+'.':'Технических замечаний не обнаружено.')+' Факты и права использования медиа необходимо подтверждать отдельно.</div>'+
 '<div class="drawer-actions"><button class="primary-btn" type="button" data-action="edit" data-id="'+escapeHtml(item.id)+'">Редактировать</button><button class="soft-btn" type="button" data-action="check" data-id="'+escapeHtml(item.id)+'">Проверить</button><button class="soft-btn" type="button" data-action="handoff" data-id="'+escapeHtml(item.id)+'">ChatGPT → карточка</button></div>'+
 '<div class="drawer-actions">'+(item.status==='review'?'<button class="soft-btn" data-action="review" data-id="'+escapeHtml(item.id)+'">Посмотреть согласование</button>':'')+
 '<button class="soft-btn" type="button" data-action="flow-open" data-id="'+escapeHtml(item.id)+'">Этапы производства ↗</button><button class="soft-btn" type="button" data-action="publish" data-id="'+escapeHtml(item.id)+'">Проверить публикацию ↗</button></div>';
}
function checkHtml(item){
 const issues=qa(item);
 return '<div class="drawer-ey">КОНТРОЛЬ КАЧЕСТВА · ДЕМО</div><h2>Предпроверка материала</h2><p class="drawer-intro">'+escapeHtml(item.title)+'</p>'+
 '<div class="drawer-note">Это техническая проверка перед отправкой на согласование: без запросов к площадкам и без автоматического подтверждения цен, дат или фактов.</div>'+
 '<div class="check-list">'+(issues.length?issues.map(t=>'<div class="check-item"><span class="check-symbol">◌</span><span>'+escapeHtml(t)+'</span></div>').join(''):'<div class="check-item ok"><span class="check-symbol">✓</span><span>Обязательные поля заполнены. Достоверность сведений и права использования медиа ещё нужно проверить.</span></div>')+'</div>'+
 '<div class="drawer-actions"><button class="primary-btn" data-action="edit" data-id="'+escapeHtml(item.id)+'">Открыть редактор</button><button class="soft-btn" data-action="open" data-id="'+escapeHtml(item.id)+'">Назад к материалу</button></div>';
}
function approvalHtml(item){
 const comments=item.comments||[];
 return '<div class="drawer-ey">СОГЛАСОВАНИЕ · ДЕМО</div><h2>Обсуждение материала</h2><p class="drawer-intro">'+escapeHtml(item.title)+' · '+escapeHtml(project().name)+'</p><img class="drawer-preview" src="'+escapeHtml(image(item))+'" alt="">'+status(item)+
 '<div class="drawer-subhead">Комментарии</div>'+(comments.length?comments.map(t=>'<div class="check-item"><span class="check-symbol">●</span><span>'+escapeHtml(t)+'</span></div>').join(''):'<p class="drawer-note">Комментариев пока нет. Добавьте тестовое замечание.</p>')+
 '<form id="comment-form" class="form" style="margin-top:14px"><label class="field">Новое замечание<textarea class="textarea" name="comment" placeholder="Например: заменить первый кадр" required maxlength="500"></textarea></label><button type="submit" class="soft-btn">Добавить замечание</button></form>'+
 '<div class="drawer-actions">'+(item.status==='review'?'<button class="primary-btn" data-action="approve" data-id="'+escapeHtml(item.id)+'">Одобрить в демо</button>':'')+'<button class="soft-btn" data-action="open" data-id="'+escapeHtml(item.id)+'">Назад к карточке</button></div>'+
 '<p class="drawer-note">Одобрение относится к текущей демоверсии материала и отменяется при изменении текста, формата или изображения. Реальных ссылок клиентам и юридически значимого согласия здесь нет.</p>';
}
function handoffHtml(item){
 if(!['draft','production'].includes(item.status))return '<div class="drawer-ey">CHATGPT → КАРТОЧКА</div><h2>Редактирование недоступно</h2><p class="drawer-intro">Для согласованных и запланированных материалов сначала требуется новый цикл согласования. В демоверсии выбирайте черновик или материал в работе.</p><button class="primary-btn" data-action="open" data-id="'+escapeHtml(item.id)+'">Назад к материалу</button>';
 const ticket={schema:'content-center-handoff/1',request_id:crypto.randomUUID(),client_id:state.clientId,content_item_id:item.id};
 state.drawer.ticket=ticket;state.drawer.staged=null;
 const prompt='Подготовь правки к СУЩЕСТВУЮЩЕМУ материалу Content Center. Не создавай клиента или новую карточку. Клиент: '+project().name+'. Название: '+item.title+'. Исходный текст: '+item.caption+'. Бриф: '+item.notes+'. Верни только JSON следующего формата (только изменённые поля): '+JSON.stringify({...ticket,changes:{title:'Если нужно: новый заголовок',caption:'Новый текст',brief:'Уточнённый бриф'}})+'. Не добавляй новых ID, статусов или медиа. Проверяй факты по первоисточникам.';
 state.drawer.prompt=prompt;
 return '<div class="drawer-ey">РЕДАКТИРОВАНИЕ · ДЕМО</div><h2>ChatGPT → карточка</h2><p class="drawer-intro">Попробуйте сценарий: задание → ответ → предварительный просмотр → редактор существующего материала. В демоверсии нет автоматической синхронизации.</p>'+
 '<div class="drawer-note"><strong>Выбранный материал:</strong> '+escapeHtml(item.title)+'<br><strong>Клиент:</strong> '+escapeHtml(project().name)+'</div>'+
 '<div class="drawer-subhead">1. Задание для ChatGPT</div><textarea id="handoff-prompt" class="json-box" readonly aria-label="Задание для ChatGPT">'+escapeHtml(prompt)+'</textarea><div class="drawer-actions"><button class="soft-btn" data-action="copy-prompt">Скопировать задание</button></div>'+
 '<div class="drawer-subhead">2. Ответ ChatGPT</div><p class="drawer-intro">Можно вставить JSON из ChatGPT или нажать «Вставить пример», чтобы проверить сценарий без переключения приложений.</p><textarea id="handoff-reply" class="json-box" aria-label="Ответ ChatGPT в JSON" placeholder="{ ... }"></textarea>'+
 '<div class="drawer-actions"><button class="soft-btn" data-action="sample-reply">Вставить пример</button><button class="soft-btn" data-action="check-reply">Проверить ответ</button></div><div id="handoff-result" aria-live="polite"></div>';
}
function moreHtml(){
 return '<div class="drawer-ey">НАВИГАЦИЯ · ДЕМО</div><h2>Разделы Content Center</h2><p class="drawer-intro">Все вкладки доступны и на iPhone.</p>'+nav.slice(4).map(x=>'<button class="check-row" type="button" data-action="go-more" data-view="'+x.id+'" style="width:100%;border-left:0;border-right:0;border-bottom:0;background:transparent;text-align:left"><span class="check-icon">'+x.icon+'</span><span class="check-copy"><strong>'+x.label+'</strong><small>Открыть раздел →</small></span></button>').join('')+'<button class="soft-btn" data-action="client-picker" style="width:100%;margin-top:18px">Выбрать клиента ↗</button><button class="primary-btn" data-action="new-client">＋ Создать клиента</button>';
}
function guideHtml(){
 return '<div class="drawer-ey">ЗНАКОМСТВО С V2</div><h2>Попробуйте новый Content Center</h2><p class="drawer-intro">Это работающий интерактивный макет с вымышленными данными. Все действия ограничены этой страницей.</p>'+
 [['01','Создайте демо-клиента','На ПК нажмите на название клиента слева; на iPhone откройте «Ещё» → «Выбрать клиента» → «Создать клиента». Пройдите четыре шага, выбирая несколько целей, площадок и форматов.'],['02','Поставьте первую задачу','После создания клиента автоматически откроется мастер материала. Выберите Instagram и Telegram, а затем Reels, Пост и Stories: на проверке увидите четыре отдельные карточки.'],['03','Откройте материал','На главной нажмите первую карточку из очереди, чтобы увидеть редактор и статусы.'],['04','Проверьте готовность','Откройте «Материалы», выберите карточку и нажмите «Проверить».'],['05','Попробуйте ChatGPT → карточка','Откройте черновик, выберите этот сценарий и нажмите «Вставить пример» — увидите, как правки попадают в редактор.'],['06','Пройдите этапы производства','В разделе «Материалы» переключите вид на «Этапы». Откройте черновик → возьмите в работу → проверьте → согласуйте текущую версию → назначьте дату. После изменения одобренного текста согласование сбросится.'],['07','Посмотрите серию материалов','На iPhone откройте «Ещё» → «Серии материалов», на ПК — одноимённый раздел слева. Откройте серию «Осенний отдых у моря» и выберите один из форматов. Одобрение одного материала не утверждает остальные.'],['08','Переключите клиента и проверьте календарь','Проверьте, что другие клиенты и их материалы не смешиваются, а запланированная демоверсия появляется в календаре. Никаких публикаций в соцсети не происходит.']].map(row=>'<div class="tour-tip"><span class="tour-num">'+row[0]+'</span><div><strong>'+row[1]+'</strong><p>'+row[2]+'</p></div></div>').join('')+
 '<div class="drawer-actions"><button class="primary-btn" data-action="close">Начать просмотр</button><button class="soft-btn" data-action="production">Открыть материалы</button></div>';
}
function openDrawer(id=null,mode='detail'){
 const item=id?byId(id):null;
 if(id&&!item)return toast('Материал другого проекта недоступен.');
 state.lastFocus=(!state.drawer&&document.activeElement instanceof HTMLElement)?document.activeElement:state.lastFocus;
 state.drawer={id:item?.id||null,mode,ticket:null,staged:null,prompt:null};
 let content;
 if(mode==='new')content=formHtml(null);
 else if(mode==='guide')content=guideHtml();
 else if(mode==='more')content=moreHtml();
 else if(mode==='edit')content=formHtml(item);
 else if(mode==='check')content=checkHtml(item);
 else if(mode==='review')content=approvalHtml(item);
 else if(mode==='pipeline')content=CCV2FlowUI.panel(item);
 else if(mode==='handoff')content=handoffHtml(item);
 else content=detailHtml(item);
 $('overlay').innerHTML='<section class="drawer" role="dialog" aria-modal="true" aria-label="'+(mode==='new'?'Создание материала':'Просмотр материала')+'"><div class="drawer-head"><div><span class="drawer-ey">CONTENT CENTER V2</span><h2 style="margin-bottom:0">Рабочая карточка</h2></div><button type="button" class="close-btn" data-action="close" aria-label="Закрыть">×</button></div>'+content+'</section>';
 $('overlay').hidden=false;
 document.body.style.overflow='hidden';
 $('overlay').querySelector('.close-btn').focus();
}
function closeDrawer(){
 $('overlay').hidden=true;$('overlay').innerHTML='';state.drawer=null;
 document.body.style.overflow='';
 if(state.lastFocus&&state.lastFocus.isConnected)state.lastFocus.focus();
 state.lastFocus=null;
}


function demoReply(item,ticket){
 return { ...ticket,changes:{title:item.title+' — обновлённая версия',caption:(item.caption||'Новый материал')+'\n\nВариант после редактирования в ChatGPT. Проверить факты перед согласованием.'}};
}
function handleAction(button){
 const action=button.dataset.action,id=button.dataset.id;
 if(action==='close'){closeDrawer();return;}
 if(action==='new'){CCV2Wizard.openMaterials();return;}
 if(action==='new-client'){CCV2Wizard.openClient();return;}
 if(action==='client-picker'){CCV2Wizard.openClients();return;}
 if(action==='wizard-new-client'||action==='wizard-back'||action==='wizard-select-client'){CCV2Wizard.action(action,button);return;}
 if(action==='more'){openDrawer(null,'more');return;}
 if(action==='go-more'){closeDrawer();setView(button.dataset.view);return;}
 if(action==='open'){openDrawer(id);return;}
 if(action==='edit'){openDrawer(id,'edit');return;}
 if(action==='check'){openDrawer(id,'check');return;}
 if(action==='review'){openDrawer(id,'review');return;}
 if(action==='handoff'){openDrawer(id,'handoff');return;}
 if(action==='guide'){openDrawer(null,'guide');return;}
 if(action==='production'){closeDrawer();setView('production');return;}
 if(action==='switch-client'){CCV2Wizard.openClients();return;}
 if(action==='week-prev'){state.dayOffset-=7;render();return;}
 if(action==='week-next'){state.dayOffset+=7;render();return;}
 if(action==='week-today'){state.dayOffset=0;render();return;}
 if(action==='calendar-day'){state.dayOffset=Number(button.dataset.day)-new Date().getDate();setView('calendar');return;}
 if(action==='metric'){state.filter=button.dataset.filter||'all';state.view='production';render();return;}
 if(action==='layout'){state.layout=['list','board'].includes(button.dataset.layout)?button.dataset.layout:'grid';render();return;}
 if(['series-open','series-back','series-material'].includes(action)){CCV2SeriesUI.action(action.slice(7),id);return;}
 if(action==='flow-open'||action==='flow-guide'||action.startsWith('flow-')){CCV2FlowUI.action(action.slice(5),id);return;}
 if(action==='upload'){toast('Демо: загрузка файлов отключена, рабочая медиатека не затрагивается.');return;}
 if(action==='publish'){toast('Это макет. Публикации отключены — статус карточки не подтверждает отправку.');return;}
 if(action==='approve'){
   const item=byId(id);if(!item)return;
   try{CCV2FlowUI.seed([item]);CCV2FlowData.approve(item);render();openDrawer(id,'pipeline');toast('Версия одобрена только в демоверсии.');}
   catch(err){toast(err.message||'Не удалось одобрить версию');}return;
 }
 if(action==='copy-prompt'){
  const input=$('handoff-prompt');if(!input)return;
  if(navigator.clipboard&&window.isSecureContext){
    navigator.clipboard.writeText(input.value).then(()=>toast('Задание скопировано.')).catch(()=>{input.focus();input.select();toast('Выделите и скопируйте задание вручную.');});
  }else{input.focus();input.select();toast('Выделите и скопируйте задание вручную.');}
  return;
 }
 if(action==='sample-reply'){
   const x=byId(state.drawer?.id);
   if(!x||!state.drawer.ticket)return;
   $('handoff-reply').value=JSON.stringify(demoReply(x,state.drawer.ticket),null,2);
   $('handoff-result').innerHTML='<p class="drawer-note">Пример вставлен. Нажмите «Проверить ответ».</p>';
   return;
 }
 if(action==='check-reply'){
   const x=byId(state.drawer?.id),ticket=state.drawer?.ticket;
   if(!x||!ticket)return;
   try{
     const response=JSON.parse($('handoff-reply').value.trim().replace(/^\x60\x60\x60(?:json)?\s*/i,'').replace(/\s*\x60\x60\x60$/,''));
     const allowed=['schema','request_id','client_id','content_item_id','changes'];
     if(!response||typeof response!=='object'||Array.isArray(response)||Object.keys(response).some(k=>!allowed.includes(k))||allowed.some(k=>!Object.hasOwn(response,k)))throw Error('Недопустимый формат ответа.');
     if(response.schema!==ticket.schema||response.request_id!==ticket.request_id||response.client_id!==ticket.client_id||response.content_item_id!==ticket.content_item_id)throw Error('Ответ относится к другому клиенту, материалу или заданию.');
     if(!['draft','production'].includes(x.status))throw Error('Этот материал уже вышел из статуса черновика или подготовки.');
     const changes=response.changes;
     if(!changes||typeof changes!=='object'||Array.isArray(changes)||!Object.keys(changes).length||Object.keys(changes).some(k=>!['title','caption','brief'].includes(k)))throw Error('Разрешены только изменения названия, текста и брифа.');
     for(const [k,v] of Object.entries(changes))if(typeof v!=='string'||v.length>(k==='title'?160:10000)||(k==='title'&&!v.trim()))throw Error('Некорректное содержание поля: '+k);
     state.drawer.staged=changes;
     const diff=Object.entries(changes).map(([k,v])=>'<div class="check-item" style="display:block"><strong>'+({title:'Название',caption:'Текст',brief:'Бриф'}[k])+'</strong><p style="color:#91a0a5;margin:7px 0">Было: '+escapeHtml(k==='brief'?x.notes:x[k])+'</p><p style="color:#266e60;margin:0">Станет: '+escapeHtml(v)+'</p></div>').join('');
     $('handoff-result').innerHTML='<div class="drawer-subhead">3. Просмотр изменений</div><div class="check-list">'+diff+'</div><p class="drawer-note">Только после вашего подтверждения текст перенесётся в редактор. Сохранение — отдельное действие.</p><div class="drawer-actions"><button class="primary-btn" data-action="apply-reply">Перенести в редактор</button></div>';
   }catch(error){state.drawer.staged=null;$('handoff-result').innerHTML='<p class="drawer-note" style="color:#a75c43">'+escapeHtml(error.message||'Не удалось разобрать ответ')+'</p>';}
   return;
 }
 if(action==='apply-reply'){
   const x=byId(state.drawer?.id),staged=state.drawer?.staged;
   if(!x||!staged||!['draft','production'].includes(x.status))return;
   openDrawer(x.id,'edit');state.drawer.staged=staged;$('overlay').querySelector('.drawer').innerHTML='<div class="drawer-head"><div><span class="drawer-ey">CONTENT CENTER V2</span><h2 style="margin-bottom:0">Редактирование</h2></div><button type="button" class="close-btn" data-action="close" aria-label="Закрыть">×</button></div>'+formHtml(x);
   $('overlay').querySelector('.close-btn').focus();
   toast('Правки перенесены в редактор. Проверьте текст и нажмите «Сохранить в демо».');
   return;
 }
}
function handleFormSubmit(form){
 if(form.id==='comment-form'){
   const x=byId(state.drawer?.id),text=new FormData(form).get('comment')?.toString().trim();
   if(!x||!text)return;
   x.comments.push(text);openDrawer(x.id,'review');toast('Демо: замечание добавлено.');return;
 }
 if(form.id==='material-form'){
   const data=new FormData(form);
   const title=data.get('title')?.toString().trim()||'';
   if(!title)return toast('Введите название материала.');
   let item=state.drawer?.id?byId(state.drawer.id):null;
   if(state.drawer?.id&&!item)return toast('Материал не найден.');
   const record={title,format:data.get('format'),channel:data.get('channel'),caption:data.get('caption')||'',notes:data.get('notes')||''};
   if(item){
     const changed=CCV2FlowData.applyEdit(item,record);
     if(changed&&['draft','production'].includes(item.status)&&data.get('status')==='production')item.status='production';
   }else{
     item={id:'draft-'+crypto.randomUUID(),client_id:state.clientId,img:'',assignee:'Владелец',comments:[],status:'draft',scheduledAt:null,version:1,events:[],...record};
     items().unshift(item);
   }
   closeDrawer();render();openDrawer(item.id);toast('Сохранено в демоверсии. Рабочие данные не менялись.');return;
 }
}
document.addEventListener('click',event=>{
 const navButton=event.target.closest('[data-nav]');
 if(navButton){setView(navButton.dataset.nav);return;}
 const action=event.target.closest('[data-action]');
 if(action){handleAction(action);return;}
});
$('side-client').addEventListener('click',()=>CCV2Wizard.openClients());
$('create-top').addEventListener('click',()=>CCV2Wizard.openMaterials());
$('search-btn').addEventListener('click',()=>{
 setView('production');requestAnimationFrame(()=>$('material-search')?.focus());
});
$('notify-btn').addEventListener('click',()=>{
 toast('В демо: уведомления показываются через статусы карточек на главной.');
});
$('demo-help').addEventListener('click',()=>openDrawer(null,'guide'));
$('view').addEventListener('input',event=>{
 if(event.target.id==='material-search'){
  const caret=event.target.selectionStart;state.query=event.target.value;render();
  const input=$('material-search');input.focus();
  if(caret!==null)input.setSelectionRange(caret,caret);
 }
});
$('view').addEventListener('change',event=>{
 if(event.target.id==='material-filter'){state.filter=event.target.value;render();}
});
$('overlay').addEventListener('click',event=>{
 if(event.target===$('overlay'))closeDrawer();
});
$('overlay').addEventListener('submit',event=>{
 if(event.target.id==='wizard-form'){event.preventDefault();CCV2Wizard.submit(event.target);return;}
 if(event.target.id==='material-form'||event.target.id==='comment-form'){event.preventDefault();handleFormSubmit(event.target);}
});
document.addEventListener('keydown',event=>{
 if(event.key==='Escape'&&!$('overlay').hidden){closeDrawer();return;}
 if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){
  event.preventDefault();setView('production');$('material-search')?.focus();
 }
});
render();

