# Architecture

## Technology Stack

Aplikasi ini memiliki arsitektur ganda (*dual-codebase*) di dalam satu repositori:
1. **Frontend Web PWA (Primer di AI Studio Web Preview):**
   - Runtime / Bundler: Vite 6 dengan TypeScript 5.8
   - UI Library: React 19.1
   - Penyimpanan Klien: IndexedDB melalui abstraksi Dexie.js 4.0
   - Styling: Tailwind CSS (via CDN/Vite plugin) dengan palet gradasi gelap kustom
   - Data Visualization: Recharts 3.1
   - AI SDK: `@google/genai` 1.11.0
   - Offline Layer: Service Worker manual (`public/sw.js`) dan Web App Manifest (`public/manifest.json`)
2. **Mobile Native Android (Modul Paralel `/app`):**
   - Language: Kotlin 1.9 / 2.0
   - UI Framework: Jetpack Compose dengan Material 3
   - Local DB: Android Room Database (SQLite)
   - Asynchronous: Kotlin Coroutines & StateFlow / Compose State
   - Networking & JSON: OkHttp 4 & Google Gson
   - AI Interaction: Direct REST API call ke Google Generative Language API

---

## Project Structure

```text
/
├── App.tsx                    # Komponen root React, provider, & router halaman
├── index.html                 # Entri HTML utama dengan meta tags PWA
├── index.tsx                  # Mounting point React DOM
├── types.ts                   # Definisi TypeScript interface seluruh entitas data
├── vite.config.ts             # Konfigurasi Vite bundler
├── package.json               # Dependensi web & script kompilasi
├── metadata.json              # Konfigurasi AI Studio & deskripsi aplikasi
├── public/
│   ├── manifest.json          # Konfigurasi Web App Manifest untuk instalasi PWA
│   └── sw.js                  # Service Worker untuk caching asset statis offline
├── lib/
│   ├── auth.tsx               # AuthContext: verifikasi PIN lokal & status login
│   ├── db.ts                  # Inisialisasi Dexie, migrasi skema, & fungsi CRUD
│   ├── i18n.tsx               # I18nContext & kamus terjemahan (ID/EN)
│   └── utils.ts               # Formatter mata uang (Rupiah), kalkulator kategori, palet warna
├── services/
│   └── geminiService.ts       # Integrasi SDK Gemini untuk pembuatan prompt & saran
├── components/
│   ├── Layout.tsx             # Shell antarmuka, header, & bilah navigasi bawah
│   ├── Dashboard.tsx          # Tampilan ringkasan kekayaan bersih, saldo, & grafik bulanan
│   ├── Transactions.tsx       # Riwayat transaksi, formulir tambah/edit, radial progress
│   ├── Budgets.tsx            # Alokasi amplop anggaran bulanan & status persentase
│   ├── Goals.tsx              # Pelacak target tabungan & penambahan progres dana
│   ├── Debts.tsx              # Modul utang & pencatatan cicilan terhubung
│   ├── Reports.tsx            # Diagram lingkaran pengeluaran per kategori (Recharts)
│   ├── AISuggestions.tsx      # Antarmuka konsultasi AI dengan parser kustom Markdown
│   ├── Settings.tsx           # Pengaturan bahasa, ganti PIN, ekspor CSV, manajer kategori
│   ├── AccountManager.tsx     # Manajemen akun/rekening & saldo awal
│   ├── CategoryManager.tsx    # Manajemen kategori pemasukan/pengeluaran
│   ├── PinLockScreen.tsx      # Layar input/setup PIN 4 digit
│   ├── WelcomeScreen.tsx      # Layar sambutan onboarding
│   └── common.tsx             # Komponen UI atomik (Button, Card, Input, Modal, Icon)
└── app/                       # Modul Native Android
    ├── build.gradle.kts       # Konfigurasi Gradle Android (Compose, Room, OkHttp)
    └── src/main/
        ├── AndroidManifest.xml
        └── java/com/ojirku/app/
            ├── MainActivity.kt        # Entri utama Compose & seluruh Composable UI screens
            ├── data/Database.kt       # Room Database, Entity models, & DAO interface
            └── ui/FinanceViewModel.kt # ViewModel terpusat penampung state & logika Room
```

---

