
import React, { useEffect, useState, useCallback } from 'react';
import { Page } from './Layout';
import { Card, Spinner } from './common';
import { useI18n } from '../lib/i18n';
import { db, getAccountBalance } from '../lib/db';
import { Transaction, TransactionType, Account, Debt } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../lib/utils';

export const Dashboard = () => {
    const { t } = useI18n();
    const [totalBalance, setTotalBalance] = useState(0);
    const [totalDebt, setTotalDebt] = useState(0);
    const [monthlyIncome, setMonthlyIncome] = useState(0);
    const [monthlyExpense, setMonthlyExpense] = useState(0);
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        // Fetch accounts and calculate balance
        const allAccounts = await db.accounts.toArray();
        setAccounts(allAccounts);

        let cumulativeBalance = 0;
        for(const acc of allAccounts) {
            if(acc.id) {
                cumulativeBalance += await getAccountBalance(acc.id);
            }
        }
        setTotalBalance(cumulativeBalance);

        // Fetch debts and calculate total remaining debt
        const allDebts = await db.debts.toArray();
        const cumulativeDebt = allDebts.reduce((sum, debt) => sum + (debt.totalAmount - debt.amountPaid), 0);
        setTotalDebt(cumulativeDebt);

        // Fetch monthly transactions
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const transactions = await db.transactions
            .where('date')
            .aboveOrEqual(startOfMonth)
            .toArray();
        
        const income = transactions
            .filter(tx => tx.type === TransactionType.INCOME)
            .reduce((sum, tx) => sum + tx.amount, 0);
        
        const expense = transactions
            .filter(tx => tx.type === TransactionType.EXPENSE)
            .reduce((sum, tx) => sum + tx.amount, 0);

        setMonthlyIncome(income);
        setMonthlyExpense(expense);

        // Fetch recent transactions
        const recent = await db.transactions.orderBy('date').reverse().limit(5).toArray();
        setRecentTransactions(recent);
        setLoading(false);
    }, [t]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const chartData = [
        { name: t('monthly_overview'), [t('income')]: monthlyIncome, [t('expense')]: monthlyExpense }
    ];
    
    if (loading) {
        return <Page><Spinner /></Page>;
    }

    const netWorth = totalBalance - totalDebt;

    return (
        <Page>
            <Card className="text-center bg-white/10 border-none">
                <h3 className="text-lg text-gray-300">{t('net_worth')}</h3>
                <p className={`text-5xl font-black tracking-tight ${netWorth >= 0 ? 'text-white' : 'text-red-400'}`}>{formatCurrency(netWorth)}</p>
                <div className="flex justify-center gap-6 mt-2 text-sm">
                    <div>
                        <span className="text-gray-400">{t('total_balance')}: </span>
                        <span className="font-semibold text-teal-300">{formatCurrency(totalBalance)}</span>
                    </div>
                    <div>
                        <span className="text-gray-400">{t('total_debt')}: </span>
                        <span className="font-semibold text-pink-300">{formatCurrency(totalDebt)}</span>
                    </div>
                </div>
            </Card>

            <Card>
                <h3 className="font-bold text-lg mb-4 text-white">{t('monthly_overview')}</h3>
                <div className="h-40 -mx-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" hide />
                            <Tooltip 
                                formatter={(value: number) => formatCurrency(value)} 
                                cursor={{fill: 'rgba(255,255,255,0.1)'}}
                                contentStyle={{
                                    background: 'rgba(30,30,30,0.8)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '1rem',
                                }}
                                labelStyle={{ color: '#fff' }}
                            />
                            <Legend wrapperStyle={{ color: '#fff' }} />
                            <Bar dataKey={t('income')} stackId="a" fill="#14B8A6" radius={[10, 0, 0, 10]}/>
                            <Bar dataKey={t('expense')} stackId="a" fill="#F472B6" radius={[0, 10, 10, 0]}/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
            
            <Card>
                <h3 className="font-bold text-lg mb-4 text-white">{t('recent_transactions')}</h3>
                {recentTransactions.length > 0 ? (
                    <ul className="space-y-4">
                        {recentTransactions.map(tx => {
                            const account = accounts.find(a => a.id === tx.accountId);
                            return (
                                <li key={tx.id} className="flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-white">{tx.description}</p>
                                        <p className="text-sm text-gray-400">{account?.name || '...'} &bull; {new Date(tx.date).toLocaleDateString()}</p>
                                    </div>
                                    <p className={`font-bold ${tx.type === TransactionType.INCOME ? 'text-teal-400' : 'text-pink-400'}`}>
                                        {tx.type === TransactionType.INCOME ? '+' : '-'} {formatCurrency(tx.amount)}
                                    </p>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className="text-center py-4">
                        <p className="text-gray-400">No recent transactions to display.</p>
                    </div>
                )}
            </Card>
        </Page>
    );
};