import "dotenv/config";
import { telegramWebhookUrl } from "../src/lib/site-url";

async function main() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!token || !secret) {
    throw new Error("TELEGRAM_BOT_TOKEN and TELEGRAM_WEBHOOK_SECRET are required.");
  }
  const url = telegramWebhookUrl();
  const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url,
      secret_token: secret,
      allowed_updates: ["message"],
    }),
  });
  const json = await res.json();
  console.log(json);
  if (!json.ok) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
