/* Read-only summaries for related materials in the standalone mock-only demo. */
(function(root){
'use strict';
const ACTIVE=new Set(['draft','production','failed']);
const REVIEW=new Set(['review']);
const READY=new Set(['approved','scheduled']);
const SUFFIX=/\s·\s(?:Reels|Stories|Карусель|Пост)(?:\s·\sTG)?$/;
function derive(cards,clientId){
 if(!clientId||!Array.isArray(cards))return [];
 const groups=new Map();
 for(const item of cards){
  if(!item||item.client_id!==clientId||typeof item.bundleId!=='string'||!item.bundleId.trim())continue;
  const key=item.bundleId;
  if(!groups.has(key))groups.set(key,{id:key,clientId,title:String(item.bundleTitle||item.title||'Серия без названия').replace(SUFFIX,''),cards:[],formats:[],channels:[],ready:0,review:0,work:0});
  const group=groups.get(key);
  group.cards.push(item);
  if(!group.formats.includes(item.format))group.formats.push(item.format);
  if(!group.channels.includes(item.channel))group.channels.push(item.channel);
  if(READY.has(item.status))group.ready++;
  else if(REVIEW.has(item.status))group.review++;
  else if(ACTIVE.has(item.status))group.work++;
 }
 return [...groups.values()].map(group=>({...group,total:group.cards.length,remaining:group.cards.length-group.ready}));
}
function forClient(items,clientId,seriesId){
 return derive(items,clientId).find(group=>group.id===seriesId)||null;
}
root.CCV2SeriesData=Object.freeze({derive,forClient});
})(typeof globalThis==='undefined'?this:globalThis);
