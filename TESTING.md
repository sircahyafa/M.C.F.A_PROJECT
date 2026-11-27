# Laporan Pengujian — build 20261127.7 (Bagian 7–8 + keputusan pengguna: milestone 21 NOV 2027)

> Build 20261127.7: satu-satunya perubahan kode sejak validasi Bagian 7–8 adalah milestone "1 YEAR BARONGSUKMA PROGRESS" = 21 NOV 2027 (Global Day 355) dan pemeriksaan bawaannya. Jadwal Fase 3/4 (sampai 1 SEP / mulai 2 SEP 2027) dikonfirmasi pengguna. Diuji ulang di Chromium pada 8 tanggal: 0 galat JS, `selfCheck` kosong, validasi Barongsukma OK, milestone tampil 21 NOV 2027; `node --check` + JSON lolos. Hasil Bagian 7–8 di bawah (dijalankan pada build .6) tetap berlaku untuk bagian yang tidak tersentuh perubahan ini; catatan "menunggu konfirmasi" di dalamnya sudah terjawab.

## BAGIAN 7–8 — Validasi menyeluruh dan paket final (build 20261127.6, 27 NOV 2026)
**Metode:** Chromium (Playwright) + server statis lokal, zona `Asia/Jakarta`, jam dipalsukan, profil browser sementara (tidak ada data pengguna yang disentuh). Perhitungan tanggal fase juga diperiksa ulang secara MANDIRI di Python (bukan dari validator aplikasi). Sandbox tanpa internet: satu-satunya "galat konsol" adalah `net::ERR_NAME_NOT_RESOLVED` (Google Fonts/Firebase), bukan galat JavaScript.

| # | Yang diuji | Hasil | Status |
|---|---|---|---|
| 1 | `node --check` 47 berkas *.js; `assets.json`, `manifest.json` valid JSON | 0 galat | PASS |
| 2 | 12 tanggal (27/29/30 NOV, 1 DES 2026; 8/9 FEB, 10/11 MAR, 1/2 SEP, 20/21 NOV 2027), layar 390 px | 0 galat JS, `mcfaSelfCheck()` kosong, `MCFA_TUGAS_AWAL.selfCheck()` kosong, 0 ID ganda, 0 px scroll horizontal | PASS |
| 3 | Tanggal fase dihitung ulang mandiri (Python) | F1 1 DES 2026–8 FEB 2027 = 70 hr (GD 0–69) · F2 9 FEB–10 MAR = 30 hr (70–99) · F3 11 MAR–1 SEP = 175 hr (100–274) · F4 2 SEP–20 NOV 2027 = 80 hr (275–354); tersambung tanpa celah/tumpang tindih; total 355; siklus lanjutan 21 NOV 2027 | PASS |
| 4 | Profil Barongsukma di 5 tanggal batas (30 NOV, 1 DES 2026; 10 MAR, 1 SEP, 2 SEP 2027) | Tanggal, durasi, Global Day, BB/TB tiap fase tampil sesuai sumber `BARONG_PROGRAM`; 30 NOV = "BELUM DIMULAI / dimulai 1 hari lagi"; 1 DES = FASE 1 aktif DAY 1/70; 2 SEP 2027 = FASE 4 DAY 1/80 | PASS |
| 5 | Urutan bagian Aktivitas (DOM) | 1 Memulai Hari · 2 Pembersihan Rumah · 3 Bereskan Kamar · 4 Pemanasan Workout · 5 Pembaruan Diri · 6 Pedoman Kehidupan · 7 Pembersihan Studio · 8 Persiapan Identitas dan Branding · 30 NOV Hari Pengulangan | PASS |
| 6 | Jumlah tugas per bagian | 3+2+3+2+4+3+36+110 = 163; 0 ID ganda; blok 30 NOV = 163 + 11 upload = 174; total 337 checkbox | PASS |
| 7 | Pemindahan "Pemanasan Running Pertama (1)" | Ada di Bagian 4 (ID `s1.a04`; `r30.s1.a04` di 30 NOV), tidak ada di Bagian 1. Uji data lama: `s1.a01`,`s1.a02`,`s1.a04` tercentang → Bagian 1 = 2/3, Bagian 4 = 1/2 (status ikut pindah, tanpa migrasi) | PASS |
| 8 | Centang / batal / reload / penyimpanan terpisah | Centang `s1.a03` hanya menulis `mcfa_task_awal_day1_v1`; centang `r30.s1.a03` dan `u30.barongsukma` hanya menulis `mcfa_task_awal_day30_v1`; bertahan setelah muat ulang; batal centang mengembalikan; 6× ketuk cepat → kembali ke keadaan awal | PASS |
| 9 | Backup → restore | Ekspor JSON (5 kunci, memuat day1 + day30) → impor ke profil browser kosong → kedua kunci pulih utuh | PASS |
| 10 | Referensi berkas | 75 rujukan lokal `index.html` ada di disk; 81 berkas di `sw.js` ada di disk; versi `20261127.6` seragam (`index.html`, `sw.js`, `assets.json`, `00-data-migration.js`) | PASS |
| 11 | Layar 360×800, 390×844, 1280×800 pada 1 DES 2026 | 0 galat JS, 0 px scroll horizontal | PASS |
| 12 | `localStorage.clear()` / reset data | Tidak ada di kode (hanya disebut di komentar) | PASS |

**Tidak ada perubahan kode pada Bagian 7–8.** Hanya dokumen (CHANGELOG, TESTING, BELUM-SELESAI) yang diperbarui.

**NOT TESTED (jujur):** HP Android sungguhan; Safari/iOS; Firebase / Cloud Sync sungguhan (sandbox tanpa internet — kode tidak diubah di Bagian 1–8); pergantian tengah malam nyata; pembaruan Service Worker di perangkat yang sudah memasang build lama; tangkapan layar visual kartu Tugas Awal yang terbuka (urutan bagian dibuktikan lewat DOM, bukan gambar).

**Catatan jadwal Fase 3/4:** berkas instruksi awal menulis Fase 3 berakhir 31 AGU 2027 dan Fase 4 mulai 1 SEP 2027 (174 + 81 hari); paket ini mengikuti REVISI build .6 (Fase 3 sampai 1 SEP, Fase 4 mulai 2 SEP; 175 + 80 hari). Total 355 hari sama. Mengembalikan ke versi instruksi awal = ubah `end` Fase 3, `start` Fase 4, dan angka di `BARONG_EXPECTED_DAYS/DUR`.

> REVISI build 20261127.6: tanggal Fase 3 menjadi 11 MAR – 1 SEP 2027 (175 hari, GD 100–274) dan Fase 4 menjadi 2 SEP – 20 NOV 2027 (80 hari, GD 275–354). Tabel di bawah ditulis untuk build .5; angka Fase 3/4 di dalamnya (31 AGU, 1 SEP, 174/81 hari) digantikan nilai ini. Diuji ulang di Node dan Chromium pada 9 tanggal (27 NOV & 1 DES 2026; 10/11 MAR, 31 AGU, 1/2 SEP, 20/21 NOV 2027): validasi bawaan OK "70/30/175/80 hari", selfCheck kosong, 0 galat JS, teks profil benar, 0 teks lama.

## BAGIAN 6 — Program Barongsukma 4 fase (build 20261127.5, 27 NOV 2026)
**Metode:** (1) Node memuat inti tanggal `04-core-timeline.js` + blok `BARONG_PROGRAM` apa adanya; (2) Chromium (Playwright), server statis lokal, zona `Asia/Jakarta`, layar 390 px, jam dipalsukan pada 9 tanggal. Sandbox tanpa internet: Google Fonts/Firebase tidak termuat (keterbatasan lingkungan, bukan bug). Data uji memakai profil browser sementara; tidak ada data pengguna yang disentuh.

