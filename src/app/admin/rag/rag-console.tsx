"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { FileUp, Loader2, Trash2 } from "lucide-react";
import type { RagDocument } from "@/lib/db/schema";
import { cn, adminTableHeadClass } from "@/lib/utils";

type ChunkHit = {
  id: string;
  filename: string;
  content: string;
  score: number;
  chunkIndex: number;
  matchedBy?: Array<"vector" | "keyword">;
};

function DeleteDocumentDialog({
  filename,
  pending,
  onCancel,
  onConfirm,
}: {
  filename: string;
  pending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const t = useTranslations("admin.rag");
  const common = useTranslations("common");

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !pending) onCancel();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pending, onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-graphite/35 px-4"
      onClick={() => {
        if (!pending) onCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-rag-title"
        className="w-full max-w-md rounded-xl border border-hairline bg-white p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="delete-rag-title" className="font-display text-xl text-graphite">
          {t("deleteTitle")}
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
          {t("deleteBody", { name: filename })}
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={onCancel}
            className="cursor-pointer rounded-md border border-hairline px-3 py-2 text-[13px] font-medium text-graphite hover:bg-ivory disabled:opacity-60"
          >
            {common("cancel")}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={onConfirm}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md bg-destructive px-3 py-2 text-[13px] font-medium text-white hover:bg-destructive/90 disabled:opacity-60"
          >
            {pending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            {pending ? t("deleting") : t("delete")}
          </button>
        </div>
      </div>
    </div>
  );
}

function SourceChunk({ chunk }: { chunk: ChunkHit }) {
  const t = useTranslations("admin.rag");
  const [open, setOpen] = useState(false);
  const long = chunk.content.length > 420;

  return (
    <article className="rounded-lg border border-hairline p-4">
      <p className="text-[12px] font-medium text-blue">
        {chunk.filename}
        {` · ${t("chunkIndex", { n: chunk.chunkIndex + 1 })}`}
        {` · ${t("score", { score: chunk.score })}`}
        {chunk.matchedBy?.includes("vector") ? ` · ${t("matchVector")}` : ""}
        {chunk.matchedBy?.includes("keyword") ? ` · ${t("matchKeyword")}` : ""}
      </p>
      <p
        className={cn(
          "mt-2 whitespace-pre-wrap text-[13.5px] leading-relaxed text-muted-foreground",
          !open && long && "line-clamp-6",
        )}
      >
        {chunk.content}
      </p>
      {long ? (
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="mt-2 cursor-pointer text-[12.5px] font-medium text-blue hover:underline"
        >
          {open ? t("showLess") : t("showMore")}
        </button>
      ) : null}
    </article>
  );
}

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
  const [hasResult, setHasResult] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, startUpload] = useTransition();
  const [asking, startAsk] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDoc, setConfirmDoc] = useState<RagDocument | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const readyDocs = useMemo(() => documents.filter((doc) => doc.status === "ready"), [documents]);

  function acceptFile(next: File | undefined | null) {
    if (!next) return;
    const name = next.name.toLowerCase();
    const allowed = [".txt", ".pdf", ".doc", ".docx"].some((ext) => name.endsWith(ext));
    if (!allowed) {
      setError(t("fileType"));
      return;
    }
    if (next.size > 4 * 1024 * 1024) {
      setError(t("fileTooLarge"));
      return;
    }
    setError(null);
    setFile(next);
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

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

  function confirmDelete() {
    if (!confirmDoc) return;
    const doc = confirmDoc;
    setDeletingId(doc.id);
    void fetch(`/api/admin/rag/documents/${doc.id}`, { method: "DELETE" })
      .then(async (res) => {
        if (!res.ok) {
          setError(t("deleteError"));
          return;
        }
        setConfirmDoc(null);
        setSelected((current) => current.filter((id) => id !== doc.id));
        await refresh();
      })
      .finally(() => setDeletingId(null));
  }

  return (
    <>
    <div className="mt-8 space-y-8">
      <form
        className="rounded-xl border border-hairline bg-white p-5"
        onSubmit={(event) => {
          event.preventDefault();
          if (!file || uploading) return;
          const data = new FormData();
          data.set("file", file);
          setError(null);
          startUpload(async () => {
            const res = await fetch("/api/admin/rag/documents", { method: "POST", body: data });
            const json = await res.json();
            if (!res.ok || !json.ok) {
              setError(json.error || t("uploading"));
              return;
            }
            setFile(null);
            if (fileInput.current) fileInput.current.value = "";
            await refresh();
          });
        }}
      >
        <h2 className="font-display text-lg">{t("upload")}</h2>
        <p className="mt-1 text-[13px] text-muted-foreground">{t("formats")}</p>
        <input
          ref={fileInput}
          type="file"
          name="file"
          accept=".txt,.pdf,.doc,.docx,text/plain,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="sr-only"
          onChange={(event) => acceptFile(event.target.files?.[0] ?? null)}
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileInput.current?.click()}
          onDragEnter={(event) => {
            event.preventDefault();
            setDragOver(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            if (event.currentTarget.contains(event.relatedTarget as Node)) return;
            setDragOver(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setDragOver(false);
            acceptFile(event.dataTransfer.files?.[0] ?? null);
          }}
          className={cn(
            "mt-4 flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed px-4 py-8 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-60",
            dragOver ? "border-blue bg-blue-soft/40" : "border-hairline bg-ivory/50 hover:border-blue hover:bg-blue-soft/20",
          )}
        >
          <FileUp className="mb-2 text-blue" size={22} />
          {file ? (
            <>
              <p className="text-[14px] font-medium text-graphite">{file.name}</p>
              <p className="mt-1 text-[12.5px] text-muted-foreground">{formatSize(file.size)} · {t("changeFile")}</p>
            </>
          ) : (
            <>
              <p className="text-[14px] font-medium text-graphite">{t("dropHint")}</p>
              <p className="mt-1 text-[12.5px] text-muted-foreground">{t("choose")}</p>
            </>
          )}
        </button>
        {error ? <p className="mt-3 text-[13px] text-destructive">{error}</p> : null}
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={uploading || !file}
            className="rounded-md bg-blue px-4 py-2 text-[13.5px] font-medium text-white disabled:opacity-60"
          >
            {uploading ? t("uploading") : t("uploadAction")}
          </button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-xl border border-hairline bg-white">
        {documents.length === 0 ? (
          <p className="px-5 py-10 text-center text-[14px] text-muted-foreground">{t("empty")}</p>
        ) : (
          <table className="w-full min-w-[640px] text-left text-[13.5px]">
            <thead className={adminTableHeadClass}>
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
                      onClick={() => setConfirmDoc(doc)}
                      aria-label={`${t("delete")} ${doc.filename}`}
                      className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-hairline text-muted-foreground hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive disabled:opacity-60"
                    >
                      {deletingId === doc.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
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
          setHasResult(false);
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
            setHasResult(true);
            requestAnimationFrame(() => {
              resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            });
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
            <div className="max-h-48 space-y-1.5 overflow-y-auto rounded-md border border-hairline p-3">
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
        {hasResult ? (
          <div ref={resultsRef} className="space-y-4 border-t border-hairline pt-4">
            <div className="rounded-lg border border-hairline bg-ivory/60 p-4">
              <h3 className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">{t("answer")}</h3>
              <p className="mt-2 whitespace-pre-wrap text-[14.5px] leading-relaxed text-graphite">
                {answer || "—"}
              </p>
            </div>
            {chunks.length > 0 ? (
              <div className="space-y-3">
                <h3 className="text-[12px] font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("sourcesFromDb", { count: chunks.length })}
                </h3>
                {chunks.map((chunk) => (
                  <SourceChunk key={chunk.id} chunk={chunk} />
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-muted-foreground">{t("noSources")}</p>
            )}
          </div>
        ) : null}
      </form>
    </div>
    {confirmDoc ? (
      <DeleteDocumentDialog
        filename={confirmDoc.filename}
        pending={deletingId === confirmDoc.id}
        onCancel={() => {
          if (!deletingId) setConfirmDoc(null);
        }}
        onConfirm={confirmDelete}
      />
    ) : null}
    </>
  );
}
