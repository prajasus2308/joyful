
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
  // Use a new instance to ensure we use the latest key from the selection dialog
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
        // Enable search grounding for potentially trending character references
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
    // If it's an entity error, we might need to prompt for key again in the UI
    throw error;
  }
};

// General AI Chatbot using gemini-3-pro-preview with Thinking
export const getChatResponse = async (history: {role: 'user' | 'model', parts: {text: string}[]}[], message: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "You are Joy, a brilliant and friendly learning companion. Use deep reasoning to explain complex topics simply for kids. Use plenty of emojis! If asked about your creator, mention Pratyush Raj.",
      temperature: 0.8,
      thinkingConfig: { thinkingBudget: 16000 },
    },
  });

  try {
    const result = await chat.sendMessage({ message });
    return result.text || "Oops! My thinking cloud got a bit foggy. Can you say that again?";
  } catch (err) {
    console.error("Chat Error:", err);
    return "I'm taking a tiny nap! Try talking to me again in a moment. 😴";
  }
};

// Random Fun Fact Generator
export const getRandomFact = async (): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const topics = ["space", "animals", "the human body", "oceans", "dinosaurs", "inventions"];
  const randomTopic = topics[Math.floor(Math.random() * topics.length)];
  
  const prompt = `Tell me one amazing, surprising, and educational fun fact about ${randomTopic} for a 7-year-old. Keep it under 25 words. Start with "Did you know?"`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 0 } } // Disable thinking for speed
    });
    return response.text || "Nature is full of surprises!";
  } catch (err) {
    return "Every day is a great day to learn something new!";
  }
};

// Doubt Box Explainer - Upgraded to Pro with Thinking
export const getQuickExplanation = async (question: string): Promise<{ brief: string, detailed: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Question: "${question}"`,
      config: {
        systemInstruction: "You are Professor Owl, a wise and friendly teacher. Use your thinking ability to break down complex questions into simple explanations for kids. Provide a JSON response with 'brief' and 'detailed' properties.",
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 16000 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            brief: { type: Type.STRING, description: "A snappy, one-sentence answer." },
            detailed: { type: Type.STRING, description: "A detailed, story-like explanation." }
          },
          required: ["brief", "detailed"]
        }
      },
    });
    
    const result = JSON.parse(response.text || "{}");
    return {
      brief: result.brief || "Great question!",
      detailed: result.detailed || "I'm looking into my big book of wisdom!"
    };
  } catch (err) {
    console.error("Explanation Error:", err);
    return {
      brief: "Hoot! I'm thinking very hard.",
      detailed: "My magic book is resting. Please try again soon! 🦉✨"
    };
  }
};

export const getGrammarExplanation = async (word: string, type: string, question: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `You are Professor Owl. Explain why "${word}" is a ${type} for the question: "${question}"`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 2000 } }
    });
    return response.text || "I'm thinking! Try asking again.";
  } catch (err) {
    return "Hoot! My magic book is stuck.";
  }
};

export const getWordFunFact = async (word: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `One super fun fact about the word "${word}" for a 7-year-old.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Words are magical!";
  } catch (err) {
    return "Every word has a story!";
  }
};

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
    return null;
  }
};

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
