(function(){
'use strict';

/* ---------- dados ---------- */
var LEVELS=[['facil','Fácil'],['medio','Médio'],['dificil','Difícil'],['muito','Muito difícil']];
var BANKS={
  facil:{
    'Animais':['Cachorro','Cavalo','Galinha','Formiga','Gato','Pato','Coelho'],
    'Objetos':['Chave','Tesoura','Cadeira','Sapato','Garrafa','Mesa','Copo','Livro'],
    'Lugares':['Hospital','Escola','Praia','Cozinha','Banheiro','Quintal','Padaria'],
    'Profissões':['Médico','Padeiro','Bombeiro','Carteiro','Pintor','Dentista','Cozinheiro'],
    'Alimentos':['Queijo','Arroz','Banana','Pão','Café','Leite','Ovo','Feijão'],
    'Tecnologia':['Telefone','Celular','Televisão','Teclado'],
    'Natureza':['Chuva','Sol','Nuvem','Flor']
  },
  medio:{
    'Animais':['Borboleta','Coruja','Tubarão','Polvo','Morcego','Golfinho','Tartaruga'],
    'Objetos':['Relógio','Espelho','Cobertor','Lanterna','Mochila','Binóculo','Calendário','Violão'],
    'Lugares':['Biblioteca','Aeroporto','Museu','Estação','Mercado','Fábrica','Teatro','Estádio','Farmácia'],
    'Profissões':['Professor','Jornalista','Marinheiro','Advogado','Engenheiro','Arquiteto','Cantor'],
    'Alimentos':['Chocolate','Melancia','Sorvete','Pizza','Macarrão','Morango'],
    'Natureza':['Montanha','Floresta','Deserto','Oceano'],
    'Tecnologia':['Computador','Robô','Internet','Bateria']
  },
  dificil:{
    'Animais':['Camaleão','Salamandra','Escorpião','Pirilampo','Ornitorrinco','Tamanduá'],
    'Objetos':['Cadeado','Bússola','Algemas','Ampulheta','Megafone','Telescópio','Pergaminho','Microscópio'],
    'Lugares':['Farol','Prisão','Cemitério','Fronteira','Laboratório','Subsolo','Catedral','Penhasco'],
    'Profissões':['Detetive','Cientista','Soldado','Químico','Espião','Alquimista','Farmacêutico'],
    'Natureza':['Tempestade','Cachoeira','Neblina','Geleira','Eclipse','Vulcão','Arco-íris','Aurora','Pântano'],
    'Tecnologia':['Microfone','Antena','Máquina','Satélite','Gravador','Radar','Sensor'],
    'Alimentos':['Pimenta','Gengibre','Canela']
  },
  muito:{
    'Conceitos abstratos':['Segredo','Labirinto','Liberdade','Silêncio','Memória','Traição','Esperança','Justiça','Lealdade','Esquecimento','Confiança','Nostalgia','Verdade','Mentira','Destino','Futuro','Poder','Dúvida'],
    'Sentimentos':['Saudade','Inveja','Vergonha','Coragem','Culpa','Medo','Ciúme','Orgulho','Solidão','Angústia'],
    'Vida sob o Estado':['Vigilância','Obediência','Censura','Propaganda','Denúncia','Confissão','Interrogatório','Privacidade','Suspeita','Disciplina','Controle','Delação','Regime','Segurança']
  }
};
var ALL=[];
Object.keys(BANKS).forEach(function(l){Object.keys(BANKS[l]).forEach(function(c){BANKS[l][c].forEach(function(w){ALL.push({w:w,c:c,l:l});});});});
function lvName(l){for(var i=0;i<LEVELS.length;i++)if(LEVELS[i][0]===l)return LEVELS[i][1];return 'Médio';}

var MODES={
  classico:{n:5,steps:['emit','p1','p2','p3'],mods:2,leos:3,need:[2,2,2]},
  delator:{n:6,steps:['emit','p1','p2','p3','p4'],mods:3,leos:4,need:[2,2,2,2]}
};
var ROLES={
  leo:{t:'Leo Kall',s:'Químico do Estado',d:[
    'Você vai interceptar a mensagem em três interrogatórios.',
    'Em cada interrogatório, Leo aplica a kallocaína e extrai palavras da mensagem, uma representação lúdica do efeito da droga no livro. Você escolhe duas em cada um dos três interrogatórios. Palavras já extraídas antes não podem ser escolhidas de novo.',
    'Em cada interrogatório você pode registrar uma tentativa de adivinhar a palavra secreta, no máximo três. Acertou antes do último interrogatório, o Estado vence na hora; no último, se o receptor também acertar, é empate. Seu interrogatório acontece ao mesmo tempo que a troca da etapa; no último, o palpite é obrigatório.',
    'Olho da Polícia: uma vez por rodada, a partir do segundo interrogatório, você pode revelar uma palavra que foi trocada, vendo a original e a que entrou no lugar dela.']},
  emissor:{t:'Cidadão-soldado 1',s:'Emissor',d:[
    'Você vai receber uma palavra secreta e escrever uma frase de exatamente 12 palavras que permita ao receptor descobri-la. Artigos e palavras de até 2 letras não contam.',
    'A frase não pode conter a palavra nem variações óbvias dela.']},
  int1:{t:'Cidadão-soldado 2',s:'Primeiro intermediário',d:[
    'Você vai receber a mensagem do emissor e trocar exatamente duas palavras, para confundir Leo sem apagar o sentido geral.',
    'Você não conhece a palavra secreta e não pode apagar a mensagem inteira.']},
  int2:{t:'Cidadão-soldado 3',s:'Segundo intermediário',d:[
    'Você vai receber a mensagem já alterada e trocar exatamente duas palavras, cuidando para que o receptor ainda consiga entendê-la.',
    'Você não conhece a palavra secreta.']},
  receptor:{t:'Cidadão-soldado 4',s:'Receptor',d:[
    'Você é o fim da cadeia. Vai receber a mensagem final e digitar a palavra secreta original.',
    'Você tem duas tentativas e não pode consultar os outros.']}
};
var DROLES={
  leo:{t:'Leo Kall',s:'Químico do Estado',d:[
    'Todos sabem que você é Leo Kall. Você vai interceptar a mensagem em quatro etapas: três interrogatórios e uma etapa de denúncia.',
    'Em cada interrogatório, Leo aplica a kallocaína e extrai palavras da mensagem, uma representação lúdica do efeito da droga no livro. Você escolhe duas em cada um dos três interrogatórios. Palavras já extraídas antes não podem ser escolhidas de novo.',
    'Um delator infiltrado entre os cidadãos-soldados vai entregar a você duas palavras, marcadas como denúncia na sua tela. Na etapa seguinte à troca dele você não interroga a mensagem, porque não interroga o delator: só recebe as duas palavras da denúncia e ainda pode dar seu palpite. Você não saberá quem foi.',
    'Em cada etapa você pode registrar uma tentativa de adivinhar a palavra secreta. Acertou antes da última etapa, o Estado vence na hora; na última, se o receptor também acertar, é empate. Seu interrogatório acontece ao mesmo tempo que a troca da etapa; na última, o palpite é obrigatório.',
    'Olho da Polícia: uma vez por rodada, a partir do segundo interrogatório, você pode revelar uma palavra que foi trocada, vendo a original e a que entrou no lugar dela.']},
  emissor:{t:'Cidadão-soldado',s:'Emissor',d:[
    'Você vai receber uma palavra secreta e escrever uma frase de exatamente 16 palavras que permita ao receptor descobri-la. Artigos e palavras de até 2 letras não contam.',
    'Depois você escolhe a qual dos outros quatro cidadãos-soldados vai passar a mensagem.',
    'Um deles é o delator, que trabalha para o Estado. Você não sabe quem é.']},
  cidadao:{t:'Cidadão-soldado',s:'Intermediário ou receptor',d:[
    'Você pode ser escolhido para receber a mensagem. Se isso acontecer, troque exatamente duas palavras e escolha para quem passar em seguida.',
    'O último cidadão-soldado que sobrar vira o receptor e tenta descobrir a palavra secreta.',
    'Entre os outros três cidadãos-soldados que não escreveram a frase, um é o delator e trabalha para o Estado.']},
  delator:{t:'Delator',s:'Agente infiltrado',d:[
    'Você parece um cidadão-soldado, mas trabalha para o Estado. Leo sabe que existe um delator, mas não sabe que é você.',
    'Quando receber a mensagem, troque exatamente duas palavras, escolha para quem passar e escolha duas palavras para entregar a Leo, que aparecem na tela dele marcadas como denúncia. Entregue palavras fortes e confunda no resto.',
    'Se os cidadãos-soldados deixarem você por último, você vira o receptor e pode entregar a decodificação ao Estado.',
    'Se o Estado vencer ou houver empate, você ganha os mesmos pontos que Leo. No fim, os cidadãos-soldados votam em quem acham que foi o delator.']}
};
var KEY='kallocaina.online.v1';
var ALPHA='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/* ---------- utilidades ---------- */
function $(s,r){return (r||document).querySelector(s);}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function norm(s){return String(s).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');}
function clean(w){return w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu,'');}
function tokenize(t){return t.split(/\s+/).map(clean).filter(Boolean);}
function rnd(n){return Math.floor(Math.random()*n);}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=rnd(i+1),t=a[i];a[i]=a[j];a[j]=t;}return a;}
function related(word,secret){
  var a=norm(word),s=norm(secret);
  if(!a)return false;
  if(a.indexOf(s)>-1)return true;
  var p=0;while(p<a.length&&p<s.length&&a[p]===s[p])p++;
  return p>=Math.min(5,Math.max(3,s.length-1));
}
function store(k,v){try{if(v===null)localStorage.removeItem(KEY+k);else localStorage.setItem(KEY+k,v);}catch(e){}}
function fetchStore(k){try{return localStorage.getItem(KEY+k)||'';}catch(e){return '';}}

/* ---------- estado ---------- */
var DB=null,USER=null,uid=null,canWrite=true,ready=false;
var code=null,room=null,players={},roomLoaded=false,unsubs=[];
var opt={mode:'classico',diff:'medio'},owner=false,menuStep='home',testFlag=false;var demoFrom='join';
var page=null,loc={},locKey='',after=null,busy=false,notice='',lastSig='',finalizingKey='';

function R(){return room&&room.round;}
function cfg(){return MODES[(room&&room.mode)||'classico'];}
function steps(){return cfg().steps;}
function isDel(){return !!room&&room.mode==='delator';}
function needN(k){return cfg().need[k-1];}
function tot(){return (room&&room.totalRounds)||5;}
function isLastRound(){return room.roundNo>=tot();}
function nm(id){return players[id]?players[id].name:'(ausente)';}
function myRole(){
  var r=R();if(!r||room.order.indexOf(uid)<0)return null;
  if(r.leo===uid)return 'leo';
  if(r.emissor===uid)return 'emissor';
  if(isDel())return r.delator===uid?'delator':'cidadao';
  if(r.int1===uid)return 'int1';
  if(r.int2===uid)return 'int2';
  if(r.receptor===uid)return 'receptor';
  return null;
}
function roleData(role){return isDel()?DROLES[role]:ROLES[role];}
function actorId(st){
  var r=R();
  if(st==='emit')return r.emissor;
  if(st==='decode')return r.receptor;
  if(st.slice(0,3)==='leo')return r.leo;
  var k=+st.slice(3);
  if(isDel())return r.chain[k];
  return k===1?r.int1:r.int2;
}
function msgOf(i){var r=R(),s=r.msgs&&r.msgs['m'+i];return s?s.split(' '):null;}
function revealOf(k){var r=R();return (r.reveals&&r.reveals['k'+k])||null;}
function guessOf(k){var r=R();return (r.guesses&&r.guesses['k'+k])||null;}
function revealList(){var o=[];for(var k=1;k<=cfg().leos;k++){var v=revealOf(k);if(v)o.push({k:k,pos:v.pos,words:v.words});}return o;}
function guessList(){var o=[];for(var k=1;k<=cfg().leos;k++){var v=guessOf(k);if(v)o.push({k:k,text:v.text,hit:v.hit,skipped:v.skipped});}return o;}
function changesOf(k){var r=R();return (r.changes&&r.changes['c'+k])||[];}
function playerIds(){return Object.keys(players).sort(function(a,b){return players[a].joinedAt-players[b].joinedAt;});}
function civilians(){
  var r=R();
  if(isDel())return room.order.filter(function(i){return i!==r.leo&&i!==r.delator;});
  return [r.emissor,r.int1,r.int2,r.receptor];
}
function candidates(){var r=R();return room.order.filter(function(i){return i!==r.leo&&r.chain.indexOf(i)<0;});}
function curK(){return R().step;}
function lkP(lk){return lk?[].concat(lk.pos):[];}
function lkW(lk){return lk?[].concat(lk.words||lk.word):[];}
var ERASED='▒▒▒';
function erasedOf(k){var r=R();return (r.er&&r.er['e'+k])||[];}
function leoView(k){
  var m=msgOf(k-1).slice();
  for(var i=0;i<m.length;i++){if(m[i]!==ERASED)continue;for(var j=k-2;j>=0;j--){var pm=msgOf(j);if(pm&&pm[i]!==ERASED){m[i]=pm[i];break;}}}
  return m;
}
function leakOnly(k){var r=R();return isDel()&&k>=2&&k<=cfg().leos&&r.chain&&r.chain[k-1]===r.delator&&!!r.leak&&r.leak.k===k;}
function leoDone(k){var r=R();return !!(r.ldone&&r.ldone['k'+k]);}
function citActor(k){var r=R();if(k>=cfg().leos)return r.receptor;if(isDel())return r.chain[k];return k===1?r.int1:r.int2;}
function citDone(k){var r=R();return k>=cfg().leos?!!r.rdone:!!msgOf(k);}
function partsOf(who){
  var r=R(),k=r.step,a=[];
  if(k===0){if(r.emissor===who)a.push('emit');return a;}
  if(r.leo===who&&!leoDone(k))a.push('leo');
  if(citActor(k)===who&&!citDone(k))a.push(k>=cfg().leos?'dec':'mod');
  return a;
}

function buildRoom(prev,roundNo){
  var mode=prev.mode||'classico',n=MODES[mode].n,order=prev.order,leo=order[(prev.firstLeo+roundNo-1)%n];
  var others=shuffle(order.filter(function(x){return x!==leo;}));
  var used=(prev.used||[]).slice();
  var diff=prev.diff||'medio',lvl=ALL.filter(function(x){return x.l===diff;});
  var pool=lvl.filter(function(x){return used.indexOf(x.w)<0;});
  if(!pool.length){used=[];pool=lvl;}
  var w=pool[rnd(pool.length)];used.push(w.w);
  var round;
  if(mode==='delator'){
    round={leo:leo,emissor:others[0],delator:others[1+rnd(4)],chain:[others[0]],receptor:'',word:w.w,cat:w.c,step:0};
  }else{
    round={leo:leo,emissor:others[0],int1:others[1],int2:others[2],receptor:others[3],word:w.w,cat:w.c,step:0};
  }
  return {code:prev.code,host:prev.host,created:prev.created,test:!!prev.test,mode:mode,diff:diff,totalRounds:prev.totalRounds||5,status:'prep',order:order,firstLeo:prev.firstLeo,roundNo:roundNo,
    scores:prev.scores,used:used,round:round};
}
function decisive(){
  var out=[],mf=msgOf(cfg().mods);if(!mf)return out;
  revealList().forEach(function(r){if(r.k>=cfg().leos)return;
    r.pos.forEach(function(p,i){if(norm(r.words[i])===norm(mf[p]))out.push(r.words[i]);});});
  return out;
}

/* ---------- conexão com a sala ---------- */
function unsubAll(){unsubs.forEach(function(u){try{u();}catch(e){}});unsubs=[];}
function enter(c){
  unsubAll();menuStep='home';code=c;room=null;players={};roomLoaded=false;lastSig='';
  store('code',c);
  var rr=DB.doc('rooms/'+c);
  unsubs.push(rr.onSnapshot(function(s){room=s.exists?s.data():null;roomLoaded=true;render();},function(){roomLoaded=true;notice='Conexão com a sala interrompida. Recarregue a página.';render();}));
  unsubs.push(DB.collection('rooms/'+c+'/players').onSnapshot(function(q){
    var m={};q.docs.forEach(function(d){m[d.id]=d.data();});players=m;render();},function(){}));
  render();
}
var pollBusy=false;
function pollSync(force){
  if(!code||!room||!DB||pollBusy)return;
  if(!force&&['lobby','prep','play','vote'].indexOf(room.status)<0)return;
  pollBusy=true;var c=code;
  Promise.all([DB.doc('rooms/'+c).get(),DB.collection('rooms/'+c+'/players').get()]).then(function(res){
    pollBusy=false;if(c!==code)return;
    var rs=res[0],q=res[1],changed=false;
    if(rs&&rs.exists){var nr=rs.data();if(JSON.stringify(nr)!==JSON.stringify(room)){room=nr;changed=true;}}
    var m={};q.docs.forEach(function(d){m[d.id]=d.data();});
    if(JSON.stringify(m)!==JSON.stringify(players)&&Object.keys(m).length){players=m;changed=true;}
    if(changed)render();
  }).catch(function(){pollBusy=false;});
}
setInterval(function(){try{pollSync();}catch(e){}},4000);
function leaveRoom(){
  if(demo){exitDemo();return;}
  var c=code,wasLobby=room&&room.status==='lobby';
  unsubAll();
  if(c&&wasLobby&&uid){DB.doc('rooms/'+c+'/players/'+uid).delete().catch(function(){});}
  code=null;room=null;players={};store('code',null);notice='';page=null;menuStep='home';render();
}
function genCode(){var s='';for(var i=0;i<5;i++)s+=ALPHA[rnd(ALPHA.length)];return s;}
function myName(){var el=$('#pname');var v=el?el.value.trim():fetchStore('name');return v;}

