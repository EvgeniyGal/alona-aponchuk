import mammoth from "mammoth";
import { extractText } from "unpdf";

const MAX_BYTES = 4 * 1024 * 1024;

export const RAG_MAX_BYTES = MAX_BYTES;

export const RAG_ALLOWED_TYPES: Record<string, string[]> = {
  "text/plain": [".txt"],
  "application/pdf": [".pdf"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
};

export function extensionOf(filename: string) {
  const index = filename.lastIndexOf(".");
  return index >= 0 ? filename.slice(index).toLowerCase() : "";
}

export function isAllowedRagFile(filename: string, mimeType: string) {
  const ext = extensionOf(filename);
  if (ext === ".txt" || ext === ".pdf" || ext === ".doc" || ext === ".docx") return true;
  return Boolean(RAG_ALLOWED_TYPES[mimeType]);
}

export async function extractDocumentText(filename: string, buffer: Buffer, mimeType: string) {
  const ext = extensionOf(filename);
  if (ext === ".txt" || mimeType.startsWith("text/")) {
    return buffer.toString("utf8");
  }
  if (ext === ".pdf" || mimeType === "application/pdf") {
    const result = await extractText(new Uint8Array(buffer));
    const text = Array.isArray(result.text) ? result.text.join("\n") : result.text;
    return String(text || "").trim();
  }
  if (ext === ".docx" || mimeType.includes("wordprocessingml")) {
    const result = await mammoth.extractRawText({ buffer });
    return (result.value || "").trim();
  }
  if (ext === ".doc" || mimeType === "application/msword") {
    const WordExtractor = (await import("word-extractor")).default;
    const extractor = new WordExtractor();
    const extracted = await extractor.extract(buffer);
    return (extracted.getBody() || "").trim();
  }
  throw new Error("Unsupported file type. Use TXT, PDF, DOC, or DOCX.");
}
