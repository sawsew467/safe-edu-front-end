import { GoogleGenAI } from "@google/genai";

// Lazy initialization to avoid errors during build time
let _geminiClient: GoogleGenAI | null = null;

export const getGeminiClient = (): GoogleGenAI => {
  if (!_geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set");
    }
    _geminiClient = new GoogleGenAI({ apiKey });
  }

  return _geminiClient;
};

// For backward compatibility - will throw at runtime if API key is missing
export const geminiClient = {
  get models() {
    return getGeminiClient().models;
  },
  get fileSearchStores() {
    return getGeminiClient().fileSearchStores;
  },
};

// Store names mapping (equivalent to Qdrant collections)
export const GEMINI_STORES = {
  OFFICIAL: "safeedu-knowledge",
  REFERENCE: "safeedu-consulting",
} as const;

export type StoreType = keyof typeof GEMINI_STORES;

export const getStoreName = (type: "OFFICIAL" | "REFERENCE"): string => {
  return type === "OFFICIAL" ? GEMINI_STORES.OFFICIAL : GEMINI_STORES.REFERENCE;
};
