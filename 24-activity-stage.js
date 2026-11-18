/* AKTIVITAS × TAHAP — dashboard perjalanan 1.096 hari (Bibit & Akar → Batang → Bunga).
   Semua angka dihitung dari MCFA_TAHAP.def (satu sumber tanggal: MCFA_CORE) dan checklist Kegiatan Sehari-hari yang sudah ada.
   Tidak ada angka statis, tidak ada data/centang baru. Kartu tetap .tp-card[data-tahap] agar pemilih tahap global (23-stage-system.js) tetap bekerja. */
(function(){
  'use strict';
  var SLOT = '.tp-wrap[data-tp-page="aktivitas"]';
  var BULAN = ['JAN','FEB','MAR','APR','MEI','JUN','JUL','AGU','SEP','OKT','NOV','DES'];
  var NAMA = {1:{nm:'BIBIT & AKAR', tag:'Menanam dan menguatkan akar'}, 2:{nm:'BATANG', tag:'Tumbuh tegak dan menguat'}, 3:{nm:'BUNGA', tag:'Daun dan bunga'}};

  function fmt(n){ return Number(n).toLocaleString('id-ID'); }
  function pctText(done,total){ var p = total>0 ? done/total*100 : 0; return p.toLocaleString('id-ID',{maximumFractionDigits:1}); }
  function pctNum(done,total){ return total>0 ? Math.min(100, done/total*100) : 0; }
  function nowD(){ try{ return mcfaNowJakarta(); }catch(e){ return mcfaMidnight(); } }
  function shortDate(iso){ var d = mcfaParse(iso); return d.getDate()+' '+BULAN[d.getMonth()]+' '+d.getFullYear(); }

  /* ── data: item per hari (dari daftar nyata di DOM) + centang tersimpan per tahap ── */
  function itemKeys(){
    var keys = {}, n = 0;
    document.querySelectorAll('#body-harian .ba-item:not(.ba-prod-item)').forEach(function(el, i){ keys[el.dataset.bk || ('item_'+i)] = 1; n++; });
    return {keys:keys, count:n};
  }
  function doneByStage(keys){
    var out = {1:0, 2:0, 3:0};
    var rng = [1,2,3].map(function(n){ var d = MCFA_TAHAP.def[n]; return [mcfaParse(d.start), mcfaParse(d.end)]; });
    try{
      for (var i = 0; i < localStorage.length; i++){
        var k = localStorage.key(i), m = /^ba_(\d{4})_(\d{1,2})_(\d{1,2})$/.exec(k || ''); if (!m) continue;
        if (k !== 'ba_' + (+m[1]) + '_' + (+m[2]) + '_' + (+m[3])) continue;   /* AUDIT 20261117.8: hanya kunci kanonis (sama dengan progres mingguan/keseluruhan) — varian berangka nol di depan tidak boleh terhitung ganda */
        var d = new Date(+m[1], +m[2]-1, +m[3]), n = 0;
        for (var s = 0; s < 3; s++){ if (d >= rng[s][0] && d <= rng[s][1]){ n = s+1; break; } }
        if (!n) continue;                                   /* sebelum DAY 1 / setelah akhir proyek: tidak dihitung */
        var rec = JSON.parse(localStorage.getItem(k) || '{}'), c = rec.checks || {};
        Object.keys(c).forEach(function(key){ if (keys[key] && c[key] === true) out[n]++; });
      }
    }catch(err){}
    return out;
  }
  function stats(){
    var it = itemKeys(), done = doneByStage(it.keys), today = nowD(), res = {stages:{}, items:it.count, all:{done:0,total:0,days:0,elapsed:0}};
    [1,2,3].forEach(function(n){
      var d = MCFA_TAHAP.def[n], days = mcfaDaysInclusive(d.start, d.end);
      var el = Math.min(days, Math.max(0, mcfaDaysBetween(mcfaParse(d.start), today) + 1));
      var state = today < mcfaParse(d.start) ? 'next' : (today > mcfaParse(d.end) ? 'done' : 'now');
      var s = {n:n, def:d, days:days, elapsed:el, left:days-el, state:state, done:done[n], total:it.count*days};
      res.stages[n] = s; res.all.done += s.done; res.all.total += s.total; res.all.days += days; res.all.elapsed += el;
    });
    return res;
  }

  /* ── ikon pertumbuhan (SVG inline, tanpa gambar eksternal) ── */
  function ico(n){
    var g = '<path d="M4 33h32" class="tj-soil"/>';
    if (n === 1) return '<svg viewBox="0 0 40 40" aria-hidden="true">'+g+
      '<path d="M20 33V22" class="tj-stem"/><path d="M20 24c-5 0-8-3-8-7 5 0 8 3 8 7z" class="tj-leaf"/><path d="M20 21c0-4 3-7 8-7 0 4-3 7-8 7z" class="tj-leaf"/>'+
      '<path d="M20 33c-1 3-4 4-7 5M20 33c0 3 0 4 0 5M20 33c1 3 4 4 7 5" class="tj-root"/></svg>';
    if (n === 2) return '<svg viewBox="0 0 40 40" aria-hidden="true">'+g+
      '<path d="M20 33V9" class="tj-stem"/><path d="M20 28c-5 0-8-2-9-6 5 0 8 2 9 6z" class="tj-leaf"/><path d="M20 22c5 0 8-2 9-6-5 0-8 2-9 6z" class="tj-leaf"/>'+
      '<path d="M20 16c-4 0-6-2-7-5 4 0 6 2 7 5z" class="tj-leaf"/><path d="M20 12c1-3 3-4 6-4 0 3-2 4-6 4z" class="tj-leaf"/>'+
      '<path d="M20 33c-1 2-3 3-5 4M20 33c1 2 3 3 5 4" class="tj-root"/></svg>';
    return '<svg viewBox="0 0 40 40" aria-hidden="true">'+g+
      '<path d="M20 33V17" class="tj-stem"/><path d="M20 28c-5 0-8-2-9-6 5 0 8 2 9 6z" class="tj-leaf"/><path d="M20 25c5 0 8-2 9-6-5 0-8 2-9 6z" class="tj-leaf"/>'+
      '<circle cx="20" cy="8.5" r="4.2" class="tj-crown"/><circle cx="14.6" cy="12.4" r="4.2" class="tj-crown"/><circle cx="25.4" cy="12.4" r="4.2" class="tj-crown"/>'+
      '<circle cx="16.7" cy="17.6" r="4.2" class="tj-crown"/><circle cx="23.3" cy="17.6" r="4.2" class="tj-crown"/><circle cx="20" cy="13" r="2.8" class="tj-fruit"/></svg>';
  }

  /* ── kerangka dashboard (dibuat sekali; angka diisi paint()) ── */
  function build(wrap){
    if (wrap.classList.contains('tj')) return;
    var keep = wrap.querySelector('.tp-detail');   /* pertahankan kotak rincian yang sudah ada */
    wrap.classList.add('tj');
    var d1 = MCFA_TAHAP.def[1], d3 = MCFA_TAHAP.def[3];
    /* pemilih Tahap gaya M.C.F.A STUDIO: tombol ringkas TAHAP + angka; seluruh isi tahap baru tampil di rincian saat dipilih */
    var cards = [1,2,3].map(function(n){
      return '<button type="button" class="tp-card" role="tab" aria-selected="false" data-tahap="'+n+'" aria-label="Tahap '+n+' · '+NAMA[n].nm+'">'+
        '<span class="tp-lbl">TAHAP</span><span class="tp-num">'+n+'</span></button>';
    }).join('');
    wrap.innerHTML =
      '<div class="tj-head"><div class="tj-kr"><span class="tj-k">M.C.F.A PROJECT · BIBIT BARU</span><span class="tj-live" data-s="live"></span></div>'+
        '<b class="tj-t">Perjalanan <span data-s="totdays"></span> Hari</b>'+
        '<span class="tj-d">'+shortDate(d1.start)+' → '+shortDate(d3.end)+' · DAY 1 – DAY <span data-s="totdays2"></span></span></div>'+
      '<div class="tj-total">'+
        '<div class="tj-tc"><small>WAKTU BERJALAN</small><b data-s="tpct"></b><span data-s="tsub"></span></div>'+
        '<div class="tj-tc"><small>AKTIVITAS SELESAI</small><b data-s="apct"></b><span data-s="asub"></span></div>'+
      '</div>'+
      '<div class="tj-track" role="progressbar" aria-label="Progres aktivitas keseluruhan" aria-valuemin="0" aria-valuemax="100"><i data-s="abar"></i></div>'+
      '<div class="tp-row" role="tablist" aria-label="Pilih tahap">'+cards+'</div>'+
      '<div class="tp-detail" data-tp-detail="aktivitas" hidden></div>';
    if (keep){ var fresh = wrap.querySelector('.tp-detail'); wrap.replaceChild(keep, fresh); }
  }
  function slot(root, name){ return root.querySelector('[data-s="'+name+'"]'); }
  function put(root, name, txt){ var e = slot(root, name); if (e && e.textContent !== txt) e.textContent = txt; }

  var CHIP = {now:'BERJALAN', done:'SELESAI', next:'MENUNGGU'};
  function paint(){
    var wrap = document.querySelector(SLOT); if (!wrap || !wrap.classList.contains('tj') || !window.MCFA_TAHAP) return;
    var st = stats(), A = st.all, today = nowD(), pS = mcfaParse(MCFA_CORE.projectStart), pE = mcfaParse(MCFA_CORE.projectEnd), live;
    if (today < pS) live = 'DAY 1 DALAM '+fmt(mcfaDaysBetween(today, pS))+' HARI';
    else if (today > pE) live = 'PROJECT SELESAI';
    else live = 'TAHAP '+MCFA_TAHAP.running()+' · DAY '+fmt(MCFA_DERIVED.projectDayOf(today));
    put(wrap, 'live', live);
    put(wrap, 'totdays', fmt(A.days)); put(wrap, 'totdays2', fmt(A.days));
    put(wrap, 'tpct', pctText(A.elapsed, A.days)+'%');
    put(wrap, 'tsub', fmt(A.elapsed)+' / '+fmt(A.days)+' hari');
    put(wrap, 'apct', pctText(A.done, A.total)+'%');
    put(wrap, 'asub', fmt(A.done)+' / '+fmt(A.total)+' tugas');
    var ab = slot(wrap, 'abar'); if (ab) ab.style.width = pctNum(A.done, A.total)+'%';
    var tr = wrap.querySelector('.tj-track'); if (tr) tr.setAttribute('aria-valuenow', String(Math.round(pctNum(A.done, A.total))));
    wrap.querySelectorAll('.tp-card').forEach(function(card){
      card.setAttribute('data-state', st.stages[+card.getAttribute('data-tahap')].state);
    });
  }

  /* ── rincian tahap terpilih ── */
  function render(n, def, el){
    var all = stats(), s = all.stages[n], h = '';
    h += '<div class="tj-dcard tj-s'+n+'" data-state="'+s.state+'">'+
      '<span class="tj-ico">'+ico(n)+'</span>'+
      '<div class="tj-main">'+
        '<div class="tj-top"><span class="tj-no">TAHAP '+n+'</span><span class="tj-chip">'+CHIP[s.state]+'</span></div>'+
        '<div class="tj-nm">'+NAMA[n].nm+'</div>'+
        '<div class="tj-per">'+shortDate(def.start)+' – '+shortDate(def.end)+'</div>'+
        '<div class="tj-fact">'+NAMA[n].tag+'</div>'+
        '<div class="tj-pills"><span>'+fmt(s.days)+' HARI</span><span>'+fmt(s.total)+' TUGAS</span></div>'+
      '</div></div>';
    h += '<div class="tj-dgrid">'+
      '<div><small>HARI BERJALAN</small><b>'+fmt(s.elapsed)+'</b><span>dari '+fmt(s.days)+'</span></div>'+
      '<div><small>SISA HARI</small><b>'+fmt(s.left)+'</b><span>'+(s.state==='next'?'belum mulai':(s.state==='done'?'tahap selesai':'menuju akhir'))+'</span></div>'+
      '<div><small>TUGAS SELESAI</small><b>'+fmt(s.done)+'</b><span>dari '+fmt(s.total)+'</span></div></div>';
    h += '<div class="tp-prow hr"><div class="tp-ptop"><span class="tp-pname">Kegiatan Sehari-hari · Tahap '+n+'</span><span class="tp-ppct">'+pctText(s.done, s.total)+'%</span></div>'+
         '<div class="tp-ptrack"><div class="tp-pfill" style="width:'+pctNum(s.done, s.total)+'%"></div></div>'+
         '<div class="tp-psub">'+fmt(s.done)+' / '+fmt(s.total)+' tugas · '+fmt(all.items)+' tugas per hari</div></div>';
    el.innerHTML = h;
  }
  /* ── pilihan tahap KHUSUS Aktivitas ──
     Rincian baru terbuka setelah tombol tahap diketuk di halaman ini. Pilihan bersama (MCFA_TAHAP.get(), yang dipakai halaman lain dan
     otomatis diisi tahap berjalan oleh 32-career-growth-map.js) TIDAK membuka rincian di sini. Tahap berjalan tetap ditandai lencana AKTIF. */
  var aSel = null;
  function paintLocal(){
    var wrap = document.querySelector(SLOT); if (!wrap || !wrap.classList.contains('tj')) return;
    wrap.querySelectorAll('.tp-card').forEach(function(b){ b.setAttribute('aria-selected', String(+b.getAttribute('data-tahap') === aSel)); });
    var box = wrap.querySelector('.tp-detail'); if (!box) return;
    if (box._tpT){ clearTimeout(box._tpT); box._tpT = 0; }   /* batalkan penutupan tertunda milik sistem bersama */
    box.classList.remove('tp-out');
    if (aSel === null){ box.hidden = true; box.innerHTML = ''; return; }
    box.hidden = false;
    box.innerHTML = '<div class="tp-body" data-tp-body="aktivitas"></div>';
    render(aSel, MCFA_TAHAP.def[aSel], box.firstChild);
  }
  function refresh(){
    paint();
    if (aSel === null) return;
    var el = document.querySelector('.tp-body[data-tp-body="aktivitas"]');
    if (el) render(aSel, MCFA_TAHAP.def[aSel], el);
  }

  function init(){
    var wrap = document.querySelector(SLOT); if (!wrap) return false;
    build(wrap); paint(); paintLocal(); return true;
  }

  /* ketukan tombol tahap di Aktivitas ditangani di sini (fase capture, menggantikan penangan bersama untuk tombol ini saja) */
  document.addEventListener('click', function(e){
    var b = e.target.closest && e.target.closest('.tp-wrap.tj .tp-card'); if (!b) return;
    e.stopPropagation();
    var n = +b.getAttribute('data-tahap'); if (!MCFA_TAHAP.def[n]) return;
    aSel = (aSel === n) ? null : n;                 /* ketuk tahap yang sama = tutup; tahap lain = rincian lama tertutup, yang baru terbuka */
    paintLocal();
    var wrap = b.closest('.tp-wrap');
    if (aSel !== null && wrap) requestAnimationFrame(function(){
      var top = wrap.getBoundingClientRect().top + (window.pageYOffset || 0) - 84;
      if (Math.abs(top - (window.pageYOffset || 0)) > 6) window.scrollTo({top: Math.max(0, top), behavior: 'smooth'});
    });
  }, true);

  MCFA_TAHAP.register('aktivitas', function(){});   /* isi rincian dikelola paintLocal() */
  MCFA_TAHAP.onChange(function(n){ document.body.classList.toggle('tp-has', n !== null); document.body.classList.toggle('tp-stage1', n === 1); paint(); paintLocal(); });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ init(); }); else init();
  /* progres ikut berubah saat checklist diubah / direset */
  var page = document.getElementById('blueprintAktivitas');
  if (page){ ['click','change'].forEach(function(t){ page.addEventListener(t, function(){ setTimeout(refresh, 150); }, true); }); }
  window.addEventListener('storage', refresh);
  document.addEventListener('visibilitychange', function(){ if (!document.hidden) refresh(); });
  /* tanggal berganti (Asia/Jakarta) → status tahap & hari ikut diperbarui; halaman sendiri dimuat ulang oleh 41-midnight-rollover.js */
  setInterval(paint, 30000);
})();
