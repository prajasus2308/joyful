
import { GoogleGenAI, Modality } from "@google/genai";
import { StoryConfig } from "../types";

// Standard text generation for stories
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
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.85,
      },
    });
    return response.text || "The magic quill is resting.";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Story portal is closed.");
  }
};

// General AI Chatbot using gemini-3-pro-preview
export const getChatResponse = async (history: {role: 'user' | 'model', parts: {text: string}[]}[], message: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "You are Joy, a friendly and enthusiastic learning companion for children. Keep answers safe, educational, and fun. Use plenty of emojis! If asked about your creator, mention Pratyush Raj.",
      temperature: 0.7,
    },
  });

  try {
    // Note: In a production app, you'd pass the full history here. 
    // For this simple version, we'll send the message through the chat session.
    const result = await chat.sendMessage({ message });
    return result.text || "Oops! My thinking cloud got a bit foggy. Can you say that again?";
  } catch (err) {
    console.error("Chat Error:", err);
    return "I'm taking a tiny nap! Try talking to me again in a moment. 😴";
  }
};

// Random Fun Fact Generator for Home Screen
export const getRandomFact = async (): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const topics = ["space", "animals", "the human body", "oceans", "dinosaurs", "inventions"];
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  
  const prompt = `Tell me one amazing, surprising, and educational fun fact about ${randomTopic} for a 7-year-old. Keep it under 25 words. Start with "Did you know?"`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Nature is full of surprises!";
  } catch (err) {
    return "Every day is a great day to learn something new!";
  }
};

// Doubt Box Explainer
export const getQuickExplanation = async (question: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `You are a friendly teacher. Answer this question from a child simply and kindly: "${question}". Keep it under 40 words and use emojis.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "That's a great question! Let's find out together.";
  } catch (err) {
    return "Hoot! I'm thinking very hard. Ask me again soon!";
  }
};

// New: Grammar Explainer for the Doubt Box (used in games)
export const getGrammarExplanation = async (word: string, type: string, question: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `You are Professor Owl, a friendly grammar teacher for kids. 
  The word is "${word}", which is a ${type}. 
  The child asks: "${question}"
  Explain it simply and kindly in 1-2 sentences. Use emojis!`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { temperature: 0.7 }
    });
    return response.text || "I'm thinking! Try asking again.";
  } catch (err) {
    return "Hoot! My magic book is stuck. Ask me again later!";
  }
};

// New: Fun Fact Generator
export const getWordFunFact = async (word: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Tell me one super fun, surprising fact about the word "${word}" that a 7-year-old would find cool. Keep it under 20 words.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Words are magical!";
  } catch (err) {
    return "Every word has a secret story!";
  }
};

// New: Audio Generator (TTS)
export const getWordAudio = async (word: string): Promise<string | null> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say clearly and cheerfully: ${word}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (err) {
    console.error("TTS Error:", err);
    return null;
  }
};

// Helper to decode raw PCM from Gemini TTS
export async function playPcmAudio(base64Data: string) {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  const bytes = decodeBase64(base64Data);
  const dataInt16 = new Int16Array(bytes.buffer);
  const buffer = audioContext.createBuffer(1, dataInt16.length, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start();
}

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
