import {
  uploadFileToStore,
  deleteFileFromStore,
  deleteFileByName,
} from "@/services/gemini/actions";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

/**
 * POST - Upload document to Gemini File Search Store
 * Input: { file: { _id, file_url, file_name, document_name, type: "OFFICIAL"|"REFERENCE" } }
 * Output: { result: [{ status, storeName, fileName }] }
 */
export async function POST(req: Request) {
  try {
    const { file } = await req.json();

    if (!file || !file.file_url || !file._id) {
      return new Response(
        JSON.stringify({ error: "Missing required file fields" }),
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      );
    }

    const fileType = file.type === "OFFICIAL" ? "OFFICIAL" : "REFERENCE";

    const result = await uploadFileToStore(fileType, file.file_url, {
      id: file._id,
      fileName: file.file_name || file.document_name || "document.pdf",
      documentName: file.document_name || file.file_name || "Document",
    });

    return new Response(
      JSON.stringify({
        result: [
          {
            status: "uploaded",
            storeName: result.storeName,
            fileName: result.fileName,
          },
        ],
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("POST /api-gemini/ai-knowledge error:", error);

    return new Response(
      JSON.stringify({
        error: "Upload failed",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
  }
}

/**
 * DELETE - Remove document from Gemini File Search Store
 * Input: { file: { id, name, displayName, type: "OFFICIAL"|"REFERENCE" } }
 * Output: { message: "Deleted" }
 */
export async function DELETE(req: Request) {
  try {
    const { file } = await req.json();

    // Support multiple ways to identify the file
    const identifier = file?.id || file?.displayName || file?.name;

    if (!file || !identifier) {
      return new Response(
        JSON.stringify({ error: "Missing file identifier (id, name, or displayName)" }),
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        },
      );
    }

    const fileType = file.type === "OFFICIAL" ? "OFFICIAL" : "REFERENCE";

    // Try to delete by name first if provided
    let result;

    if (file.name) {
      result = await deleteFileByName(fileType, file.name);
    }

    // If not found by name, try by id/displayName
    if (!result?.success) {
      result = await deleteFileFromStore(fileType, identifier);
    }

    if (result.success) {
      return new Response(JSON.stringify({ message: "Deleted" }), {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      });
    } else {
      return new Response(
        JSON.stringify({ message: "File not found, nothing to delete" }),
        {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      );
    }
  } catch (error) {
    console.error("DELETE /api-gemini/ai-knowledge error:", error);

    return new Response(
      JSON.stringify({
        error: "Delete failed",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
  }
}
