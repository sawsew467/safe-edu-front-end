import type { NextRequest } from "next/server";

import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  console.log("🚀 ~ POST ~ formData:", formData);
  const message = formData.get("message") as string;

  console.log("🚀 ~ POST ~ message:", message);
  const previousMessages = JSON.parse(
    (formData.get("previousMessages") as string) || "[]"
  );

  console.log("🚀 ~ POST ~ previousMessages:", previousMessages);

  // Get all uploaded images
  const imageFiles: File[] = [];

  for (const [key, value] of formData.entries()) {
    if (key.startsWith("image") && value instanceof File) {
      imageFiles.push(value);
    }
  }

  // System message to restrict responses to the three topics
  const systemMessage = `
    Bạn là trợ lý AI của SafeEdu, một trang web giáo dục về nhận thức xã hội.
    Bạn CHỈ trả lời các câu hỏi liên quan đến ba chủ đề sau:
    1. Phòng chống ma túy
    2. Bạo lực học đường
    3. Bình đẳng giới
    
    Nếu người dùng hỏi về chủ đề khác, hãy lịch sự từ chối và gợi ý họ hỏi về một trong ba chủ đề trên.
    Trả lời bằng tiếng Việt, ngắn gọn, dễ hiểu và có tính giáo dục.
    
    Người dùng có thể gửi hình ảnh. Nếu có hình ảnh, hãy phân tích nội dung hình ảnh và trả lời dựa trên nội dung đó,
    nhưng vẫn giới hạn trong ba chủ đề nêu trên.
  `;

  // If there are images, we need to use the vision model
  if (imageFiles.length > 0) {
    // Convert images to base64
    const imageContents = await Promise.all(
      imageFiles.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString("base64");

        return {
          type: "image_url",
          image_url: {
            url: `data:${file.type};base64,${base64}`,
          },
        };
      })
    );

    // Create messages array with images
    const messages = [
      ...previousMessages,
      {
        role: "user",
        content: [{ type: "text", text: message }, ...imageContents],
      },
    ];

    const result = streamText({
      model: openai("gpt-4o"),
      system: systemMessage,
      messages,
    });

    return result.toDataStreamResponse();
  } else {
    // No images, use regular chat
    const messages = [...previousMessages, { role: "user", content: message }];

    const result = streamText({
      model: openai("gpt-4o"),
      system: systemMessage,
      messages,
    });

    return result.toDataStreamResponse();
  }
}
