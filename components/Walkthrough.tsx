import React, { useEffect, useCallback } from 'react';
import { useI18n } from '../lib/i18n';
import { Button, Card } from './common';

export interface WalkthroughStep {
    id: string;
    titleKey: string;
    descKey: string;
    targetPage: string;
    iconType: 'welcome' | 'data' | 'pin' | 'dashboard' | 'accounts' | 'transactions' | 'budgets' | 'debts' | 'goals' | 'reports' | 'ai' | 'finish';
    highlightTextKey?: string;
    actionType?: 'try_transaction';
}

export const WALKTHROUGH_STEPS: WalkthroughStep[] = [
    {
        id: 'welcome',
        titleKey: 'wt_welcome_title',
        descKey: 'wt_welcome_desc',
        targetPage: 'dashboard',
        iconType: 'welcome'
    },
    {
        id: 'data',
        titleKey: 'wt_data_title',
        descKey: 'wt_data_desc',
        targetPage: 'dashboard',
        iconType: 'data'
    },
    {
        id: 'pin',
        titleKey: 'wt_pin_title',
        descKey: 'wt_pin_desc',
        targetPage: 'dashboard',
        iconType: 'pin'
    },
    {
        id: 'dashboard',
        titleKey: 'wt_dashboard_title',
        descKey: 'wt_dashboard_desc',
        targetPage: 'dashboard',
        iconType: 'dashboard'
    },
    {
        id: 'accounts',
        titleKey: 'wt_accounts_title',
        descKey: 'wt_accounts_desc',
        targetPage: 'settings',
        iconType: 'accounts'
    },
    {
        id: 'transactions',
        titleKey: 'wt_transactions_title',
        descKey: 'wt_transactions_desc',
        targetPage: 'transactions',
        iconType: 'transactions',
        actionType: 'try_transaction'
    },
    {
        id: 'budgets',
        titleKey: 'wt_budgets_title',
        descKey: 'wt_budgets_desc',
        targetPage: 'budgets',
        iconType: 'budgets'
    },
    {
        id: 'debts',
        titleKey: 'wt_debts_title',
        descKey: 'wt_debts_desc',
        targetPage: 'debts',
        iconType: 'debts'
    },
    {
        id: 'goals',
        titleKey: 'wt_goals_title',
        descKey: 'wt_goals_desc',
        targetPage: 'goals',
        iconType: 'goals'
    },
    {
        id: 'reports',
        titleKey: 'wt_reports_title',
        descKey: 'wt_reports_desc',
        targetPage: 'reports',
        iconType: 'reports'
    },
    {
        id: 'ai',
        titleKey: 'wt_ai_title',
        descKey: 'wt_ai_desc',
        targetPage: 'ai_suggestions',
        iconType: 'ai'
    },
    {
        id: 'finish',
        titleKey: 'wt_finish_title',
        descKey: 'wt_finish_desc',
        targetPage: 'dashboard',
        iconType: 'finish'
    }
];

const StepIcon = ({ type }: { type: WalkthroughStep['iconType'] }) => {
    switch (type) {
        case 'welcome':
            return (
                <div className="w-12 h-12 rounded-[8px] bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.69Z" /><path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" /></svg>
                </div>
            );
        case 'data':
            return (
                <div className="w-12 h-12 rounded-[8px] bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
                </div>
            );
        case 'pin':
            return (
                <div className="w-12 h-12 rounded-[8px] bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" /></svg>
                </div>
            );
        case 'dashboard':
            return (
                <div className="w-12 h-12 rounded-[8px] bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" /></svg>
                </div>
            );
        case 'accounts':
            return (
                <div className="w-12 h-12 rounded-[8px] bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M21 18v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1h-9a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9zm-9-2h10V8H12v8zm4-2.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" /></svg>
                </div>
            );
        case 'transactions':
            return (
                <div className="w-12 h-12 rounded-[8px] bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" /></svg>
                </div>
            );
        case 'budgets':
            return (
                <div className="w-12 h-12 rounded-[8px] bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-pink-500/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M10.5 4.5a7.5 7.5 0 0 0-7.5 7.5h7.5V4.5Z" /><path d="M13.5 4.5v7.5h7.5a7.5 7.5 0 0 0-7.5-7.5Z" /><path d="M4.5 13.5h7.5v7.5a7.5 7.5 0 0 0 7.5-7.5h-15Z" /></svg>
                </div>
            );
        case 'debts':
            return (
                <div className="w-12 h-12 rounded-[8px] bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-red-500/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z" /><path fillRule="evenodd" d="M3.087 9l.54 9.176A3 3 0 0 0 6.623 21h10.754a3 3 0 0 0 2.996-2.824L20.913 9H3.087Zm6.163 3.75a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" /></svg>
                </div>
            );
        case 'goals':
            return (
                <div className="w-12 h-12 rounded-[8px] bg-gradient-to-br from-lime-400 to-green-600 flex items-center justify-center text-white shadow-lg shadow-green-500/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1.5a.75.75 0 0 1 .75.75V3a.75.75 0 0 1-1.5 0V2.25A.75.75 0 0 1 12 1.5ZM12 21a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 12 21ZM22.5 12a.75.75 0 0 1-.75.75H21a.75.75 0 0 1 0-1.5h.75a.75.75 0 0 1 .75.75ZM3 12a.75.75 0 0 1-.75.75H1.5a.75.75 0 0 1 0-1.5H2.25A.75.75 0 0 1 3 12Z" /><path fillRule="evenodd" d="M12 4.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15ZM1.5 12a10.5 10.5 0 1 1 21 0 10.5 10.5 0 0 1-21 0Z" clipRule="evenodd" /></svg>
                </div>
            );
        case 'reports':
            return (
                <div className="w-12 h-12 rounded-[8px] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3v18h18v-2H5V3H3zm4 14h2v-5H7v5zm4 0h2V7h-2v10zm4 0h2v-8h-2v8zm4 0h2V4h-2v13z" /></svg>
                </div>
            );
        case 'ai':
            return (
                <div className="w-12 h-12 rounded-[8px] bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M15.75 2.25a.75.75 0 0 1 .75.75v.75h.75a.75.75 0 0 1 0 1.5h-.75v.75a.75.75 0 0 1-1.5 0v-.75h-.75a.75.75 0 0 1 0-1.5h.75V3a.75.75 0 0 1 .75-.75Zm-7.5 0a.75.75 0 0 1 .75.75v.75h.75a.75.75 0 0 1 0 1.5h-.75v.75a.75.75 0 0 1-1.5 0v-.75h-.75a.75.75 0 0 1 0-1.5h.75V3a.75.75 0 0 1 .75-.75ZM12 8.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Z" clipRule="evenodd" /></svg>
                </div>
            );
        case 'finish':
            return (
                <div className="w-12 h-12 rounded-[8px] bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
            );
        default:
            return null;
    }
};

