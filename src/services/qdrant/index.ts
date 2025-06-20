import { QdrantClient } from "@qdrant/js-client-rest";

export const qdrantClient = new QdrantClient({
  url: "https://e2c3515a-fb6c-49c7-8e5e-178805be9160.us-east4-0.gcp.cloud.qdrant.io:6333",
  apiKey: process.env.QDRANT_API_KEY,
});
