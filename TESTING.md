# Laporan Pengujian — build 20261117.8 (Audit akhir)
Chromium headless (Playwright), layar 360 px, zona Asia/Jakarta, jam disimulasikan, server statis lokal. Belum diuji di HP Android sungguhan dan Firebase sungguhan.

## Audit akhir 20261117.8 — LULUS (benar-benar dijalankan)
- Sintaks 42 berkas JS valid; build `20261117.8` seragam (index 51 `?v=`, `sw.js`, `assets.json`, `00-data-migration.js`, README); semua rujukan ada; `assets.json` (bytes/md5) cocok.
- Tanggal/Tahap pada 9 tanggal: 20 NOV 2026, DAY 1, 20 NOV 2027 (akhir Tahap 1), 21 NOV 2027 (awal Tahap 2), 29 FEB 2028, 20 NOV 2028 (akhir Tahap 2), 21 NOV 2028 (awal Tahap 3), 20 NOV 2029 (DAY 1.096; minggu terakhir 4 hari = 232 tugas), 21 NOV 2029 (dijepit ke DAY 1.096). `mcfaSelfCheck()` kosong di semuanya.
- Penghitungan: 2 konten Siap Upload + 0 tugas rutin → harian 0/58, hero 0/58, mingguan 0/406, keseluruhan 0/63.568 (sebelum perbaikan 2/61). Kunci `ba_` non-kanonis + 1 centang → dashboard Tahap 1/63.568 (sebelum perbaikan 3).
- Centang: dua tab membuka DAY 1, centang berbeda di tiap tab → ketiganya tersimpan; batal centang dari tab lain tepat; reload tetap; pergantian tengah malam DAY 1→DAY 2 memuat ulang, centang DAY 1 aman, harian 0/58, mingguan tetap.
- Kehidupan↔Keuangan: centang target → 1 transaksi `KH-` (tersimpan setelah reload), batal centang → transaksi hilang, total kembali 0.
- Impor JSON: kunci program lama dan `ba_*` sebelum DAY 1 tidak diimpor; impor berulang tidak membuat salinan pengaman bersarang (1.402 bita); gagal-tulis satu kunci → impor dibatalkan, data kembali seperti semula, pesan galat tampil.
- Cloud dengan Firebase TIRUAN (bukan Firebase sungguhan): Simpan → dokumen cloud tanpa snapshot/penanda lokal; Pulihkan di perangkat kedua dengan gagal-tulis → pesan galat + data kembali seperti semula; Pulihkan normal → 8 kunci terverifikasi, `ba_` sebelum DAY 1 tidak ikut, salinan pengaman tersimpan.
- Service Worker: pemasangan build .8, lalu rilis build baru → cache lama terhapus, semua skrip berversi baru, centang tetap utuh.
- Konten Studio: konten sebelum DAY 1 dikecualikan; konten bertanggal 2027 masuk Tahap 2; kartu Tahap 1 menampilkan 2 / 4.200 sama dengan `MCFA_STUDIO.aggregate`.
- Tanpa error JavaScript pada semua uji (kegagalan memuat font/Firebase dari internet di sandbox diabaikan karena opsional).

## BELUM TERUJI (audit akhir)
- HP Android sungguhan; Firebase sungguhan (izin, jaringan, batas ±1 MB); perangkat ganda sungguhan.
- Impor memakai berkas cadangan asli pengguna: pada uji, `mcfa_reno_v1` berisi data dummy kembali ke struktur bawaan modul setelah dimuat (kemungkinan normalisasi) — perlu dipastikan dengan cadangan asli.
- Pekan proyek ke-53 (DAY 365–371) melintasi batas Tahap 1/2 (pekan proyek biasa, bukan galat).

---
(Di bawah ini: laporan build sebelumnya, dipertahankan sebagai riwayat.)
Chromium headless (Playwright), layar 360 px, zona Asia/Jakarta, jam disimulasikan, server statis lokal. Belum diuji di HP Android sungguhan.

## LULUS — benar-benar dijalankan
- Halaman Aktivitas hanya berisi `#heroHarian`; tidak ada teks "tugas awal / persiapan / adaptasi" di dalamnya; ID dan fungsi lama (`heroTugasAwal`, `heroPersiapan`, `pspGroup`, `aktDash`, `TAH`, `PERS`, `taToggle`, `MCFA_PSP`) tidak ada.
- Tanpa error JavaScript saat memuat, masuk aplikasi, dan membuka Aktivitas; tidak ada overflow horizontal (scrollWidth = 360).
- Lencana hero 17 NOV 2026: "DAY 1 DALAM 4 HARI" (sebelumnya "TUGAS AWAL 3/5").
- Pembersihan data: dengan 11 kunci lama + kunci aktif (konten Studio, tahap1, buku besar, akun hub, `ba_*`) di localStorage, semua kunci lama terhapus, kunci aktif tetap ada, isi `mcfa_pre_import_snapshot` ikut dibersihkan dari kunci lama; kunci lama yang ditulis ulang lalu muat ulang terhapus lagi. `MCFA_MIGRATE.report().result.ok` = true.
- Centang 21 NOV 2026: 0/58 → centang → 1/58 tersimpan hanya di `ba_2026_11_21` → muat ulang tetap 1/58 → batal centang 0/58; progres di kartu ikut berubah.
- Semua 74 berkas yang dirujuk `index.html` dan `sw.js` ada; `assets.json` valid.

