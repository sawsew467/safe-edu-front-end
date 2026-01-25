"use server";

import { geminiClient, getStoreName } from "./index";

/**
 * Get or create a File Search Store by display name
 */
export const getOrCreateFileSearchStore = async (displayName: string) => {
  try {
    // List existing stores to check if one with this name exists
    const stores = await geminiClient.fileSearchStores.list();

    for await (const store of stores) {
      if (store.displayName === displayName) {
        return store;
      }
    }

    // Create new store if not found
    const newStore = await geminiClient.fileSearchStores.create({
      config: { displayName },
    });

    return newStore;
  } catch (error) {
    console.error("Error getting/creating store:", error);
    throw error;
  }
};

/**
 * Upload a file from URL to File Search Store
 */
export const uploadFileToStore = async (
  fileType: "OFFICIAL" | "REFERENCE",
  fileUrl: string,
  metadata: {
    id: string;
    fileName: string;
    documentName: string;
  },
) => {
  try {
    const storeName = getStoreName(fileType);
    const store = await getOrCreateFileSearchStore(storeName);

    if (!store.name) {
      throw new Error("Store name is undefined");
    }

    // Download file from URL
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: "application/pdf" });

    // Upload to File Search Store
    const operation = await geminiClient.fileSearchStores.uploadToFileSearchStore({
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
    });

    // Upload completes quickly, no need to poll - return immediately
    return {
      success: true,
      storeName: store.name,
      fileName: metadata.fileName,
      operationName: operation.name,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

/**
 * Delete a file from File Search Store by document ID or displayName
 */
export const deleteFileFromStore = async (
  fileType: "OFFICIAL" | "REFERENCE",
  documentId: string,
) => {
  try {
    const storeName = getStoreName(fileType);
    const store = await getOrCreateFileSearchStore(storeName);

    if (!store.name) {
      throw new Error("Store name is undefined");
    }

    // List all documents in the store
    const documents = await geminiClient.fileSearchStores.documents.list({
      parent: store.name,
    });

    // Find document with matching ID in customMetadata or by displayName
    for await (const doc of documents) {
      try {
        // Check customMetadata for ID
        const idMeta = doc.customMetadata?.find(
          (m: { key?: string }) => m.key === "id",
        );

        const metadataId =
          idMeta && "stringValue" in idMeta ? idMeta.stringValue : null;

        // Match by metadata ID, or by displayName
        if (
          metadataId === documentId ||
          doc.displayName === documentId ||
          doc.displayName?.includes(documentId)
        ) {
          // Delete the document (force: true to delete chunks as well)
          await geminiClient.fileSearchStores.documents.delete({
            name: doc.name!,
            config: { force: true },
          });

          return { success: true, deletedFile: doc.displayName };
        }
      } catch (err) {
        console.error("Error processing document:", err);
        continue;
      }
    }

    return { success: false, message: "File not found" };
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

/**
 * Delete a file from File Search Store by exact document resource name
 */
export const deleteFileByName = async (
  fileType: "OFFICIAL" | "REFERENCE",
  documentName: string,
) => {
  try {
    const storeName = getStoreName(fileType);
    const store = await getOrCreateFileSearchStore(storeName);

    if (!store.name) {
      throw new Error("Store name is undefined");
    }

    // If documentName is a full resource name, delete directly
    if (documentName.startsWith("fileSearchStores/")) {
      await geminiClient.fileSearchStores.documents.delete({
        name: documentName,
        config: { force: true },
      });

      return { success: true, deletedFile: documentName };
    }

    // Otherwise, list and find by name
    const documents = await geminiClient.fileSearchStores.documents.list({
      parent: store.name,
    });

    for await (const doc of documents) {
      if (doc.name === documentName || doc.name?.endsWith(documentName)) {
        await geminiClient.fileSearchStores.documents.delete({
          name: doc.name!,
          config: { force: true },
        });

        return { success: true, deletedFile: doc.displayName };
      }
    }

    return { success: false, message: "File not found by name" };
  } catch (error) {
    console.error("Error deleting file by name:", error);
    throw error;
  }
};

/**
 * List all files in a File Search Store
 */
export const listFilesInStore = async (fileType: "OFFICIAL" | "REFERENCE") => {
  try {
    const storeName = getStoreName(fileType);
    const store = await getOrCreateFileSearchStore(storeName);

    if (!store.name) {
      throw new Error("Store name is undefined");
    }

    const documents = await geminiClient.fileSearchStores.documents.list({
      parent: store.name,
    });

    const fileList: Array<{
      name: string;
      displayName: string;
      metadata: Record<string, string>;
    }> = [];

    for await (const doc of documents) {
      const metadata: Record<string, string> = {};

      if (doc.customMetadata) {
        for (const meta of doc.customMetadata) {
          if (meta.key && "stringValue" in meta && meta.stringValue) {
            metadata[meta.key] = meta.stringValue;
          }
        }
      }

      fileList.push({
        name: doc.name || "",
        displayName: doc.displayName || "",
        metadata,
      });
    }

    return fileList;
  } catch (error) {
    console.error("Error listing files:", error);
    throw error;
  }
};

/**
 * Get all store names for chat (both knowledge and consulting)
 */
export const getAllStoreNames = async (): Promise<string[]> => {
  const storeNames: string[] = [];

  try {
    const knowledgeStore =
      await getOrCreateFileSearchStore("safeedu-knowledge");

    if (knowledgeStore.name) {
      storeNames.push(knowledgeStore.name);
    }
  } catch (error) {
    console.error("Error getting knowledge store:", error);
  }

  try {
    const consultingStore =
      await getOrCreateFileSearchStore("safeedu-consulting");

    if (consultingStore.name) {
      storeNames.push(consultingStore.name);
    }
  } catch (error) {
    console.error("Error getting consulting store:", error);
  }

  return storeNames;
};
