import type { ChatSession } from "@/lib/db/schema";

const CHAT_MODE_LABELS: Record<ChatSession["mode"], string> = {
  welcome: "Welcome",
  assessment: "Assessment",
  faq: "FAQ",
  services: "Services",
  diagnostic: "Diagnostic",
  lead_capture: "Lead capture",
  done: "Done",
};

export function formatChatMode(mode: ChatSession["mode"]) {
  return CHAT_MODE_LABELS[mode] ?? mode;
}

export const CHAT_MODES = Object.keys(CHAT_MODE_LABELS) as ChatSession["mode"][];

export function truncateId(id: string | null | undefined, length = 8) {
  if (!id) return "—";
  if (id.length <= length) return id;
  return `${id.slice(0, length)}…`;
}
