# Sistem Data

_Build 20261124.1: tidak ada perubahan kunci localStorage, bentuk data, atau skema (`MCFA_MIGRATE.SCHEMA` tetap 2) dibanding build 20261123.7; isi dokumen ini berlaku untuk keduanya._

Penyimpanan utama: **localStorage** perangkat. Cloud: **Firebase Auth + Firestore** (koleksi `backups`, 1 dokumen per pengguna, skema cloud = 1, batas aman payload ±950 KB). Tidak ada private key di repositori; konfigurasi web Firebase bersifat publik dan keamanannya bergantung pada Firestore Rules (tidak ada di repositori — lihat TESTING.md).

## Kunci localStorage (hasil pemindaian kode)
| Kunci | Isi |
|---|---|
| `mcfa_konten_<akun>` | daftar konten per akun (status, tanggal, riwayat, `src` penanda asal lama; tidak dipakai lagi) |
| `mcfa_tahap1_<akun>` | followers, subscribers, target, riwayat per akun — SATU-SATUNYA sumber angka aktual (profil, Studio, Karier, hub, buku pencapaian hanya membaca); simpan hanya menulis kolom yang diubah pengguna; angka hanya digit atau pemisah ribuan |
| `mcfa_akun_hub_v1` | pemetaan kategori akun |
| `mcfa_kpc_info_v1` | catatan isian sendiri profil KP.CIHUY: `{notes:{kunci:teks}, upd:{kunci:ISO}}` (maks 1.200 karakter per kartu) |
| `ba_*` | checklist Kegiatan Sehari-hari (program rutin, HARI 1 = 1 Des 2026; kunci 21–30 Nov 2026 yang sudah ada tetap disimpan tetapi tidak dihitung; kunci bertanggal SEBELUM 21 Nov 2026 dihapus otomatis, keputusan pengguna 17 Nov dan 23 Nov 2026) |
| `mcfa_task_awal_day1_v1` | TUGAS AWAL MC FATHUL ADZIM (program satu kali, 21–30 Nov 2026 = DAY 1–10): `{v:1, upd:ISO, items:{<idTugas>:<ISO waktu selesai | '-'>}}` — hanya tugas yang selesai disimpan. 163 ID permanen (mis. `s1.a01`, `s5.2.b02`, `s8.2.okk.b03`); ID tak dikenal dipertahankan. Terpisah total dari `ba_*`; ikut backup JSON, impor, dan cloud; tidak cocok dengan pola PURGE `mcfa_tugasAwal_*` |
| `mcfa_task_awal_day30_v1` | TUGAS AWAL — hari pengulangan **30 NOV 2026** (bentuk sama dengan `mcfa_task_awal_day1_v1`: `{v:1, upd:ISO, items:{<id>:<ISO waktu centang | '-'>}}`). ID: `r30.<idTugasAsli>` (163 salinan tugas, mis. `r30.s5.2.a03`) dan `u30.<idAkun>` (11 checklist UPLOAD KONTEN DI SETIAP BRANDING, satu per kunci `AKUN`: mcfa, fathulmeme, barongsukma, okk, zona, alley, ayla, lol, monkipedia, kpc, cne). TERPISAH total dari `mcfa_task_awal_day1_v1` dan dari Content Book / `mcfa_konten_*`: mencentang di sini tidak mengubah keduanya. Centang `u30.*` hanya mencatat pelaksanaan tugas (terkunci sebelum `contentStart` = 30 NOV 2026); status konten terbit tetap dari `mcfa_konten_<akun>`. Ikut backup JSON, impor, dan cloud |
| `fin_ledger_v1`, `fin_milestones_v1`, `mcfa_usd_rate_v1` | Keuangan: transaksi/saldo, pencapaian, kurs |
| `mcfa_reno_v1` | renovasi studio |
| `mcfa_person_*`, `avatar_*` | foto & data personal |
| `mcfa_fx`, `mcfa_fx_prefs_v1`, `mcfa_sfx`, `fathul_light_v1`, `mcfa_pwa_dismissed`, `oh*` | preferensi tampilan/suara |
| `mcfa_cloud_seen`, `mcfa_pre_import_snapshot` | penanda sinkron & salinan pengaman (tidak ikut ekspor/cloud) |
| `mcfa_career_ach_v1` | riwayat pencapaian Karier: `{v:1, items:{"akun|metrik|tahap":{id,m,n,events:[{t,type:'tercapai'\|'dikoreksi',value,target,src}]}}}` (append-only; ikut ekspor/cloud) |
| `mcfa_data_version_v1` | versi struktur data (lokal perangkat; tidak ikut ekspor/cloud) |
| `mcfa_pre_migration_snapshot_v1` | salinan pengaman sebelum migrasi (lokal; tidak ikut ekspor/cloud) |
| `mcfa_quarantine_v1` | salinan data rusak `[{k, why, at, raw}]` (lokal; aslinya tidak diubah) |