| # | Yang diuji | Hasil | Status |
|---|---|---|---|
| 1 | `node --check` seluruh *.js (+ `sw.js`); `assets.json`, `manifest.json` valid | 0 galat | PASS |
| 2 | `_barongValidate()` (konsol Chromium pada 9 tanggal) | "validasi OK: 4 fase 70/30/174/81 hari, Global Day 0 = 1 Des 2026, BB 55→75 / 75→70 / 70→100 / 100→85" | PASS |
| 3 | Tanggal fase | F1 1 Des 2026–8 Feb 2027 · F2 9 Feb–10 Mar 2027 · F3 11 Mar–31 Agu 2027 · F4 1 Sep–20 Nov 2027 | PASS |
| 4 | Durasi inklusif / Global Day | 70 (GD 0–69) · 30 (70–99) · 174 (100–273) · 81 (274–354); jumlah 355 | PASS |
| 5 | Sambungan antar fase | F1→F2, F2→F3, F3→F4 tersambung (hari berikutnya); F4 → siklus 21 Nov 2027 tersambung; siklus s/d 2032 (32 segmen, termasuk 29 Feb 2028) tanpa celah/tumpang tindih | PASS |
| 6 | Status per tanggal (Chromium) | 27 & 30 NOV 2026: GD −4/−1, "BELUM DIMULAI", berikutnya Fase 1 · 1 DES: GD 0, Fase 1 hari 1/70, 0% · 8 FEB: hari 70/70, 100% · 9 FEB: Fase 2 hari 1/30 · 31 AGU: Fase 3 174/174 · 1 SEP: Fase 4 hari 1/81 · 20 NOV 2027: Fase 4 81/81 · 21 NOV 2027: Siklus 1 | PASS |
| 7 | Profil akun Barongsukma (teks tampil, 27 NOV & 1 DES 2026) | 4 baris fase di "Program Barongsukma di Tahap 1" benar (tanggal, BB, TB); "DAY 0→354"; "1 DES 2026 sampai 20 NOV 2027"; "55→85kg"; 0 teks lama (21 NOV 2026 DAY 0, DAY 0→364, 57→85, 54 → 75, 15 MAR/30 SEP/1 OKT 2027, 7 FEB/14 MAR 2027) | PASS |
| 8 | Tanggal lain tidak bergeser | `mcfaSelfCheck()` kosong di 9 tanggal; `MCFA_TUGAS_AWAL.selfCheck()` kosong; Workout/Running DAY = 0/0 pada 30 NOV, 1/1 pada 1 DES, 71/71 pada 9 FEB 2027; Tahap 1 tetap 21 NOV 2026 – 20 NOV 2027 (365 hari) | PASS |
| 9 | Halaman Aktivitas (29 NOV 2026) | Urutan bagian 1–8 + 30 NOV benar (juga di blok pengulangan); 337 item (163 + 163 + 11) | PASS |
| 10 | Checklist (tugas Running `s1.a04`, sudah di Bagian 4) | Centang → Bagian 4 jadi 1/2, Bagian 1 tetap 0/3; tersimpan di `mcfa_task_awal_day1_v1`; bertahan setelah muat ulang; batal centang → 0/2 dan kunci terhapus; `mcfa_task_awal_day30_v1` tidak tersentuh; kunci uji lain di localStorage tetap ada | PASS |
| 11 | Ekspor JSON → hapus data Tugas Awal → impor | Data kembali identik byte demi byte; 0 galat | PASS |
| 12 | Tata letak 360×800, 390×844, 1280×800 (profil Barongsukma) | 0 px scroll horizontal, 0 ID ganda, 0 gambar rusak, 0 galat JS | PASS |
| 13 | Galat JavaScript pada seluruh uji di atas | 0 `pageerror` | PASS |

**Belum diuji (NOT TESTED):** HP Android sungguhan; Safari/iOS; Firebase/Cloud Sync dan pemulihan cloud (sandbox tanpa internet — jalur cloud tidak diubah oleh perubahan ini); pergantian tengah malam nyata; pembaruan Service Worker pada perangkat yang sudah memasang build lama (cache baru `20261127.5` dibuat saat dibuka online); perangkat dengan `barongPhaseNotified.v1` berisi fase lama (kunci fase `p1`–`p4` tidak berubah, jadi tidak diperkirakan bermasalah, tetapi tidak dicoba).
**Catatan:** milestone "1 YEAR" bergeser ke 1 DES 2027 (lihat CHANGELOG 20261127.5) — perlu konfirmasi pengguna.


## FINALISASI — TAHAP 2: FINAL BUILD (build 20261124.1, 24 NOV 2026)
**Ringkasan: 0 FAIL pada aplikasi, 0 bug baru, 0 perubahan fitur.** Build dinaikkan dari `20261123.7` (versi terakhir yang benar-benar ditemukan di ZIP Tahap 1) menjadi `20261124.1`. Satu-satunya perubahan pada berkas aplikasi adalah nomor versi di 4 berkas (`index.html`, `sw.js`, `assets.json`, `00-data-migration.js`); selebihnya hanya dokumen (README, TESTING, DATABASE, CHANGELOG, BELUM-SELESAI). Seluruh berkas CSS, JavaScript, gambar, ikon, `manifest.json`, dan `atlas_redesign.html` identik byte demi byte dengan build `20261123.7`.

**Metode & batasan (dibaca dulu):**
- Chromium (Playwright 1.63), server statis lokal, zona `Asia/Jakarta`, jam dipalsukan lewat `page.clock`. Setiap uji memakai profil browser baru yang dibuang setelah uji; data uji tidak ditulis ke ZIP dan tidak menyentuh data pengguna (ZIP tidak berisi data pengguna).
- Sandbox tanpa internet: Google Fonts dan gstatic (Firebase) tidak termuat; itu keterbatasan lingkungan, bukan bug (aplikasi berjalan penuh mode lokal).
- Karena kode tidak berubah, hasil Tahap 1 (build `20261123.7`, 0 FAIL) tetap berlaku untuk logika aplikasi. Di Tahap 2 saya TIDAK mengulang seluruh uji alur Tahap 1 (Content Book, Keuangan, ekspor/impor, dsb.); yang diulang di build baru hanya yang berkaitan dengan build dan tampilan (bagian B–D). Yang tidak dijalankan ditandai NOT TESTED.

### A. Kesiapan build dan berkas
| # | Yang diuji | Hasil | Status |
|---|---|---|---|
| A1 | Nomor build seragam: 56 `?v=` di `index.html`, semua `?v=` dan `BUILD` di `sw.js`, `build` di `assets.json`, `BUILD` di `00-data-migration.js`, README | semua `20261124.1`; sisa `20261123.7` di berkas aktif = 0 | PASS |
| A2 | Perbandingan dengan paket Tahap 1 (`diff` seluruh berkas) | dibandingkan SEBELUM dokumen diperbarui: hanya 5 berkas berbeda (4 berkas aplikasi + README); untuk tiap berkas, mengembalikan `20261124.1` → `20261123.7` menghasilkan berkas yang identik dengan aslinya (selisih = hanya nomor versi) | PASS |
| A3 | Sintaks 47 berkas JavaScript (`node --check`), `assets.json` dan `manifest.json` JSON valid | semua lolos | PASS |
| A4 | Rujukan lokal `index.html` (75), berkas di `sw.js` (81), ikon `manifest.json` dan `start_url` | semua ada di disk | PASS |
| A5 | `assets.json`: bytes + md5 16 gambar; semua berkas terdaftar ada di disk; daftar CSS (10) = yang dimuat `index.html`; daftar JS (46) = 45 di `index.html` + `19-cloud-account-sync.js` yang dimuat dinamis oleh `index.html` dengan `?v=20261124.1` (bukan berkas yatim) | sesuai; satu-satunya berkas di disk yang tidak terdaftar adalah `assets.json` sendiri | PASS |

### B. Pembaruan Service Worker dari build lama (profil browser sementara)
Langkah: pasang build `20261123.7` → isi data uji (satu tugas Tugas Awal, satu angka followers) → ganti situs ke build `20261124.1` → muat ulang.
| # | Yang diuji | Hasil | Status |
|---|---|---|---|
| B1 | Build lama terpasang | cache `mcfa-v4-20261123.7-static` | PASS |
| B2 | Setelah pembaruan: cache lama dihapus, hanya satu cache | `mcfa-v4-20261124.1-static` | PASS |
| B3 | Isi cache baru | 82 entri, 0 rujukan `20261123.7` | PASS |
| B4 | Semua JS/CSS yang dimuat halaman setelah pembaruan | 56 sumber, semuanya `?v=20261124.1` | PASS |
| B5 | Data pengguna uji setelah pembaruan | tugas Tugas Awal dan angka followers utuh (aplikasi hanya menambah field normalisasi `subs`/`targets`/`hist` saat memuat data uji yang saya tulis dengan bentuk sederhana); tidak ada kunci hilang | PASS |
| B6 | Service Worker aktif; 0 `pageerror` pada build lama dan baru | sesuai | PASS |
| B7 | Mode offline: muat ulang tanpa jaringan | aplikasi termuat dari cache | PASS |
| B8 | Pada pembaruan, halaman memuat ulang sendiri setelah Service Worker baru mengambil alih (handler `controllerchange` di `12-app-core-intro-canvas.js`) | terlihat sebagai `ERR_ABORTED` pada `reload()` skrip uji; perilaku yang dirancang, bukan galat | PASS (dicatat) |

