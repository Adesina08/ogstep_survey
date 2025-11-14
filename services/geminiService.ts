import { GoogleGenAI } from "@google/genai";
import { DashboardData } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const analyzeDataWithGemini = async (data: DashboardData, question: string): Promise<string> => {
  if (!API_KEY) {
    return "Error: Gemini API key is not configured. Please set up your API key to use this feature.";
  }

  const model = 'gemini-2.5-flash';
  
  // Create a context-rich summary for the model
  const contextSummary = {
    totalSubmissions: data.summary.totalSubmissions,
    approvalRate: data.summary.approvalRate,
    top5Errors: data.errorBreakdown.slice(0, 5).map(e => ({ label: e.label, count: e.count })),
    top5ProductiveUsers: data.userProductivity.slice(0, 5).map(u => ({ id: u.interviewerId, submissions: u.total, approvalRate: u.approvalRate })),
    availableLGAs: data.metadata.lgas,
  };

  const prompt = `
    You are an AI data analyst for the OGSTEP Impact Survey. Your task is to provide concise, data-driven answers to questions about the survey's progress and quality.

    Here is a summary of the current dataset you are analyzing:
    \`\`\`json
    ${JSON.stringify(contextSummary, null, 2)}
    \`\`\`
    
    You also have access to the full dataset of ${data.submissions.length} submissions if you need to calculate more specific details.

    User's Question:
    "${question}"

    Your Response:
    Provide a clear and direct answer based on the provided data summary and your ability to analyze the underlying data. Use markdown for formatting, especially for lists or tables. Be professional and concise.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `An error occurred while analyzing the data: ${error.message}`;
    }
    return "An unknown error occurred while analyzing the data.";
  }
};
