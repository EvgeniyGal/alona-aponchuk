import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";

dotenv.config({ path: ".env.local" });
dotenv.config();

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured");

  const sql = neon(url);
  await sql`
    ALTER TABLE notification_settings
    ADD COLUMN IF NOT EXISTS telegram_recipients jsonb NOT NULL DEFAULT '[]'::jsonb
  `;
  console.log("Added notification_settings.telegram_recipients");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