async function createRoom(){
  var name=myName(),sel=$('#prounds'),tr=sel?(+sel.value||3):3,mode=opt.mode==='delator'?'delator':'classico',dsel=$('#pdiff'),diff=dsel?dsel.value:'medio';
  if(!name){notice='Escreva seu nome primeiro.';render();return;}
  store('name',name);busy=true;notice='';render();
  try{
    for(var t=0;t<6;t++){
      var c=genCode(),snap=await DB.doc('rooms/'+c).get();
      if(snap.exists)continue;
      await DB.doc('rooms/'+c).set({code:c,host:uid,status:'lobby',mode:mode,diff:diff,totalRounds:tr,created:Date.now()});
      await DB.doc('rooms/'+c+'/players/'+uid).set({name:name,joinedAt:Date.now(),ack:0});
      busy=false;enter(c);return;
    }
    notice='Não foi possível abrir a sessão agora. Tente de novo.';
  }catch(e){notice='Não foi possível abrir a sessão. Seu acesso precisa permitir escrita (peça ao dono para compartilhar como Contribuidor).';}
  busy=false;render();
}
async function joinRoom(c,silent){
  var name=silent?fetchStore('name'):myName();
  c=(c||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
  if(!silent){
    if(!name){notice='Escreva seu nome primeiro.';render();return;}
    if(c.length!==5){notice='O código tem 5 caracteres.';render();return;}
    store('name',name);
  }
  busy=true;notice='';render();
  try{
    var snap=await DB.doc('rooms/'+c).get();
    if(!snap.exists){notice=silent?'':'Sessão não encontrada. Confira o número do registro.';store('code',null);busy=false;render();return;}
    var rm=snap.data(),pl=await DB.collection('rooms/'+c+'/players').get();
    var maxP=MODES[rm.mode||'classico'].n;
    var mine=null,names=[];
    pl.docs.forEach(function(d){if(d.id===uid)mine=d.data();else names.push(String(d.data().name).toLowerCase());});
    if(!mine){
      if(rm.status!=='lobby'){notice='Essa sessão já começou.';busy=false;render();return;}
      if(pl.size>=maxP){notice='A sala já está cheia ('+maxP+' jogadores).';busy=false;render();return;}
      if(!name){notice='Escreva seu nome primeiro.';busy=false;render();return;}
      if(names.indexOf(name.toLowerCase())>-1){notice='Já existe alguém com esse nome na sala.';busy=false;render();return;}
      await DB.doc('rooms/'+c+'/players/'+uid).set({name:name,joinedAt:Date.now(),ack:0});
    }
    busy=false;enter(c);
  }catch(e){notice='Não foi possível entrar na sala. Seu acesso precisa permitir escrita (peça ao dono para compartilhar como Contribuidor).';busy=false;render();}
}
async function write(fn){
  if(busy)return;busy=true;
  try{await fn();}catch(e){notice='Não foi possível salvar. Tente de novo.';}
  busy=false;render();
}

/* ---------- validações ---------- */
function NW(){return isDel()?16:12;}
function emitCheck(text){
  var r=R(),t=tokenize(text),errs=[];
  var nb=t.filter(function(w){return !isSmall(w);}).length;
  if(t.length>0&&nb!==NW())errs.push('A frase precisa ter exatamente '+NW()+' palavras (artigos e palavras de até 2 letras, como “de” e “a”, não contam).');
  if(t.length>NW()+10)errs.push('A frase está longa demais.');
  var sn=norm(r.word);
  if(t.some(function(w){return related(w,r.word);})||(sn.length>=4&&norm(t.join('')).indexOf(sn)>-1))
    errs.push('A frase contém a palavra secreta ou uma variação óbvia dela.');
  var cw=r.cat.split(/\s+/).filter(function(x){return x.length>=4;});
  if(t.some(function(w){return cw.some(function(c){return related(w,c);});}))errs.push('A frase contém o nome da categoria.');
  return {t:t,nb:nb,errs:errs,ok:nb===NW()&&!errs.length};
}
function tooClose(a,b){
  a=norm(a);b=norm(b);
  if(a===b)return true;
  var la=a.length,lb=b.length,i;
  if(Math.abs(la-lb)>1)return false;
  if(la===lb){
    var d=[];for(i=0;i<la;i++)if(a.charAt(i)!==b.charAt(i))d.push(i);
    if(d.length===1)return true;
    return d.length===2&&d[1]===d[0]+1&&a.charAt(d[0])===b.charAt(d[1])&&a.charAt(d[1])===b.charAt(d[0]);
  }
  var sh=la<lb?a:b,lg=la<lb?b:a;
  for(i=0;i<lg.length;i++)if(lg.slice(0,i)+lg.slice(i+1)===sh)return true;
  return false;
}
function modCheck(k){
  var r=R(),msg=msgOf(k-1),info={},out=msg.slice();
  loc.sel.forEach(function(p){
    var rawv=(loc.vals[p]||'').trim();
    if(!rawv){info[p]='';return;}
    if(/\s/.test(rawv)){info[p]='Use uma única palavra.';return;}
    var v=clean(rawv);
    if(norm(v).length<2){info[p]='Palavra curta demais.';return;}
    if(norm(v)===norm(msg[p])){info[p]='Precisa ser diferente da original.';return;}
    if(tooClose(v,msg[p])){info[p]='Mudar só uma letra não vale.';return;}
    out[p]=v;info[p]='ok';
  });
  var ok=loc.sel.length===2&&loc.sel.every(function(p){return info[p]==='ok';});
  return {ok:ok,info:info,out:out};
}

/* ---------- peças de interface ---------- */
function boardHtml(delta){
  var ids=room.order.slice().sort(function(a,b){return (room.scores[b]||0)-(room.scores[a]||0);});
  return '<table class="board"><thead><tr><th>Participante</th>'+(delta?'<th class="n">Rodada</th>':'')+'<th class="n">Total</th></tr></thead><tbody>'+
    ids.map(function(i){return '<tr><td>'+esc(nm(i))+(i===uid?' (você)':'')+'</td>'+(delta?'<td class="n d">'+(delta[i]?'+'+delta[i]:'–')+'</td>':'')+'<td class="n">'+(room.scores[i]||0)+'</td></tr>';}).join('')+'</tbody></table>';
}
function hudUpdate(v){
  var hud=$('#hud'),seg=$('#seg'),exb=$('#exb');
  if(exb){exb.hidden=!(demo&&code);if(!exb._b){exb._b=1;exb.addEventListener('click',function(){leaveRoom();});}}
  if(!code||!room||['prep','play','vote','result','lobby'].indexOf(v)<0){hud.hidden=true;seg.hidden=true;return;}
  var lab,n=steps().length;
  if(v==='lobby')lab='Sessão de interrogatório';
  else if(v==='prep')lab='Rodada '+room.roundNo+'/'+tot()+' · preparação';
  else if(v==='vote')lab='Rodada '+room.roundNo+'/'+tot()+' · votação';
  else if(v==='result')lab='Rodada '+room.roundNo+'/'+tot()+' · encerrada';
  else lab='Rodada '+room.roundNo+'/'+tot()+' · etapa '+(room.round.step+1)+'/'+n;
  hud.innerHTML='<span>Registro <b>'+esc(code)+'</b>'+(room.demo?(room.ai?' · IA':' · EXEMPLO'):(room.test?' · TESTE':''))+'</span><span>'+lab+'</span>';
  hud.hidden=false;
  if(v==='play'||v==='vote'||v==='result'){
    seg.innerHTML=steps().map(function(_,i){
      var c=v!=='play'||i<room.round.step?'done':(i===room.round.step?'now':'');
      return '<i class="'+c+'"></i>';}).join('');
    seg.hidden=false;
  }else seg.hidden=true;
}
function noticeHtml(){return '<p class="warn" role="status">'+esc(notice)+'</p>';}
function leoLineHtml(){
  if(!isDel()||!R())return '';
  return '<p class="leoline">Leo Kall nesta rodada: <b>'+esc(nm(R().leo))+(R().leo===uid?' (você)':'')+'</b></p>';
}
function leoLines(){
  var lines=[],lk=R().leak;
  for(var k=1;k<=cfg().leos;k++){
    var v=revealOf(k),g=guessOf(k);
    if(lk&&lk.k===k)lines.push('&gt; DENÚNCIA RECEBIDA :: '+lkW(lk).map(function(w,i){return '“'+esc(w)+'” (pos. '+pn(lkP(lk)[i])+')';}).join(' · '));
    var pw0=R().power;if(pw0&&pw0.k===k)lines.push('&gt; OLHO DA POLÍCIA :: pos. '+pn(pw0.pos)+' era “'+esc(pw0.from)+'” e virou “'+esc(pw0.to)+'”');
    if(v)lines.push('&gt; INTERROGATÓRIO '+k+' :: '+(v.words.length?v.words.map(function(w,i){return '“'+esc(w)+'” (pos. '+pn(v.pos[i])+')';}).join(' · '):'tempo esgotado, nada revelado'));
    if(g)lines.push('&gt; TENTATIVA '+k+' :: '+(g.skipped?'sem palpite':'“'+esc(g.text)+'” <span class="no">NEGADA</span>'));
  }
  return lines;
}
function pickHtml(cands,help){
  return '<div><p class="label dim" style="margin-bottom:6px">Passar a mensagem para</p><div class="msgline" id="picks">'+
    cands.map(function(id){return '<button class="chip'+(loc.next===id?' sel':'')+'" data-act="pick" data-id="'+esc(id)+'">'+esc(nm(id))+'</button>';}).join('')+'</div>'+
    (help?'<p class="dim">'+help+'</p>':'')+'</div>';
}

/* ---------- telas ---------- */
function sMenu(){
  var last=fetchStore('code'),offline=!DB||!uid,nameNow=fetchStore('name');
  var blocked=offline||!canWrite||busy;
  var msg=offline?'Salas online indisponíveis nesta visualização. É preciso estar logado com acesso ao artefato.':
    (!canWrite?'Seu acesso é só de leitura. Peça ao dono do artefato para compartilhar como Contribuidor para poder jogar.':'');
  var who='<p class="small muted">Jogando como <b>'+esc(nameNow)+'</b></p>';
  after=function(){
    var c=$('#pcode'),n=$('#pname');
    if(c){
      c.addEventListener('input',function(){c.value=c.value.toUpperCase().replace(/[^A-Za-z0-9]/g,'');});
      c.addEventListener('keydown',function(e){if(e.key==='Enter'){var b=$('[data-act=join]');if(b&&!b.disabled)b.click();}});
    }
    if(n){
      if(!n.value)n.value=nameNow;
      n.addEventListener('keydown',function(e){if(e.key==='Enter'){var b=$('[data-act=go-create]');if(b&&!b.disabled)b.click();}});
    }
  };
  if(menuStep==='create'){
    return '<section class="menu"><p class="kicker">'+(testFlag?'Modo teste · jogadores do computador':'Nova sessão')+'</p>'+
      '<h2 class="sub2">'+(testFlag?'Sala de teste':'Abrir nova sessão')+'</h2>'+who+
      '<div class="field"><span class="label" id="lmode">Modo de jogo</span><div class="opts" role="radiogroup" aria-labelledby="lmode">'+
        '<button type="button" class="opt" role="radio" data-act="mode" data-v="classico" aria-checked="'+(opt.mode==='classico')+'">Clássico<small>5 jogadores</small></button>'+
        '<button type="button" class="opt" role="radio" data-act="mode" data-v="delator" aria-checked="'+(opt.mode==='delator')+'">Delator<small>6 jogadores</small></button></div></div>'+
      '<div class="field"><label for="pdiff">Dificuldade da palavra</label><select id="pdiff">'+LEVELS.map(function(l){return '<option value="'+l[0]+'"'+(l[0]==='medio'?' selected':'')+'>'+l[1]+'</option>';}).join('')+'</select></div>'+
      '<div class="field"><label for="prounds">Rodadas da sessão</label><select id="prounds"><option value="3">3 rodadas</option><option value="5">5 rodadas</option></select></div>'+
      noticeHtml()+
      '<div class="btns" style="margin-top:28px"><button class="btn primary" data-act="'+(testFlag?'test':'create')+'" '+(blocked?'disabled':'')+'>'+(testFlag?'Criar sala de teste':'Abrir nova sessão')+'</button><button class="btn" data-act="menu-back">Voltar</button></div></section>';
  }
  if(menuStep==='demo'){
    return '<section class="menu"><p class="kicker">Aprenda jogando</p><h2 class="sub2">Sessão de exemplo</h2>'+
      '<p>Jogue uma rodada guiada contra o computador, sem abrir uma sessão e sem outros jogadores. '+(aiOn&&SAMPLE?'A palavra é sorteada e os outros jogadores são controlados pelo Claude: frases, trocas e palpites são de verdade. A primeira jogada pede a sua permissão e cada resposta leva alguns segundos.':'A palavra é sempre a mesma e cada tela explica o que fazer.')+'</p>'+
      (SAMPLE?'<div class="btns"><button class="btn'+(aiOn?' primary':'')+'" data-act="demo-ai" aria-pressed="'+aiOn+'">Jogadores com IA (Claude): '+(aiOn?'ligado':'desligado')+'</button></div>':'')+
      '<div class="btns"><button class="btn primary" data-act="demo-mode" data-v="classico">Exemplo clássico · 5 jogadores</button><button class="btn" data-act="demo-mode" data-v="delator">Exemplo Delator · 6 jogadores</button></div>'+
      '<div class="btns"><button class="btn" data-act="'+(demoFrom==='home'?'menu-back':'go-join')+'">Voltar</button></div></section>';
  }
  if(menuStep==='demo2'){
    var del=demoMode==='delator',rl=del?[['emissor','Emissor','Escreve a frase com pistas da palavra secreta'],['cidadao','Intermediário','Troca duas palavras e passa a mensagem adiante'],['delator','Delator','Finge ajudar, mas entrega palavras ao Estado'],['receptor','Receptor','Tenta decifrar a palavra no final'],['leo','Leo, químico do Estado','Interroga e tenta adivinhar a palavra']]:[['emissor','Emissor','Escreve a frase com pistas da palavra secreta'],['cidadao','Cidadão-soldado do meio','Troca duas palavras e passa a mensagem adiante'],['receptor','Receptor','Tenta decifrar a palavra no final'],['leo','Leo, químico do Estado','Interroga e tenta adivinhar a palavra']];
    return '<section class="menu"><p class="kicker">'+(del?'Exemplo Delator':'Exemplo clássico')+'</p><h2 class="sub2">Qual papel você quer jogar?</h2>'+
      '<p>Cada papel tem uma função diferente. Escolha um para ver como ele funciona; depois você pode repetir com outro.</p>'+
      '<div class="btns">'+rl.map(function(x){return '<button class="btn" data-act="demo-start" data-r="'+(del&&x[0]==='cidadao'?'intermediario':x[0])+'">'+x[1]+'<small style="display:block;opacity:.7;font-size:12px;letter-spacing:0;text-transform:none">'+x[2]+'</small></button>';}).join('')+'</div>'+
      '<div class="btns"><button class="btn" data-act="go-demo">Voltar</button></div></section>';
  }
  if(menuStep==='join'){
    return '<section class="menu"><p class="kicker">Entrar</p><h2 class="sub2">Entrar em uma sessão</h2>'+who+
      '<div class="join"><input type="text" id="pcode" maxlength="5" autocomplete="off" placeholder="REGISTRO" aria-label="Número do registro"><button class="btn" data-act="join" '+(blocked?'disabled':'')+'>Entrar</button></div>'+
      '<div class="btns"><button class="btn" data-act="go-demo">Sessão de exemplo</button></div>'+
      (msg?'<p class="warn">'+esc(msg)+'</p>':'')+noticeHtml()+
      '<div class="btns"><button class="btn" data-act="menu-back">Voltar</button></div></section>';
  }
  return '<section class="menu home">'+
    tickerHtml()+
    '<h1>KALLOCAÍNA</h1>'+
    '<p class="sub">Comunicação Proibida</p>'+
    '<p class="tagline">Experiência interativa inspirada no universo e nos temas de Kallocaína, de Karin Boye.</p>'+
    '<p class="redact">Toda mensagem será <span class="bar">interceptada</span>. Toda palavra, <span class="bar">examinada</span>. Quem confia, <span class="bar">desaparece</span>.</p>'+
    '<div class="field"><label for="pname">Seu nome</label><input type="text" id="pname" maxlength="16" autocomplete="off" placeholder="Como o Estado vai chamar você"></div>'+
    '<div class="btns"><button class="btn primary" data-act="go-create" '+(blocked?'disabled':'')+'>Abrir nova sessão</button><button class="btn" data-act="go-join" '+(blocked?'disabled':'')+'>Entrar em uma sessão</button><button class="btn" data-act="go-demo">Sessão de exemplo</button>'+
    (last&&!offline?'<button class="btn" data-act="rejoin" '+(busy?'disabled':'')+'>Voltar à sessão '+esc(last)+'</button>':'')+'</div>'+
    (msg?'<p class="warn">'+esc(msg)+'</p>':'')+noticeHtml()+
    '<div class="row homelinks"><button class="btn ghost" data-act="rules">Regras</button><button class="btn ghost" data-act="about">Sobre o universo</button></div>'+
    '<div class="badges" aria-label="Informações da sessão"><div><b>5–6</b><span>jogadores</span></div><div><b>10–20</b><span>min / rodada</span></div></div></section>';
}
var rulesStep=0,rulesMode='classico';
function wds(list,cls){
  var n=0;
  return '<div class="wds">'+list.map(function(w,i){var c=cls&&cls[i]?' '+cls[i]:'';if(isSmall(w))return '<span class="wd fix">'+esc(w)+'</span>';n++;return '<span class="wd'+c+'"><i>'+n+'</i>'+esc(w)+'</span>';}).join('')+'</div>';
}
function flowHtml(nodes){
  return '<div class="flow">'+nodes.map(function(n,i){var ap=/apart/.test(n[1]||'');return (ap?'<span class="sep">fora do caminho</span>':(i?'<span class="arr">↓</span>':''))+'<span class="node '+(n[1]||'')+'">'+n[0]+'</span>';}).join('')+'</div>';
}
var RULE_SENT=['uma','pessoa','que','cuida','de','quem','está','doente','e','usa','jaleco','branco','no','hospital','sempre'];
var RULE_SENT_D=['uma','pessoa','que','cuida','de','quem','está','doente','e','usa','jaleco','branco','no','hospital','sempre','ouvindo','com','atenção','os','sintomas'];
var RULE_SWAP_D=['uma','pessoa','que','vende','de','quem','está','cansado','e','usa','jaleco','branco','no','hospital','sempre','ouvindo','com','atenção','os','sintomas'];
var RULE_SWAP=['uma','pessoa','que','vende','de','quem','está','cansado','e','usa','jaleco','branco','no','hospital','sempre'];
var RS={
 ideia:{t:'A ideia',h:
    '<p>Os <b>cidadãos-soldados</b> precisam passar uma <b>palavra secreta</b> adiante, escondida dentro de uma frase. <b>Leo Kall</b>, o químico do Estado, escuta tudo e tenta descobrir a palavra antes de ela chegar.</p>'+
    '<div class="ex"><div class="exh">Exemplo</div><div class="cardw"><small>Palavra secreta</small><b>Médico</b><small>Categoria: Profissões</small></div>'+
    flowHtml([['Quem sabe a palavra','ok'],['Frase com pistas',''],['Quem tenta adivinhar','ok'],['Leo Kall<br><small>só interroga, a frase não passa por ele</small>','bad apart']])+'</div>'+
    '<p class="dim">Cada um joga no próprio aparelho. Quem abre a sessão passa o número do registro aos outros e cada pessoa só vê a própria área. Quem abre a sessão também escolhe a dificuldade da palavra: fácil, médio, difícil ou muito difícil. Escolha o modo abaixo para ver as regras dele.</p>'},
 emissor:{t:'Emissor',h:
    '<p>O emissor escreve, em até 90 segundos, uma frase de <b>exatamente 12 palavras</b> que sirva de pista para a palavra secreta, sem dizê-la. Artigos e palavras de até 2 letras (como “de”, “e”, “a”) não contam: elas ficam fixas e ninguém pode trocá-las nem extraí-las.</p>'+
    '<div class="ex"><div class="exh">Palavra: Médico · Categoria: Profissões</div>'+wds(RULE_SENT)+
    '<p class="ok2">Vale: tem 12 palavras contadas. “de”, “e” e “no” ficam fixas e não entram na conta. A frase também não cita “médico”.</p></div>'+
    '<div class="ex"><div class="exh">Não vale</div>'+
    '<p class="no2">“um <b>médico</b> cuida de quem está doente” (usa a palavra)</p>'+
    '<p class="no2">“uma das <b>profissões</b> que cuida de gente” (usa o nome da categoria)</p>'+
    '<p class="no2">Frase com 11 ou 13 palavras contadas</p></div>'},
 dem:{t:'Emissor',h:
    '<p>O emissor escreve, em até 120 segundos, uma frase de <b>exatamente 16 palavras</b> que sirva de pista para a palavra secreta, sem dizê-la. Artigos e palavras de até 2 letras (como “de”, “e”, “a”, “os”) não contam: elas ficam fixas e ninguém pode trocá-las nem extraí-las.</p>'+
    '<div class="ex"><div class="exh">Palavra: Médico · Categoria: Profissões</div>'+wds(RULE_SENT_D)+
    '<p class="ok2">Vale: tem 16 palavras contadas. “de”, “e”, “no” e “os” ficam fixas e não entram na conta. A frase também não cita “médico”.</p></div>'+
    '<div class="ex"><div class="exh">Não vale</div>'+
    '<p class="no2">“um <b>médico</b> cuida de quem está doente” (usa a palavra)</p>'+
    '<p class="no2">“uma das <b>profissões</b> que cuida de gente” (usa o nome da categoria)</p>'+
    '<p class="no2">Frase com 15 ou 17 palavras contadas</p></div>'},
 troca:{t:'Troca',h:
    '<p>Cada intermediário troca <b>exatamente duas palavras</b> da frase, sem apagar a mensagem. Mudar demais atrapalha também os cidadãos-soldados que vêm depois. Cada jogada tem 60 segundos. Se o tempo acabar, duas palavras são apagadas ao acaso e o próximo recebe a mensagem com buracos, mas Leo ainda vê as originais: por isso é sempre melhor trocar. Enquanto espera, você pode dar um palpite sobre a palavra, que só aparece no relatório final.</p>'+
    '<div class="ex"><div class="exh">Uma troca de 2 palavras</div>'+
    wds(RULE_SWAP,{3:'new',7:'new',1:'red lock',10:'red lock'})+
    '<p>Verde: palavras novas. As vermelhas foram extraídas por Leo e estão travadas.</p></div>'+
    '<div class="ex"><div class="exh">Não vale</div>'+
    '<p class="no2">Trocar só uma letra: <span class="wd old">doente</span> → <span class="wd">doenta</span></p>'+
    '<p class="no2">Trocar palavra travada (vermelha)</p>'+
    '<p class="no2">Trocar menos ou mais de 2 palavras</p></div>'},
 olho:{t:'Olho da Polícia',h:
    '<p>Uma vez por rodada, a partir do segundo interrogatório, Leo pode usar o <b>Olho da Polícia</b> para ver uma palavra que foi trocada: a original e a que entrou no lugar. Essa posição também fica travada.</p>'+
    '<div class="ex"><div class="exh">Leo usa o Olho na posição 7</div>'+
    '<div class="swapx"><span class="wd old">doente</span><span class="arr">→</span><span class="wd new">cansado</span></div></div>'},
 deco:{t:'Decodificar',h:
    '<p>O <b>receptor</b> lê a frase final, depois das trocas, e digita a palavra secreta. Ele tem <b>2 tentativas</b> e 120 segundos. Ao mesmo tempo, Leo faz o último interrogatório e é obrigado a dar um palpite; ele também tem 120 segundos nessa etapa.</p>'+
    '<div class="ex"><div class="exh">O que o receptor vê</div>'+wds(RULE_SWAP,{3:'new',7:'new'})+
    '<div class="cardw"><small>Receptor digita</small><b>Médico</b></div></div>'+
    '<p>Se Leo acertar antes do último interrogatório, ou se o receptor errar, o <b>Estado vence</b>. Se o receptor acertar e Leo não, os <b>cidadãos-soldados vencem</b>. Se os dois acertarem no último interrogatório, é <b>empate</b>.</p>'},
 decoD:{t:'Decodificar',h:
    '<p>O <b>receptor</b> lê a frase final, depois das trocas, e digita a palavra secreta. Ele tem <b>2 tentativas</b> e 120 segundos. Ao mesmo tempo, Leo faz o último interrogatório e é obrigado a dar um palpite; ele também tem 120 segundos nessa etapa.</p>'+
    '<div class="ex"><div class="exh">O que o receptor vê</div>'+wds(RULE_SWAP_D,{3:'new',7:'new'})+
    '<div class="cardw"><small>Receptor digita</small><b>Médico</b></div></div>'+
    '<p>Se Leo acertar antes do último interrogatório, ou se o receptor errar, o <b>Estado vence</b>. Se o receptor acertar e Leo não, os <b>cidadãos-soldados vencem</b>. Se os dois acertarem no último interrogatório, é <b>empate</b>.</p>'},
 trocaD:{t:'Troca',h:
    '<p>Cada intermediário troca <b>exatamente duas palavras</b> da frase, sem apagar a mensagem. Mudar demais atrapalha também os cidadãos-soldados que vêm depois. Cada jogada tem 60 segundos. Se o tempo acabar, duas palavras são apagadas ao acaso e o próximo recebe a mensagem com buracos, mas Leo ainda vê as originais: por isso é sempre melhor trocar. Enquanto espera, você pode dar um palpite sobre a palavra, que só aparece no relatório final.</p>'+
    '<div class="ex"><div class="exh">Uma troca de 2 palavras</div>'+
    wds(RULE_SWAP_D,{3:'new',7:'new',1:'red lock',10:'red lock'})+
    '<p>Verde: palavras novas. As vermelhas foram extraídas por Leo e estão travadas.</p></div>'+
    '<div class="ex"><div class="exh">Não vale</div>'+
    '<p class="no2">Trocar só uma letra: <span class="wd old">doente</span> → <span class="wd">doenta</span></p>'+
    '<p class="no2">Trocar palavra travada (vermelha)</p>'+
    '<p class="no2">Trocar menos ou mais de 2 palavras</p></div>'}
};
function ruleSteps(){
  var L={t:'Leo interroga',h:
    '<p>Leo interroga <b>ao mesmo tempo</b> que o cidadão-soldado da etapa troca as palavras, vendo a mensagem como ela chegou a ele. Escolhe posições da frase, vê as palavras que estão lá e pode arriscar um palpite. No <b>último</b> interrogatório, junto com a decodificação do receptor, o palpite é <b>obrigatório</b>.</p>'+
    '<div class="ex"><div class="exh">Leo pediu as posições 2 e 9</div>'+wds(RULE_SENT,{1:'red lock',10:'red lock'})+
    '<p>As palavras em vermelho foram <b>extraídas</b> por Leo e ficam <b>travadas</b>: ninguém pode trocar essas posições.</p></div>'+
    ''};
  if(rulesMode==='delator'){
    return [RS.ideia,
    {t:'Os papéis',h:
      '<p>São <b>6 pessoas</b>, e todos sabem quem é Leo. Entre os 5 cidadãos-soldados há um <b>delator</b>, que trabalha para o Estado em segredo e nunca é o emissor.</p>'+
      '<p class="dim">O papel do delator é uma criação do jogo: ele não existe exatamente dessa forma no livro. Foi inspirado no ambiente de vigilância, desconfiança e denúncias que caracteriza o Estado Mundial.</p>'+
      '<div class="ex"><div class="exh">Quem é quem</div>'+
      flowHtml([['Emissor<br><small>sabe a palavra</small>','ok'],['Cidadãos-soldados intermediários<br><small>um deles é o delator</small>',''],['Receptor<br><small>o último que sobrar</small>','ok'],['Leo Kall<br><small>público para todos · só interroga, a frase não passa por ele</small>','bad apart']])+'</div>'},
    RS.dem,
    {t:'O caminho',h:
      '<p>Aqui o caminho é <b>escolhido pelos jogadores</b>. O emissor escolhe quem recebe a frase primeiro. Quem recebe troca duas palavras e escolhe o próximo entre quem ainda não tocou na mensagem. O último que sobrar vira o receptor.</p>'+
      '<div class="ex"><div class="exh">Exemplo</div>'+
      flowHtml([['Emissor escolhe Ana',''],['Ana troca 2 palavras e escolhe Bia',''],['Bia troca 2 palavras e escolhe Caio',''],['Caio troca 2 palavras e Dani sobra como receptor','ok']])+'</div>'},
    {t:'Leo interroga',h:
      '<p>Leo faz <b>3 interrogatórios</b>, sempre com 2 palavras, e uma etapa de denúncia, que vem depois da troca do delator (Leo não interroga o delator). Em cada uma das 4 etapas ele pode arriscar um palpite. O interrogatório acontece ao mesmo tempo que a troca da etapa, e a última, junto com a decodificação, exige palpite.</p>'+
      '<div class="ex"><div class="exh">Leo pediu as posições 2 e 9</div>'+wds(RULE_SENT_D,{1:'red lock',10:'red lock'})+
      '<p>As palavras em vermelho foram <b>extraídas</b> e ficam <b>travadas</b>: ninguém pode trocar essas posições.</p></div>'+
      ''},
    RS.trocaD,
    {t:'O delator',h:
      '<p>O delator troca duas palavras como os outros e, em segredo, <b>entrega duas palavras a Leo</b>. Elas aparecem na tela de Leo marcadas como denúncia. Pode entregar palavras fortes e ainda confundir no resto. Na etapa seguinte à troca do delator, Leo <b>não interroga</b> essa mensagem: ele só recebe as duas palavras da denúncia e ainda pode dar seu palpite. Se o delator sobrar como receptor, ele entrega a decodificação ao Estado.</p>'+
      '<div class="ex"><div class="exh">O que o delator faz</div>'+
      flowHtml([['Troca 2 palavras como todos',''],['Escolhe 2 palavras e entrega a Leo','bad']])+'</div>'},
    RS.olho,
    RS.decoD,
    {t:'Votação e pontos',h:
      '<p>Ao fim da rodada, os cidadãos-soldados veem o histórico de trocas e cada um vota em quem acha que foi o delator.</p>'+
      '<div class="ex"><div class="pts">'+
      '<div class="pt ok"><b>+2</b><span>cada cidadão-soldado honesto, se o receptor acertar e Leo não</span></div>'+
      '<div class="pt ok"><b>+1</b><span>cada cidadão-soldado honesto por palpite errado de Leo</span></div>'+
      '<div class="pt ok"><b>+1</b><span>cada cidadão-soldado honesto, no empate</span></div>'+
      '<div class="pt ok"><b>+1</b><span>quem acertar o voto no delator</span></div>'+
      '<div class="pt bad"><b>+5</b><span>Leo, se o Estado vencer</span></div>'+
      '<div class="pt bad"><b>+5</b><span>o delator, se o Estado vencer (os mesmos de Leo)</span></div>'+
      '<div class="pt bad"><b>+2</b><span>Leo e o delator, no empate</span></div></div></div>'+
      '<p class="dim">No fim das rodadas, quem tem mais pontos é o campeão.</p>'}];
  }
  return [RS.ideia,
    {t:'Os papéis',h:
      '<p>São <b>5 pessoas</b>. Os papéis são sorteados a cada rodada e o de Leo gira entre todos.</p>'+
      '<div class="ex"><div class="exh">O caminho da mensagem</div>'+
      flowHtml([['Emissor<br><small>sabe a palavra</small>','ok'],['Intermediário 1',''],['Intermediário 2',''],['Receptor<br><small>adivinha</small>','ok'],['Leo Kall<br><small>interroga entre as trocas e tenta adivinhar a palavra</small>','bad apart']])+'</div>'+
      '<p class="dim">Etapas: emissão; depois, Leo e os cidadãos-soldados jogam juntos em cada etapa: interrogatório 1 e troca 1, interrogatório 2 e troca 2, interrogatório 3 e decodificação.</p>'},
    RS.emissor,
    {t:L.t,h:L.h.replace('<p>Leo interroga <b>ao mesmo tempo</b>','<p>Leo faz 3 interrogatórios (2 palavras em cada), cada um <b>ao mesmo tempo</b>')},
    RS.troca,RS.olho,RS.deco,
    {t:'Pontos',h:
      '<p>O placar acumula na sessão. No fim das rodadas, quem tem mais pontos é o campeão.</p>'+
      '<div class="ex"><div class="pts"><div class="pt ok"><b>+2</b><span>cada cidadão-soldado honesto, se o receptor acertar e Leo não</span></div>'+
      '<div class="pt ok"><b>+1</b><span>cada cidadão-soldado honesto, no empate</span></div>'+
      '<div class="pt ok"><b>+1</b><span>cada cidadão-soldado honesto por palpite errado de Leo, mesmo se o Estado vencer</span></div>'+
      '<div class="pt bad"><b>+5</b><span>Leo, se o Estado vencer</span></div>'+
      '<div class="pt bad"><b>+2</b><span>Leo, no empate</span></div></div></div>'+
      '<p class="dim">Por isso Leo precisa ter cuidado com os palpites.</p>'}];
}
function sRules(){
  var st=ruleSteps(),n=st.length;if(rulesStep<0)rulesStep=0;if(rulesStep>n-1)rulesStep=n-1;
  var cur=st[rulesStep],dots='';
  for(var i=0;i<n;i++)dots+='<button type="button" class="dotb'+(i===rulesStep?' on':'')+'" data-act="rules-go" data-v="'+i+'" aria-label="Passo '+(i+1)+'"></button>';
  var tabs='<div class="opts rtabs" role="radiogroup" aria-label="Modo">'+
    '<button type="button" class="opt" role="radio" data-act="rules-mode" data-v="classico" aria-checked="'+(rulesMode==='classico')+'">Clássico<small>5 jogadores</small></button>'+
    '<button type="button" class="opt" role="radio" data-act="rules-mode" data-v="delator" aria-checked="'+(rulesMode==='delator')+'">Delator<small>6 jogadores</small></button></div>';
  return '<section class="doc rl"><div class="head"><span>Manual do Cidadão-soldado</span><b>Passo '+(rulesStep+1)+' de '+n+'</b></div>'+
  tabs+'<div class="dots">'+dots+'</div>'+
  '<h2>'+cur.t+'</h2>'+cur.h+
  '<div class="row">'+(rulesStep>0?'<button class="btn" data-act="rules-go" data-v="'+(rulesStep-1)+'">Anterior</button>':'<button class="btn" data-act="back">Sair</button>')+
  (rulesStep<n-1?'<button class="btn primary" data-act="rules-go" data-v="'+(rulesStep+1)+'">Próximo</button>':'<button class="btn primary" data-act="back">Entendi</button>')+'</div>'+(rulesStep>=n-1&&!code?'<div class="btns"><button class="btn primary" data-act="rules-demo">Ir para a sessão de exemplo</button></div>':'')+'</section>';
}
function sAbout(){
  return '<section class="doc"><div class="head"><span>Dossiê histórico</span><b>Arquivo aberto</b></div>'+
  '<h2>Sobre o universo</h2>'+
  '<p>Kallocaína é um romance de 1940 da escritora sueca Karin Boye. Ele se passa num Estado Mundial totalitário, onde cada cidadão-soldado vive vigiado e a desconfiança entre vizinhos, colegas e famílias é parte do sistema.</p>'+
  '<p>O químico Leo Kall inventa a kallocaína, uma droga que faz quem a recebe revelar pensamentos, sentimentos e segredos íntimos. Para o Estado, é a ferramenta perfeita de controle. Leo é também o narrador: a história é contada em suas memórias, atravessadas por suas convicções, suas inseguranças e as transformações psicológicas que ele vive. O que está em jogo é a confiança, quando ninguém consegue guardar um pensamento só para si.</p>'+
  '<p><b>O que é do jogo.</b> Os cidadãos-soldados tentam passar uma palavra adiante por mensagens que o Estado intercepta. A extração de palavras feita por Leo é uma representação lúdica do efeito da kallocaína, e não o que ela faz de fato no livro. O delator também é uma criação do jogo: não existe exatamente assim na obra, mas foi inspirado no ambiente de vigilância, desconfiança e denúncias do Estado Mundial.</p>'+
  '<p>Cada palavra extraída é uma pequena perda de privacidade. Cada troca é uma tentativa de proteger a mensagem.</p>'+
  '<div class="row"><button class="btn primary" data-act="back">Voltar</button></div></section>';
}
function tickerHtml(){
  var t='Estado Mundial · Cidade Química n.º 4 · Os olhos e os ouvidos da Polícia · ';
  return '<div class="ticker" aria-label="Estado Mundial · Cidade Química n.º 4"><div class="tk-track" aria-hidden="true"><span>'+t+'</span><span>'+t+'</span></div></div>';
}
function sBoot(){
  after=null;
  return '<section class="menu home">'+tickerHtml()+'<h1>KALLOCAÍNA</h1><p class="sub">Comunicação Proibida</p><p class="label muted pulse">Conectando ao Estado</p></section>';
}
function sLoading(){
  after=null;
  return '<section class="lock"><h2 class="who" style="font-size:clamp(28px,9vw,44px)">KALLOCAÍNA</h2><p class="label muted pulse">Conectando à sessão '+esc(code)+'</p>'+
    (roomLoaded&&!room?'<p>Sessão não encontrada.</p><button class="btn" data-act="leave">Voltar ao menu</button>':'')+noticeHtml()+'</section>';
}
function sLobby(){
  var ids=playerIds(),n=ids.length,need=cfg().n;
  var cells=ids.map(function(id){return '<div class="pbtn ok">'+esc(players[id].name)+(id===uid?' (você)':'')+'<small>'+(id===room.host?'Anfitrião':'Na sala')+'</small></div>';});
  for(var i=n;i<need;i++)cells.push('<div class="pbtn empty">Vaga livre<small>Aguardando</small></div>');
  return '<section class="menu"><p class="kicker">Sessão de interrogatório · '+(isDel()?'Modo Delator':'Modo clássico')+' · Palavras: '+esc(lvName(room.diff))+'</p>'+
    '<h2 class="sub2">Convoque os cidadãos-soldados</h2>'+
    '<div class="roomcode"><span class="label muted">Número do registro</span><b>'+esc(code)+'</b></div>'+
    '<p>Passe o código aos outros jogadores. Eles abrem este mesmo link, escrevem o nome e entram. São necessários exatamente '+need+'. A sessão terá '+tot()+(tot()===1?' rodada.':' rodadas.')+'</p>'+
    '<div class="plist">'+cells.join('')+'</div>'+noticeHtml()+
    '<div class="row"><button class="btn primary" data-act="start" '+(n===need&&!busy?'':'disabled')+'>Iniciar sessão ('+n+'/'+need+')</button><button class="btn" data-act="leave">Sair da sessão</button></div></section>';
}
var ICO_EYE='<svg class="bico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1.5 12Q12 2.5 22.5 12Q12 21.5 1.5 12Z"/><circle cx="12" cy="12" r="4.2"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/></svg>',ICO_SYR='<svg class="bico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><g transform="rotate(45 12 12)"><path d="M8 2.5h8M12 2.5V6M8 6h8M9 6v10h6V6M12 16v6M9 9.5h2.2M9 12.5h2.2"/></g></svg>';
var EMB_CIT='data:image/png;base64,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',EMB_LEO='data:image/jpeg;base64,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';
function roleCardHtml(role,withButton){
  var r=roleData(role);
  return '<section class="doc"><div class="head"><span>Ordem de serviço individual</span><b>Só para você</b></div>'+
    '<div class="emblem"><img alt="" src="'+(role==='leo'?EMB_LEO:EMB_CIT)+'"></div>'+
    '<h2>'+esc(r.t)+'</h2>'+
    '<span class="stamp slam rolestamp">'+esc(r.s)+'</span>'+
    r.d.map(function(x){return '<p>'+esc(x)+'</p>';}).join('')+
    '<p class="dim">Guarde seu papel em segredo. Ninguém mais vê esta tela.</p>'+(withButton||'')+'</section>';
}
var prepReady='',prepPending='';
function sPrep(){
  var pk=code+':'+room.roundNo;
  if(prepReady!==pk){
    if(prepPending!==pk){prepPending=pk;setTimeout(function(){prepReady=pk;lastSig='';render();},1200);}
    after=null;
    return '<section class="lock"><p class="label muted pulse">Recebendo sua ordem de serviço</p></section>';
  }
  var me=players[uid],acked=me&&me.ack===room.roundNo;
  var ids=playerIds(),allAck=ids.length===cfg().n&&ids.every(function(i){return players[i].ack===room.roundNo;});
  var btn='<div class="row"><button class="btn primary" data-act="ack" '+(acked||busy?'disabled':'')+'>'+(acked?'Ciente ✓':'Entendi meu papel')+'</button></div>';
  return roleCardHtml(myRole(),btn)+
    '<section class="menu" style="padding-top:30px"><p class="label muted">Rodada '+room.roundNo+' · jogadores prontos</p>'+
    leoLineHtml()+
    '<div class="plist">'+ids.map(function(id){var ok=players[id].ack===room.roundNo;return '<div class="pbtn '+(ok?'ok':'')+(isDel()&&id===R().leo?' leo':'')+'">'+esc(players[id].name)+(id===uid?' (você)':'')+'<small>'+(isDel()&&id===R().leo?'Leo Kall · ':'')+(ok?'Ciente ✓':'Lendo o papel')+'</small></div>';}).join('')+'</div>'+
    ((room.roundNo>1||Object.keys(room.scores).some(function(k){return room.scores[k];}))?'<div><p class="label muted" style="margin-bottom:6px">Placar acumulado</p>'+boardHtml()+'</div>':'')+
    noticeHtml()+
    '<div class="row"><button class="btn primary" data-act="begin" '+(allAck&&!busy?'':'disabled')+'>Iniciar rodada</button></div></section>';
}

var waitStart=0,waitKey='',waitIv=null;
function waitTimer(key){
  if(waitKey!==key){waitKey=key;waitStart=Date.now();}
  clearInterval(waitIv);
  function paint(){
    var el=$('#waitT');if(!el||!R()){clearInterval(waitIv);return;}
    var sec=Math.floor((Date.now()-waitStart)/1000);
    el.textContent='Etapa '+(R().step+1)+' de '+steps().length+' · aguardando '+Math.floor(sec/60)+':'+('0'+(sec%60)).slice(-2);
  }
  paint();waitIv=setInterval(paint,1000);
}
function pathLineHtml(showDel){
  var r=R(),ids,labels;
  if(isDel()){
    ids=r.chain.concat(r.receptor?[r.receptor]:[]);
    labels=ids.map(function(_,i){return i===0?'Emissor':(r.receptor&&i===ids.length-1?'Receptor':'Troca '+i);});
  }else{ids=[r.emissor,r.int1,r.int2,r.receptor];labels=['Emissor','Troca 1','Troca 2','Receptor'];}
  return '<div class="track" style="--n:'+ids.length+'" role="img" aria-label="Caminho da mensagem"><div class="tline"><i class="ball"></i></div>'+
    ids.map(function(id,i){return '<div class="pnode'+(showDel&&isDel()&&id===r.delator?' del':'')+'"><i class="dot"></i><b>'+esc(nm(id))+'</b><small>'+labels[i]+'</small></div>';}).join('')+'</div>';
}
function guessBoxHtml(){
  var r=R(),cur=r.step,acted=false;
  if(uid===r.emissor||uid===r.leo||uid===r.receptor)return '';
  for(var i=1;i<cfg().leos;i++){if(citActor(i)===uid&&(i<cur||(i===cur&&citDone(i))))acted=true;}
  if(!acted)return '';
  var mine=r.tries&&r.tries[uid];
  if(mine)return '<div class="gbox"><span class="label muted">Seu palpite</span><p>Registrado: <b>“'+esc(mine)+'”</b>. Só aparece no relatório final.</p></div>';
  return '<div class="gbox"><span class="label muted">Enquanto espera · opcional</span><p>Qual você acha que é a palavra? Categoria: '+esc(r.cat)+'. Só aparece no relatório final, não vale ponto.</p>'+
    '<div class="join"><input type="text" id="tg" maxlength="24" autocomplete="off" placeholder="Acho que é..."><button class="btn" data-act="tg-ok" '+(busy?'disabled':'')+'>Registrar</button></div></div>';
}
function waitPanel(){
  var st=steps(),cur=R().step,L=cfg().leos,lab=function(x,i){return x==='emit'?'Emissão':(i<L?'Troca '+i+' + Interrogatório '+i:'Decodificação + Interrogatório '+i);};
  var tl=st.map(function(x,i){return '<span class="stg '+(i<cur?'done':(i===cur?'now':''))+'">'+(i<cur?'✓ ':(i===cur?'▶ ':''))+lab(x,i)+'</span>';}).join('');
  var rv=revealList().filter(function(v){return v.pos&&v.pos.length;}),words='';
  rv.forEach(function(v){v.pos.forEach(function(p,i){words+='<span class="wd red"><i>'+pn(p)+'</i>'+esc(v.words[i])+'</span>';});});
  return '<div class="wpanel"><span class="label muted">Onde a mensagem está</span><div class="stgs">'+tl+'</div>'+
    '<span class="label muted">O Estado já extraiu</span>'+(words?'<div class="wds w4">'+words+'</div>':'<p class="small muted">&gt; nada ainda</p>')+'</div>';
}
function waitWho(){
  var r=R(),n=[];
  if(r.step===0)n=[r.emissor];else{if(!leoDone(r.step))n.push(r.leo);if(!citDone(r.step))n.push(citActor(r.step));}
  n=n.filter(function(i){return i&&players[i];}).map(function(i){return esc(nm(i));});
  return '<p class="small muted">'+(n.length?'Esperando: '+n.join(' e ')+'.':'Concluindo a etapa...')+' <button type="button" class="linkb" data-act="resync">Atualizar</button></p>';
}
function sWait(){
  var role=myRole(),r=roleData(role),txt,stp=R().step;
  if(role==='leo')txt=stp===0?'O emissor está escrevendo a mensagem. O Estado vai interrogar assim que ela sair.':'Seu interrogatório desta etapa terminou. Aguarde os cidadãos-soldados concluírem a deles.';
  else if(stp===0)txt='O emissor está escrevendo a mensagem. Aguarde.';
  else txt=(isDel()?'A mensagem está com outro cidadão-soldado, enquanto o Estado a interroga. Aguarde.':'A mensagem segue pela cadeia, enquanto o Estado a interroga. Aguarde a sua vez.');
  var hist='';
  if(role==='leo'){
    var lines=leoLines();
    hist='<div class="log" style="border:0"><span class="label muted">Arquivo da Polícia</span>'+(lines.length?lines.map(function(h){return '<span>'+h+'</span>';}).join(''):'<span class="muted">&gt; nenhum registro ainda</span>')+'</div>';
  }
  after=function(){waitTimer(code+':'+room.roundNo+':'+R().step);var tg=$('#tg');if(tg)tg.addEventListener('keydown',function(e){if(e.key==='Enter')ACT['tg-ok']();});};
  if(role!=='leo')hist=guessBoxHtml()+waitPanel();
  return '<section class="lock"><span class="label muted">Seu papel: '+esc(r.t)+' · '+esc(r.s)+'</span>'+leoLineHtml()+
    '<h2 class="who pulse">Aguarde</h2><p>'+txt+'</p>'+'<div class="scan" aria-hidden="true"><span>&gt; escutando pelos ouvidos da Polícia</span><span>&gt; sinal interceptado</span><span>&gt; aguardando transmissão</span></div><p class="small muted" id="waitT"></p>'+waitWho()+hist+noticeHtml()+'<div class="row"><button class="btn" data-act="leave">Sair da sessão</button></div></section>';
}

function updEmit(){
  var ta=$('#msg');if(!ta)return;
  var c=emitCheck(ta.value),n=c.nb;
  var ct=$('#cnt');ct.textContent=n+'/'+NW()+' palavras';ct.className='counter'+(n>NW()?' bad':'');
  $('#err').textContent=ta.value.trim()?c.errs.join(' '):'';
  $('[data-act=emit-ok]').disabled=!c.ok||busy||(isDel()&&!loc.next);
}
function sEmit(){
  var r=R();
  after=function(){
    var ta=$('#msg');
    ta.addEventListener('input',updEmit);updEmit();if(!ta.dataset.f){ta.dataset.f=1;if(!COARSE)ta.focus();}
  };
  return '<section class="doc"><div class="head"><span>Mensagem sob vigilância</span><b>Emissor</b></div>'+
    '<div class="secret"><span class="label">Palavra secreta · só você vê</span><b>'+esc(r.word)+'</b><span class="label">Categoria: '+esc(r.cat)+'</span></div>'+
    '<p>Escreva uma frase de exatamente '+NW()+' palavras que faça o receptor descobrir a palavra, sem citá-la. Artigos e palavras de até 2 letras (“de”, “a”, “e”) não contam e ficam fixas. Os intermediários vão alterá-la antes que ela chegue.</p>'+
    '<div><textarea id="msg" rows="3" placeholder="Escreva as '+NW()+' palavras da sua frase (de, a, e… não contam)" autocomplete="off"></textarea>'+
    '<div class="counter" id="cnt">0/'+NW()+' palavras</div><div class="err" id="err"></div></div>'+
    (isDel()?pickHtml(candidates(),'Um dos quatro é o delator. Você não sabe quem.'):'')+
    noticeHtml()+
    '<div class="row"><button class="btn primary" data-act="emit-ok" disabled>Confirmar mensagem</button></div></section>';
}

function sLeo(k){
  var r=R(),msg=leoView(k),L=cfg().leos,need=needFor(k),pickable=leoPick(k);
  var used={},oldW={};
  revealList().forEach(function(v){if(v.k<k)v.pos.forEach(function(p,i){used[p]=1;oldW[p]=v.words[i];});});
  var lk=r.leak||null;
  if(lk&&lk.k<k){lkP(lk).forEach(function(p,i){used[p]=1;oldW[p]=lkW(lk)[i];});}
  var leakHere=(lk&&lk.k===k)?lkP(lk):[];
  var pw=r.power||null;
  if(pw&&pw.k<k){used[pw.pos]=1;oldW[pw.pos]=pw.to;}
  var pwHere=(pw&&pw.k===k)?pw.pos:-1;
  var powerHtml=pw?'<p class="small muted">Olho da Polícia já usado nesta rodada.</p>':'<div class="row"><button class="btn red" data-act="power" '+(k<2||busy?'disabled':'')+'>'+ICO_EYE+'Olho da Polícia · revelar 1 palavra alterada</button></div>'+(k<2?'<p class="small muted lg">Disponível a partir do interrogatório 2, quando já houver palavra alterada.</p>':'');
  var cur=revealOf(k),gs=guessOf(k),lo=leakOnly(k),hasRev=!!cur||lo;
  if(!loc.sel)loc.sel=[];
  after=function(){
    $$('.tk[data-scr]').forEach(scramble);
    var gi=$('#guess');
    if(gi){gi.addEventListener('input',function(){$('[data-act=guess-ok]').disabled=!gi.value.trim()||busy;});
      gi.addEventListener('keydown',function(e){if(e.key==='Enter'&&gi.value.trim())ACT['guess-ok']();});
      if(!gi.dataset.f){gi.dataset.f=1;if(!COARSE)gi.focus();}
      $('[data-act=guess-ok]').disabled=!gi.value.trim()||busy;}
  };
  var toks=msg.map(function(w,i){
    if(leakHere.indexOf(i)>-1)return '<button class="tk leak" disabled>'+esc(w)+'<small>denúncia</small></button>';
    if(i===pwHere)return '<button class="tk open" disabled data-scr="p'+pw.pos+'" data-w="'+esc(pw.to)+'"><span class="w">'+esc(pw.to)+'</span><small>palavra trocada</small><small>antes era “'+esc(pw.from)+'”</small></button>';
    if(cur&&cur.pos.indexOf(i)>-1)return '<button class="tk open" disabled data-scr="'+k+'-'+i+'" data-w="'+esc(w)+'"><span class="w">'+esc(w)+'</span><small>'+(msgOf(k-1)[i]===ERASED?'extraída · original, apagada para os cidadãos-soldados':'extraída agora')+'</small></button>';
    if(used[i])return '<button class="tk old" disabled>'+esc(oldW[i])+'<small>já extraída</small></button>';
    if(isSmall(w))return '<button class="tk fixed" disabled>'+esc(w)+'<small>fixa</small></button>';
    var m=new Array(Math.min(6,Math.max(3,norm(w).length))+1).join('▒');
    return '<button class="tk'+(pickable.indexOf(i)<0?' old':'')+(loc.sel.indexOf(i)>-1?' sel':'')+'" data-act="tk" data-p="'+i+'" '+(hasRev||pickable.indexOf(i)<0?'disabled':'')+'>'+m+'<small><span class="lg">posição </span><span class="sm">#</span>'+pn(i)+'</small></button>';
  }).join('');
  var lines=leoLines();
  var action;
  if(gs){
    action='<p>'+(gs.skipped?'Nenhum palpite registrado neste interrogatório.':'✗ Palpite “'+esc(gs.text)+'” incorreto. Registrado no arquivo da Polícia.')+'</p>'+
      '<div class="row"><button class="btn primary" data-act="leo-next" '+(busy?'disabled':'')+'>'+(k<L?'Encerrar interrogatório':'Encerrar interrogatório final')+'</button></div>';
  }else if(hasRev){
    action='<div class="dock">'+(lo?'<p>Etapa sem interrogatório: você recebeu só as duas palavras da denúncia do delator, marcadas na mensagem. Você ainda pode dar seu palpite.</p>':'')+'<div><label class="label" for="guess">Palavra interceptada</label>'+
      '<input type="text" id="guess" maxlength="24" autocomplete="off" placeholder="Digite seu palpite" style="margin-top:6px"></div>'+
      '<p class="small muted">Cada interrogatório permite uma tentativa. Tentativas não usadas se perdem. Cada palpite errado dá 1 ponto a cada cidadão-soldado.</p>'+
      '<div class="row"><button class="btn primary" data-act="guess-ok" disabled>Registrar tentativa</button>'+(k<L?'<button class="btn" data-act="guess-skip" '+(busy?'disabled':'')+'>Seguir sem palpite</button>':'')+'</div>'+(k<L?'':'<p class="small muted">Último interrogatório: o palpite é obrigatório.</p>')+'</div>';
  }else{
    action='<p class="small">Escolha exatamente '+['nenhuma','uma','duas','três'][need]+' palavra(s) para aplicar a kallocaína ('+loc.sel.length+'/'+need+').</p>'+
      '<div class="row"><button class="btn primary" data-act="serum" '+(loc.sel.length===need&&!busy?'':'disabled')+'>'+ICO_SYR+'Aplicar kallocaína</button></div>';
  }
  return '<section class="term"><div class="bar2"><span class="lg">Laboratório · Leo Kall</span><span>'+(isDel()?'Etapa ':'Interrogatório ')+k+' de '+L+'</span></div><div class="body">'+
    '<div class="stats"><span><span class="lg">'+(isDel()?'Etapas':'Interrogatórios')+' restantes: </span><span class="sm">'+(isDel()?'Etapas':'Interrog.')+' </span><b>'+(L-k+(gs?0:1))+'</b></span><span><span class="lg">Tentativas restantes: </span><span class="sm">Tentativas </span><b>'+(L-(k-1)-(gs?1:0))+'</b></span><span><span class="lg">Categoria suspeita: </span><b>'+esc(r.cat)+'</b></span></div>'+
    '<div><p class="label" style="margin-bottom:8px">Mensagem interceptada · '+msg.filter(function(w){return !isSmall(w);}).length+' palavras</p><div class="msgrow">'+toks+'</div></div>'+action+powerHtml+noticeHtml()+
    '<div class="log"><span class="label muted">Arquivo da Polícia</span>'+(lines.length?lines.map(function(h){return '<span>'+h+'</span>';}).join(''):'<span class="muted caret">&gt; nenhum registro ainda </span>')+'</div>'+
    '</div></section>';
}

function isSmall(w){return norm(w).length<=2;}
function pn(p){var m=msgOf(0);if(!m)return p+1;var n=0;for(var i=0;i<=p&&i<m.length;i++)if(!isSmall(m[i]))n++;return n||p+1;}
function leoPick(k){
  var msg=leoView(k),used={},r=R();
  revealList().forEach(function(v){if(v.k<k)v.pos.forEach(function(p){used[p]=1;});});
  if(r.leak&&r.leak.k<=k)lkP(r.leak).forEach(function(p){used[p]=1;});
  if(r.power&&r.power.k<=k)used[r.power.pos]=1;
  var big=[];
  msg.forEach(function(w,i){if(used[i]||isSmall(w))return;big.push(i);});
  return big;
}
function needFor(k){return Math.min(needN(k),leoPick(k).length);}
function modPickable(k){
  var msg=msgOf(k-1),seen=seenMap(k),big=[];
  msg.forEach(function(w,i){if(seen[i]||isSmall(w))return;big.push(i);});
  return big;
}
function seenMap(k){var seen={};revealList().forEach(function(v){if(v.k<k)v.pos.forEach(function(p){seen[p]=1;});});var lk=R().leak;if(lk&&lk.k<=k)lkP(lk).forEach(function(p){seen[p]=1;});var pw=R().power;if(pw&&pw.k<k)seen[pw.pos]=1;return seen;}
function sMod(k){
  var msg=msgOf(k-1),mods=cfg().mods,del=isDel(),isD=myRole()==='delator';
  if(!loc.sel){loc.sel=[];loc.vals={};}
  var seen=seenMap(k);
  after=function(){$$('#reps input').forEach(bindRep);updMod(k);typeIn($('#chips'),code+':'+room.roundNo+':'+R().step+':chips');swapSeen[code+':'+room.roundNo+':'+R().step+':chips']=1;};
  var cands=del&&k<mods?candidates():[];
  var help=k===mods-1?'O cidadão-soldado que não for escolhido será o receptor.':'';
  return '<section class="doc"><div class="head"><span>Transmissão sob vigilância</span><b>'+(isD?'Delator':'Intermediário')+'</b></div>'+
    '<h2>Altere duas palavras</h2>'+
    '<p>Toque em duas palavras da mensagem e escreva uma substituta para cada uma. Mantenha o sentido geral para o receptor, mas confunda o Estado.</p>'+
    (Object.keys(seen).length?'<p class="dim"><span class="legend-seen"></span>Marcadas em vermelho: palavras que o Estado já viu. Elas ficam travadas e não podem ser trocadas.</p>':'')+
    '<div class="msgline" id="chips">'+chipsHtml(k,seen,!swapSeen[code+':'+room.roundNo+':'+R().step+':chips'])+'</div>'+
    '<div class="preview" id="prev"></div>'+
    (isD?'<div class="secretbox"><span class="label">Denúncia · só você vê</span><p>Escolha <b>duas palavras</b> da mensagem que você vai passar adiante. Elas aparecem na tela de Leo marcadas como denúncia. Escolha as mais fortes e confunda no resto.</p><div class="msgline" id="leaks"></div></div>':'')+
    (cands.length?pickHtml(cands,help):'')+
    '<div class="dock">'+
    '<div id="reps" style="display:flex;flex-direction:column;gap:8px">'+repsHtml(k)+'</div>'+
    '<div class="counter" id="cnt">Substituições: 0/2</div>'+
    noticeHtml()+
    '<div class="row"><button class="btn primary" data-act="mod-ok" disabled>Confirmar transmissão</button></div></div></section>';
}
function chipsHtml(k,seen,anim){
  var mp=modPickable(k),pc=(k>=2&&anim)?changesOf(k-1):[],pm=k>=2?msgOf(k-2):null;
  return msgOf(k-1).map(function(w,i){
    var sw=pc.indexOf(i)>-1;
    return '<button class="chip'+(isSmall(w)?' fixed':'')+(loc.sel.indexOf(i)>-1?' sel':'')+(seen[i]?' seen':'')+(sw?' swapped':'')+'" data-act="chip" data-p="'+i+'" '+(mp.indexOf(i)<0?'disabled title="'+(isSmall(w)?'Palavra fixa':'Palavra travada')+'"':'')+'>'+(sw&&pm?'<s class="was">'+esc(pm[i])+'</s>':'')+esc(w)+'</button>';
  }).join('');
}
function repsHtml(k){
  var msg=msgOf(k-1);
  return loc.sel.slice().sort(function(a,b){return a-b;}).map(function(p){
    return '<label class="rep" for="rep'+p+'"><span>“'+esc(msg[p])+'” →</span><input type="text" id="rep'+p+'" data-p="'+p+'" value="'+esc(loc.vals[p]||'')+'" maxlength="24" autocomplete="off"><em id="err'+p+'"></em></label>';}).join('');
}
function updMod(k){
  var c=modCheck(k),msg=msgOf(k-1),mods=cfg().mods,isD=myRole()==='delator';
  loc.sel.forEach(function(p){var e=$('#err'+p);if(e)e.textContent=(c.info[p]&&c.info[p]!=='ok')?c.info[p]:'';});
  $('#prev').innerHTML=msg.map(function(w,i){return loc.sel.indexOf(i)>-1&&c.info[i]==='ok'?'<mark>'+esc(c.out[i])+'</mark>':esc(w);}).join(' ');
  $('#cnt').textContent='Substituições: '+loc.sel.filter(function(p){return c.info[p]==='ok';}).length+'/2';
  var lkEl=$('#leaks');
  if(lkEl)lkEl.innerHTML=c.out.map(function(w,i){if(isSmall(w))return '<button class="chip fixed" disabled>'+esc(w)+'</button>';return '<button class="chip leak'+((loc.leaks||[]).indexOf(i)>-1?' sel':'')+'" data-act="leak" data-p="'+i+'">'+esc(w)+'</button>';}).join('');
  var needNext=isDel()&&k<mods,needLeak=isD;
  $('[data-act=mod-ok]').disabled=!c.ok||busy||(needNext&&!loc.next)||(needLeak&&(loc.leaks||[]).length!==Math.min(2,c.out.length));
}
function bindRep(inp){
  var k=curK();
  inp.addEventListener('input',function(){loc.vals[+inp.dataset.p]=inp.value;updMod(k);});
  inp.addEventListener('keydown',function(e){if(e.key==='Enter'&&!$('[data-act=mod-ok]').disabled)ACT['mod-ok']();});
}

function dtList(){var d=R().dtries||{};return Object.keys(d).sort().map(function(k){return d[k];});}
function dtn(x){return dtList().length+(x||0)>=1;}
function sDecode(){
  var r=R(),msg=msgOf(cfg().mods),dk=code+':'+room.roundNo+':dec',swp=swapSeen[dk]?[]:(changesOf(cfg().mods)||[]);
  if(myRole()==='delator'){
    after=function(){swapSeen[dk]=1;};
    return '<section class="doc"><div class="head"><span>Mensagem recebida</span><b>Delator</b></div>'+
      '<h2>Você é o receptor</h2>'+
      '<p>Os cidadãos-soldados deixaram você por último. Como você trabalha para o Estado, pode entregar a decodificação a Leo e fazer o Estado vencer.</p>'+
      '<div class="msgline" style="font-size:24px">'+msg.map(function(w,i){return '<span'+(swp.indexOf(i)>-1?' class="swapped"':'')+'>'+esc(w)+'</span>';}).join('')+'</div>'+noticeHtml()+
      '<div class="row"><button class="btn red" data-act="dec-betray" '+(busy?'disabled':'')+'>Entregar a decodificação ao Estado</button></div></section>';
  }
  after=function(){typeIn($('#app .msgline'),code+':'+room.roundNo+':dec');swapSeen[dk]=1;var gi=$('#dec');
    gi.addEventListener('input',function(){$('[data-act=dec-ok]').disabled=!gi.value.trim()||busy;});
    gi.addEventListener('keydown',function(e){if(e.key==='Enter'&&gi.value.trim())ACT['dec-ok']();});
    if(!gi.dataset.f){gi.dataset.f=1;if(!COARSE)gi.focus();}
    $('[data-act=dec-ok]').disabled=!gi.value.trim()||busy;};
  return '<section class="doc"><div class="head"><span>Mensagem recebida</span><b>Receptor</b></div>'+
    '<h2>Decodifique</h2>'+
    '<p>Esta é a mensagem final, depois de passar pelos intermediários e por todos os interrogatórios.</p>'+
    '<div class="msgline" style="font-size:24px">'+msg.map(function(w,i){return '<span'+(swp.indexOf(i)>-1?' class="swapped"':'')+'>'+esc(w)+'</span>';}).join('')+'</div>'+
    '<p class="dim">Categoria: '+esc(r.cat)+'. '+(dtn(0)?'Última tentativa. Você já tentou: '+dtList().map(esc).join(', ')+'.':'Você tem duas tentativas.')+'</p>'+
    '<div class="dock"><div><input type="text" id="dec" maxlength="24" autocomplete="off" placeholder="A palavra secreta é..."></div>'+noticeHtml()+
    '<div class="row"><button class="btn primary" data-act="dec-ok" disabled>Decodificar</button></div></div></section>';
}

function sPlay(){
  var ps=partsOf(uid);
  if(!ps.length)return sWait();
  if(ps[0]==='emit')return sEmit();
  if(ps[0]==='dec')return sDecode();
  if(ps[0]==='leo')return sLeo(R().step);
  return sMod(R().step);
}

function pathHtml(){
  var mods=cfg().mods,lk=R().leak,sheets='',swaps='';
  for(var i=0;i<=mods;i++){
    var label=i===0?'Mensagem original (emissor)':(i===mods?'Mensagem final (entregue ao receptor)':'Após a troca '+i);
    var m=msgOf(i);
    if(!m){sheets+='<div class="sheet"><span class="label dim">'+label+'</span><span class="none">não chegou a ser transmitida</span></div>';continue;}
    var ch=i>0?changesOf(i):[],ex=[];
    revealList().forEach(function(v){if(v.k-1===i)ex=ex.concat(v.pos);});
    var lkp=(lk&&lk.k-1===i)?lkP(lk):[];
    sheets+='<div class="sheet"><span class="label dim">'+label+'</span><div class="m">'+m.map(function(w,j){
      return '<span class="'+(ch.indexOf(j)>-1?'ch ':'')+(ex.indexOf(j)>-1?'ex ':'')+(lkp.indexOf(j)>-1?'lk':'')+'">'+esc(w)+'</span>';}).join('')+'</div></div>';
    if(i>0){var prev=msgOf(i-1);if(prev)swaps+='<p>Troca '+i+': '+(ch.length?ch.map(function(p){return '“'+esc(prev[p])+'” → “'+esc(m[p])+'”';}).join(' e '):(erasedOf(i).length?'tempo esgotado, apagadas '+erasedOf(i).map(function(p){return '“'+esc(prev[p])+'”';}).join(' e '):'sem troca (tempo esgotado)'))+'</p>';}
  }
  var rl=revealList(),gl=guessList();
  var rev=rl.length?rl.map(function(v){return '<p>Interrogatório '+v.k+': '+v.words.map(function(w){return '“'+esc(w)+'”';}).join(', ')+'</p>';}).join(''):'<p class="dim">Nenhuma palavra foi extraída.</p>';
  var att=gl.length?gl.map(function(g){return '<p>Tentativa '+g.k+': '+(g.skipped?'sem palpite':'“'+esc(g.text)+'” '+(g.hit?'<b>ACERTOU</b>':'errou'))+'</p>';}).join(''):'<p class="dim">Leo não chegou a registrar tentativas.</p>';
  return '<h3>Caminho da mensagem</h3>'+sheets+
    '<p class="dim"><span class="legend-seen"></span>Palavra extraída pela kallocaína · fundo escuro: palavra trocada nesta etapa'+(isDel()?' · sublinhado ondulado: denúncia':'')+'.</p>'+
    (swaps?'<h3>Trocas feitas</h3>'+swaps:'')+
    '<h3>Palavras reveladas</h3>'+rev+
    (R().power?'<p>Olho da Polícia: “'+esc(R().power.from)+'” virou “'+esc(R().power.to)+'” (pos. '+pn(R().power.pos)+').</p>':'')+
    (isDel()?'<p>Palavras entregues por denúncia: '+(lk?lkW(lk).map(function(w){return '“'+esc(w)+'”';}).join(', '):'nenhuma')+'.</p>':'')+
    '<h3>Tentativas de interceptação</h3>'+att;
}
function outcomeText(o){
  var r=R();
  if(o.how==='tie')return 'Empate: o receptor decifrou a mensagem final e Leo descobriu a palavra no último interrogatório. Leo'+(isDel()?' e o delator ganham 2 pontos; ':' ganha 2 pontos; ')+'cada cidadão-soldado ganha 1.';
  if(o.how==='decode')return 'O receptor decifrou a mensagem final.';
  if(o.how==='decodeFail')return 'O receptor digitou “'+esc(r.decode?r.decode.text:'')+'” e errou a palavra.';
  if(o.how==='delatorReceptor')return 'O delator sobrou como receptor e entregou a decodificação ao Estado.';
  return 'Leo decifrou a palavra no interrogatório '+o.how.slice(1)+'.';
}

function sVote(){
  var r=R(),o=r.outcome,role=myRole(),voters=civilians();
  var hasVoted=function(i){var v=players[i]&&players[i].vote;return !!v&&v.r===room.roundNo;};
  after=null;
  if(role==='leo'||role==='delator'){
    return '<section class="lock"><span class="label muted">Seu papel: '+esc(roleData(role).t)+' · '+esc(roleData(role).s)+'</span>'+leoLineHtml()+
      '<h2 class="who pulse">Aguarde</h2><p>Os cidadãos-soldados estão estudando o histórico e votando em quem foi o delator.</p>'+noticeHtml()+'</section>';
  }
  var mine=hasVoted(uid)?players[uid].vote.t:null;
  var civWin=o.winner==='civis';
  var cands=room.order.filter(function(i){return i!==r.leo&&i!==uid;});
  var votePart;
  if(mine){
    votePart='<p>Voto registrado em <b>'+esc(nm(mine))+'</b>. Aguardando os outros cidadãos-soldados.</p>'+
      '<div class="plist">'+voters.map(function(i){return '<div class="pbtn '+(hasVoted(i)?'ok':'')+'" style="background:transparent;color:var(--paper-ink);border-color:var(--paper-ink)">'+esc(nm(i))+(i===uid?' (você)':'')+'<small style="color:var(--paper-dim)">'+(hasVoted(i)?'Votou ✓':'Pensando')+'</small></div>';}).join('')+'</div>';
  }else{
    votePart='<h3>Quem foi o delator?</h3><div class="msgline" id="votes">'+
      cands.map(function(id){return '<button class="chip'+(loc.vote===id?' sel':'')+'" data-act="votepick" data-id="'+esc(id)+'">'+esc(nm(id))+'</button>';}).join('')+'</div>'+noticeHtml()+
      '<div class="row"><button class="btn primary" data-act="vote" '+(loc.vote&&!busy?'':'disabled')+'>Confirmar voto</button></div>';
  }
  return '<section class="doc"><div class="head"><span>Inquérito da rodada '+room.roundNo+'</span><b>Só cidadãos-soldados</b></div>'+
    '<span class="stamp big slam '+(civWin||o.winner==='tie'?'ok':'')+'">'+(civWin?'Vitória dos<br><span style="white-space:nowrap">cidadãos-soldados</span>':(o.winner==='tie'?'Empate':'Vitória do Estado'))+'</span>'+
    '<p>'+outcomeText(o)+' Leo Kall era <b>'+esc(nm(r.leo))+'</b>.</p>'+
    '<div class="secret" style="transform:none"><span class="label">A palavra secreta era</span><b>'+esc(r.word)+'</b></div>'+
    '<p class="dim">Observem as trocas e conversem: onde a mensagem se perdeu? Quem entregou uma palavra a Leo?</p>'+
    pathLineHtml(false)+
    '<details class="more" open><summary>Histórico da mensagem</summary>'+pathHtml()+'</details>'+votePart+'</section>';
}

function triesHtml(){
  var r=R(),tr=r.tries||{},hitOf=function(t){return norm(t)===norm(r.word);};
  var ids=isDel()?r.chain.concat(r.receptor?[r.receptor]:[]):[r.emissor,r.int1,r.int2,r.receptor];
  var rows=ids.map(function(id,i){
    var who=esc(nm(id))+(id===uid?' (você)':''),txt,cls='';
    if(i===0){txt='sabia a palavra';cls='';}
    else if(id===r.receptor){
      var dl=[];if(r.dtries)Object.keys(r.dtries).sort().forEach(function(k){dl.push(r.dtries[k]);});
      if(!dl.length&&r.decode&&r.decode.text&&r.outcome&&r.outcome.how!=='delatorReceptor')dl=[r.decode.text];
      if(!dl.length&&r.outcome&&r.outcome.how==='delatorReceptor')txt='entregou ao Estado';
      else if(!dl.length)txt='sem tentativa';
      else{txt=dl.map(function(t){return '“'+esc(t)+'” '+(hitOf(t)?'✓':'✗');}).join(' · ');cls=hitOf(dl[dl.length-1])?'ok':'no';}
    }else if(tr[id]){txt='“'+esc(tr[id])+'” '+(hitOf(tr[id])?'✓':'✗');cls=hitOf(tr[id])?'ok':'no';}
    else txt='sem palpite';
    var role=i===0?'Emissor':(id===r.receptor?'Receptor':(isDel()?'Troca '+i:'Intermediário '+i));
    return '<div class="trow '+cls+'"><small>'+role+'</small><b>'+who+'</b><span>'+txt+'</span></div>';
  }).join('');
  return '<div class="tries"><span class="label muted">Palpites ao longo do caminho</span>'+rows+'</div>';
}
function leoNoteHtml(){
  var r=R(),o=r.outcome,v=room.roundNo%2,how=o.how,q;
  if(how==='tie')q=[
    'No último interrogatório a palavra se mostrou, e ao mesmo tempo o receptor a decifrou. Não sei dizer quem chegou primeiro, eu ou eles. Anoto o empate com um incômodo que não sei explicar.',
    'Vi a palavra no fim e vi que o receptor também a tinha. Ambos chegamos ao mesmo ponto por caminhos diferentes. Não posso chamar isso de vitória, nem eles.'][v];
  else if(how==='decode')q=[
    'Eu tinha certeza de que ouvira o bastante. Não ouvira. A mensagem atravessou a cadeia e chegou ao fim inteira o bastante para ser entendida. Anoto isso com incômodo: alguém soube proteger o que importava.',
    'Perdi esta. A frase foi trocada, remendada, passada de mão em mão, e ainda assim chegou. Começo a achar que a confiança deles é mais resistente do que eu supunha.'][v];
  else if(how==='decodeFail')q=[
    'A mensagem chegou ao fim desfigurada, e o receptor se perdeu nela. Confirmei o que já suspeitava: sob vigilância, ninguém consegue passar adiante algo inteiro.',
    'Cada troca deixou uma cicatriz, e no fim o receptor já não sabia o que estava lendo. Não precisei fazer muito. A desconfiança fez o trabalho por mim.'][v];
  else if(how==='delatorReceptor')q=[
    'O último elo era o nosso. Aquilo em que os outros confiaram terminou onde tinha de terminar: nas minhas mãos.',
    'Eles escolheram, um a um, a quem passar a mensagem, e o caminho acabou no único que me escutava. A confiança, mais uma vez, foi o ponto fraco.'][v];
  else q=[
    'No interrogatório '+how.slice(1)+' a palavra se mostrou. Não foi preciso a kallocaína inteira: bastaram alguns fragmentos e a certeza de que o medo completa o resto.',
    'Eu a vi no interrogatório '+how.slice(1)+'. Ninguém a disse em voz alta; ela escapou pelas frestas, como sempre escapa.'][v];
  var f=[],rv=revealList(),ws=[];
  rv.forEach(function(x){x.words.forEach(function(w){if(w&&w!==ERASED)ws.push('“'+esc(w)+'”');});});
  if(ws.length)f.push('Palavras que a kallocaína arrancou: '+ws.join(', ')+'.');
  var dc=decisive();
  if(dc.length)f.push('Chegaram intactas ao receptor: '+dc.map(function(w){return '“'+esc(w)+'”';}).join(', ')+'.');
  if(isDel()&&r.leak&&r.leak.words&&r.leak.words.length)f.push('Denúncia recebida: '+r.leak.words.map(function(w){return '“'+esc(w)+'”';}).join(', ')+'.');
  var gw=guessList().filter(function(g){return !g.skipped&&g.text;});
  var wrong=gw.filter(function(g){return !g.hit;}).map(function(g){return '“'+esc(g.text)+'”';});
  if(wrong.length)f.push('Suspeitei de '+wrong.join(', ')+' e errei.');
  if(gw.some(function(g){return g.hit;}))f.push('Acertei “'+esc(r.word)+'”.');
  if(isDel()&&o.votes){
    var vs=civilians(),n=vs.filter(function(i){return o.votes[i]===r.delator;}).length;
    f.push('Entre os cidadãos-soldados, '+n+' de '+vs.length+' suspeitaram do delator.');
  }
  return '<div class="leonote"><span class="label">Registro de Leo Kall</span><p class="lq">“'+q+'”</p>'+f.map(function(x){return '<p class="lf">'+x+'</p>';}).join('')+'</div>';
}
function sResult(){
  var r=R(),o=r.outcome,civWin=o.winner==='civis';
  var votesHtml='';
  if(isDel()){
    var voters=civilians();
    votesHtml='<h3>O delator</h3><p>O delator era <b>'+esc(nm(r.delator))+'</b>.</p>'+
      '<p>Corrente da mensagem: '+r.chain.concat(r.receptor?[r.receptor]:[]).map(function(i){return esc(nm(i));}).join(' → ')+'.</p>'+
      '<h3>Votos</h3>'+voters.map(function(i){var t=o.votes&&o.votes[i];return '<p>'+esc(nm(i))+' apontou '+(t?esc(nm(t)):'ninguém')+' · '+(t===r.delator?'<b>ACERTOU +1</b>':'errou')+'</p>';}).join('');
  }
  after=null;
  return '<section class="doc"><div class="head"><span>Relatório da rodada '+room.roundNo+'/'+tot()+'</span><b>Encerrado</b></div>'+
    '<span class="stamp big slam '+(civWin||o.winner==='tie'?'ok':'')+'">'+(civWin?'Vitória dos<br><span style="white-space:nowrap">cidadãos-soldados</span>':(o.winner==='tie'?'Empate':'Vitória do Estado'))+'</span>'+
    '<p>'+outcomeText(o)+'</p>'+
    '<div class="secret" style="transform:none"><span class="label">A palavra secreta era</span><b>'+esc(r.word)+'</b></div>'+
    (isDel()?'<div class="secret" style="transform:none;animation:none"><span class="label">O delator era</span><b style="font-size:clamp(26px,8vw,38px)">'+esc(nm(r.delator))+(r.delator===uid?' (você)':'')+'</b></div>':'')+
    triesHtml()+pathLineHtml(true)+
    (isDel()?'<p class="dim">Leo: '+esc(nm(r.leo))+' · Emissor: '+esc(nm(r.emissor))+'</p>':
      '<p class="dim">Leo: '+esc(nm(r.leo))+' · Emissor: '+esc(nm(r.emissor))+' · Intermediários: '+esc(nm(r.int1))+' e '+esc(nm(r.int2))+' · Receptor: '+esc(nm(r.receptor))+'</p>')+
    leoNoteHtml()+
    (o.bonus?'<p><b>Palpites errados de Leo: '+o.bonus+'.</b> +'+o.bonus+' para cada cidadão-soldado honesto.</p>':'')+
    '<h3>Placar acumulado</h3>'+boardHtml(o.delta)+(isLastRound()&&!room.demo?finalHtml():'')+noticeHtml()+
    '<div class="row">'+(isLastRound()?'':'<button class="btn primary" data-act="next" '+(busy?'disabled':'')+'>Próxima rodada</button>')+'<button class="btn" data-act="leave">'+(room.demo?'Sair do exemplo':'Sair da sessão')+'</button></div>'+
    '<details class="more"><summary>Ver como a mensagem andou</summary>'+pathHtml()+votesHtml+'</details></section>';
}
function finalHtml(){
  var best=Math.max.apply(null,room.order.map(function(i){return room.scores[i]||0;}));
  var champs=room.order.filter(function(i){return (room.scores[i]||0)===best;});
  return '<span class="stamp big ok">Relatório da sessão</span><p><b>'+(champs.length>1?'Empate no topo: ':'Campeão: ')+champs.map(function(i){return esc(nm(i));}).join(' e ')+'</b> com '+best+' pontos.</p><p class="lq">“Encerro o registro desta sessão. Cada palavra extraída ficou arquivada, e cada suspeita continua comigo.” <small>Leo Kall</small></p>';
}

/* ---------- ações ---------- */
function finish(winner,how,extra){
  var r=R(),delta={};
  room.order.forEach(function(i){delta[i]=0;});
  var civ=civilians(),bonus=guessList().filter(function(g){return !g.hit&&!g.skipped;}).length;
  civ.forEach(function(i){delta[i]+=bonus;});
  if(winner==='civis'){
    civ.forEach(function(i){delta[i]+=2;});
  }else if(winner==='tie'){
    civ.forEach(function(i){delta[i]+=1;});
    delta[r.leo]+=2;
    if(isDel())delta[r.delator]+=2;
  }else{
    delta[r.leo]+=5;
    if(isDel())delta[r.delator]+=5;
  }
  var round=Object.assign({},extra||{},{outcome:{winner:winner,how:how,delta:delta,bonus:bonus}});
  if(isDel())return DB.doc('rooms/'+code).update({status:'vote',round:round});
  var scores={};room.order.forEach(function(i){scores[i]=(room.scores[i]||0)+delta[i];});
  return DB.doc('rooms/'+code).update({status:'result',scores:scores,round:round});
}
function maybeFinalizeVote(){
  if(!room||room.status!=='vote'||!isDel()||!R()||!R().outcome)return;
  var key=code+':'+room.roundNo;if(finalizingKey===key)return;
  var r=R(),voters=civilians(),votes={},all=voters.every(function(i){
    var v=players[i]&&players[i].vote;if(v&&v.r===room.roundNo){votes[i]=v.t;return true;}return false;});
  if(!all)return;
  finalizingKey=key;
  var delta=Object.assign({},r.outcome.delta);
  voters.forEach(function(i){if(votes[i]===r.delator)delta[i]=(delta[i]||0)+1;});
  var scores={};room.order.forEach(function(i){scores[i]=(room.scores[i]||0)+(delta[i]||0);});
  DB.doc('rooms/'+code).update({status:'result',scores:scores,round:{outcome:{delta:delta,votes:votes}}}).catch(function(){finalizingKey='';});
}
function goMenu(step,test){
  var el=$('#pname'),v=el?el.value.trim():fetchStore('name');
  if(!v){notice='Escreva seu nome primeiro.';render();return;}
  store('name',v);notice='';menuStep=step;testFlag=!!test;render();window.scrollTo(0,0);
}
var ACT={
  rules:function(){page='rules';rulesStep=0;loc={};render();window.scrollTo(0,0);},
  'rules-mode':function(b){rulesMode=b.getAttribute('data-v');if(rulesStep>1)rulesStep=1;render();window.scrollTo(0,0);},
  'rules-go':function(b){rulesStep=parseInt(b.getAttribute('data-v'),10)||0;render();window.scrollTo(0,0);},
  about:function(){page='about';loc={};render();},
  back:function(){page=null;render();},
  'go-create':function(){goMenu('create',false);},
  'go-join':function(){if(menuStep==='demo'){menuStep='join';notice='';render();window.scrollTo(0,0);}else goMenu('join',false);},
  'go-test':function(){goMenu('create',true);},
  'go-demo':function(){if(menuStep==='home')demoFrom='home';else if(menuStep==='join')demoFrom='join';menuStep='demo';render();window.scrollTo(0,0);},
  'rules-demo':function(){demoMode=rulesMode==='delator'?'delator':'classico';page=null;menuStep='demo2';render();window.scrollTo(0,0);},
  'demo-ai':function(){aiOn=!aiOn;lastSig='';render();},
  'demo-mode':function(b){demoMode=b.getAttribute('data-v')==='delator'?'delator':'classico';menuStep='demo2';render();window.scrollTo(0,0);},
  'demo-start':function(b){startDemo(demoMode,b.getAttribute('data-r'));},
  'menu-back':function(){menuStep='home';notice='';render();window.scrollTo(0,0);},
  resync:function(){pollSync(true);notice='';},
  'host-skip':function(){pendingIds().forEach(function(i){skipTurn(i,true);});var e=$('#hskip');if(e)e.hidden=true;hsStart=Date.now();},
  mode:function(b){
    opt.mode=b.dataset.v;
    $$('.opt').forEach(function(el){el.setAttribute('aria-checked',el.dataset.v===opt.mode?'true':'false');});
  },
  power:function(){
    var r=R(),k=curK();if(k<2||r.power)return;
    var seen=seenMap(k),done={},c=[];
    for(var j=k-1;j>=1;j--){changesOf(j).forEach(function(p){
      if(seen[p]||done[p])return;done[p]=1;
      c.push({pos:p,from:msgOf(j-1)[p],to:msgOf(j)[p]});});}
    if(!c.length){notice='Nenhuma palavra alterada disponível agora.';render();return;}
    var pick=c[rnd(c.length)];
    loc.sel=(loc.sel||[]).filter(function(p){return p!==pick.pos;});
    write(function(){return DB.doc('rooms/'+code).update({round:{power:{k:k,pos:pick.pos,from:pick.from,to:pick.to}}});});
  },
  test:function(){createTestRoom();},
  create:function(){createRoom();},
  join:function(){joinRoom($('#pcode').value);},
  rejoin:function(){joinRoom(fetchStore('code'),true);},
  leave:function(){leaveRoom();},
  start:function(){
    var ids=playerIds();if(ids.length!==cfg().n||room.status!=='lobby')return;
    write(function(){
      return DB.doc('rooms/'+code).set(buildRoom({code:code,host:room.host,created:room.created,test:!!room.test,mode:room.mode||'classico',diff:room.diff||'medio',totalRounds:room.totalRounds||5,order:ids,firstLeo:rnd(cfg().n),
        scores:ids.reduce(function(o,i){o[i]=0;return o;},{}),used:[]},1));
    });
  },
  ack:function(){write(function(){return DB.doc('rooms/'+code+'/players/'+uid).update({ack:room.roundNo});});},
  begin:function(){
    var ids=playerIds();
    if(room.status!=='prep'||!ids.every(function(i){return players[i].ack===room.roundNo;}))return;
    write(function(){return DB.doc('rooms/'+code).update({status:'play'});});
  },
  pick:function(b){
    loc.next=b.dataset.id;
    $$('#picks .chip').forEach(function(el){el.classList.toggle('sel',el.dataset.id===loc.next);});
    if(R().step===0)updEmit();else updMod(curK());
  },
  leak:function(b){
    var q=+b.dataset.p,a=loc.leaks||(loc.leaks=[]),ix=a.indexOf(q);
    if(ix<0){var ow=modCheck(curK()).out[q];if(ow&&isSmall(ow))return;}
    if(ix>-1)a.splice(ix,1);else if(a.length<2)a.push(q);
    updMod(curK());
  },
  'emit-ok':function(){
    var c=emitCheck($('#msg').value);if(!c.ok)return;
    var upd={msgs:{m0:c.t.join(' ')},step:1};
    if(isDel()){
      if(!loc.next||candidates().indexOf(loc.next)<0)return;
      upd.chain=[R().emissor,loc.next];
    }
    var fnE=function(){return DB.doc('rooms/'+code).update({round:upd});};
    write(fnE);retryUntil(function(){return R().step>=1;},fnE);
  },
  tk:function(b){
    var p=+b.dataset.p,i=loc.sel.indexOf(p);
    if(i>-1)loc.sel.splice(i,1);else if(loc.sel.length<needFor(curK())&&leoPick(curK()).indexOf(p)>-1)loc.sel.push(p);
    render();
  },
  serum:function(){
    SND.serum();
    var k=curK(),msg=leoView(k);
    if(loc.sel.length!==needFor(k)||revealOf(k))return;
    var pos=loc.sel.slice().sort(function(a,b){return a-b;}),words=pos.map(function(p){return msg[p];});
    var o={};o['k'+k]={pos:pos,words:words};
    loc.sel=[];
    var fnS=function(){return DB.doc('rooms/'+code).update({round:{reveals:o}});};
    write(fnS);retryUntil(function(){return !!revealOf(k);},fnS);
  },
  'guess-ok':function(){
    var k=curK(),gi=$('#guess');
    if(!gi||!gi.value.trim()||guessOf(k))return;
    var text=gi.value.trim(),hit=norm(text)===norm(R().word),g={};
    if(!hit){SND.deny();flashWrong();}
    g['k'+k]={text:text,hit:hit,skipped:false};
    var ld={};ld['k'+k]=true;
    write(function(){
      if(hit&&k<cfg().leos)return finish('leo','k'+k,{guesses:g});
      return DB.doc('rooms/'+code).update({round:{guesses:g,ldone:ld}});
    });
    if(!hit||k>=cfg().leos)retryUntil(function(){return leoDone(k);},function(){return DB.doc('rooms/'+code).update({round:{guesses:g,ldone:ld}});});
  },
  'guess-skip':function(){
    var k=curK();if(guessOf(k)||k>=cfg().leos)return;
    var g={},ld={};g['k'+k]={text:'',hit:false,skipped:true};ld['k'+k]=true;
    var fnG=function(){return DB.doc('rooms/'+code).update({round:{guesses:g,ldone:ld}});};
    write(fnG);retryUntil(function(){return leoDone(k);},fnG);
  },
  'leo-next':function(){var k=R().step,ld={};ld['k'+k]=true;var fnL=function(){return DB.doc('rooms/'+code).update({round:{ldone:ld}});};write(fnL);retryUntil(function(){return leoDone(k);},fnL);},
  chip:function(b){
    var k=curK(),p=+b.dataset.p,i=loc.sel.indexOf(p);
    if(modPickable(k).indexOf(p)<0)return;
    if(i>-1){loc.sel.splice(i,1);delete loc.vals[p];}
    else if(loc.sel.length<2)loc.sel.push(p);
    $('#chips').innerHTML=chipsHtml(k,seenMap(k));
    $('#reps').innerHTML=repsHtml(k);
    $$('#reps input').forEach(bindRep);
    updMod(k);
    var last=$('#rep'+p);if(i<0&&last)last.focus();
  },
  'mod-ok':function(){
    var k=curK(),c=modCheck(k),r=R(),mods=cfg().mods;if(!c.ok)return;
    var upd={msgs:{},changes:{}};
    upd.msgs['m'+k]=c.out.join(' ');
    upd.changes['c'+k]=loc.sel.slice().sort(function(a,b){return a-b;});
    if(isDel()){
      if(k<mods){
        var cs=candidates();
        if(!loc.next||cs.indexOf(loc.next)<0)return;
        upd.chain=r.chain.concat([loc.next]);
        if(k===mods-1)upd.receptor=cs.filter(function(x){return x!==loc.next;})[0];
      }
      if(myRole()==='delator'){
        var lks=(loc.leaks||[]).slice().sort(function(a,b){return a-b;});
        if(lks.length!==Math.min(2,c.out.length))return;
        upd.leak={k:k+1,pos:lks,words:lks.map(function(q){return c.out[q];})};
      }
    }
    var fnM=function(){return DB.doc('rooms/'+code).update({round:upd});};
    write(fnM);retryUntil(function(){return !!msgOf(k);},fnM);
  },
  'tg-ok':function(){
    var tg=$('#tg');if(!tg||!tg.value.trim())return;var t=tg.value.trim(),o={};o[uid]=t;
    write(function(){return DB.doc('rooms/'+code).update({round:{tries:o}});});
  },
  'dec-ok':function(){
    var gi=$('#dec');if(!gi||!gi.value.trim())return;
    var text=gi.value.trim(),hit=norm(text)===norm(R().word),prev=dtList();
    if(!hit&&prev.length<1){
      var dt={};dt['t'+(prev.length+1)]=text;
      notice='Não é essa. Você tem mais uma tentativa.';SND.deny();
      var fnD=function(){return DB.doc('rooms/'+code).update({round:{dtries:dt}});};
      write(fnD);retryUntil(function(){return dtList().length>=1;},fnD);return;
    }
    var all={};prev.concat([text]).forEach(function(t,i){all['t'+(i+1)]=t;});
    var fnR=function(){return DB.doc('rooms/'+code).update({round:{dtries:all,rdone:{text:text,hit:hit,kind:'decode'}}});};
    write(fnR);retryUntil(function(){return !!R().rdone;},fnR);
  },
  'dec-betray':function(){
    var fnB=function(){return DB.doc('rooms/'+code).update({round:{rdone:{text:'(entregue ao Estado)',hit:false,kind:'betray'}}});};
    write(fnB);retryUntil(function(){return !!R().rdone;},fnB);
  },
  votepick:function(b){
    loc.vote=b.dataset.id;
    $$('#votes .chip').forEach(function(el){el.classList.toggle('sel',el.dataset.id===loc.vote);});
    var bt=$('[data-act=vote]');if(bt)bt.disabled=busy;
  },
  vote:function(){
    if(!loc.vote||room.status!=='vote')return;
    var t=loc.vote;
    SND.vote();
    write(function(){return DB.doc('rooms/'+code+'/players/'+uid).update({vote:{r:room.roundNo,t:t}});});
  },
  next:function(){
    if(room.status!=='result'||isLastRound())return;
    var n=room.roundNo+1;
    write(function(){return DB.doc('rooms/'+code).set(buildRoom(room,n));});
  }
};

/* ---------- modo teste: jogadores do computador ---------- */
var FILL=['sombra','vento','ferro','lenta','azul','pedra','fumaça','trilho','velho','cinza','porta','noite','corda','vidro','longe','febre'];
var BOTN=['Bia','Caio','Dani','Edu','Fê'];
var PHRASE_D='uma coisa muito comum que todos conhecem mas poucos notam quando precisam delas todos os dias sem';
var PHRASE='uma coisa muito comum que todos conhecem mas poucos notam quando precisam';
var botTimer=null,botKey='';
function isBot(id){return typeof id==='string'&&id.indexOf('bot')===0;}
function noop(){}
function retryUntil(check,fn,n){
  n=n||0;
  setTimeout(function(){try{
    if(!room||room.status!=='play'||!room.round)return;
    if(check()||n>=5)return;
    Promise.resolve(fn()).catch(noop);retryUntil(check,fn,n+1);
  }catch(e){}},2500);
}
async function createTestRoom(){
  var name=myName()||fetchStore('name')||'Você',mode=opt.mode==='delator'?'delator':'classico',n=MODES[mode].n,sel=$('#prounds'),tr=sel?(+sel.value||3):3;
  store('name',name);busy=true;notice='';render();
  try{
    for(var t=0;t<6;t++){
      var c=genCode(),snap=await DB.doc('rooms/'+c).get();
      if(snap.exists)continue;
      var now=Date.now();
      await DB.doc('rooms/'+c).set({code:c,host:uid,status:'lobby',mode:mode,test:true,totalRounds:tr,created:now});
      await DB.doc('rooms/'+c+'/players/'+uid).set({name:name,joinedAt:now,ack:0});
      for(var i=1;i<n;i++)await DB.doc('rooms/'+c+'/players/bot'+i).set({name:BOTN[i-1]+' (PC)',joinedAt:now+i,ack:0});
      busy=false;enter(c);return;
    }
    notice='Não foi possível criar a sala de teste agora.';
  }catch(e){notice='Não foi possível criar a sala de teste.';}
  busy=false;render();
}
function botKeyNow(){
  var r=R(),p=playerIds(),a=0,v=0;
  p.forEach(function(i){if(players[i].ack===room.roundNo)a++;if(players[i].vote&&players[i].vote.r===room.roundNo)v++;});
  return room.status+'|'+room.roundNo+'|'+(r?r.step+'|'+(r.ldone?Object.keys(r.ldone).length:0)+'|'+(r.msgs?Object.keys(r.msgs).length:0)+'|'+(r.rdone?1:0)+'|'+(r.dtries?Object.keys(r.dtries).length:0):'')+'|'+(r&&r.reveals?Object.keys(r.reveals).length:0)+'|'+(r&&r.guesses?Object.keys(r.guesses).length:0)+'|'+a+'|'+v;
}
setInterval(function(){try{if(room&&room.test&&room.host===uid&&DB&&room.status!=='lobby')botAct();}catch(e){}},3000);
function botSched(){
  if(!room||!room.test||room.host!==uid||!DB)return;
  var key=botKeyNow();if(key===botKey)return;botKey=key;
  clearTimeout(botTimer);botTimer=setTimeout(botAct,room&&room.demo?2200:1300);
}
function botAct(self){
  if(!room||(!self&&(!room.test||room.host!==uid)))return;
  var r=R(),ref=DB.doc('rooms/'+code);
  if(room.status==='prep'){
    playerIds().forEach(function(i){if((self?i===uid:isBot(i))&&players[i].ack!==room.roundNo)DB.doc('rooms/'+code+'/players/'+i).update({ack:room.roundNo}).catch(noop);});
    return;
  }
  if(!r)return;
  if(room.status==='vote'){
    civilians().forEach(function(b){
      if(self?b!==uid:!isBot(b))return;
      var v=players[b]&&players[b].vote;if(v&&v.r===room.roundNo)return;
      var cs=room.order.filter(function(i){return i!==r.leo&&i!==b;});
      DB.doc('rooms/'+code+'/players/'+b).update({vote:{r:room.roundNo,t:cs[rnd(cs.length)]}}).catch(noop);
    });
    return;
  }
  if(room.status!=='play')return;
  var mods=cfg().mods;
  var who=[];
  if(r.step===0)who=[r.emissor];else who=[r.leo,citActor(r.step)];
  who.forEach(function(a){
    if(self?a!==uid:!isBot(a))return;
    var ps=partsOf(a);if(!ps.length)return;
    botPart(a,ps[0],r,ref,mods);
  });
}
function botPart(a,part,r,ref,mods){
  var k=r.step;
  if(room.ai&&SAMPLE){botAI(a,part,r,ref,mods,k);return;}
  if(room.demo){botDemo(a,part,r,ref,mods,k);return;}
  botPartRandom(a,part,r,ref,mods,k);
}
function botPartRandom(a,part,r,ref,mods,k){
  if(part==='emit'){
    var up={msgs:{m0:isDel()?PHRASE_D:PHRASE},step:1};
    if(isDel()){var cs0=candidates();up.chain=[r.emissor,cs0[rnd(cs0.length)]];}
    ref.update({round:up}).catch(noop);return;
  }
  if(part==='dec'){
    var rd;
    if(isDel()&&r.delator===a)rd={text:'(entregue ao Estado)',hit:false,kind:'betray'};
    else{var hit=rnd(100)<60;rd={text:hit?r.word:FILL[rnd(FILL.length)],hit:hit,kind:'decode'};}
    ref.update({round:{rdone:rd}}).catch(noop);return;
  }
  if(part==='leo'){
    var cur=revealOf(k),gs=guessOf(k),ld={};ld['k'+k]=true;
    if(!cur&&!leakOnly(k)){
      var msg=leoView(k),av=leoPick(k);
      var pos=shuffle(av).slice(0,needN(k)).sort(function(x,y){return x-y;}),o={};
      o['k'+k]={pos:pos,words:pos.map(function(p){return msg[p];})};
      ref.update({round:{reveals:o}}).catch(noop);
    }else if(!gs){
      var g={},last=k>=cfg().leos;
      if(last||rnd(100)<20){var tx=ALL[rnd(ALL.length)].w,h=norm(tx)===norm(r.word);g['k'+k]={text:tx,hit:h,skipped:false};
        if(h&&k<cfg().leos){finish('leo','k'+k,{guesses:g}).catch(noop);return;}
      }else g['k'+k]={text:'',hit:false,skipped:true};
      ref.update({round:{guesses:g,ldone:ld}}).catch(noop);
    }else ref.update({round:{ldone:ld}}).catch(noop);
    return;
  }
  var m0=msgOf(k-1),idx=modPickable(k);
  var ps2=shuffle(idx).slice(0,2).sort(function(x,y){return x-y;}),out=m0.slice();
  ps2.forEach(function(p){
    var cand=shuffle(FILL).filter(function(w){return norm(w)!==norm(m0[p])&&!related(w,r.word);});
    out[p]=cand[0];
  });
  var u={msgs:{},changes:{}};
  u.msgs['m'+k]=out.join(' ');u.changes['c'+k]=ps2;
  if(isDel()){
    if(k<mods){
      var cs=candidates(),nx=cs[rnd(cs.length)];
      u.chain=r.chain.concat([nx]);
      if(k===mods-1)u.receptor=cs.filter(function(x){return x!==nx;})[0];
    }
    if(r.delator===a){var lp=shuffle(out.map(function(_,i){return i;}).filter(function(i){return !isSmall(out[i]);})).slice(0,2).sort(function(x,y){return x-y;});u.leak={k:k+1,pos:lp,words:lp.map(function(q){return out[q];})};}
  }
  ref.update({round:u}).catch(noop);
}

/* ---------- fim de etapa: avança quando Leo e cidadão-soldado terminam ---------- */
var syncKey='',syncAt=0;
function roundSync(){
  if(!room||room.status!=='play'||!room.round||!DB||!canWrite)return;
  var r=R(),k=r.step,L=cfg().leos;if(k<1)return;
  if(!leoDone(k)||!citDone(k))return;
  var key=code+'|'+room.roundNo+'|'+k;if(syncKey===key)return;syncKey=key;syncAt=Date.now();
  var p;
  if(k<L)p=DB.doc('rooms/'+code).update({round:{step:k+1}});
  else{
    var d=r.rdone,lg=guessOf(L),leoHit=!!(lg&&lg.hit);
    if(d.kind==='betray')p=finish('leo','delatorReceptor',{decode:{text:d.text}});
    else if(d.hit&&leoHit)p=finish('tie','tie',{decode:{text:d.text}});
    else if(leoHit)p=finish('leo','k'+L,{decode:{text:d.text}});
    else p=finish(d.hit?'civis':'leo',d.hit?'decode':'decodeFail',{decode:{text:d.text}});
  }
  p.catch(function(){syncKey='';});
}
setInterval(function(){try{if(syncKey&&Date.now()-syncAt>4000){syncKey='';roundSync();}}catch(e){}},2000);
/* ---------- tempo esgotado: o jogador perde a jogada ---------- */
function skipTurn(who,full){
  if(!room||!code)return;
  who=who||uid;
  var r=R(),ref=DB.doc('rooms/'+code);
  if(room.status==='prep'){DB.doc('rooms/'+code+'/players/'+who).update({ack:room.roundNo}).catch(noop);return;}
  if(room.status==='vote'){DB.doc('rooms/'+code+'/players/'+who).update({vote:{r:room.roundNo,t:''}}).catch(noop);return;}
  if(room.status!=='play'||!r)return;
  var mods=cfg().mods,ps=partsOf(who);
  if(!ps.length)return;
  if(ps[0]==='emit'){
    var up={msgs:{m0:isDel()?PHRASE_D:PHRASE},step:1};
    if(isDel()){var cs0=candidates();up.chain=[r.emissor,cs0[rnd(cs0.length)]];}
    ref.update({round:up}).catch(noop);retryUntil(function(){return R().step>=1;},function(){return ref.update({round:up});});return;
  }
  var k=r.step;
  if(ps[0]==='dec'){var rd0={rdone:{text:'(tempo esgotado)',hit:false,kind:'timeout'}};ref.update({round:rd0}).catch(noop);retryUntil(function(){return !!R().rdone;},function(){return ref.update({round:rd0});});return;}
  if(ps[0]==='leo'){
    var g={},o={},ld={};ld['k'+k]=true;
    if(full){
      var uu={ldone:ld};
      if(!revealOf(k)&&!leakOnly(k)){o['k'+k]={pos:[],words:[]};uu.reveals=o;}
      if(!guessOf(k)){g['k'+k]={text:'',hit:false,skipped:true};uu.guesses=g;}
      ref.update({round:uu}).catch(noop);retryUntil(function(){return leoDone(k);},function(){return ref.update({round:uu});});return;
    }
    if(!revealOf(k)&&!leakOnly(k)){o['k'+k]={pos:[],words:[]};ref.update({round:{reveals:o}}).catch(noop);}
    else if(!guessOf(k)){g['k'+k]={text:'',hit:false,skipped:true};ref.update({round:{guesses:g,ldone:ld}}).catch(noop);retryUntil(function(){return leoDone(k);},function(){return ref.update({round:{guesses:g,ldone:ld}});});}
    else{ref.update({round:{ldone:ld}}).catch(noop);retryUntil(function(){return leoDone(k);},function(){return ref.update({round:{ldone:ld}});});}
    return;
  }
  var u={msgs:{},changes:{}};
  var om=msgOf(k-1).slice(),er=shuffle(modPickable(k).filter(function(i){return om[i]!==ERASED;})).slice(0,2).sort(function(a,b){return a-b;});
  er.forEach(function(i){om[i]=ERASED;});
  u.msgs['m'+k]=om.join(' ');u.changes['c'+k]=[];u.er={};u.er['e'+k]=er;
  if(isDel()&&k<mods){
    var cs=candidates(),nx=cs[rnd(cs.length)];
    u.chain=r.chain.concat([nx]);
    if(k===mods-1)u.receptor=cs.filter(function(x){return x!==nx;})[0];
  }
  ref.update({round:u}).catch(noop);retryUntil(function(){return !!msgOf(k);},function(){return ref.update({round:u});});
}


/* ---------- partida exemplo (guiada, sem sala real) ---------- */
var demoMode='classico',demo=false,realDB=null,realUid=null,realCW=true;
var DEMO_PHRASE_D='uma pessoa que cuida de quem está doente e usa jaleco branco no hospital sempre ouvindo com atenção os sintomas';
var DEMO_PHRASE='uma pessoa que cuida de quem está doente e usa jaleco branco no hospital sempre';
var DEMO_FILL=['plantão','receita','clínica','remédio','vacina','balcão'];
var DEMO_PREF=[1,10,7,3,11,0,9];
function memDb(){
  var st=new Map(),subs=[];
  var cl=function(x){return JSON.parse(JSON.stringify(x));};
  var mg=function(t,u){Object.keys(u).forEach(function(k){var v=u[k];if(v&&typeof v==='object'&&!Array.isArray(v)&&t[k]&&typeof t[k]==='object'&&!Array.isArray(t[k]))mg(t[k],v);else t[k]=cl(v);});return t;};
  var direct=function(b,k){return k.indexOf(b+'/')===0&&k.slice(b.length+1).indexOf('/')<0;};
  var colSnap=function(path){var docs=[];st.forEach(function(v,k){if(direct(path,k))docs.push({id:k.slice(path.length+1),data:function(){return cl(v);}});});return {docs:docs,size:docs.length};};
  var docSnap=function(path){var d=st.get(path);return {exists:d!==undefined,id:path.split('/').pop(),data:function(){return d===undefined?undefined:cl(d);}};};
  var notify=function(path){subs.slice().forEach(function(x){setTimeout(function(){if(x.type==='doc'&&x.path===path)x.cb(docSnap(path));if(x.type==='col'&&direct(x.path,path))x.cb(colSnap(x.path));},0);});};
  var sub=function(type,path,cb,snap){var x={type:type,path:path,cb:cb};subs.push(x);setTimeout(function(){cb(snap(path));},0);return function(){var i=subs.indexOf(x);if(i>-1)subs.splice(i,1);};};
  return {
    doc:function(path){return {
      get:async function(){return docSnap(path);},
      set:async function(d){st.set(path,cl(d));notify(path);},
      update:async function(d){var c=st.get(path);if(c===undefined)throw new Error('no doc');mg(c,d);notify(path);},
      delete:async function(){st.delete(path);notify(path);},
      onSnapshot:function(cb){return sub('doc',path,cb,docSnap);}
    };},
    collection:function(path){return {
      get:async function(){return colSnap(path);},
      onSnapshot:function(cb){return sub('col',path,cb,colSnap);}
    };}
  };
}
async function startDemo(mode,role){
  if(!demo){realDB=DB;realUid=uid;realCW=canWrite;}
  unsubAll();
  DB=memDb();uid='demo';canWrite=true;demo=true;
  var n=MODES[mode].n,c='EXEMP',now=Date.now(),order=['demo'];
  await DB.doc('rooms/'+c+'/players/demo').set({name:'Você',joinedAt:now,ack:0});
  for(var i=1;i<n;i++){order.push('bot'+i);await DB.doc('rooms/'+c+'/players/bot'+i).set({name:BOTN[i-1]+' (PC)',joinedAt:now+i,ack:0});}
  var sc={};order.forEach(function(i){sc[i]=0;});
  var ai=aiOn&&!!SAMPLE;
  var rm=buildRoom({code:c,host:'demo',created:now,test:true,mode:mode,diff:ai?'medio':'facil',totalRounds:1,order:order,firstLeo:1,scores:sc,used:[]},1);
  rm.demo=true;rm.ai=ai;
  var rr=rm.round;if(!ai){rr.word='Médico';rr.cat='Profissões';}
  role=role||'cidadao';rm.demoRole=role;
  if(mode==='delator'){
    rr.leo=role==='leo'?'demo':'bot1';rr.delator=role==='delator'?'demo':'bot3';rr.receptor='';
    var rest=['bot1','bot2','bot3','bot4','bot5'].filter(function(x){return x!==rr.leo&&x!==rr.delator;});
    rr.emissor=role==='emissor'?'demo':(rest.indexOf('bot2')>-1?'bot2':rest[0]);
    rr.chain=[rr.emissor];
  }else{
    var bs=['bot1','bot2','bot3','bot4'];
    var slots={leo:[null,'bot1','bot2','bot3','bot4'],emissor:['bot1','demo','bot2','bot3','bot4'],cidadao:['bot1','bot2','demo','bot3','bot4'],receptor:['bot1','bot2','bot3','bot4','demo']}[role]||[];
    rr.leo=role==='leo'?'demo':slots[0];rr.emissor=slots[1];rr.int1=slots[2];rr.int2=slots[3];rr.receptor=slots[4];
    if(role==='leo'){rr.emissor='bot1';rr.int1='bot2';rr.int2='bot3';rr.receptor='bot4';}
  }
  await DB.doc('rooms/'+c).set(rm);
  menuStep='home';page=null;notice='';
  code=c;room=null;players={};roomLoaded=false;lastSig='';
  var rr2=DB.doc('rooms/'+c);
  unsubs.push(rr2.onSnapshot(function(sn){room=sn.exists?sn.data():null;roomLoaded=true;render();},function(){}));
  unsubs.push(DB.collection('rooms/'+c+'/players').onSnapshot(function(q){var m={};q.docs.forEach(function(d){m[d.id]=d.data();});players=m;render();},function(){}));
  render();
}
function exitDemo(){
  unsubAll();demo=false;DB=realDB;uid=realUid;canWrite=realCW;
  code=null;room=null;players={};page=null;menuStep='home';notice='';lastSig='';render();
}
function botDemo(a,part,r,ref,mods,k,ov){
  ov=ov||{};
  if(part==='emit'){
    var up={msgs:{m0:ov.phrase||(isDel()?DEMO_PHRASE_D:DEMO_PHRASE)},step:1};
    if(isDel()){var dr=room.demoRole,c1=candidates().filter(function(x){return x!=='demo';});up.chain=[r.emissor,(dr==='intermediario'||dr==='delator')?'demo':(c1.indexOf(r.delator)>-1?r.delator:c1[0])];}
    ref.update({round:up}).catch(noop);return;
  }
  if(part==='dec'){
    var rd;
    if(isDel()&&r.delator===a)rd={text:'(entregue ao Estado)',hit:false,kind:'betray'};
    else if(ov.text!==undefined){rd={text:ov.text,hit:norm(ov.text)===norm(r.word),kind:'decode'};}
    else rd={text:r.word,hit:true,kind:'decode'};
    var du={rdone:rd};if(ov.tries){du.dtries={};ov.tries.forEach(function(t,i){du.dtries['t'+(i+1)]=t;});}
    ref.update({round:du}).catch(noop);return;
  }
  if(part==='leo'){
    var cur=revealOf(k),gs=guessOf(k),ld={};ld['k'+k]=true;
    if(!cur&&!leakOnly(k)){
      var msg=leoView(k),av=leoPick(k),n=needN(k);
      var pos=(ov.pos?ov.pos.concat(av):DEMO_PREF.filter(function(x){return av.indexOf(x)>-1;}).concat(av)).filter(function(x,i,arr){return arr.indexOf(x)===i&&av.indexOf(x)>-1;}).slice(0,n).sort(function(x,y){return x-y;}),o={};
      o['k'+k]={pos:pos,words:pos.map(function(p){return msg[p];})};
      ref.update({round:{reveals:o}}).catch(noop);
    }else if(!gs){
      var g={},last=k>=cfg().leos;
      if(ov.guess!==undefined){
        var gt=ov.guess||(last?ALL[rnd(ALL.length)].w:'');
        if(gt){var gh=norm(gt)===norm(r.word);g['k'+k]={text:gt,hit:gh,skipped:false};if(gh&&k<cfg().leos){finish('leo','k'+k,{guesses:g}).catch(noop);return;}}
        else g['k'+k]={text:'',hit:false,skipped:true};
      }
      else if(last)g['k'+k]={text:'Engenheiro',hit:false,skipped:false};
      else if(k===2)g['k'+k]={text:'Enfermeiro',hit:false,skipped:false};
      else g['k'+k]={text:'',hit:false,skipped:true};
      ref.update({round:{guesses:g,ldone:ld}}).catch(noop);
    }else ref.update({round:{ldone:ld}}).catch(noop);
    return;
  }
  var m0=msgOf(k-1),idx=modPickable(k);
  var pref=(ov.swaps?ov.swaps.map(function(x){return x.p;}):DEMO_PREF).concat(idx).filter(function(x,i,arr){return arr.indexOf(x)===i&&idx.indexOf(x)>-1;});
  var ps2=pref.slice(0,2).sort(function(x,y){return x-y;}),out=m0.slice(),fi=0;
  ps2.forEach(function(p){
    var w=null;
    if(ov.swaps){var sw=ov.swaps.filter(function(x){return x.p===p;})[0];if(sw)w=sw.w;}
    if(!w)
    while(fi<DEMO_FILL.length){var c0=DEMO_FILL[fi++];if(norm(c0)!==norm(m0[p])&&!related(c0,r.word)){w=c0;break;}}
    out[p]=w||'sombra';
  });
  var u={msgs:{},changes:{}};
  u.msgs['m'+k]=out.join(' ');u.changes['c'+k]=ps2;
  if(isDel()){
    if(k<mods){
      var cs=candidates(),hr=room.demoRole==='receptor',cs2=cs.filter(function(x){return !(hr&&x==='demo');}),nx=cs2.indexOf(r.delator)>-1?r.delator:cs2[0];
      u.chain=r.chain.concat([nx]);
      if(k===mods-1){var rc=cs.filter(function(x){return x!==nx&&x!==r.delator;});u.receptor=(hr&&rc.indexOf('demo')>-1)?'demo':(rc[0]||cs.filter(function(x){return x!==nx;})[0]);}
    }
    if(r.delator===a){var lp=[];if(ov.leak)lp=ov.leak.slice().sort(function(x,y){return x-y;});else out.forEach(function(w,i){if(lp.length<2&&w.length>=5&&i>1&&!isSmall(w))lp.push(i);});u.leak={k:k+1,pos:lp,words:lp.map(function(q){return out[q];})};}
  }
  ref.update({round:u}).catch(noop);
}

/* ---------- jogadores controlados pelo Claude (capacidade sample) ---------- */
var SAMPLE=null,aiOn=false,aiBusy={};
function aiStatus(){var e=$('#aiNow');if(e)e.textContent=Object.keys(aiBusy).length?'Claude está jogando…':'';}
async function aiJson(p){return await SAMPLE.json(p,{modelTier:'quick',cache:false});}
var AI_INTRO='Você está jogando “Kallocaína”, um jogo de dedução social em português, inspirado no romance de Karin Boye. Um emissor escreve uma frase com pistas de uma palavra secreta; dois intermediários trocam duas palavras cada um; o receptor lê a frase final e tenta adivinhar a palavra. Leo Kall, o químico do Estado, tenta descobrir a palavra extraindo palavras da mensagem. Palavras de até 2 letras (como “de”, “e”, “a”, “os”) ficam fixas e não contam. ';
function aiFmt(m){return m.map(function(w,i){return '['+i+'] '+w+(isSmall(w)?' (fixa)':'');}).join('  ');}
function aiSeenTxt(){
  var o=[];revealList().forEach(function(v){o.push('interrogatório '+v.k+': '+v.pos.map(function(p,i){return '['+p+'] “'+v.words[i]+'”';}).join(', ')||'nada');});
  var lk=R().leak;if(lk)o.push('denúncia: '+lkP(lk).map(function(p,i){return '['+p+'] “'+lkW(lk)[i]+'”';}).join(', '));
  return o.length?o.join('; '):'nenhuma ainda';
}
function aiOldGuesses(){return guessList().filter(function(g){return !g.skipped&&g.text;}).map(function(g){return '“'+g.text+'”';}).join(', ')||'nenhum';}
function aiClean1(v,orig){
  v=String(v||'').trim();if(!v||/\s/.test(v))return null;v=clean(v);
  if(norm(v).length<3||norm(v)===norm(orig)||tooClose(v,orig))return null;return v;
}
async function aiPlan(a,part,r,k){
  var nw=NW(),t,v,err='';
  if(part==='emit'){
    for(t=0;t<2;t++){
      v=await aiJson(AI_INTRO+'Você é o EMISSOR. A palavra secreta é “'+r.word+'” e a categoria é “'+r.cat+'”. Escreva uma frase em português com EXATAMENTE '+nw+' palavras que contam (não conte as de até 2 letras) que dê pistas para quem conhece o tema adivinhar a palavra, sem dizê-la, sem variações dela e sem usar o nome da categoria. Dois colegas vão trocar 2 palavras cada e Leo vai tentar descobrir, então a pista não pode ser óbvia demais. '+err+'Responda apenas com JSON: {"frase":"..."}');
      var f=String((v&&v.frase)||'').trim(),c=emitCheck(f);
      if(c.ok)return {phrase:c.t.join(' ')};
      err='Sua tentativa anterior (“'+f+'”) foi recusada: '+c.errs.join(' ')+' Contei '+c.nb+' palavras que contam; precisa ser '+nw+'. ';
    }
    throw new Error('frase');
  }
  if(part==='dec'){
    if(isDel()&&r.delator===a)return {};
    var msg=msgOf(cfg().mods),tries=[],prev='';
    for(t=0;t<2;t++){
      v=await aiJson(AI_INTRO+'Você é o RECEPTOR. A mensagem final, depois das trocas, é: “'+msg.join(' ')+'”. A categoria da palavra secreta é “'+r.cat+'”. Duas palavras foram trocadas em cada passagem e podem confundir. '+(prev?'Você já tentou '+prev+' e errou. ':'')+'Qual é a palavra secreta? Responda apenas com JSON: {"palavra":"..."}');
      var p=clean(String((v&&v.palavra)||'').trim().split(/\s+/)[0]||'');
      if(!p)throw new Error('vazio');
      tries.push(p);
      if(norm(p)===norm(r.word))break;
      prev=tries.map(function(x){return '“'+x+'”';}).join(' e ');
    }
    return {text:tries[tries.length-1],tries:tries};
  }
  if(part==='leo'){
    var cur=revealOf(k),gs=guessOf(k);
    if(!cur&&!leakOnly(k)){
      var m=leoView(k),av=leoPick(k),n=needFor(k);
      var toks=m.map(function(w,i){return '['+i+'] '+(isSmall(w)?w+' (fixa)':(av.indexOf(i)<0?'“'+w+'” (já vista)':'▒ com cerca de '+Math.min(6,Math.max(3,norm(w).length))+' letras'));}).join('  ');
      v=await aiJson(AI_INTRO+'Você é LEO KALL. Categoria suspeita: “'+r.cat+'”. A mensagem interceptada tem '+m.length+' posições: '+toks+'. Palavras já extraídas em interrogatórios anteriores: '+aiSeenTxt()+'. Escolha exatamente '+n+' posições entre '+JSON.stringify(av)+' para aplicar a kallocaína e ver as palavras. Responda apenas com JSON: {"posicoes":[...]}');
      var ps=((v&&v.posicoes)||[]).map(Number).filter(function(x,i,arr){return av.indexOf(x)>-1&&arr.indexOf(x)===i;});
      if(ps.length<n)throw new Error('posicoes');
      return {pos:ps.slice(0,n)};
    }
    if(!gs){
      var last=k>=cfg().leos;
      v=await aiJson(AI_INTRO+'Você é LEO KALL. Categoria da palavra secreta: “'+r.cat+'”. Palavras que você já viu da mensagem (posição e palavra): '+aiSeenTxt()+'. Palpites errados anteriores: '+aiOldGuesses()+'. '+(last?'Este é o último interrogatório e o palpite é obrigatório. ':'Se não tiver nenhuma ideia razoável, pode deixar o palpite vazio, mas um palpite certo vence o jogo na hora. ')+'Qual é a palavra secreta? Responda apenas com JSON: {"palpite":"..."}');
      var gw=String((v&&v.palpite)||'').trim().split(/\s+/)[0]||'';
      return {guess:clean(gw)};
    }
    return null;
  }
  var m0=msgOf(k-1),idx=modPickable(k),isD=isDel()&&r.delator===a;
  for(t=0;t<2;t++){
    v=await aiJson(AI_INTRO+'Você é um INTERMEDIÁRIO'+(isD?' e, em segredo, o DELATOR a serviço do Estado':'')+'. Você não conhece a palavra secreta. A mensagem que recebeu: '+aiFmt(m0)+'. Você deve trocar EXATAMENTE 2 palavras, entre as posições '+JSON.stringify(idx)+' (as outras estão travadas ou fixas), cada uma por uma única palavra nova, para confundir Leo sem apagar o sentido geral para o receptor. '+(isD?'Depois escolha também 2 posições da frase já trocada para entregar a Leo (denúncia): palavras fortes que ajudem o Estado. ':'')+err+'Responda apenas com JSON: {"trocas":[{"pos":0,"nova":"..."},{"pos":0,"nova":"..."}]'+(isD?',"denuncia":[0,0]':'')+'}');
    var tr=(v&&v.trocas)||[],sw=[];
    tr.forEach(function(x){var p=+x.pos,w=aiClean1(x.nova,m0[p]);if(idx.indexOf(p)>-1&&w&&!sw.some(function(y){return y.p===p;}))sw.push({p:p,w:w});});
    var lk=null;
    if(isD){
      var out=m0.slice();sw.forEach(function(x){out[x.p]=x.w;});
      var dn=((v&&v.denuncia)||[]).map(Number).filter(function(x,i,arr){return out[x]!==undefined&&!isSmall(out[x])&&arr.indexOf(x)===i;});
      if(dn.length>=2)lk=dn.slice(0,2);
    }
    if(sw.length===2&&(!isD||lk))return {swaps:sw,leak:lk||undefined};
    err='A tentativa anterior foi recusada: precisa ser exatamente 2 trocas válidas em posições permitidas'+(isD?' e 2 posições de denúncia':'')+', cada nova palavra única, diferente da original, com 3 letras ou mais. ';
  }
  throw new Error('trocas');
}
async function botAI(a,part,r,ref,mods,k){
  var key=code+'|'+room.roundNo+'|'+k+'|'+part+'|'+a+'|'+(part==='leo'&&revealOf(k)?'g':'x');
  if(aiBusy[key])return;
  aiBusy[key]=1;aiStatus();
  var c0=code,rn=room.roundNo;
  try{
    var ov=await aiPlan(a,part,r,k);
    if(!room||!room.ai||code!==c0||room.roundNo!==rn||R().step!==k||partsOf(a)[0]!==part)return;
    botDemo(a,part,R(),ref,mods,k,ov||{});
  }catch(e){
    if(e&&e.code==='not_granted'){SAMPLE=null;notice='A permissão para usar o Claude foi recusada. Os outros jogadores passam a seguir o roteiro do computador.';}
    if(room&&room.ai&&code===c0&&room.roundNo===rn&&R().step===k&&partsOf(a)[0]===part)botPartRandom(a,part,R(),ref,mods,k);
  }finally{delete aiBusy[key];aiStatus();}
}
function coachText(v){
  if(!demo||!room)return '';
  var r=R();
  if(v==='prep')return 'Esta é a sua ordem de serviço: só você vê o seu papel (neste exemplo, o papel que você escolheu). Os outros jogadores são controlados '+(room.ai?'pelo Claude (IA)':'pelo computador')+'. Toque em “Entendi meu papel” e depois em “Iniciar rodada”.';
  if(v==='vote')return 'Hora de votar: veja o histórico de trocas e aponte quem você acha que foi o delator.';
  if(v==='result')return 'Este é o relatório da rodada. Em “Palpites ao longo do caminho” você vê onde a palavra se perdeu. Abra “Ver como a mensagem andou” para ver cada troca.';
  if(v!=='play'||!r)return '';
  var ps=partsOf(uid),k=r.step;
  if(ps[0]==='emit')return 'Você é o emissor: só você conhece a palavra secreta. Escreva uma frase de '+NW()+' palavras com pistas dela, sem dizê-la (artigos e palavras de até 2 letras não contam).'+(isDel()?' Depois escolha para quem passar. Um dos cidadãos-soldados é o delator.':'');
  if(ps[0]==='leo'){
    if(leakOnly(k))return 'Você é o Leo. O delator não foi interrogado: você só recebeu as duas palavras que ele entregou. Dê um palpite sobre a palavra secreta, se quiser.';
    return 'Você é o Leo, químico do Estado. Escolha as palavras da mensagem para extrair (o interrogatório) e tente adivinhar a palavra secreta. No último interrogatório o palpite é obrigatório.';
  }
  if(ps[0]==='mod')return 'Sua vez de trocar. Toque em duas palavras e escreva substitutas: confunda o Estado, mas deixe o receptor entender.'+(isDel()?' Escolha também para quem passar. Um dos cidadãos-soldados é o delator.':'')+(Object.keys(seenMap(k)).length?' Palavras em vermelho já foram vistas pelo Estado e ficam travadas.':'')+' Leo interroga ao mesmo tempo.';
  if(ps[0]==='dec')return 'Você é o receptor. Leia a mensagem final e digite a palavra. Você tem 2 tentativas.';
  if(uid===r.leo)return 'Você é o Leo. Aguarde o emissor terminar a frase: você vai interrogar a primeira troca logo em seguida.';
  if(k===0)return 'O emissor está escrevendo uma frase de '+NW()+' palavras com pistas da palavra secreta, sem dizê-la.';
  if(leakOnly(k)&&k>0)return 'Nesta etapa o Leo não interroga: ele só recebeu as duas palavras que o delator entregou.';
  if(k>=cfg().leos)return 'Etapa final: o receptor tenta decodificar enquanto o Leo faz o último interrogatório, com palpite obrigatório.';
  return 'Você já jogou esta etapa. Acompanhe onde a mensagem está e o que o Estado extraiu. Você pode dar um palpite sobre a palavra enquanto espera.';
}
function coachMount(v){
  var old=$('#coach');if(old)old.remove();
  var t=coachText(v);if(!t)return;
  var d=document.createElement('div');d.id='coach';d.innerHTML='<b>'+(room.ai?'Exemplo com IA':'Exemplo')+'</b><span>'+esc(t)+'</span>'+(room.ai?'<small id="aiNow" class="muted"></small>':'')+'<button type="button" class="linkb" data-act="leave">Sair do exemplo</button>';
  var a=$('#app');a.insertBefore(d,a.firstChild);
}

/* ---------- anfitrião: pular a vez de quem sumiu ---------- */
var hsKey='',hsStart=0;
function pendingIds(){
  if(!room||!room.round||!code)return [];
  var r=R(),ids=playerIds(),out=[];
  if(room.status==='prep')out=ids.filter(function(i){return players[i].ack!==room.roundNo;});
  else if(room.status==='play'){if(r.step===0)out=[r.emissor];else{if(!leoDone(r.step))out.push(r.leo);if(!citDone(r.step))out.push(citActor(r.step));}}
  else if(room.status==='vote')out=ids.filter(function(i){if(i===r.leo||i===r.delator)return false;var v=players[i].vote;return !(v&&v.r===room.roundNo);});
  return out.filter(function(i){return i!==uid&&players[i];});
}
function hostSkipMount(){
  var old=$('#hskip');if(old)old.remove();
  if(!room||room.host!==uid||!DB||demo)return;
  if(['prep','play','vote'].indexOf(room.status)<0)return;
  var pend=pendingIds();if(!pend.length)return;
  var names=pend.map(function(i){return esc(players[i].name);}).join(', ');
  var d=document.createElement('div');d.id='hskip';d.hidden=true;
  d.innerHTML='<p class="small muted">Anfitrião: '+names+' está demorando.</p><button class="btn" data-act="host-skip">'+(pend.length>1?'Pular os ausentes':'Pular a vez de '+names)+'</button>';
  $('#app').appendChild(d);hsTick();
}
function hsTick(){
  var pend=pendingIds(),r=R();
  var k=room&&room.status+'|'+room.roundNo+'|'+(room.status==='play'&&r?r.step+'|'+(r.reveals?Object.keys(r.reveals).length:0)+'|'+(r.guesses?Object.keys(r.guesses).length:0):'')+'|'+pend.join(',');
  if(k!==hsKey){hsKey=k;hsStart=Date.now();}
  var el=$('#hskip');if(!el)return;
  var thr=room.status==='play'?(r.step===0?(isDel()?135:105):(r.step===cfg().leos?135:75)):60;
  if(room.test)thr=12;
  el.hidden=(Date.now()-hsStart)<thr*1000;
}
setInterval(function(){try{hsTick();}catch(e){}},1000);

/* ---------- cronômetro de jogada ---------- */
var TURN_MS=45000,turnDur=45000,turnKey='',turnEnd=0,turnTick=null;
function turnActive(){
  if(demo||!room||!code||!DB||!room.round||!myRole())return '';
  var r=R();
  if(room.status==='prep'){
    var pk=code+':'+room.roundNo;if(prepReady!==pk)return '';
    var me=players[uid];if(!me||me.ack===room.roundNo)return '';
    return 'prep|'+room.roundNo;
  }
  if(room.status==='play'){
    var pt=partsOf(uid);if(!pt.length)return '';
    return 'play|'+room.roundNo+'|'+r.step+'|'+pt[0]+'|'+(r.reveals?Object.keys(r.reveals).length:0)+'|'+(r.guesses?Object.keys(r.guesses).length:0);
  }
  if(room.status==='vote'){
    var role=myRole();if(role==='leo'||role==='delator')return '';
    var v=players[uid]&&players[uid].vote;if(v&&v.r===room.roundNo)return '';
    return 'vote|'+room.roundNo;
  }
  return '';
}
function turnShow(on){var el=$('#turn');if(el)el.hidden=!on;}
function turnPaint(){
  var left=Math.max(0,turnEnd-Date.now()),s=Math.ceil(left/1000);
  if(s<=5&&s>0&&s!==turnLastS)SND.tick();
  turnLastS=s;
  $('#turnt').innerHTML='Sua vez · '+Math.floor(s/60)+':'+('0'+(s%60)).slice(-2)+'<span class="lg"> · '+(partsOf(uid)[0]==='mod'?'acabando o tempo, 2 palavras são apagadas ao acaso':'acabando o tempo, você perde a jogada')+'</span>';
  $('#turnb').style.width=(left/turnDur*100)+'%';
  $('#turn').classList.toggle('low',s<=15);
  if(left<=0){clearInterval(turnTick);turnTick=null;turnShow(false);skipTurn();}
}
function turnWatch(){
  var k=turnActive();
  if(!k){if(turnKey){turnKey='';clearInterval(turnTick);turnTick=null;}turnShow(false);return;}
  if(k!==turnKey){turnKey=k;if(k.indexOf('prep')!==0)SND.ping();turnDur=room.status==='play'?(R().step===0?(isDel()?120000:90000):(R().step===cfg().leos?120000:60000)):TURN_MS;turnEnd=Date.now()+turnDur;clearInterval(turnTick);turnTick=setInterval(turnPaint,250);turnPaint();}
  turnShow(!!turnTick);
}

/* ---------- ciclo ---------- */
function currentView(){
  if(!ready)return 'boot';
  if(page==='rules'||page==='about')return page;
  if(!code)return 'menu';
  if(!room)return 'loading';
  if(!players[uid]&&Object.keys(players).length)return 'gone';
  if(room.status==='lobby')return 'lobby';
  if(!room.round||!myRole())return 'loading';
  return room.status;
}
var renderErr=0;
function render(){
  try{render0();renderErr=0;}
  catch(e){
    lastSig='';renderErr++;
    try{console.error(e);}catch(x){}
    if(renderErr<=1){setTimeout(render,600);return;}
    var a=$('#app');if(a)a.innerHTML='<section class="lock"><h2 class="who">Erro na tela</h2><p class="small muted">'+esc(String(e&&e.message||e))+'</p><div class="row"><button class="btn primary" onclick="location.reload()">Recarregar</button></div></section>';
  }
}
function render0(){
  var v=currentView();
  if(v==='gone'){unsubAll();code=null;room=null;players={};store('code',null);notice='Você não faz mais parte dessa sessão.';v='menu';}
  var sig=ready+'|'+uid+'|'+canWrite+'|'+menuStep+'|'+testFlag+'|'+rulesStep+'|'+rulesMode+'|'+v+'|'+JSON.stringify(room)+'|'+JSON.stringify(players)+'|'+busy+'|'+notice+'|'+JSON.stringify(loc);
  if(sig===lastSig)return;lastSig=sig;
  var key=v+':'+(room?room.roundNo+':'+(room.status==='play'?room.round.step:'x'):'');
  var same=key===locKey,hadPrev=!!locKey;if(!same){locKey=key;loc={};}
  var keep={},fid=document.activeElement&&document.activeElement.id;
  $$('#app input,#app textarea').forEach(function(i){if(i.id)keep[i.id]=i.value;});
  var f={boot:sBoot,menu:sMenu,rules:sRules,about:sAbout,loading:sLoading,lobby:sLobby,prep:sPrep,play:sPlay,vote:sVote,result:sResult}[v];
  after=null;
  $('#app').classList.toggle('noanim',same);
  $('#app').innerHTML=f();
  if(same||v==='menu')Object.keys(keep).forEach(function(id){var el=document.getElementById(id);if(el&&el.tagName&&!el.value&&keep[id])el.value=keep[id];});
  hudUpdate(v);
  hostSkipMount();
  coachMount(v);
  try{if(window.kMusicMode)window.kMusicMode((room&&code&&room.status&&room.status!=='lobby')?'game':'menu');}catch(e){}
  if(!same&&$('#app .stamp.slam')&&!(v==='result'&&isDel()))SND.stamp();
  if(!same&&(v==='vote'||(v==='result'&&!isDel()))&&R()&&R().outcome){var ow=R().outcome.winner;setTimeout(function(){ow==='civis'?SND.win():(ow==='tie'?SND.ping():SND.lose());},450);}
  if(after)after();
  $$('#app input[type=text],#app textarea').forEach(function(i){
    i.setAttribute('autocorrect','off');i.setAttribute('spellcheck','false');
    if(i.id==='pcode')i.setAttribute('autocapitalize','characters');
    else if(i.tagName!=='TEXTAREA'&&i.id!=='pname')i.setAttribute('autocapitalize','off');
    if(i.tagName!=='TEXTAREA')i.setAttribute('enterkeyhint',i.id==='pcode'?'go':'done');
  });
  if((same||v==='menu')&&fid){var el=document.getElementById(fid);if(el&&el.focus){el.focus();try{var n=el.value.length;el.setSelectionRange(n,n);}catch(e){}}}
  if(!same)window.scrollTo(0,0);
  if(!same&&hadPrev&&!REDUCE){var sw=document.createElement('div');sw.className='sweep';document.body.appendChild(sw);setTimeout(function(){sw.remove();},650);}
  maybeFinalizeVote();
  botSched();
  turnWatch();
  roundSync();
  if(code)wakeOn();else wakeOff();
}
$('#app').addEventListener('focusin',function(e){var t0=e.target;if(COARSE&&t0&&(t0.tagName==='INPUT'||t0.tagName==='TEXTAREA'))document.body.classList.add('kb');});
$('#app').addEventListener('focusout',function(){setTimeout(function(){var a=document.activeElement;if(!(a&&(a.tagName==='INPUT'||a.tagName==='TEXTAREA')))document.body.classList.remove('kb');},120);});
$('#app').addEventListener('focusin',function(e){
  var t=e.target;
  if(!(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'))||!(window.matchMedia&&matchMedia('(pointer:coarse)').matches))return;
  [350,800].forEach(function(ms){setTimeout(function(){try{t.scrollIntoView({block:'center',behavior:'smooth'});}catch(x){}},ms);});
});
$('#app').addEventListener('click',function(e){
  var b=e.target.closest('[data-act]');
  if(!b||b.disabled)return;
  SND.click();var fn=ACT[b.dataset.act];if(fn)fn(b);
});

/* ---------- efeitos visuais ---------- */
var swapSeen={};
var COARSE=!!(window.matchMedia&&matchMedia('(pointer:coarse)').matches);
var REDUCE=!!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches),scrDone={},typed={};
function scramble(el){
  var key=code+':'+room.roundNo+':'+el.dataset.scr;
  if(REDUCE||scrDone[key])return;scrDone[key]=1;
  var w=el.dataset.w,sp=el.querySelector('.w'),chars='ABCDEFGHJKLMNPQRSTUVWXYZ#%$&',f=0,total=16;
  function frame(){
    var rev=Math.floor(w.length*f/total),s='';
    for(var i=0;i<w.length;i++)s+=i<rev?w.charAt(i):chars.charAt(rnd(chars.length));
    sp.textContent=s;
  }
  frame();
  var iv=setInterval(function(){f++;frame();if(f>=total){clearInterval(iv);sp.textContent=w;}},45);
}
function typeIn(box,key){
  if(!box||REDUCE||typed[key])return;typed[key]=1;
  var kids=Array.prototype.slice.call(box.children);
  kids.forEach(function(k){k.style.visibility='hidden';});
  kids.forEach(function(k,i){setTimeout(function(){k.style.visibility='';},i*90);});
}
var wl=null;
function wakeOn(){
  if(wl||!('wakeLock' in navigator)||document.visibilityState!=='visible')return;
  try{navigator.wakeLock.request('screen').then(function(l){wl=l;l.addEventListener('release',function(){wl=null;});}).catch(function(){});}catch(e){}
}
function wakeOff(){if(wl){try{wl.release();}catch(e){}wl=null;}}
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible'&&code)wakeOn();});
function flashWrong(){
  if(REDUCE)return;
  var e=document.createElement('div');e.className='flash';document.body.appendChild(e);
  document.body.classList.add('shake');
  setTimeout(function(){e.remove();document.body.classList.remove('shake');},700);
}

/* ---------- efeitos sonoros (sintetizados, sem arquivos) ---------- */
var AC=null,fx=true,turnLastS=-1,BUS=null;
function ac(){
  if(!AC){
    try{
      AC=new (window.AudioContext||window.webkitAudioContext)();
      var dry=AC.createGain(),wet=AC.createGain(),cv=AC.createConvolver(),len=Math.floor(AC.sampleRate*1.8),imp=AC.createBuffer(2,len,AC.sampleRate);
      for(var ch=0;ch<2;ch++){var d=imp.getChannelData(ch);for(var i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6);}
      cv.buffer=imp;dry.gain.value=.8;wet.gain.value=.35;
      BUS=AC.createGain();BUS.connect(dry);BUS.connect(wet);wet.connect(cv);cv.connect(AC.destination);dry.connect(AC.destination);
    }catch(e){AC=null;BUS=null;}
  }
  if(AC&&AC.state==='suspended'){try{AC.resume();}catch(e){}}
  return AC;
}
function tone(f,t,d,type,vol,f2,lp,att){
  var c=ac();if(!c||!fx)return;
  var o=c.createOscillator(),g=c.createGain(),t0=c.currentTime+t,a=att||0.01,out=g;
  o.type=type||'sine';o.frequency.setValueAtTime(f,t0);
  if(f2)o.frequency.exponentialRampToValueAtTime(f2,t0+d);
  g.gain.setValueAtTime(0.0001,t0);g.gain.exponentialRampToValueAtTime(vol,t0+a);g.gain.exponentialRampToValueAtTime(0.0001,t0+d);
  o.connect(g);
  if(lp){var fl=c.createBiquadFilter();fl.type='lowpass';fl.frequency.setValueAtTime(lp,t0);fl.frequency.exponentialRampToValueAtTime(Math.max(80,lp*2.2),t0+d);g.connect(fl);out=fl;}
  out.connect(BUS);o.start(t0);o.stop(t0+d+0.05);
}
function hiss(t,d,vol,type,freq){
  var c=ac();if(!c||!fx)return;
  var n=Math.floor(c.sampleRate*d),b=c.createBuffer(1,n,c.sampleRate),a=b.getChannelData(0);
  for(var i=0;i<n;i++)a[i]=(Math.random()*2-1)*Math.pow(1-i/n,2);
  var s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();
  s.buffer=b;f.type=type;f.frequency.value=freq;g.gain.value=vol;
  s.connect(f);f.connect(g);g.connect(BUS);s.start(c.currentTime+t);
}
var SND={
  eye:function(){hiss(0,.7,.2,'lowpass',520);tone(46,0,1.4,'sawtooth',.14,98,300,.55);tone(1700,.55,.9,'sine',.02,2150,null,.3);tone(92,.8,.55,'sine',.32,44);hiss(.8,.16,.22,'highpass',2600);},
  click:function(){hiss(0,.035,.18,'highpass',2800);tone(150,0,.06,'sine',.12,90);},
  stamp:function(){hiss(0,.28,.55,'lowpass',420);tone(72,0,.45,'sine',.55,32);tone(1300,0,.5,'sine',.015,900);},
  serum:function(){tone(62,0,1,'sawtooth',.16,150,380,.4);tone(1900,.35,.55,'sine',.025,2400,null,.2);hiss(.15,.8,.05,'bandpass',1500);hiss(.95,.25,.4,'lowpass',380);tone(70,.95,.3,'sine',.35,40);},
  deny:function(){tone(104,0,.9,'sawtooth',.13,70,300);tone(110,0,.9,'sawtooth',.13,74,300);hiss(0,.3,.3,'lowpass',300);},
  vote:function(){hiss(0,.04,.2,'highpass',2200);hiss(.09,.04,.2,'highpass',2200);tone(110,.14,.25,'sine',.3,60);},
  tick:function(){tone(190,0,.07,'sine',.14,120);hiss(0,.02,.08,'highpass',3500);},
  ping:function(){tone(310,0,1.1,'sine',.07);tone(856,0,.8,'sine',.03);tone(155,0,1.2,'sine',.05);},
  win:function(){tone(196,0,1.6,'sine',.08,null,null,.3);tone(247,.25,1.5,'sine',.07,null,null,.3);tone(294,.5,1.7,'sine',.07,null,null,.3);tone(98,0,1.8,'triangle',.07,null,500,.3);},
  lose:function(){tone(55,0,2.2,'sawtooth',.18,45,260,.5);tone(58.3,0,2.2,'sawtooth',.18,47,260,.5);hiss(0,.35,.5,'lowpass',350);tone(65,0,.5,'sine',.5,30);}
};
(function(){
  var b=$('#fxb'),t=$('#fxt');
  function paint(){b.classList.toggle('off',!fx);b.setAttribute('aria-pressed',fx?'true':'false');b.setAttribute('aria-label',fx?'Desligar efeitos sonoros':'Ligar efeitos sonoros');t.innerHTML='<span class="lg">Efeitos</span><span class="sm">FX</span>: '+(fx?'on':'off');}
  b.addEventListener('click',function(e){e.stopPropagation();fx=!fx;paint();if(fx){ac();SND.click();}});
  document.addEventListener('pointerdown',function(){ac();},{once:true});
  paint();
})();

/* ---------- música de fundo (duas faixas com transição suave) ---------- */
(function(){
  var btn=$('#snd'),txt=$('#sndt'),on=false,mode='menu',VOL=.35,STEP=VOL/(3000/60),tr={},iv=null;
  var SRC={menu:'musica.mp3',game:'subpulse.mp3'};
  function paint(){
    btn.classList.toggle('off',!on);btn.setAttribute('aria-pressed',on?'true':'false');
    btn.setAttribute('aria-label',on?'Desligar música de fundo':'Ligar música de fundo');
    txt.textContent='Música: '+(on?'on':'off');
  }
  function get(k){
    if(!tr[k]){var a=new Audio(SRC[k]);a.loop=true;a.volume=0;a.preload='auto';tr[k]=a;}
    return tr[k];
  }
  function tick(){
    var busy=false;
    Object.keys(tr).forEach(function(k){
      var a=tr[k],want=(on&&k===mode)?VOL:0,v=a.volume;
      if(Math.abs(v-want)<=STEP){a.volume=want;if(want===0&&!a.paused)a.pause();}
      else{a.volume=Math.max(0,Math.min(1,v+(want>v?STEP:-STEP)));busy=true;}
    });
    if(!busy){clearInterval(iv);iv=null;}
  }
  function go(){
    var a=get(mode),p;
    if(on&&a.paused){p=a.play();if(p&&p.catch)p.catch(function(){on=false;paint();});}
    if(!iv)iv=setInterval(tick,60);
  }
  btn.addEventListener('click',function(){on=!on;paint();go();});
  window.kStartMusic=function(){if(on)return;on=true;paint();go();};
  window.kMusicMode=function(m){if(m===mode)return;mode=m;if(on)go();};
  window.kAudioState=function(){var o={on:on,mode:mode};Object.keys(tr).forEach(function(k){o[k]=[+tr[k].volume.toFixed(2),tr[k].paused];});return o;};
  paint();
})();


/* ---------- abertura ---------- */
(function(){
  var el=document.createElement('div');el.id='intro';
  el.innerHTML='<svg class="ieye" viewBox="0 0 240 140" aria-hidden="true"><defs><clipPath id="eyeclip"><path d="M10 70 Q120 -10 230 70 Q120 150 10 70Z"/></clipPath></defs>'+
    '<g clip-path="url(#eyeclip)"><rect x="0" y="0" width="240" height="140" fill="#d8cdb0"/>'+
    '<g class="iris"><circle cx="120" cy="70" r="40" fill="#d4382c"/><circle cx="120" cy="70" r="30" fill="#8e1d15"/><circle cx="120" cy="70" r="16" fill="#0a110e"/><circle cx="127" cy="63" r="5" fill="#d8cdb0" opacity=".85"/></g>'+
    '<rect class="lid lt" x="0" y="-2" width="240" height="73" fill="#0a110e"/><rect class="lid lb" x="0" y="69" width="240" height="73" fill="#0a110e"/></g>'+
    '<path d="M10 70 Q120 -10 230 70 Q120 150 10 70Z" fill="none" stroke="#8fd9a0" stroke-width="3"/><line class="shut" x1="14" y1="70" x2="226" y2="70" stroke="#8fd9a0" stroke-width="3"/></svg>'+
    '<div class="ibar"><i></i></div>'+
    '<div class="ibody"><h1 class="itt">KALLOCAÍNA</h1><p class="isub">Comunicação Proibida</p>'+
    '<p class="iepi">“Acreditei que aquela sessão confirmava minhas suspeitas. A verdade, porém, nem sempre se apresenta da maneira que esperamos.”<span>Leo Kall</span></p></div>'+
    '<p class="ilab">Abrindo os olhos da Polícia</p>';
  document.body.appendChild(el);
  var eyePending=false,t0=Date.now(),opened=false,done=false,MIN=REDUCE?400:2400;
  function open(){
    opened=true;el.classList.add('open');
    try{var c=ac();if(c&&c.state==='running')SND.eye();else eyePending=true;}catch(e){}
    el.querySelector('.ilab').textContent='Toque para entrar';el.classList.add('ready2');
  }
  function enter(){
    if(!opened||done)return;done=true;
    try{if(window.kStartMusic)window.kStartMusic();}catch(e){}
    try{if(eyePending){eyePending=false;SND.eye();}}catch(e){}
    el.classList.add('out');setTimeout(function(){if(el.parentNode)el.parentNode.removeChild(el);},700);
  }
  el.addEventListener('click',enter);
  el.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' ')enter();});
  el.tabIndex=0;
  var iv=setInterval(function(){
    var el2=Date.now()-t0;
    el.querySelector('.ibar i').style.width=Math.min(100,Math.round(el2/MIN*100))+'%';
    if(!opened&&el2>=MIN&&ready){clearInterval(iv);setTimeout(open,200);}
  },80);
})();

/* ---------- inicialização ---------- */
(function(){try{var m=document.createElement('meta');m.name='theme-color';m.content='#0a110e';document.head.appendChild(m);}catch(e){}})();
render();
(async function(){
  try{
    var c=window.claude;
    if(c&&c.use){
      DB=await c.use('db');USER=await c.use('user');
      try{SAMPLE=await c.use('sample');}catch(e2){SAMPLE=null;}
      if(USER){uid=await USER.id();owner=!!(USER.isOwner&&USER.isOwner());var cw=await USER.can('data.write');canWrite=(cw!==false);}
    }else if(window.KalloSupabase&&window.KALLO_CONFIG){
      var sbc=await window.KalloSupabase.connect(window.KALLO_CONFIG);
      DB=sbc.DB;uid=sbc.uid;canWrite=true;
    }
  }catch(e){DB=null;}
  ready=true;
  var last=fetchStore('code');
  if(DB&&uid&&last&&canWrite){joinRoom(last,true);}else render();
})();
})();
