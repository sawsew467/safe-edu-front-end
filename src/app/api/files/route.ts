import {
  listFilesInStore,
  getOrCreateFileSearchStore,
} from "@/services/gemini/actions";

export const maxDuration = 30;

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

/**
 * GET - List all files in Gemini File Search Stores
 * Output: { stores: [...], files: { knowledge: [...], consulting: [...] } }
 */
export async function GET() {
  try {
    // Get store info
    const knowledgeStore = await getOrCreateFileSearchStore("safeedu-knowledge");
    const consultingStore = await getOrCreateFileSearchStore("safeedu-consulting");

    // List files from both stores
    const knowledgeFiles = await listFilesInStore("OFFICIAL");
    const consultingFiles = await listFilesInStore("REFERENCE");

    return new Response(
      JSON.stringify({
        stores: [
          {
            name: knowledgeStore.name,
            displayName: knowledgeStore.displayName,
            type: "OFFICIAL",
            fileCount: knowledgeFiles.length,
          },
          {
            name: consultingStore.name,
            displayName: consultingStore.displayName,
            type: "REFERENCE",
            fileCount: consultingFiles.length,
          },
        ],
        files: {
          knowledge: knowledgeFiles,
          consulting: consultingFiles,
        },
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    console.error("GET /api-gemini/files error:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to list files",
        message: error instanceof Error ? error.message : "Unknown error",
        stores: [],
        files: { knowledge: [], consulting: [] },
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
