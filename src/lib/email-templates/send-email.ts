import * as React from "react";
import { render } from "@react-email/render";
import Mailgun from "mailgun.js";
import FormData from "form-data";
import { TEMPLATES } from "./registry";

const SITE_NAME = "Aponchuk Workflow Systems LLC";

export type SendTemplateEmailResult =
  | { sent: true }
  | { sent: false; reason: "recipient_suppressed" | "not_configured" };

export interface SendTemplateEmailOptions {
  templateData?: Record<string, unknown>;
  idempotencyKey?: string;
  replyTo?: string;
}

function getClient() {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  if (!apiKey || !domain) return null;
  const mailgun = new Mailgun(FormData);
  return {
    client: mailgun.client({ username: "api", key: apiKey }),
    domain,
    from: process.env.MAILGUN_FROM || `${SITE_NAME} <noreply@aponchukworkflow.com>`,
  };
}

export async function sendTemplateEmail(
  templateName: string,
  to: string | string[],
  options: SendTemplateEmailOptions = {},
): Promise<SendTemplateEmailResult> {
  const mail = getClient();
  if (!mail) {
    throw new Error("MAILGUN_API_KEY or MAILGUN_DOMAIN is not configured");
  }

  const template = TEMPLATES[templateName];
  if (!template) {
    throw new Error(
      `Template '${templateName}' not found. Available: ${Object.keys(TEMPLATES).join(", ")}`,
    );
  }

  const recipients = (Array.isArray(to) ? to : [to]).filter(Boolean);
  if (recipients.length === 0) {
    throw new Error("At least one recipient is required");
  }

  const templateData = options.templateData ?? {};
  const element = React.createElement(template.component, templateData);
  const html = await render(element);
  const text = await render(element, { plainText: true });
  const subject =
    typeof template.subject === "function" ? template.subject(templateData) : template.subject;

  await mail.client.messages.create(mail.domain, {
    from: mail.from,
    to: recipients,
    subject,
    html,
    text,
    ...(options.replyTo ? { "h:Reply-To": options.replyTo } : {}),
  });

  return { sent: true };
}
