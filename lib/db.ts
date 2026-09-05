
import Dexie, { type Table } from 'dexie';
import { Transaction, Category, Account, Goal, Budget, Setting, TransactionType, Debt, DebtPayment } from '../types';

/* 
  Security Consideration:
  Data stored in IndexedDB is sandboxed by origin but is otherwise unencrypted on the user's device.
  For a production app with sensitive data, one might consider encrypting serialized data before
  storing it using libraries like 'crypto-js', with a key derived from the user's PIN/password.
  However, client-side encryption is complex to manage securely. The primary defense here is the
  on-device authentication (PIN/Biometric) preventing unauthorized physical access to the app.
*/

// Define an interface for the database tables for better type safety.
interface OjirkuDBTables {
  transactions: Table<Transaction>;
  categories: Table<Category>;
  accounts: Table<Account>;
  goals: Table<Goal>;
  budgets: Table<Budget>;
  settings: Table<Setting>;
  debts: Table<Debt>;
  debtPayments: Table<DebtPayment>;
}

export const db = new Dexie('ojirkuDB') as Dexie & OjirkuDBTables;

db.version(1).stores({
  transactions: '++id, type, categoryId, accountId, date',
  categories: '++id, name, type',
  accounts: '++id, name',
  goals: '++id, name',
  budgets: '++id, categoryId, period',
  settings: 'key',
});

// Added version 2 for the new debts module
db.version(2).stores({
  transactions: '++id, type, categoryId, accountId, date',
  categories: '++id, name, type',
  accounts: '++id, name',
  goals: '++id, name',
  budgets: '++id, categoryId, period',
  settings: 'key',
  debts: '++id, name',
  debtPayments: '++id, debtId, date',
});

const onPopulate = async () => {
    // Populate with default data on first-time setup
    
    // Check language from localStorage. This is a pragmatic choice for a better UX.
    const lang = localStorage.getItem('ojirku_language') || 'id';

    const defaultCategoriesData = {
        en: {
            expense: ['Food & Drink', 'Transport', 'Housing', 'Shopping', 'Entertainment', 'Bills & Utilities', 'Health', 'Debt Payment', 'Other'],
            income: ['Salary', 'Bonus', 'Investment', 'Gift', 'Other']
        },
        id: {
            expense: ['Makanan & Minuman', 'Transportasi', 'Tempat Tinggal', 'Belanja', 'Hiburan', 'Tagihan & Utilitas', 'Kesehatan', 'Pembayaran Hutang', 'Lainnya'],
            income: ['Gaji', 'Bonus', 'Investasi', 'Hadiah', 'Lainnya']
        }
    };
    
    const langKey = lang === 'en' ? 'en' : 'id';
    const categoriesToAdd: Omit<Category, 'id'>[] = [];

    defaultCategoriesData[langKey].expense.forEach(name => {
        categoriesToAdd.push({ name, type: TransactionType.EXPENSE });
    });
    defaultCategoriesData[langKey].income.forEach(name => {
        categoriesToAdd.push({ name, type: TransactionType.INCOME });
    });

    await db.categories.bulkAdd(categoriesToAdd as Category[]);

    const defaultAccounts: Account[] = [
        { name: 'Cash', type: 'Cash', initialBalance: 0 },
        { name: 'Main Bank Account', type: 'Bank', initialBalance: 1000000 },
    ];
    await db.accounts.bulkAdd(defaultAccounts);
};

db.on('populate', onPopulate);

// --- Data Access Functions (CRUD Operations) ---

// Transactions
export const addTransaction = (tx: Transaction) => db.transactions.add(tx);
export const getTransactions = () => db.transactions.orderBy('date').reverse().toArray();
export const updateTransaction = (id: number, updates: Partial<Transaction>) => db.transactions.update(id, updates);
export const deleteTransaction = (id: number) => db.transactions.delete(id);

