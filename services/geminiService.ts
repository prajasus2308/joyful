
import { GoogleGenAI } from "@google/genai";
import { StoryConfig } from "../types";

export const generateStoryContent = async (config: StoryConfig): Promise<string> => {
  // Use the required initialization format
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `You are a world-class children's author and educator for 'Joyful', an AI-powered learning platform.
  Your task is to write high-quality, safe, and imaginative content for kids aged 5-12.
  
  Output Requirements:
  - If length is 'Paragraph', provide one rich, descriptive paragraph (approx 100-150 words).
  - If length is 'Short Story', provide a full narrative with a beginning, middle, and end (approx 300-500 words).
  - If length is 'Book Chapter', write a detailed chapter with cliffhangers (approx 600-800 words).
  - If length is 'Outline', provide a structured chapter-by-chapter plan for a full book.
  
  Style: ${config.tone}. Use accessible but vocabulary-rich language.`;

  const prompt = `Write a ${config.length} about:
  Topic: ${config.topic}
  Characters: ${config.characters}
  Setting: ${config.setting}
  
  Format the output clearly with a bold title at the start.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.85,
        topP: 0.95,
      },
    });

    // Directly access .text property as per rules
    return response.text || "The magic quill is resting. Please try again in a moment!";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message?.includes("API_KEY")) {
      throw new Error("Magic Key missing! Please ensure the API is configured.");
    }
    throw new Error("The story portal is temporarily closed. Please check your connection.");
  }
};
