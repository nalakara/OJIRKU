
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
            <h2 className="text-[20px] font-bold mb-6 text-center text-white">{isEditing ? t('edit_category') : t('add_category')}</h2>
            <div className="space-y-4">
                 <div>
                    <Input placeholder={t('category_name')} value={name} onChange={e => setName(e.target.value)} />
                    {error && <p className="text-red-400 text-[12px] mt-1 px-3">{error}</p>}
                </div>
                <div className="flex gap-3 pt-3">
                    <Button onClick={onClose} variant="secondary">{t('cancel')}</Button>
                    <Button onClick={handleSave} variant="primary">{t('save')}</Button>
                </div>
            </div>
        </Modal>
    );
};

const CategoryItem = ({ category, onEdit, onDelete, percentage, color }: { category: Category, onEdit: () => void, onDelete: () => void, percentage: number, color: string }) => {
    const { t } = useI18n();
    return (
        <li className="flex items-center justify-between p-3 bg-black/25 backdrop-blur-md rounded-[8px] border border-white/10">
            <div className="flex items-center gap-3">
                <RadialProgress percentage={percentage} color={color} />
                <p className="font-semibold text-[14px] text-white">{category.name}</p>
            </div>
            <div className="flex items-center space-x-1">
                <button onClick={onEdit} className="p-2 rounded-[8px] text-gray-300 hover:text-white hover:bg-white/10" aria-label={t('aria_edit_category') + category.name}><EditIcon className="w-4 h-4"/></button>
                <button onClick={onDelete} className="p-2 rounded-[8px] text-gray-300 hover:text-white hover:bg-white/10" aria-label={t('aria_delete_category') + category.name}><TrashIcon className="w-4 h-4"/></button>
            </div>
        </li>
    );
};

const CollapsibleSection = ({ title, action, children, defaultOpen = true }: { title: string; action: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-[8px] overflow-hidden transition-all duration-200">
            <div className="flex justify-between items-center p-3 cursor-pointer select-none" onClick={() => setIsOpen(!isOpen)} role="button" aria-expanded={isOpen}>
                <h3 className="text-[14px] font-bold text-white">{title}</h3>
                <div className="flex items-center gap-2">
                    <div onClick={e => e.stopPropagation()}>
                        {action}
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 text-gray-300 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                        <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
            {isOpen && (
                <div className="px-3 pb-3">
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
            
            <div className="space-y-3">
                <h2 className="text-[20px] font-bold text-white">{t('manage_categories')}</h2>
                {error && <p className="text-red-400 text-[12px] mb-4 bg-red-950/40 p-2.5 rounded-[8px] border border-red-500/30">{error}</p>}

                <div className="space-y-3">
                    <CollapsibleSection
                        title={t('expense_categories')}
                        action={
                            <Button onClick={() => handleOpenAddModal(TransactionType.EXPENSE)} variant="primary" className="!w-auto px-3 !py-1 text-[12px]">{t('add')}</Button>
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
                            <p className="text-center text-gray-300 text-[14px] py-2">No expense categories found.</p>
                        )}
                    </CollapsibleSection>

                    <CollapsibleSection
                        title={t('income_categories')}
                        action={
                            <Button onClick={() => handleOpenAddModal(TransactionType.INCOME)} variant="primary" className="!w-auto px-3 !py-1 text-[12px]">{t('add')}</Button>
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
                             <p className="text-center text-gray-300 text-[14px] py-2">No income categories found.</p>
                        )}
                    </CollapsibleSection>
                </div>
            </div>
        </>
    );
};