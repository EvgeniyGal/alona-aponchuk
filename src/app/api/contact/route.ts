import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { contactSchema } from "@/lib/contact";
import { getDb } from "@/lib/db";
import { leads, type AssessmentAnswers } from "@/lib/db/schema";
import { newId } from "@/lib/id";
import { notifyNewLead } from "@/lib/notify/leads";
import { getLeadNotificationEmails } from "@/lib/notify/settings";
import { sendTemplateEmail } from "@/lib/email-templates/send-email";

function field(value: string, label = value): AssessmentAnswers[string] {
  return { value, label };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);
    const db = getDb();
    const id = newId();
    const now = new Date();

    const assessmentAnswers: AssessmentAnswers = {
      organization_type: field(data.orgType),
      role: field(data.role || ""),
      problem: field(data.problem),
      crm: field(data.crm || ""),
      scheduling: field(data.scheduling || ""),
      ai: field(data.ai || ""),
      forms: field(data.forms || ""),
      messaging: field(data.messaging || ""),
      leads: field(data.leads || ""),
      consults: field(data.consults || ""),
      clients: field(data.clients || ""),
      staff: field(data.staff || ""),
      lost: field(data.lost || ""),
      followup: field(data.followup || ""),
      afterForm: field(data.afterForm || ""),
      improve: field(data.improve || ""),
    };

    const [lead] = await db
      .insert(leads)
      .values({
        id,
        source: "contact_form",
        status: "new",
        fullName: data.name,
        organizationName: data.organization,
        workEmail: data.email.toLowerCase(),
        phone: data.phone,
        website: data.website,
        roleTitle: data.role,
        consentAt: now,
        assessmentAnswers,
        diagnosticSummary: null,
        transcript: [],
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    const notificationEmails = await getLeadNotificationEmails();
    const idempotencyKey = `workflow-audit-${data.email}-${Date.now()}`;

    if (!lead) {
      return NextResponse.json(
        { ok: false, error: "Could not save this request. Please email info@aponchukworkflow.com directly." },
        { status: 500 },
      );
    }

    const [notifyResult, emailResult] = await Promise.allSettled([
      notifyNewLead(lead, { email: false }),
      sendTemplateEmail("workflow-audit-request", notificationEmails, {
        templateData: data,
        idempotencyKey,
        replyTo: data.email,
      }),
    ]);

    if (notifyResult.status === "rejected") {
      console.error("[contact] telegram/notify", notifyResult.reason);
    }

    if (emailResult.status === "rejected") {
      console.error("[contact] email failed after lead save:", emailResult.reason);
      return NextResponse.json({ ok: true, delivered: false });
    }

    return NextResponse.json({ ok: true, delivered: emailResult.value.sent });
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
