/* Camada de banco de dados do jogo sobre o Supabase.
   Imita a interface usada pelo jogo: doc(path).get/set/update/delete/onSnapshot e collection(path).get/onSnapshot.
   Tudo fica na tabela public.docs (path, data). */
(function(){
  function clone(x){return x===undefined?undefined:JSON.parse(JSON.stringify(x));}
  function direct(base,p){return p.indexOf(base+'/')===0&&p.slice(base.length+1).indexOf('/')<0;}
  function docSnap(path,data){return {exists:data!==undefined,id:path.split('/').pop(),data:function(){return clone(data);}};}
  function colSnap(base,map){
    var docs=[];Object.keys(map).forEach(function(p){if(direct(base,p))docs.push({id:p.slice(base.length+1),data:function(){return clone(map[p]);}});});
    return {docs:docs,size:docs.length};
  }
  async function connect(cfg){
    if(!window.supabase||!window.supabase.createClient)throw new Error('supabase-js não carregou');
    var sb=window.supabase.createClient(cfg.url,cfg.key,{auth:{persistSession:true,autoRefreshToken:true}});
    var ses=(await sb.auth.getSession()).data.session;
    if(!ses){var r=await sb.auth.signInAnonymously();if(r.error)throw r.error;ses=r.data.session;}
    var uid=ses.user.id,T='docs';
    async function getDoc(path){
      var r=await sb.from(T).select('data').eq('path',path).maybeSingle();
      if(r.error)throw r.error;return r.data?r.data.data:undefined;
    }
    async function getCol(base){
      var r=await sb.from(T).select('path,data').like('path',base+'/%');
      if(r.error)throw r.error;var m={};(r.data||[]).forEach(function(x){if(direct(base,x.path))m[x.path]=x.data;});return m;
    }
    /* assinaturas ao vivo: um canal só; refaz a leitura quando algo muda e também de tempos em tempos */
    var listeners=[],chan=null;
    function touch(path){
      listeners.slice().forEach(function(l){
        if(l.type==='doc'?l.path===path:direct(l.path,path))l.refresh();
      });
    }
    function ensureChan(){
      if(chan)return;
      chan=sb.channel('kallo-docs').on('postgres_changes',{event:'*',schema:'public',table:T},function(p){
        var row=p.new&&p.new.path?p.new:p.old;if(row&&row.path)touch(row.path);
      }).subscribe();
    }
    function listen(type,path,cb,errCb){
      ensureChan();
      var last=null,dead=false,l={type:type,path:path};
      l.refresh=async function(){
        if(dead)return;
        try{
          var snap,sig;
          if(type==='doc'){var d=await getDoc(path);sig=JSON.stringify(d===undefined?null:d);snap=function(){return docSnap(path,d);};}
          else{var m=await getCol(path);sig=JSON.stringify(m);snap=function(){return colSnap(path,m);};}
          if(dead||sig===last)return;last=sig;cb(snap());
        }catch(e){if(!dead&&errCb)errCb(e);}
      };
      listeners.push(l);l.refresh();
      var iv=setInterval(l.refresh,5000);
      return function(){dead=true;clearInterval(iv);var i=listeners.indexOf(l);if(i>-1)listeners.splice(i,1);};
    }
    var DB={
      doc:function(path){return {
        get:async function(){return docSnap(path,await getDoc(path));},
        set:async function(d){var r=await sb.from(T).upsert({path:path,data:clone(d),updated_at:new Date().toISOString()});if(r.error)throw r.error;touch(path);},
        update:async function(d){var r=await sb.rpc('merge_doc',{p_path:path,p_patch:clone(d)});if(r.error)throw r.error;touch(path);},
        delete:async function(){var r=await sb.from(T).delete().eq('path',path);if(r.error)throw r.error;touch(path);},
        onSnapshot:function(cb,errCb){return listen('doc',path,cb,errCb);}
      };},
      collection:function(path){return {
        get:async function(){return colSnap(path,await getCol(path));},
        onSnapshot:function(cb,errCb){return listen('col',path,cb,errCb);}
      };}
    };
    return {DB:DB,uid:uid};
  }
  window.KalloSupabase={connect:connect};
})();