### C. Tampilan, tanggal, dan galat — 3 layar × 3 tanggal (9 kombinasi)
Layar: Android 360×800, Android 390×844, desktop 1280×800. Tanggal (jam dipalsukan): 30 NOV 2026, 1 DES 2026, 20 NOV 2029. Setiap kombinasi: masuk aplikasi → 5 halaman lewat navigasi bawah.
| # | Yang diuji | Hasil | Status |
|---|---|---|---|
| C1 | Scroll horizontal, ID elemen ganda, gambar rusak (yang terlihat), `pageerror`, permintaan lokal gagal/404 pada 5 halaman | 0 / 0 / 0 / 0 / 0 di 9 kombinasi | PASS |
| C2 | `mcfaSelfCheck()` dan `MCFA_TUGAS_AWAL.selfCheck()` | kosong di 9 kombinasi | PASS |
| C3 | Nomor hari: 21 NOV 2026 = DAY 1 · 29 NOV = 9 · 30 NOV = 10 (= CONTENT DAY 1) · 1 DES = 11 (= HARI 1 rutin) · 20 NOV 2029 = DAY 1.096 (= HARI 1.086) | sesuai di 9 kombinasi | PASS |
| C4 | 30 NOV 2026, kartu Tugas Awal dibuka penuh: 337 checkbox = 163 asli + 163 pengulangan `r30.*` + 11 upload `u30.*`; 0 ID ganda; bagian UPLOAD KONTEN DI SETIAP BRANDING ada | sesuai di 3 layar | PASS |
| C5 | Teks lama di seluruh DOM: "1.094 hari", "63.452", "726 slot", "363 hari", "57 → 77", "75 → 110", "DAY 1–2" | 0 temuan (daftar pola ini pendek; ini bukan sapuan penuh seluruh teks) | PASS |
| C6 | Tombol roda gigi melayang menutupi sebagian angka pada layar 360 px (temuan kosmetik Tahap 1, 6.7) | tidak diubah (elemen mengambang biasa, tidak merusak fungsi) | PASS (dicatat) |

### D. Belum dapat diuji (NOT TESTED)
| # | Yang | Alasan | Status |
|---|---|---|---|
| D1 | HP Android sungguhan, Safari/iOS | hanya emulasi Chromium | NOT TESTED |
| D2 | Firebase / Cloud Sync sungguhan, pemulihan Cloud | sandbox tanpa internet | NOT TESTED |
| D3 | Pergantian tengah malam nyata (jam berjalan melewati 00:00) | jam hanya dipalsukan pada waktu tetap | NOT TESTED |
| D4 | Impor cadangan ke perangkat yang SUDAH berisi data berbeda | tidak diuji | NOT TESTED |
| D5 | Alur Content Book → Terbit untuk 9 akun selain Barongsukma lewat UI; menghapus pemasukan → pencapaian turun (sengaja) | tidak diulang di Tahap 2 (Tahap 4 Pembaruan Final menguji 10 akun lewat penyimpanan + fungsi sinkron) | NOT TESTED |
| D6 | Geser (swipe) antar-halaman, tab Studio satu per satu, overlay Content Book dan modal Official History pada build `20261124.1` | tidak dibuka satu per satu di Tahap 2 (Official History diuji di Tahap 1 pada build `20261123.7`) | NOT TESTED |
| D7 | Penggantian build pada perangkat nyata yang sudah memasang `20261123.7` | hanya diuji di Chromium (bagian B) | NOT TESTED |

### Bug, perbaikan, pengujian ulang
- Bug aplikasi ditemukan: **tidak ada** (0 FAIL). Perbaikan kode: **tidak ada** (aturan "jangan mengubah fitur yang sudah benar").
- Kesalahan di skrip UJI saya sendiri (bukan di aplikasi), diperbaiki lalu diulang sampai lulus: (a) uji pembaruan awalnya 4 FAIL karena server uji menyajikan berkas versi baru dengan cap waktu yang sama (resolusi 1 detik) dengan versi lama sehingga peramban menerima "304 tidak berubah" — berkas diberi cap waktu baru; (b) skrip tidak menunggu Service Worker baru aktif (kini memanggil `update()` dan menunggu); (c) `reload()` dibatalkan oleh muat ulang otomatis aplikasi (B8) sehingga ditangani; (d) pembacaan versi memakai `performance.getEntriesByType('resource')` yang kosong setelah muat ulang, diganti membaca atribut `src`/`href` di DOM; (e) perbandingan data uji secara string gagal karena aplikasi menambah field normalisasi saat memuat, diganti pemeriksaan isi. Setelah itu 9/9 pemeriksaan bagian B lulus dan 9/9 kombinasi bagian C lulus.

---

## FINALISASI — TAHAP 1: PENGUJIAN MENYELURUH (build 20261123.7, 24 NOV 2026)
**Ringkasan: 0 FAIL, 0 bug baru, 0 perubahan kode.** Build tetap `20261123.7` (build baru dibuat di Tahap 2). Tidak ada berkas aplikasi yang diubah; satu-satunya berkas yang berubah di tahap ini adalah `TESTING.md` ini.

**Metode & batasan (dibaca dulu):**
- Chromium 157 (Playwright 1.63), server statis lokal, zona `Asia/Jakarta`. Jam dipalsukan lewat shim `Date` (waktu tetap berjalan maju) untuk 12 tanggal kunci.
- Setiap uji memakai **profil browser baru yang kosong dan dibuang setelah uji**. Data yang dimasukkan saat uji (satu judul Content Book, 2 transaksi, beberapa centang) hanya ada di profil sementara itu; tidak ada yang ditulis ke ZIP maupun data pengguna. ZIP tidak berisi data pengguna.
- Sandbox tanpa internet: Google Fonts dan gstatic (Firebase) gagal dimuat (`ERR_NAME_NOT_RESOLVED`). Itu keterbatasan lingkungan uji, bukan bug aplikasi; aplikasi tetap berjalan penuh (mode lokal).
- Semua hasil di bawah benar-benar dijalankan. Yang tidak dijalankan ditandai NOT TESTED.

### 1. Tanggal dan kalender
| # | Yang diuji | Hasil | Status |
|---|---|---|---|
| 1.1 | `MCFA_CORE`: lahir 2004-11-21; DAY 1 = 2026-11-21; `tugasAwalEnd` = `contentStart` = 2026-11-30; `dailyActivityStart` = 2026-12-01; akhir = 2029-11-20; zona Asia/Jakarta; umur pada DAY 1 = 22 | sesuai | PASS |
| 1.2 | Nomor DAY: 21 Nov 2026 = 1 · 29 Nov = 9 · 30 Nov = 10 · 1 Des = 11 · 20 Nov 2029 = 1.096 | sesuai | PASS |
| 1.3 | Kegiatan Sehari-hari: 1 Des 2026 = HARI 1; 20 Nov 2029 = HARI 1.086; total 1.086. Posting konten: 30 Nov = CONTENT DAY 1 | sesuai | PASS |
| 1.4 | Tahap 1/2/3 = 365/366/365 hari, tanpa celah; 29 Feb 2028 di Tahap 2; pindah Tahap pada 21 Nov 2027 dan 21 Nov 2028 | sesuai | PASS |
| 1.5 | `mcfaSelfCheck()` pada 12 tanggal (20 Nov 2026, 21 Nov, 29 Nov, 30 Nov, 1 Des 2026, 20 & 21 Nov 2027, 29 Feb 2028, 20 & 21 Nov 2028, 20 & 21 Nov 2029) | kosong di semuanya; 0 galat JS | PASS |
| 1.6 | Teks yang tampil: 21 Nov "DAY 1 dari 1.096 · mulai 10 hari lagi"; 29 Nov "DAY 9"; 30 Nov "DAY 10"; 1 Des "DAY 11"; 20 Nov 2029 "DAY 1.096 · HARI 1.086"; sisa hari 1.096/1.088/1.087/1.086 benar | sesuai | PASS |
| 1.7 | 21 Nov 2029 (sehari setelah akhir): UI dijepit ke 1.096 / 1.086 (API mentah 1.097 hanya dipakai internal) | sesuai | PASS |
| 1.8 | Pergantian tengah malam nyata (mis. 29→30 Nov dengan jam berjalan) | jam diuji sebagai waktu tetap, bukan lintas tengah malam | NOT TESTED |

