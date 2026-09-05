# OJIRKU - Personal Finance Manager

> Aplikasi pencatat keuangan personal *offline-first* dwibahasa (Indonesia & Inggris) dengan proteksi PIN, pengelolaan anggaran, pelacak tujuan tabungan, manajemen utang, dan saran finansial berbasis Google Gemini AI.

---

## Overview

**OJIRKU** (diambil dari kata *ojir*—slang khas Jawa Timur yang berarti "uang") adalah aplikasi manajemen keuangan pribadi yang dirancang dengan filosofi **privasi penuh dan offline-first**. Seluruh data finansial—mulai dari catatan pemasukan, pengeluaran, saldo rekening, anggaran bulanan, hingga sisa utang—disimpan langsung di perangkat pengguna (menggunakan browser IndexedDB atau SQLite/Room pada versi Android). Data tidak dikirim ke server pihak ketiga mana pun, kecuali saat pengguna secara sukarela menekan tombol untuk meminta analisis dan saran keuangan dari Gemini AI.

Aplikasi ini hadir dalam bentuk Progressive Web App (PWA) siap pasang serta memiliki fondasi implementasi native Android (Kotlin & Jetpack Compose) di dalam repositori yang sama.

---

## Problem yang Ingin Diselesaikan

1. **Kekhawatiran Privasi Data Finansial:** Banyak aplikasi pengatur keuangan modern mewajibkan pendaftaran akun berbasis cloud, sinkronisasi email, bahkan menuntut koneksi langsung ke rekening bank. Pengguna yang peduli privasi merasa tidak nyaman mengekspos nominal tabungan dan kebiasaan belanja mereka ke server luar.
2. **Ketergantungan pada Koneksi Internet:** Mencatat transaksi harian (seperti saat membeli kopi di warung atau membayar parkir) sering kali terjadi di lokasi dengan sinyal minim. Aplikasi berbasis cloud kerap gagal atau lambat dibuka.
3. **Ketakutan Menghadapi Utang & Anggaran:** Kebanyakan aplikasi hanya menampilkan daftar transaksi tanpa mengintegrasikan pembayaran cicilan utang secara langsung ke saldo rekening dan anggaran berjalan.
4. **Kurangnya Arahan Finansial:** Data transaksi sering kali hanya menjadi grafik tanpa ada saran konkret yang bisa dimengerti oleh orang awam yang bukan pakar keuangan.

---

## Target User

- **Individu & Freelancer Mandiri:** Membutuhkan pencatatan arus kas harian, alokasi amplop anggaran (*budgeting*), dan pemisahan rekening (misal: Tunai, Rekening Operasional, E-Wallet).
- **Pengguna Sadar Privasi (*Privacy-conscious*):** Menginginkan catatan keuangan yang tetap berada 100% di tangan mereka tanpa akun daring terpusat.
- **Orang yang Sedang Mengelola Utang & Target Tabungan:** Membutuhkan pantauan visual terhadap penurunan utang dan progres tabungan menuju target tertentu.
- **Pengguna di Indonesia:** Menggunakan format mata uang Rupiah (IDR), istilah lokal, dan panduan AI yang memahami konteks pengeluaran sehari-hari di Indonesia.

---

## Core Features (Status Aktual)

- **Dasbor Finansial Real-Time:** Menghitung Kekayaan Bersih (*Net Worth* = Total Saldo Rekening - Sisa Utang), ringkasan pemasukan & pengeluaran bulan berjalan, serta 5 transaksi terkini.
- **Pencatatan Transaksi & Kategori:** Input pemasukan dan pengeluaran dengan tanggal, nominal, akun, kategori, dan catatan deskripsi. Dilengkapi visual *radial progress* dan pembeda warna dinamis.
- **Manajemen Rekening (Accounts):** Mendukung berbagai tipe akun (Tunai, Bank, Kartu Kredit, Investasi, E-Wallet) dengan saldo awal (*initial balance*) dan kalkulasi saldo berjalan otomatis.
- **Amplop Anggaran Bulanan (Budgets):** Penetapan batas pengeluaran per kategori dengan bilah progres visual dan peringatan otomatis jika anggaran terlampaui (*over budget*).
- **Target Tabungan (Goals):** Menentukan target nominal simpanan dengan progres persentase dan tombol cepat untuk menambah nominal tabungan.
- **Modul Utang & Pembayaran Terintegrasi (Debts):** Mencatat daftar utang, pemberi pinjaman, dan tanggal jatuh tempo. Saat mencatat cicilan, sistem secara otomatis memotong saldo rekening terkait dan menambahkan transaksi pengeluaran kategori "Pembayaran Hutang".
- **Laporan Visual (Reports):** Grafik lingkaran (*Pie Chart*) distribusi pengeluaran berdasarkan kategori untuk mengevaluasi pos pengeluaran terbesar.
- **Konsultasi AI "OJIRKU AI" (Gemini):** Menganalisis pola transaksi, anggaran, dan progres target bulanan untuk menghasilkan laporan evaluasi dan saran penghematan dalam bahasa yang ramah.
- **Kunci Keamanan PIN:** Mengunci akses aplikasi menggunakan PIN 4 digit untuk mencegah orang lain mengintip saat meminjam perangkat.
- **Dukungan Dwibahasa (i18n):** Pergantian instan antara Bahasa Indonesia dan Bahasa Inggris.
- **Ekspor Data CSV:** Mengunduh seluruh riwayat transaksi ke dalam file CSV untuk analisis cadangan di spreadsheet.
- **PWA & Offline Ready:** Dapat diinstal ke layar beranda (Add to Home Screen) dan tetap berjalan tanpa internet via Service Worker.

---

## Main User Workflow

