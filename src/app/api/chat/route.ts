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
  description: "Tìm kiếm kiến thức phù hợp với mô tả của người dùng",
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
  const results: any = await searchInCollection("knowledge", query);

  console.log("🚀 ~ executeFindKnowledgeTool ~ results:", results);
  const filteredResults = results?.filter((res: any) => res.score >= 0.3);

  console.log(
    "🚀 ~ executeFindKnowledgeTool ~ filteredResults:",
    filteredResults
  );

  if (!filteredResults || filteredResults.length === 0) {
    return "Không có kết quả phù hợp.";
  }

  return filteredResults
    .slice(0, 5)
    .map((res: any, i: number) => {
      return `📄 [${res.payload.document_name}](${res.payload.file_url})\n\n${res.payload.content}`;
    })
    .join("\n\n");
}

export async function POST(req: Request) {
  const { messages, images } = await req.json();

  const systemMessage = {
    role: "system",
    content: `
  Bạn là trợ lý AI của nền tảng SafeEdu. Nhiệm vụ của bạn là hỗ trợ học sinh, sinh viên, giáo viên, phụ huynh hoặc các cá nhân có nhu cầu tư vấn tâm lý – bằng cách **chỉ sử dụng thông tin từ công cụ \`findKnowledgeTool\`**.
  
  ❗❗❗ Quy tắc bắt buộc:
  1. **Chỉ trả lời nếu có dữ liệu từ \`findKnowledgeTool\`**.
  2. **Tuyệt đối không được bịa, suy diễn, hoặc dùng kiến thức từ mô hình ngôn ngữ**.
  3. Nếu không có dữ liệu trả về từ tool, hãy trả lời lịch sự:  
     → *"Xin lỗi, tôi không tìm thấy thông tin phù hợp trong tài liệu hiện có."*
  
  📚 Khi trả lời, phải trích dẫn rõ ràng nguồn tài liệu đã sử dụng theo định dạng sau:
  → *"Theo [tên tài liệu](URL)"*  
  Ví dụ:  
  → *"Theo [Luật Phòng, Chống Ma Túy](https://safe-edu.s3.ap-southeast-1.amazonaws.com/documents/2aa7e3d0-4de9-11f0-b3ff-bb3fceb94635.pdf), ..."*
  
  💬 Cách trả lời:
  - Ngắn gọn, dễ hiểu, phù hợp với học sinh
  - Giải thích rõ nếu thông tin chuyên môn
  - Giữ thái độ thân thiện, hỗ trợ
  
  ❌ Ví dụ sai (không được phép):
  - “Theo tôi được biết xe máy có 3 loại...”
  
  ✅ Ví dụ đúng:
  - “Theo tài liệu, có ba loại xe máy phổ biến gồm xe số, xe tay ga và xe côn tay...”  
  `,
  };

  const chatCompletionResponse = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [systemMessage, ...messages],
    tools: [{ type: "function", function: findKnowledgeTool }],
    tool_choice: "auto",
  });

  console.log(
    "🚀 ~ POST ~ chatCompletionResponse:",
    JSON.stringify(chatCompletionResponse)
  );

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

        return {
          tool_call_id: toolCall.id,
          output: "Công cụ không được hỗ trợ.",
        };
      })
    );

    console.log("🚀 ~ POST ~ toolResponses:", toolResponses);

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
    }
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
