import "dotenv/config";
import { eq } from "drizzle-orm";
import { getDb } from "../src/lib/db";
import { assistantSettings, knowledgeBaseEntries, users } from "../src/lib/db/schema";
import { hashPassword } from "../src/lib/auth/password";
import { KNOWLEDGE_BASE_SEED } from "../src/lib/chat/knowledge-base.seed";
import {
  DEFAULT_DIAGNOSTIC_PROMPT,
  DEFAULT_FAQ_PROMPT,
  DEFAULT_SYSTEM_PROMPT,
  FALLBACK_GUARANTEE,
  FALLBACK_MEDICAL,
  FALLBACK_PHI,
  FALLBACK_UNKNOWN,
} from "../src/lib/chat/defaults";
import { newId } from "../src/lib/id";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required to seed the first admin.");
  }
  if (password.length < 10) {
    throw new Error("ADMIN_PASSWORD must be at least 10 characters.");
  }

  const db = getDb();
  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!existing) {
    await db.insert(users).values({
      id: newId(),
      email,
      passwordHash: await hashPassword(password),
      name: "Admin",
      emailVerified: new Date(),
      approved: true,
      role: "admin",
    });
    console.log(`Created admin ${email}`);
  } else {
    console.log(`Admin ${email} already exists`);
  }

  const [settings] = await db.select().from(assistantSettings).where(eq(assistantSettings.id, "default")).limit(1);
  if (!settings) {
    await db.insert(assistantSettings).values({
      id: "default",
      openaiModel: "gpt-4o-mini",
      temperature: 0.3,
      systemPrompt: DEFAULT_SYSTEM_PROMPT,
      faqPrompt: DEFAULT_FAQ_PROMPT,
      diagnosticPrompt: DEFAULT_DIAGNOSTIC_PROMPT,
      fallbackUnknown: FALLBACK_UNKNOWN,
      fallbackMedical: FALLBACK_MEDICAL,
      fallbackPhi: FALLBACK_PHI,
      fallbackGuarantee: FALLBACK_GUARANTEE,
    });
    console.log("Inserted default assistant settings");
  }

  const existingKb = await db.select({ slug: knowledgeBaseEntries.slug }).from(knowledgeBaseEntries);
  const have = new Set(existingKb.map((row) => row.slug));
  let inserted = 0;
  for (const [index, entry] of KNOWLEDGE_BASE_SEED.entries()) {
    if (have.has(entry.slug)) continue;
    await db.insert(knowledgeBaseEntries).values({
      id: newId(),
      slug: entry.slug,
      intent: entry.intent,
      approvedAnswer: entry.approvedAnswer,
      active: true,
      sortOrder: index,
    });
    inserted += 1;
  }
  console.log(`Knowledge base entries inserted: ${inserted}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
