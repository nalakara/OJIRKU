# Product Review

## Current Maturity

**Status: Functional Prototype**

### Alasan Penilaian
Aplikasi ini sudah melampaui tahap *Mockup / Static Prototype* karena seluruh fungsi intinya benar-benar bekerja: pengguna dapat mencatat transaksi nyata, saldo rekening terhitung dengan akurat, utang berkurang saat dibayar, anggaran memberi peringatan saat bocor, data tersimpan secara persisten di IndexedDB, ekspor CSV berfungsi, dan integrasi AI Gemini dapat mengembalikan saran analisis.

Namun, aplikasi ini **belum dapat dikategorikan sebagai MVP matang atau Production Ready**, karena beberapa faktor kritis:
1. Keamanan PIN masih bersifat kosmetik (tersimpan dalam bentuk *plaintext* tanpa enkripsi).
2. Kunci API Gemini dipanggil langsung dari peramban web klien (`process.env.API_KEY`), yang berisiko jika di-hosting secara publik.
3. Ketiadaan fitur *data recovery / import*—jika pengguna berganti gawai atau data peramban terhapus, data tidak dapat dikembalikan.
4. Fitur tabungan (*Goals*) masih bersifat nominal virtual terisolasi yang belum memotong saldo rekening nyata.

---

## What Works Well

1. **Kecepatan & Kinerja Offline:** Tidak ada latensi jaringan saat mencatat pemasukan atau pengeluaran. Aplikasi terbuka seketika dan data langsung tersimpan.
2. **Keterpaduan Transaksional Utang (*Debts Module*):** Logika di mana pembayaran cicilan utang secara otomatis memotong saldo rekening dan mencatat pengeluaran adalah sentuhan integrasi yang sangat baik dan jarang ditemukan pada aplikasi buatan prototype awal.
3. **Pemberian Kategori Bawaan Cerdas (*Contextual Seeding*):** Inisialisasi awal membaca bahasa pengguna dan langsung menyediakan kategori yang umum di Indonesia (misal: "Makanan & Minuman", "Gaji", "Tagihan & Utilitas").
4. **Visualisasi yang Bersih:** Diagram lingkaran (*Pie Chart*) pengeluaran dan bilah progres anggaran memberikan umpan balik visual yang cepat tanpa grafik yang berlebihan.
5. **Dukungan Dwibahasa yang Rapi:** Penggantian antara Bahasa Indonesia dan Bahasa Inggris bekerja secara mulus di seluruh komponen antarmuka.

---

## What Is Valuable

1. **Privasi 100% Milik Pengguna:** Di era di mana data finansial sering dijadikan komoditas analitik perbankan, model penyimpanan lokal (*local-only*) ini memiliki nilai jual emosional dan etis yang sangat kuat bagi pengguna yang peduli privasi.
2. **AI sebagai Penasihat yang Menenangkan:** Implementasi prompt Gemini yang memposisikan AI sebagai rekan ramah non-teknis berhasil mengubah kumpulan data transaksi kering menjadi saran perbaikan yang mudah ditindaklanjuti.
3. **Arsitektur Dual-Platform:** Keberadaan kode native Android di `/app` yang menyalin fungsionalitas web merupakan aset bernilai tinggi jika pemilik produk ingin langsung menerbitkan aplikasi ke Google Play Store.

---

## UX Issues

1. **Tidak Ada Navigasi Riwayat (*No Browser History Support*):** Karena navigasi menggunakan state lokal React (`activePage`), menekan tombol kembali (*Back button*) pada peramban web atau gawai akan keluar dari aplikasi alih-alih kembali ke halaman sebelumnya.
2. **Kurangnya Konfirmasi Sebelum Aksi Tambah Cepat Tabungan:** Pada halaman *Goals*, menekan tombol tambah nominal langsung memperbarui nilai tanpa modal konfirmasi atau pemilihan akun sumber dana.
3. **Tidak Ada Ringkasan Transaksi di Halaman Rekening:** Di menu Pengaturan (*AccountManager*), pengguna hanya bisa melihat nama akun dan saldo awal, tetapi tidak bisa mengeklik akun tersebut untuk memfilter mutasi transaksi akun tersebut.
4. **Parser Markdown Sederhana:** Tampilan teks saran AI menggunakan parser kustom regex yang terkadang kurang rapi saat menangani format tabel atau kutipan bersarang (*nested blockquotes*).

---

## Product Issues

1. **Anomali Fitur Target Tabungan (*Goals*):** Uang yang dialokasikan ke "Target Tabungan" tidak memotong saldo akun manapun. Akibatnya, pengguna bisa mengira tabungan impiannya sudah terkumpul padahal saldo uang di rekening banknya sudah habis terpakai untuk pos lain.
2. **Tidak Ada Fitur Transfer Antar Rekening:** Tidak ada cara langsung untuk memindahkan uang dari Rekening Bank ke Dompet Tunai tanpa harus membuat dua transaksi manual (Pengeluaran di Bank + Pemasukan di Tunai).
3. **Ekspor Hanya Satu Arah (Tanpa Impor):** Pengguna bisa mengekspor CSV, tetapi tidak disediakan fitur *Import CSV / JSON* untuk memulihkan data jika aplikasi dibuka di perangkat baru.

---

## Technical Issues