## Kunci yang DIHAPUS (reset 21 NOV 2026)
`mcfa_tugasAwalHarian_v1` (+ `_prev_v*`), `mcfa_tugasAwal_*` (arsip v4/v5/v6, rusak_v5), `mcfa_persiapan_v1`, `mcfa_adp*` (Program Adaptasi, log jadwal konten), `mcfa_backup_pre_adaptasi_v1`.
Juga dihapus: `ba_YYYY_M_D` bertanggal SEBELUM DAY 1 proyek (21 Nov 2026; batas = `MCFA_CORE.projectStart`).
Dihapus otomatis di setiap pemuatan (`MCFA_MIGRATE.purge`); tidak diekspor, tidak diimpor, tidak ikut cloud. Kunci lain (Studio, Kehidupan, Karier, Keuangan, `ba_*` mulai 21 Nov 2026, preferensi) tidak disentuh.

## Hubungan data
Aktivitas (Kegiatan Sehari-hari) → `mcfa_konten_<akun>` (status "Siap Upload") → centang "Sudah Diupload" (≥ 30 Nov 2026 = DAY 1 posting) → `MCFA_STUDIO.actual()` → Karier & Dashboard. Statistik membaca satu sumber (`MCFA_STUDIO`); tidak ada angka tertulis terpisah.

## Versi struktur data
`MCFA_MIGRATE.SCHEMA = 2`. v1 = struktur sampai build 20261109.13 (tanpa penanda). v2 = penanda versi + normalisasi `mcfa_tahap1_*` + `mcfa_career_ach_v1` + karantina. Migrasi berjalan hanya bila ada pekerjaan, selalu didahului salinan pengaman dan divalidasi sesudahnya (gagal → dikembalikan). Satu-satunya penghapusan: daftar `PURGE` di atas (program lama yang dihentikan). Detail: `00-data-migration.js` dan CHANGELOG 20261109.14.

## Backup, migrasi, konflik
- Ekspor/Impor JSON (`{app:'MCFA', schema:1, dataSchema:2, data:{…}}`; `dataSchema` lebih baru dari aplikasi → ditolak, tanpa `dataSchema` = cadangan lama, diterima) dengan validasi struktur dan salinan pengaman otomatis sebelum menimpa.
- Cloud: pemulihan juga membuat salinan pengaman; backup otomatis tidak menimpa cloud yang lebih baru dari yang terakhir dilihat perangkat.
- Migrasi `_getKonten` menambah field baru tanpa menghapus data lama. Rilis 20261117.3 hanya menghapus kunci program lama (lihat di atas).

## Aturan tulis lintas-tab (build 20261110.8)
Modul yang menyimpan seluruh objek (Kegiatan Harian, Kehidupan, Buku Keuangan, Milestone, Akun Hub) WAJIB membaca ulang penyimpanan sebelum mengubah & menulis, lalu menyelaraskan tampilan lewat event `storage`. Penghapusan nilai pada objek yang digabung memakai `null` (bukan `delete`) — contoh: `mcfa_akun_hub_v1.group[akun] = null` = kembali ke kategori bawaan.


## Content Book (build 20261122.1)
- `mcfa-content-book-v2` (aktif; ikut backup JSON & cloud): `{accounts[10], titles[{id,acc,num,name,created,ready,fav,arc,pages[{id,t}]}], log[], seq{}, set{}}`. `mcfa-content-book-v2-bak` = salinan pengaman lokal (tidak ikut cloud/ekspor). `mcfa-content-book-v1` dibaca sekali bila v2 belum ada.
- `mcfa_konten_<akun>`: item konten bertaut punya tambahan `cbId` (ID judul Content Book), `cbAcc` (acc1..acc10), `src:'cb'`. Status: `siap` (antre produksi) → `upload` (terbit; `done`, `doneDate`, `uploadKey`). `belum` + `productionKey:''` = dikeluarkan dari antrean (Siap Upload dimatikan). Item lama tanpa `cbId` tidak diubah.
- Pemetaan: acc1..acc10 → barongsukma, okk, zona, alley, lol, monkipedia, ayla, kpc, cne, fathulmeme.
