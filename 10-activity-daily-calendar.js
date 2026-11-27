// ═══ BLUEPRINT AKTIVITAS — GLOBAL FUNCTIONS ═══
// Semua fungsi di scope global agar onclick HTML bisa memanggil

function _baGetDateKey(offsetDays) {
  var d = mcfaNowJakarta();   /* AUDIT: kalender Asia/Jakarta, bukan zona waktu perangkat */
  if(offsetDays) d.setDate(d.getDate() + offsetDays);
  return 'ba_' + d.getFullYear() + '_' + (d.getMonth()+1) + '_' + d.getDate();
}
function _baDayNum(dateKey) {
  // Returns HARI ke-n Kegiatan Sehari-hari (HARI 1 = MCFA_CORE.dailyActivityStart = 1 DES 2026 = PROJECT DAY 11)
  var parts = dateKey.replace('ba_','').split('_');
  var d = mcfaParse(parts[0]+'-'+parts[1]+'-'+parts[2]);
  var start = mcfaParse(MCFA_CORE.dailyActivityStart); // HARI 1 = MCFA_CORE.dailyActivityStart
  var diff = mcfaDaysBetween(start, d) + 1;   /* AUDIT: selisih kalender, bebas geser DST */
  return Math.max(1, diff);
}

var _baCurrentKey = _baGetDateKey(0);
var _baViewingKey = _baCurrentKey; // which day we're viewing (clamped to DAY 1.096 on load — see _baClampedTodayKey)

var _baAudioCtx = null;
function baPlayUploadSound() {
  try {
    if(!_baAudioCtx) _baAudioCtx = window.mcfaAudioCtx();
    if(_baAudioCtx.state === 'suspended') _baAudioCtx.resume();
    var ctx = _baAudioCtx;
    var notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach(function(freq, i) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      var t = ctx.currentTime + i * 0.09;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.22, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38);
      osc.start(t); osc.stop(t + 0.4);
    });
    var osc2 = ctx.createOscillator();
    var g2 = ctx.createGain();
    osc2.connect(g2); g2.connect(ctx.destination);
    osc2.type = 'triangle';
    osc2.frequency.value = 1567.98;
    var t2 = ctx.currentTime + 0.36;
    g2.gain.setValueAtTime(0, t2);
    g2.gain.linearRampToValueAtTime(0.18, t2 + 0.04);
    g2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.5);
    osc2.start(t2); osc2.stop(t2 + 0.55);
  } catch(e) {}
}

function baShowUploadCelebration(el) {
  var rect = el.getBoundingClientRect();
  var cx = rect.left + rect.width / 2;
  var cy = rect.top + rect.height / 2;
  var colors = ['#fde68a','#1a56db','#4f46e5','#10b981','#f43f5e','#a855f7','#fb923c','#ffffff'];
  for (var i = 0; i < 18; i++) {
    (function(idx) {
      var p = document.createElement('div');
      var size = 5 + Math.random() * 7;
      var color = colors[Math.floor(Math.random() * colors.length)];
      var angle = Math.random() * 360;
      var dist = 50 + Math.random() * 80;
      var dx = Math.cos(angle * Math.PI / 180) * dist;
      var dy = Math.sin(angle * Math.PI / 180) * dist - 40;
      p.style.cssText = 'position:fixed;left:' + cx + 'px;top:' + cy + 'px;width:' + size + 'px;height:' + size + 'px;background:' + color + ';border-radius:' + (Math.random() > 0.5 ? '50%' : '3px') + ';pointer-events:none;z-index:9997;animation:temaConfetti 0.7s ease-out ' + (idx * 0.02) + 's both;--dx:' + dx + 'px;--dy:' + dy + 'px;';
      document.body.appendChild(p);
      var removeAt = 800 + idx * 20;
      setTimeout(function(){
        p.style.opacity = '0';
        p.style.transition = 'none';
        setTimeout(function(){ if(p.parentNode) p.parentNode.removeChild(p); }, 50);
      }, removeAt);
    })(i);
  }
  var msgs = ['Upload done! Mantap!', 'Konten live! Keep going!', 'Uploaded! Satu langkah maju!', 'Konten naik! Hajar lagi!', 'Done! Konsistensi = kemenangan!', 'Upload sukses! Terus gaspol!'];
  var msg = msgs[Math.floor(Math.random() * msgs.length)];
  var toast = document.createElement('div');
  toast.style.cssText = 'position:fixed;bottom:100px;left:50%;transform:translateX(-50%) translateY(20px);background:linear-gradient(135deg,#1443b5,#4f46e5);color:#fff;padding:13px 26px;border-radius:99px;font-size:13px;font-weight:700;z-index:9999;box-shadow:0 8px 32px rgba(26,86,219,0.5),0 0 0 1.5px rgba(255,255,255,0.15);white-space:nowrap;opacity:0;transition:all 0.38s cubic-bezier(.34,1.56,.64,1);pointer-events:none;';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(function(){ toast.style.opacity='1'; toast.style.transform='translateX(-50%) translateY(0)'; }, 10);
  setTimeout(function(){ toast.style.opacity='0'; toast.style.transform='translateX(-50%) translateY(-12px)'; }, 1900);
  setTimeout(function(){ if(toast.parentNode) toast.parentNode.removeChild(toast); }, 2400);
}

