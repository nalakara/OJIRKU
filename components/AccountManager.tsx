
import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Modal, Input, Select, EditIcon, TrashIcon, ConfirmationModal } from './common';
import { useI18n } from '../lib/i18n';
import { db, addAccount, updateAccount, deleteAccount, getTransactionCountForAccount, getAccountBalance } from '../lib/db';
import { Account } from '../types';
import { formatCurrency } from '../lib/utils';

const AddAccountModal = ({ isOpen, onClose, onSave, accountToEdit }: { isOpen: boolean, onClose: () => void, onSave: () => void, accountToEdit: Account | null }) => {
    const { t } = useI18n();
    const [name, setName] = useState('');
    const [type, setType] = useState<Account['type']>('Bank');
    const [initialBalance, setInitialBalance] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const isEditing = !!accountToEdit;

    useEffect(() => {
        setErrors({});
        if (isEditing && accountToEdit) {
            setName(accountToEdit.name);
            setType(accountToEdit.type);
            setInitialBalance(String(accountToEdit.initialBalance));
        } else {
            setName('');
            setType('Bank');
            setInitialBalance('');
        }
    }, [accountToEdit, isOpen]);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!name.trim()) newErrors.name = t('form_error_name');
        if (initialBalance === '' || isNaN(parseFloat(initialBalance))) newErrors.initialBalance = t('form_error_positive_amount');
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSave = async () => {
        if (!validate()) return;
        
        const accountData: Omit<Account, 'id'> = {
            name,
            type,
            initialBalance: parseFloat(initialBalance)
        };

        if (isEditing && accountToEdit?.id) {
            await updateAccount(accountToEdit.id, { name, type }); // Note: Not allowing initialBalance change on edit
        } else {
            await addAccount(accountData);
        }
        onSave();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-[20px] font-bold mb-6 text-center text-white">{isEditing ? t('edit_account') : t('add_account')}</h2>
            <div className="space-y-4">
                <div>
                    <Input placeholder={t('account_name')} value={name} onChange={e => setName(e.target.value)} />
                    {errors.name && <p className="text-red-400 text-[12px] mt-1 px-3">{errors.name}</p>}
                </div>
                <Select value={type} onChange={e => setType(e.target.value as Account['type'])}>
                    <option value="Bank" className="bg-slate-900 text-white">{t('account_type')}: Bank</option>
                    <option value="Cash" className="bg-slate-900 text-white">{t('account_type')}: Cash</option>
                    <option value="Credit Card" className="bg-slate-900 text-white">{t('account_type')}: Credit Card</option>
                    <option value="Investment" className="bg-slate-900 text-white">{t('account_type')}: Investment</option>
                    <option value="E-Wallet" className="bg-slate-900 text-white">{t('account_type')}: E-Wallet</option>
                </Select>
                <div>
                    <Input type="number" placeholder={t('initial_balance')} value={initialBalance} onChange={e => setInitialBalance(e.target.value)} disabled={isEditing} />
                    {errors.initialBalance && <p className="text-red-400 text-[12px] mt-1 px-3">{errors.initialBalance}</p>}
                </div>
                <div className="flex gap-3 pt-3">
                    <Button onClick={onClose} variant="secondary">{t('cancel')}</Button>
                    <Button onClick={handleSave} variant="primary">{t('save')}</Button>
                </div>
            </div>
        </Modal>
    );
};


const AccountItem = ({ account, balance, onEdit, onDelete }: { account: Account, balance: number, onEdit: () => void, onDelete: () => void }) => {
    const { t } = useI18n();
    return (
        <li className="flex items-center justify-between p-3 bg-black/25 backdrop-blur-md rounded-[8px] border border-white/10">
            <div>
                <p className="font-bold text-[14px] text-white">{account.name}</p>
                <p className="text-[12px] text-gray-300">{account.type}</p>
            </div>
            <div className="flex items-center space-x-1">
                <p className="font-semibold text-[14px] text-white mr-2">{formatCurrency(balance)}</p>
                <button onClick={onEdit} className="p-2 rounded-[8px] text-gray-300 hover:text-white hover:bg-white/10" aria-label={t('aria_edit_account') + account.name}><EditIcon className="w-4 h-4"/></button>
                <button onClick={onDelete} className="p-2 rounded-[8px] text-gray-300 hover:text-white hover:bg-white/10" aria-label={t('aria_delete_account') + account.name}><TrashIcon className="w-4 h-4"/></button>
            </div>
        </li>
    );
};


export const AccountManager = () => {
    const { t } = useI18n();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [balances, setBalances] = useState<Record<number, number>>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<Account | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [accountToDelete, setAccountToDelete] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        const accs = await db.accounts.toArray();
        setAccounts(accs);
        const balanceMap: Record<number, number> = {};
        for (const acc of accs) {
            if(acc.id) {
                balanceMap[acc.id] = await getAccountBalance(acc.id);
            }
        }
        setBalances(balanceMap);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenAddModal = () => {
        setEditingAccount(null);
        setIsModalOpen(true);
        setError(null);
    };

    const handleOpenEditModal = (acc: Account) => {
        setEditingAccount(acc);
        setIsModalOpen(true);
        setError(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingAccount(null);
    };
    
    const handleDeleteRequest = async (id?: number) => {
        if (!id) return;
        setError(null);
        const txCount = await getTransactionCountForAccount(id);
        if (txCount > 0) {
            setError(t('item_in_use_error'));
            return;
        }
        setAccountToDelete(id);
        setIsConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!accountToDelete) return;
        await deleteAccount(accountToDelete);
        fetchData();
        setIsConfirmOpen(false);
        setAccountToDelete(null);
    };


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
            <AddAccountModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={fetchData}
                accountToEdit={editingAccount}
            />
            <Card className="bg-white/10 backdrop-blur-md border border-white/15 rounded-[8px]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-[20px] font-bold text-white">{t('manage_accounts')}</h2>
                    <Button onClick={handleOpenAddModal} variant="primary" className="!w-auto px-3 !py-1.5 text-[14px]">{t('add_account')}</Button>
                </div>
                {error && <p className="text-red-400 text-[12px] mb-4 bg-red-950/40 p-2.5 rounded-[8px] border border-red-500/30">{error}</p>}
                {accounts.length > 0 ? (
                    <ul className="space-y-2">
                        {accounts.map(acc => (
                            acc.id ? <AccountItem 
                                key={acc.id} 
                                account={acc} 
                                balance={balances[acc.id] || 0}
                                onEdit={() => handleOpenEditModal(acc)}
                                onDelete={() => handleDeleteRequest(acc.id)}
                            /> : null
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-300 text-[14px] py-4">No accounts found. Click 'Add Account' to start.</p>
                )}
            </Card>
        </>
    );
};