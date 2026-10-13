/* This is a dedicated V2 review route, never the ordinary production app. */
(function(){
  'use strict';
  const url=new URL(location.href);
  if(url.searchParams.get('workspace')==='v2')return;
  url.searchParams.set('workspace','v2');
  history.replaceState(history.state,'',url.pathname+url.search+url.hash);
})();
