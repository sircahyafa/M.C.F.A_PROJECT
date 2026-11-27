# M.C.F.A PROJECT

Aplikasi pribadi MC FATHUL ADZIM — PWA statis (HTML + CSS + JavaScript, tanpa build step).
Build: `20261127.7` (FINAL — hasil FINALISASI: Tahap 1 pengujian menyeluruh + Tahap 2 final build; hasil uji dan yang belum diuji ada di `TESTING.md` dan `BELUM-SELESAI.md`)

## Menjalankan
- **GitHub Pages:** unggah SEMUA isi ZIP ke **root repository** (jangan unggah file ZIP-nya; semua berkas langsung di root, tanpa folder). Semua path relatif, jadi aman di `https://username.github.io/nama-repository/`.
  Settings → Pages → *Deploy from a branch* → branch `main` → folder `/ (root)`.
- **Lokal:** jalankan server statis di folder ini, mis. `python3 -m http.server 8000`, lalu buka `http://localhost:8000`.
  (Service Worker/PWA hanya aktif lewat `http(s)://`.)
- Aplikasi tidak membutuhkan konfigurasi Netlify atau server khusus.

## Struktur (SEMUA berkas langsung di root — tanpa folder)
Seluruh berkas berada sejajar di satu tingkat. Nomor di depan nama = urutan; `index.html` tetap menentukan urutan MUAT.
```
index.html · atlas_redesign.html · sw.js · manifest.json · assets.json · README.md
CSS (nomor = urutan cascade):   01-main · 02-layout · 03-components · 04-tahap · 05-polish · 06-avatar-ring · 07-stats-info · 08-kpc-profile · 09-tugas-awal · 10-content-book   (.css)
JS 00–50 (nomor = urutan muat; 07, 08, 11, 42, 46 tidak dipakai):  00 migrasi data & pembersihan program lama · 01 hemat daya · 02 ikon · 03 tombol kembali · 04 TIMELINE/MCFA_CORE · 05 splash · 06 intro fase
  09 hero · 10 kalender harian · 12 inti aplikasi · 13 navigasi halaman · 14 premium
  15 unggah foto · 16 polish · 17 motion · 18 preferensi efek · 19 akun & sinkron cloud · 20 pencapaian · 21 buku besar · 22 jembatan overlay
  23 sistem Tahap · 24 tahap Aktivitas · 25 tahap Studio · 26 tahap Kehidupan · 27 tahap Karier · 28 tahap Keuangan · 29 jumlah akun
  30 backup JSON lokal · 31 hub akun · 32 peta pertumbuhan · 33 tab keuangan · 34 ringkasan · 35 SFX/ambient · 36 urutan tahap · 37 widget keuangan
  38 kepala tahap · 39 total keuangan · 40 kilau kartu · 41 pergantian hari · 43 jeda saat tersembunyi · 44 statistik & info
  45 profil KP.CIHUY · 47 riwayat pencapaian · 48 Tugas Awal · 49 Content Book (terintegrasi) · 50 sinkron Content Book → Produksi Konten → Akun
Gambar:  kpc, zona, mcfa, sheina, barongsukma, okk, fathulmeme, ayla, monkipedia, alley, cne, lol (.jpg) · mcfa-studio-logo.jpg
         oh-launch-bg.jpg, oh-launch-cta.png, oh-naskah.png (Official History) · hero-<kunci>.jpg (opsional, foto asli menggantikan ilustrasi)
Ikon:    icon-192/512 (.png .svg) · favicon.svg · apple-touch-icon.png
Dokumen: CHANGELOG.md · TESTING.md · DATABASE.md · BELUM-SELESAI.md
```
**Penting:** jangan mengganti nama berkas. Urutan MUAT JavaScript ditentukan `index.html` dan tidak boleh diubah. Bila menambah/menghapus berkas, perbarui `index.html`, `sw.js`, dan `assets.json`.

## Ketahanan startup (anti macet di logo loading)
- `index.html` memuat *startup guard* inline: splash dijamin tertutup (batas keras 7 detik) walau JS/CSS/Firebase/canvas gagal.
- Bila ada berkas JS/CSS gagal dimuat (mis. tidak ikut terunggah), muncul pesan yang menyebut nama berkasnya + tombol *Muat ulang*.
- Firebase dimuat non-blokir; tanpa internet aplikasi berjalan penuh dalam mode lokal (data tetap di perangkat).
- Animasi canvas (splash & intro) bersifat opsional: kegagalannya tidak menghentikan aplikasi.