### 2. Tugas Awal MC Fathul Adzim
| # | Yang diuji | Hasil | Status |
|---|---|---|---|
| 2.1 | 163 tugas asli; jumlah per bagian B1 4 · B2 2 · B3 3 · B4 1 · B5 36 · B6 4 · B7 3 · B8 110; `selfCheck()` | kosong (benar) | PASS |
| 2.2 | Blok 30 NOV: seluruh tugas muncul satu per satu (163 checkbox, bukan ringkasan). Dibandingkan dengan daftar asli: 225 baris (judul bagian, subkategori/grup, tugas) identik, urutan sama; ID `r30.<idAsli>` cocok satu-satu | 0 perbedaan | PASS |
| 2.3 | Setelah seluruh tugas: bagian UPLOAD KONTEN DI SETIAP BRANDING; 11 checklist = 11 akun di `AKUN` (mcfa, fathulmeme, barongsukma, okk, zona, alley, ayla, lol, monkipedia, kpc, cne), tidak ada yang terlewat; total 337 checkbox (163+163+11), 0 ID ganda | sesuai | PASS |
| 2.4 | Penyimpanan terpisah (ketuk sungguhan): centang tugas asli hanya mengubah `mcfa_task_awal_day1_v1`; centang salinan/upload hanya mengubah `mcfa_task_awal_day30_v1`; 0 kunci `mcfa_konten_*` dibuat; Content Book tidak tersentuh | sesuai | PASS |
| 2.5 | Checklist upload terkunci pada 29 Nov (aria-disabled, klik paksa tidak menyimpan apa pun) dan terbuka pada 30 Nov; bertahan setelah reload | sesuai | PASS |
| 2.6 | Tampilan 360 px bagian Upload: teks terbaca, 0 teks terpotong di kartu, 0 overflow | sesuai | PASS |
| 2.7 | Nama/urutan/ID tugas asli dibandingkan dengan versi SEBELUM build 20261123.7 | versi sebelumnya tidak ada di ZIP; hanya dibuktikan konsisten dengan jumlah resmi dan salinan | NOT TESTED |
Catatan desain (bukan bug, sesuai CHANGELOG 20261123.7): 163 salinan tugas di blok 30 Nov bisa dicentang sebelum 30 Nov; hanya checklist upload yang terkunci.

### 3. Program Barong Sukma
| # | Yang diuji | Hasil | Status |
|---|---|---|---|
| 3.1 | Fase 1 Bulking 54→75 kg (21 Nov 2026–7 Feb 2027, 79 hr) · Fase 2 Cutting 75→70 (8 Feb–14 Mar 2027, 35 hr) · Fase 3 Bulking 70→100 (15 Mar–30 Sep 2027, 200 hr) · Fase 4 Cutting 100→85 (1 Okt–20 Nov 2027, 51 hr) | sesuai; tanpa celah; fase 1 mulai di DAY 1, fase 4 berakhir di akhir Tahap 1 | PASS |
| 3.2 | Perpindahan fase pada 7→8 Feb, 14→15 Mar, 1 Okt, 20 Nov 2027 | fase aktif benar di semua tanggal | PASS |
| 3.3 | "TARGET BB" yang tampil di halaman akun Barongsukma pada 30 Nov 2026 / 15 Mar 2027 / 1 Okt 2027 | 54→75 / 70→100 / 100→85 | PASS |
| 3.4 | Teks angka lama (57–77, 77→75, 75→110) | tidak ada di data/tampilan | PASS |
| 3.5 | Riwayat fase | diturunkan dari tanggal (tidak disimpan terpisah), jadi tidak dapat hilang | PASS |

### 4. Integrasi modul
| # | Yang diuji | Hasil | Status |
|---|---|---|---|
| 4.1 | CONTENT BOOK → SIAP UPLOAD: judul baru di akun Barongsukma (ketuk), centang Siap Upload | tepat 1 item `siap` di `mcfa_konten_barongsukma` (0 di 9 akun lain), `cbId` = ID judul, kunci produksi `ba_2026_11_30` | PASS |
| 4.2 | PRODUKSI KONTEN → SUDAH TERBIT (30 Nov): centang di Aktivitas | status `upload`, `doneDate` 30/11/2026, `uploadKey` terisi, tetap 1 item | PASS |
| 4.3 | Sinkron dijalankan 3× + reload | tetap 1 item, tanpa duplikat, riwayat 2 entri | PASS |
| 4.4 | STATISTIK AKUN | konten Barongsukma = 0 saat "Siap Upload", = 1 setelah terbit, tetap 1 setelah sync & reload; akun lain 0 | PASS |
| 4.5 | Checklist upload Tugas Awal (`u30.*`) tidak mengubah status Konten Terbit | `mcfa_konten_*` tidak berubah | PASS |
| 4.6 | 11 akun: foto ada di disk, nama/badge, target Tahap 1: solo branding followers/subs 500.000/1.000.000 + konten 700; Fathul Al-Meme & Dunia Ayla hanya followers/subs (tanpa target konten); MC FATHUL ADZIM, KP.CIHUY, CNE hanya dicatat (tanpa target) | sesuai desain `CAT_DEF`/`FOLLOW_ONLY` | PASS |
| 4.7 | Keuangan (ketuk di tab CATATAN): saldo awal 0 → pemasukan 12 jt = saldo 12 jt → pengeluaran 11 jt = saldo 1 jt; riwayat 2 transaksi; pencapaian 10 jt tetap setelah pengeluaran; semua bertahan setelah reload; `selfCheck` ok | sesuai | PASS |
| 4.8 | Alur konten untuk 9 akun lain; ubah judul/akun/status/arsip | tidak diulang di tahap ini (hanya Barongsukma); riwayat uji 10 akun ada di Tahap 4 di bawah | NOT TESTED |
| 4.9 | Official History (ketuk dari halaman Identitas, 360/390/1280): 8 fase 1/8→8/8, mundur ke awal, Escape menutup; tanggal 21 NOVEMBER 2026 dan 1.096 hari benar | sesuai | PASS |
| 4.10 | Menghapus pemasukan menurunkan pencapaian (sengaja, sinkron dengan basis pemasukan) | tidak diuji di tahap ini | NOT TESTED |

### 5. Penyimpanan dan keamanan data
| # | Yang diuji | Hasil | Status |
|---|---|---|---|
| 5.1 | Pemindaian kode: `localStorage.clear`, `sessionStorage.clear`, `deleteDatabase` | tidak ada; `removeItem` hanya untuk kunci tertentu (daftar PURGE, pemulihan impor/sinkron, kunci tampilan) | PASS |
| 5.2 | Data bertahan setelah muat ulang (Tugas Awal, Content Book, Konten, Keuangan) | bertahan | PASS |
| 5.3 | Ekspor JSON → impor ke profil kosong: `app` MCFA, `schema` 1, `dataSchema` 2; kunci `mcfa_task_awal_day30_v1` dan `mcfa-content-book-v2` ikut; data hasil impor identik dengan berkas; salinan pengaman dibuat | sesuai | PASS |
| 5.4 | Impor berkas rusak (JSON tidak valid) | ditolak dengan pesan; data tidak berubah | PASS |
| 5.5 | Migrasi struktur data dan salinan pengaman dijalankan setiap muat tanpa galat | `selfCheck` kosong, 0 galat JS | PASS |
| 5.6 | Pemulihan Cloud/Firebase, impor ke perangkat yang SUDAH berisi data berbeda | tidak ada internet / tidak diuji | NOT TESTED |
| 5.7 | Penutupan dan pembukaan ulang aplikasi pada perangkat nyata | hanya reload di Chromium | NOT TESTED |

### 6. Tampilan dan bug
| # | Yang diuji | Hasil | Status |
|---|---|---|---|
| 6.1 | 5 halaman (Aktivitas, Identitas, Kehidupan, Karier, Keuangan) lewat navigasi bawah pada **Android 360×800, Android 390×844, desktop 1280×800** | overflow horizontal 0 px, 0 gambar rusak, 0 elemen melewati layar, 0 `pageerror` | PASS |
| 6.2 | Console error | hanya `ERR_NAME_NOT_RESOLVED` (Google Fonts, gstatic) karena sandbox tanpa internet | PASS |
| 6.3 | Request lokal gagal / 404 | 0 | PASS |
| 6.4 | Service Worker: terdaftar, aktif, cache `mcfa-v4-20261123.7-static` berisi 82 entri (59 inti + 23 opsional) | sesuai | PASS |
| 6.5 | Mode offline: reload tanpa jaringan | aplikasi termuat penuh (5 navigasi, kartu Tugas Awal), 0 galat | PASS |
| 6.6 | Konsistensi build: 56 `?v=20261123.7` di `index.html`, `sw.js` (BUILD + 59 rujukan), `assets.json`, `00-data-migration.js`, README sama; 47 berkas JS lolos pemeriksaan sintaks; semua rujukan di `index.html` ada; md5/ukuran 16 gambar cocok; 87 berkas terdaftar = berkas di disk | sesuai | PASS |
| 6.7 | Temuan kosmetik: tombol roda gigi melayang di kanan bawah menutupi sebagian angka "0/1" pada posisi scroll tertentu di layar 360 px | elemen mengambang biasa; tidak merusak fungsi; tidak diubah | PASS (dicatat) |
| 6.8 | Geser (swipe) antar-halaman dan tampilan lebih rinci modul lain (tab Studio satu per satu, overlay Karier) | tidak diuji | NOT TESTED |
| 6.9 | HP Android sungguhan, Safari/iOS, pembaruan Service Worker pada perangkat yang memasang build lama, Firebase sungguhan | tidak diuji | NOT TESTED |

