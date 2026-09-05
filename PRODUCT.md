# Product

## Product Overview

**OJIRKU** adalah aplikasi pencatat dan pengelola keuangan personal yang mengutamakan privasi pengguna (*offline-first personal finance manager*). Aplikasi ini dirancang agar pengguna dapat memegang kendali penuh atas data keuangannya tanpa perlu mendaftarkan akun di server daring, tanpa sinkronisasi otomatis ke rekening bank pihak ketiga, dan tanpa iklan pelacak. Fitur utamanya mencakup pencatatan transaksi multi-rekening, alokasi amplop anggaran (*category budgeting*), pemantauan target tabungan, pelacakan utang dan cicilan terintegrasi, serta evaluasi pola belanja berbasis AI (Google Gemini).

* **Status Implementasi:** *Implemented* pada platform Web (React PWA) dan platform Android native (Jetpack Compose).

---

## Problem Statement

Masyarakat menghadapi tantangan psikologis dan teknis saat mengelola keuangan harian mereka:
1. **Ketidaknyamanan Privasi:** Kebanyakan aplikasi finansial komersial mewajibkan pendaftaran nomor telepon, email, atau mengaitkan API perbankan daring yang rentan kebocoran data.
2. **Ketergantungan Internet yang Merepotkan:** Proses mencatat pengeluaran kecil harian (seperti parkir, jajan kaki lima) sering gagal dicatat karena aplikasi cloud lambat dibuka saat sinyal seluler buruk.
3. **Pemisahan Pengelolaan Utang dari Arus Kas:** Utang sering dicatat terpisah dalam buku catatan manual atau aplikasi terpisah, sehingga pengguna sulit melihat dampak cicilan utang terhadap sisa saldo riil dan kekayaan bersih (*net worth*).
4. **Data Tanpa Solusi:** Melihat angka grafik pengeluaran di akhir bulan sering kali hanya memicu rasa bersalah tanpa memberikan petunjuk nyata tentang bagian mana yang perlu dipangkas.

---

## Target Users

1. **Pengguna Sadar Privasi (*Privacy-conscious Individuals*):** [Implemented / Inferred] Pengguna yang menolak menyimpan data nominal tabungan dan riwayat belanja di cloud publik.
2. **Pengguna Urban & Pekerja Mandiri / Freelancer:** [Inferred] Individu yang memiliki banyak kantong uang (rekening bank operasional, e-wallet, uang tunai fisik) dan ingin memantau total saldo di satu tempat.
3. **Individu yang Sedang Melunasi Utang / Kredit:** [Implemented] Pengguna yang memiliki tanggungan pinjaman/cicilan dan ingin melihat kemajuan pelunasan yang terhubung langsung ke pengurangan saldo.
4. **Masyarakat Pengguna Bahasa Indonesia:** [Implemented] Mengutamakan istilah lokal Indonesia, format mata uang Rupiah, dan konteks budaya belanja Indonesia.

---

## User Needs

- **Rasa Aman (Security & Discretion):** [Implemented] Akses aplikasi terkunci PIN sehingga tidak bisa dibuka saat HP dipinjam teman/keluarga.
- **Kecepatan Pencatatan (Zero Latency):** [Implemented] Aplikasi terbuka instan tanpa menunggu proses *login handshake* atau koneksi internet.
- **Keterhubungan Data (Unified Cash Flow):** [Implemented] Pengeluaran, utang, dan saldo rekening saling terhubung secara otomatis.
- **Konsultasi Tanpa Rasa Dihakimi:** [Implemented] Analisis keuangan otomatis yang santun, objektif, dan memberikan dorongan positif.

---

## Core Use Cases

1. **Mencatat Pengeluaran/Pemasukan Harian:** Memilih akun pembayar, kategori, nominal, dan catatan singkat.
2. **Membayar Cicilan Utang:** Menginput nominal pembayaran utang yang secara otomatis memotong saldo rekening yang dipilih dan mencatat transaksi pengeluaran.
3. **Menetapkan dan Mengontrol Anggaran Bulanan:** Melihat bilah kemajuan pengeluaran per kategori secara visual dan mendapat peringatan saat pengeluaran mendekati atau melebihi batas.
4. **Melacak Progres Target Tabungan:** Menetapkan nominal yang ingin dicapai dan menambahkan tabungan secara bertahap.
5. **Meminta Nasihat Keuangan AI:** Mengirim ringkasan transaksi satu bulan terakhir ke model Gemini untuk mendapatkan tinjauan kebiasaan finansial.
6. **Mengekspor Laporan Transaksi:** Mengunduh berkas CSV untuk keperluan pencadangan lokal atau pembukuan di Excel/Google Sheets.

