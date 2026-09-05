
import React, { useState, useEffect, useCallback } from 'react';
import { Page } from './Layout';
import { Button, Modal, Input, Select, TrashIcon, ConfirmationModal, Card } from './common';
import { useI18n } from '../lib/i18n';
import { db, addDebt, updateDebt, deleteDebt, addDebtPayment, getDebtPayments, getAccounts } from '../lib/db';
import { Debt, DebtPayment, Account } from '../types';
import { formatCurrency } from '../lib/utils';

const AddDebtModal = ({ isOpen, onClose, onSave }: { isOpen: boolean, onClose: () => void, onSave: () => void }) => {
    const { t } = useI18n();
    const [name, setName] = useState('');
    const [lender, setLender] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            setName('');
            setLender('');
            setTotalAmount('');
            setDueDate('');
            setErrors({});
        }
    }, [isOpen]);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!name.trim()) newErrors.name = t('form_error_name');
        if (Number(totalAmount) <= 0) newErrors.totalAmount = t('form_error_positive_amount');
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSave = async () => {
        if (!validate()) return;
        const debtData: Omit<Debt, 'id' | 'amountPaid'> = {
            name,
            lender,
            totalAmount: parseFloat(totalAmount),
        };
        if(dueDate) debtData.dueDate = new Date(dueDate);

        await addDebt(debtData);
        onSave();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-[20px] font-bold mb-6 text-center text-white">{t('add_debt')}</h2>
            <div className="space-y-4">
                <div>
                    <Input placeholder={t('debt_name')} value={name} onChange={e => setName(e.target.value)} />
                    {errors.name && <p className="text-red-400 text-[12px] mt-1 px-3">{errors.name}</p>}
                </div>
                <div>
                    <Input placeholder={t('lender')} value={lender} onChange={e => setLender(e.target.value)} />
                </div>
                <div>
                    <Input type="number" placeholder={t('total_amount')} value={totalAmount} onChange={e => setTotalAmount(e.target.value)} />
                    {errors.totalAmount && <p className="text-red-400 text-[12px] mt-1 px-3">{errors.totalAmount}</p>}
                </div>
                <div>
                    <Input type="date" placeholder={t('due_date')} value={dueDate} onChange={e => setDueDate(e.target.value)} />
                </div>
                <div className="flex gap-3 pt-3">
                    <Button onClick={onClose} variant="secondary">{t('cancel')}</Button>
                    <Button onClick={handleSave} variant="primary">{t('save')}</Button>
                </div>
            </div>
        </Modal>
    );
};

const MakePaymentModal = ({ isOpen, onClose, onSave, debt }: { isOpen: boolean, onClose: () => void, onSave: () => void, debt: Debt | null }) => {
    const { t } = useI18n();
    const [amount, setAmount] = useState('');
    const [accountId, setAccountId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            getAccounts().then(setAccounts);
            setAmount('');
            setAccountId('');
            setDate(new Date().toISOString().split('T')[0]);
            setErrors({});
        }
    }, [isOpen]);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (Number(amount) <= 0) newErrors.amount = t('form_error_positive_amount');
        if (!accountId) newErrors.accountId = t('form_error_account');
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!debt || !validate()) return;

        const paymentData: Omit<DebtPayment, 'id'> = {
            debtId: debt.id!,
            accountId: parseInt(accountId),
            amount: parseFloat(amount),
            date: new Date(date),
        };

        await addDebtPayment(paymentData);
        onSave();
        onClose();
    };

    if (!debt) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-[20px] font-bold mb-6 text-center text-white">{t('make_payment')} for {debt.name}</h2>
            <div className="space-y-4">
                <div>
                    <Input type="number" placeholder={t('amount')} value={amount} onChange={e => setAmount(e.target.value)} />
                    {errors.amount && <p className="text-red-400 text-[12px] mt-1 px-3">{errors.amount}</p>}
                </div>
                <div>
                    <Select value={accountId} onChange={e => setAccountId(e.target.value)}>
                        <option value="">{t('account')}</option>
                        {accounts.map(a => <option key={a.id} value={a.id} className="bg-slate-900 text-white">{a.name}</option>)}
                    </Select>
                    {errors.accountId && <p className="text-red-400 text-[12px] mt-1 px-3">{errors.accountId}</p>}
                </div>
                <div>
                    <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div className="flex gap-3 pt-3">
                    <Button onClick={onClose} variant="secondary">{t('cancel')}</Button>
                    <Button onClick={handleSave} variant="primary">{t('save')}</Button>
                </div>
            </div>
        </Modal>
    );
};

