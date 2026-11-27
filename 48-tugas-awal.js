/* ═══════════════════════════════════════════════════════════════════════════
   TUGAS AWAL MC FATHUL ADZIM — program awal SATU KALI (21–26 NOV 2026 = EVALUASI pembuatan project · 27–29 NOV 2026 = EKSEKUSI · 30 NOV 2026 = HARI PENGULANGAN · usia 22 tahun)
   Berdiri sendiri: BUKAN bagian Kegiatan Sehari-hari (tidak ikut 58 tugas/hari, tidak ikut progres 1.086 hari).
   • 163 pekerjaan, ID permanen (mis. s5.2.a03, s8.2.okk.b02). Judul bagian/subkategori BUKAN pekerjaan.
   • Penyimpanan khusus: 'mcfa_task_awal_day1_v1' = {v:1, upd:ISO, items:{<id>:<ISO waktu selesai>}} (hanya yang selesai).
     Tidak cocok dengan pola PURGE Tugas Awal lama (mcfa_tugasAwal_*). Ikut backup JSON, impor, dan cloud (pola "semua kunci kecuali sistem").
   • Satu mekanisme klik: SATU listener 'click' terdelegasi pada akar kartu (didaftarkan sekali). Tidak ada handler touch/pointer.
   • TIDAK membangun ulang daftar saat centang: hanya item yang berubah + angka progres terkait yang diperbarui. Scroll/fokus tidak disentuh.
   • Tulis → verifikasi baca-ulang → baru ubah tampilan. Gagal simpan = tampilan tetap seperti semula + pesan.
   • Baca-ulang sebelum tulis (aturan lintas-tab) + sinkron lewat event 'storage'. Idempoten, tanpa localStorage.clear().
   • 30 NOV 2026 (DAY 10, hari terakhir Tugas Awal + hari pertama upload konten): blok khusus di bawah daftar asli = PENGULANGAN seluruh 163 tugas
     (ID 'r30.<idAsli>', nama/urutan/pengelompokan sama persis) + bagian UPLOAD KONTEN DI SETIAP BRANDING (1 checklist 'u30.<akun>' per akun di AKUN).
     Penyimpanan TERSENDIRI: 'mcfa_task_awal_day30_v1' (bentuk sama). Tidak menyentuh 'mcfa_task_awal_day1_v1', Content Book, Produksi Konten, maupun Konten Terbit.
   ═══════════════════════════════════════════════════════════════════════════ */
