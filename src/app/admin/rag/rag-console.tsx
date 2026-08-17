"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import type { RagDocument } from "@/lib/db/schema";

type ChunkHit = {
  id: string;
  filename: string;
  content: string;
  score: number;
  chunkIndex: number;
  matchedBy?: Array<"vector" | "keyword">;
};

export function RagConsole({ initialDocuments }: { initialDocuments: RagDocument[] }) {
  const t = useTranslations("admin.rag");
  const locale = useLocale();
  const router = useRouter();
  const [documents, setDocuments] = useState(initialDocuments);
  const [allDocs, setAllDocs] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [chunks, setChunks] = useState<ChunkHit[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploading, startUpload] = useTransition();
  const [asking, startAsk] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const readyDocs = useMemo(() => documents.filter((doc) => doc.status === "ready"), [documents]);

  async function refresh() {
    const res = await fetch("/api/admin/rag/documents");
    const json = await res.json();
    if (json.ok) setDocuments(json.documents);
    router.refresh();
  }

  function statusLabel(status: RagDocument["status"]) {
    if (status === "ready") return t("statusReady");
    if (status === "processing") return t("statusProcessing");
    return t("statusError");
  }

  return (
    <div className="mt-8 space-y-8">
      <form
        className="rounded-xl border border-hairline bg-white p-5"
        onSubmit={(event) => {
          event.preventDefault();
          const form = event.currentTarget;
          const data = new FormData(form);
          setError(null);
          startUpload(async () => {
            const res = await fetch("/api/admin/rag/documents", { method: "POST", body: data });
            const json = await res.json();
            if (!res.ok || !json.ok) {
              setError(json.error || t("uploading"));
              return;
            }
            form.reset();
            await refresh();
          });
        }}
      >
        <h2 className="font-display text-lg">{t("upload")}</h2>
        <p className="mt-1 text-[13px] text-muted-foreground">{t("formats")}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input
            type="file"
            name="file"
            required
            accept=".txt,.pdf,.doc,.docx,text/plain,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="text-[13px]"
          />
          <button
            type="submit"
            disabled={uploading}
            className="rounded-md bg-blue px-4 py-2 text-[13.5px] font-medium text-white disabled:opacity-60"
          >
            {uploading ? t("uploading") : t("choose")}
          </button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-hairline bg-white">
        {documents.length === 0 ? (
          <p className="px-5 py-10 text-center text-[14px] text-muted-foreground">{t("empty")}</p>
        ) : (
          <table className="w-full min-w-[640px] text-left text-[13.5px]">
            <thead className="border-b border-hairline bg-ivory/80 text-[12px] uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">{t("filename")}</th>
                <th className="px-4 py-3">{t("status")}</th>
                <th className="px-4 py-3">{t("chunks")}</th>
                <th className="px-4 py-3">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="border-b border-hairline last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium text-graphite">{doc.filename}</div>
                    {doc.errorMessage ? <p className="mt-1 text-[12px] text-destructive">{doc.errorMessage}</p> : null}
                  </td>
                  <td className="px-4 py-3">{statusLabel(doc.status)}</td>
                  <td className="px-4 py-3">{doc.chunkCount}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      disabled={deletingId === doc.id}
                      onClick={() => {
                        setDeletingId(doc.id);
                        void fetch(`/api/admin/rag/documents/${doc.id}`, { method: "DELETE" })
                          .then(refresh)
                          .finally(() => setDeletingId(null));
                      }}
                      className="rounded-md border border-hairline px-3 py-1.5 text-[13px]"
                    >
                      {deletingId === doc.id ? t("deleting") : t("delete")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <form
        className="rounded-xl border border-hairline bg-white p-5 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          setError(null);
          setAnswer(null);
          setChunks([]);
          if (!question.trim()) {
            setError(t("needQuestion"));
            return;
          }
          if (readyDocs.length === 0) {
            setError(t("noReady"));
            return;
          }
          if (!allDocs && selected.length === 0) {
            setError(t("selectOne"));
            return;
          }
          startAsk(async () => {
            const res = await fetch("/api/admin/rag/query", {
              method: "POST",
              headers: { "Content-Type": "application/json", "X-Chat-Locale": locale },
              body: JSON.stringify({
                question: question.trim(),
                documentIds: allDocs ? "all" : selected,
              }),
            });
            const json = await res.json();
            if (!res.ok || !json.ok) {
              setError(json.error || t("asking"));
              return;
            }
            setAnswer(json.answer);
            setChunks(json.chunks ?? []);
          });
        }}
      >
        <div>
          <h2 className="font-display text-lg">{t("testTitle")}</h2>
          <p className="mt-1 text-[13.5px] text-muted-foreground">{t("testLead")}</p>
        </div>
        <label className="flex items-center gap-2 text-[14px]">
          <input
            type="checkbox"
            checked={allDocs}
            onChange={(event) => setAllDocs(event.target.checked)}
          />
          {t("allDocs")}
        </label>
        {!allDocs ? (
          <div>
            <p className="mb-2 text-[13px] font-medium">{t("selectDocs")}</p>
            <div className="space-y-1.5">
              {readyDocs.map((doc) => (
                <label key={doc.id} className="flex items-center gap-2 text-[13.5px]">
                  <input
                    type="checkbox"
                    checked={selected.includes(doc.id)}
                    onChange={(event) => {
                      setSelected((current) =>
                        event.target.checked ? [...current, doc.id] : current.filter((id) => id !== doc.id),
                      );
                    }}
                  />
                  {doc.filename}
                </label>
              ))}
            </div>
          </div>
        ) : null}
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium">{t("question")}</span>
          <textarea
            className="w-full rounded-md border border-hairline px-3 py-2 text-[14px] outline-none focus:border-blue"
            rows={3}
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder={t("questionPh")}
          />
        </label>
        {error ? <p className="text-[13px] text-destructive">{error}</p> : null}
        <button
          type="submit"
          disabled={asking}
          className="rounded-md bg-blue px-4 py-2 text-[13.5px] font-medium text-white disabled:opacity-60"
        >
          {asking ? t("asking") : t("ask")}
        </button>
        {answer ? (
          <div className="rounded-lg border border-hairline bg-ivory/60 p-4">
            <h3 className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">{t("answer")}</h3>
            <p className="mt-2 whitespace-pre-wrap text-[14.5px] leading-relaxed text-graphite">{answer}</p>
          </div>
        ) : null}
        {chunks.length > 0 ? (
          <div className="space-y-3">
            <h3 className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">{t("sources")}</h3>
            {chunks.map((chunk) => (
              <article key={chunk.id} className="rounded-lg border border-hairline p-4">
                <p className="text-[12px] font-medium text-blue">
                  {chunk.filename} · {t("score", { score: chunk.score })}
                  {chunk.matchedBy?.includes("vector") ? ` · ${t("matchVector")}` : ""}
                  {chunk.matchedBy?.includes("keyword") ? ` · ${t("matchKeyword")}` : ""}
                </p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {chunk.content}
                </p>
              </article>
            ))}
          </div>
        ) : answer ? (
          <p className="text-[13px] text-muted-foreground">{t("noSources")}</p>
        ) : null}
      </form>
    </div>
  );
}
