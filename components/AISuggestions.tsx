import React, { useState, useCallback } from 'react';
import { Page } from './Layout';
import { Card, Button, Spinner } from './common';
import { useI18n } from '../lib/i18n';
import { db } from '../lib/db';
import { getFinancialAdvice } from '../services/geminiService';
import { FinancialDataSummary } from '../types';

const Markdown = ({ content }: { content: string }) => {
    const lines = content.split('\n');
    let html = '';
    let inList = false;
    let inOrderedList = false;

    const processInlines = (text: string) => text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');

    const closeLists = () => {
        if (inList) {
            html += '</ul>';
            inList = false;
        }
        if (inOrderedList) {
            html += '</ol>';
            inOrderedList = false;
        }
    }

    lines.forEach(line => {
        if (line.startsWith('# ')) {
            closeLists();
            html += `<h1 class="text-2xl font-bold mt-6 mb-3 text-white">${processInlines(line.substring(2))}</h1>`;
        } else if (line.startsWith('## ')) {
            closeLists();
            html += `<h2 class="text-xl font-bold mt-5 mb-2 text-white">${processInlines(line.substring(3))}</h2>`;
        } else if (line.startsWith('### ')) {
            closeLists();
            html += `<h3 class="text-lg font-bold mt-4 mb-1 text-white">${processInlines(line.substring(4))}</h3>`;
        } else if (line.startsWith('* ') || line.startsWith('- ')) {
            if (inOrderedList) closeLists();
            if (!inList) {
                html += '<ul class="space-y-1 my-2 list-disc list-inside text-gray-300">';
                inList = true;
            }
            html += `<li class="ml-4">${processInlines(line.substring(2))}</li>`;
        } else if (/^\d+\.\s/.test(line)) {
            if (inList) closeLists();
            if (!inOrderedList) {
                html += '<ol class="space-y-1 my-2 list-decimal list-inside text-gray-300">';
                inOrderedList = true;
            }
            html += `<li class="ml-4">${processInlines(line.replace(/^\d+\.\s/, ''))}</li>`;
        } else {
            closeLists();
            if (line.trim()) {
                html += `<p class="my-2 text-gray-300">${processInlines(line)}</p>`;
            }
        }
    });

    closeLists(); // Close any remaining open lists

    return <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
};


export const AISuggestions = () => {
    const { t } = useI18n();
    const [isLoading, setIsLoading] = useState(false);
    const [report, setReport] = useState('');
    const [error, setError] = useState('');

    const handleAnalysis = useCallback(async () => {
        setIsLoading(true);
        setError('');
        setReport('');

        try {
            const startOfMonth = new Date();
            startOfMonth.setDate(1);
            startOfMonth.setHours(0,0,0,0);

            const summary: FinancialDataSummary = {
                transactions: await db.transactions.where('date').aboveOrEqual(startOfMonth).toArray(),
                budgets: await db.budgets.toArray(),
                goals: await db.goals.toArray(),
                categories: await db.categories.toArray(),
            };

            if (summary.transactions.length < 5) {
                setError(t('no_data_for_analysis'));
                setIsLoading(false);
                return;
            }

            const advice = await getFinancialAdvice(summary);
            setReport(advice);
        } catch (err) {
            setError(t('error_generating_report'));
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [t]);

    return (
        <Page>
            <Card>
                <h2 className="text-xl font-bold mb-2 text-white">{t('ai_financial_review')}</h2>
                <p className="text-gray-300 mb-4">
                    Get personalized insights and suggestions based on your recent financial activity. This feature requires an internet connection.
                </p>
                <Button onClick={handleAnalysis} disabled={isLoading}>
                    {isLoading ? t('generating_insights') : t('analyze_finances')}
                </Button>
            </Card>

            {isLoading && (
                <Card className="mt-6">
                    <Spinner />
                </Card>
            )}

            {error && (
                <Card className="mt-6 border-l-4 border-red-500">
                    <p className="text-red-400">{error}</p>
                </Card>
            )}

            {report && (
                 <Card className="mt-6">
                    <Markdown content={report} />
                </Card>
            )}
        </Page>
    );
};