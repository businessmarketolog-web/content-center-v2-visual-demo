/* Independent mock-only content production state machine. It does not save or publish. */
(function(root){
'use strict';
const STAGES=['draft','production','review','approved','scheduled'];
const LABELS={draft:'Черновик',production:'В работе',review:'Согласование',approved:'Одобрено',scheduled:'В календаре',failed:'Ошибка',published:'Опубликовано'};
const visual=new Set(['Reels','Stories','Карусель']);
function fingerprint(item){return JSON.stringify([item.title||'',item.caption||'',item.notes||'',item.format||'',item.channel||'',item.img||'']);}
function ensure(item){if(!item||!item.id)throw Error('Материал не найден');if(!Number.isSafeInteger(item.version)||item.version<1)item.version=1;if(!Array.isArray(item.events))item.events=[];return item;}
function stamp(item,kind,desc){ensure(item);item.events.unshift({kind,desc,version:item.version,at:new Date().toISOString()});}
function issues(item){
 const warnings=[];
 if(!String(item?.title||'').trim())warnings.push('Добавьте название');
 if(!String(item?.caption||'').trim())warnings.push('Добавьте текст публикации');
 if(visual.has(item?.format)&&!item?.img)warnings.push('Выберите демофото для визуального формата');
 if(/\[[^\]]+\]|\{\{[^}]+\}\}|\b(?:TODO|TBD)\b/i.test(String(item?.caption||'')))warnings.push('Заполните шаблонные поля');
 if(/(?:\d[\d\s.,]*\s*(?:₽|руб\.?|USD|EUR|€|\$)|\b20\d\d\b)/i.test(String(item?.caption||'')))warnings.push('Проверьте цены и даты по первоисточнику (автоматически не подтверждено)');
 return warnings;
}
function isApproved(item){return Boolean(item?.approval&&item.approval.version===item.version&&item.approval.fingerprint===fingerprint(item));}
function applyEdit(item,next){
 ensure(item);
 const allowed=['title','caption','notes','format','channel','img'];
 const changed=allowed.some(k=>String(item[k]??'')!==String(next[k]??item[k]??''));
 const wasApproved=Boolean(item.approval);
 if(!changed)return false;
 if(['approved','scheduled','review','published'].includes(item.status))item.status='production';
 for(const k of allowed)if(Object.hasOwn(next,k))item[k]=next[k];
 item.version++;
 item.review=null;item.approval=null;item.scheduledAt=null;
 stamp(item,'edit',wasApproved?'Внесены изменения; предыдущее согласование отменено':'Содержимое материала изменено');
 return true;
}
function begin(item){ensure(item);if(!['draft','failed'].includes(item.status))throw Error('На этом этапе материал нельзя взять в работу');item.status='production';stamp(item,'start','Материал взят в работу');}
function requestReview(item){
 ensure(item);
 if(!['draft','production','failed'].includes(item.status))throw Error('Материал уже находится на следующем этапе');
 const missing=issues(item).filter(t=>!t.startsWith('Проверьте цены'));
 if(missing.length)throw Error('Перед согласованием: '+missing.join('; '));
 item.review={version:item.version,fingerprint:fingerprint(item),requestedAt:new Date().toISOString()};
 item.approval=null;item.status='review';stamp(item,'review','Версия '+item.version+' отправлена на демонстрационное согласование');
}
function approve(item){
 ensure(item);
 if(item.status!=='review'||!item.review||item.review.version!==item.version||item.review.fingerprint!==fingerprint(item))throw Error('Требуется согласование актуальной версии материала');
 item.approval={version:item.version,fingerprint:fingerprint(item),approvedAt:new Date().toISOString()};
 item.status='approved';stamp(item,'approved','Демоверсия '+item.version+' одобрена');
}
function schedule(item,raw){
 ensure(item);
 if(!['approved','scheduled'].includes(item.status)||!isApproved(item))throw Error('Планировать можно только актуальную одобренную версию');
 const timestamp=Date.parse(raw||'');
 if(!Number.isFinite(timestamp)||timestamp<=Date.now())throw Error('Укажите будущие дату и время');
 item.scheduledAt=new Date(timestamp).toISOString();item.status='scheduled';stamp(item,'scheduled','Запланировано (только в демоверсии)');
}
function returnToWork(item){
 ensure(item);
 if(!['review','approved','scheduled','failed'].includes(item.status))throw Error('На этом этапе возврат не нужен');
 item.status='production';item.review=null;item.approval=null;item.scheduledAt=null;
 stamp(item,'returned','Возвращено в работу; предыдущее согласование больше не действует');
}
function attachSample(item,url){
 ensure(item);if(!visual.has(item.format))throw Error('Фото требуется для визуального формата');
 if(!/^https:\/\/images\.unsplash\.com\//.test(url))throw Error('Можно выбрать только встроенное демофото');
 return applyEdit(item,{img:url});
}
root.CCV2FlowData=Object.freeze({STAGES,LABELS,ensure,issues,isApproved,fingerprint,applyEdit,begin,requestReview,approve,schedule,returnToWork,attachSample});
})(typeof globalThis==='undefined'?this:globalThis);
