const W=40,H=30,T=16,VW=20,VH=15,cv=document.getElementById('c'),x=cv.getContext('2d'),pn=document.getElementById('pn');
cv.width=VW*T;cv.height=VH*T;
const R=n=>Math.floor(Math.random()*n),Pk=a=>a[R(a.length)];
let P,d,inv,eq,jr,bes,turn,dead,map,seen,mons,items,st,lgs=[],used=[];
const ITEMS={Bone:{t:'m'},Ore:{t:'m'},Herb:{t:'m'},Crystal:{t:'m'},Ichor:{t:'m'},
'Healing Draught':{t:'p',d:'Restore 25 HP'},'Greater Draught':{t:'p',d:'Restore 60 HP'},'Warp Sigil':{t:'p',d:'Teleport to the stairs'},
'Bone Blade':{t:'w',v:3},'Iron Sword':{t:'w',v:6},'Crystal Edge':{t:'w',v:10},'Voidfang':{t:'w',v:16},
'Hide Vest':{t:'a',v:1},'Iron Mail':{t:'a',v:3},'Crystal Plate':{t:'a',v:6},'Ichor Shroud':{t:'a',v:10}};
const REC=[['Healing Draught',{Herb:2}],['Greater Draught',{Herb:2,Crystal:1}],['Warp Sigil',{Crystal:1,Ichor:1}],['Bone Blade',{Bone:4}],['Iron Sword',{Ore:4,Bone:2}],['Crystal Edge',{Crystal:4,Ore:3}],['Voidfang',{Ichor:4,Crystal:3,Bone:5}],['Hide Vest',{Bone:2,Herb:2}],['Iron Mail',{Ore:5}],['Crystal Plate',{Crystal:5,Ore:3}],['Ichor Shroud',{Ichor:5,Herb:4}]];
const SH={b:['........','..xxxx..','.xxxxxx.','xxexxexx','xxxxxxxx','xxxxxxxx','.x.xx.x.','........'],
h:['..xxxx..','..xexe..','..xxxx..','.xxxxxx.','x.xxxx.x','..xxxx..','..x..x..','.xx..xx.'],
a:['x......x','xx....xx','xxx..xxx','xxxxxxxx','xxexxexx','.xxxxxx.','..x..x..','........'],
s:['x..xx..x','.x.xx.x.','..xxxx..','xxexexxx','..xxxx..','.x.xx.x.','x..xx..x','........']};
const B=[
{n:'Gloomjelly',s:'b',hp:8,at:2,h:140,dr:'Herb',l:'A lullaby sung into a well until the well sang back. It has been humming ever since.'},
{n:'Cinder Bat',s:'a',hp:6,at:3,h:20,dr:'Bone',l:'Born from the last sparks of a king\'s funeral pyre. It still tries to reach the coronation.'},
{n:'Crypt Weaver',s:'s',hp:10,at:3,h:280,dr:'Ichor',l:'Spins webs from unfinished sentences. Anyone caught in one finishes them, badly.'},
{n:'Bonewright',s:'h',hp:12,at:4,h:50,dr:'Bone',l:'A skeleton rebuilding itself from spite and slightly wrong bones. It has three left elbows.'},
{n:'Hollow Monk',s:'h',hp:14,at:4,h:260,dr:'Crystal',l:'Rings a bell that does not exist. The sound arrives a week before he does.'},
{n:'Lantern Ghoul',s:'h',hp:16,at:5,h:45,dr:'Ore',l:'Carries a lantern containing a smaller, angrier Lantern Ghoul, who carries a lantern.'},
{n:'Mirror Imp',s:'b',hp:14,at:6,h:190,dr:'Crystal',l:'Wears the face of the last person who looked at it. Currently: yours.'},
{n:'Moss Colossus',s:'b',hp:30,at:5,h:110,dr:'Herb',l:'It was a garden. Then it was a grudge. Now it is a garden that holds grudges against you.'},
{n:'Grave Moth',s:'a',hp:12,at:6,h:300,dr:'Ichor',l:'Eats names off tombstones. The dead are no longer sure who they are, and they are furious about it.'},
{n:'Tunnel Choir',s:'s',hp:22,at:7,h:330,dr:'Ore',l:'Seven throats, one hymn, zero mouths. The hymn is a list of your debts.'},
{n:'Void Tick',s:'s',hp:18,at:8,h:240,dr:'Ichor',l:'Its bite leaves a small hole in your day. Nobody knows which day.'},
{n:'Tax Wraith',s:'h',hp:26,at:8,h:0,dr:'Crystal',l:'Collects what you owe. You will never learn what you owe. It accepts teeth.'}];
const PRE=['','Ashen ','Gilded ','Hollow ','Starved ','Voidtouched ','Forgotten '];
const BN=['Vorlag','Ysmera','Kuth-Kuth','Old Nine-Crowns','Mother Lantern','The Tally-Man','Sir Hollow','Grandmother Static'],
BT=['Devourer of Staircases','Who Counts Backwards','the Unfinished','Keeper of the Ninth Floor','Eater of Maps','Last Cook of the Deep'];
const LORE=[
['The First Descent','Before the dungeon there was a Sky, and the Sky had a Floor, and the Floor was screaming. The dungeon is what grew when we stopped listening.'],
['Ledger of the Moth King','I have counted the floors. There are nine. There are always nine. Yet you descend, and the number lies. Floor @ is not on my list.'],
['Cook\'s Note','The stew on the third floor talks. Do not answer it. It knows your mother\'s name and where she buried the spoons.'],
['The Cartographer\'s Last Map','Every room I drew moved in the night. The final map was of my own ribs. I have marked the exit. It is inside me.'],
['Sermon of the Hollow Bell','Blessed are the drowned, for they hear the bell. Cursed are the dry, for they must ring it, and the rope is made of them.'],
['Letter to No One','Dear Warden, the prisoners have begun dreaming in your handwriting. The dreams are very polite. They ask for the keys by name.'],
['Alchemist\'s Margin','Ichor is not blood. Ichor is the memory of blood. Drink it and remember dying, then remember dying better.'],
['The Crown Problem','Nine kings wore the Crown. Each was the same king. The Crown is not gold; it is a patient hunger with a nice fit.'],
['Child\'s Rhyme','One for the bone, two for the door, three for the thing that lives below the floor. Four is a number we don\'t say anymore.'],
['Star-Eater Treatise','The stars are eggs. The dungeon is the nest. Something is due to hatch on the ceiling of the world, and it is hungry for staircases.'],
['Tavern Graffiti','THE MIMIC IS REAL. THE TAVERN IS THE MIMIC. YOU ARE STANDING IN ITS MOUTH. TIP YOUR SERVER.'],
['Testament of the Forgotten God','I was worshipped until they forgot what I was for. Now I am a door. Please stop knocking. Please stop opening me.'],
['Coroner\'s Report','Cause of death: descent. Time of death: not yet. The body is standing behind you. It says hello.'],
['The Recursive Scroll','This scroll is found on floor @. You are reading it on floor @. Turn back. (You will not. Neither did I.)']];
const LA=['drowned','hungry','eleventh','mirror-born','patient','screaming','borrowed','velvet','unlit','ninefold'],
LN=['Moon','Archivist','Staircase','Lantern','Choir','Crown','Tooth','Well','Cartographer','Bell'],
LV=['forgot its own name','swallowed the sky','began counting backwards','married the dark','learned to walk','wept upward'],
LC=['and the walls took notes','so the floors grew teeth','and no one noticed but you','which is why you are here','and the dungeon exhaled','and that is where the stairs come from'];
const proc=()=>['Fragment '+(100+R(900)),`The ${Pk(LA)} ${Pk(LN)} ${Pk(LV)}, ${Pk(LC)}. Beware the ${Pk(LA)} ${Pk(LN)}.`];
const atk=()=>2+P.lv+(eq.w?ITEMS[eq.w].v:0),def=()=>(P.lv>>1)+(eq.a?ITEMS[eq.a].v:0);
function L(s){lgs.push(s);if(lgs.length>6)lgs.shift();document.getElementById('lg').innerHTML=lgs.join('<br>')}
function hud(){const b=mons.find(m=>m.boss);document.getElementById('hud').textContent=`Floor ${d} | Lv ${P.lv} | HP ${P.hp}/${P.mhp} | ATK ${atk()} DEF ${def()} | XP ${P.xp}/${P.lv*20}`+(b?` | ${b.n} ${b.hp}/${b.mhp}`:'')}
function pan(h){pn.innerHTML=h+'<p><button onclick="cl()">Close (Esc)</button></p>';pn.hidden=false}
function cl(){pn.hidden=true;draw()}
function free(a,b){return a>=0&&b>=0&&a<W&&b<H&&map[b][a]!=1&&!(P.x==a&&P.y==b)&&!mons.some(m=>m.x==a&&m.y==b)}
function mk(a,b,boss){let m;
if(boss){m={n:Pk(BN)+', '+Pk(BT),s:Pk(['h','b','s']),hp:40+d*14,at:4+(d*1.3|0),col:`hsl(${d*47%360},70%,55%)`,boss:1,xp:30+d*10,dr:'Ichor',b:{n:'Boss'}};m.mhp=m.hp}
else{const t=R(Math.min(6,d/3|0)+1),k=1+t*.35+d*.12,q=B[R(Math.min(B.length,4+d))];
m={n:PRE[t]+q.n,s:q.s,hp:Math.ceil(q.hp*k),at:Math.ceil(q.at*(1+t*.2+d*.1)),col:`hsl(${(q.h+t*25)%360},55%,${45+t*3}%)`,dr:q.dr,b:q};m.mhp=m.hp;m.xp=Math.ceil(q.hp/2+d)}
m.x=a;m.y=b;return m}
function gen(){map=Array.from({length:H},()=>Array(W).fill(1));seen=map.map(r=>r.map(()=>0));mons=[];items=[];st=null;
const rs=[];
for(let k=0;k<60&&rs.length<9;k++){const w=4+R(6),h=4+R(4),a=1+R(W-w-2),b=1+R(H-h-2);
if(rs.some(r=>a<r.x+r.w+1&&a+w+1>r.x&&b<r.y+r.h+1&&b+h+1>r.y))continue;
for(let j=b;j<b+h;j++)for(let i=a;i<a+w;i++)map[j][i]=0;rs.push({x:a,y:b,w,h,cx:a+(w>>1),cy:b+(h>>1)})}
for(let i=1;i<rs.length;i++){const A=rs[i-1],C=rs[i];let a=A.cx,b=A.cy;
while(a!=C.cx){map[b][a]=0;a+=Math.sign(C.cx-a)}while(b!=C.cy){map[b][a]=0;b+=Math.sign(C.cy-b)}}
P.x=rs[0].cx;P.y=rs[0].cy;const last=rs[rs.length-1];
if(d%5==0)mons.push(mk(last.cx,last.cy,1));else{map[last.cy][last.cx]=2;st={x:last.cx,y:last.cy}}
rs.forEach((r,i)=>{if(i){const n=1+R(2)+(d/4|0);for(let k=0;k<n;k++){const a=r.x+R(r.w),b=r.y+R(r.h);if(free(a,b)&&map[b][a]==0)mons.push(mk(a,b))}}
if(R(10)<7){const a=r.x+R(r.w),b=r.y+R(r.h);items.push({x:a,y:b,k:Pk(['m','m','m','p','s','c'])})}});
if(d%5==0)L('The air tastes of old crowns. A guardian waits below...')}
function add(k,n){inv[k]=(inv[k]||0)+n;L(`Got ${n} ${k}.`)}
function mat(){const a=['Bone','Ore','Herb'];if(d>1)a.push('Crystal');if(d>3)a.push('Ichor');return Pk(a)}
function lore(){let e;const u=LORE.map((_,i)=>i).filter(i=>!used.includes(i));
if(u.length&&R(3)){const i=Pk(u);used.push(i);e=LORE[i]}else e=proc();
e=[e[0],e[1].replace(/@/g,d)];jr.push(e);L('Scroll found: '+e[0]+' - read it in Lore (J)')}
function pick(it){if(it.k=='m')add(mat(),1+R(2));else if(it.k=='p')add('Healing Draught',1);
else if(it.k=='s')lore();else{L('You crack open a chest!');add(mat(),2);add(mat(),1);if(R(2))add('Healing Draught',1)}}
function gain(n){P.xp+=n;while(P.xp>=P.lv*20){P.xp-=P.lv*20;P.lv++;P.mhp+=6;P.hp=Math.min(P.mhp,P.hp+15);L('LEVEL UP! You are now level '+P.lv+'.')}}
function kill(m){mons.splice(mons.indexOf(m),1);L(`${m.n} is destroyed.`);gain(m.xp);add(m.dr,m.boss?4:1+(R(4)==0));
if(!m.boss&&!bes[m.b.n]){bes[m.b.n]=m.b.l;L('Bestiary updated: '+m.b.n)}
if(m.boss){map[m.y][m.x]=2;st={x:m.x,y:m.y};add('Crystal',3);add('Ore',3);P.hp=P.mhp;const e=proc();e[0]=m.n+': Last Words';jr.push(e);L('The guardian falls. Stairs open. Its last words are in your Lore.')}}
function hit(m){const dm=Math.max(1,atk()+R(3)-(m.boss?1:0));m.hp-=dm;L(`You hit ${m.n} for ${dm}.`);if(m.hp<=0)kill(m)}
function die(){dead=1;pn.hidden=false;pn.innerHTML=`<h3>You have joined the dungeon.</h3><p>Slain on floor ${d}, level ${P.lv}. The walls have added your name to their notes.</p><button onclick="init()">Descend again</button>`}
function invUI(){let h=`<h3>Bag</h3><p>Weapon: ${eq.w||'Rusty Dagger'} | Armor: ${eq.a||'Rags'}</p>`,n=0;
for(const k in inv)if(inv[k]>0){n++;const I=ITEMS[k];h+=`<div>${k} x${inv[k]} <small>${I.d||(I.v?'+'+I.v+(I.t=='w'?' ATK':' DEF'):'material')}</small> ${I.t=='m'?'':`<button onclick="use('${k}')">${I.t=='p'?'Use':'Equip'}</button>`}</div>`}
pan(h+(n?'':'<p>Empty. Smash things.</p>'))}
function use(k){const I=ITEMS[k];
if(I.t=='p'){if(k=='Warp Sigil'){if(!st){L('The guardian seals the stairs.');return}P.x=st.x;P.y=st.y;L('Reality folds. You stand at the stairs.')}else P.hp=Math.min(P.mhp,P.hp+(k[0]=='H'?25:60));inv[k]--}
else{if(eq[I.t])inv[eq[I.t]]++;eq[I.t]=k;inv[k]--;L('Equipped '+k+'.')}
hud();invUI();draw()}
function craftUI(){let h='<h3>Forge and Alchemy</h3>';
REC.forEach(([o,n],i)=>{const I=ITEMS[o],ok=Object.entries(n).every(([k,v])=>(inv[k]||0)>=v);
h+=`<div>${o} <small>(${I.d||'+'+I.v+(I.t=='w'?' ATK':' DEF')}) needs ${Object.entries(n).map(([k,v])=>v+' '+k+' ['+(inv[k]||0)+']').join(', ')}</small> <button ${ok?'':'disabled'} onclick="cr(${i})">Craft</button></div>`});pan(h)}
function cr(i){const[o,n]=REC[i];for(const k in n)inv[k]-=n[k];inv[o]=(inv[o]||0)+1;L('Crafted '+o+'.');craftUI()}
function jUI(){let h='<h3>Lore Journal</h3>';h+=jr.length?jr.map(e=>`<p><b>${e[0]}</b><br>${e[1]}</p>`).join(''):'<p>No scrolls found yet.</p>';
h+='<h3>Bestiary</h3>';const k=Object.keys(bes);h+=k.length?k.map(n=>`<p><b>${n}</b><br>${bes[n]}</p>`).join(''):'<p>Slay monsters to record them.</p>';pan(h)}
let keys=new Set(),parts=[],txts=[],proj=[],shake=0,fade=0,fc=0,last=0;
const AI={Gloomjelly:['m',750],'Cinder Bat':['b',200],'Crypt Weaver':['r',1500],Bonewright:['m',420],'Hollow Monk':['r',1300],'Lantern Ghoul':['c',600],'Mirror Imp':['t',450],'Moss Colossus':['m',700],'Grave Moth':['b',170],'Tunnel Choir':['r',1100],'Void Tick':['c',500],'Tax Wraith':['t',380]};
const _mk=mk;mk=function(a,b,boss){const m=_mk(a,b,boss),z=boss?['m',380]:AI[m.b.n];m.ai=z[0];m.sp=z[1];m.px=a*T;m.py=b*T;m.t=500;m.bc=1500;m.c1=3000;m.c2=2000;m.fl=0;return m};
const _gen=gen;gen=function(){_gen();P.px=P.x*T;P.py=P.y*T;proj=[];parts=[];txts=[];fade=1};
function beep(f,l,ty){try{const a=beep.c||(beep.c=new AudioContext()),o=a.createOscillator(),g=a.createGain();o.type=ty||'square';o.frequency.value=f;g.gain.value=.04;g.gain.exponentialRampToValueAtTime(.001,a.currentTime+l);o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+l)}catch(e){}}
function burst(px,py,c,n){for(let i=0;i<n;i++)parts.push({x:px,y:py,vx:(Math.random()-.5)*.16,vy:(Math.random()-.5)*.16-.03,l:350+R(300),c})}
function tx(px,py,s,c){txts.push({x:px,y:py,s,c,l:800})}
function stp(m,a,b){if((a||b)&&free(m.x+a,m.y+b)){m.x+=a;m.y+=b;return 1}}
function fire(m,an){proj.push({x:m.px+8,y:m.py+8,vx:Math.cos(an)*.1,vy:Math.sin(an)*.1,dm:m.at,l:3000,c:m.col})}
function hit(m,cr){let dm=atk()+R(3);if(cr)dm*=2;m.hp-=dm;m.fl=140;tx(m.px+8,m.py,dm+(cr?'!':''),cr?'#ff0':'#fff');burst(m.px+8,m.py+8,m.col,cr?12:6);if(m.hp<=0){burst(m.px+8,m.py+8,m.col,22);beep(80,.25,'sawtooth');kill(m)}}
function hurt(dm,m){if(P.iv>0||dead)return;dm=Math.max(1,Math.round(dm)-def()+R(2));P.hp-=dm;P.iv=700;shake=7;tx(P.px+8,P.py,'-'+dm,'#f55');burst(P.px+8,P.py+8,'#e33',8);beep(90,.15,'triangle');L(m.n+' hits you for '+dm+'.');if(P.hp<=0){P.hp=0;die()}hud()}
function atkP(){if(P.cd>0)return;P.cd=340;P.sw=200;beep(220,.07,'sawtooth');let h=0;
for(const m of mons.slice()){const dx=m.x-P.x,dy=m.y-P.y;if(Math.hypot(dx,dy)<=1.5&&dx*P.fx+dy*P.fy>0){h=1;hit(m,R(6)==0);if(m.hp>0){m.stun=300;if(!m.boss){m.st=0;if(free(m.x+P.fx,m.y+P.fy)){m.x+=P.fx;m.y+=P.fy;m.dsh=1}}}}}
proj=proj.filter(p=>{if(Math.hypot(p.x-(P.px+8+P.fx*14),p.y-(P.py+8+P.fy*14))<18){burst(p.x,p.y,p.c,5);return 0}return 1});
if(h){shake=4;beep(120,.1)}hud()}
function think(m){const dx=P.x-m.x,dy=P.y-m.y,ds=Math.hypot(dx,dy),sx=Math.sign(dx),sy=Math.sign(dy),ad=Math.abs(dx)+Math.abs(dy),ty=m.ai;
const chase=()=>{const o=Math.abs(dx)>Math.abs(dy)?[[sx,0],[0,sy]]:[[0,sy],[sx,0]];for(const[a,b]of o)if(stp(m,a,b))break},away=()=>{stp(m,-sx,0)||stp(m,0,-sy)};
if(!m.aw){if(ds<7){m.aw=1;m.t=300;burst(m.px+8,m.py+4,'#f55',5);beep(300,.1)}else{m.t=800;if(!R(3))stp(m,R(3)-1,0)||stp(m,0,R(3)-1)}return}
if(ty=='b'){if(m.fr>0){m.fr--;away();m.t=m.sp;return}if(ad==1){hurt(m.at,m);m.fr=3;m.t=m.sp;return}if(!R(3))stp(m,R(3)-1,0)||stp(m,0,R(3)-1);else chase();m.t=m.sp}
else if(ty=='r'){if(m.st=='aim'){m.st=0;fire(m,Math.atan2(P.py-m.py,P.px-m.px));beep(500,.1,'triangle');m.t=m.sp;return}
if(ds<3){away();m.t=300}else if(ds>6){chase();m.t=400}else{m.st='aim';m.t=450}}
else if(ty=='c'){if(m.st=='dash'){m.st=0;let n=0;m.dsh=1;while(n<8){const nx=m.x+m.dx,ny=m.y+m.dy;if(nx==P.x&&ny==P.y){hurt(m.at*1.5,m);break}if(!free(nx,ny))break;m.x=nx;m.y=ny;n++}m.t=1100;return}
if((!dx||!dy)&&ds<=7&&ds>1.5){m.dx=sx;m.dy=sy;m.st='dash';m.t=550;beep(160,.15,'sawtooth');return}
if(ad==1){hurt(m.at,m);m.t=800;return}
if(dx&&dy){Math.abs(dx)<Math.abs(dy)?stp(m,sx,0)||chase():stp(m,0,sy)||chase()}else chase();m.t=m.sp}
else{if(m.st=='wind'){m.st=0;if(Math.abs(P.x-m.x)+Math.abs(P.y-m.y)<=1)hurt(m.at,m);m.t=m.sp*1.5;return}
if(ty=='t'&&ds>3&&m.bc<=0){const o=[];for(let a=-2;a<=2;a++)for(let b=-2;b<=2;b++)if(Math.abs(a)+Math.abs(b)>=2&&free(P.x+a,P.y+b))o.push([P.x+a,P.y+b]);
if(o.length){const p=Pk(o);burst(m.px+8,m.py+8,m.col,10);m.x=p[0];m.y=p[1];m.px=m.x*T;m.py=m.y*T;burst(m.px+8,m.py+8,m.col,10);m.bc=3000;m.t=450;beep(700,.12,'sine');return}}
if(ad==1){m.st='wind';m.t=m.boss?450:350;return}chase();m.t=m.sp}}
function pk(){const i=items.findIndex(t=>t.x==P.x&&t.y==P.y);if(i>=0){pick(items.splice(i,1)[0]);beep(700,.08)}
if(map[P.y][P.x]==2){d++;gen();L('You descend to floor '+d+'.');beep(150,.4,'sine')}}
function upd(dt){P.cd-=dt;P.mt-=dt;P.iv-=dt;P.sw-=dt;P.dc-=dt;P.roll-=dt;P.ct-=dt;P.td-=dt;P.en=Math.min(100,P.en+dt*.014);if(P.roll>0)parts.push({x:P.px+8,y:P.py+8,vx:0,vy:0,l:250,c:'#4fd6c8'});if(P.spin>0){P.spin-=dt;if(P.sp2&&P.spin<200){P.sp2=0;swing(1.7,1,2,300,0);shake=5}}for(const r of rings){r.r+=dt*.11;r.l-=dt}rings=rings.filter(r=>r.l>0);if(keys.has(' ')&&P.cd<=0)P.ch+=dt;else if(!keys.has(' '))P.ch=0;fade-=dt/600;shake=Math.max(0,shake-dt*.02);P.rg+=dt;if(P.rg>5000){P.rg=0;if(P.hp<P.mhp)P.hp++}
let a=(keys.has('d')?1:0)-(keys.has('a')?1:0),b=(keys.has('s')?1:0)-(keys.has('w')?1:0);if(a&&b){if(P.fx)b=0;else a=0}
if(a||b){P.fx=a;P.fy=b;if(P.mt<=0){const nx=P.x+a,ny=P.y+b;if(mons.some(q=>q.x==nx&&q.y==ny))atkP();else if(map[ny]&&map[ny][nx]!=1){P.x=nx;P.y=ny;P.mt=115;pk()}}}

const k=1-Math.exp(-dt/(P.roll>0?18:45));P.px+=(P.x*T-P.px)*k;P.py+=(P.y*T-P.py)*k;
for(const m of mons.slice()){const k=1-Math.exp(-dt/(m.dsh?22:70));m.px+=(m.x*T-m.px)*k;m.py+=(m.y*T-m.py)*k;if(m.dsh&&Math.abs(m.px-m.x*T)+Math.abs(m.py-m.y*T)<3)m.dsh=0;
m.fl-=dt;m.bc-=dt;if(m.stun>0){m.stun-=dt;continue}
if(m.boss&&m.aw){m.c1-=dt;m.c2-=dt;if(m.c1<=0){m.c1=6000;if(mons.length<8)for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]])if(free(m.x+a,m.y+b)){const q=mk(m.x+a,m.y+b);q.hp=q.mhp=Math.ceil(q.hp/2);q.aw=1;mons.push(q);burst(q.px+8,q.py+8,q.col,12);L(m.n+' summons a minion!');break}}
if(m.hp<m.mhp/2&&m.c2<=0){m.c2=4500;for(let j=0;j<8;j++)fire(m,j*Math.PI/4);beep(100,.3,'sawtooth');shake=5}}
m.t-=dt;if(m.t<=0)think(m)}
proj=proj.filter(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.l-=dt;if(Math.random()<.3)parts.push({x:p.x,y:p.y,vx:0,vy:0,l:200,c:p.c});const gx=p.x/T|0,gy=p.y/T|0;
if(p.l<=0||!map[gy]||map[gy][gx]==1)return 0;if(p.pl){for(const m of mons)if(Math.hypot(p.x-m.px-8,p.y-m.py-8)<9){hit(m,0,1.2);m.stun=200;if(!m.boss)m.st=0;burst(p.x,p.y,'#fff',5);return 0}return 1}if(Math.hypot(p.x-P.px-8,p.y-P.py-8)<7){hurt(p.dm,{n:'A bolt'});return 0}return 1});
parts=parts.filter(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.l-=dt;return p.l>0});txts=txts.filter(p=>{p.y-=.02*dt;return(p.l-=dt)>0});
if((fc++&7)==0)hud()}
const sc2={};
function spr(s,c){const k=s+c;if(sc2[k])return sc2[k];const v=document.createElement('canvas');v.width=v.height=10;const g=v.getContext('2d'),r=SH[s],on=(i,j)=>i>=0&&j>=0&&i<8&&j<8&&r[j][i]!='.';
for(let j=-1;j<9;j++)for(let i=-1;i<9;i++)if(!on(i,j)&&(on(i+1,j)||on(i-1,j)||on(i,j+1)||on(i,j-1))){g.fillStyle='#000';g.fillRect(i+1,j+1,1,1)}
for(let j=0;j<8;j++)for(let i=0;i<8;i++)if(on(i,j)){const e=r[j][i]=='e';g.fillStyle=e?'#fff':c;g.fillRect(i+1,j+1,1,1);if(!e){if(!on(i,j-1)){g.fillStyle='rgba(255,255,255,.3)';g.fillRect(i+1,j+1,1,1)}else if(!on(i,j+1)||!on(i+1,j)){g.fillStyle='rgba(0,0,0,.3)';g.fillRect(i+1,j+1,1,1)}}}
return sc2[k]=v}
function sp(s,c,px,py,z,fl,by){x.save();x.translate(px+8,py+8+by);if(fl)x.scale(-1,1);x.drawImage(spr(s,c),-z/2,-z/2-2,z,z);x.restore()}
function draw(tm){tm=tm||performance.now();x.imageSmoothingEnabled=false;
const cxp=Math.max(0,Math.min(W*T-320,P.px+8-160)),cyp=Math.max(0,Math.min(H*T-240,P.py+8-120)),ox=-Math.round(cxp+(Math.random()-.5)*shake),oy=-Math.round(cyp+(Math.random()-.5)*shake),hh=(d*37+250)%360;
x.fillStyle='#000';x.fillRect(0,0,320,240);
for(let j=-6;j<=6;j++)for(let i=-6;i<=6;i++)if(i*i+j*j<=42&&map[P.y+j]&&map[P.y+j][P.x+i]!=null)seen[P.y+j][P.x+i]=1;
const vis=(a,b)=>(a-P.x)**2+(b-P.y)**2<=42,a0=cxp/T|0,b0=cyp/T|0;
for(let b=b0;b<=b0+VH&&b<H;b++)for(let a=a0;a<=a0+VW&&a<W;a++){if(!seen[b][a])continue;const v=vis(a,b),px=a*T+ox,py=b*T+oy,tl=map[b][a];
if(tl==1){x.fillStyle=`hsl(${hh},28%,30%)`;x.fillRect(px,py,T,T);x.fillStyle='rgba(0,0,0,.28)';x.fillRect(px,py+7,T,1);x.fillRect(px,py+15,T,1);x.fillRect(px+(b%2?4:10),py,1,7);x.fillRect(px+(b%2?10:4),py+8,1,7);x.fillStyle='rgba(255,255,255,.08)';x.fillRect(px,py,T,1)}
else{x.fillStyle=`hsl(${hh},22%,${16+(a+b)%2*2}%)`;x.fillRect(px,py,T,T);if((a*7+b*13)%5==0){x.fillStyle='rgba(255,255,255,.07)';x.fillRect(px+5,py+6,3,2)}if((a*3+b*5)%17==0){x.fillStyle='rgba(0,0,0,.3)';x.fillRect(px+3,py+3,1,6);x.fillRect(px+4,py+8,4,1)}
if(tl==2){x.fillStyle=`rgba(255,220,80,${.2+.12*Math.sin(tm/200)})`;x.beginPath();x.arc(px+8,py+8,13,0,7);x.fill();x.fillStyle='#e8c040';x.fillRect(px+1,py+2,14,3);x.fillStyle='#b98f20';x.fillRect(px+3,py+7,10,3);x.fillStyle='#7d5f10';x.fillRect(px+5,py+12,6,3)}}
if(tl==1&&(a*31+b*17)%11==0&&map[b+1]&&map[b+1][a]==0){x.fillStyle=`rgba(255,140,30,${.1+.05*Math.sin(tm/90+a)})`;x.beginPath();x.arc(px+8,py+12,26,0,7);x.fill();x.fillStyle='#6b3b12';x.fillRect(px+7,py+7,2,6);x.fillStyle=Math.sin(tm/70+a)>0?'#ffb030':'#ff7a18';x.fillRect(px+6,py+3,4,4)}
if(!v){x.fillStyle='rgba(0,0,0,.6)';x.fillRect(px,py,T,T)}}
for(const t of items){if(!seen[t.y][t.x])continue;const px=t.x*T+ox,py=t.y*T+oy+Math.sin(tm/250+t.x)*1.5;x.fillStyle='rgba(0,0,0,.35)';x.fillRect(px+4,py+13,8,2);
if(t.k=='s'){x.fillStyle='#f2e8c8';x.fillRect(px+3,py+3,10,10);x.fillStyle='#a33';x.fillRect(px+5,py+6,6,1);x.fillRect(px+5,py+9,6,1)}
else if(t.k=='c'){x.fillStyle='#b8761a';x.fillRect(px+2,py+5,12,9);x.fillStyle='#ffd24a';x.fillRect(px+2,py+8,12,2)}
else{x.fillStyle=t.k=='p'?'#e44':'#6c8';x.fillRect(px+5,py+5,6,6);x.fillStyle='#fff8';x.fillRect(px+6,py+6,2,2)}
if(t.k!='m'&&Math.sin(tm/150+t.y)>.6){x.fillStyle='#fff';x.fillRect(px+13,py+2,2,2)}}
for(const m of mons)if(vis(m.x,m.y)){const px=m.px+ox,py=m.py+oy,z=m.boss?40:20,bb=Math.sin(tm/180+m.x*3)*1.2;
x.fillStyle='rgba(0,0,0,.4)';x.fillRect(px+(m.boss?-4:2),py+13,m.boss?24:12,3);
if(m.st){x.fillStyle=`rgba(255,40,40,${.3+.25*Math.sin(tm/40)})`;if(m.st=='dash')for(let n=1;n<8;n++)x.fillRect(px+m.dx*n*T,py+m.dy*n*T,T,T);else{x.beginPath();x.arc(px+8,py+8,15,0,7);x.fill()}}
sp(m.s,m.fl>0?'#fff':m.col,px,py,z,P.x<m.x,bb);
if(m.boss){x.fillStyle='#ffd24a';x.fillRect(px+2,py-10+bb,12,3)}
if(m.hp<m.mhp&&!m.boss){x.fillStyle='#400';x.fillRect(px+1,py-4,14,2);x.fillStyle='#e33';x.fillRect(px+1,py-4,14*m.hp/m.mhp,2)}}
if(P.iv<=0||fc%4<2){const px=P.px+ox,py=P.py+oy,mvg=Math.abs(P.px-P.x*T)+Math.abs(P.py-P.y*T)>2,by=mvg?-Math.abs(Math.sin(tm/60))*1.5:Math.sin(tm/300)*.5;
x.fillStyle='rgba(0,0,0,.4)';x.fillRect(px+2,py+13,12,3);sp('h',eq.a?'#b8c8ff':'#4fd6c8',px,py,20,P.fx<0,by);
if(P.sw>0){const an=Math.atan2(P.fy,P.fx),pr=1-P.sw/P.sd,e=an-1.3+pr*2.6;x.strokeStyle=`rgba(255,255,255,${1-pr*.6})`;x.lineWidth=4;x.beginPath();x.arc(px+8,py+8,P.big?28:20,e-1,e);x.stroke();x.strokeStyle=eq.w?'#9ff':'#ccc';x.lineWidth=2;x.beginPath();x.moveTo(px+8,py+8);x.lineTo(px+8+Math.cos(e)*17,py+8+Math.sin(e)*17);x.stroke()}
else{x.fillStyle=eq.w?'#9ff':'#ddd';x.fillRect(px+(P.fx<0?0:14),py+5+by,2,8)}}
for(const r of rings){x.strokeStyle=`rgba(255,220,140,${r.l/350})`;x.lineWidth=3;x.beginPath();x.arc(r.x+ox,r.y+oy,r.r,0,7);x.stroke()}
if(P.spin>0){const c1=P.px+8+ox,c2=P.py+8+oy,an=tm/22;x.strokeStyle='rgba(255,255,255,.7)';x.lineWidth=3;x.beginPath();x.arc(c1,c2,22,an,an+2.5);x.stroke();x.beginPath();x.arc(c1,c2,22,an+3.14,an+5.6);x.stroke()}
if(P.ch>150){x.strokeStyle=P.ch>=600?'#ff0':'rgba(255,255,255,.6)';x.lineWidth=2;x.beginPath();x.arc(P.px+8+ox,P.py+8+oy,6+Math.min(P.ch,600)/30,0,7);x.stroke()}
for(const p of proj){x.fillStyle=p.c;x.globalAlpha=.4;x.beginPath();x.arc(p.x+ox,p.y+oy,7,0,7);x.fill();x.globalAlpha=1;x.beginPath();x.arc(p.x+ox,p.y+oy,4,0,7);x.fill();x.fillStyle='#fff';x.fillRect(p.x+ox-1,p.y+oy-1,2,2)}
for(const p of parts){x.globalAlpha=Math.min(1,p.l/300);x.fillStyle=p.c;x.fillRect(p.x+ox,p.y+oy,2,2)}x.globalAlpha=1;
x.font='bold 8px monospace';for(const p of txts){x.fillStyle='#000';x.fillText(p.s,p.x+ox+1,p.y+oy+1);x.fillStyle=p.c;x.fillText(p.s,p.x+ox,p.y+oy)}
const cx=P.px+8+ox,cy=P.py+8+oy,rr=105+Math.sin(tm/90)*3+Math.sin(tm/37)*2,g=x.createRadialGradient(cx,cy,28,cx,cy,rr);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.85)');x.fillStyle=g;x.fillRect(0,0,320,240);
if(P.hp<P.mhp*.3){x.fillStyle=`rgba(180,0,0,${.1+.08*Math.sin(tm/120)})`;x.fillRect(0,0,320,240)}
x.fillStyle='#000a';x.fillRect(4,4,62,13);x.fillStyle='#c22';x.fillRect(5,5,60*P.hp/P.mhp,4);x.fillStyle='#48f';x.fillRect(5,10,60*P.xp/(P.lv*20),2);x.fillStyle='#fc3';x.fillRect(5,13,60*P.en/100,2);
const bs=mons.find(m=>m.boss&&m.aw);if(bs){x.fillStyle='#000a';x.fillRect(90,4,140,8);x.fillStyle='#a2c';x.fillRect(91,5,138*bs.hp/bs.mhp,6)}
if(fade>0){x.fillStyle=`rgba(0,0,0,${fade})`;x.fillRect(0,0,320,240)}}
function loop(t){const dt=Math.min(50,t-last||16);last=t;if(pn.hidden&&!dead)upd(dt);draw(t);requestAnimationFrame(loop)}
function act(k,on){k=k.toLowerCase();k={arrowup:'w',arrowdown:'s',arrowleft:'a',arrowright:'d',x:' ',z:' '}[k]||k;
if(on){if(k=='escape'){if(!dead)cl();return}if('icj'.includes(k)&&k.length==1){if(dead)return;if(!pn.hidden){cl();return}k=='i'?invUI():k=='c'?craftUI():jUI();return}if(k==' ')atkP();else if(k=='shift')roll();else if(k=='q')whirl();else if(k=='e')throwD();keys.add(k)}else{if(k==' '&&P.ch>=600)slam();keys.delete(k)}}
addEventListener('keydown',e=>{if(e.key.startsWith('Arrow')||e.key==' ')e.preventDefault();if(!e.repeat)act(e.key,1)});addEventListener('keyup',e=>act(e.key,0));addEventListener('blur',()=>keys.clear());
document.querySelectorAll('[data-k]').forEach(b=>{const k=b.dataset.k;b.onpointerdown=e=>{e.preventDefault();act(k,1)};b.onpointerup=b.onpointerleave=b.onpointercancel=()=>act(k,0)});
function init(){P={x:0,y:0,px:0,py:0,fx:0,fy:1,hp:30,mhp:30,lv:1,xp:0,cd:0,mt:0,iv:0,sw:0,rg:0,en:100,dc:0,roll:0,ct:0,cb:0,ch:0,spin:0,td:0,sd:180};d=1;inv={Herb:2};eq={};jr=[];bes={};turn=0;dead=0;used=[];lgs=[];pn.hidden=true;gen();hud();L('Space x3 = combo. Hold Space = slam. Shift roll, Q spin, E dagger. Dodge red glows!')}
let rings=[];
function hit(m,cr,mu){let dm=Math.round((atk()+R(3))*(mu||1));if(cr)dm*=2;m.hp-=dm;m.fl=140;tx(m.px+8,m.py,dm+(cr?'!':''),cr?'#ff0':'#fff');burst(m.px+8,m.py+8,m.col,cr?12:6);if(m.hp<=0){burst(m.px+8,m.py+8,m.col,22);beep(80,.25,'sawtooth');kill(m)}}
function swing(rad,mu,kb,stun,front){let h=0;for(const m of mons.slice()){const dx=m.x-P.x,dy=m.y-P.y;if(Math.hypot(dx,dy)<=rad&&(!front||dx*P.fx+dy*P.fy>0)){h=1;hit(m,R(6)==0,mu);if(m.hp>0){m.stun=m.boss?Math.min(stun,300):stun;if(!m.boss){m.st=0;for(let i=0;i<kb;i++){const a=Math.sign(dx)||P.fx,b=Math.sign(dy)||P.fy;if(free(m.x+a,m.y+b)){m.x+=a;m.y+=b;m.dsh=1}}}}}}
proj=proj.filter(p=>p.pl||Math.hypot(p.x-P.px-8,p.y-P.py-8)>rad*T+4||(burst(p.x,p.y,p.c,5),false));return h}
function atkP(){if(P.cd>0)return;P.cb=P.ct>0?(P.cb+1)%3:0;P.ct=650;const f=P.cb==2;P.cd=f?450:300;P.sd=P.sw=f?260:180;P.big=f;beep(f?150:220,.09,'sawtooth');if(swing(f?1.9:1.5,f?1.6:1,f?2:1,f?450:300,1)){shake=f?9:4;beep(120,.1)}if(f)tx(P.px+8,P.py-4,'COMBO','#fd4');hud()}
function slam(){P.ch=0;if(P.en<40||P.cd>0)return;P.en-=40;P.cd=600;swing(2.3,2.5,3,700,0);rings.push({x:P.px+8,y:P.py+8,r:4,l:350});shake=12;burst(P.px+8,P.py+8,'#fd8',24);beep(70,.35,'sawtooth');hud()}
function whirl(){if(P.en<30||P.cd>0)return;P.en-=30;P.cd=500;P.spin=420;P.sp2=1;swing(1.7,1,2,300,0);shake=5;beep(260,.25,'sawtooth')}
function throwD(){if(P.en<15||P.td>0)return;P.en-=15;P.td=300;proj.push({x:P.px+8,y:P.py+8,vx:P.fx*.2,vy:P.fy*.2,pl:1,l:900,c:'#dff',dm:0});beep(520,.05,'triangle')}
function roll(){if(P.en<20||P.dc>0)return;let a=(keys.has('d')?1:0)-(keys.has('a')?1:0),b=(keys.has('s')?1:0)-(keys.has('w')?1:0);if(!a&&!b){a=P.fx;b=P.fy}if(a&&b)b=0;P.en-=20;P.dc=600;P.iv=400;P.roll=280;
for(let i=0;i<2;i++){const nx=P.x+a,ny=P.y+b;if(map[ny]&&map[ny][nx]!=1&&!mons.some(q=>q.x==nx&&q.y==ny)){P.x=nx;P.y=ny;pk()}else break}beep(300,.1,'sine')}
init();requestAnimationFrame(loop);
