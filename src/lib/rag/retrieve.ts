import { eq, inArray, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { ragChunks, ragDocuments } from "@/lib/db/schema";
import { cosineSimilarity, embedQuery, parseEmbedding, toVectorLiteral } from "@/lib/rag/embed";
import { rerankChunks } from "@/lib/rag/rerank";

const DENSE_CANDIDATES = 20;
const SPARSE_CANDIDATES = 20;
const RRF_K = 60;

export type RetrievalMatch = "vector" | "keyword";

export type RetrievedChunk = {
  id: string;
  documentId: string;
  filename: string;
  content: string;
  score: number;
  chunkIndex: number;
  matchedBy: RetrievalMatch[];
};

type SearchHit = {
  id: string;
  documentId: string;
  filename: string;
  content: string;
  chunkIndex: number;
  score: number;
};

function rowsOf(result: unknown): Record<string, unknown>[] {
  if (Array.isArray(result)) return result as Record<string, unknown>[];
  if (result && typeof result === "object" && "rows" in result) {
    return (result as { rows: Record<string, unknown>[] }).rows ?? [];
  }
  return [];
}

function asString(value: unknown) {
  return typeof value === "string" ? value : String(value ?? "");
}

function asNumber(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

function documentFilter(ids: string[]) {
  return sql.join(
    ids.map((id) => sql`${id}`),
    sql`, `,
  );
}

function ftsQuery(raw: string) {
  const terms = raw
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .split(/\s+/)
    .map((term) => term.replace(/['\\:]/g, ""))
    .filter((term) => term.length >= 2)
    .slice(0, 16);
  if (terms.length === 0) return null;
  return terms.join(" | ");
}

async function denseSearchPgvector(queryVector: number[], documentIds: string[], filenames: Map<string, string>) {
  const db = getDb();
  const vector = sql.raw(`'${toVectorLiteral(queryVector)}'::vector`);
  const result = await db.execute(sql`
    SELECT
      id,
      document_id,
      chunk_index,
      content,
      (1 - (embedding <=> ${vector}))::float8 AS score
    FROM rag_chunks
    WHERE document_id IN (${documentFilter(documentIds)})
      AND embedding IS NOT NULL
    ORDER BY embedding <=> ${vector}
    LIMIT ${DENSE_CANDIDATES}
  `);

  return rowsOf(result).map((row) => ({
    id: asString(row.id),
    documentId: asString(row.document_id ?? row.documentId),
    filename: filenames.get(asString(row.document_id ?? row.documentId)) || "document",
    content: asString(row.content),
    chunkIndex: asNumber(row.chunk_index ?? row.chunkIndex),
    score: asNumber(row.score),
  }));
}

async function denseSearchMemory(queryVector: number[], documentIds: string[], filenames: Map<string, string>) {
  const db = getDb();
  const rows = await db
    .select({
      id: ragChunks.id,
      documentId: ragChunks.documentId,
      content: ragChunks.content,
      chunkIndex: ragChunks.chunkIndex,
      embedding: ragChunks.embedding,
    })
    .from(ragChunks)
    .where(inArray(ragChunks.documentId, documentIds));

  return rows
    .map((row) => {
      const embedding = parseEmbedding(row.embedding);
      return {
        id: row.id,
        documentId: row.documentId,
        filename: filenames.get(row.documentId) || "document",
        content: row.content,
        chunkIndex: row.chunkIndex,
        score: embedding ? cosineSimilarity(queryVector, embedding) : 0,
      };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, DENSE_CANDIDATES);
}

async function denseSearch(queryVector: number[], documentIds: string[], filenames: Map<string, string>) {
  try {
    return await denseSearchPgvector(queryVector, documentIds, filenames);
  } catch (error) {
    console.error("[rag] pgvector search failed, using in-memory cosine:", error);
    return denseSearchMemory(queryVector, documentIds, filenames);
  }
}

async function sparseSearch(query: string, documentIds: string[], filenames: Map<string, string>) {
  const tsQuery = ftsQuery(query);
  if (!tsQuery) return [];
  const db = getDb();
  try {
    const result = await db.execute(sql`
      SELECT
        id,
        document_id,
        chunk_index,
        content,
        ts_rank_cd(to_tsvector('simple', content), to_tsquery('simple', ${tsQuery}))::float8 AS score
      FROM rag_chunks
      WHERE document_id IN (${documentFilter(documentIds)})
        AND to_tsvector('simple', content) @@ to_tsquery('simple', ${tsQuery})
      ORDER BY score DESC
      LIMIT ${SPARSE_CANDIDATES}
    `);
    return rowsOf(result).map((row) => ({
      id: asString(row.id),
      documentId: asString(row.document_id ?? row.documentId),
      filename: filenames.get(asString(row.document_id ?? row.documentId)) || "document",
      content: asString(row.content),
      chunkIndex: asNumber(row.chunk_index ?? row.chunkIndex),
      score: asNumber(row.score),
    }));
  } catch (error) {
    console.error("[rag] keyword search failed:", error);
    return [];
  }
}

function fuseHits(dense: SearchHit[], sparse: SearchHit[]): RetrievedChunk[] {
  const fused = new Map<
    string,
    {
      hit: SearchHit;
      rrf: number;
      matchedBy: Set<RetrievalMatch>;
    }
  >();

  const addList = (hits: SearchHit[], match: RetrievalMatch) => {
    hits.forEach((hit, index) => {
      const current = fused.get(hit.id) ?? {
        hit,
        rrf: 0,
        matchedBy: new Set<RetrievalMatch>(),
      };
      current.rrf += 1 / (RRF_K + index + 1);
      current.matchedBy.add(match);
      if (hit.content.length > current.hit.content.length) current.hit = hit;
      fused.set(hit.id, current);
    });
  };

  addList(dense, "vector");
  addList(sparse, "keyword");

  const maxRrf = (dense.length && sparse.length ? 2 : 1) / (RRF_K + 1);
  return [...fused.values()]
    .sort((a, b) => b.rrf - a.rrf)
    .map((item) => ({
      id: item.hit.id,
      documentId: item.hit.documentId,
      filename: item.hit.filename,
      content: item.hit.content,
      chunkIndex: item.hit.chunkIndex,
      matchedBy: [...item.matchedBy],
      score: maxRrf > 0 ? Math.min(1, item.rrf / maxRrf) : 0,
    }));
}

export async function retrieveChunks({
  query,
  documentIds,
  limit = 6,
}: {
  query: string;
  documentIds?: string[] | "all";
  limit?: number;
}): Promise<RetrievedChunk[]> {
  const db = getDb();
  const readyDocs = await db
    .select({ id: ragDocuments.id, filename: ragDocuments.filename })
    .from(ragDocuments)
    .where(eq(ragDocuments.status, "ready"));

  const selected =
    !documentIds || documentIds === "all"
      ? readyDocs
      : readyDocs.filter((doc) => documentIds.includes(doc.id));

  if (selected.length === 0) return [];

  const ids = selected.map((doc) => doc.id);
  const filenames = new Map(selected.map((doc) => [doc.id, doc.filename]));

  const [queryVector, sparse] = await Promise.all([
    embedQuery(query).catch((error) => {
      console.error("[rag] query embedding failed:", error);
      return undefined;
    }),
    sparseSearch(query, ids, filenames),
  ]);
  const dense = queryVector ? await denseSearch(queryVector, ids, filenames) : [];
  const fused = fuseHits(dense, sparse);
  if (fused.length === 0) return [];

  const reranked = await rerankChunks(query, fused.slice(0, Math.max(limit * 3, 20)), limit);
  const byId = new Map(fused.map((chunk) => [chunk.id, chunk]));
  return reranked.map((chunk) => byId.get(chunk.id) ?? chunk);
}

export function formatRetrievedContext(chunks: RetrievedChunk[]) {
  if (chunks.length === 0) return "";
  return chunks
    .map((chunk, index) => `${index + 1}. Source: ${chunk.filename}\n${chunk.content}`)
    .join("\n\n");
}
