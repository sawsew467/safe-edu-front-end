"use server";

import { randomUUID } from "crypto";

import { embedding } from "../embedding";

import { qdrantClient } from "./index";

// import { issueKnowledgeBase } from "@/helpers/data/issueKnowledgeBase";

export const createCollection = async (collectionName: string) => {
  await qdrantClient.createCollection(collectionName, {
    vectors: { size: 1536, distance: "Cosine" },
  });
};

// export const insertIssueVectors = async () => {
//   try {
//     for (const issue of issueKnowledgeBase) {
//       const vector = await embedding(issue.description);

//       const payload = {
//         description: issue.description,
//         category: issue.category,
//       };

//       await qdrantClient.upsert("issue_knowledge", {
//         wait: true,
//         points: [
//           {
//             id: randomUUID(),
//             vector,
//             payload,
//           },
//         ],
//       });

//       console.log(`✅ Inserted ${issue.description}`);
//     }
//   } catch (error) {
//     console.log("🚀 ~ insertAnimalVectors ~ error:", error);

//     return {
//       success: false,
//       message: "Failed to insert animal vectors",
//     };
//   }
// };

export const addPointToCollection = async (
  collectionName: string,
  content: string,
  payload: any
) => {
  const vector = await embedding(content);

  await qdrantClient.upsert(collectionName, {
    wait: true,
    points: [
      {
        id: randomUUID(),
        vector,
        payload,
      },
    ],
  });
};

export const updatePointInCollection = async (
  collectionName: string,
  payload: any
) => {
  const vector = await embedding(payload.description);

  await qdrantClient.upsert(collectionName, {
    wait: true,
    points: [{ id: payload.id, vector, payload }],
  });
};

export const deletePointInCollection = async (
  collectionName: string,
  id: string
) => {
  await qdrantClient.delete(collectionName, {
    points: [id],
  });
};

export const deleteManyPointsInCollection = async (
  collectionName: string,
  ids: string[]
) => {
  await qdrantClient.delete(collectionName, {
    points: ids,
  });
};

export const deleteManyPointsByPayloadId = async (
  collectionName: string,
  id: string
) => {
  await qdrantClient.delete(collectionName, {
    filter: {
      must: [
        {
          key: "id",
          match: {
            text: id,
          },
        },
      ],
    },
  });
};

export const searchInCollection = async (
  collectionName: string,
  query: string
) => {
  try {
    const result = await qdrantClient.search(collectionName, {
      vector: await embedding(query),
      limit: 10,
      with_payload: true,
    });

    return result;
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Failed to search",
    };
  }
};

export const getCollection = async (collectionName: string) => {
  const result = await qdrantClient.getCollection(collectionName);

  return result;
};

export const getAllPointsInCollection = async (
  collectionName: string,
  limit?: number,
  offset?: string
) => {
  const result = await qdrantClient.scroll(collectionName, {
    limit: limit || 999,
    offset,
  });

  return result;
};
