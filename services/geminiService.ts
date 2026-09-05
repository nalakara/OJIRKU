
import { GoogleGenAI } from "@google/genai";
import { FinancialDataSummary, TransactionType } from "../types";

const getApiKey = () => {
    const key = process.env.API_KEY;
    if (!key) {
        throw new Error("API_KEY environment variable not set.");
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
    console.error("Gemini API Error:", error);
    if (error instanceof Error && error.message.includes("API_KEY")) {
         return "Error: API key is not configured. This feature is currently unavailable.";
    }
    return "Sorry, I couldn't generate a report right now. Please check your internet connection and try again.";
  }
};