/* ═══ CHECKLIST HARIAN — satu mekanisme klik (delegasi tunggal pada #body-harian, didaftarkan SEKALI) ═══
   Alur satu ketukan: gerbang tanggal → baca penyimpanan → ubah SATU kunci → tulis → verifikasi baca-ulang → BARU ubah tampilan →
   perbarui angka (ringan, tanpa render ulang daftar/Produksi Konten) → umpan balik kecil pada ikon centang.
   Gagal simpan = tampilan tetap seperti semula + pesan; animasi sukses tidak tampil. Posisi scroll/fokus tidak disentuh. */
var _baBusy = {};
function _baItems() { return document.querySelectorAll('#body-harian .ba-item:not(.ba-prod-item)'); }
function _baSetDone(el, on) { el.classList.toggle('done', !!on); el.setAttribute('aria-checked', on ? 'true' : 'false'); }
function _baDomChecks() { var c = {}; _baItems().forEach(function(it, i){ c[it.dataset.bk || ('item_'+i)] = it.classList.contains('done'); }); return c; }
/* Tulis satu kunci pada hari yang sedang dilihat (kunci lain di penyimpanan dipertahankan → aman lintas-tab). true hanya bila terbukti tersimpan. */
function baSaveOne(key, want) {
  var raw = null;
  try { raw = localStorage.getItem(_baViewingKey); } catch(e) { return false; }
  var rec = null;
  if (raw) { try { var p = JSON.parse(raw); if (p && typeof p === 'object' && p.checks && typeof p.checks === 'object' && !Array.isArray(p.checks)) rec = p; } catch(e) {} }
  if (!rec) rec = {checks: raw ? _baDomChecks() : {}, date: _baViewingKey};   /* data hari rusak: bangun ulang dari tampilan, bukan dari kosong */
  rec.checks[key] = !!want; rec.date = _baViewingKey;
  try { localStorage.setItem(_baViewingKey, JSON.stringify(rec)); } catch(e) { return false; }
  try { var back = JSON.parse(localStorage.getItem(_baViewingKey)); return !!(back && back.checks && back.checks[key] === !!want); } catch(e) { return false; }
}
function _baFeedback(el, checked) {
  var cb = el.querySelector('.ba-cb');
  if (checked && cb) { cb.classList.remove('ba-cb-pop'); void cb.offsetWidth; cb.classList.add('ba-cb-pop'); setTimeout(function(){ cb.classList.remove('ba-cb-pop'); }, 260); }
  try { if (typeof playTap === 'function') playTap(); } catch(e) {}
  if (checked && el.classList.contains('ba-has-input')) { baPlayUploadSound(); baShowUploadCelebration(el); }
  else if (navigator.vibrate) navigator.vibrate(checked ? [8,15,6] : 10);
}
function baToggle(el) {
  // Sebelum HARI 1 Kegiatan Sehari-hari (1 DES 2026) checklist rutin tidak boleh terisi. 21–30 NOV 2026 = TUGAS AWAL (PROJECT DAY 1–10, bukan program rutin); 30 NOV 2026 = DAY 1 posting konten.
  if (_baKeyToDate(_baViewingKey) < mcfaParse(MCFA_CORE.dailyActivityStart) || mcfaNowJakarta() < mcfaParse(MCFA_CORE.dailyActivityStart)) { showNotif('Kegiatan Sehari-hari dimulai pada HARI 1 · '+formatDateUpper(MCFA_CORE.dailyActivityStart)+'.'); return; }
  var idx = -1; if (!el.dataset.bk) { var all = _baItems(); for (var i = 0; i < all.length; i++) if (all[i] === el) { idx = i; break; } }
  var key = el.dataset.bk || ('item_' + idx);
  if (_baBusy[key]) return;                              /* satu item tidak diproses dua kali sekaligus */
  _baBusy[key] = true;
  try {
    var want = !el.classList.contains('done');
    if (!baSaveOne(key, want)) { showNotif('Gagal menyimpan. Coba lagi.'); return; }   /* tampilan TIDAK diubah → status lama tetap */
    _baSetDone(el, want);
    baUpdate(true);
    _baFeedback(el, want);
  } finally { _baBusy[key] = false; }
}

