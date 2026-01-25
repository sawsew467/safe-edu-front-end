import OpenAI from "openai";

import { searchInCollection } from "@/services/qdrant/actions";

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

const findKnowledgeTool = {
  name: "findKnowledgeTool",
  description:
    "Tìm kiếm kiến thức chính thống phù hợp với mô tả của người dùng",
  parameters: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "Mô tả câu hỏi mà người dùng đang tìm",
      },
    },
    required: ["query"],
  },
};

const findConsultingTool = {
  name: "findConsultingTool",
  description:
    "Tìm kiếm thông tin về tư vấn tâm lý phù hợp với mô tả của người dùng",
  parameters: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "Mô tả câu hỏi mà người dùng đang tìm",
      },
    },
    required: ["query"],
  },
};

async function executeFindKnowledgeTool({ query }: { query: string }) {
  try {
    const results: any = await searchInCollection("knowledge", query);

    // Check if search was successful and results is an array
    if (
      !results ||
      !Array.isArray(results) ||
      (results as any).success === false
    ) {
      return "Không có kết quả phù hợp.";
    }

    const filteredResults = results.filter((res: any) => res.score >= 0.3);

    if (!filteredResults || filteredResults.length === 0) {
      return "Không có kết quả phù hợp.";
    }

    return filteredResults
      .slice(0, 5)
      .map((res: any) => {
        return `📄 [${res.payload.document_name}](${res.payload.file_url})\n\nLoại tài liệu: ${res.payload.type === "OFFICIAL" ? "Chính thống" : "Tham khảo"}\n\n${res.payload.content}`;
      })
      .join("\n\n");
  } catch {
    return "Không thể tìm kiếm kiến thức lúc này. Vui lòng thử lại sau.";
  }
}

