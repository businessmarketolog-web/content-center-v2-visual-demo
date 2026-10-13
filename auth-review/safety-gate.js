/*
 * Auth-review prevents ACCIDENTAL mutations in its own UI.
 * It is not an authorization boundary: the real backend must still enforce RLS.
 * Only owner-created [V2 QA] clients may receive draft material mutations.
 */
(function(){
  'use strict';
  const BACKEND='https://kywxggukoqalzhuykhmx.supabase.co';
  const PREFIX='[V2 QA] ';
  const nativeFetch=window.fetch.bind(window);
  const error=(details)=>{throw new Error('Тестовая V2: '+details)};
  const getBody=async(req)=>{
    try{return JSON.parse(await req.clone().text())}catch(_){return null}
  };
  const currentClient=()=>{
    if(typeof state==='undefined'||!state?.clients)return null;
    return state.clients.find(x=>x.id===state.clientId&&x.name?.startsWith(PREFIX))||null;
  };
  const isDraft=x=>x&&x.status==='draft'&&!x.scheduled_at&&!x.due_at&&
    (!x.media_urls||(Array.isArray(x.media_urls)&&x.media_urls.length===0));
  window.fetch=async function guardedPreviewFetch(input,init){
    const req=new Request(input,init);
    const url=new URL(req.url);
    const method=req.method.toUpperCase();
    if(url.origin!==BACKEND||['GET','HEAD','OPTIONS'].includes(method))
      return nativeFetch(req);
    if(url.pathname.startsWith('/auth/v1/'))return nativeFetch(req);
    if(method==='POST'&&url.pathname==='/functions/v1/claim-owner-v2')
      return nativeFetch(req);
    if(method==='POST'&&url.pathname==='/rest/v1/rpc/owner_create_client'){
      const body=await getBody(req);
      if(!body||typeof body.p_name!=='string'||!body.p_name.trim())
        return error('укажите имя нового тестового клиента');
      const clean=body.p_name.trim().replace(/^\[V2 QA\]\s*/, '');
      const altered=new Request(req,{body:JSON.stringify({...body,p_name:PREFIX+clean})});
      return nativeFetch(altered);
    }
    if(url.pathname==='/rest/v1/content_items'){
      const client=currentClient();
      if(!client)return error('создайте и выберите клиента с меткой [V2 QA]');
      const body=await getBody(req);
      if(method==='POST'){
        const rows=Array.isArray(body)?body:[body];
        if(!rows.length||!rows.every(x=>x?.client_id===client.id&&isDraft(x)))
          return error('разрешены только черновики без расписания, вложений и чужих клиентов');
        return nativeFetch(req);
      }
      if(method==='PATCH'){
        const id=url.searchParams.get('id');
        const itemId=id?.startsWith('eq.')?id.slice(3):'';
        if(!itemId||typeof state==='undefined'||!state.content?.some(x=>x.id===itemId&&x.client_id===client.id))
          return error('изменять можно только материалы выбранного тестового клиента');
        if(!body||typeof body!=='object'||Array.isArray(body)||
          (body.client_id&&body.client_id!==client.id)||
          (body.status&&body.status!=='draft')||
          body.scheduled_at||body.due_at||body.media_urls)
          return error('нельзя менять клиента, публиковать, назначать дату или вложения');
        return nativeFetch(req);
      }
    }
    return error('эта операция заблокирована; доступны только тестовые клиенты и черновики');
  };
  window.CCV2AuthReview={mode:'owner-auth-review',source:'production-backend',prefix:PREFIX,
    capabilities:Object.freeze(['owner-login','create-qa-client','create-draft','edit-qa-draft'])};
})();
