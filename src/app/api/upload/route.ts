export const maxDuration = 60;

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

/**
 * POST - Upload file directly to Gemini File Search Store
 * Input: FormData with file, documentName, fileType, id
 * Output: { success: true, ... }
 */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File | null;
    const documentName = formData.get("documentName") as string;
    const fileType = formData.get("fileType") as "OFFICIAL" | "REFERENCE";
    const id = formData.get("id") as string;

    if (!file) {
      return new Response(
        JSON.stringify({ error: "Missing file" }),
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        },
      );
    }

    if (!documentName) {
      return new Response(
        JSON.stringify({ error: "Missing documentName" }),
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Convert File to Blob for upload
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type });

    // Upload directly to Gemini using the blob
    const result = await uploadFileToStoreDirectly(
      fileType || "OFFICIAL",
      blob,
      {
        id: id || `upload_${Date.now()}`,
        fileName: file.name,
        documentName: documentName,
      },
    );

    return new Response(
      JSON.stringify({
        success: true,
        result,
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("POST /api-gemini/upload error:", error);

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
      },
    );
  }
}

// Helper function to upload blob directly
async function uploadFileToStoreDirectly(
  fileType: "OFFICIAL" | "REFERENCE",
  blob: Blob,
  metadata: {
    id: string;
    fileName: string;
    documentName: string;
  },
) {
  // Import gemini client and functions
  const { geminiClient, getStoreName } = await import("@/services/gemini");
  const { getOrCreateFileSearchStore } = await import(
    "@/services/gemini/actions"
  );

  const storeName = getStoreName(fileType);
  const store = await getOrCreateFileSearchStore(storeName);

  if (!store.name) {
    throw new Error("Store name is undefined");
  }

  // Upload to File Search Store
  const operation = await geminiClient.fileSearchStores.uploadToFileSearchStore(
    {
      fileSearchStoreName: store.name,
      file: blob,
      config: {
        displayName: metadata.fileName,
        customMetadata: [
          { key: "id", stringValue: metadata.id },
          { key: "documentName", stringValue: metadata.documentName },
          { key: "fileType", stringValue: fileType },
        ],
      },
    },
  );

  // Upload completes quickly, no need to poll - return immediately
  return {
    success: true,
    storeName: store.name,
    fileName: metadata.fileName,
    operationName: operation.name,
  };
}
