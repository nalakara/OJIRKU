import React, { useState, useCallback } from 'react';
import { Page } from './Layout';
import { Card, Button, Spinner } from './common';
import { useI18n } from '../lib/i18n';
import { db } from '../lib/db';
import { getFinancialAdvice, hasStoredApiKey } from '../services/geminiService';
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
            html += `<h1 class="text-[16px] font-bold mt-4 mb-2 text-white">${processInlines(line.substring(2))}</h1>`;
        } else if (line.startsWith('## ')) {
            closeLists();
            html += `<h2 class="text-[20px] font-bold mt-3 mb-2 text-white">${processInlines(line.substring(3))}</h2>`;
        } else if (line.startsWith('### ')) {
            closeLists();
            html += `<h3 class="text-[14px] font-bold mt-3 mb-1 text-white">${processInlines(line.substring(4))}</h3>`;
        } else if (line.startsWith('* ') || line.startsWith('- ')) {
            if (inOrderedList) closeLists();
            if (!inList) {
                html += '<ul class="space-y-1 my-2 list-disc list-inside text-gray-200 text-[14px]">';
                inList = true;
            }
            html += `<li class="ml-2">${processInlines(line.substring(2))}</li>`;
        } else if (/^\d+\.\s/.test(line)) {
            if (inList) closeLists();
            if (!inOrderedList) {
                html += '<ol class="space-y-1 my-2 list-decimal list-inside text-gray-200 text-[14px]">';
                inOrderedList = true;
            }
            html += `<li class="ml-2">${processInlines(line.replace(/^\d+\.\s/, ''))}</li>`;
        } else {
            closeLists();
            if (line.trim()) {
                html += `<p class="my-2 text-gray-200 text-[14px] leading-relaxed">${processInlines(line)}</p>`;
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
        if (!hasStoredApiKey()) {
            setError(t('ai_key_required_notice'));
            return;
        }

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
            if (advice === 'ERROR_NO_API_KEY') {
                setError(t('ai_key_required_notice'));
            } else if (advice === 'ERROR_GENERATION_FAILED') {
                setError(t('error_generating_report'));
            } else {
                setReport(advice);
            }
        } catch (err) {
            setError(t('error_generating_report'));
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [t]);

    const isKeyConfigured = hasStoredApiKey();

    return (
        <Page>
            <Card className="bg-white/10 backdrop-blur-md border border-white/15 rounded-[8px]">
                <h2 className="text-[20px] font-bold mb-2 text-white">{t('ai_financial_review')}</h2>
                <p className="text-gray-300 text-[14px] mb-4">
                    Get personalized insights and suggestions based on your recent financial activity. This feature requires an internet connection and your personal Gemini API key.
                </p>

                {!isKeyConfigured ? (
                    <div className="p-3 bg-white/10 border border-yellow-500/30 rounded-[8px] mb-4 backdrop-blur-md">
                        <p className="text-yellow-300 text-[14px] font-semibold mb-1">
                            {t('ai_key_required_notice')}
                        </p>
                        <p className="text-[12px] text-gray-300">
                            {t('get_api_key_help')}
                        </p>
                    </div>
                ) : null}

                <Button onClick={handleAnalysis} variant="primary" disabled={isLoading || !isKeyConfigured}>
                    {isLoading ? t('generating_insights') : t('analyze_finances')}
                </Button>
            </Card>

            {isLoading && (
                <Card className="mt-4 bg-white/10 backdrop-blur-md border border-white/15 rounded-[8px]">
                    <Spinner />
                </Card>
            )}

            {error && (
                <Card className="mt-4 border-l-4 border-red-500 bg-white/10 backdrop-blur-md rounded-[8px]">
                    <p className="text-red-400 text-[14px]">{error}</p>
                </Card>
            )}

            {report && (
                 <Card className="mt-4 bg-white/10 backdrop-blur-md border border-white/15 rounded-[8px]">
                    <Markdown content={report} />
                </Card>
            )}
        </Page>
    );
};