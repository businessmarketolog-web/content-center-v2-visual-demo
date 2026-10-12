/* DEMO ONLY. No real Supabase client, credentials, API or persistent data. */
(function(){
'use strict';
const travel='11111111-1111-4111-8111-111111111111';
const furniture='77777777-7777-4777-8777-777777777777';
const now=new Date('2026-10-13T10:00:00Z');
const date=d=>new Date(now.getTime()+d*86400000).toISOString();
const state={
 clients:[
  {id:travel,name:'Демо · Турагентство',business_type:'Туризм',active:true,brand_rules:{audience:'Семьи, пары и путешественники',goals:'Заявки и узнаваемость',tone:'Дружелюбный, экспертный',primary_font:'Evolventa',accent_font:'Liana'}},
  {id:furniture,name:'Демо · Мебельный бренд',business_type:'Мебель',active:true,brand_rules:{audience:'Дизайнеры и владельцы квартир',goals:'Портфолио и заявки',tone:'Сдержанный, профессиональный'}}
 ],
 content_items:[
  {id:'22222222-2222-4222-8222-222222222221',client_id:travel,title:'Обзор семейного отеля',status:'production',format:'Reels',channel:'Instagram',caption:'Пример текста о семейном отдыхе. Цены и факты требуют проверки.',brief:'Короткий экспертный видеообзор',scheduled_at:date(3),due_at:date(1),media_urls:[]},
  {id:'22222222-2222-4222-8222-222222222222',client_id:travel,title:'Топ пляжей Пхукета',status:'review',format:'Carousel',channel:'Instagram',caption:'Тестовая подборка пляжей Пхукета.',brief:'Карусель с рекомендациями',scheduled_at:date(5),due_at:date(2),media_urls:[]},
  {id:'22222222-2222-4222-8222-222222222223',client_id:travel,title:'Памятка путешественника',status:'approved',format:'Post',channel:'Telegram',caption:'Тестовая памятка для путешествий.',brief:'Пост-шпаргалка',scheduled_at:date(6),due_at:date(4),media_urls:[]},
  {id:'88888888-8888-4888-8888-888888888881',client_id:furniture,title:'Современная кухня на заказ',status:'draft',format:'Carousel',channel:'Instagram',caption:'Пример поста о кухне.',brief:'Портфолио',scheduled_at:date(4),due_at:date(2),media_urls:[]}
 ],
 client_integrations:[],assets:[],analytics_daily:[],content_sync_events:[],content_comments:[],publish_queue:[],content_templates:[],content_links:[],saved_views:[],recurring_content_rules:[],client_approval_links:[],notification_settings:[],notification_outbox:[],content_campaigns:[],content_metrics:[],content_media_versions:[],content_backups:[],work_items:[]
};
const previewSession={user:{id:'55555555-5555-4555-8555-555555555555',email:'owner@content-center.local',app_metadata:{role:'content_center_owner'}},access_token:'DEMO_ONLY_NOT_A_REAL_TOKEN'};
function query(table){
 const filters=[];let method='select',payload,one=false,limit=Infinity,ordering=null;
 const q={
  select(){return q;},eq(key,value){filters.push([key,value]);return q;},in(key,values){filters.push([key,values,'in']);return q;},
  order(key,settings){ordering={key,settings};return q;},limit(value){limit=value;return q;},single(){one=true;return q;},maybeSingle(){one=true;return q;},
  insert(value){method='insert';payload=value;return q;},update(value){method='update';payload=value;return q;},upsert(value){method='upsert';payload=value;return q;},delete(){method='delete';return q;},
  then(resolve,reject){
   const rows=state[table]||(state[table]=[]);
   const matched=rows.filter(row=>filters.every(([key,v,op])=>op==='in'?v.includes(row[key]):row[key]===v));
   let result=[];
   if(method==='select'){
    result=matched.slice();
    if(ordering)result.sort((a,b)=>{
     const ax=a[ordering.key]??'',bx=b[ordering.key]??'';
     return ordering.settings?.ascending===false?String(bx).localeCompare(String(ax)):String(ax).localeCompare(String(bx));
    });
    result=result.slice(0,limit);
   }else if(method==='insert'||method==='upsert'){
    result=(Array.isArray(payload)?payload:[payload]).map(row=>({id:row.id||crypto.randomUUID(),...row,created_at:row.created_at||new Date().toISOString()}));
    if(method==='upsert'){
     for(const row of result){const found=rows.find(x=>x.id===row.id);if(found)Object.assign(found,row);else rows.push(row);}
    }else rows.push(...result);
   }else if(method==='update'){
    for(const row of matched)Object.assign(row,payload);
    result=matched;
   }else if(method==='delete'){
    for(const row of matched){const i=rows.indexOf(row);if(i!==-1)rows.splice(i,1);}
    result=matched;
   }
   return Promise.resolve({data:one?(result[0]||null):result,error:null}).then(resolve,reject);
  }
 };
 return q;
}
const client={
 auth:{getSession:async()=>({data:{session:previewSession},error:null}),getUser:async()=>({data:{user:previewSession.user},error:null}),onAuthStateChange:()=>({data:{subscription:{unsubscribe(){}}}}),signOut:async()=>({error:null})},
 from:query,
 rpc:async(name,params)=>{
  if(name==='owner_create_client'){
   if(state.clients.some(c=>c.name.trim().toLowerCase()===params.p_name.trim().toLowerCase()))return {error:{message:'client_already_exists'},data:null};
   const id=crypto.randomUUID();state.clients.push({id,name:params.p_name,business_type:params.p_business_type,brand_rules:params.p_brand_rules,active:true});return {data:id,error:null};
  }
  if(name==='owner_update_client'){
   const record=state.clients.find(c=>c.id===params.p_client_id);
   if(!record)return {error:{message:'client_not_found'},data:null};
   Object.assign(record,{name:params.p_name,business_type:params.p_business_type,brand_rules:params.p_brand_rules});return {data:record.id,error:null};
  }
  return {data:null,error:{message:'Этот вызов недоступен в демонстрации'}};
 },
 channel:()=>({on(){return this},subscribe(){return this}}),removeChannel(){},
 storage:{from:()=>({upload:async()=>({error:{message:'Загрузка медиа недоступна в демо'}}),getPublicUrl:()=>({data:{publicUrl:''}})})}
};
window.supabase={createClient:()=>client};
const nativeFetch=window.fetch.bind(window);
window.fetch=function(resource,options){
 const url=new URL(typeof resource==='string'?resource:resource.url,window.location.href);
 if(url.origin!==window.location.origin)return Promise.resolve(new Response(JSON.stringify({error:'Демо: внешние действия заблокированы'}),{status:403,headers:{'Content-Type':'application/json'}}));
 return nativeFetch(resource,options);
};
/* No persistent storage or real owner code is used. Refresh resets this preview. */
})();
