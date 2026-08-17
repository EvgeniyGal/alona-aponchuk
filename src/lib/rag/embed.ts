import OpenAI from "openai";
import { estimateTokens } from "@/lib/rag/chunk";

export const EMBEDDING_MODEL = "text-embedding-3-small";
export const EMBEDDING_DIMENSIONS = 1536;
export const EMBEDDING_BATCH_SIZE = 64;
export const MAX_TOKENS_PER_BATCH = 80_000;
const MAX_INPUTS_PER_REQUEST = 2048;

function client() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured");
  return new OpenAI({ apiKey });
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildBatches(texts: string[]) {
  const batches: string[][] = [];
  let current: string[] = [];
  let tokens = 0;

  for (const text of texts) {
    const estimated = estimateTokens(text);
    const wouldExceedCount = current.length >= EMBEDDING_BATCH_SIZE || current.length >= MAX_INPUTS_PER_REQUEST;
    const wouldExceedTokens = current.length > 0 && tokens + estimated > MAX_TOKENS_PER_BATCH;
    if (wouldExceedCount || wouldExceedTokens) {
      batches.push(current);
      current = [];
      tokens = 0;
    }
    current.push(text);
    tokens += estimated;
  }
  if (current.length) batches.push(current);
  return batches;
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  const openai = client();
  const vectors: number[][] = [];
  const batches = buildBatches(texts);

  for (const batch of batches) {
    let attempt = 0;
    while (true) {
      try {
        const response = await openai.embeddings.create({
          model: EMBEDDING_MODEL,
          input: batch,
        });
        const ordered = [...response.data].sort((a, b) => a.index - b.index);
        for (const item of ordered) {
          vectors.push(item.embedding);
        }
        break;
      } catch (error) {
        const status = typeof error === "object" && error && "status" in error ? Number(error.status) : 0;
        if (status === 429 && attempt < 4) {
          attempt += 1;
          await sleep(400 * attempt);
          continue;
        }
        throw error;
      }
    }
  }

  return vectors;
}

export async function embedQuery(text: string) {
  const [vector] = await embedTexts([text]);
  return vector;
}

export function toVectorLiteral(values: number[]) {
  return `[${values.map((value) => (Number.isFinite(value) ? value : 0)).join(",")}]`;
}

export function parseEmbedding(raw: unknown) {
  if (!raw) return null;
  if (Array.isArray(raw)) {
    return raw.every((value) => typeof value === "number") ? (raw as number[]) : null;
  }
  if (typeof raw !== "string") return null;
  try {
    const parsed = JSON.parse(raw) as number[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function cosineSimilarity(a: number[], b: number[]) {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i += 1) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  if (!magA || !magB) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}
