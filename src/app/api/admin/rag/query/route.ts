import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/admin/require-admin-api";
import { localeFromRequest } from "@/lib/chat/session";
import { answerFromDocuments } from "@/lib/rag/query";

const schema = z.object({
  question: z.string().trim().min(1).max(2000),
  documentIds: z.union([z.literal("all"), z.array(z.string().min(1)).min(1)]),
});

export const maxDuration = 60;

export async function POST(request: Request) {
  const gate = await requireAdminApi();
  if (!gate.ok) return NextResponse.json({ ok: false, error: gate.error }, { status: gate.status });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Enter a question and select documents." }, { status: 400 });
  }

  const locale = localeFromRequest(request);
  const result = await answerFromDocuments({
    question: parsed.data.question,
    documentIds: parsed.data.documentIds,
    locale,
    applySafety: false,
  });

  return NextResponse.json({
    ok: true,
    answer: result.answer,
    chunks: result.chunks.map((chunk) => ({
      id: chunk.id,
      filename: chunk.filename,
      content: chunk.content,
      score: Number(chunk.score.toFixed(3)),
      chunkIndex: chunk.chunkIndex,
      matchedBy: chunk.matchedBy,
    })),
  });
}