### Bug, perbaikan, pengujian ulang
- Bug ditemukan: **tidak ada** (0 FAIL).
- Perbaikan kode: **tidak ada** (tidak ada bug yang terbukti; aturan "jangan mengubah fitur yang sudah benar").
- Kesalahan di skrip UJI saya sendiri (bukan di aplikasi), diperbaiki lalu diulang sampai lulus: (a) skrip memakai nama fungsi yang salah; (b) uji awal mengetuk aplikasi sebelum layar pembuka ditutup; (c) pembacaan struktur `assets.json` yang salah; (d) uji keuangan belum membuka tab CATATAN; (e) Official History awalnya diuji tanpa masuk ke aplikasi. Semua pengujian ulang lulus.

---


## Build 20261121.3 — Langkah 6 (bug checklist) — hasil uji sebelum/sesudah
Chromium (Playwright). Android 390×844 dengan sentuhan nyata (`tap`) dan desktop 1280×800. Jam 22 NOV 2026.
| Uji | Sebelum | Sesudah |
|---|---|---|
| Pergeseran item selama animasi ketukan (atas/tengah/bawah) | 33–97 px (Android) | **0 px** |
| Lebar kartu saat ditekan | 362 → 353 px | **362 px tetap** |
| Posisi scroll / posisi item / baris berikutnya setelah ketukan | — | tidak berubah |
| Mutasi DOM per ketukan | 84 (blok dibangun ulang) | ~46, seluruhnya pembaruan teks angka; wadah daftar & Produksi Konten tidak dibangun ulang |
| 10 ketukan cepat berselang 60 ms (Android) | 1 ketukan tidak merespons (9 dari 10) | 10 dari 10 |
| 12 ketukan sentuh berselang 40 ms lintas blok: DOM = penyimpanan = penghitung = hero | — | Lulus (14 = 14 = 14 = 14) |
| 6 ketukan sentuh berselang 40 ms pada checkbox Tugas Awal | (handler anti-double-tap menelan) | 6 dari 6 |
| Listener klik checklist: onclick inline / terdaftar | 58 inline | 0 inline / 1× (tetap 1× setelah render ulang & ganti hari) |
| Gagal simpan: status lama, tanpa animasi sukses, pesan tampil, item tidak terkunci | — | Lulus |
| aria/keyboard: role=checkbox, tabindex, Spasi mencentang, Enter membatalkan | — | Lulus |
| `transition-property` baris | `all` | `background-color, border-color` |
| Ganti hari (besok kosong, kembali utuh; tidak bisa sebelum 22 NOV), reload, lintas-tab | — | Lulus |
| Regresi Langkah 1 (tanggal), 2 (Tugas Awal, scroll Android+desktop), 3 (migrasi/backup) | — | Lulus semua |
| Galat JavaScript | — | Tidak ada |
Belum diuji: HP Android sungguhan (hanya emulasi sentuh Chromium), checklist Produksi Konten (Langkah 5), Safari/iOS.

## Build 20261121.2 — Langkah 2 & 3 (Tugas Awal) — hasil uji
Chromium (Playwright), Android 390×844 (sentuh) & desktop 1280×800, jam 21 NOV 2026.
| Uji | Hasil |
|---|---|
| Kartu tepat di atas Kegiatan Sehari-hari; 163 checkbox; jumlah B1 4 · B2 2 · B3 3 · B4 1 · B5 36 · B6 4 · B7 3 · B8.1 8 · B8.2 102 (B8 = 110); `selfCheck()` kosong | Lulus |
| Hitungan Bagian / subkategori / grup independen (mis. 5.2: grup 2/4 & 1/2, subkategori 3/6, Bagian 5 3/36) | Lulus |
| Centang atas/tengah/bawah (B1, 5.2, 5.9, 8.2): `scrollY`, posisi, tinggi baris & baris berikutnya tidak berubah (Android & desktop) | Lulus |
| 12 klik berurutan: DOM = penyimpanan = penghitung; tidak ada status tertukar | Lulus |
| Reload → status tetap; buka/tutup kartu tidak mengubah checklist; tidak menulis kunci `ba_*` | Lulus |
| Gagal simpan (setItem melempar galat): layar tetap seperti semula + 1 pesan, penyimpanan tidak berubah | Lulus |
| Dua tab: centang di tab 2 tampil di tab 1 tanpa duplikasi | Lulus |
| Data rusak → disalin ke karantina, app tetap jalan; bentuk lama → dinormalisasi; migrasi 2× idempoten; data lain (`ba_2026_11_21`, `mcfa_konten_*`) tidak berubah | Lulus |
| Ekspor JSON memuat kunci baru; pola backup lokal & cloud tidak mengecualikannya; pemulihan via `mcfa:data` | Lulus |
| Tanpa overflow horizontal; tanpa `pageerror` | Lulus |
Bug ditemukan & diperbaiki saat uji: normalisasi migrasi awalnya mengubah nilai lama `true` menjadi string kosong sehingga centang lama hilang dari tampilan; kini menjadi '-' (tetap selesai).
Catatan metode: tes memakai scroll otomatis Playwright pada klik jarak jauh; pengukuran valid dilakukan setelah elemen terlihat (posisi sebelum/sesudah klik).
Belum diuji: HP Android sungguhan, Firebase sungguhan, sinkron cloud nyata.

## Build 20261121.1 — Langkah 1 (pemisahan tanggal) — hasil uji
Diuji di Chromium (Playwright) 390×844 dengan jam diatur ke 21 NOV dan 22 NOV 2026 (Asia/Jakarta), tanpa Service Worker, tanpa internet.
| Uji | Hasil |
|---|---|
| `MCFA_CORE`: project 2026-11-21 · studio 2026-11-21 · content 2026-11-22 · dailyActivityStart 2026-11-22 | Lulus |
| Total proyek 1.096 hari; Kegiatan Sehari-hari 1.095 hari; per Tahap 364 + 366 + 365; posting Tahap 1 = 364 hari → 728 slot | Lulus |
| 22 NOV = PROJECT DAY 2 = HARI 1 rutin = DAY 1 posting | Lulus |
| `mcfaSelfCheck()` (termasuk cek baru) | `[]` (tanpa kegagalan) |
| 21 NOV: kalender rutin terbuka di 22 NOV, label "MULAI 1 HARI LAGI", centang ditolak + pesan, `ba_2026_11_21` lama tetap utuh | Lulus |
| 22 NOV: label "HARI 1 dari 1.095 · PROJECT DAY 2", centang tersimpan, penghitung 1/58, progres 1 dari 63.510 | Lulus |
| Galat JavaScript (`pageerror`) | Tidak ada |
Belum diuji: HP Android sungguhan, Firebase sungguhan, rollover tengah malam nyata 21→22 NOV.
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


## Build 20261122.1 — Langkah 4 & 5 (Chromium headless 390×844 sentuh + 1200×800; jam dipalsukan 21 & 22 NOV 2026 Asia/Jakarta)
LULUS (26 pemeriksaan alur + 7 pemeriksaan tanggal, 0 error JS):
- 10 akun tampil; judul tanpa Siap Upload tidak membuat item; Siap Upload → tepat 1 item `status:'siap'`, `productionKey = ba_2026_11_22`; masuk akun yang benar (BARONGSUKMA, CNE), tidak masuk akun lain.
- Produksi Konten: 2 baris; CNE di blok Tambahan (counter 0/1); centang → terbit tercatat sekali (`doneDate`, `uploadKey`, 1 riwayat 'upload'); scrollY tetap (1970→1970); baris yang sama (tidak dibangun ulang); klik ganda cepat → status data = tampilan.
- Siap Upload dimatikan setelah terbit → tetap terbit, tidak ganda; judul diubah → ikut berubah; muat ulang → tetap 1 item/judul; batal terbit → naskah, riwayat tetap; dimatikan lalu dinyalakan lagi → tetap 1 item.
- Lintas tab (2 tab satu konteks): tulis di tab 2 → tepat 1 item di kedua tab; hapus judul belum terbit → item antrean dilepas.
- Daftar akun tanpa `<select>` status & tanpa input manual; judul terbit tampil.
- Tanggal: jam 21 NOV → antrean 22 NOV, penandaan terbit ditolak; `mcfaSelfCheck()` kosong; `projectStart=studioStart=2026-11-21`, `contentStart=dailyActivityStart=2026-11-22`; 22 NOV = PROJECT DAY 2 = HARI 1; 1.096 / 1.095 hari; 63.510 tampil; validasi Tugas Awal 163 OK.
BELUM DIUJI: HP Android sungguhan, Firebase/Cloud Sync sungguhan, pembaruan Service Worker pada perangkat yang sudah memasang build lama, impor berkas cadangan asli yang berisi data Content Book lama, font Google (diblokir saat uji; ada fallback Georgia/system-ui).