(function(){
  'use strict';
  if (window.MCFA_TUGAS_AWAL) return;                       /* idempoten: tidak didaftarkan dua kali */

  var KEY = 'mcfa_task_awal_day1_v1', SCHEMA = 1, UNKNOWN_TIME = '-';   /* nilai item = waktu selesai (ISO); '-' = selesai, waktu tak diketahui */
  var EXPECT = {s1:3, s2:2, s3:3, s4:2, s5:36, s6:4, s7:3, s8:110, 's8.1':8, 's8.2':102};   /* validasi jumlah resmi */
  var EXPECT_TOTAL = 163;
  var KEY30 = 'mcfa_task_awal_day30_v1', P30 = 'r30.', U30 = 'u30.';   /* penyimpanan khusus 30 NOV; awalan ID pengulangan & upload */

  /* ── DATA: urutan, nama, kategori, subkategori dipertahankan persis ── */
  function pad(n){ return (n < 10 ? '0' : '') + n; }
  function G(letter, label, names){ return {letter:letter, label:label, names:names}; }
  var C3 = ['Buat konten pertama', 'Buat konten kedua', 'Buat konten ketiga'];
  var IDENT = ['Buat Gmail baru', 'Buat sandi baru', 'Buat pengamanan akun baru', 'Buat akun Facebook', 'Buat akun TikTok', 'Buat akun Instagram', 'Samakan foto profil dan bio'];
  var ACC = [
    ['barongsukma', 'BARONGSUKMA', ['Buat konten Program gagal', 'Buat konten Program baru', 'Buat konten foto badan (Day 1)', 'Buat konten Running (Day 1)', 'Running Day (2)']],
    ['okk', 'OTAK KEPALA KARDUS', C3], ['zona', 'ZONA ASUMSI', C3], ['alley', 'ALLEY CREATIVE KIDS', C3], ['lol', 'LOL MONKEY SHOP', C3],
    ['monkipedia', 'MONKIPEDIA', C3], ['ayla', 'DUNIA AYLA', C3], ['kpc', 'KP CIHUY', C3], ['cne', 'CNE PICTURE', C3], ['fathulmeme', 'FATHUL AL MEME', C3]
  ];
  var TREE = [
    {id:'s1', no:'1', title:'MEMULAI HARI', focus:'Persiapan awal aktivitas.', ico:'sunrise',
      groups:[G('a', null, ['Makan', 'Buat M.C.F.A Project', 'Buat jadwal olahraga baru'])]},
    {id:'s2', no:'2', title:'PEMBERSIHAN RUMAH', focus:'Pekerjaan rumah dan persiapan perayaan.', ico:'broom',
      groups:[G('a', null, ['Perbagus kamar Ayla (pasang terpal)', 'Merayakan ulang tahun (bacakan)'])]},
    {id:'s3', no:'3', title:'BERESKAN KAMAR SENDIRI', focus:'Kebersihan dan kerapian kamar pribadi.', ico:'home',
      groups:[G('a', null, ['Cuci dan pasang seprai', 'Bersihkan kamar sendiri', 'Pel dan beri pewangi kamar'])]},
    {id:'s4', no:'4', title:'PEMANASAN WORKOUT', focus:'Memulai aktivitas workout.', ico:'dumbbell',
      groups:[G('a', null, ['Pemanasan Workout Pertama (1)', {n:'Pemanasan Running Pertama (1)', k:'s1.a04'}])]},   /* tugas dipindah dari Bagian 1: {n:nama, k:ID asli} — ID s1.a04 DIPERTAHANKAN agar status centang tersimpan (lama maupun r30.) tetap menempel; ANC/progres mengikuti bagian barunya */
    {id:'s6', no:'5', title:'PEMBARUAN DIRI', ico:'heart', children:[
      {id:'s6.1', no:'5.1', title:'PERAWATAN DIRI', groups:[G('a', null, ['Cukur rambut', 'Mandi wajib'])]},
      {id:'s6.2', no:'5.2', title:'PEMBARUAN SPIRITUAL', groups:[G('a', null, ['Sholat tobat', 'Dzikir'])]}
    ]},
    {id:'s7', no:'6', title:'PEDOMAN KEHIDUPAN', ico:'book',
      groups:[G('a', null, ['Buat print A6 Kehidupan MC Fathul Adzim', 'Buat mata pelajaran', 'Makan'])]},
    {id:'s5', no:'7', title:'PEMBERSIHAN STUDIO', focus:'Perbaikan, penataan, kebersihan, dan perlengkapan studio.', ico:'tools', children:[
      {id:'s5.1', no:'7.1', title:'PEKERJAAN UTAMA RUMAH', groups:[G('a', null, ['Perbaiki atap rumah'])]},
      {id:'s5.2', no:'7.2', title:'KAMAR MANDI', groups:[
        G('a', 'Penataan dan perlengkapan', ['Bereskan kamar mandi', 'Tambahkan gayung kuning', 'Tambahkan kayu ambalan', 'Tambahkan tanaman']),
        G('b', 'Pembersihan akhir', ['Bersihkan kamar mandi', 'Beri parfum kamar mandi'])]},
      {id:'s5.3', no:'7.3', title:'DAPUR', groups:[
        G('a', 'Penataan dan perlengkapan', ['Bersihkan dapur', 'Pasang lantai vinyl', 'Tambahkan kayu tempat bumbu', 'Ganti tempat sendok', 'Tambahkan kayu ambalan', 'Tambahkan tanaman'])]},
      {id:'s5.4', no:'7.4', title:'TEMPAT EDITING', groups:[
        G('a', 'Penataan dan perlengkapan', ['Bereskan tempat editing', 'Tambahkan dekorasi dan perlengkapan', 'Cat bagian atas plafon']),
        G('b', 'Pembersihan akhir', ['Bersihkan dapur dan tempat editing', 'Pel dan beri pewangi dapur dan tempat editing'])]},
      {id:'s5.5', no:'7.5', title:'RUANGAN TENGAH', groups:[
        G('a', 'Penataan dan perlengkapan', ['Bereskan ruangan tengah', 'Cuci dan pasang seprai', 'Tambahkan kayu dekorasi', 'Ubah bingkai jadi tanggal 21']),
        G('b', 'Pembersihan akhir', ['Bersihkan ruangan tengah', 'Pel dan beri pewangi ruangan tengah'])]},
      {id:'s5.6', no:'7.6', title:'KAMAR', groups:[G('a', null, ['Bersihkan kamar', 'Pel dan beri pewangi kamar'])]},
      {id:'s5.7', no:'7.7', title:'AREA OLAHRAGA', groups:[G('a', null, ['Bereskan alat workout', 'Tambahkan matras hitam', 'Cat tembok abu-abu'])]},
      {id:'s5.8', no:'7.8', title:'SOFA DAN DEKORASI', groups:[G('a', null, ['Bereskan sofa', 'Tambahkan tanaman', 'Pel dan beri pewangi'])]},
      {id:'s5.9', no:'7.9', title:'PEMBUATAN ALAT TAMBAHAN', groups:[G('a', null, ['Buat alat tambahan', 'Buat pull-up', 'Buat samsak', 'Buat pemberat'])]}
    ]},
    {id:'s8', no:'8', title:'PERSIAPAN IDENTITAS DAN BRANDING', ico:'user', children:[
      {id:'s8.1', no:'8.1', title:'IDENTITAS UTAMA — MC FATHUL ADZIM', groups:[
        G('a', 'A. Pembuatan identitas digital', ['Buat Gmail MC Fathul Adzim', 'Buat sandi baru', 'Buat pengamanan baru']),
        G('b', 'B. Pembuatan akun media sosial', ['Buat akun Facebook', 'Buat akun TikTok', 'Buat akun Instagram']),
        G('c', 'C. Penyelarasan identitas', ['Samakan foto profil dan bio']),
        G('d', 'D. Konten studio', ['Buat konten M.C.F.A STUDIO'])]},
      {id:'s8.2', no:'8.2', title:'SEPULUH AKUN BRANDING', focus:'Setiap akun punya daftar pekerjaan sendiri.', children:
        ACC.map(function(a, i){
          return {id:'s8.2.' + a[0], no:pad(i + 1), title:a[1], groups:[G('a', 'A. Identitas dan akun', IDENT), G('b', 'Konten awal', a[2])]};
        })}
    ]}
  ];

  /* ── 30 NOV: salinan penuh TREE (objek baru; ID berawalan r30.) — nama, urutan, kategori, subkategori, grup identik dengan daftar asli ── */
  function cloneTree(nodes, pfx){
    return nodes.map(function(n){
      var c = {id:pfx + n.id, no:n.no, title:n.title, focus:n.focus, ico:n.ico};
      if (n.groups) c.groups = n.groups.map(function(g){ return G(g.letter, g.label, g.names); });
      if (n.children) c.children = cloneTree(n.children, pfx);
      return c;
    });
  }
  var TREE30 = cloneTree(TREE, P30);

  /* ── UPLOAD KONTEN DI SETIAP BRANDING: satu checklist per akun yang terdaftar di M.C.F.A STUDIO (satu sumber: AKUN; tidak ada akun baru) ── */
  var UP_FALLBACK = ['mcfa', 'fathulmeme', 'barongsukma', 'okk', 'zona', 'alley', 'ayla', 'lol', 'monkipedia', 'kpc', 'cne'];
  var EXPECT_UP = 11;                                   /* 10 branding + akun utama MC FATHUL ADZIM */
  var UPLOAD = (function(){
    var ids = []; try{ if (typeof AKUN !== 'undefined' && AKUN) ids = Object.keys(AKUN); }catch(e){}
    if (!ids.length) ids = UP_FALLBACK.slice();
    return ids.map(function(a, i){
      var nm = a.toUpperCase(), bd = ''; try{ if (AKUN[a] && AKUN[a].name) nm = String(AKUN[a].name); if (AKUN[a] && AKUN[a].badge) bd = String(AKUN[a].badge); }catch(e){}
      return {acc:a, id:U30 + a, gid:'ug.' + a, no:pad(i + 1), name:nm, badge:bd, label:'Upload konten di ' + nm};
    });
  })();

  /* ── indeks turunan (dibangun sekali): item, ancestor, total ── */
  var ITEMS = [], ORDER = [], ORDER30 = [], ANC = {}, TOTAL = {}, NAME = {}, DONE = {}, S = {items:{}}, S30 = {items:{}}, SET1 = {}, SET30 = {}, SETUP = {};
  function indexTree(nodes, trail, extra, order, set){
    nodes.forEach(function(n){
      var t = trail.concat(n.id);
      (n.groups || []).forEach(function(g){
        var gid = n.id + '.' + g.letter, keys = t.concat(g.label ? [gid] : []);
        g.id = gid;
        g.items = g.names.map(function(nm, i){
          var fixed = (nm && typeof nm === 'object'), label = fixed ? nm.n : nm,
              id = fixed ? (gid.indexOf(P30) === 0 ? P30 : '') + nm.k : gid + pad(i + 1), it = {id:id, name:label}, all = keys.concat(extra);
          ITEMS.push(it); order.push(id); set[id] = 1; NAME[id] = label; ANC[id] = all;
          all.forEach(function(k){ TOTAL[k] = (TOTAL[k] || 0) + 1; });
          return it;
        });
      });
      if (n.children) indexTree(n.children, t, extra, order, set);
    });
  }
  indexTree(TREE, [], ['all'], ORDER, SET1);
  indexTree(TREE30, [], ['rep30', 'all30'], ORDER30, SET30);
  UPLOAD.forEach(function(u){
    var all = [u.gid, 'up30', 'all30'];
    NAME[u.id] = u.label; ANC[u.id] = all; ORDER30.push(u.id); SET30[u.id] = 1; SETUP[u.id] = 1;
    all.forEach(function(k){ TOTAL[k] = (TOTAL[k] || 0) + 1; });
  });
  Object.keys(TOTAL).forEach(function(k){ DONE[k] = 0; });
  function keyOf(id){ return SET30[id] ? KEY30 : KEY; }

  /* ── penyimpanan ── (dua kunci terpisah: asli = KEY, 30 NOV = KEY30; bentuk sama) */
  function rd(k){ try{ return localStorage.getItem(k || KEY); }catch(e){ return null; } }
  function parse(raw){ try{ var o = JSON.parse(raw); return (o && typeof o === 'object' && !Array.isArray(o) && o.items && typeof o.items === 'object' && !Array.isArray(o.items)) ? o : null; }catch(e){ return null; } }
  function quarantineRaw(raw, why, key){          /* salinan data rusak ke karantina bersama sebelum ditimpa (aslinya tetap dicoba dipertahankan) */
    try{
      var qk = 'mcfa_quarantine_v1', cur = JSON.parse(localStorage.getItem(qk) || '[]'); if (!Array.isArray(cur)) cur = [];
      if (cur.some(function(x){ return x && x.k === key && x.raw === raw; })) return true;
      cur.push({k:key, why:why, at:new Date().toISOString(), raw:raw}); localStorage.setItem(qk, JSON.stringify(cur)); return true;
    }catch(e){ return false; }
  }
  function load(key, set){                     /* → {items:{id:iso}, upd} dari penyimpanan; tidak pernah melempar galat */
    var raw = rd(key); if (raw === null) return {items:{}};
    var o = parse(raw); if (!o) return {items:{}, corrupt:raw};
    var out = {}; Object.keys(o.items).forEach(function(id){ if (set[id] && o.items[id]) out[id] = o.items[id]; });
    /* ID yang tidak dikenal (versi lebih baru) dipertahankan saat menulis — lihat writeItem */
    return {items:out, upd:(typeof o.upd === 'string' ? o.upd : '')};
  }
  var lastWrite = '';
  /* tulis satu item ke kunci miliknya: baca-ulang → ubah → simpan → verifikasi. Mengembalikan true hanya bila terbukti tersimpan. */
  function writeItem(id, want){
    var key = keyOf(id), raw = rd(key), o = raw === null ? {v:SCHEMA, items:{}} : parse(raw);
    if (!o){ if (!quarantineRaw(raw, 'Tugas Awal: JSON/bentuk tidak valid sebelum ditimpa', key)) return false; o = {v:SCHEMA, items:{}}; }
    var now = new Date().toISOString();
    if (want) o.items[id] = now; else delete o.items[id];
    o.v = SCHEMA; o.upd = now;
    try{ localStorage.setItem(key, JSON.stringify(o)); }catch(e){ return false; }
    var back = parse(rd(key)); if (!!back && (!!back.items[id] === !!want)){ lastWrite = now; return true; } return false;
  }

  /* ── tampilan ── */
  var root = null, cntEls = {}, itemEls = {};
  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function ico(n){ return '<svg class="mi" aria-hidden="true"><use href="#mi-' + n + '"/></svg>'; }
  var CHECK = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.2 8.4l3 3 6.6-6.8"/></svg>';
  function cnt(key, cls){ return '<span class="ta-cnt ' + (cls || '') + '" data-cnt="' + key + '">0/' + TOTAL[key] + '</span>'; }
  function bar(key){ return '<span class="ta-bar" aria-hidden="true"><i data-bar="' + key + '"></i></span>'; }
  function itemHtml(it){
    if (SETUP[it.id])                            /* checklist upload 30 NOV: nama + baris waktu selesai (tinggi tetap, tidak bergeser saat dicentang) */
      return '<button type="button" class="ta-item ta-up" role="checkbox" aria-checked="false" data-id="' + it.id + '"><span class="ta-cb">' + CHECK + '</span><span class="ta-lb"><span class="ta-nm">' + esc(it.name) + '</span><span class="ta-tm" data-tm="' + it.id + '"></span></span></button>';
    return '<button type="button" class="ta-item" role="checkbox" aria-checked="false" data-id="' + it.id + '"><span class="ta-cb">' + CHECK + '</span><span class="ta-lb">' + esc(it.name) + '</span></button>';
  }
  function groupHtml(g){
    var h = '<div class="ta-grp" data-node="' + g.id + '">';
    if (g.label) h += '<div class="ta-gl"><span>' + esc(g.label) + '</span>' + cnt(g.id, 'ta-gc') + '</div>';
    return h + '<div class="ta-items">' + g.items.map(itemHtml).join('') + '</div></div>';
  }
  function nodeHtml(n, level){
    var cls = level === 1 ? 'ta-sec' : 'ta-sub' + (level > 2 ? ' ta-sub3' : '');
    var h = '<section class="' + cls + '" data-node="' + n.id + '">' +
      '<button type="button" class="ta-sh" aria-expanded="false" data-ta="node" data-node="' + n.id + '">' +
        '<span class="ta-no">' + (level === 1 && n.ico ? ico(n.ico) + '<b>' + esc(n.no) + '</b>' : esc(n.no)) + '</span>' +
        '<span class="ta-st"><b>' + (level === 1 ? 'BAGIAN ' + esc(n.no) + ' — ' : '') + esc(n.title) + '</b>' + (n.focus ? '<small>' + esc(n.focus) + '</small>' : '') + '</span>' +
        cnt(n.id) + '<span class="ta-chev" aria-hidden="true"></span>' +
      '</button>' +
      '<div class="ta-sb" hidden>' + bar(n.id);
    if (n.groups) h += n.groups.map(groupHtml).join('');
    if (n.children) h += '<div class="ta-subs">' + n.children.map(function(c){ return nodeHtml(c, level + 1); }).join('') + '</div>';
    return h + '</div></section>';
  }
  function uploadHtml(){
    return '<section class="ta-sec ta-upsec" data-node="up30">' +
      '<button type="button" class="ta-sh" aria-expanded="false" data-ta="node" data-node="up30">' +
        '<span class="ta-no">' + ico('upload') + '<b>9</b></span>' +
        '<span class="ta-st"><b>BAGIAN 9 — UPLOAD KONTEN DI SETIAP BRANDING</b><small>Satu checklist untuk setiap akun M.C.F.A STUDIO (' + UPLOAD.length + ' akun).</small></span>' +
        cnt('up30') + '<span class="ta-chev" aria-hidden="true"></span>' +
      '</button>' +
      '<div class="ta-sb" hidden>' + bar('up30') +
        '<p class="ta-note" data-ta-upnote></p>' +
        UPLOAD.map(function(u){
          return '<div class="ta-grp ta-ug" data-node="' + u.gid + '" data-acc="' + esc(u.acc) + '">' +
            '<div class="ta-gl"><span>' + u.no + ' · ' + esc(u.name) + (u.badge ? ' · ' + esc(u.badge) : '') + '</span>' + cnt(u.gid, 'ta-gc') + '</div>' +
            '<div class="ta-items">' + itemHtml({id:u.id, name:u.label}) + '</div></div>';
        }).join('') +
      '</div></section>';
  }
  function d30Html(){
    var dt = String(formatDateUpper(MCFA_CORE.tugasAwalEnd)).replace(/ /g, '\u00A0');
    return '<section class="ta-sec ta-d30" data-node="all30">' +
      '<button type="button" class="ta-sh" aria-expanded="false" data-ta="node" data-node="all30">' +
        '<span class="ta-no">' + ico('flag') + '<b>10</b></span>' +
        '<span class="ta-st"><b>' + dt + ' — HARI PENGULANGAN</b><small>Hari ke-10 · seluruh tugas dari awal sampai akhir diulang, lalu upload konten di setiap branding.</small></span>' +
        cnt('all30') + '<span class="ta-chev" aria-hidden="true"></span>' +
      '</button>' +
      '<div class="ta-sb" hidden>' + bar('all30') +
        '<p class="ta-note ta-d30note">Status di bagian ini tersimpan sendiri dan tidak mengubah daftar tugas 27–29 NOVEMBER di atas. Centang upload hanya mencatat pelaksanaan tugas; status konten terbit tetap mengikuti Konten Terbit.</p>' +
        '<p class="ta-hist" data-ta-hist></p>' +
        '<div class="ta-d30h"><span>A. PENGULANGAN SELURUH TUGAS</span>' + cnt('rep30', 'ta-gc') + '</div>' +
        '<div class="ta-subs ta-reps">' + TREE30.map(function(n){ return nodeHtml(n, 1); }).join('') + '</div>' +
        '<div class="ta-d30h"><span>B. UPLOAD KONTEN DI SETIAP BRANDING</span>' + cnt('up30', 'ta-gc') + '</div>' +
        uploadHtml() +
      '</div></section>';
  }
  function build(){
    var p = MCFA_CORE.tugasAwalExecStart, e = MCFA_CORE.tugasAwalExecEnd || p, dayS = MCFA_DERIVED.projectDayOf(mcfaParse(p)), dayE = MCFA_DERIVED.projectDayOf(mcfaParse(e)),
        nb = function(t){ return String(t).replace(/ /g, '\u00A0'); }, d = nb(formatDateUpper(p)) + (e !== p ? ' – ' + nb(formatDateUpper(e)) : ''), day = dayS + (dayE !== dayS ? '–' + dayE : ''), age = mcfaAgeOn(mcfaParse(MCFA_CORE.projectStart)),   /* periode kartu = EKSEKUSI (tugasAwalExecStart – tugasAwalExecEnd, dari MCFA_CORE); usia tetap usia pada DAY 1 proyek (projectStart) */
        ev = formatDateUpper(MCFA_CORE.projectStart).replace(/ 2026$/, '') + ' – ' + formatDateUpper(MCFA_CORE.tugasAwalEvalEnd),
        phase = nb(ev) + ' = EVALUASI PEMBUATAN PROJECT · ' + nb(d) + ' = EKSEKUSI';
    root.innerHTML =
      '<button type="button" class="ta-head" aria-expanded="false" aria-controls="ta-body" data-ta="card">' +
        '<span class="ta-ico">' + ico('flag') + '</span>' +
        '<span class="ta-htxt"><span class="ta-mono">PROGRAM AWAL · SATU KALI</span>' +
          '<span class="ta-title">TUGAS AWAL MC FATHUL ADZIM</span>' +
          '<span class="ta-meta"><span class="ta-chip">' + esc(d) + '</span><span class="ta-chip">DAY ' + day + '</span><span class="ta-chip">' + age + ' TAHUN</span></span><span class="ta-phase">' + esc(phase) + '</span></span>' +
        '<span class="ta-arrow" aria-hidden="true">▾</span>' +
      '</button>' +
      '<div class="ta-prog"><div class="ta-ptrack" role="progressbar" aria-label="Progres Tugas Awal" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i data-bar="all"></i></div>' +
        '<div class="ta-ptxt"><span><b data-ta-done>0</b> selesai · <b data-ta-left>' + EXPECT_TOTAL + '</b> belum</span><span data-ta-pct>0%</span></div></div>' +
      '<div class="ta-body" id="ta-body" hidden><div class="ta-bin">' + TREE.map(function(n){ return nodeHtml(n, 1); }).join('') + d30Html() + '</div></div>';
    root.setAttribute('data-ta-built', '1');
    root.querySelectorAll('[data-cnt]').forEach(function(el){ (cntEls[el.getAttribute('data-cnt')] = cntEls[el.getAttribute('data-cnt')] || []).push(el); });
    root.querySelectorAll('.ta-item').forEach(function(el){ itemEls[el.getAttribute('data-id')] = el; });
  }

  /* ── pembaruan terarah (tanpa render ulang) ── */
  var barEls = {};
  function barOf(key){ return barEls[key] || (barEls[key] = Array.prototype.slice.call(root.querySelectorAll('[data-bar="' + key + '"]'))); }
  function paintKey(key){
    var d = DONE[key], t = TOTAL[key], txt = d + '/' + t;
    (cntEls[key] || []).forEach(function(el){ if (el.textContent !== txt) el.textContent = txt; });
    var r = t ? d / t : 0;
    barOf(key).forEach(function(el){ el.style.transform = 'scaleX(' + r + ')'; });
    var holder = root.querySelector('[data-node="' + key + '"]'); if (holder) holder.classList.toggle('is-done', t > 0 && d === t);
  }
  function paintOverall(){
    var d = DONE.all, t = TOTAL.all, pct = t ? d / t * 100 : 0;
    var set = function(sel, v){ var e = root.querySelector(sel); if (e && e.textContent !== v) e.textContent = v; };
    set('[data-ta-done]', String(d)); set('[data-ta-left]', String(t - d));
    set('[data-ta-pct]', pct.toLocaleString('id-ID', {maximumFractionDigits:1}) + '%');
    var pt = root.querySelector('.ta-ptrack'); if (pt) pt.setAttribute('aria-valuenow', String(Math.round(pct)));
    root.classList.toggle('is-done', t > 0 && d === t);
  }
  function setDom(id, on){                       /* ubah satu item di layar; hasil: apakah memang berubah */
    var el = itemEls[id]; if (!el) return false;
    var was = el.getAttribute('aria-checked') === 'true'; if (was === on) return false;
    el.setAttribute('aria-checked', on ? 'true' : 'false');
    ANC[id].forEach(function(k){ DONE[k] += on ? 1 : -1; });
    return true;
  }
  function uploadLocked(){ try{ return mcfaTodayIso() < MCFA_CORE.contentStart; }catch(e){ return false; } }   /* upload resmi baru dimulai contentStart (30 NOV 2026) */
  function paintTm(id){
    if (!SETUP[id]) return;
    var el = root.querySelector('[data-tm="' + id + '"]'); if (!el) return;
    var iso = (S30.items || {})[id], t = (iso && iso !== UNKNOWN_TIME) ? 'Dicentang ' + String(formatStampUpper(iso)) : (iso ? 'Dicentang · waktu tidak diketahui' : '');
    if (el.textContent !== t) el.textContent = t;
  }
  function paintHist(){
    var el = root.querySelector('[data-ta-hist]'); if (!el) return;
    var n = 0; ORDER30.forEach(function(id){ if ((S30.items || {})[id]) n++; });
    var t = n ? 'Riwayat 30 NOV: ' + n + ' dari ' + ORDER30.length + ' tercentang' + (S30.upd ? ' · terakhir diperbarui ' + String(formatStampUpper(S30.upd)) : '') + '.' : 'Riwayat 30 NOV: belum ada yang dicentang.';
    if (el.textContent !== t) el.textContent = t;
  }
  function paintLock(){
    var lk = uploadLocked();
    UPLOAD.forEach(function(u){ var el = itemEls[u.id]; if (!el) return; el.classList.toggle('ta-locked', lk); if (lk) el.setAttribute('aria-disabled', 'true'); else el.removeAttribute('aria-disabled'); });
    var nt = root.querySelector('[data-ta-upnote]');
    if (nt){ var m = lk ? 'Upload terbuka mulai ' + String(formatDateUpper(MCFA_CORE.contentStart)) + ' (hari pertama upload konten). Sebelum itu checklist ini terkunci.' : 'Hari pertama upload konten. Centang hanya mencatat pelaksanaan tugas; status terbit mengikuti Konten Terbit.'; if (nt.textContent !== m) nt.textContent = m; }
  }
  function paintAfter(id){ ANC[id].forEach(paintKey); if (SET30[id]){ paintTm(id); paintHist(); } else paintOverall(); }
  function pop(id){
    var cb = itemEls[id] && itemEls[id].firstChild; if (!cb) return;
    cb.classList.remove('ta-pop'); void cb.offsetWidth; cb.classList.add('ta-pop');
    setTimeout(function(){ cb.classList.remove('ta-pop'); }, 260);
  }
  function notify(msg){ try{ if (typeof showNotif === 'function') showNotif(msg); }catch(e){} }

  /* sinkron penuh dari penyimpanan (awal, lintas-tab, setelah impor/pemulihan): hanya item yang berbeda yang disentuh */
  function sync(){
    if (!root || !root.getAttribute('data-ta-built')) return;
    var st = load(KEY, SET1), st30 = load(KEY30, SET30), ch = false; S = st; S30 = st30;
    ORDER.forEach(function(id){ if (setDom(id, !!st.items[id])) ch = true; });
    ORDER30.forEach(function(id){ if (setDom(id, !!st30.items[id])) ch = true; paintTm(id); });
    if (ch || !sync.done){ Object.keys(TOTAL).forEach(paintKey); paintOverall(); }
    paintHist(); paintLock();
    sync.done = true;
  }

  /* ── satu-satunya penangan klik (terdelegasi, didaftarkan sekali) ── */
  var busy = {};
  function onItem(btn){
    var id = btn.getAttribute('data-id'); if (!id || busy[id]) return;
    busy[id] = true;
    try{
      var want = btn.getAttribute('aria-checked') !== 'true';
      if (SETUP[id] && uploadLocked()){ paintLock(); notify('Upload konten baru dimulai ' + formatDateUpper(MCFA_CORE.contentStart) + '. Belum bisa dicentang.'); return; }
      if (!writeItem(id, want)){ notify('Gagal menyimpan Tugas Awal. Coba lagi.'); return; }   /* layar TIDAK diubah → status lama tetap */
      if (SET30[id]) S30 = load(KEY30, SET30);
      if (setDom(id, want)){ paintAfter(id); if (want){ pop(id); try{ if (navigator.vibrate) navigator.vibrate(8); }catch(e){} } }
    } finally { busy[id] = false; }
  }
  function toggleNode(btn){
    var open = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    var panel = btn.nextElementSibling; if (panel) panel.hidden = !open;
  }
  function onClick(e){
    var t = e.target.closest ? e.target.closest('[data-id].ta-item, [data-ta]') : null; if (!t || !root.contains(t)) return;
    if (t.classList.contains('ta-item')) { onItem(t); return; }
    var k = t.getAttribute('data-ta');
    if (k === 'card'){
      var open = t.getAttribute('aria-expanded') !== 'true';
      t.setAttribute('aria-expanded', open ? 'true' : 'false');
      var body = root.querySelector('#ta-body'); if (body) body.hidden = !open;
      root.classList.toggle('open', open);
    } else if (k === 'node') toggleNode(t);
  }

  /* ── validasi jumlah & ID ── */
  function selfCheck(){
    var bad = [], seen = {};
    ORDER.concat(ORDER30).forEach(function(id){ if (seen[id]) bad.push('ID ganda: ' + id); seen[id] = 1; });
    if (ORDER.length !== EXPECT_TOTAL) bad.push('total ' + ORDER.length + ' ≠ ' + EXPECT_TOTAL);
    Object.keys(EXPECT).forEach(function(k){ if (TOTAL[k] !== EXPECT[k]) bad.push('bagian ' + k + ': ' + TOTAL[k] + ' ≠ ' + EXPECT[k]); });
    /* 30 NOV: pengulangan = salinan persis daftar asli (jumlah per bagian sama), upload = tepat satu per akun terdaftar */
    if (TOTAL.rep30 !== EXPECT_TOTAL) bad.push('pengulangan 30 NOV ' + TOTAL.rep30 + ' ≠ ' + EXPECT_TOTAL);
    Object.keys(EXPECT).forEach(function(k){ if (TOTAL[P30 + k] !== EXPECT[k]) bad.push('pengulangan ' + k + ': ' + TOTAL[P30 + k] + ' ≠ ' + EXPECT[k]); });
    ORDER.forEach(function(id, i){ if (ORDER30[i] !== P30 + id) bad.push('urutan pengulangan berbeda di ' + id); });
    if (UPLOAD.length !== EXPECT_UP) bad.push('akun upload ' + UPLOAD.length + ' ≠ ' + EXPECT_UP);
    try{ if (typeof AKUN !== 'undefined'){ var ak = Object.keys(AKUN); if (ak.length !== UPLOAD.length) bad.push('akun upload ≠ AKUN'); ak.forEach(function(a){ if (!SETUP[U30 + a]) bad.push('akun tanpa checklist upload: ' + a); }); } }catch(e){}
    if (TOTAL.up30 !== UPLOAD.length) bad.push('total upload ' + TOTAL.up30 + ' ≠ ' + UPLOAD.length);
    if (TOTAL.all30 !== EXPECT_TOTAL + UPLOAD.length) bad.push('total 30 NOV ' + TOTAL.all30 + ' ≠ ' + (EXPECT_TOTAL + UPLOAD.length));
    if (root && root.getAttribute('data-ta-built')){
      var want = EXPECT_TOTAL + ORDER30.length, dom = root.querySelectorAll('.ta-item'); if (dom.length !== want) bad.push('elemen checkbox ' + dom.length + ' ≠ ' + want);
      var ids = {}; root.querySelectorAll('[id]').forEach(function(e){ if (ids[e.id]) bad.push('id elemen ganda: ' + e.id); ids[e.id] = 1; });
      var dd = {}; dom.forEach(function(e){ var d = e.getAttribute('data-id'); if (dd[d]) bad.push('data-id ganda: ' + d); dd[d] = 1; });
    }
    return bad;
  }

  /* ── langkah migrasi (aman, idempoten; sistem migrasi membuat salinan pengaman sebelum menulis & memvalidasi sesudahnya) ── */
  function fixShape(o){                          /* → objek baru bila perlu diperbaiki, selain itu null */
    var ch = false, out = {v:SCHEMA, upd:o.upd, items:{}};
    if (o.v !== SCHEMA) ch = true;
    Object.keys(o.items).forEach(function(id){
      var v = o.items[id]; if (v === false || v === null || v === undefined) { ch = true; return; }   /* hanya yang BENAR-BENAR tidak selesai dibuang */
      if (typeof v !== 'string'){ out.items[id] = UNKNOWN_TIME; ch = true; } else if (!v){ out.items[id] = UNKNOWN_TIME; ch = true; } else out.items[id] = v;   /* tetap SELESAI; hanya waktunya tak diketahui */
    });
    if (typeof out.upd !== 'string'){ out.upd = new Date().toISOString(); ch = true; }
    return ch ? out : null;
  }
  function regMig(mid, key){
    MCFA_MIGRATE.register({
      id:mid, touches:[new RegExp('^' + key + '$')],
      scan:function(){ var raw = rd(key); if (raw === null) return []; var o = parse(raw); return (o && fixShape(o)) ? [key] : []; },
      apply:function(){ var raw = rd(key), o = raw === null ? null : parse(raw), f = o && fixShape(o); if (!f) return {changed:0}; try{ localStorage.setItem(key, JSON.stringify(f)); return {changed:1}; }catch(e){ return {changed:0, note:'gagal menyimpan'}; } }
    });
  }
  try{
    if (window.MCFA_MIGRATE && typeof MCFA_MIGRATE.register === 'function'){ regMig('tugas-awal-day1-v1', KEY); regMig('tugas-awal-day30-v1', KEY30); }
  }catch(e){}

  function init(){
    root = document.getElementById('tugasAwalCard'); if (!root || root.getAttribute('data-ta-built')) return !!root;
    build();
    if (!root.__taBound){ root.addEventListener('click', onClick); root.__taBound = true; }
    sync();
    var bad = selfCheck();
    if (bad.length) console.warn('[TUGAS AWAL] validasi gagal:', bad); else console.info('[TUGAS AWAL] validasi OK: ' + ORDER.length + ' pekerjaan + 30 NOV: ' + ORDER30.length + ' (pengulangan ' + TOTAL.rep30 + ' + upload ' + TOTAL.up30 + ')');
    return true;
  }
  window.addEventListener('storage', function(e){ if (!e || e.key === null || e.key === KEY || e.key === KEY30) sync(); });
  document.addEventListener('mcfa:data', sync);
  document.addEventListener('visibilitychange', function(){ if (!document.hidden) sync(); });
  window.addEventListener('pageshow', sync);

  /* riwayat 30 NOV: setiap item tercentang + waktunya, urut waktu (hanya baca) */
  function history30(){
    var it = (load(KEY30, SET30).items || {});
    return ORDER30.filter(function(id){ return it[id]; }).map(function(id){ return {id:id, name:NAME[id], at:it[id], upload:!!SETUP[id]}; }).sort(function(a, b){ return a.at < b.at ? -1 : a.at > b.at ? 1 : 0; });
  }
  window.MCFA_TUGAS_AWAL = {KEY:KEY, KEY30:KEY30, total:EXPECT_TOTAL, total30:ORDER30.length, order:ORDER.slice(), order30:ORDER30.slice(), uploadAccounts:UPLOAD.map(function(u){ return {acc:u.acc, id:u.id, name:u.name}; }),
    counts:function(){ return JSON.parse(JSON.stringify(TOTAL)); }, done:function(){ return JSON.parse(JSON.stringify(DONE)); }, history30:history30, selfCheck:selfCheck, sync:sync};
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
