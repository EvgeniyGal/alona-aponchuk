import type { ChatMessageUi } from "@/lib/db/schema";

const VISITOR_KEY = "chat_visitor_id";
const CACHE_KEY = "chat_cache";

export type CachedChatMessage = {
  id: string;
  role: string;
  content: string;
  ui: ChatMessageUi | null;
  createdAt: string;
};

export type ChatCache = {
  sessionId: string;
  visitorId: string;
  messages: CachedChatMessage[];
  updatedAt: string;
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getOrCreateVisitorId(): string {
  if (!canUseStorage()) return "";

  const existing = localStorage.getItem(VISITOR_KEY);
  if (existing) return existing;

  const id = crypto.randomUUID();
  localStorage.setItem(VISITOR_KEY, id);
  return id;
}

export function readCache(): ChatCache | null {
  if (!canUseStorage()) return null;

  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ChatCache;
    if (!parsed.sessionId || !Array.isArray(parsed.messages)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeCache(cache: ChatCache) {
  if (!canUseStorage()) return;
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}

export function clearCache() {
  if (!canUseStorage()) return;
  localStorage.removeItem(CACHE_KEY);
}

export function serializeMessage(message: {
  id: string;
  role: string;
  content: string;
  ui: ChatMessageUi | null;
  createdAt: string | Date;
}): CachedChatMessage {
  return {
    id: message.id,
    role: message.role,
    content: message.content,
    ui: message.ui,
    createdAt: typeof message.createdAt === "string" ? message.createdAt : message.createdAt.toISOString(),
  };
}

export function chatFetchHeaders(visitorId: string, locale?: string): HeadersInit {
  const headers: Record<string, string> = {};
  if (visitorId) headers["X-Chat-Visitor-Id"] = visitorId;
  if (locale) headers["X-Chat-Locale"] = locale;
  return headers;
}
