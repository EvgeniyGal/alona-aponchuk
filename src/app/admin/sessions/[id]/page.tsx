import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin/require-admin";
import { SessionDetailView, type SessionDetailData } from "@/components/admin/session-detail-view";
import { getDb } from "@/lib/db";
import { chatMessages, chatSessions, leads } from "@/lib/db/schema";

export default async function SessionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const db = getDb();

  const [session] = await db.select().from(chatSessions).where(eq(chatSessions.id, id)).limit(1);
  if (!session) notFound();

  const messages = await db
    .select({
      id: chatMessages.id,
      role: chatMessages.role,
      content: chatMessages.content,
      createdAt: chatMessages.createdAt,
    })
    .from(chatMessages)
    .where(eq(chatMessages.sessionId, session.id))
    .orderBy(asc(chatMessages.createdAt));

  let leadName: string | null = null;
  let leadEmail: string | null = null;
  if (session.leadId) {
    const [lead] = await db
      .select({ fullName: leads.fullName, workEmail: leads.workEmail })
      .from(leads)
      .where(eq(leads.id, session.leadId))
      .limit(1);
    leadName = lead?.fullName ?? null;
    leadEmail = lead?.workEmail ?? null;
  }

  const detail: SessionDetailData = {
    id: session.id,
    visitorId: session.visitorId,
    mode: session.mode,
    leadId: session.leadId,
    leadName,
    leadEmail,
    createdAt: session.createdAt.toISOString(),
    updatedAt: session.updatedAt.toISOString(),
    assessmentAnswers: session.assessmentAnswers,
    chatMessages: messages.map((message) => ({
      id: message.id,
      role: message.role,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
    })),
  };

  return <SessionDetailView session={detail} />;
}
