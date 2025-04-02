import { openai } from "@ai-sdk/openai";
import { FilePart, ImagePart, streamText, TextPart } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    console.log("================================================");

    const data = await req.json();

    const images = data?.data?.images;

    const { messages } = data;

    let lastMessage = messages[messages.length - 1];

    let content: string | Array<TextPart | ImagePart | FilePart> = [
      {
        type: "text",
        text: lastMessage.content,
      },
    ];

    console.log("🚀 ~ POST ~ content:", content);

    if (images?.length > 0) {
      const imageUrls = images.map((image: string) => {
        return { type: "image", image: image };
      });

      content = [...content, ...imageUrls];
    }

    console.log("🚀 ~ POST ~ content:", content);

    // System prompt to ensure the chatbot only answers relevant questions
    const systemPrompt = `
    Bạn là trợ lý ảo của SafeEdu, một nền tảng giáo dục toàn diện giúp nhận diện và phòng chống bạo lực học đường, ma túy và thúc đẩy bình đẳng giới.
    
    Quy tắc quan trọng:
    1. CHỈ trả lời các câu hỏi liên quan đến 3 chủ đề: phòng chống ma túy, bạo lực học đường, và bình đẳng giới.
    2. Nếu câu hỏi KHÔNG liên quan đến 3 chủ đề trên, hãy lịch sự từ chối trả lời và nhắc người dùng hỏi về các chủ đề liên quan.
    3. Trả lời bằng tiếng Việt, ngắn gọn, dễ hiểu và phù hợp với học sinh.
    4. Cung cấp thông tin chính xác, khoa học và phù hợp với độ tuổi.
    5. Khuyến khích các hành vi tích cực và an toàn.
    6. Cho phép gửi ảnh và phân tích các hình ảnh đó. Nếu hình ảnh liên quan đến 3 chủ đề trên thì hãy đưa ra mô tả và các hướng dẫn phòng chống trong thực tế. Nếu không liên quan thì từ chối trả lời.
    
    Ví dụ câu trả lời khi câu hỏi không liên quan:
    "Xin lỗi, tôi chỉ có thể trả lời các câu hỏi liên quan đến phòng chống ma túy, bạo lực học đường và bình đẳng giới. Bạn có thể hỏi tôi về những chủ đề này không?"
  `;

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: content,
        },
      ],
    });

    return result.toDataStreamResponse({});
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
  }
}
