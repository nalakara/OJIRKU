import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { 
  db, 
  addAccount, 
  addTransaction, 
  getAccountBalance, 
  addDebt, 
  addDebtPayment, 
  getDebts, 
  getDebtPayments, 
  getTransactions, 
  addCategory, 
  addOrUpdateBudget, 
  getBudgetUsage, 
  setSetting, 
  getSetting 
} from '../lib/db';
import { formatCurrency, getColorForId, calculateCategoryStats } from '../lib/utils';
import { TransactionType, Category, Transaction, Account } from '../types';
import { generateSalt, hashPin } from '../lib/auth';

describe('Financial Utils & Formatting', () => {
  it('formats currency correctly for Indonesian Rupiah', () => {
    expect(formatCurrency(0)).toBe('Rp0');
    expect(formatCurrency(1500000)).toMatch(/Rp1[.,]500[.,]000/);
    expect(formatCurrency(25000)).toMatch(/Rp25[.,]000/);
  });

  it('generates consistent colors for category IDs', () => {
    const color1 = getColorForId(1);
    const color2 = getColorForId(1);
    const color3 = getColorForId(2);
    expect(color1).toBe(color2);
    expect(color1).not.toBe(color3);
    expect(getColorForId(0)).toBe('#9ca3af');
  });

  it('calculates category percentage statistics correctly without division by zero', () => {
    const categories: Category[] = [
      { id: 1, name: 'Food', type: TransactionType.EXPENSE },
      { id: 2, name: 'Transport', type: TransactionType.EXPENSE },
      { id: 3, name: 'Salary', type: TransactionType.INCOME },
    ];

    const transactions: Transaction[] = [
      { id: 1, type: TransactionType.EXPENSE, amount: 300000, categoryId: 1, accountId: 1, date: new Date(), description: 'Lunch' },
      { id: 2, type: TransactionType.EXPENSE, amount: 100000, categoryId: 2, accountId: 1, date: new Date(), description: 'Taxi' },
      { id: 3, type: TransactionType.INCOME, amount: 2000000, categoryId: 3, accountId: 1, date: new Date(), description: 'Paycheck' },
    ];

    const stats = calculateCategoryStats(transactions, categories);

    // Total expense is 400,000. Food is 300,000 (75%), Transport is 100,000 (25%)
    expect(stats[1].percentage).toBeCloseTo(75);
    expect(stats[2].percentage).toBeCloseTo(25);
    expect(stats[3].percentage).toBeCloseTo(100);

    // Empty transactions should yield 0% without crashing
    const emptyStats = calculateCategoryStats([], categories);
    expect(emptyStats[1].percentage).toBe(0);
    expect(emptyStats[2].percentage).toBe(0);
  });
});

