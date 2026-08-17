import OpenAI from "openai";

const RERANK_MODEL = "gpt-4o-mini";
const SNIPPET_CHARS = 700;

type RankableChunk = {
  id: string;
  filename: string;
  content: string;
};

function snippet(content: string) {
  const trimmed = content.replace(/\s+/g, " ").trim();
  return trimmed.length <= SNIPPET_CHARS ? trimmed : `${trimmed.slice(0, SNIPPET_CHARS)}…`;
}

export async function rerankChunks<T extends RankableChunk>(
  query: string,
  chunks: T[],
  limit: number,
): Promise<T[]> {
  if (chunks.length <= limit) return chunks;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return chunks.slice(0, limit);

  const openai = new OpenAI({ apiKey });
  const catalog = chunks.map((chunk, index) => ({
    id: chunk.id,
    n: index + 1,
    source: chunk.filename,
    text: snippet(chunk.content),
  }));

  try {
    const completion = await openai.chat.completions.create({
      model: RERANK_MODEL,
      temperature: 0,
      max_tokens: 300,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            'Rank document chunks by how well they answer the user question. Return JSON {"ids":["..."]} with the most relevant chunk ids first. Use only the given ids. Prefer chunks that contain a direct answer over loosely related background.',
        },
        {
          role: "user",
          content: `Question:\n${query}\n\nChunks:\n${JSON.stringify(catalog)}`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content?.trim();
    if (!raw) return chunks.slice(0, limit);
    const parsed = JSON.parse(raw) as { ids?: unknown };
    const wanted = Array.isArray(parsed.ids)
      ? parsed.ids.filter((id): id is string => typeof id === "string")
      : [];
    const byId = new Map(chunks.map((chunk) => [chunk.id, chunk]));
    const ordered: T[] = [];
    for (const id of wanted) {
      const chunk = byId.get(id);
      if (chunk && !ordered.some((item) => item.id === id)) ordered.push(chunk);
      if (ordered.length >= limit) break;
    }
    for (const chunk of chunks) {
      if (ordered.length >= limit) break;
      if (!ordered.some((item) => item.id === chunk.id)) ordered.push(chunk);
    }
    return ordered.slice(0, limit);
  } catch (error) {
    console.error("[rag] rerank failed:", error);
    return chunks.slice(0, limit);
  }
}
