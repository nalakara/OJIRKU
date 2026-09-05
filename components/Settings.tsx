import React, { useState, useEffect } from 'react';
import { Page } from './Layout';
import { Card, Button, Select, Input } from './common';
import { useI18n } from '../lib/i18n';
import { useAuth } from '../lib/auth';
import { db, setSetting } from '../lib/db';
import { AccountManager } from './AccountManager';
import { CategoryManager } from './CategoryManager';
import { getMaskedApiKey, setStoredApiKey, removeStoredApiKey } from '../services/geminiService';

export const Settings = () => {
    const { t, language, setLanguage } = useI18n();
    const { logout } = useAuth();
    const [isExporting, setIsExporting] = useState(false);
    const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
    const [apiKeyMasked, setApiKeyMasked] = useState<string | null>(() => getMaskedApiKey());
    const [apiKeyInput, setApiKeyInput] = useState('');
    const [isEditingApiKey, setIsEditingApiKey] = useState(false);

    const handleSaveApiKey = () => {
        if (!apiKeyInput.trim()) return;
        setStoredApiKey(apiKeyInput.trim());
        setApiKeyMasked(getMaskedApiKey());
        setApiKeyInput('');
        setIsEditingApiKey(false);
    };

    const handleRemoveApiKey = () => {
        removeStoredApiKey();
        setApiKeyMasked(null);
        setApiKeyInput('');
        setIsEditingApiKey(false);
    };

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setInstallPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!installPrompt) {
            return;
        }
        // The `prompt()` method can be found on the event.
        // It's not part of the standard Event interface, so we cast to `any`.
        (installPrompt as any).prompt();
        
        // The event can only be used once.
        setInstallPrompt(null);
    };


    const handleChangePin = async () => {
        await setSetting('pin', null); // Clear old pin
        logout();
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const transactions = await db.transactions.orderBy('date').toArray();
            if (transactions.length === 0) {
                alert("No transactions to export.");
                return;
            }
            
            const categories = await db.categories.toArray();
            const accounts = await db.accounts.toArray();

            const categoryMap = new Map(categories.map(c => [c.id, c.name]));
            const accountMap = new Map(accounts.map(a => [a.id, a.name]));

            const headers = ['Date', 'Description', 'Type', 'Amount', 'Category', 'Account'];
            const rows = transactions.map(tx => [
                new Date(tx.date).toISOString().split('T')[0],
                `"${tx.description.replace(/"/g, '""')}"`, // Handle quotes in description
                tx.type,
                tx.amount,
                `"${categoryMap.get(tx.categoryId) || 'N/A'}"`,
                `"${accountMap.get(tx.accountId) || 'N/A'}"`
            ].join(','));

            const csvContent = [headers.join(','), ...rows].join('\n');
            
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const timestamp = new Date().toISOString().split('T')[0];
            link.setAttribute('href', url);
            link.setAttribute('download', `ojirku_transactions_${timestamp}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Failed to export data:", error);
            alert("An error occurred during export.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Page className="space-y-4">
            {installPrompt && (
                 <Card className="bg-white/10 backdrop-blur-md border border-white/15 rounded-[8px]">
                    <h2 className="text-[20px] font-bold mb-4 text-white">Application</h2>
                    <Button onClick={handleInstallClick} variant="primary">
                        {t('install_app')}
                    </Button>
                </Card>
            )}

            <Card className="bg-white/10 backdrop-blur-md border border-white/15 rounded-[8px]">
                <h2 className="text-[20px] font-bold mb-4 text-white">{t('language')}</h2>
                <Select value={language} onChange={e => setLanguage(e.target.value as 'en' | 'id')}>
                    <option value="id" className="bg-slate-900 text-white">Bahasa Indonesia</option>
                    <option value="en" className="bg-slate-900 text-white">English</option>
                </Select>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border border-white/15 rounded-[8px]">
                <h2 className="text-[20px] font-bold mb-4 text-white">{t('security')}</h2>
                <Button onClick={handleChangePin} variant="secondary">
                    {t('change_pin')}
                </Button>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border border-white/15 rounded-[8px]">
                <h2 className="text-[20px] font-bold mb-2 text-white">{t('gemini_api_key')}</h2>
                <p className="text-[14px] text-gray-300 mb-4">{t('gemini_api_key_desc')}</p>
                
                {apiKeyMasked && !isEditingApiKey ? (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-black/30 rounded-[8px] border border-white/10">
                            <div>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[11px] font-medium bg-teal-900/60 text-teal-300 mb-1 border border-teal-500/30">
                                    {t('api_key_configured')}
                                </span>
                                <p className="font-mono text-[14px] text-gray-200">{apiKeyMasked}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button onClick={() => { setIsEditingApiKey(true); setApiKeyInput(''); }} variant="secondary" className="!py-1.5 text-[14px]">
                                {t('change_key')}
                            </Button>
                            <Button onClick={handleRemoveApiKey} variant="danger" className="!py-1.5 text-[14px] !w-auto px-4">
                                {t('remove_key')}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <Input
                            type="password"
                            placeholder={t('enter_api_key')}
                            value={apiKeyInput}
                            onChange={e => setApiKeyInput(e.target.value)}
                        />
                        <p className="text-[12px] text-gray-300">
                            {t('get_api_key_help')}
                        </p>
                        <div className="flex gap-3 pt-1">
                            {isEditingApiKey && (
                                <Button onClick={() => { setIsEditingApiKey(false); setApiKeyInput(''); }} variant="secondary" className="!py-1.5 text-[14px]">
                                    {t('cancel')}
                                </Button>
                            )}
                            <Button onClick={handleSaveApiKey} disabled={!apiKeyInput.trim()} variant="primary" className="!py-1.5 text-[14px]">
                                {t('save_key')}
                            </Button>
                        </div>
                    </div>
                )}
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border border-white/15 rounded-[8px]">
                <h2 className="text-[20px] font-bold mb-4 text-white">{t('data_export')}</h2>
                <Button onClick={handleExport} disabled={isExporting} variant="secondary">
                    {isExporting ? t('exporting') : t('export_transactions_csv')}
                </Button>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border border-white/15 rounded-[8px]">
                <h2 className="text-[20px] font-bold mb-2 text-white">{t('help_and_guide')}</h2>
                <p className="text-[14px] text-gray-300 mb-4">{t('walkthrough_desc')}</p>
                <Button 
                    onClick={() => {
                        window.dispatchEvent(new CustomEvent('ojirku_start_walkthrough'));
                    }} 
                    variant="secondary"
                >
                    {t('replay_walkthrough')}
                </Button>
            </Card>

            <AccountManager />

            <CategoryManager />
        </Page>
    );
};