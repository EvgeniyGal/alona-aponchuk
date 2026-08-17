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
    ADD COLUMN IF NOT EXISTS lead_emails jsonb NOT NULL DEFAULT '[]'::jsonb
  `;

  await sql`
    UPDATE notification_settings
    SET lead_emails = jsonb_build_array(lead_email)
    WHERE lead_email IS NOT NULL
      AND lead_email <> ''
      AND (lead_emails IS NULL OR lead_emails = '[]'::jsonb)
  `;

  await sql`
    ALTER TABLE notification_settings
    DROP COLUMN IF EXISTS lead_email
  `;

  console.log("Migrated notification_settings.lead_email -> lead_emails");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