/* Selaraskan tampilan hari yang sedang dilihat dengan penyimpanan (baca saja; tanpa efek suara/animasi). */
function baSyncDom() {
  var saved = {};
  try { var raw = localStorage.getItem(_baViewingKey); if (raw) { var p = JSON.parse(raw); saved = (p && p.checks) || {}; } } catch(e) { return; }
  _baItems().forEach(function(item, i){ _baSetDone(item, !!saved[item.dataset.bk || ('item_'+i)]); });
}
window.addEventListener('storage', function(e){
  if (e && e.key && e.key === _baViewingKey && typeof baLoadDay === 'function') { try { baLoadDay(_baViewingKey); } catch(x) {} }
});

/* Pengikatan SEKALI: klik terdelegasi + papan ketik (Spasi/Enter) + atribut aksesibilitas. Tidak ada handler touch/pointer. */
function _baBindOnce() {
  var body = document.getElementById('body-harian'); if (!body || body.__baBound) return !!body;
  body.__baBound = true;
  body.addEventListener('click', function(e) {
    var it = e.target.closest ? e.target.closest('.ba-item:not(.ba-prod-item)') : null;
    if (!it || !body.contains(it) || e.target.closest('input,textarea,select,a')) return;
    baToggle(it);
  });
  body.addEventListener('keydown', function(e) {
    if (e.key !== ' ' && e.key !== 'Enter') return;
    var it = e.target.closest ? e.target.closest('.ba-item:not(.ba-prod-item)') : null;
    if (!it || e.target !== it) return;
    e.preventDefault(); baToggle(it);
  });
  _baItems().forEach(function(it) { it.setAttribute('role', 'checkbox'); it.setAttribute('tabindex', '0'); it.setAttribute('aria-checked', it.classList.contains('done') ? 'true' : 'false'); });
  return true;
}
if (!_baBindOnce()) document.addEventListener('DOMContentLoaded', _baBindOnce);

function baSave() {
  var checks = {};
  document.querySelectorAll('#body-harian .ba-item:not(.ba-prod-item)').forEach(function(item, i){
    /* kunci stabil: tiap item membawa data-bk (item_N asli / wk_*), jadi menambah/memindah item TIDAK menggeser centang lama */
    checks[item.dataset.bk || ('item_'+i)] = item.classList.contains('done');
  });
  try {
    localStorage.setItem(_baViewingKey, JSON.stringify({checks: checks, date: _baViewingKey}));
    return true;
  } catch(e) {
    return false;
  }
}

function baResetAll() {
  var _isViewingToday = (_baViewingKey === _baGetDateKey(0));
  if(!confirm(_isViewingToday ? 'Reset semua checklist hari ini?' : 'Reset semua checklist untuk hari yang sedang dilihat ini?')) return;
  var _was = [];   /* centang yang sedang aktif — dipulihkan di layar bila penghapusan gagal (layar tidak boleh berbeda dari penyimpanan) */
  _baItems().forEach(function(item){ if(item.classList.contains('done')) _was.push(item); _baSetDone(item, false); });
  var removed = true;
  try { localStorage.removeItem(_baViewingKey); } catch(e){ removed = false; }
  if(!removed){
    _was.forEach(function(item){ _baSetDone(item, true); });
    showNotif('Reset belum tersimpan. Coba lagi.');
  }
  baUpdate();
}

