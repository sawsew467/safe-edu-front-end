import OpenAI from "openai";

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
  const { messages, images } = await req.json();

  console.log("🚀 ~ POST ~ images:", images);
  const systemMessage = {
    role: "system",
    content: `
    Bạn là trợ lý ảo của SafeEdu, một nền tảng giáo dục toàn diện giúp nhận diện và phòng chống bạo lực học đường, ma túy và thúc đẩy bình đẳng giới.
    
    Quy tắc quan trọng:
    1. CHỈ trả lời các câu hỏi liên quan đến 3 chủ đề: phòng chống ma túy, bạo lực học đường, và bình đẳng giới.
    2. Nếu câu hỏi KHÔNG liên quan đến 3 chủ đề trên, hãy lịch sự từ chối trả lời và nhắc người dùng hỏi về các chủ đề liên quan.
    3. Trả lời bằng tiếng Việt, ngắn gọn, dễ hiểu và phù hợp với học sinh.
    4. Cung cấp thông tin chính xác, khoa học và phù hợp với độ tuổi.
    5. Khuyến khích các hành vi tích cực và an toàn.
    6. Cho phép gửi ảnh và phân tích các hình ảnh đó. Đưa ra mô tả và các hướng dẫn phòng chống trong thực tế nếu có các yếu tổ gây nguy hiểm. Nếu không liên quan thì từ chối trả lời.
    7. Nếu người dùng cảm ơn hoặc có vài câu từ giao lưu xã giao thì vẫn trả lời như bình thường. Nhưng những phân tích sâu mà không liên quan đến 3 chủ đề trên thì từ chối trả lời.
    
    Ví dụ câu trả lời khi câu hỏi không liên quan:
    "Xin lỗi, tôi chỉ có thể trả lời các câu hỏi liên quan đến phòng chống ma túy, bạo lực học đường và bình đẳng giới. Bạn có thể hỏi tôi về những chủ đề này không?"
  `,
  };

  // Chuyển đổi các tin nhắn văn bản về đúng format
  const formattedMessages = messages.map((msg: any) => {
    return {
      role: msg.role,
      content: msg.content,
    };
  });

  console.log("🚀 ~ formattedMessages ~ formattedMessages:", formattedMessages);

  // Thêm image block theo đúng format GPT-4o yêu cầu
  const imageBlocks = images.map((img: any) => ({
    role: "user",
    content: [
      {
        type: "text",
        text: "Hình ảnh đính kèm. Hãy phân tích ảnh này liên quan đến bạo lực học đường, ma túy hoặc bình đẳng giới.",
      },
      {
        type: "image_url",
        image_url: {
          url: img.url,
        },
      },
    ],
  }));

  console.log("🚀 ~ imageBlocks ~ imageBlocks:", imageBlocks);

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [systemMessage, ...formattedMessages, ...imageBlocks],
  });

  console.log("🚀 ~ POST ~ response:", response);

  const result = response.choices[0];

  return new Response(
    JSON.stringify({
      content: result.message.content ?? "Không có phản hồi",
    }),
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    }
  );
}
