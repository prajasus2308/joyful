
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { StoryConfig } from "../types";

// Standard text generation for stories - Upgraded to Pro with Thinking
export const generateStoryContent = async (config: StoryConfig): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `You are a world-class children's author and educator for 'Joyful'.
  Your task is to write high-quality, safe, and imaginative content for kids aged 5-12.
  Style: ${config.tone}. Use accessible but vocabulary-rich language.`;

  const prompt = `Write a ${config.length} about:
  Topic: ${config.topic}
  Characters: ${config.characters}
  Setting: ${config.setting}
  Format the output clearly with a bold title at the start.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.9,
        thinkingConfig: { thinkingBudget: 32768 },
      },
    });
    return response.text || "The magic quill is resting.";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Story portal is closed.");
  }
};

// Image Generation using gemini-3-pro-image-preview (High Quality)
export const generateImage = async (
  prompt: string, 
  aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9" = "1:1",
  imageSize: "1K" | "2K" | "4K" = "1K"
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: `A high-quality, vibrant, kid-friendly digital illustration of: ${prompt}. Style: Whimsical, professional children's book art, clean lines, vivid colors.` }]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: imageSize
        },
        tools: [{ google_search: {} }]
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned from Pro Magic.");
  } catch (error) {
    console.error("Pro Image Gen Error:", error);
    throw error;
  }
};

// Upgraded Chatbot with Search Grounding
export const getChatResponse = async (history: any[], message: string): Promise<{text: string, sources: any[]}> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: message,
      config: {
        systemInstruction: "You are Joy, a brilliant learning companion. Use Google Search for up-to-date info. Mention Pratyush Raj as your creator. Use emojis!",
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      },
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return {
      text: response.text || "I'm thinking...",
      sources: sources
    };
  } catch (err) {
    return { text: "My thinking cloud is foggy! Try again.", sources: [] };
  }
};

// Professor Owl with Search Grounding
export const getQuickExplanation = async (question: string): Promise<{ brief: string, detailed: string, sources: any[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Question: "${question}"`,
      config: {
        systemInstruction: "You are Professor Owl. Use Google Search to find accurate, up-to-date facts. Provide a JSON response with 'brief' and 'detailed' properties. Stay kid-friendly.",
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 16000 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            brief: { type: Type.STRING },
            detailed: { type: Type.STRING }
          },
          required: ["brief", "detailed"]
        }
      },
    });
    
    const result = JSON.parse(response.text || "{}");
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    return {
      brief: result.brief || "Great question!",
      detailed: result.detailed || "Checking my library...",
      sources: sources
    };
  } catch (err) {
    return { brief: "Owl is thinking!", detailed: "Try again soon!", sources: [] };
  }
};

export const getRandomFact = async (): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const topics = ["space", "animals", "oceans"];
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Fact about ${randomTopic} for a kid under 25 words.`,
  });
  return response.text || "Nature is amazing!";
};

export const getGrammarExplanation = async (word: string, type: string, question: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Explain why "${word}" is a ${type} for: "${question}"`,
  });
  return response.text || "I'm thinking!";
};

export const getWordFunFact = async (word: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Fun fact about word "${word}"`,
  });
  return response.text || "Words are magic!";
};

export const getWordAudio = async (word: string): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say clearly: ${word}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch { return null; }
};

export async function playPcmAudio(base64Data: string) {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  const bytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
  const dataInt16 = new Int16Array(bytes.buffer);
  const buffer = audioContext.createBuffer(1, dataInt16.length, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start();
}