---

## User Workflows

### 1. Alur Pengguna Baru (*Onboarding Flow*)
- **Status:** *Implemented*
- Pengguna membuka aplikasi -> Melihat *Welcome Screen* -> Menekan tombol Masuk/Daftar -> Memasukkan PIN baru 4 digit -> Konfirmasi PIN -> Sistem melakukan *populate* otomatis kategori bawaan dan rekening default -> Pengguna diarahkan ke Dasbor.

### 2. Alur Pencatatan Transaksi Cepat
- **Status:** *Implemented*
- Dari bilah navigasi, buka menu *Transaksi* -> Tekan tombol bulat tambah (+) -> Pilih Tipe (Pengeluaran/Pemasukan) -> Isi Nominal -> Pilih Kategori -> Pilih Rekening Asal/Tujuan -> Pilih Tanggal -> Isi Deskripsi -> Simpan -> Saldo rekening dan grafik ringkasan langsung terbarui.

### 3. Alur Pembayaran Utang
- **Status:** *Implemented*
- Buka menu *Utang* -> Pilih kartu utang tertentu -> Tekan tombol *Bayar* -> Isi nominal yang dibayarkan dan pilih rekening sumber dana -> Simpan -> Saldo rekening berkurang, total utang berkurang, dan transaksi baru berlabel `Payment for [Nama Utang]` otomatis terbuat.

### 4. Alur Analisis AI
- **Status:** *Implemented*
- Buka menu *Saran AI* -> Tekan tombol *Analisis Keuangan Saya* -> Sistem mengumpulkan data agregat bulan berjalan dari IndexedDB -> Data dikirim ke Gemini API -> Laporan berupa format Markdown dengan rekomendasi praktis ditampilkan di layar.

---

## Functional Requirements

| ID | Kebutuhan Fungsional | Status Aktual | Catatan |
| :--- | :--- | :--- | :--- |
| **FR-01** | Otentikasi lokal berbasis PIN 4 digit | **Implemented** | Disimpan di tabel settings; memblokir navigasi sebelum PIN cocok. |
| **FR-02** | Penggantian PIN lama | **Implemented** | Menghapus PIN saat ini di settings dan mengembalikan pengguna ke layar kunci. |
| **FR-03** | Pencatatan transaksi (Pemasukan & Pengeluaran) | **Implemented** | CRUD lengkap dengan modal popup dan validasi input. |
| **FR-04** | Manajemen Kategori transaksi | **Implemented** | Kategori bawaan otomatis terbuat; pengguna dapat menambah atau menghapus kategori custom. |
| **FR-05** | Manajemen Akun / Rekening | **Implemented** | Mendukung tipe Cash, Bank, Credit Card, Investment, E-Wallet dengan saldo awal. |
| **FR-06** | Kalkulasi Saldo Rekening Dinamis | **Implemented** | Saldo = Saldo Awal + Total Pemasukan - Total Pengeluaran pada akun tersebut. |
| **FR-07** | Kalkulasi Kekayaan Bersih (*Net Worth*) | **Implemented** | Net Worth = Total Saldo Seluruh Rekening - Total Sisa Utang yang belum lunas. |
| **FR-08** | Alokasi Anggaran Bulanan (*Budgets*) | **Implemented** | Penetapan batas nominal per kategori pengeluaran dengan bilah progres persentase. |
| **FR-09** | Peringatan Anggaran Berlebih (*Over-budget*) | **Implemented** | Warna bilah berubah merah dan menampilkan teks selisih nominal lebih. |
| **FR-10** | Target Tabungan (*Financial Goals*) | **Partial** | Pengguna bisa mencatat target dan menambah progres nominal, namun penambahan ini belum memotong saldo rekening nyata. |
| **FR-11** | Manajemen Utang (*Debts*) & Pembayaran | **Implemented** | Pencatatan nama utang, nominal total, kreditur, dan pencatatan pembayaran terhubung ke transaksi. |
| **FR-12** | Laporan Pengeluaran Visual (*Pie Chart*) | **Implemented** | Menampilkan persentase pengeluaran per kategori menggunakan Recharts. |
| **FR-13** | Evaluasi & Saran Finansial AI | **Implemented** | Integrasi dengan Gemini 2.5 Flash menggunakan prompt persona "OJIRKU AI". |
| **FR-14** | Ekspor Berkas CSV | **Implemented** | Mengunduh transaksi dengan format tanggal, deskripsi, tipe, jumlah, kategori, dan akun. |
| **FR-15** | Dukungan Dwibahasa (ID/EN) | **Implemented** | Seluruh label antarmuka memiliki kamus bahasa di `lib/i18n.tsx`. |
| **FR-16** | Kemampuan PWA & Offline Access | **Implemented** | Dilengkapi `sw.js` untuk cache shell aplikasi dan manifest.json. |
| **FR-17** | Transfer Antar Akun Otomatis | **Planned** | Belum ada mekanisme transfer (misal: Tarik Tunai dari Bank ke Kas). |
| **FR-18** | Impor CSV / Pencadangan Database Penuh | **Planned** | Hanya ekspor yang tersedia, fitur impor berkas belum dibuat. |
| **FR-19** | Enkripsi Kriptografis Database Lokal | **Planned** | Data tersimpan dalam format standar IndexedDB / SQLite tanpa enkripsi SQLCipher/AES. |

