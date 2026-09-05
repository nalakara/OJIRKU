import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

const translations = {
  en: {
    'dashboard': 'Dashboard',
    'transactions': 'Transactions',
    'budgets': 'Budgets',
    'goals': 'Goals',
    'debts': 'Debts',
    'reports': 'Reports',
    'ai_suggestions': 'AI Suggestions',
    'settings': 'Settings',
    'income': 'Income',
    'expense': 'Expense',
    'total_balance': 'Total Balance',
    'monthly_overview': 'Monthly Overview',
    'recent_transactions': 'Recent Transactions',
    'add_transaction': 'Add Transaction',
    'edit_transaction': 'Edit Transaction',
    'amount': 'Amount',
    'category': 'Category',
    'account': 'Account',
    'date': 'Date',
    'description': 'Description',
    'save': 'Save',
    'cancel': 'Cancel',
    'manage_budgets': 'Manage Budgets',
    'add_budget': 'Add Budget',
    'monthly_limit': 'Monthly Limit',
    'used': 'Used',
    'of': 'of',
    'financial_goals': 'Financial Goals',
    'add_goal': 'Add Goal',
    'goal_name': 'Goal Name',
    'target_amount': 'Target Amount',
    'current_amount': 'Current Amount',
    'add_to_goal': 'Add to Goal',
    'language': 'Language',
    'security': 'Security',
    'change_pin': 'Change PIN',
    'enter_pin': 'Enter PIN',
    'set_your_pin': 'Set Your PIN',
    'confirm_pin': 'Confirm PIN',
    'pin_mismatch': "PINs don't match!",
    'analyze_finances': 'Analyze My Finances',
    'ai_financial_review': 'AI Financial Review',
    'generating_insights': 'Generating insights... This may take a moment.',
    'no_data_for_analysis': 'Not enough data for a meaningful analysis. Please add more transactions.',
    'error_generating_report': 'An error occurred while generating the report.',
    'manage_accounts': 'Manage Accounts',
    'add_account': 'Add Account',
    'edit_account': 'Edit Account',
    'account_name': 'Account Name',
    'initial_balance': 'Initial Balance',
    'account_type': 'Account Type',
    'confirm_delete_title': 'Confirm Deletion',
    'confirm_delete_message': 'Are you sure? This action cannot be undone.',
    'confirm_action': 'Confirm',
    'item_in_use_error': 'Cannot be deleted because it is in use.',
    'manage_categories': 'Manage Categories',
    'add_category': 'Add Category',
    'edit_category': 'Edit Category',
    'category_name': 'Category Name',
    'income_categories': 'Income Categories',
    'expense_categories': 'Expense Categories',
    'add': 'Add',
    'edit': 'Edit',
    'delete': 'Delete',
    'form_error_name': 'Please enter a name.',
    'form_error_positive_amount': 'Amount must be a positive number.',
    'form_error_description': 'Please enter a description.',
    'form_error_category': 'Please select a category.',
    'form_error_account': 'Please select an account.',
    'form_error_date': 'Please select a date.',
    'form_error_target_amount': 'Target amount must be a positive number.',
    'aria_edit_transaction': 'Edit transaction: ',
    'aria_delete_transaction': 'Delete transaction: ',
    'aria_delete_budget': 'Delete budget for ',
    'aria_add_to_goal': 'Add amount to goal: ',
    'aria_delete_goal': 'Delete goal: ',
    'aria_edit_account': 'Edit account: ',
    'aria_delete_account': 'Delete account: ',
    'aria_edit_category': 'Edit category: ',
    'aria_delete_category': 'Delete category: ',
    'welcome_subtitle': 'Your personal finance companion',
    'sign_in': 'Sign In',
    'sign_up_welcome': 'Create Account',
    'back': 'Back',
    'data_export': 'Data & Export',
    'export_transactions_csv': 'Export Transactions to CSV',
    'exporting': 'Exporting...',
    'manage_debts': 'Manage Debts',
    'add_debt': 'Add Debt',
    'edit_debt': 'Edit Debt',
    'debt_name': 'Debt Name (e.g., Car Loan)',
    'lender': 'Lender (e.g., Bank ABC)',
    'total_amount': 'Total Amount',
    'amount_paid': 'Amount Paid',
    'due_date': 'Due Date',
    'make_payment': 'Make Payment',
    'payment_history': 'Payment History',
    'no_debts_yet': 'No debts to show. Add one to start tracking!',
    'remaining': 'Remaining',
    'no_payments_yet': 'No payments have been made for this debt yet.',
    'paid': 'Paid',
    'total_debt': 'Total Debt',
    'net_worth': 'Net Worth',
    'install_app': 'Install App',
  },
  id: {
    'dashboard': 'Dasbor',
    'transactions': 'Transaksi',
    'budgets': 'Anggaran',
    'goals': 'Tujuan',
    'debts': 'Hutang',
    'reports': 'Laporan',
    'ai_suggestions': 'Saran AI',
    'settings': 'Pengaturan',
    'income': 'Pemasukan',
    'expense': 'Pengeluaran',
    'total_balance': 'Total Saldo',
    'monthly_overview': 'Gambaran Bulanan',
    'recent_transactions': 'Transaksi Terkini',
    'add_transaction': 'Tambah Transaksi',
    'edit_transaction': 'Ubah Transaksi',
    'amount': 'Jumlah',
    'category': 'Kategori',
    'account': 'Akun',
    'date': 'Tanggal',
    'description': 'Deskripsi',
    'save': 'Simpan',
    'cancel': 'Batal',
    'manage_budgets': 'Kelola Anggaran',
    'add_budget': 'Tambah Anggaran',
    'monthly_limit': 'Batas Bulanan',
    'used': 'Terpakai',
    'of': 'dari',
    'financial_goals': 'Tujuan Keuangan',
    'add_goal': 'Tambah Tujuan',
    'goal_name': 'Nama Tujuan',
    'target_amount': 'Target Jumlah',
    'current_amount': 'Jumlah Saat Ini',
    'add_to_goal': 'Tambah ke Tujuan',
    'language': 'Bahasa',
    'security': 'Keamanan',
    'change_pin': 'Ubah PIN',
    'enter_pin': 'Masukkan PIN',
    'set_your_pin': 'Atur PIN Anda',
    'confirm_pin': 'Konfirmasi PIN',
    'pin_mismatch': 'PIN tidak cocok!',
    'analyze_finances': 'Analisis Keuangan Saya',
    'ai_financial_review': 'Ulasan Keuangan AI',
    'generating_insights': 'Menghasilkan wawasan... Ini mungkin memerlukan waktu sejenak.',
    'no_data_for_analysis': 'Data tidak cukup untuk analisis yang berarti. Silakan tambahkan lebih banyak transaksi.',
    'error_generating_report': 'Terjadi kesalahan saat membuat laporan.',
    'manage_accounts': 'Kelola Akun',
    'add_account': 'Tambah Akun',
    'edit_account': 'Ubah Akun',
    'account_name': 'Nama Akun',
    'initial_balance': 'Saldo Awal',
    'account_type': 'Tipe Akun',
    'confirm_delete_title': 'Konfirmasi Penghapusan',
    'confirm_delete_message': 'Apakah Anda yakin? Tindakan ini tidak dapat dibatalkan.',
    'confirm_action': 'Konfirmasi',
    'item_in_use_error': 'Tidak dapat dihapus karena sedang digunakan.',
    'manage_categories': 'Kelola Kategori',
    'add_category': 'Tambah Kategori',
    'edit_category': 'Ubah Kategori',
    'category_name': 'Nama Kategori',
    'income_categories': 'Kategori Pemasukan',
    'expense_categories': 'Kategori Pengeluaran',
    'add': 'Tambah',
    'edit': 'Ubah',
    'delete': 'Hapus',
    'form_error_name': 'Silakan masukkan nama.',
    'form_error_positive_amount': 'Jumlah harus angka positif.',
    'form_error_description': 'Silakan masukkan deskripsi.',
    'form_error_category': 'Silakan pilih kategori.',
    'form_error_account': 'Silakan pilih akun.',
    'form_error_date': 'Silakan pilih tanggal.',
    'form_error_target_amount': 'Jumlah target harus angka positif.',
    'aria_edit_transaction': 'Ubah transaksi: ',
    'aria_delete_transaction': 'Hapus transaksi: ',
    'aria_delete_budget': 'Hapus anggaran untuk ',
    'aria_add_to_goal': 'Tambah jumlah ke tujuan: ',
    'aria_delete_goal': 'Hapus tujuan: ',
    'aria_edit_account': 'Ubah akun: ',
    'aria_delete_account': 'Hapus akun: ',
    'aria_edit_category': 'Ubah kategori: ',
    'aria_delete_category': 'Hapus kategori: ',
    'welcome_subtitle': 'Pendamping keuangan pribadi Anda',
    'sign_in': 'Masuk',
    'sign_up_welcome': 'Buat Akun',
    'back': 'Kembali',
    'data_export': 'Data & Ekspor',
    'export_transactions_csv': 'Ekspor Transaksi ke CSV',
    'exporting': 'Mengekspor...',
    'manage_debts': 'Kelola Hutang',
    'add_debt': 'Tambah Hutang',
    'edit_debt': 'Ubah Hutang',
    'debt_name': 'Nama Hutang (cth: Cicilan Mobil)',
    'lender': 'Pemberi Pinjaman (cth: Bank ABC)',
    'total_amount': 'Total Jumlah',
    'amount_paid': 'Jumlah Dibayar',
    'due_date': 'Tanggal Jatuh Tempo',
    'make_payment': 'Lakukan Pembayaran',
    'payment_history': 'Riwayat Pembayaran',
    'no_debts_yet': 'Belum ada hutang. Tambah untuk mulai melacak!',
    'remaining': 'Sisa',
    'no_payments_yet': 'Belum ada pembayaran untuk hutang ini.',
    'paid': 'Telah Dibayar',
    'total_debt': 'Total Hutang',
    'net_worth': 'Kekayaan Bersih',
    'install_app': 'Instal Aplikasi',
  },
};

type Language = 'en' | 'id';
type TranslationKey = keyof typeof translations.en;

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, ...args: (string | number)[]) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('id');

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    // Persist language choice
    localStorage.setItem('ojirku_language', lang);
  }, []);

  // On initial load, check for saved language
  React.useEffect(() => {
    const savedLang = localStorage.getItem('ojirku_language') as Language | null;
    if (savedLang && (savedLang === 'en' || savedLang === 'id')) {
      setLanguageState(savedLang);
    }
  }, []);

  const t = useCallback((key: TranslationKey, ...args: (string | number)[]): string => {
    let translation = translations[language][key] || translations['en'][key];
    if (args.length) {
        // Simple interpolation, not used yet but good to have
        args.forEach((arg, index) => {
            translation = translation.replace(`{${index}}`, String(arg));
        });
    }
    return translation;
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};