function baApplyWorkout(key) {
  try {
    var body = document.getElementById('body-harian'); if(!body || !window.MCFA_WORKOUT) return;
    var bar = document.getElementById('wkBarBa'), first = document.getElementById('ba-blk-0');
    if(!bar && first && first.parentNode){ bar = document.createElement('div'); bar.id = 'wkBarBa'; bar.className = 'wk-wrap'; first.parentNode.insertBefore(bar, first); }
    if(bar) bar.innerHTML = MCFA_WORKOUT.bar(key);
    body.querySelectorAll('.ba-item:not(.ba-prod-item) .ba-label').forEach(function(el){
      if(!el.dataset.wkBase) el.dataset.wkBase = el.textContent.trim();
      var it = el.parentNode, blk = it.closest ? it.closest('.ba-block') : null;
      /* item olahraga bertanda data-wk (Angkat Beban / Running atau Strength Training / Latihan Kaki / Latihan Lengan) → nama dari MCFA_WORKOUT */
      var t = (it.dataset && it.dataset.wk) ? MCFA_WORKOUT.item(it.dataset.wk, key) : MCFA_WORKOUT.relabel(el.dataset.wkBase, key, blk ? blk.id : '');
      if(el.textContent !== t) el.textContent = t;
    });
  } catch(e){}
}
function baLoadDay(key) {
  _baViewingKey = key;
  baApplyWorkout(key);
  var saved = {};
  try {
    /* Tanggal sebelum HARI 1 (1 DES 2026) bukan bagian dari program rutin: centangnya tidak dimuat (data lama TIDAK dihapus, hanya tidak dihitung). */
    var _kp = key.replace('ba_','').split('_'), _kd = mcfaParse(_kp[0]+'-'+_kp[1]+'-'+_kp[2]);
    var raw = (_kd < mcfaParse(MCFA_CORE.dailyActivityStart)) ? null : localStorage.getItem(key);
    if(raw) { var p = JSON.parse(raw); saved = p.checks || {}; }
  } catch(e){}
  _baItems().forEach(function(item, i){
    _baSetDone(item, !!saved[item.dataset.bk || ('item_'+i)]);
  });
  baUpdate();
  // Update day nav UI
  _baRenderDayNav();
}

function baPrevDay() {
  var parts = _baViewingKey.replace('ba_','').split('_');
  var d = mcfaParse(parts[0]+'-'+parts[1]+'-'+parts[2]);
  d.setDate(d.getDate() - 1);
  var start = mcfaParse(MCFA_CORE.dailyActivityStart);
  if(d < start) return; // tidak bisa sebelum HARI 1 (1 DES 2026)
  var newKey = 'ba_' + d.getFullYear() + '_' + (d.getMonth()+1) + '_' + d.getDate();
  baLoadDay(newKey);
}

function baNextDay() {
  var parts = _baViewingKey.replace('ba_','').split('_');
  var d = mcfaParse(parts[0]+'-'+parts[1]+'-'+parts[2]);
  d.setDate(d.getDate() + 1);
  // FIX: periode penghitung hari Kegiatan Sehari-hari berakhir 20 NOVEMBER 2029 = HARI 1.086 (PROJECT DAY 1.096; mulai
  // dari MCFA_CORE: dailyActivityStart–projectEnd).
  // perfectPhaseStart (FASE SEMPURNA) adalah milestone — a separate screen,
  // NOT part of the 1.096-day counter. Navigating past 20 NOVEMBER must stop here
  // so the counter can never render "DAY 1.117 dari 1.096".
  var end = mcfaParse(MCFA_CORE.projectEnd);
  if(d > end) return; // can't go past DAY 1.096 (20 NOVEMBER 2029) — last day of aktivitas period
  var newKey = 'ba_' + d.getFullYear() + '_' + (d.getMonth()+1) + '_' + d.getDate();
  baLoadDay(newKey);
}

function baGoToday() {
  baLoadDay(_baClampedTodayKey());
}

// Returns today's ba_ key, clamped to the main-period boundary (20 NOVEMBER 2029
// = DAY 1.096). If the device clock is ever past the project end, this keeps
// the app pinned to the last valid day instead of rendering DAY 1.117+.
function _baClampedTodayKey() {
  var d = mcfaNowJakarta();
  var firstDay = mcfaParse(MCFA_CORE.dailyActivityStart), lastDay = mcfaParse(MCFA_CORE.projectEnd);
  if(d < firstDay) d = firstDay;     /* sebelum HARI 1: kalender program rutin dibuka di 1 DES 2026, bukan di tanggal sebelumnya */
  if(d > lastDay) d = lastDay;
  return 'ba_' + d.getFullYear() + '_' + (d.getMonth()+1) + '_' + d.getDate();
}

