# M.C.F.A PROJECT

Aplikasi pribadi MC FATHUL ADZIM — PWA statis (HTML + CSS + JavaScript, tanpa build step).
Build: `20261117.8`

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
CSS (nomor = urutan cascade):   01-main · 02-layout · 03-components · 04-tahap · 05-polish · 06-avatar-ring · 07-stats-info · 08-kpc-profile   (.css)
JS 00–47 (nomor = urutan muat; 07, 08, 11, 42, 46 tidak dipakai):  00 migrasi data & pembersihan program lama · 01 hemat daya · 02 ikon · 03 tombol kembali · 04 TIMELINE/MCFA_CORE · 05 splash · 06 intro fase
  09 hero · 10 kalender harian · 12 inti aplikasi · 13 navigasi halaman · 14 premium
  15 unggah foto · 16 polish · 17 motion · 18 preferensi efek · 19 akun & sinkron cloud · 20 pencapaian · 21 buku besar · 22 jembatan overlay
  23 sistem Tahap · 24 tahap Aktivitas · 25 tahap Studio · 26 tahap Kehidupan · 27 tahap Karier · 28 tahap Keuangan · 29 jumlah akun
  30 backup JSON lokal · 31 hub akun · 32 peta pertumbuhan · 33 tab keuangan · 34 ringkasan · 35 SFX/ambient · 36 urutan tahap · 37 widget keuangan
  38 kepala tahap · 39 total keuangan · 40 kilau kartu · 41 pergantian hari · 43 jeda saat tersembunyi · 44 statistik & info
  45 profil KP.CIHUY · 47 riwayat pencapaian
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
| **Day 1** (Project, Studio, Konten, Program, Progres) | **21 Nov 2026** |
| **Tahap 1** | 21 Nov 2026 – 20 Nov 2027 (365 hari) |
| **Tahap 2** | 21 Nov 2027 – 20 Nov 2028 (366 hari, memuat 29 Feb 2028) |
| **Tahap 3** | 21 Nov 2028 – 20 Nov 2029 (365 hari) |
| Akhir proyek utama (Day 1.096) | 20 Nov 2029 |

Program persiapan lama (Tugas Awal 15–19 Nov, Persiapan MC Fathul Adzim 20 Nov, Program Adaptasi) sudah dihapus beserta properti tanggalnya (`taskStart`, `taDay*`, `persStart`, `periodInfo`, dsb.). Mengubah tanggal cukup di `MCFA_CORE`; semua halaman membaca dari sana (`data-mcfa-date`, `data-mcfa-days`, `data-mcfa-age`, `data-mcfa-span`). `mcfaSelfCheck()` memeriksa konsistensi tanggal, umur, fase, dan jumlah hari.

## Halaman Aktivitas (susunan)
Hanya satu program: **KEGIATAN SEHARI-HARI** (`#heroHarian`). Di atasnya ada kartu **Tahap 1/2/3** (dibuat `23-stage-system.js`, diisi `24-activity-stage.js`).
Program lama (Tugas Awal 15–19 NOV, Persiapan MC Fathul Adzim 20 NOV, Program Adaptasi) sudah **dihapus** pada reset 21 NOV 2026: markup, CSS, JS, dan data tersimpan. Kunci localStorage lama dibersihkan otomatis oleh `00-data-migration.js` (daftar `PURGE`) pada setiap pemuatan, dan tidak ikut ekspor/impor JSON maupun backup/pemulihan cloud.

## Memperbarui rilis
Setiap berkas CSS/JS dipanggil dengan `?v=<BUILD>`. Saat mengubah file, naikkan nilai build di `index.html` (semua `?v=`), `BUILD` + daftar precache di `sw.js`, `build` di `assets.json`, dan `00-data-migration.js`, agar perangkat memuat versi baru.