---

## Business Rules

1. **Kalkulasi Net Worth:**
   $$\text{Net Worth} = \sum(\text{Saldo Rekening Aktif}) - \sum(\text{Total Utang} - \text{Total Pembayaran Utang})$$
2. **Kalkulasi Saldo Berjalan Rekening:**
   $$\text{Saldo Akun} = \text{Saldo Awal} + \sum(\text{Transaksi Masuk Akun}) - \sum(\text{Transaksi Keluar Akun})$$
3. **Pembayaran Utang Mengikat Transaksi Pengeluaran:**
   Setiap kali rekaman `DebtPayment` disimpan:
   - Nilai `amountPaid` pada entitas `Debt` bertambah.
   - Entitas `Transaction` baru bertipe `EXPENSE` dibuat secara otomatis pada tanggal yang sama, menggunakan akun sumber dana yang dipilih, dengan kategori "Pembayaran Hutang".
4. **Penghapusan Data Terkait (Cascading Delete):**
   - Menghapus akun atau kategori yang sudah memiliki riwayat transaksi dicegah melalui pengecekan `getTransactionCountForAccount` / `getTransactionCountForCategory`.
   - Menghapus entitas utang (`Debt`) akan menghapus seluruh riwayat `DebtPayment` terkait di dalam satu transaksi database.
5. **Periode Anggaran Bulanan:**
   Anggaran dihitung berdasarkan transaksi pengeluaran yang terjadi antara tanggal 1 bulan berjalan (pukul 00:00:00) hingga tanggal 1 bulan berikutnya.

---

## Data / Entities

1. **Transaction**
   - Atribut: `id`, `type` (INCOME / EXPENSE), `amount`, `categoryId`, `accountId`, `date`, `description`.
   - Relasi: Merujuk ke `Category.id` dan `Account.id`.
2. **Category**
   - Atribut: `id`, `name`, `type` (INCOME / EXPENSE).
3. **Account**
   - Atribut: `id`, `name`, `type` (Cash / Bank / Credit Card / Investment / E-Wallet), `initialBalance`.
4. **Budget**
   - Atribut: `id`, `categoryId`, `amount`, `period` (monthly / yearly).
5. **Goal**
   - Atribut: `id`, `name`, `targetAmount`, `currentAmount`, `deadline` (opsional).
6. **Debt**
   - Atribut: `id`, `name`, `lender`, `totalAmount`, `amountPaid`, `dueDate` (opsional), `interestRate` (opsional).
7. **DebtPayment**
   - Atribut: `id`, `debtId`, `accountId`, `amount`, `date`.
8. **Setting**
   - Atribut: `key` (primary key string: 'pin', 'language'), `value`.

---

## AI Capabilities