function _baRenderDayNav() {
  var el = document.getElementById('ba-day-nav');
  if(!el) return;
  var parts = _baViewingKey.replace('ba_','').split('_');
  var d = mcfaParse(parts[0]+'-'+parts[1]+'-'+parts[2]);
  var dayNum = _baDayNum(_baViewingKey);
  var isToday = (_baViewingKey === _baGetDateKey(0));
  var start = mcfaParse(MCFA_CORE.dailyActivityStart);
  var isPast = d < start;
  var toStart = mcfaDaysBetween(mcfaNowJakarta(), start);   /* >0 = program rutin belum dimulai */
  // Aktivitas day-counter period ends 20 NOVEMBER 2029 = DAY 1.096 (start is
  // dari MCFA_CORE: dailyActivityStart–projectEnd).
  var lastDay = mcfaParse(MCFA_CORE.projectEnd);
  var isLastDay = (d.getTime() === lastDay.getTime());

  el.innerHTML =
    '<div class="ba-daynav-inner">' +
      '<button class="ba-nav-btn" onclick="baPrevDay()" title="Hari sebelumnya">‹</button>' +
      '<div class="ba-daynav-center">' +
        '<div class="ba-daynav-day">' +
          (isToday ? '<span class="ba-today-badge">HARI INI</span> ' : '') +
          '<span class="ba-daynav-dayname">' + formatDayUpper(d) + '</span>' +
          ', ' + formatDateUpper(d) +
        '</div>' +
        '<div class="ba-daynav-num">' + (isPast ? 'BELUM DIMULAI &nbsp;·&nbsp; MULAI ' + formatDateUpper(MCFA_CORE.dailyActivityStart) : ('HARI ' + dayNum.toLocaleString('id-ID') + ' dari ' + MCFA_DERIVED.dailyTotalDays.toLocaleString('id-ID') + ' &nbsp;·&nbsp; PROJECT DAY ' + MCFA_DERIVED.projectDayOf(d).toLocaleString('id-ID') + (toStart > 0 ? ' &nbsp;·&nbsp; MULAI ' + toStart.toLocaleString('id-ID') + ' HARI LAGI' : ''))) + (isLastDay ? ' &nbsp;·&nbsp; <span class="ba-lastday-badge">LAST DAY</span>' : '') + ((isToday || toStart > 0) ? '' : ' &nbsp;·&nbsp; <button class="ba-gotd-btn" onclick="baGoToday()">→ Hari ini</button>') + '</div>' +
      '</div>' +
      '<button class="ba-nav-btn"' + (isLastDay ? ' disabled title="Hari terakhir periode utama (Hari ' + MCFA_DERIVED.dailyTotalDays.toLocaleString('id-ID') + ')"' : ' onclick="baNextDay()" title="Hari berikutnya"') + '>›</button>' +
    '</div>';
}

/* baUpdate(lite): lite = true dipakai saat SATU centang rutin berubah → TIDAK membangun ulang blok Produksi Konten (tidak terpengaruh centang rutin;
   membangunnya ulang tiap ketukan menggeser tampilan) dan progres mingguan/keseluruhan/riwayat digabung & ditunda (satu kali per rentetan ketukan). */
