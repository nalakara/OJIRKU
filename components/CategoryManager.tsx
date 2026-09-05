
import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Modal, Input, EditIcon, TrashIcon, ConfirmationModal, RadialProgress } from './common';
import { useI18n } from '../lib/i18n';
import { db, addCategory, updateCategory, deleteCategory, getTransactionCountForCategory } from '../lib/db';
import { Category, Transaction, TransactionType } from '../types';
import { getColorForId, calculateCategoryStats } from '../lib/utils';

const AddCategoryModal = ({ isOpen, onClose, onSave, categoryToEdit, type }: { isOpen: boolean, onClose: () => void, onSave: () => void, categoryToEdit: Category | null, type: TransactionType }) => {
    const { t } = useI18n();
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const isEditing = !!categoryToEdit;

    useEffect(() => {
        setError('');
        if (isEditing && categoryToEdit) {
            setName(categoryToEdit.name);
        } else {
            setName('');
        }
    }, [categoryToEdit, isOpen]);

    const handleSave = async () => {
        if (!name.trim()) {
            setError(t('form_error_name'));
            return;
        }
        
        const categoryData = { name, type };

        if (isEditing && categoryToEdit?.id) {
            await updateCategory(categoryToEdit.id, { name });
        } else {
            await addCategory(categoryData as Category);
        }
        onSave();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-2xl font-bold mb-6 text-center">{isEditing ? t('edit_category') : t('add_category')}</h2>
            <div className="space-y-4">
                 <div>
                    <Input placeholder={t('category_name')} value={name} onChange={e => setName(e.target.value)} />
                    {error && <p className="text-red-400 text-sm mt-1 px-4">{error}</p>}
                </div>
                <div className="flex gap-4 pt-4">
                    <Button onClick={onClose} variant="secondary">{t('cancel')}</Button>
                    <Button onClick={handleSave}>{t('save')}</Button>
                </div>
            </div>
        </Modal>
    );
};

const CategoryItem = ({ category, onEdit, onDelete, percentage, color }: { category: Category, onEdit: () => void, onDelete: () => void, percentage: number, color: string }) => {
    const { t } = useI18n();
    return (
        <li className="flex items-center justify-between p-3 bg-black/30 rounded-xl">
            <div className="flex items-center gap-4">
                <RadialProgress percentage={percentage} color={color} />
                <p className="font-semibold text-white">{category.name}</p>
            </div>
            <div className="flex items-center space-x-1">
                <button onClick={onEdit} className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10" aria-label={t('aria_edit_category') + category.name}><EditIcon className="w-5 h-5"/></button>
                <button onClick={onDelete} className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10" aria-label={t('aria_delete_category') + category.name}><TrashIcon className="w-5 h-5"/></button>
            </div>
        </li>
    );
};

const CollapsibleSection = ({ title, action, children, defaultOpen = true }: { title: string; action: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300">
            <div className="flex justify-between items-center p-4 cursor-pointer" onClick={() => setIsOpen(!isOpen)} role="button" aria-expanded={isOpen}>
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <div className="flex items-center gap-2">
                    <div onClick={e => e.stopPropagation()}>
                        {action}
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
            {isOpen && (
                <div className="px-4 pb-4">
                    {children}
                </div>
            )}
        </div>
    );
};

export const CategoryManager = () => {
    const { t } = useI18n();
    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryStats, setCategoryStats] = useState<Record<number, { percentage: number }>>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [modalType, setModalType] = useState<TransactionType>(TransactionType.EXPENSE);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        const cats = await db.categories.toArray();
        setCategories(cats);

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

    const handleOpenAddModal = (type: TransactionType) => {
        setEditingCategory(null);
        setModalType(type);
        setIsModalOpen(true);
        setError(null);
    };

    const handleOpenEditModal = (cat: Category) => {
        setEditingCategory(cat);
        setModalType(cat.type);
        setIsModalOpen(true);
        setError(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };
    
    const handleDeleteRequest = async (id?: number) => {
        if (!id) return;
        setError(null);
        const txCount = await getTransactionCountForCategory(id);
        const budgetCount = await db.budgets.where({categoryId: id}).count();
        if (txCount > 0 || budgetCount > 0) {
            setError(t('item_in_use_error'));
            return;
        }
        setCategoryToDelete(id);
        setIsConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!categoryToDelete) return;
        await deleteCategory(categoryToDelete);
        fetchData();
        setIsConfirmOpen(false);
        setCategoryToDelete(null);
    }

    const incomeCategories = categories.filter(c => c.type === TransactionType.INCOME);
    const expenseCategories = categories.filter(c => c.type === TransactionType.EXPENSE);

    return (
        <>
            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleDeleteConfirm}
                title={t('confirm_delete_title')}
            >
                <p>{t('confirm_delete_message')}</p>
            </ConfirmationModal>
            <AddCategoryModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={fetchData}
                categoryToEdit={editingCategory}
                type={modalType}
            />
            
            <div>
                <h2 className="text-xl font-bold text-white mb-4">{t('manage_categories')}</h2>
                {error && <p className="text-red-400 mb-4 bg-red-900/50 p-3 rounded-xl border border-red-500/50">{error}</p>}

                <div className="space-y-3">
                    <CollapsibleSection
                        title={t('expense_categories')}
                        action={
                            <Button onClick={() => handleOpenAddModal(TransactionType.EXPENSE)} variant="secondary" className="!w-auto px-4 !py-1 text-sm">{t('add')}</Button>
                        }
                        defaultOpen={false}
                    >
                         {expenseCategories.length > 0 ? (
                            <ul className="space-y-2">
                                {expenseCategories.map(cat => cat.id ? (
                                    <CategoryItem 
                                        key={cat.id} 
                                        category={cat} 
                                        onEdit={() => handleOpenEditModal(cat)} 
                                        onDelete={() => handleDeleteRequest(cat.id)}
                                        percentage={categoryStats[cat.id]?.percentage || 0}
                                        color={getColorForId(cat.id)}
                                    />
                                ) : null)}
                            </ul>
                        ) : (
                            <p className="text-center text-gray-400 py-2">No expense categories found.</p>
                        )}
                    </CollapsibleSection>

                    <CollapsibleSection
                        title={t('income_categories')}
                        action={
                            <Button onClick={() => handleOpenAddModal(TransactionType.INCOME)} variant="secondary" className="!w-auto px-4 !py-1 text-sm">{t('add')}</Button>
                        }
                        defaultOpen={false}
                    >
                        {incomeCategories.length > 0 ? (
                            <ul className="space-y-2">
                                {incomeCategories.map(cat => cat.id ? (
                                    <CategoryItem 
                                        key={cat.id} 
                                        category={cat} 
                                        onEdit={() => handleOpenEditModal(cat)} 
                                        onDelete={() => handleDeleteRequest(cat.id)}
                                        percentage={categoryStats[cat.id]?.percentage || 0}
                                        color={getColorForId(cat.id)}
                                    />
                                ) : null)}
                            </ul>
                        ) : (
                             <p className="text-center text-gray-400 py-2">No income categories found.</p>
                        )}
                    </CollapsibleSection>
                </div>
            </div>
        </>
    );
};