const PaymentHistoryModal = ({ isOpen, onClose, debt }: { isOpen: boolean, onClose: () => void, debt: Debt | null }) => {
    const { t } = useI18n();
    const [payments, setPayments] = useState<DebtPayment[]>([]);

    useEffect(() => {
        if (isOpen && debt?.id) {
            getDebtPayments(debt.id).then(setPayments);
        }
    }, [isOpen, debt]);
    
    if (!debt) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
             <h2 className="text-[20px] font-bold mb-2 text-center text-white">{t('payment_history')}</h2>
             <p className="text-[14px] text-gray-300 mb-6 text-center">{debt.name}</p>

            {payments.length > 0 ? (
                 <ul className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {payments.map(p => (
                        <li key={p.id} className="flex justify-between items-center bg-black/30 p-3 rounded-[8px] border border-white/10">
                            <p className="text-white font-semibold text-[14px]">{formatCurrency(p.amount)}</p>
                            <p className="text-[12px] text-gray-400">{new Date(p.date).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-300 text-[14px] py-4">{t('no_payments_yet')}</p>
            )}

            <div className="mt-6">
                <Button onClick={onClose} variant="secondary">{t('back')}</Button>
            </div>
        </Modal>
    );
};

const DebtItem = ({ debt, onMakePayment, onShowHistory, onDelete }: { debt: Debt, onMakePayment: () => void, onShowHistory: () => void, onDelete: () => void }) => {
    const { t } = useI18n();
    const percentage = debt.totalAmount > 0 ? (debt.amountPaid / debt.totalAmount) * 100 : 0;
    const remaining = debt.totalAmount - debt.amountPaid;

    return (
        <Card className="bg-white/10 backdrop-blur-md border border-white/15 rounded-[8px]">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <span className="font-bold text-[14px] text-white">{debt.name}</span>
                    <p className="text-[12px] text-gray-300">{debt.lender}</p>
                </div>
                <button onClick={onDelete} className="p-2 -mt-2 -mr-2 rounded-[8px] text-gray-300 hover:text-white hover:bg-white/10"><TrashIcon className="w-4 h-4" /></button>
            </div>

            <div className="w-full bg-black/30 rounded-[4px] h-2.5 my-3">
                <div className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2.5 rounded-[4px]" style={{ width: `${percentage}%` }}></div>
            </div>
            
            <div className="flex justify-between text-[12px] mb-4">
                <span className="text-gray-300">{t('paid')}: <span className="font-semibold text-white">{formatCurrency(debt.amountPaid)}</span></span>
                <span className="text-gray-300">{t('remaining')}: <span className="font-semibold text-white">{formatCurrency(remaining)}</span></span>
            </div>

            <div className="flex gap-2 mt-4 text-[14px]">
                <Button onClick={onShowHistory} variant="secondary" className="!py-1.5 text-[12px] flex-1">{t('payment_history')}</Button>
                <Button onClick={onMakePayment} variant="primary" className="!py-1.5 text-[12px] flex-1" disabled={remaining <= 0}>{t('make_payment')}</Button>
            </div>
        </Card>
    );
};


export const Debts = () => {
    const { t } = useI18n();
    const [debts, setDebts] = useState<Debt[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [debtToDelete, setDebtToDelete] = useState<number | null>(null);

    const fetchData = useCallback(async () => {
        setDebts(await db.debts.toArray());
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenPaymentModal = (debt: Debt) => {
        setSelectedDebt(debt);
        setIsPaymentModalOpen(true);
    };

    const handleOpenHistoryModal = (debt: Debt) => {
        setSelectedDebt(debt);
        setIsHistoryModalOpen(true);
    };

    const handleDeleteRequest = (id?: number) => {
        if (!id) return;
        setDebtToDelete(id);
        setIsConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!debtToDelete) return;
        await deleteDebt(debtToDelete);
        fetchData();
        setIsConfirmOpen(false);
        setDebtToDelete(null);
    };

    return (
        <Page>
            <AddDebtModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={fetchData} />
            <MakePaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} onSave={fetchData} debt={selectedDebt} />
            <PaymentHistoryModal isOpen={isHistoryModalOpen} onClose={() => setIsHistoryModalOpen(false)} debt={selectedDebt} />
            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleDeleteConfirm}
                title={t('confirm_delete_title')}
            >
                <p>{t('confirm_delete_message')}</p>
            </ConfirmationModal>

            <div className="flex justify-between items-center">
                <h2 className="text-[20px] font-bold text-white">{t('manage_debts')}</h2>
                <Button onClick={() => setIsAddModalOpen(true)} variant="primary" className="!w-auto px-4 !py-2">
                    {t('add_debt')}
                </Button>
            </div>
            
            {debts.length > 0 ? (
                <div className="space-y-3">
                    {debts.map(debt => (
                        <DebtItem
                            key={debt.id}
                            debt={debt}
                            onMakePayment={() => handleOpenPaymentModal(debt)}
                            onShowHistory={() => handleOpenHistoryModal(debt)}
                            onDelete={() => handleDeleteRequest(debt.id)}
                        />
                    ))}
                </div>
            ) : (
                <Card className="bg-white/10 backdrop-blur-md border border-white/15 rounded-[8px]">
                    <div className="text-center py-8">
                        <h2 className="text-[20px] font-bold text-white">{t('no_debts_yet')}</h2>
                        <p className="text-gray-300 text-[14px] mt-2">Add loans or credit card balances to track your progress paying them off.</p>
                        <Button onClick={() => setIsAddModalOpen(true)} variant="primary" className="mt-6 !w-auto px-6">
                            {t('add_debt')}
                        </Button>
                    </div>
                </Card>
            )}
        </Page>
    );
};