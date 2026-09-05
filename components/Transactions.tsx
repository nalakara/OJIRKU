
import React, { useState, useEffect, useCallback } from 'react';
import { Page } from './Layout';
import { Button, Modal, Input, Select, EditIcon, TrashIcon, ConfirmationModal, PlusIcon, Card, RadialProgress } from './common';
import { useI18n } from '../lib/i18n';
import { db, addTransaction, getCategories, getAccounts, updateTransaction, deleteTransaction } from '../lib/db';
import { Transaction, TransactionType, Category, Account } from '../types';
import { formatCurrency, getColorForId, calculateCategoryStats } from '../lib/utils';


const TransactionItem = ({ tx, categories, accounts, onEdit, onDelete, percentage, color }: { tx: Transaction, categories: Category[], accounts: Account[], onEdit: () => void, onDelete: () => void, percentage: number, color: string }) => {
    const { t } = useI18n();
    const category = categories.find(c => c.id === tx.categoryId);
    const account = accounts.find(a => a.id === tx.accountId);
    const isIncome = tx.type === TransactionType.INCOME;

    return (
        <li className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl gap-2">
            <div className="flex items-center gap-4 flex-grow min-w-0">
                <div className="flex-shrink-0">
                    <RadialProgress percentage={percentage} color={color} />
                </div>
                <div className="flex-grow min-w-0">
                    <p className="font-bold text-white truncate">{tx.description}</p>
                    <p className="text-sm text-gray-400 truncate">
                        {category?.name || '...'} &bull; {account?.name || '...'}
                    </p>
                    <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
                </div>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
                <p className={`font-bold text-lg text-right ${isIncome ? 'text-teal-400' : 'text-pink-400'}`}>
                    {isIncome ? '+' : '-'} {formatCurrency(tx.amount)}
                </p>
                <button onClick={onEdit} className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10" aria-label={t('aria_edit_transaction') + tx.description}><EditIcon className="w-5 h-5"/></button>
                <button onClick={onDelete} className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10" aria-label={t('aria_delete_transaction') + tx.description}><TrashIcon className="w-5 h-5"/></button>
            </div>
        </li>
    );
};

