import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { contactSchema } from "@/lib/contact";
import { sendTemplateEmail } from "@/lib/email-templates/send-email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    const idempotencyKey = `workflow-audit-${data.email}-${Date.now()}`;
    const result = await sendTemplateEmail(
      "workflow-audit-request",
      "info@aponchukworkflow.com",
      {
        templateData: data,
        idempotencyKey,
        replyTo: data.email,
      },
    );

    if (!result.sent) {
      console.warn("[contact] Send suppressed:", result.reason);
    }

    return NextResponse.json({ ok: true, delivered: result.sent });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { ok: false, error: "Please check the form fields and try again." },
        { status: 400 },
      );
    }

    console.error("[contact] Failed to submit:", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please email info@aponchukworkflow.com directly.",
      },
      { status: 500 },
    );
  }
}
