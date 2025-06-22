"use server";

import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const embedding = async (text: string) => {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: text,
    encoding_format: "float",
    dimensions: 1536,
  });

  return embedding.data[0].embedding;
};