1. **Inisialisasi Awal:**
   - Pengguna membuka aplikasi, melihat layar sambutan (*Welcome Screen*), dan mengatur PIN 4 digit untuk keamanan lokal.
   - Sistem secara otomatis mengisi kategori bawaan (makanan, transportasi, tagihan, gaji, dll.) serta akun bawaan (Kas & Rekening Utama) sesuai bahasa pilihan.
2. **Aktivitas Harian:**
   - Masukkan PIN di layar kunci (*PinLockScreen*).
   - Menambah transaksi pengeluaran atau pemasukan melalui tombol cepat (+) di halaman Transaksi.
   - Saldo rekening di Dasbor langsung terbarui secara otomatis.
3. **Pemantauan Berkala:**
   - Melihat halaman Anggaran untuk memastikan pengeluaran kategori tertentu belum melewati batas bulanan.
   - Memeriksa progres Target Tabungan dan menambahkan dana cadangan.
   - Membayar cicilan di halaman Utang yang langsung memotong saldo rekening pembayar.
4. **Evaluasi & Saran AI:**
   - Membuka menu Saran AI, menekan tombol *Analisis Keuangan Saya*, dan membaca ringkasan evaluasi serta rekomendasi perbaikan dari Gemini AI.

---

## How the Application Works

Aplikasi ini menggunakan model **arsitektur client-side murni**:
- **Penyimpanan Lokal (IndexedDB via Dexie.js):** Seluruh data disimpan langsung di browser klien dalam database `ojirkuDB`.
- **Reaktivitas UI:** Menggunakan React 19 dengan TypeScript dan Tailwind CSS. Perubahan data di IndexedDB memicu pembaruan state pada masing-masing view.
- **Koneksi AI Terisolasi:** Pemanggilan API Gemini (`@google/genai`) hanya dilakukan saat pengguna memicu analisis. Payload data dirangkum secara lokal terlebih dahulu (hanya agregat kategori, anggaran, dan deskripsi transaksi bulan berjalan) sebelum dikirimkan ke model `gemini-2.5-flash`.
- **Eksistensi Native Android:** Repositori ini juga memuat modul `/app` berbasis Kotlin & Jetpack Compose dengan SQLite Room yang memiliki skema dan alur logika serupa untuk pengujian di platform Android native.

---

## Technology Stack

| Bagian | Teknologi / Library |
| :--- | :--- |
| **Framework Web** | React 19, TypeScript, Vite 6 |
| **Database Lokal (Web)** | Dexie.js 4 (IndexedDB wrapper) |
| **Styling** | Tailwind CSS (tema Dark Neumorphic / Glassmorphism) |
| **Grafik & Visualisasi** | Recharts 3 (ResponsiveContainer, BarChart, PieChart) |
| **Kecerdasan Buatan (AI)**| `@google/genai` (Model `gemini-2.5-flash`) |
| **Offline & PWA** | Service Worker kustom (`sw.js`), Web App Manifest |
| **Mobile Native (Paralel)**| Android SDK, Kotlin, Jetpack Compose, Room DB, Material 3 |

---

## Current Status

- **Status:** *Functional Prototype* (Prototipe Fungsional Siap Pakai di Klien).
- Seluruh alur pencatatan lokal, kalkulasi saldo, anggaran, utang, PIN lokal, ekspor CSV, dan prompt AI sudah berfungsi tanpa error kompilasi.
- Belum ada backend tersentralisasi (tidak ada akun cloud, otentikasi Google, maupun sinkronisasi lintas perangkat).

---

## Known Limitations

1. **Penyimpanan Hanya di Perangkat Tersebut:** Jika pengguna membersihkan cache/data browser atau berpindah perangkat, data akan hilang kecuali sudah diekspor via CSV.
2. **Proteksi PIN Lokal (Salted SHA-256):** PIN disimpan dengan salt 16-byte dan hash SHA-256 di IndexedDB untuk mencegah pengintipan langsung. PIN ini berfungsi sebagai gerbang akses lokal, namun tidak mengenkripsi file IndexedDB secara menyeluruh (*at-rest*).
3. **Model BYOK (Bring Your Own Key) Gemini:** Fitur ulasan AI menggunakan model BYOK di mana pengguna memasukkan kunci API Gemini pribadi di menu Pengaturan yang disimpan secara eksklusif di `localStorage` peramban. Tanpa kunci, seluruh fungsi pencatatan keuangan tetap berjalan 100% offline.
4. **Transfer Antar Rekening Belum Otomatis:** Belum ada tipe transaksi `TRANSFER` untuk memindahkan saldo dari Bank ke Kas secara langsung tanpa membuat dua catatan (pengeluaran dan pemasukan) manual.
5. **Target Tabungan (Goals) Merupakan Target Virtual:** Fitur *Goals* dirancang sebagai pelacak target visual (*Virtual Savings Target*) dan secara sengaja tidak memotong saldo fisik rekening.

---

## Important Notes for Future Developers

1. **Sinkronisasi Web vs Android:** Repositori ini memuat kode Web (`/components`, `/lib`, `/App.tsx`) dan Android (`/app/src/main/java`). Perubahan logika bisnis di satu sisi perlu diselaraskan manual pada sisi lainnya.
2. **Kategori Default Berdasarkan Bahasa:** Saat pertama kali database dibuat (`onPopulate` di `lib/db.ts`), daftar kategori default dibuat berdasarkan bahasa yang tersimpan di `localStorage`.
3. **Skema Database Dexie:** Skema saat ini berada pada versi 2 (`db.version(2)`). Jika menambahkan relasi atau tabel baru, wajib menaikkan versi skema Dexie agar tidak merusak data pengguna yang sudah ada.