1. **PIN Disimpan Tanpa Enkripsi (*Plaintext*):** Kunci keamanan lokal disimpan apa adanya di IndexedDB (`key: 'pin'`). Siapa saja yang mengerti inspeksi browser dapat melihat PIN dengan mudah.
2. **Panggilan AI di Sisi Klien:** Pemanggilan SDK `@google/genai` dilakukan langsung di peramban web klien. Jika aplikasi di-host di domain publik, kunci API Gemini terekspos dalam bundel runtime JavaScript.
3. **Dua Sumber Kebenaran Kode (*Dual-Codebase Drift*):** Keberadaan kode Web dan Android dalam satu repositori yang sama tanpa pustaka bersama (*shared multiplatform library*) membuat pemeliharaan menjadi berlipat ganda.

---

## Technical Debt

1. **Agregasi Data di Memori:** Perhitungan saldo (`getAccountBalance`) dan pengelompokan laporan memuat seluruh baris transaksi dari IndexedDB ke dalam memori peramban. Jika transaksi mencapai ribuan, hal ini dapat memperlambat performa render.
2. **Ketiadaan Test Suite:** Belum ada pengujian otomatis unit maupun integrasi untuk memvalidasi rumus-rumus kalkulasi keuangan yang krusial.
3. **Pemberian Tipe Any pada Sejumlah Event Handler:** Pada `Settings.tsx` dan beberapa formulir, terdapat penggunaan `(installPrompt as any)` dan `value: any` yang mengurangi ketatnya pemeriksaan TypeScript.

---

## Missing Functionality

- Tipe transaksi `TRANSFER` antar rekening.
- Impor data cadangan (format JSON atau CSV).
- Filter pencarian dan rentang tanggal kustom pada halaman Transaksi.
- Pengaturan mata uang selain Rupiah (misal: USD, EUR, dsb.) secara dinamis.
- Pemisahan tabungan target dari saldo operasional.

---

## Risks

1. **Risiko Kehilangan Data Total:** Karena penyimpanan bersifat lokal tanpa akun cadangan daring, jika pengguna menghapus riwayat peramban atau ponsel rusak, seluruh catatan keuangan hilang selamanya.
2. **Risiko Kebocoran Kuota Kunci API:** Penggunaan kunci API Gemini secara langsung di klien dapat disalahgunakan jika aplikasi dibagikan secara publik.

---

## What Should Be Preserved

1. **Prinsip Dasar Offline-First:** Jangan pernah memaksakan login email atau server cloud terpusat yang mewajibkan internet untuk mencatat transaksi harian.
2. **Keterpaduan Modul Utang:** Mekanisme pembayaran utang yang memotong saldo dan mencatat transaksi pengeluaran harus tetap dipertahankan sebagai fitur unggulan.
3. **Palet Desain Dark Twilight Violet:** Kombinasi warna ungu pekat dan kartu kaca transparan memberikan kesan eksklusif dan nyaman di mata pengguna.
4. **Persona Konsultasi "OJIRKU AI":** Nada bicara asisten keuangan yang santun, memotivasi, dan berbahasa Indonesia sangat cocok dengan target demografi pengguna.

---

## What Should Be Changed

1. **Pindahkan Panggilan AI ke Server Proxy / Backend Ringan:** Buat rute server sederhana (misal: Express API `/api/advice`) untuk melindungi kunci API Gemini.
2. **Perbaiki Alur Tabungan (*Goals*):** Saat menambah nominal ke target tabungan, wajibkan pengguna memilih akun asal dan potong saldo akun tersebut melalui mutasi transaksi.
3. **Tambahkan Fitur Impor / Pemulihan Data:** Sediakan tombol *Import Backup* agar pengguna dapat mengembalikan data dari berkas cadangan lokal.
4. **Hashing PIN:** Hash PIN pengguna (misalnya menggunakan SHA-256 via Web Crypto API) sebelum disimpan ke IndexedDB.

---

## What Should NOT Be Over-Engineered

- **Jangan Menambahkan Open Banking / Scraping Mutasi Bank Otomatis:** Menghubungkan aplikasi ke API perbankan pihak ketiga akan menghancurkan filosofi privasi penuh dan menambah beban biaya pemeliharaan yang tidak sebanding.
- **Jangan Membuat Arsitektur Microservices atau Database Cloud Kompleks:** Aplikasi ini dirancang untuk individu mandiri. Penggunaan database lokal (IndexedDB / SQLite) sudah sangat tepat dan efisien.

---

## Recommended Direction

### Rekomendasi Utama: **POLISH**

### Alasan Objektif:
Aplikasi **OJIRKU** memiliki pondasi produk yang sangat solid dan fungsional. Konsepnya jelas, arsitekturnya bekerja tanpa cela untuk skenario offline-first, dan tampilannya sudah memiliki identitas visual yang khas. 

Aplikasi ini **tidak perlu diarsipkan (Archive)** karena sudah terlalu matang untuk dibuang. Aplikasi ini juga **tidak perlu dibangun ulang total dari nol (Rebuild)** karena kode yang ada saat ini bersih, modular, dan terstruktur dengan baik. 

Langkah yang paling bijak dan efisien adalah **POLISH (Memoles)**, yaitu:
1. Menambahkan fitur transaksi transfer antar akun.
2. Mengamankan pemanggilan API Gemini via endpoint server.
3. Menambahkan fitur impor data cadangan (Backup & Restore).
4. Menghubungkan progres tabungan (*Goals*) dengan pengurangan saldo rekening nyata.

Setelah 4 poin pemolesan tersebut diselesaikan, aplikasi ini akan menjadi produk **MVP Tingkat Tinggi yang sangat siap dipindahkan ke GitHub publik** dan diluncurkan ke pengguna nyata.