var _baHeavyT = 0;
function _baHeavyNow() { _baHeavyT = 0; try { _baRenderProgress(); _baRenderHistory(); } catch(e) {} }
function _baScheduleHeavy() { if (_baHeavyT) return; _baHeavyT = setTimeout(_baHeavyNow, 120); }
/* tulis hanya bila nilai berubah — tidak ada mutasi DOM/reflow sia-sia saat ketukan beruntun */
function _baTxt(el, v) { v = String(v); if (el.textContent !== v) el.textContent = v; }
function _baW(el, w) { if (el.style.width !== w) el.style.width = w; }
function baUpdate(lite) {
  // SSOT sync: re-render Produksi Konten blocks from Jadwal & Upload Konten data
  // sebelum menghitung progres, supaya status selalu real-time & konsisten (dilewati pada pembaruan ringan satu centang).
  if (lite !== true && typeof renderProduksiBlocks === 'function') renderProduksiBlocks();

  /* AUDIT 20261117.8: penghitung utama (angka harian, persen, kartu hero) HANYA menghitung tugas rutin — sama dengan progres mingguan,
     keseluruhan, dan dashboard Tahap. Item Produksi Konten (.ba-prod-item) berasal dari status konten Studio dan dihitung terpisah
     lewat penghitung blok 'Produksi Konten' (cnt-prod-*), sehingga tidak pernah tercampur / terhitung dua kali. */
  var allItems = document.querySelectorAll('#body-harian .ba-item:not(.ba-prod-item)');
  var total = allItems.length, done = 0;
  allItems.forEach(function(item){ if(item.classList.contains('done')) done++; });

  
  var pct = total > 0 ? Math.round(done/total*100) : 0;
  var fill = document.getElementById('ba-fill');
  var pctEl = document.getElementById('ba-pct');
  var doneEl = document.getElementById('ba-done');
  var totalEl = document.getElementById('ba-total');
  if(fill) _baW(fill, pct + '%');
  if(pctEl) _baTxt(pctEl, pct + '%');
  if(doneEl) _baTxt(doneEl, done);
  if(totalEl) _baTxt(totalEl, total);

  // Qhodo counter
  var qItems = document.querySelectorAll('#body-harian .ba-item.ba-qhodo');
  var qTotal = qItems.length, qDone = 0;
  qItems.forEach(function(item){ if(item.classList.contains('done')) qDone++; });
  var qPct = qTotal > 0 ? Math.round(qDone/qTotal*100) : 0;
  var qFill = document.getElementById('ba-qhodo-fill');
  var qPctEl = document.getElementById('ba-qhodo-pct');
  var qDoneEl = document.getElementById('ba-qhodo-done');
  var qTotalEl = document.getElementById('ba-qhodo-total');
  var qRemainEl = document.getElementById('ba-qhodo-remain');
  if(qFill) _baW(qFill, qPct + '%');
  if(qPctEl) _baTxt(qPctEl, qPct + '%');
  if(qDoneEl) _baTxt(qDoneEl, qDone);
  if(qTotalEl) _baTxt(qTotalEl, qTotal);
  if(qRemainEl) {
    var today = mcfaNowJakarta();
    var start = mcfaParse(MCFA_CORE.dailyActivityStart); start.setHours(0,0,0,0);
    // Qhodo (daily checklist) period ends 20 NOVEMBER 2029 = DAY 1.096, same as
    // the day-counter/baNextDay boundary. 21 NOVEMBER 2029 is the FASE SEMPURNA
    // Sempurna milestone, not a checklist day.
    var end = mcfaParse(MCFA_CORE.projectEnd); end.setHours(0,0,0,0);
    var dayElapsed = Math.max(0, Math.floor((today - start)/(1000*60*60*24)));
    var _tLeft = today < start ? start : today; // sebelum HARI 1 sisa hari = total penuh (MCFA_DERIVED.dailyTotalDays)
    var daysLeft = Math.max(0, Math.floor((end - _tLeft)/(1000*60*60*24)) + 1);
    var totalQhodoLeft = Math.max(0, (daysLeft * qTotal) - qDone);
    _baTxt(qRemainEl, totalQhodoLeft.toLocaleString('id-ID') + ' qhodo (' + daysLeft + ' hari tersisa)');
  }

  // Block counters
  var container = document.getElementById('body-harian');
  var blocks = container ? container.querySelectorAll('.ba-block') : [];
  var cntIds = ['cnt-pagi','cnt-prod-pagi','cnt-siang','cnt-prod-siang','cnt-sore','cnt-boxing','cnt-prod-sore','cnt-malam','cnt-prod-malam','cnt-prod-tambahan','cnt-tidur'];
  blocks.forEach(function(block, idx){
    var cntEl = document.getElementById(cntIds[idx]);
    if(!cntEl) return;
    var bItems = block.querySelectorAll('.ba-item');
    var bDone = 0;
    bItems.forEach(function(it){ if(it.classList.contains('done')) bDone++; });
    _baTxt(cntEl, bDone + '/' + bItems.length);
  });

  // Bug fix: hero header (ba-hero-done/total/pct) was only refreshed by
  // the unrelated Keuangan updateAll() on page load, so it never moved
  // when checklist items were toggled. Sync it here directly.
  if (typeof syncHeroProgress === 'function') syncHeroProgress();

  if (lite === true) { _baScheduleHeavy(); }
  else { if (_baHeavyT) { clearTimeout(_baHeavyT); _baHeavyT = 0; } _baRenderProgress(); _baRenderHistory(); }   // progres mingguan & keseluruhan + titik riwayat
}

