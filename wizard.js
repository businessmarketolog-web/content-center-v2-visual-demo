/* Mock-only visual onboarding. No API calls and no persistent storage. */
(function(root){
'use strict';
const M=root.CCV2WizardData,e=escapeHtml;
const titles={client:['Клиент','Цели','Каналы','Проверка'],material:['Задача','Форматы','Текст','Проверка']};
let flow=null;
function input(name,label,value='',placeholder=''){
 return '<label class="field">'+label+'<input class="input" name="'+name+'" value="'+e(value)+'" placeholder="'+e(placeholder)+'" maxlength="140" required></label>';
}
function picks(name,choices){
 return '<div class="wizard-options">'+choices.map(x=>'<label class="wizard-option"><input type="checkbox" name="'+name+'" value="'+e(x)+'" '+((flow.values[name]||[]).includes(x)?'checked':'')+'><span class="wizard-option-inner"><b>✓</b><strong>'+e(x)+'</strong></span></label>').join('')+'</div>';
}
function clientStep(){
 const v=flow.values;
 if(flow.step===0)return input('name','Название компании',v.name,'Например, Тревел Студио')+'<label class="field">Сфера деятельности<select class="select" name="niche">'+M.NICHES.map(x=>'<option '+(v.niche===x?'selected':'')+'>'+e(x)+'</option>').join('')+'</select></label><p class="wizard-hint">Это демонстрационный клиент. Настоящий кабинет не изменится.</p>';
 if(flow.step===1)return '<div class="wizard-question">Что нужно получить от контента?</div><p class="drawer-intro">Можно выбрать несколько целей.</p>'+picks('goals',M.GOALS);
 if(flow.step===2)return '<div class="wizard-question">На каких площадках будем работать?</div>'+picks('channels',M.CHANNELS)+'<div class="wizard-question wizard-spaced">Какие форматы используем?</div>'+picks('formats',M.FORMATS);
 const good=M.validateClient(v,state.projects);
 return '<div class="wizard-summary"><small>НОВЫЙ КЛИЕНТ · ДЕМО</small><h3>'+e(good.name)+'</h3><p>'+e(good.niche)+'</p><small>ЦЕЛИ</small><p>'+e(good.goals.join(' · '))+'</p><small>ПЛОЩАДКИ И ФОРМАТЫ</small><p>'+e(good.channels.join(' · '))+'<br>'+e(good.formats.join(' · '))+'</p></div><p class="wizard-hint">После создания клиента можно сразу поставить первую задачу.</p>';
}
function materialStep(){
 const v=flow.values;
 if(flow.step===0)return '<p class="wizard-client-name">● '+e(project().name)+'</p>'+input('title','О чём будет материал?',v.title,'Например, обзор семейного отеля')+'<label class="field">Задача или краткий бриф<textarea class="textarea" name="brief" maxlength="3000" placeholder="Что нужно показать, для кого и зачем?">'+e(v.brief||'')+'</textarea></label>';
 if(flow.step===1)return '<div class="wizard-question">Выберите площадки</div>'+picks('channels',M.CHANNELS)+'<div class="wizard-question wizard-spaced">Выберите форматы</div>'+picks('formats',M.FORMATS)+'<p class="wizard-hint">Для Telegram доступен формат «Пост». Для каждого подходящего сочетания будет отдельная карточка.</p>';
 if(flow.step===2)return '<label class="field">Текст публикации (необязательно)<textarea class="textarea" name="caption" maxlength="10000" placeholder="Можно написать позже — в редакторе">'+e(v.caption||'')+'</textarea></label><p class="wizard-hint">Создаём черновики. Никаких автоматических публикаций.</p>';
 const plan=M.validateMaterials(v);
 return '<div class="wizard-summary"><small>ЗАДАЧА · ДЕМО</small><h3>'+e(plan.title)+'</h3><p>'+e(project().name)+'</p><small>СОЗДАДИМ '+plan.variants.length+' КАРТОЧЕК</small>'+plan.variants.map(x=>'<div class="wizard-variant"><span>▤</span><b>'+e(x.format)+'</b><small>'+e(x.channel)+'</small></div>').join('')+'<small>БРИФ</small><p>'+e(plan.brief||'Не указан — можно дополнить позже')+'</p></div><p class="wizard-hint">Карточки будут связаны общей задачей, но останутся независимыми материалами.</p>';
}
function paint(){
 if(!flow)return;
 let content;
 try{content=flow.kind==='client'?clientStep():materialStep();}
 catch(err){content='<p class="wizard-error">'+e(err.message)+'</p>';}
 const labels=titles[flow.kind];
 $('overlay').innerHTML='<section class="drawer wizard-drawer" role="dialog" aria-modal="true" aria-label="Пошаговое создание"><div class="drawer-head"><div><span class="drawer-ey">CONTENT CENTER V2 · ДЕМО</span><h2>'+(flow.kind==='client'?'Новый клиент':'Новая задача')+'</h2></div><button type="button" class="close-btn" data-action="close" aria-label="Закрыть">×</button></div><div class="wizard-progress">'+labels.map((x,i)=>'<span class="wizard-step '+(flow.step===i?'current':i<flow.step?'done':'')+'"><b>'+(i<flow.step?'✓':i+1)+'</b><small>'+x+'</small></span>').join('')+'</div><div class="wizard-caption">ШАГ '+(flow.step+1)+' ИЗ 4</div><form id="wizard-form" class="wizard-form">'+content+'<p class="wizard-error" id="wizard-error" role="alert" hidden></p><div class="wizard-footer">'+(flow.step?'<button type="button" class="soft-btn" data-action="wizard-back">← Назад</button>':'<button type="button" class="soft-btn" data-action="close">Отмена</button>')+'<button type="submit" class="primary-btn">'+(flow.step===3?(flow.kind==='client'?'Создать демо-клиента':'Создать черновики'):'Продолжить →')+'</button></div></form><p class="wizard-hint">Все действия происходят только в этом макете и не сохраняются после обновления страницы.</p></section>';
 $('overlay').hidden=false;document.body.style.overflow='hidden';$('overlay').querySelector('.close-btn').focus();
}
function capture(form){
 const data=new FormData(form),v=flow.values;
 if(flow.kind==='client'){
  if(flow.step===0){v.name=M.normalize(data.get('name'));v.niche=data.get('niche');if(v.name.length<2||v.name.length>80)throw Error('Введите название клиента от 2 до 80 символов.');}
  if(flow.step===1){v.goals=data.getAll('goals');if(!v.goals.length)throw Error('Выберите хотя бы одну цель.');}
  if(flow.step===2){v.channels=data.getAll('channels');v.formats=data.getAll('formats');M.validateClient(v,state.projects);}
 }else{
  if(flow.step===0){v.title=M.normalize(data.get('title'));v.brief=String(data.get('brief')||'').trim();if(v.title.length<3||v.title.length>140)throw Error('Укажите название задачи от 3 до 140 символов.');}
  if(flow.step===1){v.channels=data.getAll('channels');v.formats=data.getAll('formats');M.validateMaterials(v);}
  if(flow.step===2){v.caption=String(data.get('caption')||'').trim();M.validateMaterials(v);}
 }
}
function commit(){
 if(flow.kind==='client'){
  const good=M.validateClient(flow.values,state.projects),record=M.createDemoClient(good,'demo-'+crypto.randomUUID());
  state.projects.push(record);state.clientId=record.id;state.view='dashboard';state.query='';state.filter='all';state.dayOffset=0;
  closeDrawer();render();toast('Демо-клиент создан. Теперь подготовим первый материал.');openMaterials();return;
 }
 if(state.clientId!==flow.clientId)throw Error('Клиент изменился. Начните задачу заново.');
 const plan=M.validateMaterials(flow.values),bundleId='bundle-'+crypto.randomUUID(),ids=plan.variants.map(()=> 'draft-'+crypto.randomUUID());
 const cards=M.createDemoBundle(plan,state.clientId,bundleId,ids);
 project().items.unshift(...cards);
 closeDrawer();state.view='production';state.filter='all';state.query='';render();
 openDrawer(cards[0].id);toast('Создано '+cards.length+' черновиков в демоверсии.');
}
function submit(form){
 if(!flow||state.drawer?.mode!=='wizard')return;
 try{if(flow.step===3){commit();return;}capture(form);flow.step++;paint();}
 catch(err){const n=$('wizard-error');if(n){n.hidden=false;n.textContent=err.message||'Проверьте заполнение.';}}
}
function open(kind){
 const values=kind==='client'?{name:'',niche:'Туризм',goals:[],channels:[],formats:[]}:{title:'',brief:'',caption:'',channels:[...(project().channels||['Instagram'])],formats:[]};
 flow={kind,step:0,values,clientId:state.clientId};state.drawer={mode:'wizard'};paint();
}
function openClients(){
 flow=null;state.drawer={mode:'client-picker'};
 $('overlay').innerHTML='<section class="drawer wizard-drawer" role="dialog" aria-modal="true" aria-label="Выбор клиента"><div class="drawer-head"><div><span class="drawer-ey">ПРОЕКТЫ · ДЕМО</span><h2>Ваши клиенты</h2></div><button type="button" class="close-btn" data-action="close" aria-label="Закрыть">×</button></div><p class="drawer-intro">Выберите демонстрационный проект или создайте нового.</p><div class="wizard-projects">'+state.projects.map(p=>'<button type="button" class="wizard-project '+(p.id===state.clientId?'active':'')+'" data-action="wizard-select-client" data-client="'+e(p.id)+'"><span class="client-avatar">'+e(p.initials)+'</span><span><strong>'+e(p.name)+'</strong><small>'+e(p.kind)+' · '+p.items.length+' материалов</small></span><span>'+(p.id===state.clientId?'✓':'↗')+'</span></button>').join('')+'</div><button class="primary-btn wizard-full" data-action="wizard-new-client">＋ Создать клиента</button><p class="wizard-hint">Рабочие клиенты не отображаются и не меняются.</p></section>';
 $('overlay').hidden=false;document.body.style.overflow='hidden';$('overlay').querySelector('.close-btn').focus();
}
function action(name,button){
 if(name==='wizard-new-client'){open('client');return;}
 if(name==='wizard-back'){if(flow&&flow.step>0){flow.step--;paint();}return;}
 if(name==='wizard-select-client'){
  const id=button?.dataset?.client;if(!state.projects.some(p=>p.id===id))return;
  state.clientId=id;state.query='';state.filter='all';state.dayOffset=0;closeDrawer();render();toast('Демо-клиент выбран.');return;
 }
}
function openMaterials(){open('material');}
root.CCV2Wizard=Object.freeze({openClient:()=>open('client'),openMaterials,openClients,action,submit,MODEL:M});
})(typeof window==='undefined'?globalThis:window);
