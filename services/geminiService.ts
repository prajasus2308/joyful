
import { GoogleGenAI } from "@google/genai";
import { StoryConfig } from "../types";

export const generateStoryContent = async (config: StoryConfig): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const systemPrompt = `You are a friendly, imaginative children's author for the 'Joyful' educational platform. 
  Your goal is to write engaging, safe, and inspiring content for children aged 5-12. 
  Keep the language accessible but descriptive. Use the specific tone requested.`;

  const userPrompt = `Write a ${config.length} about the following:
  Topic: ${config.topic}
  Characters: ${config.characters}
  Setting: ${config.setting}
  Tone: ${config.tone}
  
  Format the output clearly with a creative title at the top if appropriate.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
        topP: 0.9,
      },
    });

    return response.text || "Oops! The magic quill ran out of ink. Try again!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate content. Please check your connection.");
  }
};