## Application Structure

Aplikasi web dirancang dengan pola **Single Page Application (SPA) berbasis Tab**:
- **Router Tanpa URL Hash/History:** Aplikasi tidak menggunakan `react-router-dom`, melainkan sebuah state sederhana `activePage` di dalam `AppContent` (`App.tsx`). Pergantian halaman dilakukan dengan merender komponen yang sesuai dari objek map `pages`.
- **Hierarki Lapisan Provider:**
  ```text
  <I18nProvider>          (Konteks bahasa dan fungsi penerjemahan t())
    <AuthProvider>        (Konteks otentikasi PIN lokal)
      <AppContent>        (Pemeriksa status login & perute halaman)
        <Layout>          (Bilah navigasi & pembungkus halaman aktif)
          <ActivePage />  (Dashboard / Transactions / Budgets / dll.)
  ```

---

## Main Components

1. **`AuthProvider` (`lib/auth.tsx`):**
   - Membaca kunci `pin` dari tabel `settings` IndexedDB saat startup.
   - Mengelola state `isAuthenticated`, `isPinSet`, serta fungsi `login(pin)`, `setPin(pin)`, dan `logout()`.
2. **`PinLockScreen` (`components/PinLockScreen.tsx`):**
   - Menangani alur input PIN 4 digit untuk autentikasi dan alur konfirmasi dua langkah saat pembuatan PIN baru.
3. **`Dashboard` (`components/Dashboard.tsx`):**
   - Menghitung agregat saldo rekening secara paralel (`getAccountBalance`), sisa kewajiban utang, dan transaksi bulan berjalan.
4. **`Debts` (`components/Debts.tsx`):**
   - Komponen penting yang menghubungkan dua domain data: pencatatan cicilan utang (`addDebtPayment`) yang secara transaksional menyisipkan baris `Transaction` pengeluaran.
5. **`AISuggestions` (`components/AISuggestions.tsx`):**
   - Mengumpulkan data transaksi, anggaran, dan target ke dalam satu objek payload `FinancialDataSummary` dan mengirimkannya ke `geminiService.ts`.

---

## Data Model

Skema database lokal menggunakan Dexie.js (IndexedDB) dengan migrasi versi 2:

```typescript
// Versi 1
transactions: '++id, type, categoryId, accountId, date'
categories:   '++id, name, type'
accounts:     '++id, name'
goals:        '++id, name'
budgets:      '++id, categoryId, period'
settings:     'key'

// Versi 2 (Penambahan modul utang)
debts:        '++id, name'
debtPayments: '++id, debtId, date'
```

*Relasi Logis:*
- `Transaction` memiliki foreign-key logis `categoryId` (merujuk ke `Category.id`) dan `accountId` (merujuk ke `Account.id`).
- `DebtPayment` memiliki foreign-key logis `debtId` (merujuk ke `Debt.id`) dan `accountId` (merujuk ke `Account.id`).
- `Budget` memiliki foreign-key logis `categoryId` (merujuk ke `Category.id`).

---

## State Management

1. **Global Cross-Cutting State (React Context):**
   - `AuthContext`: Menyimpan status otentikasi pengguna saat aplikasi berjalan di memori.
   - `I18nContext`: Menyimpan preferensi bahasa aktif (`id` atau `en`) dan fungsi translasi `t(key)`. Preferensi ini juga disinkronkan ke `localStorage` (`ojirku_language`).
2. **Screen-Level State (`useState` & `useCallback`):**
   - Masing-masing halaman mengambil data langsung dari IndexedDB saat *mount* melalui `fetchData()` atau `loadData()`.
   - Tidak ada store Redux/Zustand terpusat. State data di-cache di level lokal komponen dan di-refresh ulang setiap kali ada operasi CRUD (tambah, edit, hapus).

---

## Data Flow

```text
[Interaksi Pengguna] 
       │
       ▼
[Komponen Halaman / Modal Form]
       │
       ▼ (Memanggil Data Access Function di lib/db.ts)
[Dexie.js API]
       │
       ▼ (Mengeksekusi Transaksi Read/Write)
[Browser IndexedDB: ojirkuDB]
       │
       ▼ (Callback Promise Berhasil)
[Komponen memicu Re-fetch / State Update]
       │
       ▼
[Re-render Tampilan React dengan Data Baru]
```

