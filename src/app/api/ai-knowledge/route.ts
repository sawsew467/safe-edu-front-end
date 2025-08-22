import OpenAI from "openai";

import { chunkDocumentsByLawStructure, readPDFContent } from "@/utils/rag";
import {
  addPointToCollection,
  deleteManyPointsInCollection,
  getAllPointsInCollection,
} from "@/services/qdrant/actions";

const client = new OpenAI();

export const maxDuration = 30;

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(req: Request) {
  const { file } = await req.json();

  try {
    const docs = await readPDFContent(file);

    let chunks: any = [];
    let newChunks: any = [];

    for (const doc of docs) {
      const chunk = await chunkDocumentsByLawStructure(doc.pageContent);

      chunks = [...chunks, ...chunk];
    }

    for (const chunk of chunks.slice(1)) {
      if (chunk?.content?.startsWith("CHƯƠNG")) {
        newChunks.push(chunk);
      } else {
        if (newChunks?.length === 0) newChunks.push(chunk);
        newChunks[newChunks.length - 1].content += `\n${chunk.content}`;
      }
    }

    for (const chunk of newChunks) {
      const response = await client.responses.create({
        model: "gpt-4o-mini",
        input: `
        Tôi có một tài liệu về luật pháp, tôi muốn bạn tóm tắt nội dung của tài liệu này.
        Tài liệu tóm tắt này sẽ cần đủ nhỏ để đưa vào model text-embedding-3-large. 
        Nếu tài liệu không quá dài, hãy giữ lại càng nhiều thông tin càng tốt, hạn chế lược bỏ thông tin.
        Lưu ý giữ nguyên các tiêu đề như "Điều I", "Điều II", "Mục 1", "Mục 2", ...
        Giữ lại cấu trúc Điều, Chương, Mục, 1, 2, 3, a), b), c),...
        
        Nội dung tài liệu: ${chunk?.content}
        `,
      });

      const collectionName =
        file.type === "OFFICIAL" ? "knowledge" : "consulting";

      await addPointToCollection(collectionName, response?.output_text, {
        id: file._id,
        file_url: file.file_url,
        file_name: file.file_name,
        type: file.type,
        document_name: file.document_name,
        content: response?.output_text,
      });
    }

    return new Response(
      JSON.stringify({
        result: newChunks,
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    throw new Error("Tải tài liệu thất bại");
  }
}

export async function DELETE(req: Request) {
  try {
    const { file } = await req.json();

    const collectionName =
      file.type === "OFFICIAL" ? "knowledge" : "consulting";

    const points = await getAllPointsInCollection(collectionName);

    await deleteManyPointsInCollection(
      collectionName,
      points.points
        .filter((point: any) => point?.payload?.id === file?.id)
        .map((point: any) => point.id),
    );

    return new Response(JSON.stringify({ message: "Deleted" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to delete" }), {
      status: 500,
    });
  }
}
