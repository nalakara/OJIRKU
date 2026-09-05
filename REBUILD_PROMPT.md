# Master Rebuild Prompt: OJIRKU Personal Finance Manager

Gunakan prompt di bawah ini untuk menginstruksikan AI Coding Agent (seperti Google AI Studio, Antigravity, Claude Code, Cursor, atau sejenisnya) jika Anda ingin membangun ulang aplikasi ini dari awal menjadi produk yang matang dan siap rilis.

---

```markdown
Anda adalah Principal Full-Stack Engineer & Product Designer kelas dunia. Tugas Anda adalah membangun aplikasi manajemen keuangan personal bernama "OJIRKU" dari awal.

Ikuti panduan spesifikasi produk, aturan bisnis, arsitektur, dan batasan teknis berikut secara ketat.

---

### 1. Product Purpose & Problem
Banyak pengguna enggan mencatat keuangan di aplikasi komersial modern karena kekhawatiran privasi (data saldo dan riwayat belanja dikirim ke cloud pengembang), keharusan mendaftarkan akun email/nomor ponsel, serta koneksi yang lambat saat berada di area bersinyal lemah.

OJIRKU adalah aplikasi keuangan personal "Offline-First & Privacy-Focused" dwibahasa (Indonesia & Inggris). Seluruh data keuangan pengguna tersimpan 100% di perangkat lokal pengguna tanpa akun cloud. Aplikasi ini dilengkapi proteksi PIN lokal, pelacak multi-rekening, amplop anggaran bulanan, target tabungan, pelacakan cicilan utang terintegrasi, dan asisten finansial cerdas berbasis AI Google Gemini.

---

### 2. Target Users
1. Individu dan pekerja mandiri/freelancer yang mengelola banyak kantong uang (Kas tunai, Rekening Bank, E-Wallet).
2. Pengguna yang sangat mengutamakan privasi dan tidak ingin data saldonya bocor ke server pihak ketiga.
3. Pengguna yang sedang berusaha melunasi utang/pinjaman dan ingin melihat dampak cicilan terhadap kekayaan bersihnya.
4. Masyarakat Indonesia (menggunakan format Rupiah IDR dan istilah keuangan ramah awam).

---

### 3. Core Concept & Philosophy
- **Zero-Cloud Data:** Database berjalan di perangkat pengguna (IndexedDB di web peramban / SQLite di mobile).
- **Zero-Friction Logging:** Aplikasi terbuka seketika tanpa proses handshake internet.
- **Unified Reality:** Pembayaran utang dan pengisian tabungan harus memotong saldo rekening nyata dan tercatat dalam mutasi transaksi, bukan hanya sekadar progres bar visual.
- **Empathetic AI Advisor:** AI bertindak sebagai "OJIRKU AI"—rekan konsultan yang ramah, tidak menghakimi, dan memberikan saran praktis berbahasa Indonesia.

---

### 4. Core Features

1. **Layar Sambutan & Proteksi PIN:**
   - Sambutan onboarding untuk pengguna baru.
   - Pendaftaran dan konfirmasi PIN 4 digit. PIN disimpan secara aman (gunakan hash SHA-256 via Web Crypto API sebelum disimpan ke database).
   - Layar kunci PIN yang memblokir akses tampilan sebelum PIN yang benar dimasukkan.
   - Opsi untuk mengganti PIN di menu Pengaturan.

2. **Dasbor Keuangan (Dashboard):**
   - Kartu metrik utama: **Kekayaan Bersih (Net Worth)** = Total Seluruh Saldo Rekening - Total Sisa Utang yang belum lunas.
   - Metrik sekunder: Total Saldo Aktif dan Total Kewajiban Utang.
   - Ringkasan Arus Kas Bulan Berjalan: Total Pemasukan vs Total Pengeluaran dalam diagram batang sederhana.
   - Daftar 5 transaksi terakhir dengan tombol pintas menuju riwayat penuh.

3. **Manajemen Rekening (Accounts):**
   - Mendukung tipe akun: Kas (Cash), Bank, Kartu Kredit (Credit Card), Investasi (Investment), Dompet Digital (E-Wallet).
   - Pengguna dapat menentukan Saldo Awal (Initial Balance).
   - Saldo berjalan dihitung otomatis dari: `Saldo Awal + Total Pemasukan - Total Pengeluaran +/- Mutasi Transfer`.

4. **Pencatatan Transaksi & Kategori:**
   - 3 Tipe Transaksi: **Pemasukan (Income)**, **Pengeluaran (Expense)**, dan **Transfer Antar Akun (Transfer)**.
   - Form input transaksi: Tanggal, Nominal, Kategori, Rekening Sumber, Rekening Tujuan (khusus transfer), dan Catatan Deskripsi.
   - Riwayat transaksi dilengkapi indikator warna pembeda, badge kategori, dan tombol Edit/Hapus.
   - Manajemen kategori bawaan (otomatis di-seed saat install pertama kali) dan kemampuan menambah kategori kustom.

5. **Amplop Anggaran Bulanan (Budgets):**
   - Menetapkan batas nominal belanja per kategori per bulan.
   - Bilah progres visual pemakaian anggaran.
   - Peringatan warna merah dan keterangan selisih nominal jika pengeluaran melewati batas (*over-budget*).

6. **Target Tabungan (Financial Goals):**
   - Menetapkan nama target tabungan, nominal target, dan target tanggal (opsional).
   - Tombol alokasi tabungan: Saat pengguna menambah tabungan, pengguna harus memilih rekening sumber dana. Sistem otomatis membuat transaksi pengeluaran khusus tabungan dan memotong saldo rekening tersebut.

7. **Modul Utang & Pembayaran Terintegrasi (Debts):**
   - Mencatat nama utang, pemberi pinjaman, total pinjaman, dan tanggal jatuh tempo.
   - Tombol bayar cicilan: Meminta nominal pembayaran dan rekening sumber dana.
   - Secara transaksional memperbarui sisa utang dan otomatis membuat mutasi transaksi pengeluaran kategori "Pembayaran Hutang".

8. **Laporan Visual (Reports):**
   - Diagram Lingkaran (*Pie Chart*) interaktif menampilkan distribusi persentase pengeluaran per kategori pada bulan berjalan.
   - Tabel rincian nominal per pos pengeluaran.

9. **Konsultasi Finansial AI ("OJIRKU AI"):**
   - Mengirimkan ringkasan data finansial bulan berjalan (total pemasukan, total pengeluaran per pos, daftar utang, target tabungan) ke model AI (Google Gemini).
   - Menghasilkan evaluasi kebiasaan belanja, deteksi anomali pengeluaran, serta 3-4 rekomendasi penghematan konkret.
   - Format respon dalam teks Markdown yang rapi dan terstruktur.

10. **Cadangan Data (Backup, Restore, & CSV Export):**
    - Ekspor data transaksi ke file CSV.
    - Ekspor pencadangan penuh seluruh database ke file JSON terenkripsi/terstruktur.
    - Impor file JSON cadangan untuk memulihkan data jika berganti perangkat.

11. **Dukungan Dwibahasa (i18n):**
    - Tombol alih bahasa instan antara Bahasa Indonesia (default) dan Bahasa Inggris.

---

### 5. Data Model Schema (IndexedDB / SQLite)

- **transactions:**
  `id (PK auto)`, `type` ('INCOME' | 'EXPENSE' | 'TRANSFER'), `amount` (number), `categoryId` (FK), `accountId` (FK asal), `toAccountId` (FK tujuan jika transfer), `date` (timestamp), `description` (string)
- **categories:**
  `id (PK auto)`, `name` (string), `type` ('INCOME' | 'EXPENSE')
- **accounts:**
  `id (PK auto)`, `name` (string), `type` ('Cash' | 'Bank' | 'Credit Card' | 'Investment' | 'E-Wallet'), `initialBalance` (number)
- **budgets:**
  `id (PK auto)`, `categoryId` (FK), `amount` (number), `period` ('monthly')
- **goals:**
  `id (PK auto)`, `name` (string), `targetAmount` (number), `currentAmount` (number), `deadline` (timestamp nullable)
- **debts:**
  `id (PK auto)`, `name` (string), `lender` (string), `totalAmount` (number), `amountPaid` (number), `dueDate` (timestamp nullable)
- **debtPayments:**
  `id (PK auto)`, `debtId` (FK), `accountId` (FK), `amount` (number), `date` (timestamp)
- **settings:**
  `key (PK string)`, `value` (any/string)

---

### 6. UX & Visual Direction
- **Tema:** Dark Violet Glassmorphism (*Twilight Theme*).
- **Palet Warna:**
  - Latar Utama: Gradasi gelap elegan `#38345E` menuju `#1D172E`.
  - Kartu Komponen: Putih transparan dengan blur (`bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl`).
  - Aksen Sukses / Pemasukan: Toska Cerah (`#14B8A6`).
  - Aksen Pengeluaran / Utang: Merah Muda / Merah Aksen (`#F472B6` / `#EF4444`).
  - Aksen Interaktif / Peringatan: Kuning / Jingga Emas (`#FACC15` / `#F97316`).
