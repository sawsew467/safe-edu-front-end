import { geminiClient } from "@/services/gemini";
import { getAllStoreNames } from "@/services/gemini/actions";

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

const SYSTEM_PROMPT = `
🚨 QUY TẮC GIỚI HẠN CHỦ ĐỀ TUYỆT ĐỐI
- CHỈ trả lời các chủ đề: BẠO LỰC HỌC ĐƯỜNG, MA TÚY, BÌNH ĐẲNG GIỚI
- Với mọi chủ đề khác: "Xin lỗi, mình chỉ hỗ trợ các vấn đề về bạo lực học đường, ma túy và bình đẳng giới. Bạn có thể chia sẻ về những chủ đề này không?"
- LUÔN kiểm tra câu hỏi có liên quan đến 3 chủ đề trên TRƯỚC KHI phản hồi

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

📚 SỬ DỤNG TÀI LIỆU
- Bạn có quyền truy cập vào kho tài liệu chính thống và tài liệu tư vấn thông qua File Search.
- Khi trả lời, hãy tham khảo thông tin từ tài liệu được cung cấp.
- Nếu không tìm được tài liệu phù hợp: phản hồi lịch sự và mời người dùng mô tả kỹ hơn.

📌 Cách trích dẫn:
→ *"Theo tài liệu tham khảo..."*

🛑 Hạn chế sử dụng kiến thức nội tại nếu có thể tìm thấy thông tin trong tài liệu.

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
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid messages format" }),
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Get all File Search Store names
    const storeNames = await getAllStoreNames();

    // Format messages for Gemini
    // Gemini uses "user" and "model" roles (not "assistant")
    const formattedMessages = messages.map(
      (msg: { role: string; content: string }) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }),
    );

    // Add system prompt to the first user message or create a new one
    const systemContent = {
      role: "user",
      parts: [
        {
          text: `[System Instructions]\n${SYSTEM_PROMPT}\n\n[End System Instructions]\n\nHãy tuân thủ các hướng dẫn trên trong suốt cuộc trò chuyện.`,
        },
      ],
    };

    const modelAck = {
      role: "model",
      parts: [
        {
          text: "Tôi đã hiểu và sẽ tuân thủ các hướng dẫn. Tôi là SafeEdu AI, sẵn sàng hỗ trợ bạn về các vấn đề bạo lực học đường, ma túy và bình đẳng giới.",
        },
      ],
    };

    // Build conversation history
    const contents = [systemContent, modelAck, ...formattedMessages];

    // Generate response with File Search tool
    const response = await geminiClient.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      config: {
        tools:
          storeNames.length > 0
            ? [
                {
                  fileSearch: {
                    fileSearchStoreNames: storeNames,
                  },
                },
              ]
            : undefined,
      },
    });

    const responseText = response.text || "Không có phản hồi";

    // Return response in format compatible with mobile app
    // The current API returns either:
    // 1. { choices: [{ message: { content } }] } when tool calls happen
    // 2. { content: string } when no tool calls

    // Gemini File Search handles RAG internally, so we return the simpler format
    // but also include the OpenAI-compatible format for maximum compatibility
    return new Response(
      JSON.stringify({
        content: responseText,
        choices: [
          {
            message: {
              content: responseText,
              role: "assistant",
            },
            finish_reason: "stop",
          },
        ],
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("POST /api-gemini/chat error:", error);

    return new Response(
      JSON.stringify({
        error: "Chat failed",
        content: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      },
    );
  }
}
