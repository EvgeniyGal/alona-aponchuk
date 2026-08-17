const TARGET_CHARS = 2000;
const OVERLAP_CHARS = 200;
const MAX_CHUNK_CHARS = 24_000;

export type TextChunk = {
  index: number;
  content: string;
  tokenCount: number;
};

export function estimateTokens(text: string) {
  return Math.max(1, Math.ceil(text.length / 4));
}

export function chunkText(raw: string): TextChunk[] {
  const text = raw.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  if (!text) return [];

  const parts: string[] = [];
  let start = 0;
  while (start < text.length) {
    let end = Math.min(start + TARGET_CHARS, text.length);
    if (end < text.length) {
      const window = text.slice(start, end);
      const breakAt = Math.max(window.lastIndexOf("\n\n"), window.lastIndexOf(". "), window.lastIndexOf(" "));
      if (breakAt > TARGET_CHARS * 0.4) {
        end = start + breakAt + 1;
      }
    }
    const slice = text.slice(start, end).trim();
    if (slice) parts.push(slice.slice(0, MAX_CHUNK_CHARS));
    if (end >= text.length) break;
    start = Math.max(end - OVERLAP_CHARS, start + 1);
  }

  return parts.map((content, index) => ({
    index,
    content,
    tokenCount: estimateTokens(content),
  }));
}
