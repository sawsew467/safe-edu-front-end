import { GoogleGenAI } from "@google/genai";

export const geminiClient = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

// Store names mapping (equivalent to Qdrant collections)
export const GEMINI_STORES = {
  OFFICIAL: "safeedu-knowledge",
  REFERENCE: "safeedu-consulting",
} as const;

export type StoreType = keyof typeof GEMINI_STORES;

export const getStoreName = (type: "OFFICIAL" | "REFERENCE"): string => {
  return type === "OFFICIAL" ? GEMINI_STORES.OFFICIAL : GEMINI_STORES.REFERENCE;
};
