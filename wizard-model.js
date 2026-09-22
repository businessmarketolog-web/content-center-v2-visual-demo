/* Pure mock-data wizard model. No browser APIs, no database access, no network. */
(function(root){
'use strict';
const GOALS=['Продажи','Заявки','Охваты','Экспертность','Удержание клиентов'];
const CHANNELS=['Instagram','Telegram'];
const FORMATS=['Reels','Пост','Stories','Карусель'];
const NICHES=['Туризм','Дизайн интерьера','Мебель','Красота','Образование','Другое'];
const allowedByChannel={Instagram:new Set(FORMATS),Telegram:new Set(['Пост'])};
const normalize=s=>String(s||'').trim().replace(/\s+/g,' ');
function validateClient(values,existing){
 const name=normalize(values.name);
 if(name.length<2||name.length>80)throw Error('Укажите название клиента: от 2 до 80 символов.');
 if((existing||[]).some(c=>normalize(c.name).toLocaleLowerCase('ru')===name.toLocaleLowerCase('ru')))throw Error('Клиент с таким названием уже есть в демоверсии. Выберите его вместо создания дубликата.');
 if(!NICHES.includes(values.niche))throw Error('Выберите сферу деятельности клиента.');
 for(const [field,allowed,caption] of [['goals',GOALS,'цель'],['channels',CHANNELS,'площадку'],['formats',FORMATS,'формат']]){
  const selected=values[field];
  if(!Array.isArray(selected)||!selected.length||selected.some(x=>!allowed.includes(x))||new Set(selected).size!==selected.length)throw Error('Выберите хотя бы одну '+caption+' из предложенных вариантов.');
 }
 if(!values.formats.some(f=>values.channels.some(ch=>allowedByChannel[ch].has(f))))throw Error('Выбранные форматы несовместимы с указанными площадками.');
 return {name,niche:values.niche,goals:[...values.goals],channels:[...values.channels],formats:[...values.formats]};
}
function validateMaterials(values){
 const title=normalize(values.title),brief=String(values.brief||'').trim(),caption=String(values.caption||'').trim();
 if(title.length<3||title.length>140)throw Error('Напишите название задачи от 3 до 140 символов.');
 if(brief.length>3000||caption.length>10000)throw Error('Слишком длинный текст задачи или материала.');
 if(!Array.isArray(values.channels)||!values.channels.length||values.channels.some(ch=>!CHANNELS.includes(ch)))throw Error('Выберите площадку для публикации.');
 if(!Array.isArray(values.formats)||!values.formats.length||values.formats.some(f=>!FORMATS.includes(f)))throw Error('Выберите хотя бы один формат материала.');
 const variants=[];
 for(const ch of CHANNELS)if(values.channels.includes(ch))for(const format of FORMATS)if(values.formats.includes(format)&&allowedByChannel[ch].has(format))variants.push({channel:ch,format});
 if(!variants.length)throw Error('Нет подходящих сочетаний формата и площадки. Например, выберите Telegram и Пост.');
 return {title,brief,caption,variants};
}
function createDemoClient(input,id){
 if(typeof id!=='string'||!id)throw Error('Некорректный ID демо-клиента.');
 const words=input.name.split(' ').filter(Boolean);
 const initials=words.slice(0,2).map(w=>w[0].toLocaleUpperCase('ru')).join('')||'Д';
 return {id,name:input.name,initials,kind:input.niche+' · демо',goals:[...input.goals],channels:[...input.channels],formats:[...input.formats],items:[]};
}
function createDemoBundle(plan,clientId,bundleId,ids){
 if(!clientId||!bundleId||!Array.isArray(ids)||ids.length!==plan.variants.length||new Set(ids).size!==ids.length)throw Error('Некорректная группа материалов.');
 return plan.variants.map((variant,i)=>({id:ids[i],client_id:clientId,bundleId,title:plan.title+(plan.variants.length>1?' · '+variant.format+(variant.channel==='Telegram'?' · TG':'') :''),format:variant.format,channel:variant.channel,status:'draft',caption:plan.caption,img:'',scheduledAt:null,assignee:'Владелец',notes:plan.brief,comments:[]}));
}
root.CCV2WizardData=Object.freeze({GOALS,CHANNELS,FORMATS,NICHES,normalize,validateClient,validateMaterials,createDemoClient,createDemoBundle});
})(typeof globalThis==='undefined'?this:globalThis);
