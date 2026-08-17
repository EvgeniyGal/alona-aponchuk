import dotenv from "dotenv";
import { telegramWebhookUrl } from "../src/lib/site-url";

dotenv.config({ path: ".env.local" });
dotenv.config();

async function main() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not configured");

  const res = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
  const json = await res.json();
  console.log("Expected webhook URL:", telegramWebhookUrl());
  console.log(JSON.stringify(json, null, 2));
}

main().catch(console.error);