## Build 20261122.4 — Tanggal DAY 1 posting & Kegiatan Sehari-hari = 23 NOV 2026 (Chromium headless 390×844 sentuh; jam dipalsukan 22 NOV, 23 NOV 2026 dan 20 NOV 2029 Asia/Jakarta)
Catatan: bagian build sebelumnya di atas (22 NOV = HARI 1, 1.095 hari, 63.510, 364 hari, 728 slot) adalah riwayat dan sudah TIDAK berlaku.
| Pemeriksaan | Hasil |
|---|---|
| `MCFA_CORE`: project 2026-11-21 · studio 2026-11-21 · contentStart 2026-11-23 · dailyActivityStart 2026-11-23 · projectEnd 2029-11-20 | Lulus |
| Total proyek 1.096 hari (tetap); Kegiatan Sehari-hari 1.094 hari; per Tahap 363 + 366 + 365; posting Tahap 1 = 363 hari → 726 slot (target 700/akun tetap) | Lulus |
| 21 NOV = DAY 1 (Tugas Awal); 22 NOV = PROJECT DAY 2, bukan hari rutin/posting (`dailyDayOf`=0, `contentDayOf`=0); 23 NOV = PROJECT DAY 3 = HARI 1 rutin = DAY 1 posting | Lulus |
| Jam 22 NOV: label "HARI 1 dari 1.094 · PROJECT DAY 3 · MULAI 1 HARI LAGI"; klik centang tidak menyimpan apa pun; `ba_2026_11_22` lama tetap utuh (tidak dihitung) | Lulus |
| Jam 23 NOV: "HARI 1 dari 1.094 · PROJECT DAY 3", centang tersimpan di `ba_2026_11_23`, "0 / 63.452 tugas · 1.094 hari rutin", Minggu ke-1 dari 157 (406 tugas) | Lulus |
| Jam 20 NOV 2029: "HARI 1.094 dari 1.094 · PROJECT DAY 1.096 · LAST DAY"; Minggu ke-157 dari 157 = HARI 1.093–1.094 (2 hari, 116 tugas) | Lulus |
| Antrean Produksi Konten yang terjadwal 22 NOV (item antre, belum terbit) otomatis digeser ke 23 NOV, riwayat ditambah 1 catatan, tidak ada duplikat; item yang SUDAH terbit pada 22 NOV tetap di histori (tidak dihitung ke target) | Lulus |
| `mcfaSelfCheck()` kosong, `MCFA_TUGAS_AWAL.selfCheck()` kosong, Tugas Awal = 163 checkbox, validasi `[POSTING]` OK (DAY 1 posting = 23 Nov 2026, PROJECT DAY 3), tanpa error JS | Lulus |
Belum diuji: HP Android sungguhan, Firebase sungguhan, rollover tengah malam nyata 22→23 NOV, Service Worker di perangkat yang sudah memasang build lama.


## Build 20261122.2 – 20261122.3 — Foto akun Content Book, alur Content Book → Produksi → Akun, ID ganda, ketuk cepat (Chromium headless 390×844 sentuh)
| Pemeriksaan | Hasil |
|---|---|
| Foto akun di Content Book: 10/10 termuat (kartu akun, header Daftar Isi, header editor); berkas sama dengan foto akun M.C.F.A PROJECT; gagal muat → disembunyikan | Lulus |
| Alur lewat UI: tombol Content Book di Aktivitas → buat judul "Running Day 1" di BARONGSUKMA → tulis naskah → centang Siap Upload → muncul di Produksi Konten (jadwal valid pertama) | Lulus |
| Sinkron 3× berturut-turut → tetap 1 item per ID naskah (BARONGSUKMA, OKK, CNE PICTURE masing-masing 1) | Lulus |
| Centang di Produksi Konten → `status=upload` di akun yang benar, tampil di KONTEN TERBIT dengan tanggal upload & tombol "Buka naskah"; tanpa dropdown status; posisi scroll tidak bergeser; bertahan setelah reload | Lulus |
| ID duplikat di DOM: 0 pada 7 halaman + Official History (14 SVG, 489 rujukan `url(#…)` semuanya menemukan id tujuan) | Lulus |
| Tugas Awal: 163 checkbox; ketuk cepat 8 item berbeda → 8 tercentang, 8 tersimpan, kartu "8 selesai · 155 belum · 4,9%"; dua ketukan cepat pada satu item tidak menabrakkan data; 8 tetap tersimpan setelah reload; tanpa error JS | Lulus |
Catatan: pada build 20261122.2 saya menemukan `04-core-timeline.js` di salinan kerja sudah berisi `mcfaOhUniq` (perbaikan ID ganda) yang tidak ada di zip yang diunggah dan bukan dari perintah saya; isinya diperiksa, diuji, dan dipertahankan (lihat CHANGELOG 20261122.3).
Belum diuji: HP Android sungguhan, Firebase sungguhan, ekspor→impor cadangan berisi naskah Content Book, dua tab menyunting naskah yang sama, Service Worker di perangkat lama.


## Ekspor → impor cadangan dengan data Content Book (Chromium headless 390×844; jam 23 NOV 2026; dua profil browser terpisah = dua perangkat)
| Pemeriksaan | Hasil |
|---|---|
| Perangkat A: 4 judul (satu favorit, satu arsip, naskah 2 halaman dengan tanda kutip tipografis, baris baru, emoji), 1 konten diterbitkan lewat centang Produksi Konten, 5 Tugas Awal selesai → Ekspor JSON (`mcfa-backup-<tanggal>.json`, schema 1 / dataSchema 2) | Lulus |
| Kunci `mcfa-content-book-v2`, `mcfa_konten_*`, `mcfa_task_awal_day1_v1` ada di berkas ekspor dan isinya SAMA persis dengan aslinya (perbandingan string) | Lulus |
| Perangkat B (kosong) → Impor berkas → reload: tidak ada kunci hilang, semua isi identik dengan perangkat A | Lulus |
| Setelah impor, sinkron Content Book dijalankan 3×: tetap 1 item per judul (BARONGSUKMA = terbit tanggal upload sama; OKK = siap), tidak ada duplikat; judul, akun, favorit, arsip, jumlah halaman, isi naskah utuh; Tugas Awal 5 tetap 5; tanpa error JS | Lulus |
Belum diuji: impor ke perangkat yang sudah berisi data berbeda (kunci sama ditimpa sesuai pesan konfirmasi), Cloud Sync/Firebase sungguhan, HP Android sungguhan.


## Build 20261122.6 — Tugas Awal 21–22 NOV 2026 (Chromium headless; jam 22 & 23 NOV 2026; 360 / 412 / 1280 px)
| Pemeriksaan | Hasil |
|---|---|
| Kartu: "21 NOVEMBER 2026 – 22 NOVEMBER 2026", "DAY 1–2", "22 TAHUN"; 163 checkbox; `mcfaSelfCheck()` & `MCFA_TUGAS_AWAL.selfCheck()` kosong (termasuk 3 uji baru Tugas Awal); tanpa error JS; tanpa scroll horizontal | Lulus |
| Layout chip: 412 px & desktop satu baris; 360 / 320 px dua baris rapi (putus di tanda "–") | Lulus |
| Kegiatan Sehari-hari & posting tetap 23 NOV 2026 (HARI 1 dari 1.094, PROJECT DAY 3); tidak ada tumpang tindih tanggal | Lulus |
Belum diuji: HP Android sungguhan.