- **Navigasi:** Bilah navigasi bawah (*Bottom Navigation Bar*) tetap (*sticky*) dengan ikon intuitif (Lucide Icons) dan target sentuh minimal 44px ramah jempol.
- **Tipografi & Format:**
  - Font modern tanpa serif (Inter atau Plus Jakarta Sans).
  - Format angka mata uang standar Indonesia: `Rp 1.250.000` (tanpa desimal kaku).

---

### 7. Technical & Architectural Expectations
- **Stack Rekomendasi:**
  - Frontend: React 19 / Vite / TypeScript / Tailwind CSS / Recharts.
  - Database Klien: Dexie.js (IndexedDB) dengan fungsi DAO terisolasi dan transaksi database atomik.
  - Backend Proxy Ringan: Express server sederhana untuk meneruskan request AI ke Google Gemini API agar `GEMINI_API_KEY` aman di sisi server.
- **Offline First & PWA:**
  - Daftarkan Service Worker untuk meng-cache aset statis.
  - Sediakan file `manifest.json` agar aplikasi dapat diinstal (*Add to Home Screen*) di ponsel maupun desktop.
- **Keamanan:**
  - Hashing PIN sebelum simpan di tabel settings.
  - Jangan simpan kunci API sensitif di bundle JavaScript klien.