## Tanggal resmi (sumber tunggal: `MCFA_CORE` di `04-core-timeline.js`)
| Bagian | Tanggal |
|---|---|
| **Lahir** | 21 Nov 2004 (umur dihitung otomatis; DAY 1 = ulang tahun ke-22) |
| **DAY 1** (M.C.F.A PROJECT, M.C.F.A STUDIO, usia 22 tahun) | **21 Nov 2026** |
| **TUGAS AWAL MC FATHUL ADZIM** (`projectStart` – `tugasAwalEnd`; program satu kali, 163 tugas; **30 Nov 2026 = hari pengulangan**: seluruh 163 tugas muncul lagi + 11 checklist upload konten, penyimpanan terpisah) | **21 Nov 2026 – 30 Nov 2026** = DAY 1–10 (10 hari) |
| **DAY 1 posting konten** (`contentStart`, semua akun Studio) | **30 Nov 2026** = PROJECT DAY 10 = CONTENT DAY 1 (hari terakhir Tugas Awal) |
| **HARI 1 Kegiatan Sehari-hari** (`dailyActivityStart`) | **1 Des 2026** = PROJECT DAY 11 (sebelum itu checklist rutin tidak dapat dicentang; data lama 23–30 Nov tetap tersimpan, tidak dihitung) |
| **WORKOUT DAY 1** (`workoutStart`) dan **RUNNING DAY 1** (`runningStart`, diturunkan dari `workoutStart` sehingga selalu sama) | **1 Des 2026** (= HARI 1 Kegiatan Sehari-hari; Selasa = hari Running). Dibaca lewat `MCFA_WORKOUT.workoutDay(tgl)` / `.runningDay(tgl)` (DAY ke-n; ≤ 0 = belum mulai). Tidak mengubah 30 Nov (hari pengulangan & upload konten) |
| **PROGRAM BARONGSUKMA** (`BARONG_PROGRAM` di `12-app-core-intro-canvas.js`; **Global Day 0 = 1 Des 2026**, tidak pernah reset) | Fase 1 Bulking Teratur **1 Des 2026 – 8 Feb 2027** (70 hari, 55 → 75 KG, TB 171–172) · Fase 2 Cutting Teratur **9 Feb – 10 Mar 2027** (30 hari, 75 → 70, TB 172–173) · Fase 3 Bulking Teratur **11 Mar – 1 Sep 2027** (175 hari, 70 → 100, TB 173–175) · Fase 4 Cutting **2 Sep – 20 Nov 2027** (80 hari, 100 → 85, TB 175); total 355 hari (Global Day 0–354); siklus lanjutan mulai 21 Nov 2027; milestone 1 tahun = 1 Des 2027 |
| **Tahap 1** | 21 Nov 2026 – 20 Nov 2027 (365 hari; posting 356 hari sejak 30 Nov; rutin 355 hari sejak 1 Des) |
| **Tahap 2** | 21 Nov 2027 – 20 Nov 2028 (366 hari, memuat 29 Feb 2028) |
| **Tahap 3** | 21 Nov 2028 – 20 Nov 2029 (365 hari) |
| Akhir proyek utama (Day 1.096 = Hari 1.086 Kegiatan Sehari-hari; 58 tugas × 1.086 = 62.988 slot) | 20 Nov 2029 |

Program persiapan lama (Tugas Awal 15–19 Nov, Persiapan MC Fathul Adzim 20 Nov, Program Adaptasi) sudah dihapus beserta properti tanggalnya (`taskStart`, `taDay*`, `persStart`, `periodInfo`, dsb.). Mengubah tanggal cukup di `MCFA_CORE`; semua halaman membaca dari sana (`data-mcfa-date`, `data-mcfa-days`, `data-mcfa-age`, `data-mcfa-span`). `mcfaSelfCheck()` memeriksa konsistensi tanggal, umur, fase, dan jumlah hari.

## Halaman Aktivitas (susunan)
Dua program yang berdiri sendiri, data dan progresnya terpisah: kartu **TUGAS AWAL MC FATHUL ADZIM** (`#tugasAwalCard`, `48-tugas-awal.js`; 21–30 Nov 2026, 163 tugas; blok "30 NOVEMBER 2026 — HARI PENGULANGAN" di bagian bawah kartu = salinan 163 tugas + UPLOAD KONTEN DI SETIAP BRANDING) lalu **KEGIATAN SEHARI-HARI** (`#heroHarian`; mulai 1 Des 2026, 58 tugas/hari). Kartu **Tahap 1/2/3** dibuat `23-stage-system.js` dan diisi `24-activity-stage.js`. Tugas Awal tidak masuk hitungan Kegiatan Sehari-hari.
Program lama (Tugas Awal 15–19 NOV, Persiapan MC Fathul Adzim 20 NOV, Program Adaptasi) sudah **dihapus** pada reset 21 NOV 2026: markup, CSS, JS, dan data tersimpan. Kunci localStorage lama dibersihkan otomatis oleh `00-data-migration.js` (daftar `PURGE`) pada setiap pemuatan, dan tidak ikut ekspor/impor JSON maupun backup/pemulihan cloud.

## Memperbarui rilis
Setiap berkas CSS/JS dipanggil dengan `?v=<BUILD>`. Saat mengubah file, naikkan nilai build di `index.html` (semua `?v=`), `BUILD` + daftar precache di `sw.js`, `build` di `assets.json`, dan `00-data-migration.js`, agar perangkat memuat versi baru.
