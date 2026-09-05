
import React, { useEffect, useState, useCallback } from 'react';
import { Page } from './Layout';
import { Card, Button, Modal, Input, Select, TrashIcon, ConfirmationModal } from './common';
import { useI18n } from '../lib/i18n';
import { db, getCategories, addOrUpdateBudget, getBudgetUsage, deleteBudget } from '../lib/db';
import { Budget, Category, TransactionType } from '../types';
import { formatCurrency } from '../lib/utils';

const BudgetItem = ({ budget, category, usage, onDelete }: { budget: Budget, category?: Category, usage: number, onDelete: () => void }) => {
    const { t } = useI18n();
    const percentage = budget.amount > 0 ? Math.min((usage / budget.amount) * 100, 100) : 0;
    const isOverBudget = usage > budget.amount;

    return (
        <Card>
            <div className="flex justify-between items-start mb-2">
                 <div>
                    <span className="font-bold text-white">{category?.name || '...'}</span>
                    <p className={`font-semibold text-sm ${isOverBudget ? 'text-red-400' : 'text-gray-400'}`}>{formatCurrency(usage)} / {formatCurrency(budget.amount)}</p>
                </div>
                <button onClick={onDelete} className="p-2 -mt-2 -mr-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10" aria-label={t('aria_delete_budget') + (category?.name || '')}><TrashIcon className="w-5 h-5"/></button>
            </div>
            <div className="w-full bg-black/30 rounded-full h-2.5">
                <div 
                    className={`h-2.5 rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-gradient-to-r from-teal-400 to-cyan-500'}`} 
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            {isOverBudget && <p className="text-red-400 text-sm mt-2">Over budget by {formatCurrency(usage - budget.amount)}</p>}
        </Card>
    );
};

const AddBudgetModal = ({ isOpen, onClose, onSave }: { isOpen: boolean, onClose: () => void, onSave: () => void }) => {
    const { t } = useI18n();
    const [categoryId, setCategoryId] = useState('');
    const [amount, setAmount] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if(isOpen) {
            getCategories(TransactionType.EXPENSE).then(setCategories);
            setErrors({});
            setAmount('');
            setCategoryId('');
        }
    }, [isOpen]);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (Number(amount) <= 0) newErrors.amount = t('form_error_positive_amount');
        if (!categoryId) newErrors.categoryId = t('form_error_category');
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSave = async () => {
        if (!validate()) return;
        await addOrUpdateBudget({
            categoryId: parseInt(categoryId),
            amount: parseFloat(amount),
            period: 'monthly'
        });
        onSave();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-2xl font-bold mb-6 text-center">{t('add_budget')}</h2>
            <div className="space-y-4">
                <div>
                    <Select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                        <option value="">{t('category')}</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </Select>
                    {errors.categoryId && <p className="text-red-400 text-sm mt-1 px-4">{errors.categoryId}</p>}
                </div>
                <div>
                    <Input type="number" placeholder={t('monthly_limit')} value={amount} onChange={e => setAmount(e.target.value)} />
                    {errors.amount && <p className="text-red-400 text-sm mt-1 px-4">{errors.amount}</p>}
                </div>
                <div className="flex gap-4 pt-4">
                    <Button onClick={onClose} variant="secondary">{t('cancel')}</Button>
                    <Button onClick={handleSave}>{t('save')}</Button>
                </div>
            </div>
        </Modal>
    );
};


export const Budgets = () => {
    const { t } = useI18n();
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [usage, setUsage] = useState<Record<number, number>>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [budgetToDelete, setBudgetToDelete] = useState<number | null>(null);
    
    const fetchData = useCallback(async () => {
        const budgetList = await db.budgets.toArray();
        setBudgets(budgetList);
        setCategories(await getCategories(TransactionType.EXPENSE));
        
        const usageData: Record<number, number> = {};
        for (const budget of budgetList) {
            usageData[budget.categoryId] = await getBudgetUsage(budget);
        }
        setUsage(usageData);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDeleteRequest = (id?: number) => {
        if (!id) return;
        setBudgetToDelete(id);
        setIsConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!budgetToDelete) return;
        await deleteBudget(budgetToDelete);
        fetchData();
        setIsConfirmOpen(false);
        setBudgetToDelete(null);
    };

    return (
        <Page>
            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleDeleteConfirm}
                title={t('confirm_delete_title')}
            >
                <p>{t('confirm_delete_message')}</p>
            </ConfirmationModal>

            <AddBudgetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={fetchData} />
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">{t('manage_budgets')}</h2>
                <Button onClick={() => setIsModalOpen(true)} className="!w-auto px-6 py-2">{t('add_budget')}</Button>
            </div>
            
            {budgets.length > 0 ? (
                <div className="space-y-4">
                    {budgets.map(budget => (
                        <BudgetItem 
                            key={budget.id}
                            budget={budget}
                            category={categories.find(c => c.id === budget.categoryId)}
                            usage={usage[budget.categoryId] || 0}
                            onDelete={() => handleDeleteRequest(budget.id)}
                        />
                    ))}
                </div>
            ) : (
                 <Card>
                    <div className="text-center py-8">
                        <h3 className="text-lg font-semibold text-white">No Budgets Set</h3>
                        <p className="text-gray-400 mt-2">Create budgets for spending categories to keep your finances in check.</p>
                        <Button onClick={() => setIsModalOpen(true)} className="mt-6 !w-auto px-6">
                            {t('add_budget')}
                        </Button>
                    </div>
                </Card>
            )}
        </Page>
    );
};