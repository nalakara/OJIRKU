
// Proposed Data Model Schema for IndexedDB

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

// Entity: Transaction
// Stores individual income or expense records.
export interface Transaction {
  id?: number; // Optional: auto-incremented by IndexedDB
  type: TransactionType;
  amount: number;
  categoryId: number;
  accountId: number;
  date: Date;
  description: string;
}

// Entity: Category
// Defines categories for transactions.
export interface Category {
  id?: number; // Optional: auto-incremented by IndexedDB
  name: string;
  type: TransactionType; // so a category can be for 'income' or 'expense'
}

// Entity: Account
// Manages different financial accounts.
export interface Account {
  id?: number; // Optional: auto-incremented by IndexedDB
  name: string;
  type: 'Bank' | 'Cash' | 'Credit Card' | 'Investment' | 'E-Wallet';
  initialBalance: number;
}

// Entity: Goal
// For tracking financial goals.
export interface Goal {
  id?: number; // Optional: auto-incremented by IndexedDB
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
}

// Entity: Budget
// For setting and monitoring spending limits.
export interface Budget {
    id?: number;
    categoryId: number;
    amount: number;
    period: 'monthly' | 'yearly';
}

// Entity: Setting
// For storing user preferences like PIN and language.
export interface Setting {
    key: string; // 'pin' or 'language'
    value: any;
}

// Entity: Debt
// For tracking loans, credit cards, etc.
export interface Debt {
    id?: number;
    name: string;
    lender: string;
    totalAmount: number;
    amountPaid: number;
    dueDate?: Date;
    interestRate?: number;
}

// Entity: DebtPayment
// Records a single payment made towards a debt.
export interface DebtPayment {
    id?: number;
    debtId: number;
    accountId: number;
    amount: number;
    date: Date;
}


// For AI Suggestions
export interface FinancialDataSummary {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  categories: Category[];
}