// Categories
export const getCategories = (type?: TransactionType) => {
    if (type) {
        return db.categories.where({ type }).toArray();
    }
    return db.categories.toArray();
};
export const addCategory = (category: Omit<Category, 'id'>) => db.categories.add(category as Category);
export const updateCategory = (id: number, updates: Partial<Category>) => db.categories.update(id, updates);
export const deleteCategory = (id: number) => db.categories.delete(id);
export const getTransactionCountForCategory = (categoryId: number) => db.transactions.where({ categoryId }).count();

// Accounts
export const getAccounts = () => db.accounts.toArray();
export const addAccount = (account: Omit<Account, 'id'>) => db.accounts.add(account as Account);
export const updateAccount = (id: number, updates: Partial<Account>) => db.accounts.update(id, updates);
export const deleteAccount = (id: number) => db.accounts.delete(id);
export const getTransactionCountForAccount = (accountId: number) => db.transactions.where({ accountId }).count();
export const getAccountBalance = async (accountId: number) => {
    const account = await db.accounts.get(accountId);
    if (!account) return 0;

    const transactions = await db.transactions.where({ accountId }).toArray();
    const balance = transactions.reduce((acc, tx) => {
        return tx.type === TransactionType.INCOME ? acc + tx.amount : acc - tx.amount;
    }, account.initialBalance);
    return balance;
};


// Goals
export const getGoals = () => db.goals.toArray();
export const addGoal = (goal: Goal) => db.goals.add(goal);
export const updateGoal = (id: number, updates: Partial<Goal>) => db.goals.update(id, updates);
export const deleteGoal = (id: number) => db.goals.delete(id);

// Budgets
export const getBudgets = () => db.budgets.toArray();
export const addOrUpdateBudget = (budget: Budget) => db.budgets.put(budget);
export const deleteBudget = (id: number) => db.budgets.delete(id);
export const getBudgetUsage = async (budget: Budget) => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0,0,0,0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    
    const expenses = await db.transactions.where('date').between(startOfMonth, endOfMonth, true, false)
        .filter(tx => tx.categoryId === budget.categoryId && tx.type === TransactionType.EXPENSE)
        .toArray();

    return expenses.reduce((sum, tx) => sum + tx.amount, 0);
}

// Debts
export const getDebts = () => db.debts.toArray();
export const addDebt = (debt: Omit<Debt, 'id' | 'amountPaid'>) => db.debts.add({ ...debt, amountPaid: 0 } as Debt);
export const updateDebt = (id: number, updates: Partial<Debt>) => db.debts.update(id, updates);
export const deleteDebt = (id: number) => {
    // Also delete associated payments
    return db.transaction('rw', db.debts, db.debtPayments, async () => {
        await db.debtPayments.where({ debtId: id }).delete();
        await db.debts.delete(id);
    });
};
export const getDebtPayments = (debtId: number) => db.debtPayments.where({ debtId }).sortBy('date');

export const addDebtPayment = async (payment: Omit<DebtPayment, 'id'>) => {
    return db.transaction('rw', db.debts, db.debtPayments, db.transactions, db.categories, async () => {
        const debt = await db.debts.get(payment.debtId);
        if (!debt) throw new Error("Debt not found");

        // 1. Add the debt payment record
        await db.debtPayments.add(payment as DebtPayment);

        // 2. Update the amount paid on the debt
        await db.debts.update(payment.debtId, { amountPaid: debt.amountPaid + payment.amount });

        // 3. Create a corresponding expense transaction
        let debtCategory = await db.categories.where({ name: 'Debt Payment' }).or('name').equals('Pembayaran Hutang').first();
        if (!debtCategory) {
            // Fallback if the category somehow doesn't exist
            debtCategory = await db.categories.where({type: TransactionType.EXPENSE}).first();
            if (!debtCategory) throw new Error("No expense category available for debt payment.");
        }
        
        const expenseTransaction: Transaction = {
            type: TransactionType.EXPENSE,
            amount: payment.amount,
            categoryId: debtCategory.id!,
            accountId: payment.accountId,
            date: payment.date,
            description: `Payment for ${debt.name}`
        };
        await db.transactions.add(expenseTransaction);
    });
};


// Settings
export const getSetting = (key: string) => db.settings.get(key);
export const setSetting = (key: string, value: any) => db.settings.put({ key, value });