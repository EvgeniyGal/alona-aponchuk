import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { ragChunks, ragDocuments } from "@/lib/db/schema";
import { newId } from "@/lib/id";
import { chunkText } from "@/lib/rag/chunk";
import { embedTexts } from "@/lib/rag/embed";
import { extractDocumentText } from "@/lib/rag/extract";

export async function processRagDocument(documentId: string, filename: string, buffer: Buffer, mimeType: string) {
  const db = getDb();
  try {
    const text = await extractDocumentText(filename, buffer, mimeType);
    if (!text) {
      throw new Error("No extractable text was found in this file.");
    }
    const chunks = chunkText(text);
    if (chunks.length === 0) {
      throw new Error("The document did not produce any text chunks.");
    }

    const embeddings = await embedTexts(chunks.map((chunk) => chunk.content));
    await db.delete(ragChunks).where(eq(ragChunks.documentId, documentId));
    for (let i = 0; i < chunks.length; i += 1) {
      await db.insert(ragChunks).values({
        id: newId(),
        documentId,
        chunkIndex: chunks[i].index,
        content: chunks[i].content,
        tokenCount: chunks[i].tokenCount,
        embedding: embeddings[i] ?? null,
      });
    }

    await db
      .update(ragDocuments)
      .set({
        status: "ready",
        errorMessage: null,
        chunkCount: chunks.length,
        updatedAt: new Date(),
      })
      .where(eq(ragDocuments.id, documentId));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Document processing failed.";
    await db
      .update(ragDocuments)
      .set({
        status: "error",
        errorMessage: message,
        updatedAt: new Date(),
      })
      .where(eq(ragDocuments.id, documentId));
    throw error;
  }
}