async function executeFindConsultingTool({ query }: { query: string }) {
  try {
    const results: any = await searchInCollection("consulting", query);

    // Check if search was successful and results is an array
    if (
      !results ||
      !Array.isArray(results) ||
      (results as any).success === false
    ) {
      return "Không có kết quả phù hợp.";
    }

    const filteredResults = results.filter((res: any) => res.score >= 0.3);

    if (!filteredResults || filteredResults.length === 0) {
      return "Không có kết quả phù hợp.";
    }

    return filteredResults
      .slice(0, 5)
      .map((res: any, i: number) => {
        return `Thông tin tham khảo ${i + 1}: ${res.payload.content}\n\n`;
      })
      .join("\n\n");
  } catch {
    return "Không thể tìm kiếm thông tin tư vấn lúc này. Vui lòng thử lại sau.";
  }
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  const systemMessage = {
    role: "system",
    content: `
🚨 QUY TẮC GIỚI HẠN CHỦ ĐỀ TUYỆT ĐỐI
- CHỈ trả lời các chủ đề: BẠO LỰC HỌC ĐƯỜNG, MA TÚY, BÌNH ĐẲNG GIỚI
- Với mọi chủ đề khác: "Xin lỗi, mình chỉ hỗ trợ các vấn đề về bạo lực học đường, ma túy và bình đẳng giới. Bạn có thể chia sẻ về những chủ đề này không?"
- LUÔN kiểm tra câu hỏi có liên quan đến 3 chủ đề trên TRƯỚC KHI phản hồi

❗️QUY TẮC ƯU TIÊN TOOL
- Nếu người dùng đang gặp khó khăn, lo âu, hoặc cần chia sẻ: PHẢI gọi tool \`findConsultingTool\` TRƯỚC.
- Chỉ gọi \`findKnowledgeTool\` khi người dùng cần tra cứu thông tin chính thống, dạng lý thuyết như "ma túy là gì?", "luật nào quy định...".
- TUYỆT ĐỐI KHÔNG dùng kiến thức nội tại của AI để trả lời thay thế tài liệu chính thống.

---

🎯 VAI TRÒ & SỨ MỆNH
Bạn là SafeEdu AI – người bạn tinh tế trong bóng tối của những khủng hoảng tuổi trẻ. Bạn hiện diện để:
- An ủi, thấu cảm và hỗ trợ người dùng vượt qua: bạo lực học đường, nghiện ngập, bất bình đẳng giới.
- Luôn tử tế, không phán xét, luôn trao quyền và tôn trọng quyền riêng tư tuyệt đối.

---

🧭 QUY TRÌNH BẮT BUỘC: THẤU CẢM → HƯỚNG DẪN → HÀNH ĐỘNG
1. **THẤU CẢM:** Luôn mở đầu bằng sự công nhận cảm xúc người dùng.
   - Ví dụ: "Mình hiểu bạn đang rất đau khổ và cô đơn. Mình ở đây rồi, không sao cả..."

2. **HƯỚNG DẪN:** Đặt câu hỏi nhẹ nhàng để hiểu thêm tình huống. Gợi ý tìm hiểu thêm.
   - Ví dụ: "Bạn có thể chia sẻ cụ thể hơn về chuyện vừa xảy ra không?", "Bạn có muốn mình hỗ trợ về 'kỹ năng bảo vệ bản thân' không?"

3. **HÀNH ĐỘNG:** Đề xuất giải pháp rõ ràng, thực hiện được ngay cả khi người dùng đang hoảng loạn.
   - Ví dụ: "Giải pháp nắm bắt nhanh: 1. Hít thở sâu 2. Viết ra giấy 3. Nhắn cho SafeEdu."

---

📚 SỬ DỤNG TOOL
- Luôn gọi \`findConsultingTool\` trước để tìm tư vấn phù hợp.
- Chỉ dùng \`findKnowledgeTool\` nếu câu hỏi yêu cầu kiến thức chính thống.
- Nếu không tìm được tài liệu: phản hồi lịch sự và mời người dùng mô tả kỹ hơn.

📌 Cách trích dẫn chính thống:
→ *"Theo [Tên tài liệu](URL)"*

🛑 Không dùng kiến thức ngôn ngữ mô hình để trả lời nếu không có dữ liệu chính thống từ \`findKnowledgeTool\`.

---

🧠 CHỦ ĐỀ ĐƯỢC PHÉP HỖ TRỢ
- **Bạo lực học đường:** bắt nạt, đánh nhau, quấy rối, kỳ thị, cách tự vệ, báo cáo
- **Ma túy:** dấu hiệu sử dụng, tác hại, cai nghiện, phòng chống, pháp lý
- **Bình đẳng giới:** phân biệt đối xử, quấy rối tình dục, bạo lực gia đình, quyền bình đẳng

🚨 HOTLINE KHẨN CẤP CHO CÁC TRƯỜNG HỢP NGHIÊM TRỌNG
Khi gặp tình huống NGHIÊM TRỌNG (bạo lực, tự tử, nghiện nặng), NGAY LẬP TỨC cung cấp hotline:

📞 **HOTLINE KHẨN CẤP:**
• **111** - Đường dây nóng bảo vệ trẻ em (24/7)
• **113** - Công an (khẩn cấp)
• **115** - Cấp cứu y tế (khẩn cấp)
• **1900.969.603** - Tư vấn cai nghiện ma túy
• **1080** - Đường dây nóng tư vấn tâm lý (7h-22h)

📋 **CÁC CƠ QUAN HỖ TRỢ:**
• **Phòng GD&ĐT** - Báo cáo bạo lực học đường
• **UBND phường/xã** - Hỗ trợ địa phương
• **Trung tâm Y tế** - Hỗ trợ y tế và tâm lý
• **Hội Phụ nữ** - Hỗ trợ bình đẳng giới

---

🔐 BẢO MẬT & GIỚI HẠN
- SafeEdu AI cam kết bảo mật tuyệt đối. "Bạn hoàn toàn có thể yên tâm. Mọi thông tin đều được mã hóa."
- Bạn là AI hỗ trợ đầu tiên, không thay thế được chuyên gia. Luôn khuyến khích kết nối với người thật: người lớn đáng tin, bác sĩ, chuyên viên tâm lý.
- Nếu có nguy cơ đe dọa tính mạng: lập tức hướng dẫn người dùng gọi hotline khẩn cấp và nhờ người lớn giúp đỡ.

---

💬 PHONG CÁCH TRẢ LỜI
- Ngắn gọn, rõ ràng, phù hợp học sinh
- Luôn hỗ trợ, an ủi, truyền động lực
- Không dùng từ ngữ chuyên môn phức tạp
- Dạng markdown, dễ đọc
  `,
  };

  const chatCompletionResponse = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [systemMessage, ...messages],
    tools: [
      { type: "function", function: findKnowledgeTool },
      { type: "function", function: findConsultingTool },
    ],
    tool_choice: "auto",
  });

  const chatCompletionResult = chatCompletionResponse.choices[0];

  if (chatCompletionResult.finish_reason === "tool_calls") {
    const toolCalls: any = chatCompletionResult.message.tool_calls;

    const toolResponses = await Promise.all(
      toolCalls.map(async (toolCall: any) => {
        const { name, arguments: rawArgs } = toolCall.function;
        const args = JSON.parse(rawArgs);

        if (name === "findKnowledgeTool") {
          const output = await executeFindKnowledgeTool(args);

          return {
            tool_call_id: toolCall.id,
            output,
          };
        }

        if (name === "findConsultingTool") {
          const output = await executeFindConsultingTool(args);

          return {
            tool_call_id: toolCall.id,
            output,
          };
        }

        return {
          tool_call_id: toolCall.id,
          output: "Công cụ không được hỗ trợ.",
        };
      }),
    );

    const secondResponse = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        systemMessage,
        ...messages,
        {
          role: "assistant",
          tool_calls: chatCompletionResult.message.tool_calls,
        },
        ...toolResponses.map((res) => ({
          role: "tool",
          tool_call_id: res.tool_call_id,
          content: res.output,
        })),
      ],
    });

    return new Response(JSON.stringify(secondResponse), {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  }

  return new Response(
    JSON.stringify({
      content: chatCompletionResult.message.content ?? "Không có phản hồi",
    }),
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    },
  );

  // const formattedMessages = messages.map((msg: any) => {
  //   return {
  //     role: msg.role,
  //     content: msg.content,
  //   };
  // });

  // const imageBlocks = images.map((img: any) => ({
  //   role: "user",
  //   content: [
  //     {
  //       type: "text",
  //       text: "Hình ảnh đính kèm. Hãy phân tích ảnh này liên quan đến bạo lực học đường, ma túy hoặc bình đẳng giới.",
  //     },
  //     {
  //       type: "image_url",
  //       image_url: {
  //         url: img.url,
  //       },
  //     },
  //   ],
  // }));

  // const response = await client.chat.completions.create({
  //   model: "gpt-4o",
  //   messages: [systemMessage, ...formattedMessages, ...imageBlocks],
  // });

  // const result = response.choices[0];

  // return new Response(
  //   JSON.stringify({
  //     content: result.message.content ?? "Không có phản hồi",
  //   }),
  //   {
  //     headers: {
  //       "Access-Control-Allow-Origin": "*",
  //       "Content-Type": "application/json",
  //     },
  //   }
  // );
}
