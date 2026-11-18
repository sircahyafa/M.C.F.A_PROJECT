/* ═══ KARTU UTAMA AKTIVITAS — buka/tutup Kegiatan Sehari-hari ═══
   Halaman Aktivitas hanya memiliki satu program: KEGIATAN SEHARI-HARI (#heroHarian). */
/* Klik di dalam panel isi tidak boleh naik ke kartu (agar panel tidak menutup sendiri) */
document.querySelectorAll('.akt-section-body').forEach(function(el){
  el.addEventListener('click', function(e){ e.stopPropagation(); });
});

function toggleAktHero(key) {
  var card = document.getElementById('heroHarian');
  if (!card) return;
  var isOpen = card.classList.contains('open');
  if (isOpen) { card.classList.remove('open'); return; }
  card.classList.add('open');
  card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  /* Semua .reveal di dalam langsung tampak (tanpa animasi ulang) */
  card.querySelectorAll('.reveal').forEach(function(r){
    r.classList.add('visible');
    r.classList.add('settled');
    r.style.transitionDelay = '';
  });
}

/* Sinkronkan bilah progres kartu dari penghitung utama Kegiatan Sehari-hari */
function syncHeroProgress() {
  var baDone = parseInt(document.getElementById('ba-done')?.textContent)||0;
  var baTotal = parseInt(document.getElementById('ba-total')?.textContent)||0;
  var baPct = baTotal ? Math.round(baDone/baTotal*100) : 0;
  var baHF = document.getElementById('ba-hero-fill');
  if(baHF) baHF.style.width = baPct + '%';
  var baHD = document.getElementById('ba-hero-done'); if(baHD) baHD.textContent = baDone;
  var baHT = document.getElementById('ba-hero-total'); if(baHT) baHT.textContent = baTotal;
  var baHP = document.getElementById('ba-hero-pct'); if(baHP) baHP.textContent = baPct + '%';
}
/* Ikuti pembaruan penghitung yang sudah ada */
var _origUpdateAll = window.updateAll;
window.updateAll = function() {
  if(typeof _origUpdateAll === 'function') _origUpdateAll();
  syncHeroProgress();
};
setTimeout(syncHeroProgress, 600);
