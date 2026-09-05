
import { GoogleGenAI } from "@google/genai";
import { FinancialDataSummary, TransactionType } from "../types";

const STORAGE_KEY = 'ojirku_gemini_api_key';

export const getStoredApiKey = (): string | null => {
  try {
    const key = localStorage.getItem(STORAGE_KEY);
    return key && key.trim().length > 0 ? key.trim() : null;
  } catch {
    return null;
  }
};

export const setStoredApiKey = (key: string): void => {
  if (key && key.trim().length > 0) {
    localStorage.setItem(STORAGE_KEY, key.trim());
  }
};

export const removeStoredApiKey = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const hasStoredApiKey = (): boolean => {
  return !!getStoredApiKey();
};

export const getMaskedApiKey = (): string | null => {
  const key = getStoredApiKey();
  if (!key) return null;
  if (key.length <= 8) return '••••••••';
  return `${key.substring(0, 6)}••••••••${key.substring(key.length - 4)}`;
};

const getApiKey = (): string => {
  const key = getStoredApiKey();
  if (!key) {
    throw new Error("BYOK_API_KEY_NOT_CONFIGURED");
  }
  return key;
};

// This function calls the Gemini API to get financial advice.
// It is designed to be called only when the user is online.
export const getFinancialAdvice = async (summary: FinancialDataSummary): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });

    const { transactions, budgets, goals, categories } = summary;

    // Create a readable summary for the AI
    const textSummary = `
      Here is my financial data for the last month. Please act as a friendly financial advisor.
      Analyze my spending habits and provide personalized, actionable suggestions for saving money and reaching my goals.
      Identify any potential anomalous spending. Be encouraging and provide concrete examples.
      Respond in the user's language (assume Indonesian unless the text heavily suggests English).

      Financial Goals:
      ${goals.length > 0 ? goals.map(g => `- ${g.name}: Target Rp${g.targetAmount.toLocaleString('id-ID')}, Saved Rp${g.currentAmount.toLocaleString('id-ID')}`).join('\n') : 'No goals set.'}

      Monthly Budgets:
      ${budgets.length > 0 ? budgets.map(b => {
        const category = categories.find(c => c.id === b.categoryId);
        return `- ${category ? category.name : 'Unknown Category'}: Limit Rp${b.amount.toLocaleString('id-ID')}`;
      }).join('\n') : 'No budgets set.'}

      Recent Transactions:
      ${transactions.map(t => {
        const category = categories.find(c => c.id === t.categoryId);
        const type = t.type === TransactionType.INCOME ? 'Income' : 'Expense';
        return `- ${type}: Rp${t.amount.toLocaleString('id-ID')} for ${category ? category.name : 'Unknown'} on ${t.date.toLocaleDateString('id-ID')}. Description: ${t.description}`;
      }).join('\n')}
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: textSummary,
        config: {
          systemInstruction: "You are 'OJIRKU AI', a helpful and friendly financial assistant for a personal budgeting app. Your tone should be encouraging, clear, and easy to understand for someone who is not a financial expert. Provide insights in concise bullet points or short paragraphs. Start with a warm greeting. Analyze the provided data and give actionable advice. If data is sparse, give general financial tips. Your response MUST be formatted as Markdown.",
          temperature: 0.5,
        }
    });

    return response.text;

  } catch (error) {
    console.error("Gemini API Error:", error instanceof Error ? error.message : "Unknown error");
    if (error instanceof Error && (error.message.includes("API_KEY") || error.message.includes("BYOK_API_KEY_NOT_CONFIGURED"))) {
         return "ERROR_NO_API_KEY";
    }
    return "ERROR_GENERATION_FAILED";
  }
};