- **Persona:** "OJIRKU AI" — Asisten keuangan pribadi yang ramah, santun, tidak menggurui, dan menggunakan bahasa Indonesia yang mudah dipahami orang awam.
- **Model:** `gemini-2.5-flash` via `@google/genai` (Web) dan OkHttp REST endpoint (Android).
- **Data Konteks yang Dikirim:**
  - Daftar target tabungan (nama, target, capaian).
  - Batas anggaran bulanan per kategori.
  - Ringkasan transaksi satu bulan terakhir (tipe, nominal, kategori, tanggal, deskripsi).
- **Format Output:** Markdown (dengan parser kustom di web untuk menampilkan judul, poin list, dan teks tebal secara rapi).
- **Ketahanan Offline:** Jika tidak ada jaringan internet atau kunci API belum dipasang, sistem menangkap error secara anggun (*graceful fallback*) dan menampilkan pesan pemberitahuan yang sopan.

---

## Integrations

- **Google Gemini API:** [Implemented] Satu-satunya integrasi eksternal aktif untuk fitur saran finansial.
- **IndexedDB via Dexie.js (Web):** [Implemented] Integrasi penyimpanan klien di browser.
- **SQLite Room (Android):** [Implemented] Integrasi database lokal untuk aplikasi native.
- **Web App Manifest & Service Worker:** [Implemented] Integrasi browser PWA untuk instalasi di homescreen perangkat.

---

## UX Principles

- **Nuansa Visual Gelap Mewah (*Deep Twilight Violet*):** Menggunakan latar gradasi ungu pekat (`#38345E` ke `#1D172E`) dengan kartu bergaya kaca transparan (*glassmorphism / translucent card*). Hal ini mengurangi kelelahan mata saat mencatat keuangan di malam hari.
- **Warna Aksen Semantik:**
  - Hijau / Toska (`#14B8A6`): Pemasukan, saldo positif, progres tabungan sehat.
  - Merah Muda / Merah (`#F472B6` / `#EF4444`): Pengeluaran, utang, status melebihi anggaran (*over-budget*).
  - Kuning / Jingga (`#FACC15` / `#F97316`): Peringatan, batas anggaran, dan tombol aksi penting.
- **Navigasi Bawah (*Bottom Navigation Bar*):** Memudahkan pengoperasian satu tangan pada layar ponsel pintar.
- **Kemudahan Bahasa:** Menghindari terminologi akuntansi rumit (seperti debit/kredit); menggunakan istilah intuitif seperti "Pemasukan", "Pengeluaran", "Kekayaan Bersih", dan "Sisa Utang".

---

## Current Scope

- Aplikasi web PWA yang berdiri sendiri (*standalone client-side*).
- Kode implementasi Android native paralel dalam direktori `/app`.
- Penyimpanan lokal penuh tanpa akun cloud.
- Pencatatan transaksi, dompet/rekening, kategori, anggaran, target tabungan, pelacakan utang, dan konsultasi AI.

---

## Out of Scope

- Sinkronisasi multi-perangkat via cloud database (Firebase, Supabase, atau backend server).
- Integrasi otomatis dengan mutasi rekening bank (Open Finance / BCA API / Mandiri API).
- Scan struk belanja via kamera (*OCR receipt scanning*).
- Akun bersama / multi-user (misal: keuangan keluarga atau pembagian beban patungan).
- Pengingat notifikasi push berbasis jam (*scheduled push notifications*).

---

## Known Limitations

- Data hilang permanen jika storage browser dibersihkan atau aplikasi Android di-*clear data*, karena belum ada fitur pencadangan otomatis ke Google Drive.
- Fitur Target Tabungan tidak mengurangi saldo rekening riil secara otomatis.
- Tidak ada fitur transfer langsung antar akun internal.

---

## Future Opportunities

1. **Backup & Restore via Google Drive / WebDAV:** Memungkinkan pengguna menyinkronkan berkas database terenkripsi secara pribadi tanpa membutuhkan server backend milik pengembang.
2. **OCR Scan Struk dengan Gemini Vision:** Mengunggah foto nota belanjaan dan mengekstrak nominal, toko, dan barang secara instan ke dalam transaksi.
3. **Peningkatan Fitur Transfer Antar Dompet:** Menambahkan tipe transaksi `TRANSFER` dari Akun A ke Akun B dengan opsional biaya admin.
4. **Pemisahan Tabungan Nyata vs Virtual:** Mengaitkan tabungan impian (*Goals*) ke rekening bank khusus agar saldo terisolasi dengan akurat.
