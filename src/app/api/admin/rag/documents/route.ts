import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { requireAdminApi } from "@/lib/admin/require-admin-api";
import { getDb } from "@/lib/db";
import { ragDocuments } from "@/lib/db/schema";
import { newId } from "@/lib/id";
import { isAllowedRagFile, RAG_MAX_BYTES } from "@/lib/rag/extract";
import { processRagDocument } from "@/lib/rag/process";

export const maxDuration = 60;

export async function GET() {
  const gate = await requireAdminApi();
  if (!gate.ok) return NextResponse.json({ ok: false, error: gate.error }, { status: gate.status });

  const db = getDb();
  const documents = await db.select().from(ragDocuments).orderBy(desc(ragDocuments.createdAt));
  return NextResponse.json({ ok: true, documents });
}

export async function POST(request: Request) {
  const gate = await requireAdminApi();
  if (!gate.ok) return NextResponse.json({ ok: false, error: gate.error }, { status: gate.status });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "Choose a file to upload." }, { status: 400 });
  }
  if (file.size > RAG_MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "File is larger than 4 MB." }, { status: 400 });
  }
  if (!isAllowedRagFile(file.name, file.type)) {
    return NextResponse.json({ ok: false, error: "Use TXT, PDF, DOC, or DOCX." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const db = getDb();
  const id = newId();
  const now = new Date();
  await db.insert(ragDocuments).values({
    id,
    filename: file.name,
    mimeType: file.type || "application/octet-stream",
    byteSize: file.size,
    status: "processing",
    createdAt: now,
    updatedAt: now,
  });

  try {
    await processRagDocument(id, file.name, buffer, file.type);
  } catch (error) {
    console.error("[rag/documents]", error);
  }

  const [document] = await db.select().from(ragDocuments).where(eq(ragDocuments.id, id)).limit(1);
  return NextResponse.json({ ok: true, document });
}