interface WalkthroughProps {
    isOpen: boolean;
    currentStepIndex: number;
    onNext: () => void;
    onPrev: () => void;
    onSkip: () => void;
    onFinish: () => void;
}

export const WalkthroughModal = ({
    isOpen,
    currentStepIndex,
    onNext,
    onPrev,
    onSkip,
    onFinish,
}: WalkthroughProps) => {
    const { t } = useI18n();

    const currentStep = WALKTHROUGH_STEPS[currentStepIndex] || WALKTHROUGH_STEPS[0];
    const totalSteps = WALKTHROUGH_STEPS.length;
    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === totalSteps - 1;

    // Keyboard navigation
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isOpen) return;
        if (e.key === 'Escape') {
            onSkip();
        } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
            if (isLastStep) {
                onFinish();
            } else {
                onNext();
            }
        } else if (e.key === 'ArrowLeft') {
            if (!isFirstStep) {
                onPrev();
            }
        }
    }, [isOpen, isFirstStep, isLastStep, onNext, onPrev, onSkip, onFinish]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-all duration-300 animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="walkthrough-step-title"
        >
            <div className="w-full max-w-lg bg-slate-900/95 border border-white/20 rounded-[8px] shadow-2xl p-6 sm:p-7 relative overflow-hidden backdrop-blur-2xl">
                {/* Background Accent Glow */}
                <div className="absolute -top-16 -right-16 w-36 h-36 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

                {/* Header: Badge, Progress & Skip */}
                <div className="flex items-center justify-between gap-2 mb-6">
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-white/10 text-orange-300 rounded-[4px] border border-orange-400/20">
                            OJIRKU Tour
                        </span>
                        <span className="text-[12px] text-gray-300 font-medium">
                            {t('walkthrough_step')} {currentStepIndex + 1} {t('walkthrough_of')} {totalSteps}
                        </span>
                    </div>
                    <button 
                        onClick={onSkip} 
                        className="text-[12px] font-medium text-gray-400 hover:text-white px-2 py-1 rounded-[6px] hover:bg-white/10 transition-colors"
                        aria-label={t('walkthrough_skip')}
                    >
                        {t('walkthrough_skip')}
                    </button>
                </div>

                {/* Step Content */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                    <StepIcon type={currentStep.iconType} />
                    <div className="flex-grow min-w-0">
                        <h3 id="walkthrough-step-title" className="text-[18px] sm:text-[20px] font-bold text-white tracking-tight leading-snug">
                            {t(currentStep.titleKey as any)}
                        </h3>
                    </div>
                </div>

                <div className="bg-black/30 border border-white/10 rounded-[8px] p-4 mb-6 text-[14px] text-gray-200 leading-relaxed space-y-2">
                    <p>{t(currentStep.descKey as any)}</p>
                </div>

                {/* Step Progress Dots */}
                <div className="flex justify-center items-center gap-1.5 mb-6" aria-hidden="true">
                    {WALKTHROUGH_STEPS.map((_, idx) => (
                        <span
                            key={idx}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                idx === currentStepIndex
                                    ? 'w-6 bg-gradient-to-r from-yellow-400 to-orange-500'
                                    : idx < currentStepIndex
                                    ? 'w-2 bg-teal-400/80'
                                    : 'w-2 bg-white/20'
                            }`}
                        />
                    ))}
                </div>

                {/* Actions Footer */}
                <div className="flex items-center justify-between gap-3 pt-2">
                    <Button 
                        onClick={onPrev}
                        variant="secondary"
                        disabled={isFirstStep}
                        className={`!w-auto px-4 !py-2 text-[13px] ${isFirstStep ? 'invisible' : ''}`}
                    >
                        {t('walkthrough_back')}
                    </Button>

                    <div className="flex items-center gap-2">
                        {isLastStep ? (
                            <Button 
                                onClick={onFinish}
                                variant="primary"
                                className="!w-auto px-6 !py-2 text-[14px] font-bold shadow-lg"
                            >
                                {t('walkthrough_finish')}
                            </Button>
                        ) : (
                            <Button 
                                onClick={onNext}
                                variant="primary"
                                className="!w-auto px-6 !py-2 text-[14px] font-bold shadow-lg"
                            >
                                {t('walkthrough_next')} &rarr;
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
