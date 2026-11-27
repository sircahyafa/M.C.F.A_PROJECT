/* M.C.F.A CONTENT BOOK — terintegrasi (bagian dari aplikasi, bukan halaman terpisah).
   Diturunkan dari "mcfa-content-book-3 (1).html": seluruh fitur asli dipertahankan (sampul, 10 akun, judul, naskah banyak halaman,
   simpan otomatis, cari, favorit, arsip, duplikat, hapus + urungkan, pengaturan, cadangan/impor, uji bawaan).
   Penyimpanan tetap "mcfa-content-book-v2" (isi lama utuh). Perubahan: dibuka sebagai overlay, tombol Kembali HP, sinyal "mcfa:cb"
   setiap simpan berhasil, muat-ulang lintas-tab/impor. Sinkron ke Produksi Konten ada di 50-content-sync.js. */
(function(){
  var st=document.createElement('style'); st.id='cbBaseCss';
  st.textContent="#cb,#cb *{box-sizing:border-box}\n#cb{--bg:#e9e7e2;--pg:#fffdf8;--ink:#17171a;--mut:#80808a;--ln:#e4e0d6;--ac:#b08d57;--ac2:#d4b87e;--sh:#0005;--serif:\"Playfair Display\",Georgia,serif;--txt:Lora,Georgia,serif;--ui:Inter,system-ui,sans-serif;min-height:100vh;background:var(--bg);color:var(--ink);font:15px/1.5 var(--ui);padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}\n@media(prefers-color-scheme:dark){#cb:not([data-theme=light]){--bg:#0f0f11;--pg:#1b1b1f;--ink:#efece4;--mut:#9a99a3;--ln:#303037;--sh:#000b}}\n#cb[data-theme=dark]{--bg:#0f0f11;--pg:#1b1b1f;--ink:#efece4;--mut:#9a99a3;--ln:#303037;--sh:#000b}\n#cb.na *{animation:none!important;transition:none!important}\n@keyframes cbin{from{opacity:0;transform:perspective(1000px) rotateY(-8deg) translateX(16px)}}@keyframes cbpop{from{opacity:0;transform:scale(.95)}}@keyframes cbup{from{transform:translateY(100%)}}@keyframes cbnew{from{background:#b08d5755}}#cbOverlay{position:fixed;inset:0;z-index:10050;overflow:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;display:none;background:#e9e7e2}#cbOverlay.on{display:block}@media(prefers-color-scheme:dark){#cbOverlay{background:#0f0f11}}";
  document.head.appendChild(st);
  var ov=document.createElement('div'); ov.id='cbOverlay'; ov.setAttribute('role','dialog'); ov.setAttribute('aria-label','M.C.F.A Content Book');
  ov.innerHTML='<div id="cb"><div id="kv"></div><div class="ov" id="ko"></div><div class="toast" id="kt"></div></div>';
  document.body.appendChild(ov);
})();
(()=>{
const PID=["barongsukma","okk","zona","alley","lol","monkipedia","ayla","kpc","cne","fathulmeme"],ACC=["BARONGSUKMA","OTAK KEPALA KARDUS","ZONA ASUMSI","ALLEY’S CREATIVE KIDS","LOL MONKEY SHOP","MONKIPEDIA","DUNIA AYLA","KP CIHUY","CNE PICTURE","FATHUL AL MEME"],K="mcfa-content-book-v2",BK={accounts:"cover",toc:"accounts",editor:"toc"};
const OV=document.getElementById("cbOverlay"),root=document.getElementById("cb"),$=s=>root.querySelector(s),$$=s=>[...root.querySelectorAll(s)];
const CSS=`
.cover{position:fixed;inset:0;z-index:30;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:38px;background:radial-gradient(circle at 50% 36%,#37353d,#09090a 72%)}
.bk{position:relative;width:min(300px,76vw);aspect-ratio:3/4.2;perspective:1500px}.inner{position:absolute;inset:0;background:#fffdf8;border-radius:3px 9px 9px 3px;box-shadow:4px 0 0 #d9d5ca,8px 0 0 #bdb8ab}
.front{position:absolute;inset:0;transform-origin:left;transition:transform 1.1s cubic-bezier(.6,0,.3,1);backface-visibility:hidden;background:repeating-linear-gradient(45deg,#ffffff05 0 2px,transparent 2px 4px),linear-gradient(135deg,#28282d,#050506);color:#f2efe8;border-radius:3px 9px 9px 3px;border-left:14px solid #000;box-shadow:0 30px 60px #000a,inset 0 0 0 1px #ffffff14;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:26px;outline:1px solid #b08d57;outline-offset:-14px}
.open .front{transform:rotateY(-165deg)}.front h2,.front h3{background:linear-gradient(#f0dcae,#a8864f);-webkit-background-clip:text;background-clip:text;color:transparent;margin:0}.front h2{font:700 38px var(--serif);letter-spacing:.1em}.front h3{font:500 16px var(--serif);letter-spacing:.44em;margin:8px 0 6px}.front small{font-size:9px;letter-spacing:.28em;opacity:.65;margin-top:8px}
.orn{display:block;width:70px;height:1px;margin:12px auto;background:var(--ac);position:relative}.orn::after{content:"◆";position:absolute;left:50%;top:-8px;transform:translateX(-50%);font-size:9px;color:var(--ac);padding:0 6px;background:#0a0a0b}
.gold{font:600 13px var(--ui);letter-spacing:.1em;border:0;border-radius:12px;padding:13px 22px;background:linear-gradient(#d8bd84,#a8864f);color:#1a1409;cursor:pointer;display:inline-flex;gap:8px;align-items:center;justify-content:center;box-shadow:0 8px 18px -8px #a8864f}
.top{position:sticky;top:0;z-index:5;display:flex;align-items:center;gap:10px;padding:10px max(14px,calc(50% - 430px));background:color-mix(in srgb,var(--bg) 86%,transparent);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
.top>div{flex:1;min-width:0}.s{font:600 10px var(--ui);letter-spacing:.16em;color:var(--mut);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.c{font:700 19px/1.25 var(--serif);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ib{width:40px;height:40px;border-radius:50%;border:0;background:var(--pg);color:var(--ink);display:grid;place-items:center;cursor:pointer;flex:none;box-shadow:0 1px 0 var(--ln),0 4px 10px -4px var(--sh);transition:transform .15s}.ib:active{transform:scale(.9)}.ib.sm{width:30px;height:30px;box-shadow:none;background:none;color:var(--mut)}.ib.sm:hover{color:var(--ink)}
.w{max-width:860px;margin:0 auto;padding:6px 16px 130px;animation:cbin .45s ease}.w.still{animation:none}
.fab{position:fixed;right:max(18px,calc(50% - 412px));bottom:calc(22px + env(safe-area-inset-bottom,0px));width:58px;height:58px;border-radius:50%;border:0;background:linear-gradient(#d8bd84,#a8864f);color:#1a1409;display:grid;place-items:center;box-shadow:0 14px 26px -8px #a8864f,inset 0 2px 0 #fff6;cursor:pointer;z-index:6;transition:transform .15s}.fab:active{transform:scale(.9)}
.stats{display:flex;justify-content:space-around;text-align:center;font-size:10px;letter-spacing:.14em;color:var(--mut);text-transform:uppercase;margin:10px 0 6px}.stats b{display:block;font:700 30px var(--serif);color:var(--ink);letter-spacing:0}
.sb{display:flex;gap:10px;align-items:center;background:var(--pg);border:1px solid var(--ln);border-radius:14px;padding:0 14px;margin:10px 0 12px;color:var(--mut)}.sb:focus-within{border-color:var(--ac)}.sb input{flex:1;min-width:0;border:0;background:none;color:var(--ink);font:inherit;padding:12px 0;outline:0}
.seg{display:flex;gap:8px;margin:0 0 14px;overflow-x:auto;padding-bottom:2px;align-items:center}.chip{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--ln);background:var(--pg);color:var(--ink);border-radius:20px;height:34px;padding:0 14px;font:500 13px var(--ui);cursor:pointer;flex:none}.chip.on{background:var(--ink);color:var(--pg);border-color:var(--ink)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:24px 18px;margin-top:6px}
.acc{aspect-ratio:3/4;color:#f3efe6;border-radius:3px 10px 10px 3px;padding:18px 14px 14px 20px;cursor:pointer;display:flex;flex-direction:column;justify-content:space-between;border-left:8px solid #000;outline:1px solid #b08d5788;outline-offset:-9px;box-shadow:3px 0 0 #d9d5ca,6px 0 0 #bdb8ab,0 16px 24px -10px var(--sh);transition:transform .3s;background:linear-gradient(145deg,#2c2c32,#0c0c0e)}
.acc:nth-child(4n+2){background:linear-gradient(145deg,#4a4a52,#1b1b1e)}.acc:nth-child(4n+3){background:linear-gradient(145deg,#1e1e22,#050506)}.acc:nth-child(4n){background:linear-gradient(145deg,#38383e,#121214)}
.acc:hover{transform:translateY(-5px) rotate(-1.2deg)}.acc b{font:500 26px var(--serif);color:var(--ac2)}.acc span{display:block;font:700 14px/1.3 var(--serif);letter-spacing:.07em}.acc i{font-size:11px;opacity:.6;font-style:normal}
.paper{background:var(--pg);border-radius:3px 14px 14px 3px;padding:6px 20px;box-shadow:inset 10px 0 16px -12px var(--sh),3px 0 0 -1px var(--ln),0 18px 40px -20px var(--sh)}
.ent{display:flex;align-items:center;gap:8px;padding:14px 0;cursor:pointer}.ent:hover .nm{color:var(--ac)}.ent+.ent{border-top:1px solid color-mix(in srgb,var(--ln) 60%,transparent)}
.no{font:500 13px var(--serif);color:var(--ac);width:34px;flex:none}.nm{font:500 17px/1.35 var(--serif);flex:0 1 auto}.dots{flex:1;min-width:14px;border-bottom:2px dotted var(--ln);align-self:flex-end;margin-bottom:6px}.pn{font-size:12px;color:var(--mut);flex:none}
.gd{color:var(--ac);display:inline-flex;flex:none}.ok{background:var(--ac2);color:#1a1409;border-radius:50%;width:18px;height:18px;display:inline-grid;place-items:center;flex:none}.new{animation:cbnew 1.3s}
.emp{text-align:center;color:var(--mut);padding:34px 0;font-size:13px}.emp svg{display:block;margin:0 auto 8px;opacity:.5}
.tt{width:100%;font:700 27px/1.25 var(--serif);border:0;border-bottom:1px solid var(--ln);background:none;color:var(--ink);padding:8px 0;margin:6px 0 12px;outline:0;border-radius:0}.tt:focus{border-color:var(--ac)}
.r2{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:4px}.meta{font-size:12px;color:var(--mut);text-align:right}.kst{font-size:12px;color:var(--mut);margin:2px 0 10px;line-height:1.5}.kst b{color:var(--ac);font-weight:700;letter-spacing:.04em}.kst details{margin-top:4px}.kst summary{cursor:pointer}.kst .kh{padding:2px 0 0 10px;font-size:11px}
.sw{display:inline-flex;align-items:center;gap:10px;cursor:pointer;font:500 14px var(--ui)}.sw input{appearance:none;-webkit-appearance:none;width:46px;height:26px;border-radius:13px;background:var(--ln);position:relative;transition:.25s;margin:0;border:0;flex:none}
.sw input::after{content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:.25s;box-shadow:0 1px 3px #0004}.sw input:checked{background:var(--ac)}.sw input:checked::after{left:23px}
.leaf{background:var(--pg);border-radius:3px 14px 14px 3px;padding:10px 22px 18px;margin:18px 0;box-shadow:inset 10px 0 18px -12px var(--sh),3px 0 0 -1px var(--ln),0 16px 34px -20px var(--sh);animation:cbpop .3s}
.ph{display:flex;justify-content:space-between;align-items:center;font:600 11px var(--serif);letter-spacing:.14em;color:var(--mut);margin-bottom:6px}
.pgtxt{display:block;width:100%;border:0;resize:none;overflow:hidden;font:17px/34px var(--txt);min-height:46vh;padding:0;outline:0;background:repeating-linear-gradient(transparent 0 33px,var(--ln) 33px 34px) local;color:var(--ink);border-radius:0}
.ov{position:fixed;inset:0;background:#0008;display:none;align-items:flex-end;justify-content:center;z-index:20}.ov.on{display:flex}
.bs{width:min(560px,100%);max-height:88vh;overflow:auto;background:var(--pg);border-radius:22px 22px 0 0;padding:22px 20px calc(22px + env(safe-area-inset-bottom,0px));animation:cbup .3s ease}.bs h2{font:700 20px var(--serif);margin:0 0 14px}.bs .sw,.bs .gold{margin:6px 0}
.mi{display:flex;gap:14px;align-items:center;width:100%;padding:15px 4px;background:none;border:0;border-bottom:1px solid var(--ln);color:var(--ink);font:500 15px var(--ui);cursor:pointer;text-align:left}.mi:last-child{border:0}.mi.rd{color:#c4493d}
.lg{font-size:12px;color:var(--mut);padding:3px 0}
.toast{position:fixed;left:50%;bottom:calc(96px + env(safe-area-inset-bottom,0px));transform:translate(-50%,20px);background:var(--ink);color:var(--pg);padding:10px 16px;border-radius:24px;font-size:13px;display:flex;gap:14px;align-items:center;opacity:0;pointer-events:none;transition:.3s;z-index:40;white-space:nowrap}.toast.on{opacity:1;transform:translate(-50%,0);pointer-events:auto}.toast button{background:none;border:0;color:var(--ac2);font:600 13px var(--ui);cursor:pointer;padding:0}
`;
document.head.append(Object.assign(document.createElement("style"),{textContent:CSS.replace(/(^|\})\s*([^{}]+)\{/g,(m,a,s)=>a+s.split(",").map(x=>"#cb "+x.trim()).join(",")+"{")}));
const P={back:"M15 18l-6-6 6-6",set:"M4 7h9M17 7h3M4 17h3M11 17h9M15 4v6M9 14v6",plus:"M12 5v14M5 12h14",search:"M11 4a7 7 0 100 14 7 7 0 000-14zM20 20l-4-4",star:"M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2-5.5-2.9-5.5 2.9 1-6.2L3 9.6l6.2-.9z",arc:"M3 5h18v4H3zM5 9v10h14V9M10 13h4",copy:"M9 9h11v11H9zM5 15V4h11",trash:"M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13",up:"M6 15l6-6 6 6",down:"M6 9l6 6 6-6",more:"M5 12h.01M12 12h.01M19 12h.01",check:"M5 12l5 5 9-10",send:"M12 16V4M7 9l5-5 5 5M5 20h14",book:"M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 21V5M9 7h6"};
const ic=(n,s=20,f)=>`<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="${f?"currentColor":"none"}" stroke="currentColor" stroke-width="${n=="more"?3:1.8}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${P[n]}"/></svg>`;
const E=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])),pad=(n,w=2)=>String(n).padStart(w,"0"),now=()=>new Date().toISOString();
const uid=p=>p+Date.now().toString(36)+Math.random().toString(36).slice(2,8),pg0=()=>[{id:uid("p"),t:""}];
const blank=()=>({accounts:ACC.map((n,i)=>({id:"acc"+(i+1),name:n})),titles:[],log:[],seq:{},set:{snd:1,vol:.5,anim:1,theme:"auto"}});
function norm(d){d=Object.assign(blank(),d);d.set=Object.assign(blank().set,d.set);d.accounts=blank().accounts;d.seq=d.seq||{};d.log=d.log||[];
if(d.scripts){d.titles.forEach(t=>{if(!t.pages)t.pages=[].concat(...d.scripts.filter(s=>s.tid==t.id).sort((a,b)=>a.num-b.num).map(s=>s.pages))});delete d.scripts}
d.titles.forEach(t=>{if(!t.pages||!t.pages.length)t.pages=pg0();t.ready=!!t.ready;t.name=t.name||"";d.seq[t.acc]=Math.max(d.seq[t.acc]||0,t.num||0)});return d}
let store=true;function load(){try{const r=localStorage.getItem(K);if(r){try{localStorage.setItem(K+"-bak",r)}catch(e){}RAW=r;return norm(JSON.parse(r))}const o=localStorage.getItem("mcfa-content-book-v1");if(o)return norm(JSON.parse(o))}catch(e){store=false}return blank()}
let RAW="",D=load(),R={v:"cover"},NOSAVE=false,TM,AC,ST,U,dirty=false;
const save=()=>{if(NOSAVE)return;try{const raw=JSON.stringify(D);localStorage.setItem(K,raw);RAW=raw;dirty=false;try{document.dispatchEvent(new Event("mcfa:cb"))}catch(e){}}catch(e){if(store){store=false;toast("Penyimpanan browser tidak tersedia. Pakai Unduh cadangan.")}}};
const flush=()=>{clearTimeout(ST);if(dirty)save()};addEventListener("pagehide",flush);document.addEventListener("visibilitychange",()=>{if(document.hidden)flush()});
const log=m=>{D.log.push({t:now(),m});if(D.log.length>300)D.log.shift()},gA=i=>D.accounts.find(a=>a.id==i),gT=i=>D.titles.find(t=>t.id==i);
const words=t=>t.pages.map(p=>p.t).join(" ").trim().split(/\s+/).filter(Boolean).length,stats=()=>({t:D.titles.length,p:D.titles.reduce((a,t)=>a+t.pages.length,0),u:D.titles.filter(t=>t.ready).length});
function apply(){root.classList.toggle("na",!D.set.anim);D.set.theme=="auto"?root.removeAttribute("data-theme"):root.setAttribute("data-theme",D.set.theme)}
function toast(m,undo){U=undo;const t=$("#kt");t.innerHTML=`<span>${E(m)}</span>${undo?'<button data-a="undo">Urungkan</button>':""}`;t.classList.add("on");clearTimeout(TM);TM=setTimeout(()=>{t.classList.remove("on");U=null},undo?6000:2200)}
const sheet=h=>{$("#ko").innerHTML=`<div class="bs">${h}</div>`;$("#ko").classList.add("on")},closeSh=()=>$("#ko").classList.remove("on");
function snd(k){if(!D.set.snd)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();const t=AC.currentTime,v=D.set.vol;
const tone=(f,d,ty,g,at=0)=>{const o=AC.createOscillator(),a=AC.createGain();o.type=ty;o.frequency.value=f;a.gain.setValueAtTime(0,t+at);a.gain.linearRampToValueAtTime(g*v,t+at+.01);a.gain.exponentialRampToValueAtTime(.0001,t+at+d);o.connect(a);a.connect(AC.destination);o.start(t+at);o.stop(t+at+d+.05)};
const noise=(d,g,fq)=>{const n=Math.floor(AC.sampleRate*d),b=AC.createBuffer(1,n,AC.sampleRate),x=b.getChannelData(0);for(let i=0;i<n;i++)x[i]=(Math.random()*2-1)*(1-i/n);const s=AC.createBufferSource();s.buffer=b;const f=AC.createBiquadFilter();f.type="bandpass";f.frequency.value=fq;const a=AC.createGain();a.gain.value=g*v;s.connect(f);f.connect(a);a.connect(AC.destination);s.start(t)};
({open:()=>noise(.6,.5,300),flip:()=>noise(.25,.35,2500),read:()=>noise(.2,.3,1200),click:()=>tone(520,.06,"sine",.12),save:()=>{tone(660,.15,"sine",.12);tone(880,.2,"sine",.1,.08)},check:()=>tone(740,.09,"triangle",.14)})[k]()}catch(e){}}
// data
function addTitle(acc,name){const n=(D.seq[acc]||0)+1;D.seq[acc]=n;const t={id:uid("t"),acc,num:n,name,created:now(),ready:false,fav:false,arc:false,pages:pg0()};D.titles.push(t);log("Judul dibuat: "+name);save();return t}
function dupTitle(s){const c={...s,id:uid("t"),num:(D.seq[s.acc]=(D.seq[s.acc]||0)+1),name:s.name+" (salinan)",created:now(),ready:false,pages:s.pages.map(p=>({id:uid("p"),t:p.t}))};D.titles.push(c);log("Judul diduplikasi: "+s.name);save();return c}
function delTitle(id){const t=gT(id),i=D.titles.indexOf(t);D.titles.splice(i,1);log("Judul dihapus: "+t.name);save();return[t,i]}
// views
const vCover=()=>`<div class="cover"><div class="bk" id="kbk"><div class="inner"></div><div class="front"><i class="orn"></i><h2>M.C.F.A</h2><h3>CONTENT BOOK</h3><i class="orn"></i><small>PERSONAL DIGITAL CONTENT LIBRARY</small></div></div><button class="gold" data-a="open">BUKA BUKU</button><button class="ib" data-a="cbx" aria-label="Tutup Content Book" style="position:absolute;top:calc(14px + env(safe-area-inset-top,0px));left:14px;background:#ffffff1f;color:#fff">${ic("back")}</button></div>`;
const hdr=(s,c,r)=>`<header class="top"><button class="ib" data-a="back" aria-label="Kembali">${ic("back")}</button><div><div class="s">${s}</div><div class="c" id="khc">${c}</div></div>${r}</header>`,gear=`<button class="ib" data-a="set" aria-label="Pengaturan">${ic("set")}</button>`;
const pidOfAcc=a=>PID[(+String(a).replace("acc",""))-1],av=(a,c)=>{const p=pidOfAcc(a);return p?`<img class="cbav ${c||""}" src="${p}.jpg" alt="" loading="lazy" decoding="async" data-p="${p}" onerror="this.style.display='none'">`:""},hdrA=(a,s,c,r)=>hdr(s,c,r).replace("</button><div>","</button>"+av(a,"sm")+"<div>");
function vAcc(){const s=stats();return hdr("M.C.F.A CONTENT BOOK","Akun",gear)+`<main class="w"><div class="stats"><div><b>${s.t}</b>judul</div><div><b>${s.p}</b>lembar</div><div><b>${s.u}</b>siap</div></div><label class="sb">${ic("search",18)}<input id="kgs" placeholder="Cari…" autocomplete="off"></label><div id="kgr"></div><div class="grid">${D.accounts.map((a,i)=>`<div class="acc" data-a="acc" data-id="${a.id}"><b>${pad(i+1)}</b>${av(a.id)}<div><span>${E(a.name)}</span><i>${D.titles.filter(t=>t.acc==a.id).length} judul</i></div></div>`).join("")}</div></main>`}
function gsearch(q){q=q.trim().toLowerCase();const o=$("#kgr");if(!q){o.innerHTML="";return}
const r=D.accounts.filter(a=>a.name.toLowerCase().includes(q)).map(a=>`<div class="ent" data-a="acc" data-id="${a.id}"><span class="no">${ic("book",16)}</span><span class="nm">${E(a.name)}</span></div>`).concat(D.titles.filter(t=>(t.name+" "+t.pages.map(p=>p.t).join(" ")).toLowerCase().includes(q)).slice(0,30).map(t=>`<div class="ent" data-a="title" data-id="${t.id}"><span class="no">${pad(t.num,3)}</span><span class="nm">${E(t.name||"Tanpa judul")}</span><span class="dots"></span><span class="pn">${E(gA(t.acc).name)}</span></div>`));
o.innerHTML=`<div class="paper" style="margin-bottom:24px">${r.join("")||'<div class="emp">—</div>'}</div>`}
const SO={num:"No",new:"Baru",nama:"A–Z"};
function vToc(){const a=gA(R.acc);return hdrA(a.id,"DAFTAR ISI",E(a.name),gear)+`<main class="w"><label class="sb">${ic("search",18)}<input id="ktq" placeholder="Cari judul…" value="${E(R.tq||"")}" autocomplete="off"></label><div class="seg">${[["","Semua"],["r",ic("send",16)],["f",ic("star",16)],["a",ic("arc",16)]].map(([k,l])=>`<button class="chip ${(R.f||"")==k?"on":""}" data-a="flt" data-v="${k}" ${k?`aria-label="filter"`:""}>${l}</button>`).join("")}<button class="chip" data-a="sort">${SO[R.so||"num"]}</button></div><div class="paper" id="klst"></div></main><button class="fab" data-a="nt" aria-label="Judul baru">${ic("plus",26)}</button>`}
function fillToc(){const f=R.f||"",q=(R.tq||"").toLowerCase(),so=R.so||"num";
const L=D.titles.filter(t=>t.acc==R.acc&&(f=="a"?t.arc:!t.arc)&&(!q||t.name.toLowerCase().includes(q))&&(f==""||f=="a"||(f=="f"?t.fav:t.ready)));
L.sort(so=="new"?(x,y)=>y.created.localeCompare(x.created):so=="nama"?(x,y)=>x.name.localeCompare(y.name):(x,y)=>x.num-y.num);const lim=R.lim||100;
$("#klst").innerHTML=L.slice(0,lim).map(t=>`<div class="ent ${t.id==R.nid?"new":""}" data-a="title" data-id="${t.id}"><span class="no">${pad(t.num,3)}</span><span class="nm">${E(t.name||"Tanpa judul")}</span>${t.fav?`<span class="gd">${ic("star",14,1)}</span>`:""}${t.ready?`<span class="ok">${ic("check",12)}</span>`:""}${window.MCFA_CB_SYNC&&MCFA_CB_SYNC.pub(t.id)?`<span class="pn" style="color:var(--ac);font-weight:600">TERBIT</span>`:""}<span class="dots"></span><span class="pn">${t.pages.length}</span></div>`).join("")+(L.length>lim?`<div class="emp"><button class="chip" data-a="more">+${L.length-lim}</button></div>`:"")||`<div class="emp">${ic("book",34)}—</div>`;R.nid=null}
const leaf=(p,i,n)=>`<section class="leaf"><div class="ph"><span>${i+1} / ${n}</span><span><button class="ib sm" data-a="pup" data-pid="${p.id}" aria-label="Naik">${ic("up",16)}</button><button class="ib sm" data-a="pdn" data-pid="${p.id}" aria-label="Turun">${ic("down",16)}</button><button class="ib sm" data-a="pdel" data-pid="${p.id}" aria-label="Hapus lembar">${ic("trash",16)}</button></span></div><textarea class="pgtxt" data-pid="${p.id}" placeholder="Tulis di sini…">${E(p.t)}</textarea></section>`;
function vEd(){const t=gT(R.tid);return hdrA(t.acc,E(gA(t.acc).name)+" · "+pad(t.num,3),E(t.name||"Tanpa judul"),`<button class="ib" data-a="more" aria-label="Menu">${ic("more")}</button>`)+`<main class="w"><input class="tt" data-f="name" value="${E(t.name)}" placeholder="Judul" autocomplete="off"><div class="r2"><label class="sw"><input type="checkbox" data-a="rdy" ${t.ready?"checked":""}>Siap upload</label><span class="meta"><span id="kwc"></span> <span id="ksv"></span></span></div><div class="kst" id="kst"></div>${t.pages.map((p,i)=>leaf(p,i,t.pages.length)).join("")}</main><button class="fab" data-a="padd" aria-label="Lembar baru">${ic("plus",26)}</button>`}
function kst(){const t=R.v=="editor"?gT(R.tid):null,e=$("#kst");if(!t||!e)return;let h="";try{h=window.MCFA_CB_SYNC&&MCFA_CB_SYNC.statusHtml?MCFA_CB_SYNC.statusHtml(t,D.accounts):""}catch(x){}if(e.__h!==h){e.__h=h;e.innerHTML=h}}
const wc=()=>{const t=gT(R.tid),e=$("#kwc");if(t&&e)e.textContent=t.pages.length+" lbr · "+words(t)+" kata"},grow=t=>{t.style.height="auto";t.style.height=t.scrollHeight+"px"};
function render(still){if(R.v=="editor"&&!gT(R.tid))R={v:"toc",acc:R.acc};$("#kv").innerHTML=({cover:vCover,accounts:vAcc,toc:vToc,editor:vEd})[R.v]();if(still){const w=$("#kv .w");w&&w.classList.add("still")}
if(R.v=="toc")fillToc();if(R.v=="editor"){wc();kst()}$$(".pgtxt").forEach(grow)}
function go(r,s){R=r;snd(s||"flip");render();OV.scrollTop=0}
// settings & tests
function openSet(){const s=D.set;sheet(`<h2>Pengaturan</h2><label class="sw"><input type="checkbox" data-s="snd" ${s.snd?"checked":""}>Suara</label><input type="range" data-s="vol" min="0" max="1" step=".05" value="${s.vol}" style="width:100%;accent-color:#b08d57"><br><label class="sw"><input type="checkbox" data-s="anim" ${s.anim?"checked":""}>Animasi</label>
<div class="seg" style="margin-top:12px">${[["auto","Auto"],["light","Terang"],["dark","Gelap"]].map(([k,l])=>`<button class="chip ${s.theme==k?"on":""}" data-a="th" data-v="${k}">${l}</button>`).join("")}</div>
<div class="seg"><button class="chip" data-a="exp">${ic("send",16)} Cadangan</button><button class="chip" data-a="imp">Impor</button><button class="chip" data-a="test">Uji</button></div><input type="file" id="kbf" accept=".json,.txt" hidden><div id="ktr"></div>
<h2 style="margin-top:16px;font-size:16px">Riwayat</h2>${D.log.slice(-20).reverse().map(l=>`<div class="lg">${new Date(l.t).toLocaleString("id-ID",{dateStyle:"short",timeStyle:"short"})} · ${E(l.m)}</div>`).join("")||'<div class="lg">—</div>'}`)}
function importText(txt){try{const d=JSON.parse(txt);if(!d||!Array.isArray(d.titles))throw 0;const prev=D;D=norm(d);log("Data diimpor");save();apply();closeSh();go({v:"accounts"},"save");toast("Data dimuat",()=>{D=prev;save();apply();go({v:"accounts"},"click")})}catch(e){toast("Berkas tidak valid")}}
function tests(){const keep=D;NOSAVE=true;const o=[],ok=(n,c)=>o.push([n,!!c]);
try{D=blank();const a=addTitle("acc1","A"),b=addTitle("acc2","B"),c=addTitle("acc1","C");
ok("10 akun tidak tercampur",D.accounts.length==10&&D.titles.filter(t=>t.acc=="acc1").length==2&&b.acc=="acc2");ok("Nomor judul unik per akun",a.num==1&&c.num==2&&b.num==1);
a.pages.push({id:uid("p"),t:"x"});a.pages[0].t="halo";ok("Banyak lembar; edit tidak mengubah judul lain",a.pages.length==2&&c.pages.length==1&&c.pages[0].t==""&&b.pages[0].t=="");
a.ready=true;ok("Siap upload independen",a.ready&&!b.ready&&!c.ready);
const d=dupTitle(a);ok("Duplikasi tidak berbagi data",d.id!=a.id&&d.pages[0].id!=a.pages[0].id&&d.pages[0].t=="halo"&&!d.ready&&d.num==3);
delTitle(b.id);ok("Hapus judul tidak menghapus yang lain",D.titles.length==3&&D.titles.every(t=>t.id!=b.id));ok("ID unik",new Set(D.titles.map(x=>x.id)).size==D.titles.length);
const raw=JSON.stringify(D);ok("Data utuh setelah simpan-muat",JSON.stringify(norm(JSON.parse(raw)))==JSON.stringify(norm(D)));
try{localStorage.setItem("t-k","1");ok("Penyimpanan berfungsi",localStorage.getItem("t-k")=="1");localStorage.removeItem("t-k")}catch(e){ok("Penyimpanan berfungsi",false)}
}catch(e){ok("Error: "+e.message,false)}D=keep;NOSAVE=false;return o}
// actions
function act(a,d,el){const t=gT(R.tid),en=()=>{const x=$$(".pgtxt");return x[x.length-1]};
switch(a){
case"cbx":closeCB();break;
case"open":$("#kbk").classList.add("open");snd("open");setTimeout(()=>go({v:"accounts"}),D.set.anim?1000:0);break;
case"back":if(R.v=="accounts"||R.v=="cover"){closeCB();break}go({...R,v:BK[R.v]||"cover",tid:null});break;
case"acc":go({v:"toc",acc:d.id});break;
case"title":go({v:"editor",acc:gT(d.id).acc,tid:d.id},"read");break;
case"nt":sheet(`<h2>Judul baru</h2><input class="tt" id="kan" placeholder="Judul konten" autocomplete="off"><button class="gold" data-a="addok" style="width:100%">${ic("check",18)} TAMBAH</button>`);setTimeout(()=>$("#kan").focus(),60);break;
case"addok":{const n=$("#kan").value.trim();if(!n){$("#kan").focus();break}closeSh();const x=addTitle(R.acc,n);go({v:"editor",acc:x.acc,tid:x.id},"save");setTimeout(()=>{const p=$(".pgtxt");p&&p.focus()},80);break}
case"flt":R.f=d.v;R.lim=100;render(1);break;
case"sort":R.so=R.so=="num"||!R.so?"new":R.so=="new"?"nama":"num";render(1);break;
case"more":sheet(`<button class="mi" data-a="mfav">${ic("star",20,t.fav)} ${t.fav?"Lepas favorit":"Favorit"}</button><button class="mi" data-a="marc">${ic("arc")} ${t.arc?"Keluarkan dari arsip":"Arsipkan"}</button><button class="mi" data-a="mdup">${ic("copy")} Duplikat</button><button class="mi rd" data-a="mdel">${ic("trash")} Hapus judul</button>`);break;
case"mfav":t.fav=!t.fav;save();closeSh();toast(t.fav?"Favorit":"Favorit dilepas");break;
case"marc":t.arc=!t.arc;save();closeSh();toast(t.arc?"Diarsipkan":"Dikeluarkan dari arsip");break;
case"mdup":{closeSh();const c=dupTitle(t);go({v:"editor",acc:c.acc,tid:c.id},"save");toast("Diduplikasi");break}
case"mdel":{closeSh();const[x,i]=delTitle(t.id);go({v:"toc",acc:R.acc},"click");toast("Judul dihapus",()=>{D.titles.splice(Math.min(i,D.titles.length),0,x);log("Judul dipulihkan: "+x.name);save();if(R.v=="toc")render(1)});break}
case"undo":{const f=U;U=null;$("#kt").classList.remove("on");f&&f();break}
case"rdy":t.ready=el.checked;save();snd("check");toast(t.ready?(window.MCFA_CB_SYNC&&MCFA_CB_SYNC.pub(t.id)?"Konten ini sudah terbit":"Masuk ke Produksi Konten (Aktivitas)"):"Dikeluarkan dari Produksi Konten");break;
case"padd":t.pages.push({id:uid("p"),t:""});save();snd("flip");render(1);{const x=en();x.focus();x.scrollIntoView({block:"center",behavior:"smooth"})}break;
case"pdel":{const i=t.pages.findIndex(x=>x.id==d.pid),p=t.pages[i],old=p.t;if(t.pages.length==1)p.t="";else t.pages.splice(i,1);save();render(1);
if(old.trim())toast("Lembar dihapus",()=>{if(!t.pages.includes(p))t.pages.splice(Math.min(i,t.pages.length),0,p);p.t=old;save();if(R.v=="editor"&&R.tid==t.id)render(1)});break}
case"pup":case"pdn":{const i=t.pages.findIndex(x=>x.id==d.pid),j=a=="pup"?i-1:i+1;if(j<0||j>=t.pages.length)break;[t.pages[i],t.pages[j]]=[t.pages[j],t.pages[i]];save();snd("flip");render(1);break}
case"set":openSet();break;
case"th":D.set.theme=d.v;save();apply();openSet();break;
case"exp":{const a2=document.createElement("a");a2.href=URL.createObjectURL(new Blob([JSON.stringify(D)],{type:"application/json"}));a2.download="mcfa-content-book-"+now().slice(0,10)+".json";document.body.append(a2);a2.click();a2.remove();setTimeout(()=>URL.revokeObjectURL(a2.href),5000);break}
case"imp":$("#kbf").click();break;
case"test":{const r=tests();$("#ktr").innerHTML=`<div class="lg" style="margin-top:8px"><b>${r.filter(x=>x[1]).length}/${r.length}</b></div>`+r.map(([n,c])=>`<div class="lg">${c?"✓":"✗"} ${E(n)}</div>`).join("")}}}
root.addEventListener("click",e=>{if(e.target.id=="ko"){closeSh();return}const el=e.target.closest("[data-a]");if(el){if(!["rdy","open"].includes(el.dataset.a))snd("click");act(el.dataset.a,el.dataset,el)}});
OV.addEventListener("keydown",e=>{if(e.key=="Escape"){if($("#ko").classList.contains("on"))closeSh();else closeCB()}if(e.key=="Enter"&&e.target.id=="kan")act("addok",{})});
function saveSoon(){dirty=true;const v=$("#ksv");if(v)v.textContent="…";clearTimeout(ST);ST=setTimeout(()=>{save();const v=$("#ksv");if(v)v.textContent="✓"},450)}
root.addEventListener("input",e=>{const el=e.target,d=el.dataset;
if(d.pid){const t=gT(R.tid),i=t.pages.findIndex(p=>p.id==d.pid),p=t.pages[i];p.t=el.value;grow(el);
if(i==t.pages.length-1&&el.value.length>2800&&el.selectionStart==el.value.length){let c=el.value.lastIndexOf("\n\n",2600);if(c<1200)c=el.value.lastIndexOf(" ",2600);if(c<1200)c=2600;const rest=el.value.slice(c).trimStart();p.t=el.value.slice(0,c).trimEnd();t.pages.push({id:uid("p"),t:rest});save();snd("flip");render(1);const x=$$(".pgtxt"),l=x[x.length-1];l.focus();l.setSelectionRange(l.value.length,l.value.length);return}
wc();saveSoon()}
else if(d.f){const t=gT(R.tid);t.name=el.value;const h=$("#khc");if(h)h.textContent=el.value||"Tanpa judul";saveSoon()}
else if(el.id=="kgs")gsearch(el.value);else if(el.id=="ktq"){R.tq=el.value;fillToc()}
else if(d.s){D.set[d.s]=el.type=="checkbox"?(el.checked?1:0):+el.value;save();apply()}});
root.addEventListener("change",e=>{const el=e.target;if(el.id=="kbf"&&el.files[0]){const r=new FileReader();r.onload=()=>importText(r.result);r.readAsText(el.files[0])}});
addEventListener("resize",()=>$$(".pgtxt").forEach(grow));if(document.fonts)document.fonts.ready.then(()=>$$(".pgtxt").forEach(grow));
function hideCB(){flush();OV.classList.remove("on")}
function navBack(){if(R.v=="editor"||R.v=="toc"){go({...R,v:BK[R.v],tid:null},"flip");window.MCFA_NAV&&MCFA_NAV.push("cb",navBack)}else hideCB()}
function closeCB(){if(!OV.classList.contains("on"))return;hideCB();window.MCFA_NAV&&MCFA_NAV.drop("cb")}
function idle(){const a=document.activeElement;return!dirty&&!(a&&OV.contains(a)&&/^(TEXTAREA|INPUT)$/.test(a.tagName))}
function reload(){if(!idle())return false;let r=null;try{r=localStorage.getItem(K)}catch(e){}if(r===null||r===RAW)return false;try{D=norm(JSON.parse(r));RAW=r}catch(e){return false}apply();if(OV.classList.contains("on")&&R.v!="cover")render(1);return true}
function openCB(pid,tid){reload();if(!OV.classList.contains("on")){OV.classList.add("on");if(window.MCFA_NAV&&!MCFA_NAV.has("cb"))MCFA_NAV.push("cb",navBack)}
const i=pid?PID.indexOf(pid):-1,tt=tid&&gT(tid);if(tt){R={v:"editor",acc:tt.acc,tid:tt.id};render();OV.scrollTop=0}else if(i>=0){R={v:"toc",acc:"acc"+(i+1)};render();OV.scrollTop=0}else if(R.v=="editor"&&!gT(R.tid)){R={v:"accounts"};render()}
if(!document.getElementById("cbFonts")){const l=document.createElement("link");l.id="cbFonts";l.rel="stylesheet";l.href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Lora:wght@400;500&family=Playfair+Display:wght@500;700&display=swap";document.head.appendChild(l)}}
addEventListener("storage",e=>{if(e.key==K||e.key===null){if(reload())try{document.dispatchEvent(new Event("mcfa:cb"))}catch(x){}}});
document.addEventListener("mcfa:data",()=>{if(reload())try{document.dispatchEvent(new Event("mcfa:cb"))}catch(x){}});
window.MCFAContentBook={data:()=>D,pid:PID,open:openCB,close:closeCB,reload:reload,pidOf:a=>PID[(+String(a).replace("acc",""))-1],accOf:p=>"acc"+(PID.indexOf(p)+1),refreshStatus:kst,countFor:p=>D.titles.filter(t=>t.acc=="acc"+(PID.indexOf(p)+1)).length};
apply();render();
})();