*Alur Khusus Fitur Saran AI:*
```text
[Tombol Analisis Ditekan]
       │
       ▼
[AISuggestions.tsx mengumpulkan data: Transactions + Budgets + Goals + Categories]
       │
       ▼
[geminiService.ts merangkum teks prompt kontekstual]
       │
       ▼
[Panggilan API ke Gemini 2.5 Flash via GoogleGenAI SDK]
       │
       ▼ (Menerima Response Teks Markdown)
[Komponen merender laporan via Custom Markdown Parser]
```

---

## Storage / Persistence

- **Teknologi:** IndexedDB (melalui pustaka pembungkus Dexie.js).
- **Karakteristik:**
  - Penyimpanan persisten lokal berbasis origin browser (`https://...`).
  - Tidak ada masa kedaluwarsa sesi (data tetap ada meskipun tab ditutup).
  - *Offline-First:* Aplikasi dapat membaca dan menulis data tanpa koneksi internet sama sekali.
- **Strategi Seeding (`onPopulate`):**
  - Saat database pertama kali dibuat, sistem membaca bahasa dari `localStorage`.
  - Jika `id`, sistem mengisi 9 kategori pengeluaran dan 5 kategori pemasukan dalam Bahasa Indonesia.
  - Sistem membuat 2 akun bawaan: `Cash` (saldo awal 0) dan `Main Bank Account` (saldo awal Rp1.000.000).

---

## External Services

- **Google Generative AI (Gemini):**
  - Satu-satunya layanan cloud eksternal yang dihubungi oleh aplikasi ini.
  - Endpoint: `gemini-2.5-flash` melalui `@google/genai`.
  - Akses internet hanya dibutuhkan ketika membuka tab Saran AI dan menekan tombol analisis.

---

## AI Integration

- **Lokasi Kode:** `services/geminiService.ts`
- **Konfigurasi Kunci API:** Mengambil dari `process.env.API_KEY`.
- **System Instruction:**
  > *"You are 'OJIRKU AI', a helpful and friendly financial assistant for a personal budgeting app. Your tone should be encouraging, clear, and easy to understand for someone who is not a financial expert. Provide insights in concise bullet points or short paragraphs. Start with a warm greeting. Analyze the provided data and give actionable advice..."*
- **Temperature:** `0.5` (menjaga konsistensi dan meminimalkan halusinasi angka).
- **Penanganan Error:** Menangkap kondisi ketika kunci API tidak terpasang atau saat perangkat offline, menghasilkan pesan ramah tanpa membuat aplikasi crash.

---

## Important Dependencies

- `react` & `react-dom` (v19.1.1): Core runtime UI.
- `dexie` (v4.0.11): ORM dan manajemen transaksi IndexedDB.
- `recharts` (v3.1.0): Pembuatan diagram batang dan diagram lingkaran responsif.
- `@google/genai` (v1.11.0): SDK resmi Google Gemini.
- `vite` (v6.2.0): Server pengembangan dan bundler produksi.

---

## Architectural Patterns

1. **Offline-First Architecture:** Desain berpusat pada ketersediaan data lokal. Kegagalan jaringan tidak memengaruhi fungsi inti pencatatan.
2. **Repository / Data Access Object (DAO) Pattern:** Seluruh query Dexie dikonsolidasikan dalam fungsi-fungsi pembantu di `lib/db.ts` (`addTransaction`, `getAccountBalance`, `addDebtPayment`), memisahkan logika query dari komponen presentasi.
3. **Database Transactions:** Penggunaan `db.transaction('rw', ...)` untuk memastikan keutuhan data saat beberapa operasi harus terjadi serentak (contoh: pada pembayaran utang dan penghapusan utang beserta pembayarannya).
4. **Adapter / Façade untuk Ekspor:** Fungsi `handleExport` di `Settings.tsx` membaca seluruh tabel dan memetakan ID relasi menjadi nama teks yang dapat dibaca manusia sebelum dikonversi menjadi CSV.

---

## Security Considerations

1. **PIN Keamanan Tidak Dienkripsi (*Plaintext PIN*):**
   - PIN pengguna disimpan sebagai teks biasa pada tabel `settings` (`key: 'pin'`). Siapa pun yang memiliki akses ke Developer Tools (Application tab -> IndexedDB) dapat membaca nilai PIN ini.
