/* SINKRON CONTENT BOOK → PRODUKSI KONTEN → AKUN (satu sumber data, satu ID permanen).
   Hubungan: judul Content Book (t.id, t.acc) ⇄ item konten akun (mcfa_konten_<akun>, field cbId). Judul TIDAK menjadi identitas.
   - "Siap upload" dicentang  → tepat SATU item (status 'siap') muncul di Aktivitas ▸ Produksi Konten; belum dihitung terbit.
   - Dicentang di Produksi Konten → status 'upload' (tercatat satu kali) → muncul di daftar konten terbit akun & statistik.
   - Centang dibatalkan / siap upload dimatikan → naskah, riwayat, dan item tetap ada (tidak ada data dihapus yang sudah terbit).
   Idempoten: boleh dijalankan berulang, dari banyak tab; duplikat cbId dibersihkan (yang terbit tidak pernah dihapus). */
(function(){
  'use strict';
  var CB = function(){ return window.MCFAContentBook; };
  var busy = false, again = false, timer = 0, pubIdx = {}, failToasted = false;

  function firstKey(){            /* tanggal valid pertama = hari ini, tetapi tidak pernah sebelum DAY 1 posting (contentStart) */
    var t = ''; try{ t = mcfaIso(mcfaNowJakarta()); }catch(e){}
    var iso = (!t || t < MCFA_CORE.contentStart) ? MCFA_CORE.contentStart : t, p = iso.split('-');
    return 'ba_' + (+p[0]) + '_' + (+p[1]) + '_' + (+p[2]);
  }
  function ddOf(key){ var p = key.replace('ba_','').split('_'); return (+p[2]) + '/' + (+p[1]) + '/' + (+p[0]); }
  function keyIso(key){ var p = String(key||'').replace('ba_','').split('_'); return p.length === 3 ? p[0] + '-' + ('0'+p[1]).slice(-2) + '-' + ('0'+p[2]).slice(-2) : ''; }
  function nextId(all){ var m = Date.now(); all.forEach(function(l){ l.forEach(function(k){ if(+k.id >= m) m = +k.id + 1; }); }); return m; }
  function hist(k, from, to, note){ if(typeof _kontenHist === 'function') _kontenHist(k, from, to, note); else { (k.hist = k.hist || []).push({t:new Date().toISOString(), d:'', from:from, to:to, n:note}); } }

  function sync(){
    if(busy){ again = true; return; }
    var api = CB(); if(!api || typeof _getKonten !== 'function' || typeof _saveKonten !== 'function' || typeof MCFA_CORE === 'undefined') return;
    busy = true;
    try{
      var D = api.data(), PID = api.pid, lists = {}, changed = {}, live = {}, idx = {}, fk = firstKey();
      D.titles.forEach(function(t){ live[t.id] = t; });
      var raw0 = {}, before = {};   /* Tahap 5: salinan mentah penyimpanan tiap akun SEBELUM diubah (untuk pemulihan bila simpan gagal) */
      PID.forEach(function(p){ lists[p] = _getKonten(p); before[p] = lists[p].length; try{ raw0[p] = localStorage.getItem(_kontenKey(p)); }catch(e){ raw0[p] = null; } });
      var all = PID.map(function(p){ return lists[p]; });

      /* 1) indeks item bertaut + bersihkan duplikat cbId (yang sudah terbit tidak dihapus).
            AUDIT Tahap 4: salinan non-terbit yang diproses LEBIH DULU daripada salinan yang terbit dulu tertinggal di antrean (penanda 'drop' ditulis ke entri lama yang
            sudah diganti). Kini salinan yang harus dibuang dicatat di daftar `drops` dan disaring pada putaran kedua. */
      var drops = [];
      PID.forEach(function(p){
        lists[p] = lists[p].filter(function(k){
          if(!k.cbId) return true;
          var e = idx[k.cbId];
          if(!e){ idx[k.cbId] = {p:p, k:k}; return true; }
          if(e.k.status !== 'upload' && k.status === 'upload'){ drops.push(e.k); idx[k.cbId] = {p:p, k:k}; return true; }
          if(k.status === 'upload') return true;
          changed[p] = 1; return false;
        });
      });
      if(drops.length) PID.forEach(function(p){ lists[p] = lists[p].filter(function(k){ if(drops.indexOf(k) >= 0){ changed[p] = 1; return false; } return true; }); });
      all = PID.map(function(p){ return lists[p]; });

      /* 1b) jadwal produksi/upload tidak boleh lebih awal dari DAY 1 posting (contentStart): item antre (BUKAN yang sudah terbit) yang
             terjadwal sebelumnya digeser ke tanggal valid pertama. Data & riwayat tetap; hanya tanggal antre yang dikoreksi (idempoten). */
      PID.forEach(function(p){ lists[p].forEach(function(k){
        if(!k.status || k.status === 'belum' || k.status === 'upload') return;
        if(k.productionKey && keyIso(k.productionKey) < MCFA_CORE.contentStart){
          k.productionKey = fk; k.productionDate = ddOf(fk); hist(k, k.status, k.status, 'Jadwal digeser ke DAY 1 posting ' + MCFA_CORE.contentStart); changed[p] = 1;
        }
        if(k.jadwal && String(k.jadwal) < MCFA_CORE.contentStart){ k.jadwal = MCFA_CORE.contentStart; changed[p] = 1; }
      }); });

      /* 2) judul Content Book → satu item per ID */
      D.titles.forEach(function(t){
        var pid = api.pidOf(t.acc); if(!pid) return;
        var title = t.name || 'Tanpa judul', want = !!t.ready && !t.arc, e = idx[t.id], k;
        if(!e){
          if(!want) return;
          k = {id: nextId(all), title: title, done:false, doneDate:'', addedDate: ddOf(fk), status:'siap', productionKey: fk, productionDate: ddOf(fk), uploadKey:'', jenis:'', jadwal:'', cbId: t.id, cbAcc: t.acc, src:'cb', hist:[]};
          hist(k, '', 'siap', 'Siap Upload dari Content Book');
          lists[pid].unshift(k); all = PID.map(function(p){ return lists[p]; }); idx[t.id] = {p:pid, k:k}; changed[pid] = 1; return;
        }
        k = e.k;
        if(k.title !== title){ k.title = title; changed[e.p] = 1; }                     /* judul berubah → ikut berubah */
        if(k.status === 'upload'){ return; }                                             /* sudah terbit: hanya judul yang disinkronkan */
        if(e.p !== pid){                                                                  /* akun berubah → pindah, bukan ganda */
          lists[e.p] = lists[e.p].filter(function(x){ return x !== k; }); lists[pid].unshift(k); changed[e.p] = 1; changed[pid] = 1; e.p = pid; k.cbAcc = t.acc;
        }
        if(want){
          if(k.status === 'belum' || !k.status || !k.productionKey || keyIso(k.productionKey) < MCFA_CORE.contentStart){
            var from = k.status || 'belum'; k.status = 'siap'; k.productionKey = fk; k.productionDate = ddOf(fk); k.jadwal = ''; hist(k, from, 'siap', 'Siap Upload dari Content Book'); changed[e.p] = 1;
          }
        } else if(k.status !== 'belum'){
          hist(k, k.status, 'belum', 'Siap Upload dibatalkan di Content Book'); k.status = 'belum'; k.productionKey = ''; k.productionDate = ''; k.jadwal = ''; changed[e.p] = 1;
        }
      });

      /* 3) item bertaut yang judulnya sudah dihapus di Content Book: yang belum terbit dilepas dari antrean; yang terbit TETAP */
      Object.keys(idx).forEach(function(id){
        if(live[id]) return; var e = idx[id], k = e.k;
        if(k.status !== 'upload'){ lists[e.p] = lists[e.p].filter(function(x){ return x !== k; }); changed[e.p] = 1; }
      });

      /* 4) simpan sebagai SATU TRANSAKSI (Tahap 5). Satu tulis per akun yang berubah, tiap tulis dibaca-ulang & diverifikasi.
            Urutan: akun yang MENAMBAH item lebih dulu, akun yang mengurangi terakhir (pindah akun tidak pernah menghilangkan item di tengah jalan).
            Bila SATU saja gagal → akun yang sudah tertulis dikembalikan ke salinan mentah semula (tidak ada data setengah tersimpan),
            pesan gagal tampil, dan tidak ada status sukses yang diklaim. */
      var order = Object.keys(changed).sort(function(a, b){ return (lists[b].length - before[b]) - (lists[a].length - before[a]); });
      var failed = false, any = order.length > 0, written = [], stuck = [];
      for(var oi = 0; oi < order.length; oi++){
        var p0 = order[oi], okW = false;
        try{ okW = _saveKonten(p0, lists[p0]) && localStorage.getItem(_kontenKey(p0)) === JSON.stringify(lists[p0]); }catch(e){ okW = false; }
        if(!okW){ failed = true; if(raw0[p0] !== undefined) written.push(p0); break; }   /* akun yang gagal ikut dipulihkan (mungkin tertulis sebagian) */
        written.push(p0);
      }
      if(failed){
        written.forEach(function(p1){
          try{
            if(localStorage.getItem(_kontenKey(p1)) === raw0[p1]) return;                 /* tidak pernah berubah (penulisan ditolak) → tidak perlu dipulihkan */
            if(raw0[p1] === null) localStorage.removeItem(_kontenKey(p1)); else localStorage.setItem(_kontenKey(p1), raw0[p1]);
          }catch(e){ stuck.push(p1); }
        });
        try{ document.dispatchEvent(new Event('mcfa:data')); }catch(e){}                 /* tampilan membaca ulang kondisi yang sebenarnya tersimpan */
        if(stuck.length){ try{ console.warn('[CB-SYNC] pemulihan gagal untuk', stuck.join(',')); }catch(e){} }
      }
      pubIdx = {}; PID.forEach(function(p){ _getKonten(p).forEach(function(k){ if(k.cbId && k.status === 'upload') pubIdx[k.cbId] = 1; }); });   /* dari penyimpanan nyata, bukan salinan memori */
      if(failed){
        if(!failToasted && typeof _kontenToast === 'function'){ failToasted = true; _kontenToast(stuck.length ? 'Sinkron gagal & pemulihan tidak penuh. Buka Content Book lalu coba lagi.' : 'Sinkron ke Produksi Konten gagal disimpan. Tidak ada perubahan yang diterapkan. Coba lagi.'); }
      } else failToasted = false;
      if(any) refreshViews(Object.keys(changed));
    }catch(err){ try{ console.warn('[CB-SYNC]', err); }catch(e){} }
    busy = false;
    try{ var _cb = CB(); if(_cb && _cb.refreshStatus) _cb.refreshStatus(); }catch(e){}
    if(again){ again = false; schedule(); }
  }

  /* Status & riwayat satu naskah (hanya MEMBACA item produksi bertaut cbId; tidak menyimpan data baru) */
  var STL = {belum:'Draf', produksi:'Dalam Produksi', editing:'Editing', siap:'Siap Upload', terjadwal:'Terjadwal', upload:'TERBIT'};
  function esc(x){ return String(x == null ? '' : x).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function fmtD(iso){ try{ return iso ? formatDateUpper(iso) : ''; }catch(e){ return String(iso || ''); } }
  function findItem(cbId){
    var api = CB(); if(!api || typeof _getKonten !== 'function') return null;
    for(var i = 0; i < api.pid.length; i++){ var l = _getKonten(api.pid[i]); for(var j = 0; j < l.length; j++) if(l[j].cbId === cbId) return {pid:api.pid[i], k:l[j]}; }
    return null;
  }
  function statusHtml(t, accounts){
    var f = findItem(t.id), st, extra = '', nm = function(pid){ var a = (accounts || []).filter(function(x){ return x.id === CB().accOf(pid); })[0]; return a ? a.name : pid.toUpperCase(); };
    if(f && f.k.status === 'upload') { st = 'TERBIT'; extra = ' · ' + esc(String(f.k.doneDate || '')) + ' · akun ' + esc(nm(f.pid)); }
    else if(t.arc) st = 'ARSIP';
    else if(t.ready){ st = f ? (STL[f.k.status] || 'Siap Upload') : 'Siap Upload'; if(f && f.k.productionDate) extra = ' · antre sejak ' + esc(f.k.productionDate); }
    else st = 'DRAF';
    var h = (f && Array.isArray(f.k.hist)) ? f.k.hist : [];
    var rows = h.slice(-8).reverse().map(function(e){ return '<div class="kh">' + esc(fmtD(e.d) || (e.t || '').slice(0, 10)) + ' · ' + esc(e.n || ((e.from || '—') + ' → ' + (e.to || '—'))) + '</div>'; }).join('');
    return 'Status: <b>' + esc(st) + '</b>' + extra + (h.length ? '<details><summary>Riwayat (' + h.length + ')</summary>' + rows + '</details>' : '<div class="kh">Belum ada riwayat produksi</div>');
  }

  function refreshViews(pids){
    try{
      var y = window.pageYOffset;
      if(typeof renderProduksiBlocks === 'function') renderProduksiBlocks();
      if(typeof _prodCountsSync === 'function') _prodCountsSync();
      pids.forEach(function(p){ if(document.getElementById('konten-list-' + p) && typeof _renderKonten === 'function') _renderKonten(p); });
      if(typeof _renderPostingGlobal === 'function') _renderPostingGlobal();
      window.scrollTo(0, y);
    }catch(e){}
  }
  function schedule(){ clearTimeout(timer); timer = setTimeout(sync, 60); }

  window.MCFA_CB_SYNC = {
    run: sync, schedule: schedule, statusHtml: statusHtml,
    pub: function(cbId){ return !!pubIdx[cbId]; },
    selfCheck: function(){ var o = []; try{ var api = CB(), n = 0; api.pid.forEach(function(p){ _getKonten(p).forEach(function(k){ if(k.cbId) n++; }); }); o.push(['item bertaut', n]); }catch(e){ o.push(['error', e.message]); } return o; }
  };
  document.addEventListener('mcfa:cb', schedule);
  document.addEventListener('mcfa:data', function(){ if(!busy) schedule(); });
  window.addEventListener('storage', function(e){ if(e.key === null || /^mcfa_konten_/.test(e.key || '')) schedule(); });
  document.addEventListener('visibilitychange', function(){ if(!document.hidden) schedule(); });
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule); else setTimeout(sync, 0);
})();
