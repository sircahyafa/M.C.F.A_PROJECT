/* LANGKAH 8 — mesin suara baru (kompresor + sintesis berlapis) dan partikel ambient. */
(function(){
  'use strict';
  var muted=false; try{ muted=localStorage.getItem('mcfa_sfx')==='0'; }catch(e){}
  var bus=null;
  function B(){
    var c=_ac();
    if(!bus||bus.c!==c){ var comp=c.createDynamicsCompressor(); comp.threshold.value=-16; comp.ratio.value=6; comp.attack.value=.003; comp.release.value=.2;
      var g=c.createGain(); comp.connect(g); g.connect(c.destination); bus={c:c,i:comp,o:g}; }
    bus.o.gain.value=muted?0:1; return bus;
  }
  function osc(type,f,t,d,v,f2){
    var b=B(),c=b.c,o=c.createOscillator(),g=c.createGain(); o.type=type; o.frequency.setValueAtTime(f,t);
    if(f2) o.frequency.exponentialRampToValueAtTime(f2,t+d*.9);
    g.gain.setValueAtTime(.0001,t); g.gain.exponentialRampToValueAtTime(v,t+.012); g.gain.exponentialRampToValueAtTime(.0001,t+d);
    o.connect(g); g.connect(b.i); o.start(t); o.stop(t+d+.05);
  }
  function noise(t,d,v,f0,f1,type){
    var b=B(),c=b.c,n=Math.floor(c.sampleRate*d),buf=c.createBuffer(1,n,c.sampleRate),a=buf.getChannelData(0);
    for(var i=0;i<n;i++) a[i]=(Math.random()*2-1)*(1-i/n);
    var s=c.createBufferSource(); s.buffer=buf; var fl=c.createBiquadFilter(); fl.type=type||'bandpass'; fl.frequency.setValueAtTime(f0,t); fl.frequency.exponentialRampToValueAtTime(f1,t+d);
    var g=c.createGain(); g.gain.setValueAtTime(v,t); g.gain.exponentialRampToValueAtTime(.0001,t+d);
    s.connect(fl); fl.connect(g); g.connect(b.i); s.start(t);
  }
  function run(fn){ try{ if(muted) return; var t=B().c.currentTime; fn(t); }catch(e){} }
  var SFX={
    tap:function(){ run(function(t){ osc('sine',900,t,.07,.2,520); noise(t,.03,.05,5000,2500,'highpass'); }); },
    unlock:function(){ run(function(t){ osc('triangle',520,t,.1,.16,780); osc('sine',1040,t+.06,.12,.1); }); },
    undo:function(){ run(function(t){ osc('sine',640,t,.16,.14,380); }); },
    check:function(){ run(function(t){ [784,988,1319].forEach(function(f,i){ osc('triangle',f,t+i*.055,.22,.17); }); noise(t,.12,.04,6000,9000,'highpass'); }); },
    paid:function(){ run(function(t){ osc('sine',110,t,.25,.3,55); [988,1319,1760].forEach(function(f,i){ osc('triangle',f,t+.04+i*.07,.28,.15); }); noise(t+.1,.15,.04,7000,10000,'highpass'); }); },
    success:function(){ run(function(t){ osc('sine',65,t,.8,.35,50); [523.25,659.25,783.99,1046.5,1318.51].forEach(function(f,i){ osc('triangle',f,t+i*.08,.6,.15); osc('sawtooth',f/2,t+i*.08,.35,.04); }); noise(t,.55,.08,300,7000,'bandpass'); osc('sine',2093,t+.35,.6,.07); }); },
    goal:function(){ run(function(t){ osc('sine',80,t,.5,.4,45); [523.25,659.25,783.99,1046.5].forEach(function(f,i){ osc('sawtooth',f,t+i*.11,.22,.07); osc('triangle',f*2,t+i*.11,.22,.05); });
      [523.25,659.25,783.99,1046.5,1318.51].forEach(function(f){ osc('triangle',f,t+.5,1.0,.1); }); noise(t+.5,.9,.07,9000,5000,'highpass'); }); },
    whoosh:function(){ run(function(t){ noise(t,.3,.1,300,4500,'bandpass'); }); }
  };
  window.playTap=SFX.tap; window.playUnlock=SFX.unlock; window.playUndo=SFX.undo; window.playDebtPaid=SFX.paid; window.playSuccess=SFX.success; window.playGoalAchieved=SFX.goal;
  window.MCFA_SFX={play:function(n){ if(SFX[n]) SFX[n](); }, isMuted:function(){ return muted; },
    mute:function(m){ muted=!!m; try{ localStorage.setItem('mcfa_sfx',muted?'0':'1'); }catch(e){} if(bus) bus.o.gain.value=muted?0:1; if(!muted) SFX.tap(); }};
  if(typeof window.showAppPage==='function'){ var o2=window.showAppPage; window.showAppPage=function(){ var r=o2.apply(this,arguments); SFX.whoosh(); return r; }; }
  if(window.MCFA_TAHAP&&MCFA_TAHAP.onChange) MCFA_TAHAP.onChange(function(){ SFX.unlock(); });

  /* partikel ambient halus */
  function amb(){
    return;
    var d=document.createElement('div'); d.id='mcfaAmb'; d.setAttribute('aria-hidden','true'); var cols=['rgba(250,204,21,.9)','rgba(96,165,250,.9)','rgba(244,114,182,.8)','rgba(52,211,153,.8)'], h='';
    for(var i=0;i<14;i++) h+='<i style="--x:'+(Math.random()*100).toFixed(1)+'%;--s:'+(5+Math.random()*9).toFixed(1)+'px;--d:'+(11+Math.random()*12).toFixed(1)+'s;--dl:-'+(Math.random()*20).toFixed(1)+'s;--dx:'+((Math.random()*80-40)|0)+'px;--c:'+cols[i%4]+'"></i>';
    d.innerHTML=h; document.body.appendChild(d);
  }

  function init(){ amb(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
