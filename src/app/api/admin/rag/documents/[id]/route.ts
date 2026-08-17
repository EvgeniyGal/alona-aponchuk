import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { requireAdminApi } from "@/lib/admin/require-admin-api";
import { getDb } from "@/lib/db";
import { ragDocuments } from "@/lib/db/schema";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await requireAdminApi();
  if (!gate.ok) return NextResponse.json({ ok: false, error: gate.error }, { status: gate.status });

  const { id } = await params;
  const db = getDb();
  await db.delete(ragDocuments).where(eq(ragDocuments.id, id));
  return NextResponse.json({ ok: true });
}