function _baRenderHistory() {
  var el = document.getElementById('ba-history');
  if(!el) return;
  var html = '';
  var today = mcfaNowJakarta();
  var start = mcfaParse(MCFA_CORE.dailyActivityStart); // KEGIATAN SEHARI-HARI mulai 1 DES 2026 (dailyActivityStart); harus sama dengan start _baDayNum.
  var _it = _baChecklistKeys();   /* penyebut = jumlah pekerjaan rutin NYATA di halaman (58), sama dengan progres harian/mingguan/keseluruhan */
  for(var i = 6; i >= 0; i--) {
    var d = new Date(today); d.setDate(d.getDate() - i);
    if(d < start) continue;
    var key = 'ba_' + d.getFullYear() + '_' + (d.getMonth()+1) + '_' + d.getDate();
    var dayNum = _baDayNum(key);
    var pct = 0;
    try {
      var raw = localStorage.getItem(key);
      if(raw) {
        var p = JSON.parse(raw);
        var checks = p.checks || {};
        /* AUDIT Tahap 3: dulu penyebut = jumlah kunci yang pernah diklik (centang pertama tampil 100%). Kini hanya pekerjaan rutin yang benar-benar ada yang dihitung, dibagi seluruh pekerjaan. */
        var done = 0;
        Object.keys(checks).forEach(function(k){ if(_it.keys[k] && checks[k] === true) done++; });
        if(_it.count > 0) pct = Math.min(100, Math.round(done/_it.count*100));
      }
    } catch(e){}
    var isViewing = (key === _baViewingKey);
    var isToday = (key === _baGetDateKey(0));
    var color = pct === 0 ? '#e2e8f0' : pct < 50 ? '#fde68a' : pct < 100 ? '#6ee7b7' : '#10b981';
    html += '<div class="ba-hist-dot' + (isViewing ? ' viewing' : '') + (isToday ? ' today' : '') + '" ' +
      'onclick="baLoadDay(\'' + key + '\')" title="Day ' + dayNum + ': ' + pct + '% selesai" ' +
      'style="background:' + color + '">' +
      '<span class="ba-hist-num">' + dayNum + '</span>' +
      '</div>';
  }
  var _out = html || '<div style="font-size:11px;color:#94a3b8;padding:8px">' + (today < start ? 'Riwayat mulai terisi sejak HARI 1 · ' + formatDateUpper(MCFA_CORE.dailyActivityStart) : 'Baru dimulai hari ini') + '</div>';
  if (el.__baHist !== _out) { el.__baHist = _out; el.innerHTML = _out; }   /* tanpa render ulang bila tidak ada perubahan */
}

/* AUDIT: pergantian hari saat aplikasi tetap terbuka. Dulu kunci hari dihitung sekali saat dimuat, sehingga centang setelah tengah malam
   tersimpan ke HARI KEMARIN. Sekarang kunci hari diperbarui otomatis. */
var _baRollKey = null;
function baRollover(){
  var nk = _baClampedTodayKey();
  if(_baRollKey === null){ _baRollKey = nk; return false; }
  if(nk === _baRollKey) return false;
  var wasToday = (_baViewingKey === _baRollKey);
  _baRollKey = nk; _baCurrentKey = nk;
  if(wasToday) baLoadDay(nk); else _baRenderDayNav();
  try{ _baRenderHistory(); }catch(e){}
  return true;
}
baRollover();

// Init on DOM ready
document.addEventListener('DOMContentLoaded', function(){
  _baRenderDayNav();
  baLoadDay(_baClampedTodayKey());
  _baRenderHistory();
});
// Fallback if DOMContentLoaded already fired
if(document.readyState === 'complete' || document.readyState === 'interactive'){
  setTimeout(function(){
    _baRenderDayNav();
    baLoadDay(_baClampedTodayKey());
    _baRenderHistory();
  }, 0);
}


/* ═══ PROGRES MINGGUAN & KESELURUHAN ═══
   Dihitung dari checklist rutin yang BENAR-BENAR tersimpan (ba_YYYY_M_D) dan daftar item yang benar-benar ada di halaman. Tidak ada angka statis.
   Minggu ke-N = 7 hari berurutan sejak HARI 1 (1 DES 2026; minggu terakhir 1 hari, karena 1.086 = 155×7 + 1). Tanggal sebelum HARI 1 / setelah 20 NOV 2029 tidak dihitung.
   Hanya kunci kanonis (tanpa nol di depan) yang dihitung, sehingga satu hari tidak pernah terhitung dua kali. Item Produksi Konten tidak ikut
   (statusnya berasal dari Studio, bukan dari checklist tersimpan) — sama dengan dasar hitung dashboard Tahap. */