const AddTransactionModal = ({ isOpen, onClose, onSave, transactionToEdit }: { isOpen: boolean, onClose: () => void, onSave: () => void, transactionToEdit: Transaction | null }) => {
    const { t } = useI18n();
    const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
    const [amount, setAmount] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [accountId, setAccountId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    const [categories, setCategories] = useState<Category[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    
    const isEditing = !!transactionToEdit;
    
    const resetForm = () => {
        setType(TransactionType.EXPENSE);
        setAmount('');
        setCategoryId('');
        setAccountId('');
        setDate(new Date().toISOString().split('T')[0]);
        setDescription('');
        setErrors({});
    }

    useEffect(() => {
        if (isOpen) {
             if (isEditing && transactionToEdit) {
                setType(transactionToEdit.type);
                setAmount(String(transactionToEdit.amount));
                setCategoryId(String(transactionToEdit.categoryId));
                setAccountId(String(transactionToEdit.accountId));
                setDate(new Date(transactionToEdit.date).toISOString().split('T')[0]);
                setDescription(transactionToEdit.description);
            } else {
                resetForm();
            }
        }
    }, [transactionToEdit, isEditing, isOpen]);


    useEffect(() => {
        if (isOpen) {
            getCategories(type).then(setCategories);
            getAccounts().then(setAccounts);
        }
    }, [isOpen, type]);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (Number(amount) <= 0) newErrors.amount = t('form_error_positive_amount');
        if (!description.trim()) newErrors.description = t('form_error_description');
        if (!categoryId) newErrors.categoryId = t('form_error_category');
        if (!accountId) newErrors.accountId = t('form_error_account');
        if (!date) newErrors.date = t('form_error_date');
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSave = async () => {
        if (!validate()) return;
        
        const transactionData = {
            type,
            amount: parseFloat(amount),
            categoryId: parseInt(categoryId),
            accountId: parseInt(accountId),
            date: new Date(date),
            description
        };

        if (isEditing && transactionToEdit?.id) {
            await updateTransaction(transactionToEdit.id, transactionData);
        } else {
            await addTransaction(transactionData);
        }

        onSave();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-2xl font-bold mb-6 text-center">{isEditing ? t('edit_transaction') : t('add_transaction')}</h2>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setType(TransactionType.EXPENSE)} className={`w-full text-center font-bold py-3 px-4 rounded-full transition-all duration-300 ${type === TransactionType.EXPENSE ? 'bg-pink-500 text-white' : 'bg-white/10 text-gray-200'}`}>{t('expense')}</button>
                    <button onClick={() => setType(TransactionType.INCOME)} className={`w-full text-center font-bold py-3 px-4 rounded-full transition-all duration-300 ${type === TransactionType.INCOME ? 'bg-teal-500 text-white' : 'bg-white/10 text-gray-200'}`}>{t('income')}</button>
                </div>
                <div>
                    <Input type="number" placeholder={t('amount')} value={amount} onChange={e => setAmount(e.target.value)} />
                    {errors.amount && <p className="text-red-400 text-sm mt-1 px-4">{errors.amount}</p>}
                </div>
                <div>
                    <Input placeholder={t('description')} value={description} onChange={e => setDescription(e.target.value)} />
                    {errors.description && <p className="text-red-400 text-sm mt-1 px-4">{errors.description}</p>}
                </div>
                <div>
                    <Select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                        <option value="">{t('category')}</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </Select>
                    {errors.categoryId && <p className="text-red-400 text-sm mt-1 px-4">{errors.categoryId}</p>}
                </div>
                <div>
                    <Select value={accountId} onChange={e => setAccountId(e.target.value)}>
                        <option value="">{t('account')}</option>
                        {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </Select>
                    {errors.accountId && <p className="text-red-400 text-sm mt-1 px-4">{errors.accountId}</p>}
                </div>
                 <div>
                    <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
                    {errors.date && <p className="text-red-400 text-sm mt-1 px-4">{errors.date}</p>}
                </div>
                <div className="flex gap-4 pt-4">
                    <Button onClick={onClose} variant="secondary">{t('cancel')}</Button>
                    <Button onClick={handleSave} variant="primary">{t('save')}</Button>
                </div>
            </div>
        </Modal>
    );
};

export const Transactions = () => {
    const { t } = useI18n();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [categoryStats, setCategoryStats] = useState<Record<number, { percentage: number }>>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState<number | null>(null);
    
    const fetchData = useCallback(async () => {
        // Fetch base data
        const txs = await db.transactions.orderBy('date').reverse().toArray();
        setTransactions(txs);
        const cats = await getCategories();
        setCategories(cats);
        const accs = await getAccounts();
        setAccounts(accs);

        // Calculate stats for the current month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0,0,0,0);

        const monthlyTransactions: Transaction[] = await db.transactions.where('date').aboveOrEqual(startOfMonth).toArray();
        const stats = calculateCategoryStats(monthlyTransactions, cats);
        setCategoryStats(stats);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenAddModal = () => {
        setEditingTransaction(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (tx: Transaction) => {
        setEditingTransaction(tx);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTransaction(null);
    };

    const handleSave = () => {
        fetchData(); // Refresh list after saving
    };

    const handleDeleteRequest = (id?: number) => {
        if (!id) return;
        setTransactionToDelete(id);
        setIsConfirmOpen(true);
    }
    
    const handleDeleteConfirm = async () => {
        if (!transactionToDelete) return;
        await deleteTransaction(transactionToDelete);
        fetchData();
        setIsConfirmOpen(false);
        setTransactionToDelete(null);
    };

    return (
        <Page>
            <div className="fixed bottom-28 right-6 z-20">
                <button 
                    onClick={handleOpenAddModal} 
                    className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white w-16 h-16 rounded-2xl shadow-lg shadow-orange-500/30 flex items-center justify-center transition-transform hover:scale-110 active:scale-95" 
                    aria-label={t('add_transaction')}
                >
                    <PlusIcon className="w-8 h-8" />
                </button>
            </div>
            
            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleDeleteConfirm}
                title={t('confirm_delete_title')}
            >
                <p>{t('confirm_delete_message')}</p>
            </ConfirmationModal>

            <AddTransactionModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                onSave={handleSave} 
                transactionToEdit={editingTransaction}
            />
            
            {transactions.length > 0 ? (
                <ul className="space-y-4">
                    {transactions.map(tx => (
                        tx.id ? <TransactionItem 
                            key={tx.id} 
                            tx={tx} 
                            categories={categories} 
                            accounts={accounts}
                            onEdit={() => handleOpenEditModal(tx)}
                            onDelete={() => handleDeleteRequest(tx.id)}
                            percentage={categoryStats[tx.categoryId]?.percentage || 0}
                            color={getColorForId(tx.categoryId)}
                        /> : null
                    ))}
                </ul>
            ) : (
                <Card>
                    <div className="text-center py-8">
                        <h3 className="text-xl font-semibold text-white">No Transactions Yet</h3>
                        <p className="text-gray-400 mt-2">Tap the orange '+' button to add your first income or expense.</p>
                    </div>
                </Card>
            )}
        </Page>
    );
};