import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import OpenAI from "openai";
const client = new OpenAI();

import { Document } from "@/features/documents/type";

export const readPDFContent = async (file: Document) => {
  const response = await fetch(file?.file_url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const pdfBlob = await response.blob();
  const loader = new WebPDFLoader(pdfBlob);
  const docs = await loader.load();

  return docs;
};

export const chunkDocuments = async (text: string) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 80,
  });

  const output = await splitter.createDocuments([text]);

  return output;
};

export const chunkDocumentsByLawStructure = async (text: string) => {
  const rawChunks = text.split(/(?:\r?\n)+(?=^Chương\s+([IVXLCDM]+|\d+)\s*)/gm);

  const structuredChunks = rawChunks
    .map((chunk, index) => {
      const titleMatch = chunk.match(/^Chương\s+([IVXLCDM]+|\d+).*$/m);
      const title = titleMatch ? titleMatch[0].trim() : `Chương ${index + 1}`;

      return {
        metadata: {
          title,
          index,
        },
        content: chunk.trim(),
      };
    })
    .filter((c) => c.content.length > 30);

  return structuredChunks;
};
