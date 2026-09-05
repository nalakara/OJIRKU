
import React, { useEffect, useState, useCallback } from 'react';
import { Page } from './Layout';
import { Card, Button, Modal, Input, TrashIcon, ConfirmationModal } from './common';
import { useI18n } from '../lib/i18n';
import { db, addGoal, updateGoal, deleteGoal } from '../lib/db';
import { Goal } from '../types';
import { formatCurrency } from '../lib/utils';

const GoalItem = ({ goal, onUpdate, onDelete }: { goal: Goal, onUpdate: () => void, onDelete: () => void }) => {
    const { t } = useI18n();
    const percentage = goal.targetAmount > 0 ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100) : 0;
    const [addAmount, setAddAmount] = useState('');

    const handleAdd = async () => {
        if (!addAmount || parseFloat(addAmount) <= 0) return;
        const newAmount = goal.currentAmount + parseFloat(addAmount);
        if (goal.id) {
            await updateGoal(goal.id, { currentAmount: newAmount });
            setAddAmount('');
            onUpdate();
        }
    };

    return (
        <Card className="bg-white/10 backdrop-blur-md border border-white/15 rounded-[8px]">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <span className="font-bold text-[14px] text-white">{goal.name}</span>
                    <p className="font-semibold text-[12px] text-gray-300">{formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}</p>
                </div>
                <button onClick={onDelete} className="p-2 -mt-2 -mr-2 rounded-[8px] text-gray-300 hover:text-white hover:bg-white/10" aria-label={t('aria_delete_goal') + goal.name}><TrashIcon className="w-4 h-4"/></button>
            </div>
            
            <div className="w-full bg-black/30 rounded-[4px] h-3.5">
                <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-3.5 rounded-[4px] flex items-center justify-center text-[10px] text-white font-bold" style={{ width: `${percentage}%` }}>
                    {percentage > 15 && `${Math.round(percentage)}%`}
                </div>
            </div>
            <div className="flex gap-2 mt-3">
                <Input type="number" value={addAmount} onChange={e => setAddAmount(e.target.value)} placeholder={t('amount')} className="!py-1.5 text-[14px]" />
                <Button onClick={handleAdd} variant="primary" className="!w-auto px-4 !py-1.5 text-[14px]" disabled={!addAmount || parseFloat(addAmount) <= 0} aria-label={t('aria_add_to_goal') + goal.name}>{t('add')}</Button>
            </div>
        </Card>
    );
};

const AddGoalModal = ({ isOpen, onClose, onSave }: { isOpen: boolean, onClose: () => void, onSave: () => void }) => {
    const { t } = useI18n();
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen) {
            setName('');
            setTargetAmount('');
            setErrors({});
        }
    }, [isOpen]);
    
    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!name.trim()) newErrors.name = t('form_error_name');
        if (Number(targetAmount) <= 0) newErrors.targetAmount = t('form_error_target_amount');
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSave = async () => {
        if (!validate()) return;

        await addGoal({
            name,
            targetAmount: parseFloat(targetAmount),
            currentAmount: 0
        });
        onSave();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-[20px] font-bold mb-6 text-center text-white">{t('add_goal')}</h2>
            <div className="space-y-4">
                <div>
                    <Input placeholder={t('goal_name')} value={name} onChange={e => setName(e.target.value)} />
                    {errors.name && <p className="text-red-400 text-[12px] mt-1 px-3">{errors.name}</p>}
                </div>
                <div>
                    <Input type="number" placeholder={t('target_amount')} value={targetAmount} onChange={e => setTargetAmount(e.target.value)} />
                    {errors.targetAmount && <p className="text-red-400 text-[12px] mt-1 px-3">{errors.targetAmount}</p>}
                </div>
                <div className="flex gap-3 pt-3">
                    <Button onClick={onClose} variant="secondary">{t('cancel')}</Button>
                    <Button onClick={handleSave} variant="primary">{t('save')}</Button>
                </div>
            </div>
        </Modal>
    );
};

export const Goals = () => {
    const { t } = useI18n();
    const [goals, setGoals] = useState<Goal[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [goalToDelete, setGoalToDelete] = useState<number | null>(null);

    const fetchData = useCallback(async () => {
        setGoals(await db.goals.toArray());
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDeleteRequest = (id?: number) => {
        if (!id) return;
        setGoalToDelete(id);
        setIsConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!goalToDelete) return;
        await deleteGoal(goalToDelete);
        fetchData();
        setIsConfirmOpen(false);
        setGoalToDelete(null);
    };

    return (
        <Page>
            <AddGoalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={fetchData} />
            <ConfirmationModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleDeleteConfirm}
                title={t('confirm_delete_title')}
            >
                <p>{t('confirm_delete_message')}</p>
            </ConfirmationModal>

            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-[20px] font-bold text-white">{t('financial_goals')}</h2>
                    <p className="text-[12px] text-gray-300 mt-0.5">{t('virtual_goal_notice')}</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} variant="primary" className="!w-auto px-4 !py-2">
                    {t('add_goal')}
                </Button>
            </div>
            {goals.length > 0 ? (
                <div className="space-y-3">
                    {goals.map(goal => (
                        <GoalItem key={goal.id} goal={goal} onUpdate={fetchData} onDelete={() => handleDeleteRequest(goal.id)} />
                    ))}
                </div>
            ) : (
                <Card className="bg-white/10 backdrop-blur-md border border-white/15 rounded-[8px]">
                    <div className="text-center py-8">
                        <h2 className="text-[20px] font-bold text-white">No Financial Goals Yet</h2>
                        <p className="text-gray-300 text-[14px] mt-2">Set a goal to start saving for your dreams!</p>
                        <Button onClick={() => setIsModalOpen(true)} variant="primary" className="mt-6 !w-auto px-6">
                            {t('add_goal')}
                        </Button>
                    </div>
                </Card>
            )}
        </Page>
    );
};