function _baChecklistKeys() {
  var keys = {}, n = 0;
  document.querySelectorAll('#body-harian .ba-item:not(.ba-prod-item)').forEach(function(el, i){ keys[el.dataset.bk || ('item_'+i)] = 1; n++; });
  return {keys: keys, count: n};
}
var _baRecCache = {};
function _baDoneBetween(from, to, keys) {   // from/to = Date (tengah malam lokal), inklusif
  var done = 0;
  try {
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i), m = /^ba_(\d{4})_(\d{1,2})_(\d{1,2})$/.exec(k || ''); if (!m) continue;
      if (k !== 'ba_' + (+m[1]) + '_' + (+m[2]) + '_' + (+m[3])) continue;          // bukan bentuk kanonis → abaikan (cegah hitung ganda)
      var d = new Date(+m[1], +m[2]-1, +m[3]);
      if (d < from || d > to) continue;
      var raw = localStorage.getItem(k) || '{}', ce = _baRecCache[k];
      if (!ce || ce.raw !== raw) { var rec = JSON.parse(raw); ce = _baRecCache[k] = {raw: raw, checks: (rec && rec.checks) || {}}; }   /* parse ulang hanya bila isi hari itu berubah */
      var c = ce.checks;
      Object.keys(c).forEach(function(key){ if (keys[key] && c[key] === true) done++; });
    }
  } catch(e) {}
  return done;
}
function _baRenderProgress() {
  var card = document.getElementById('ba-wk-card'); if (!card) return;
  var it = _baChecklistKeys(), start = mcfaParse(MCFA_CORE.dailyActivityStart), end = mcfaParse(MCFA_CORE.projectEnd);
  var vp = _baViewingKey.replace('ba_','').split('_'), vd = mcfaParse(vp[0]+'-'+vp[1]+'-'+vp[2]);
  if (isNaN(vd.getTime()) || vd < start) vd = start;
  if (vd > end) vd = end;
  var dayNum = mcfaDaysBetween(start, vd) + 1, wk = Math.floor((dayNum - 1) / 7) + 1, weeks = Math.ceil(MCFA_DERIVED.dailyTotalDays / 7);
  var wS = new Date(start.getFullYear(), start.getMonth(), start.getDate() + (wk - 1) * 7);
  var wE = new Date(wS.getFullYear(), wS.getMonth(), wS.getDate() + 6); if (wE > end) wE = end;
  var wDays = mcfaDaysBetween(wS, wE) + 1, wTotal = it.count * wDays, wDone = _baDoneBetween(wS, wE, it.keys);
  var wFirstDay = (wk - 1) * 7 + 1, wLastDay = wFirstDay + wDays - 1;
  var aDays = MCFA_DERIVED.dailyTotalDays, aTotal = it.count * aDays, aDone = _baDoneBetween(start, end, it.keys);
  var pct = function(d, t){ return t > 0 ? Math.min(100, d / t * 100) : 0; };
  var txt = function(v){ return v.toLocaleString('id-ID', {maximumFractionDigits: 1}) + '%'; };
  var set = function(id, v){ var e = document.getElementById(id); if (e) e.textContent = v; };
  var fill = function(id, v){ var e = document.getElementById(id); if (e) e.style.width = v.toFixed(1) + '%'; };
  var wp = pct(wDone, wTotal), ap = pct(aDone, aTotal);
  set('ba-wk-label', 'Progress Minggu ke-' + wk + ' dari ' + weeks);
  set('ba-wk-pct', txt(wp)); fill('ba-wk-fill', wp);
  set('ba-wk-sub', wDone.toLocaleString('id-ID') + ' dari ' + wTotal.toLocaleString('id-ID') + ' tugas · HARI ' + wFirstDay.toLocaleString('id-ID') + '–' + wLastDay.toLocaleString('id-ID') + ' (' + wDays + ' hari)');
  set('ba-all-label', 'Progress Keseluruhan · ' + aDays.toLocaleString('id-ID') + ' hari');
  set('ba-all-pct', txt(ap)); fill('ba-all-fill', ap);
  set('ba-all-sub', aDone.toLocaleString('id-ID') + ' dari ' + aTotal.toLocaleString('id-ID') + ' tugas selesai');
}
