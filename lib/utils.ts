import { Category, Transaction, TransactionType } from '../types';

/**
 * Formats a number as Indonesian Rupiah.
 * @param amount The number to format.
 * @returns A string like "Rp1.000.000".
 */
export const formatCurrency = (amount: number) => `Rp${amount.toLocaleString('id-ID')}`;


/**
 * Generates a deterministic, visually pleasing color from a category ID.
 * Uses the golden angle approximation for hue distribution.
 * @param id The ID of the category.
 * @returns An HSL color string.
 */
export const getColorForId = (id: number): string => {
    if (!id) return '#9ca3af'; // tailwind gray-400
    const hue = (id * 137.5) % 360; 
    return `hsl(${hue}, 70%, 60%)`;
};

/**
 * Calculates the percentage of total monthly spending/income for each category.
 * @param transactions The list of transactions for the period (e.g., current month).
 * @param categories The full list of categories.
 * @returns A record mapping category ID to its percentage stats.
 */
export const calculateCategoryStats = (transactions: Transaction[], categories: Category[]): Record<number, { percentage: number }> => {
    const totals = transactions.reduce((acc, tx) => {
        acc[tx.type] = (acc[tx.type] || 0) + tx.amount;
        return acc;
    }, {} as Record<TransactionType, number>);

    const amountsPerCategory = transactions.reduce((acc, tx) => {
        if (tx.categoryId) {
            acc[tx.categoryId] = (acc[tx.categoryId] || 0) + tx.amount;
        }
        return acc;
    }, {} as Record<number, number>);

    const stats: Record<number, { percentage: number }> = {};
    categories.forEach(cat => {
        if (cat.id) {
            const categoryTotal = amountsPerCategory[cat.id] || 0;
            const totalForType = totals[cat.type] || 0;
            stats[cat.id] = {
                percentage: totalForType > 0 ? (categoryTotal / totalForType) * 100 : 0
            };
        }
    });
    return stats;
};
