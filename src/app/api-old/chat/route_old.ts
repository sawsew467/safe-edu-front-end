import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { messages } = data;
    const systemPrompt = `
    Bạn là trợ lý ảo của SafeEdu, một nền tảng giáo dục toàn diện giúp nhận diện và phòng chống bạo lực học đường, ma túy và thúc đẩy bình đẳng giới.
    
    Quy tắc quan trọng:
    1. CHỈ trả lời các câu hỏi liên quan đến 3 chủ đề: phòng chống ma túy, bạo lực học đường, và bình đẳng giới.
    2. Nếu câu hỏi KHÔNG liên quan đến 3 chủ đề trên, hãy lịch sự từ chối trả lời và nhắc người dùng hỏi về các chủ đề liên quan.
    3. Trả lời bằng tiếng Việt, ngắn gọn, dễ hiểu và phù hợp với học sinh.
    4. Cung cấp thông tin chính xác, khoa học và phù hợp với độ tuổi.
    5. Khuyến khích các hành vi tích cực và an toàn.
    6. Cho phép gửi ảnh và phân tích các hình ảnh đó. Đưa ra mô tả và các hướng dẫn phòng chống trong thực tế nếu có các yếu tổ gây nguy hiểm. Nếu không liên quan thì từ chối trả lời.
    
    Ví dụ câu trả lời khi câu hỏi không liên quan:
    "Xin lỗi, tôi chỉ có thể trả lời các câu hỏi liên quan đến phòng chống ma túy, bạo lực học đường và bình đẳng giới. Bạn có thể hỏi tôi về những chủ đề này không?"
  `;

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      messages: messages,
    });

    return result.toDataStreamResponse({});
  } catch (error) {
    // console.log("🚀 ~ POST ~ error:", error);
  }
}
