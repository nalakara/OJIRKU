import React, { useState, useEffect } from 'react';
import { Page } from './Layout';
import { Card, Button, Select } from './common';
import { useI18n } from '../lib/i18n';
import { useAuth } from '../lib/auth';
import { db, setSetting } from '../lib/db';
import { AccountManager } from './AccountManager';
import { CategoryManager } from './CategoryManager';

export const Settings = () => {
    const { t, language, setLanguage } = useI18n();
    const { logout } = useAuth();
    const [isExporting, setIsExporting] = useState(false);
    const [installPrompt, setInstallPrompt] = useState<Event | null>(null);

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
        <Page className="space-y-6">
            {installPrompt && (
                 <Card>
                    <h2 className="text-xl font-bold mb-4 text-white">Application</h2>
                    <Button onClick={handleInstallClick} variant="primary">
                        {t('install_app')}
                    </Button>
                </Card>
            )}

            <Card>
                <h2 className="text-xl font-bold mb-4 text-white">{t('language')}</h2>
                <Select value={language} onChange={e => setLanguage(e.target.value as 'en' | 'id')}>
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">English</option>
                </Select>
            </Card>

            <Card>
                <h2 className="text-xl font-bold mb-4 text-white">{t('security')}</h2>
                <Button onClick={handleChangePin} variant="secondary">
                    {t('change_pin')}
                </Button>
            </Card>

            <Card>
                <h2 className="text-xl font-bold mb-4 text-white">{t('data_export')}</h2>
                <Button onClick={handleExport} disabled={isExporting} variant="secondary">
                    {isExporting ? t('exporting') : t('export_transactions_csv')}
                </Button>
            </Card>

            <AccountManager />

            <CategoryManager />
        </Page>
    );
};