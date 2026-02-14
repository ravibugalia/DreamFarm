
import { GoogleGenAI } from "@google/genai";
import { TreeRecord } from "../types";

export const getTreeInsights = async (record: TreeRecord): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    As an expert arborist, provide a concise (max 100 words) care recommendation for this tree:
    - Tree Species: ${record.species}
    - Current Health Status: ${record.health}
    - Health Description: ${record.healthDescription || 'No description provided'}
    - Current Fruit Production Level: ${record.production}
    - Recent Yield Quantity: ${record.productionQuantity !== undefined ? record.productionQuantity : 'Not specified'}
    - Observation Notes: ${record.notes || 'None'}
    
    Format the response with bullet points if necessary. Focus on immediate actions based on the specific health description and yield data provided.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No specific insights available at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to fetch AI insights. Please check your connection.";
  }
};
