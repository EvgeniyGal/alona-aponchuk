import { sql } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  vector,
} from "drizzle-orm/pg-core";

export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "contacted",
  "call_scheduled",
  "qualified",
  "closed",
]);

export const leadSourceEnum = pgEnum("lead_source", ["chat_assessment", "contact_form"]);

export const userRoleEnum = pgEnum("user_role", ["admin"]);

export const chatModeEnum = pgEnum("chat_mode", [
  "welcome",
  "assessment",
  "faq",
  "services",
  "diagnostic",
  "lead_capture",
  "done",
]);

export const tokenPurposeEnum = pgEnum("token_purpose", [
  "invite",
  "password_reset",
  "telegram_link",
]);

export type AssessmentAnswer = {
  value: string | string[];
  label: string | string[];
  extra?: string;
};

export type AssessmentAnswers = Record<string, AssessmentAnswer>;

export type ChatMessageUi = {
  kind:
    | "welcome_ctas"
    | "buttons"
    | "multi_buttons"
    | "text_input"
    | "lead_form"
    | "followup_ctas";
  step?: string;
  options?: Array<{ label: string; compactLabel?: string; value: string }>;
  placeholder?: string;
  inputMode?: "text" | "numeric";
  prefill?: Record<string, string>;
};

export type TranscriptLine = {
  role: string;
  content: string;
  createdAt: string;
};

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  passwordHash: text("password_hash"),
  name: text("name"),
  emailVerified: timestamp("email_verified", { withTimezone: true }),
  approved: boolean("approved").notNull().default(false),
  role: userRoleEnum("role").notNull().default("admin"),
  telegramUserId: text("telegram_user_id"),
  telegramChatId: text("telegram_chat_id"),
  telegramUsername: text("telegram_username"),
  telegramLinkedAt: timestamp("telegram_linked_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("users_email_idx").on(table.email),
  uniqueIndex("users_telegram_user_id_idx").on(table.telegramUserId),
]);

export const authTokens = pgTable("auth_tokens", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  email: text("email"),
  purpose: tokenPurposeEnum("purpose").notNull(),
  tokenHash: text("token_hash").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  usedAt: timestamp("used_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("auth_tokens_hash_idx").on(table.tokenHash),
]);

export const chatSessions = pgTable("chat_sessions", {
  id: text("id").primaryKey(),
  visitorId: text("visitor_id"),
  locale: text("locale").notNull().default("en"),
  mode: chatModeEnum("mode").notNull().default("welcome"),
  assessmentStep: text("assessment_step"),
  assessmentAnswers: jsonb("assessment_answers").$type<AssessmentAnswers>().notNull().default({}),
  pendingOtherField: text("pending_other_field"),
  leadId: text("lead_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("chat_sessions_visitor_idx").on(table.visitorId),
]);

export const chatMessages = pgTable("chat_messages", {
  id: text("id").primaryKey(),
  sessionId: text("session_id")
    .notNull()
    .references(() => chatSessions.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  content: text("content").notNull(),
  ui: jsonb("ui").$type<ChatMessageUi | null>(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("chat_messages_session_idx").on(table.sessionId),
]);

export const leads = pgTable("leads", {
  id: text("id").primaryKey(),
  source: leadSourceEnum("source").notNull(),
  status: leadStatusEnum("status").notNull().default("new"),
  fullName: text("full_name").notNull(),
  organizationName: text("organization_name").notNull(),
  workEmail: text("work_email").notNull(),
  phone: text("phone"),
  website: text("website"),
  roleTitle: text("role_title"),
  consentAt: timestamp("consent_at", { withTimezone: true }).notNull(),
  assessmentAnswers: jsonb("assessment_answers").$type<AssessmentAnswers>().notNull().default({}),
  diagnosticSummary: text("diagnostic_summary"),
  transcript: jsonb("transcript").$type<TranscriptLine[]>().notNull().default([]),
  sessionId: text("session_id"),
  notifiedAt: timestamp("notified_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("leads_status_idx").on(table.status),
  index("leads_created_idx").on(table.createdAt),
]);

export const knowledgeBaseEntries = pgTable("knowledge_base_entries", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull(),
  intent: text("intent").notNull(),
  approvedAnswer: text("approved_answer").notNull(),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("kb_slug_idx").on(table.slug),
]);

export const assistantSettings = pgTable("assistant_settings", {
  id: text("id").primaryKey(),
  openaiModel: text("openai_model").notNull().default("gpt-4o-mini"),
  temperature: doublePrecision("temperature").notNull().default(0.3),
  systemPrompt: text("system_prompt").notNull(),
  faqPrompt: text("faq_prompt").notNull(),
  diagnosticPrompt: text("diagnostic_prompt").notNull(),
  fallbackUnknown: text("fallback_unknown").notNull(),
  fallbackMedical: text("fallback_medical").notNull(),
  fallbackPhi: text("fallback_phi").notNull(),
  fallbackGuarantee: text("fallback_guarantee").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type TelegramRecipient = {
  telegramUserId: string;
  telegramChatId: string;
  telegramUsername: string | null;
  linkedAt: string;
};

export const notificationSettings = pgTable("notification_settings", {
  id: text("id").primaryKey(),
  leadEmails: jsonb("lead_emails").$type<string[]>().notNull().default([]),
  telegramRecipients: jsonb("telegram_recipients").$type<TelegramRecipient[]>().notNull().default([]),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const ragDocumentStatusEnum = pgEnum("rag_document_status", ["processing", "ready", "error"]);

export const ragDocuments = pgTable("rag_documents", {
  id: text("id").primaryKey(),
  filename: text("filename").notNull(),
  mimeType: text("mime_type").notNull(),
  byteSize: integer("byte_size").notNull(),
  status: ragDocumentStatusEnum("status").notNull().default("processing"),
  errorMessage: text("error_message"),
  chunkCount: integer("chunk_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const ragChunks = pgTable("rag_chunks", {
  id: text("id").primaryKey(),
  documentId: text("document_id")
    .notNull()
    .references(() => ragDocuments.id, { onDelete: "cascade" }),
  chunkIndex: integer("chunk_index").notNull(),
  content: text("content").notNull(),
  tokenCount: integer("token_count").notNull().default(0),
  embedding: vector("embedding", { dimensions: 1536 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("rag_chunks_document_idx").on(table.documentId),
  index("rag_chunks_embedding_hnsw").using("hnsw", table.embedding.op("vector_cosine_ops")),
  index("rag_chunks_content_fts").using("gin", sql`to_tsvector('simple', content)`),
]);

export type User = typeof users.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type ChatSession = typeof chatSessions.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type KnowledgeBaseEntry = typeof knowledgeBaseEntries.$inferSelect;
export type AssistantSettings = typeof assistantSettings.$inferSelect;
export type NotificationSettings = typeof notificationSettings.$inferSelect;
export type RagDocument = typeof ragDocuments.$inferSelect;
export type RagChunk = typeof ragChunks.$inferSelect;
