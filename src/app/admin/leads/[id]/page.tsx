import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin/require-admin";
import { getDb } from "@/lib/db";
import { chatMessages, leads } from "@/lib/db/schema";
import { LeadDetailView, type LeadDetailData } from "@/components/admin/lead-detail-view";
import type { LeadStatus } from "@/lib/admin/lead-status";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const db = getDb();
  const [lead] = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  if (!lead) notFound();

  let chatMessagesRows: LeadDetailData["chatMessages"] = [];
  if (lead.sessionId) {
    const messages = await db
      .select({
        id: chatMessages.id,
        role: chatMessages.role,
        content: chatMessages.content,
        createdAt: chatMessages.createdAt,
      })
      .from(chatMessages)
      .where(eq(chatMessages.sessionId, lead.sessionId))
      .orderBy(asc(chatMessages.createdAt));

    chatMessagesRows = messages.map((message) => ({
      id: message.id,
      role: message.role,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
    }));
  }

  const detail: LeadDetailData = {
    id: lead.id,
    source: lead.source,
    status: lead.status as LeadStatus,
    fullName: lead.fullName,
    organizationName: lead.organizationName,
    workEmail: lead.workEmail,
    phone: lead.phone,
    website: lead.website,
    roleTitle: lead.roleTitle,
    consentAt: lead.consentAt.toISOString(),
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
    notifiedAt: lead.notifiedAt?.toISOString() ?? null,
    diagnosticSummary: lead.diagnosticSummary,
    assessmentAnswers: lead.assessmentAnswers,
    transcript: lead.transcript,
    sessionId: lead.sessionId,
    chatMessages: chatMessagesRows,
  };

  return <LeadDetailView lead={detail} />;
}