## BELUM TERUJI
- HP Android sungguhan, Firebase/Cloud Sync (filter kunci lama pada backup/pemulihan hanya diperiksa lewat kode), pembaruan Service Worker pada perangkat yang sudah memasang build lama.
- Langkah 2–11 dari Master Prompt belum dikerjakan (lihat BELUM-SELESAI.md).

## Langkah 2 — dashboard Tahap Aktivitas (LULUS, Chromium headless, Asia/Jakarta, jam disimulasikan)
- 17 NOV 2026: live "DAY 1 DALAM 4 HARI", semua tahap MENUNGGU, 0 / 63.568 tugas (58 item × 1.096 hari).
- 21 NOV 2026: TAHAP 1 · DAY 1, Tahap 1 BERJALAN; centang satu item → 1 / 63.568 dan 1 / 21.170 pada kartu Tahap 1.
- 5 DES 2027 (data uji): TAHAP 2 · DAY 380, waktu 34,7%; Tahap 1 SELESAI (78 centang), Tahap 2 BERJALAN (10), kunci bertanggal 20 NOV 2026 tidak ikut dihitung.
- Pilih/tutup/ganti tahap berfungsi; tanpa error JS; scrollWidth = lebar layar pada 320, 360, dan 1024 px.
- Belum diuji: HP Android sungguhan.

## Langkah 8 + timeline Langkah 5 (LULUS, Chromium headless, Asia/Jakarta, jam disimulasikan)
- `mcfaSelfCheck()` kosong (sinkron) pada 17 NOV 2026, 21 NOV 2026, dan 5 JAN 2027; tidak ada kunci lama (`taskStart`, `taDay1`, `persStart`, dst.) di `MCFA_CORE`.
- Daftar Fase: 17 NOV → Fase 04 SEKARANG, gerbang DAY 1 BERIKUTNYA ("4 HARI LAGI"); 21 NOV dan 5 JAN → gerbang SELESAI, Fase 05 SEKARANG. Umur pada DAY 1 = 22; H-1 = 21.
- Tidak ada teks "Tugas Awal" / "Persiapan MC" / "Adaptasi" di DOM; tanpa error JavaScript. Satu 404 tidak berubah dari build sebelumnya: `hero-fase1.jpg` (foto opsional, ilustrasi dipakai bila tidak ada).


## Langkah 3, 4, 6, 9–11 (LULUS, Chromium headless, Asia/Jakarta, jam disimulasikan)
- Tahap: 21 NOV 2026→20 NOV 2027 (365), 21 NOV 2027→20 NOV 2028 (366), 21 NOV 2028→20 NOV 2029 (365). `MCFA_TAHAP.running()` = 1 pada 17 NOV 2026, 21 NOV 2026, 20 NOV 2027; = 2 pada 21 NOV 2027 dan 29 FEB 2028; = 3 pada 21 NOV 2028, 20 NOV 2029 dan sesudahnya. DAY 1.096 = 20 NOV 2029. `mcfaSelfCheck()` kosong pada semua tanggal uji.
- Kalender: 17 NOV 2026 → dibuka di DAY 1 ("MULAI 4 HARI LAGI"), centang diblokir, progres 0/0, riwayat "mulai terisi sejak DAY 1"; data seed 17/20 NOV dan kunci berangka nol di depan tidak terhitung. DAY 1: centang 2 → harian 2/58, minggu 2/406, keseluruhan 2/63.568; reload tetap; batal centang → 1. DAY 9 = Minggu ke-2 (DAY 8–14). Mundur 20× berhenti di DAY 1. DAY 1.096: Minggu ke-157, 4 hari, 232 tugas.
- Pembersihan: 6 kunci lama yang di-seed hilang saat dimuat; kunci aktif (foto Sheina, kunci Studio) tetap.
- Halaman Aktivitas: hanya `#heroHarian`; tidak ada teks/ID/fungsi Tugas Awal, Persiapan, Adaptasi. Umur 22 pada 21 NOV 2026, 21 pada 20 NOV 2026; 25 milestone umur utuh.
- Tanpa error JS pada 4 konfigurasi; tidak ada overflow horizontal di 320, 360, 1024 px pada kelima halaman; tidak ada elemen terpotong di dashboard Tahap. Tangkapan layar diperiksa visual.
- Belum diuji: HP Android sungguhan, Firebase sungguhan, pembaruan Service Worker di perangkat lama.

## Penghapusan ba_* sebelum DAY 1 (LULUS)
- Seed `ba_2025_12_31`, `ba_2026_11_1/17/20` → terhapus; `ba_2026_11_21/29`, `ba_2027_1_5` tetap. Isi `mcfa_pre_import_snapshot` ikut dibersihkan. `purge.test` benar untuk 20 NOV (true) dan 21 NOV (false). Tulis ulang + reload → terhapus lagi. Tanpa error JS.