## Build 20261122.7 — Kehidupan: panah ruangan renovasi & centang (Chromium sentuh 360 px, CPU 6×/12× lebih lambat)
| Pemeriksaan | Sebelum | Sesudah |
|---|---|---|
| Ketuk panah 6 ruangan berturut-turut (jeda 150 ms) | 3 dari 6 terbuka | **6 dari 6** |
| Ketuk 12 centang berbeda (jeda 100 ms) | 11/12 tercatat | **12/12** |
| Pergeseran isi kartu antara sentuh dan klik | 29–32 px (klik jatuh ke bilah/pembungkus) | **0 px** |
| Scroll berpindah sendiri setelah buka ruangan | +8–9 px | **0** |
| Pembaruan terarah vs render penuh (ringkasan, chip, 6 ruangan, 113 item, biaya) | — | **identik** |
| Tambah lalu hapus pekerjaan | — | item 19→20→19, scrollY tetap |
Catatan: uji ini emulasi (CPU dilambatkan), bukan HP Android asli. Mohon dicoba langsung di HP.

## Build 20261123.1 — TAHAP 1 Pembaruan Final: sistem tanggal (SIMULASI Node `vm`, tanpa browser)
Catatan jujur: lingkungan pengerjaan tidak memiliki Chromium/Playwright dan tanpa jaringan. Yang diuji = logika tanggal `04-core-timeline.js` dijalankan di Node 22 (`vm`, DOM dipalsukan) + `node --check` semua modul yang diubah. TIDAK diuji: tampilan di browser, HP Android sungguhan, Firebase sungguhan, Service Worker di perangkat lama.
| Uji | Hasil |
|---|---|
| 21 NOV 2026 = PROJECT DAY 1; 29 NOV = DAY 9; 30 NOV = DAY 10 = CONTENT DAY 1; 1 DES = DAY 11 = HARI 1 rutin | Lulus |
| Tugas Awal 10 hari inklusif (21–30 NOV), berakhir tepat 1 hari sebelum HARI 1 rutin; 30 NOV `dailyDayOf` = 0, 29 NOV `contentDayOf` = 0 | Lulus |
| Akhir Tahap 1 = 20 NOV 2027; Tahap 2 = 21 NOV 2027 – 20 NOV 2028; Tahap 3 mulai 21 NOV 2028; 20 NOV 2029 = PROJECT DAY 1.096 = HARI 1.086 | Lulus |
| Total rutin 1.086 hari; 58 × 1.086 = 62.988 slot; per Tahap 355 + 366 + 365; posting Tahap 1 = 356 hari (712 slot); sisa hari rutin sebelum mulai = 1.086, pada 20 NOV 2029 = 1 | Lulus |
| `mcfaSelfCheck()` (uji bawaan diperbarui) → kosong; `node --check` 04, 10, 12, 24, 44, 45, 48 → OK | Lulus |

## Build 20261123.2 — TAHAP 2 Barong Sukma (SIMULASI Node `vm`; tanpa browser)
Sama seperti Tahap 1: logika dijalankan di Node (blok `BARONG_PROGRAM` + `_barongAllPhases` + validator), BUKAN diuji di browser/HP/Firebase sungguhan.
| Uji | Hasil |
|---|---|
| BB: F1 54→75, F2 75→70, F3 70→100, F4 100→85 (`bb` = `bbFrom`/`bbTo` = `BARONG_EXPECTED_BB`) | Lulus |
| Tanggal fase, durasi 79/35/200/51, Global Day 0–78 / 79–113 / 114–313 / 314–364, siklus 21 NOV 2027 + `baseKg` 85 tidak berubah, fase + siklus tanpa celah | Lulus |
| Tidak ada string BB lama (57→77, 77→75, 75→110, 110→85) di data program; di kode/HTML tidak ada tempat lain yang menulis angka BB (hanya membaca `p.bb`) | Lulus |
| `_barongValidate()` → "validasi OK"; uji negatif (EXPECTED_BB p4 = 110→85) → validator menolak | Lulus |
Belum diuji: tampilan kartu/riwayat Barong di browser dan HP.

## Build 20261123.3 — TAHAP 3 Kegiatan Sehari-hari (BROWSER SUNGGUHAN: Chromium via Playwright, layar 390×844, jam dipalsukan)
Catatan jujur: kali ini lingkungan pengerjaan punya Chromium + Playwright (tanpa jaringan → Firebase tidak terjangkau, aplikasi berjalan mode lokal). Yang diuji = perilaku di browser desktop-emulasi layar HP. TIDAK diuji: HP Android sungguhan, Firebase/Cloud Sync sungguhan, Service Worker di perangkat yang sudah memasang build lama.
| Uji | Hasil |
|---|---|
| Centang 1 item → 1 kunci tersimpan; harian 1/58, hero 1/58, minggu 1/406, keseluruhan 1/62.988, titik riwayat 2% | Lulus (setelah perbaikan titik riwayat; sebelumnya 100% — bug) |
| Reload → centang bertahan; batal centang → semua angka kembali 0 | Lulus |
| 10 klik cepat pada 10 item → 10 kunci; 2 klik beruntun 1 item → tidak berubah | Lulus |
| Dua tab (penyimpanan sama): tiap tab mencentang item berbeda → 12 kunci, kedua tab menampilkan 12 | Lulus |
| HARI 2 vs HARI 3 tidak tercampur; mundur berhenti di HARI 1 (1 DES 2026) | Lulus |
| 25 NOV 2026 (data lama 23–30 NOV diisi): HARI 1 dibuka di 1 DES, centang diblokir, data lama utuh & tidak dihitung | Lulus |
| 1 DES 2026 = HARI 1 dari 1.086 · PROJECT DAY 11; data lama tetap utuh setelah centang baru | Lulus |
| 20 NOV 2029 = HARI 1.086 dari 1.086 · PROJECT DAY 1.096 · LAST DAY; maju terkunci; 21 NOV 2029 dijepit | Lulus |
| Gagal simpan (setItem melempar) → tampilan tidak berubah + pesan; pulih setelah penyimpanan normal | Lulus |
| Error JavaScript selama semua uji di atas | 0 |

## Build 20261123.6 — TAHAP 8 referensi & tampilan (BROWSER SUNGGUHAN: Chromium via Playwright, 390×844, Asia/Jakarta; tanpa perubahan kode)
Jam dipalsukan: 21 NOV 2026, 30 NOV 2026, 2 DES 2026, 20 NOV 2029. Tiap tanggal: muat → 5 halaman → 11 profil akun → baca seluruh teks DOM.
| Uji | Hasil |
|---|---|
| Teks lama (23/22 NOV 2026, 1.094, 63.452, 1.095 hari, 21–22 NOV, DAY 1–2, 363 hari, 726 slot, angka BB lama) di DOM | 0 temuan pada 4 tanggal |
| Kontrol positif (teks lama disisipkan sengaja) | Terdeteksi |
| Galat JavaScript / ID elemen ganda / scroll horizontal (390 px) | 0 / 0 / 0 px |
| 62.988 slot · 1.086 hari · PROJECT DAY 11 · "1 DESEMBER 2026" · DAY 1 posting 30 NOV 2026 · Tugas Awal DAY 1–10 | Tampil |
| BARONG_PROGRAM 54→75 · 75→70 · 70→100 · 100→85; profil Barongsukma "BB 54 → 75 KG" | Lulus |
| Berkas dirujuk index.html (74) dan terdaftar assets.json (71) | Semua ada di disk |
Belum diuji: overlay Content Book, modal Official History, tab Studio satu per satu; layar desktop pada tahap ini; HP Android sungguhan; Firebase sungguhan.

## Build 20261123.6 — TAHAP 7 perlindungan data lama (SIMULASI NODE, bukan browser; tanpa perubahan kode)
Modul `00-data-migration.js` dimuat apa adanya ke penyimpanan buatan. TIDAK diuji: browser, HP Android sungguhan, Firebase sungguhan, alur impor/ekspor/cloud di UI (hanya dibaca).
| Uji | Hasil |
|---|---|
| ba_* 20 NOV dihapus; 21 NOV, 23 NOV, 30 NOV, 1 DES utuh | Lulus |
| `mcfa_task_awal_day1_v1` (termasuk ID asing) identik; kunci program lama (PURGE) terhapus | Lulus |
| Konten, Content Book, Keuangan, Renovasi, foto, preferensi, Karier, kunci asing: identik | Lulus |
| `mcfa_tahap1_*`: "1200" → 1200, riwayat 2 entri utuh; data normal tidak ditulis ulang | Lulus |
| Salinan pengaman dibuat; versi data = 2; dijalankan ulang → identik (idempoten) | Lulus |
| Langkah merusak data (konten 2 → 0 entri) → validasi gagal → dikembalikan | Lulus |
| Salinan pengaman gagal disimpan → migrasi dibatalkan, data tak berubah | Lulus |
| Data bertanda versi lebih baru → diblokir; data rusak → karantina, aslinya utuh | Lulus |
| `restoreSnapshot()` memulihkan isi sebelum migrasi | Lulus |
| `localStorage.clear()` dipanggil | Tidak pernah |
Catatan jujur: percobaan pertama 1 dari 30 gagal karena urutan harness (langkah uji didaftarkan setelah migrasi sempat berjalan, berbeda dari aplikasi nyata), bukan kode aplikasi; harness diperbaiki lalu diulang penuh, 30/30 lulus.