---

### 8. What NOT to Build (Batasan Ketat)
- JANGAN buat integrasi login cloud (Firebase Auth, Supabase Auth, Google Sign-in). Aplikasi ini adalah alat personal murni.
- JANGAN hubungkan ke API perbankan otomatis (*Open Banking scraping*). Seluruh transaksi adalah input mandiri pengguna.
- JANGAN buat fitur sosial, feed komunitas, atau berbagi pengeluaran antar pengguna (*split bill*).
- JANGAN membuat animasi berat yang memperlambat transisi layar di gawai spesifikasi rendah.

---

### 9. Definition of Done
1. Aplikasi lolos kompilasi TypeScript dan build tanpa error.
2. Pengguna baru dapat membuat PIN, masuk ke aplikasi, dan melihat kategori bawaan terisi otomatis.
3. Menambah pengeluaran langsung mengurangi saldo akun terkait dan menambah pemakaian anggaran kategori.
4. Menambah transaksi transfer memotong saldo akun asal dan menambah saldo akun tujuan.
5. Membayar cicilan utang langsung memotong saldo rekening dan membuat transaksi pengeluaran.
6. Menambah dana tabungan memotong saldo akun yang dipilih.
7. Analisis AI mengembalikan saran praktis dan relevan berdasarkan transaksi nyata pengguna.
8. Ekspor CSV dan fitur Backup/Restore JSON berfungsi dengan valid.
9. Aplikasi dapat dibuka dan digunakan mencatat transaksi saat mode offline (tanpa koneksi internet).
```
