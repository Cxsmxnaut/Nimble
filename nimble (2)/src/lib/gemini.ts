import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface GeneratedQuestion {
  question: string;
  answer: string;
  category: string;
}

export async function generateQuestionsFromText(text: string, count: number = 10): Promise<GeneratedQuestion[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate ${count} high-quality active recall study questions and answers based on the following text. 
      Format the output as a JSON array of objects with 'question', 'answer', and 'category' fields.
      
      Text: ${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              answer: { type: Type.STRING },
              category: { type: Type.STRING },
            },
            required: ["question", "answer", "category"],
          },
        },
      },
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error generating questions:", error);
    return [];
  }
}