## Build 20261123.6 — TAHAP 6 followers / subscribers / pencapaian (BROWSER SUNGGUHAN: Chromium via Playwright, layar 390×844, jam dipalsukan 2 DES 2026)
Catatan jujur: TIDAK diuji di HP Android sungguhan, Firebase/Cloud Sync sungguhan; gagal simpan disimulasikan (setItem melempar QuotaExceededError). Dua tab = dua halaman pada konteks browser yang sama.
| Uji | Hasil |
|---|---|
| Simpan subscribers lewat form modal akun → modal, Studio, Karier berubah; riwayat tercatat; bertahan setelah reload | Lulus |
| Angka ≥ target → buku pencapaian 'tercapai' (1.050/1.000), agregat Karier 1/6 akun | Lulus |
| Persona (mcfa) & Kolaborasi (kpc): angka dicatat, target 0, tidak ada di buku pencapaian | Lulus |
| Satu angka (12.345 / 4.321 / 9.876) tampil sama di modal akun, Studio, dan profil KP.CIHUY | Lulus |
| Dua tab: tab B menyimpan followers=500, tab A (form basi) menyimpan subscribers=200 | Lulus (setelah perbaikan; sebelumnya GAGAL: followers kembali ke 100) |
| Form tab A diperbarui otomatis saat tab B menyimpan (tanpa ketikan yang sedang diedit) | Lulus |
| Format angka: 1.234 · 1 234 diterima; "1,5" · "12.34" · "abc" ditolak, tidak ada yang tersimpan | Lulus (setelah perbaikan; sebelumnya "1,5" → 15, "12.34" → 1.234) |
| Gagal simpan → penyimpanan identik, pesan gagal, tidak ada sukses palsu | Lulus |
| Regresi Tahap 5 (sinkron transaksional, terbit, gagal simpan) | Lulus |
| Error JavaScript selama semua uji | 0 |
Belum diuji: ekspor/impor/cloud (Tahap 9G), Firebase sungguhan, HP Android sungguhan.

## Build 20261123.5 — TAHAP 5 integrasi aktivitas ⇄ akun ⇄ Studio ⇄ Karier + gagal simpan (BROWSER SUNGGUHAN: Chromium via Playwright, layar 390×844, jam dipalsukan 2 DES 2026 Asia/Jakarta)
Catatan jujur: TIDAK diuji di HP Android sungguhan, Firebase/Cloud Sync sungguhan, dan Service Worker di perangkat lama (Service Worker diblokir saat uji). Kegagalan simpan DISIMULASIKAN dengan membuat `Storage.prototype.setItem` melempar `QuotaExceededError` untuk satu kunci tertentu; bukan penyimpanan penuh sungguhan.
| Uji | Hasil |
|---|---|
| Terbit satu naskah → profil akun (KONTEN DIUNGGAH 1 / 2 · 50%), Sistem Posting, Studio, peta Karier (Total 1 konten) berubah dari SATU catatan; satu-satunya kunci baru `mcfa_career_ach_v1` | Lulus |
| Terbit → sinkron 4× → keadaan identik; akun lain tidak terpengaruh | Lulus |
| Gagal simpan saat terbit → status tetap 'siap', statistik & Karier tidak berubah, pesan gagal tampil | Lulus |
| Batal terbit → akun/Studio turun; buku pencapaian mencatat 'dikoreksi'; terbit lagi → 'tercapai' baru | Lulus |
| Pindah akun SEBELUM terbit, simpan TUJUAN gagal → keadaan sama persis dengan awal; setelah pulih item pindah dengan ID & riwayat sama | Lulus (setelah perbaikan; sebelumnya GAGAL: item hilang dari kedua akun, dibuat ulang dengan ID baru) |
| Pindah akun, simpan SUMBER gagal (tujuan sempat tertulis) → tujuan dipulihkan; setelah pulih tanpa duplikat, ID sama | Lulus |
| Pesan gagal sinkron tampil satu kali per rangkaian kegagalan, bukan pesan "pemulihan tidak penuh" yang salah saat akun tidak pernah berubah | Lulus (setelah perbaikan kecil) |
| Buku pencapaian gagal disimpan → pesan tampil + percobaan ulang otomatis; setelah penyimpanan pulih tercatat, waktunya ≤ waktu terbit (waktu asli dipertahankan) | Lulus (setelah perbaikan; sebelumnya hanya console.warn dan tidak pernah dicoba lagi) |
| Regresi alur Tahap 4 (10 akun, 1 item/akun, ID = cbId, sinkron berulang) | Lulus |
| Error JavaScript selama semua uji | 0 |
Belum diuji (sengaja, tahap berikutnya): Followers/Subscribers (Tahap 6), ekspor/impor/cloud (Tahap 9G), dua tab untuk sinkron Content Book.

## Build 20261123.4 — TAHAP 4 Content Book ⇄ Produksi Konten ⇄ Konten Terbit (BROWSER SUNGGUHAN: Chromium via Playwright, layar 390×844, jam dipalsukan 5 DES 2026)
Catatan jujur: TIDAK diuji di HP Android sungguhan, Firebase/Cloud Sync sungguhan, dan Service Worker di perangkat lama. Naskah uji diisi lewat penyimpanan `mcfa-content-book-v2`; sinkron dan terbit dipicu lewat fungsi aplikasi yang sama dengan tombol UI (`MCFA_CB_SYNC.run`, `_toggleKonten`), centang Siap upload diuji lewat klik UI sungguhan.
| Uji | Hasil |
|---|---|
| 10 naskah (1 per akun) → tiap akun tepat 1 item (cbId, judul, status 'siap', tanggal produksi, akun benar); draf & arsip tidak masuk; tidak ada nyasar | Lulus |
| Sinkron diulang 6× → total tetap 10 | Lulus |
| Terbit → status/tanggal/uploadKey/riwayat; statistik akun, Studio, agregat +1; pencapaian Karier +1 saat target tercapai | Lulus |
| Terbit → sinkron 4× tetap 1 item; tidak muncul di antrean hari berikutnya; hari terbit tampil sebagai Sudah Upload | Lulus |
| Siap Upload off / ganti judul / ganti akun SETELAH terbit → riwayat terbit utuh, tidak ada catatan baru di akun lain | Lulus |
| Ganti judul / pindah akun / Siap Upload off-on / arsip SEBELUM terbit → item sama (ID tetap), tanpa duplikasi | Lulus |
| Duplikat non-terbit di akun yang diproses lebih dulu → dibuang, yang terbit utuh | Lulus (setelah perbaikan; sebelumnya GAGAL: antrean 1) |
| UI editor naskah: DRAF → SIAP UPLOAD → TERBIT, riwayat bertambah, foto akun tampil | Lulus |
| Error JavaScript selama semua uji | 0 |


## Tugas Awal — 30 NOV 2026 (build 20261123.7)
Diuji di Chromium (Playwright, 390 px, Asia/Jakarta, jam dipalsukan):
1. 30 NOV: buka kartu → blok "30 NOVEMBER 2026 — HARI PENGULANGAN" → seluruh 8 bagian, subkategori, grup, dan 163 checklist muncul (262 label identik dengan daftar asli), lalu bagian 9 UPLOAD KONTEN DI SETIAP BRANDING (11 akun dari `AKUN`).
2. `MCFA_TUGAS_AWAL.selfCheck()` = [] ; 337 checkbox (163 asli + 163 pengulangan + 11 upload), 0 `data-id`/`id` ganda.
3. Centang `r30.*`/`u30.*` hanya mengubah `mcfa_task_awal_day30_v1`; centang item asli hanya `mcfa_task_awal_day1_v1`; `mcfa_konten_*`, `mcfa-content-book-*`, `mcfa_tahap1_*` tidak berubah.
4. 29 NOV: checklist upload terkunci (tidak tersimpan), pengulangan tetap bisa dicentang, data day1 lama utuh. 30 NOV: 11/11 upload dapat dicentang.
5. Muat ulang: status bertahan; gagal simpan (setItem melempar galat): status tetap; ketuk cepat 6×: konsisten; data day30 rusak: dikarantina, tanpa galat; 0 px scroll horizontal.
Belum diuji: HP Android sungguhan, Firebase/cloud sungguhan, pembaruan Service Worker di perangkat yang memasang build lama.
