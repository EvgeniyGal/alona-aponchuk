export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://aponchukworkflow.com").replace(/\/$/, "");
}

export function telegramWebhookUrl() {
  const base = siteUrl().replace(/^https:\/\/www\./i, "https://");
  return `${base}/api/telegram/webhook`;
}