describe('Database & Financial Ledger Invariants', () => {
  beforeEach(async () => {
    await db.transactions.clear();
    await db.accounts.clear();
    await db.categories.clear();
    await db.debts.clear();
    await db.debtPayments.clear();
    await db.budgets.clear();
    await db.settings.clear();
  });

  it('calculates account balances accurately across multiple income and expense transactions', async () => {
    const accountId = await addAccount({
      name: 'Bank BCA',
      type: 'Bank',
      initialBalance: 1000000
    });

    const categoryId = await addCategory({
      name: 'Groceries',
      type: TransactionType.EXPENSE
    });

    const incomeCategoryId = await addCategory({
      name: 'Freelance',
      type: TransactionType.INCOME
    });

    // Add Expense
    await addTransaction({
      type: TransactionType.EXPENSE,
      amount: 250000,
      categoryId: categoryId as number,
      accountId: accountId as number,
      date: new Date(),
      description: 'Supermarket'
    });

    // Add Income
    await addTransaction({
      type: TransactionType.INCOME,
      amount: 500000,
      categoryId: incomeCategoryId as number,
      accountId: accountId as number,
      date: new Date(),
      description: 'Project fee'
    });

    // Net balance = 1,000,000 - 250,000 + 500,000 = 1,250,000
    const balance = await getAccountBalance(accountId as number);
    expect(balance).toBe(1250000);
  });

  it('executes debt payment atomically: updates debt paid, creates debt payment record, and logs expense transaction', async () => {
    const accountId = await addAccount({
      name: 'Main Wallet',
      type: 'Cash',
      initialBalance: 5000000
    });

    await addCategory({
      name: 'Pembayaran Hutang',
      type: TransactionType.EXPENSE
    });

    const debtId = await addDebt({
      name: 'Motorcycle Loan',
      lender: 'Leasing ABC',
      totalAmount: 10000000
    });

    const paymentAmount = 1500000;
    const paymentDate = new Date();

    await addDebtPayment({
      debtId: debtId as number,
      accountId: accountId as number,
      amount: paymentAmount,
      date: paymentDate
    });

    // 1. Debt amountPaid must be updated
    const debts = await getDebts();
    const updatedDebt = debts.find(d => d.id === debtId);
    expect(updatedDebt).toBeDefined();
    expect(updatedDebt?.amountPaid).toBe(1500000);
    expect((updatedDebt?.totalAmount || 0) - (updatedDebt?.amountPaid || 0)).toBe(8500000);

    // 2. DebtPayment record must be created
    const payments = await getDebtPayments(debtId as number);
    expect(payments.length).toBe(1);
    expect(payments[0].amount).toBe(1500000);

    // 3. Expense transaction must be created and account balance debited
    const transactions = await getTransactions();
    expect(transactions.length).toBe(1);
    expect(transactions[0].type).toBe(TransactionType.EXPENSE);
    expect(transactions[0].amount).toBe(1500000);
    expect(transactions[0].description).toBe('Payment for Motorcycle Loan');

    const accountBalance = await getAccountBalance(accountId as number);
    expect(accountBalance).toBe(3500000); // 5,000,000 - 1,500,000
  });

  it('calculates monthly budget usage accurately within current calendar month bounds', async () => {
    const categoryId = await addCategory({
      name: 'Dining Out',
      type: TransactionType.EXPENSE
    });

    const accountId = await addAccount({
      name: 'Debit Card',
      type: 'Bank',
      initialBalance: 2000000
    });

    await addOrUpdateBudget({
      categoryId: categoryId as number,
      amount: 1000000,
      period: 'monthly'
    });

    const now = new Date();
    const currentMonthDate = new Date(now.getFullYear(), now.getMonth(), 15);
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 15);

    // Transaction in current month
    await addTransaction({
      type: TransactionType.EXPENSE,
      amount: 400000,
      categoryId: categoryId as number,
      accountId: accountId as number,
      date: currentMonthDate,
      description: 'Dinner with team'
    });

    // Transaction in previous month (must NOT be counted)
    await addTransaction({
      type: TransactionType.EXPENSE,
      amount: 800000,
      categoryId: categoryId as number,
      accountId: accountId as number,
      date: lastMonthDate,
      description: 'Old dinner'
    });

    const usage = await getBudgetUsage({
      categoryId: categoryId as number,
      amount: 1000000,
      period: 'monthly'
    });

    expect(usage).toBe(400000);
  });
});

describe('PIN Security & Cryptographic Hashing', () => {
  it('generates random hex salts and produces deterministic SHA-256 hashes', async () => {
    const salt1 = generateSalt();
    const salt2 = generateSalt();
    expect(salt1).toHaveLength(32); // 16 bytes = 32 hex chars
    expect(salt2).toHaveLength(32);
    expect(salt1).not.toBe(salt2);

    const hashA = await hashPin('1234', salt1);
    const hashB = await hashPin('1234', salt1);
    const hashWrong = await hashPin('0000', salt1);

    expect(hashA).toBe(hashB);
    expect(hashA).not.toBe(hashWrong);
  });

  it('supports transparent migration of legacy plaintext PIN to salted hash', async () => {
    // Simulate legacy user with plaintext PIN
    await setSetting('pin', '9876');

    const legacySetting = await getSetting('pin');
    expect(legacySetting?.value).toBe('9876');

    // Simulate login verification & auto-upgrade
    const pinEntered = '9876';
    if (typeof legacySetting?.value === 'string' && legacySetting.value === pinEntered) {
      const salt = generateSalt();
      const hash = await hashPin(pinEntered, salt);
      await setSetting('pin', { hash, salt });
    }

    const upgradedSetting = await getSetting('pin');
    expect(typeof upgradedSetting?.value).toBe('object');
    expect(upgradedSetting?.value.hash).toBeDefined();
    expect(upgradedSetting?.value.salt).toBeDefined();

    // Verify upgraded hash matches
    const verifyHash = await hashPin('9876', upgradedSetting?.value.salt);
    expect(verifyHash).toBe(upgradedSetting?.value.hash);

    const wrongVerifyHash = await hashPin('1111', upgradedSetting?.value.salt);
    expect(wrongVerifyHash).not.toBe(upgradedSetting?.value.hash);
  });
});
