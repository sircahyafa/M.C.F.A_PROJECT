# Status Pekerjaan — build 20261117.8 (Audit akhir; Master Prompt reset 21 NOV 2026)

## SELESAI
- Langkah 1 — Reset bagian Aktivitas (kartu, modul 07/11/46, CSS, hook, data tersimpan, jalur impor/cloud).
- Langkah 2 — Dashboard Tahap Aktivitas (Bibit & Akar → Batang → Pohon).
- Langkah 3 — Satu sistem Tahap 1–3: Tahap 2 dan 3 dihitung otomatis dari akhir tahap sebelumnya (`MCFA_STAGES`).
- Langkah 4 — Kegiatan Sehari-hari: kalender dijepit DAY 1…DAY 1.096, centang diblokir sebelum mulai, progres mingguan + keseluruhan.
- Langkah 5 + 8 — Official History BIBIT BARU, timeline, `MCFA_CORE` bersih dari tanggal program lama.
- Langkah 6 — Audit data lama (kunci localStorage, migrasi, komentar/label sisa).
- Langkah 9–11 — Audit progres, dependensi, versi/cache, pengujian (lihat TESTING.md).

## KEPUTUSAN PENGGUNA (audit akhir 20261117.8) — TIDAK DIUBAH
- Target Keuangan per Tahap = 400 jt / 500 jt / 500 jt (`23-stage-system.js`); dipertahankan. Total wishlist 396.803.816 / 450.000.000 / 425.000.000 dan milestone terakhir 1.271.803.816 tidak diselaraskan.
- Milestone 3–5 tetap mulai 1 JAN 2027.
- Pemulihan Cloud menimpa kunci yang ada di cloud; kunci lokal yang tidak ada di cloud tetap (tidak dihapus).
- Produksi konten (Mulai Produksi/Siap Upload) sebelum DAY 1 diizinkan; hanya centang rutin dan "Sudah Upload" yang diblokir.

## KEPUTUSAN / CATATAN TERBUKA
- Kunci `ba_*` bertanggal sebelum DAY 1 sudah DIHAPUS otomatis (keputusan pengguna); yang mulai DAY 1 dipertahankan.
- Program umur: yang dimaksud "umur 22 tahun" (bukan "22.119"); sudah benar — 22 tahun pada 21 NOV 2026.
- Foto opsional `hero-fase1.jpg` (404, sudah ada sebelumnya) — ilustrasi dipakai bila berkas tidak ada.
- Belum diuji di HP Android sungguhan, Firebase/Cloud Sync sungguhan, dan pembaruan Service Worker di perangkat yang sudah memasang build lama.
- Belum diuji: Firebase sungguhan, HP Android sungguhan, impor dengan berkas cadangan asli (periksa `mcfa_reno_v1`). Lihat TESTING.md.
