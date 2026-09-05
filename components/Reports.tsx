
import React, { useEffect, useState, useCallback } from 'react';
import { Page } from './Layout';
import { Card, Spinner } from './common';
import { useI18n } from '../lib/i18n';
import { db, getCategories } from '../lib/db';
import { Transaction, Category, TransactionType } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '../lib/utils';

const COLORS = ['#F472B6', '#14B8A6', '#FBBF24', '#818CF8', '#38BDF8', '#A78BFA', '#F87171'];

export const Reports = () => {
    const { t } = useI18n();
    const [expenseData, setExpenseData] = useState<{ name: string; value: number }[]>([]);
    const [loading, setLoading] = useState(true);

    const generateReport = useCallback(async () => {
        setLoading(true);
        const transactions = await db.transactions.where({ type: TransactionType.EXPENSE }).toArray();
        const categories = await getCategories(TransactionType.EXPENSE);

        const dataMap = new Map<string, number>();

        transactions.forEach(tx => {
            const category = categories.find(c => c.id === tx.categoryId);
            const categoryName = category ? category.name : 'Uncategorized';
            dataMap.set(categoryName, (dataMap.get(categoryName) || 0) + tx.amount);
        });

        const formattedData = Array.from(dataMap.entries()).map(([name, value]) => ({ name, value }));
        setExpenseData(formattedData);
        setLoading(false);
    }, []);

    useEffect(() => {
        generateReport();
    }, [generateReport]);

    return (
        <Page>
            <Card className="bg-white/10 backdrop-blur-md border border-white/15 rounded-[8px]">
                <h2 className="text-[20px] font-bold mb-4 text-white">Expense Breakdown</h2>
                {loading ? <Spinner /> : 
                (expenseData.length > 0 ? (
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={expenseData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                                >
                                    {expenseData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    formatter={(value: number) => formatCurrency(value)}
                                    contentStyle={{
                                        background: 'rgba(29, 23, 46, 0.95)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: '8px',
                                        color: '#ffffff',
                                        fontSize: '14px',
                                        backdropFilter: 'blur(8px)'
                                    }}
                                    labelStyle={{ color: '#ffffff', fontWeight: 600 }}
                                />
                                <Legend wrapperStyle={{ color: '#ffffff', fontSize: '14px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <h2 className="text-[20px] font-bold text-white">No Expense Data</h2>
                        <p className="text-gray-300 text-[14px] mt-2">Add some expense transactions to see a breakdown here.</p>
                    </div>
                ))}
            </Card>
        </Page>
    );
};