2. **Ketiadaan Enkripsi Database di Klien:**
   - Data riwayat keuangan tersimpan tanpa enkripsi tingkat berkas (*at-rest encryption*). Keamanan bergantung sepenuhnya pada proteksi sandi/kunci layar perangkat keras pengguna.
3. **Penyimpanan Kunci API di Klien:**
   - Pada `services/geminiService.ts`, pemanggilan Gemini dilakukan langsung dari kode browser klien menggunakan `process.env.API_KEY`. Dalam arsitektur web produksi, kunci API idealnya diproteksi di balik proxy backend server.

---

## Current Technical Debt

1. **Dual-Codebase Divergence:** Terdapat dua implementasi terpisah (Web di root dan Android di `/app`). Setiap perubahan fitur memerlukan penulisan ulang manual di dua bahasa berbeda (TypeScript dan Kotlin), yang berisiko menimbulkan ketidaksinkronan fungsional.
2. **Penggunaan Custom Markdown Parser yang Terbatas:** Pada `AISuggestions.tsx`, teks Markdown dari AI diproses menggunakan fungsi pengganti regex manual sederhana (`processInlines` dan manipulasi string) serta diinjeksikan via `dangerouslySetInnerHTML`. Ini berpotensi rentan terhadap format Markdown yang kompleks atau isu XSS jika respon tidak tervalidasi.
3. **Ketiadaan Unit / Integration Tests Otomatis:** Meskipun komentar kode di `App.tsx` merinci garis besar strategi pengujian (Jest, Cypress), belum ada file uji coba otomatis (`.test.ts` atau `.spec.tsx`) yang diimplementasikan dalam repositori.

---

## Scalability Considerations

- **Volume Transaksi Klien:** IndexedDB sangat mumpuni untuk menampung puluhan ribu transaksi personal selama bertahun-tahun pada satu perangkat.
- **Kueri Agregasi:** Saat ini, perhitungan saldo (`getAccountBalance`) dan pengelompokan laporan memuat seluruh array transaksi ke memori (`toArray()`) lalu melakukan `reduce` di JavaScript. Untuk ribuan transaksi, pendekatan ini perlu diganti dengan query terindeks yang lebih spesifik atau tabel agregat saldo berkala.

---

## Maintainability Considerations

- **Kelebihan:** Struktur folder sangat bersih dan mudah dinavigasi. Pemisahan komponen ke dalam berkas-berkas tersendiri (`Budgets.tsx`, `Goals.tsx`, `Debts.tsx`) membuat modifikasi fitur spesifik menjadi terisolasi dan aman.
- **Kekurangan:** Tidak adanya sistem rute URL standar (seperti browser history) membuat tombol *Back* pada peramban web atau gestur *back* Android tidak dapat menavigasi riwayat halaman di dalam aplikasi.

---

## Architecture Assessment

### What Was Actually Found (Fakta Kode)
- Aplikasi web berjalan murni di sisi klien menggunakan React 19 dan Dexie IndexedDB.
- Modul Android lengkap dan valid terdapat di `/app` dengan Room Database dan Jetpack Compose.
- Fitur pembayaran utang terintegrasi secara transaksional dengan pembuatan mutasi transaksi pengeluaran.
- Fitur Gemini menggunakan model `gemini-2.5-flash` dengan format prompt teks agregat.

### Interpretation (Interpretasi Arsitektural)
- Arsitektur ini dibangun dengan sengaja sebagai **aplikasi utilitas lokal yang tangguh dan mandiri**. Pilihan menggunakan IndexedDB/Room tanpa backend server mencerminkan komitmen terhadap privasi data pengguna dan kecepatan penggunaan harian.
- Adanya dua codebase (Web & Android) menunjukkan bahwa proyek ini merupakan eksperimen porting untuk membandingkan pengalaman pengguna PWA vs Native Android.

### Assumptions (Asumsi)
- Diasumsikan bahwa pengguna memahami risiko penyimpanan lokal: jika peramban dibersihkan atau perangkat hilang tanpa ekspor berkas, data tidak dapat dipulihkan secara otomatis dari server awan.
