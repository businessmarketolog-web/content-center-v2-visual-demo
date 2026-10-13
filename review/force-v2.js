/* The public demo is V2-only. Activate V2 before any app scripts start. */
(function(){
  'use strict';
  const url=new URL(window.location.href);
  if(url.searchParams.get('workspace')==='v2')return;
  url.searchParams.set('workspace','v2');
  window.history.replaceState(window.history.state,'',url.pathname+url.search+url.hash);
})();
