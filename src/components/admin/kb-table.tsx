"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Loader2, Trash2 } from "lucide-react";
import { deleteKbEntryById, updateKbEntryById } from "@/app/admin/knowledge-base/actions";
import { formatAdminDateTime } from "@/lib/admin/format-date";
import { adminTableHeadClass } from "@/lib/utils";

export type KbRow = {
  id: string;
  slug: string;
  intent: string;
  approvedAnswer: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

const inputCls =
  "w-full rounded-md border border-hairline bg-white px-3 py-2 text-[14px] outline-none focus:border-blue focus:ring-2 focus:ring-blue/20";

function SortIcon({ direction }: { direction: false | "asc" | "desc" }) {
  if (direction === "asc") return <ArrowUp size={14} className="text-blue" />;
  if (direction === "desc") return <ArrowDown size={14} className="text-blue" />;
  return <ArrowUpDown size={14} className="text-muted-foreground/70" />;
}

function truncate(value: string, length = 88) {
  const compact = value.replace(/\s+/g, " ").trim();
  if (compact.length <= length) return compact;
  return `${compact.slice(0, length - 1)}…`;
}

export function KnowledgeBaseTable({ data }: { data: KbRow[] }) {
  const t = useTranslations("admin");
  const router = useRouter();
  const [rows, setRows] = useState(data);
  const [sorting, setSorting] = useState<SortingState>([{ id: "slug", desc: false }]);
  const [hovered, setHovered] = useState<{ entry: KbRow; rect: DOMRect } | null>(null);
  const [editing, setEditing] = useState<KbRow | null>(null);
  const [deleting, setDeleting] = useState<KbRow | null>(null);

  useEffect(() => {
    setRows(data);
  }, [data]);

  const columns = useMemo<ColumnDef<KbRow>[]>(
    () => [
      {
        accessorKey: "slug",
        header: ({ column }) => (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 font-medium hover:text-blue"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("kb.slugLabel")}
            <SortIcon direction={column.getIsSorted()} />
          </button>
        ),
        cell: ({ row }) => (
          <span className="font-medium text-graphite group-hover:text-blue">{row.original.slug}</span>
        ),
      },
      {
        accessorKey: "intent",
        header: t("kb.intent"),
        cell: ({ getValue }) => (
          <span className="text-graphite/90">{truncate(String(getValue()), 96)}</span>
        ),
      },
      {
        accessorKey: "active",
        header: t("kb.active"),
        cell: ({ getValue }) =>
          getValue() ? (
            <span className="rounded-full bg-teal-soft px-2 py-0.5 text-[12px] text-teal">{t("kb.active")}</span>
          ) : (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[12px] text-muted-foreground">
              {t("kb.inactive")}
            </span>
          ),
      },
      {
        accessorKey: "updatedAt",
        header: ({ column }) => (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 font-medium hover:text-blue"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("kb.updated")}
            <SortIcon direction={column.getIsSorted()} />
          </button>
        ),
        cell: ({ getValue }) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {formatAdminDateTime(String(getValue()))}
          </span>
        ),
        sortingFn: (a, b) =>
          new Date(a.original.updatedAt).getTime() - new Date(b.original.updatedAt).getTime(),
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <button
            type="button"
            aria-label={`${t("kb.delete")} ${row.original.slug}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-hairline text-muted-foreground hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
            onClick={(event) => {
              event.stopPropagation();
              setHovered(null);
              setDeleting(row.original);
            }}
          >
            <Trash2 size={14} />
          </button>
        ),
      },
    ],
    [t],
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-hairline bg-white px-6 py-12 text-center text-muted-foreground">
        {t("kb.empty")}
      </div>
    );
  }

  const from = table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1;
  const to = Math.min(
    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
    rows.length,
  );

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-hairline bg-white">
        <table className="w-full min-w-[860px] text-left text-[13.5px]">
          <thead className={adminTableHeadClass}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 font-semibold">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="group cursor-pointer border-b border-hairline last:border-0 hover:bg-blue-soft/25"
                onClick={() => {
                  setHovered(null);
                  setEditing(row.original);
                }}
                onMouseEnter={(event) => {
                  if (editing || deleting) return;
                  setHovered({ entry: row.original, rect: event.currentTarget.getBoundingClientRect() });
                }}
                onMouseLeave={() => setHovered(null)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-[13px] text-muted-foreground">
        <p>{t("table.showing", { from, to, total: rows.length })}</p>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2">
            {t("table.rows")}
            <select
              value={table.getState().pagination.pageSize}
              onChange={(event) => table.setPageSize(Number(event.target.value))}
              className="rounded-md border border-hairline bg-white px-2 py-1 text-[13px] text-graphite"
            >
              {[10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-hairline bg-white disabled:opacity-40"
            aria-label={t("table.prev")}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="min-w-20 text-center text-graphite">
            {t("table.page", { current: table.getState().pagination.pageIndex + 1, total: table.getPageCount() })}
          </span>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-hairline bg-white disabled:opacity-40"
            aria-label={t("table.next")}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {hovered && !editing && !deleting ? <KbHoverCard entry={hovered.entry} rect={hovered.rect} /> : null}

      {editing ? (
        <KbEditDialog
          entry={editing}
          onClose={() => setEditing(null)}
          onSaved={(next) => {
            setRows((current) => current.map((item) => (item.id === next.id ? next : item)));
            setEditing(null);
            router.refresh();
          }}
          onDelete={() => {
            setDeleting(editing);
          }}
        />
      ) : null}

      {deleting ? (
        <KbDeleteDialog
          entry={deleting}
          onCancel={() => setDeleting(null)}
          onDeleted={() => {
            const id = deleting.id;
            setRows((current) => current.filter((item) => item.id !== id));
            setDeleting(null);
            if (editing?.id === id) setEditing(null);
            router.refresh();
          }}
        />
      ) : null}
    </div>
  );
}

function KbHoverCard({ entry, rect }: { entry: KbRow; rect: DOMRect }) {
  const t = useTranslations("admin");
  const spaceBelow = window.innerHeight - rect.bottom;
  const left = Math.min(Math.max(16, rect.left + 16), window.innerWidth - 440);
  const position =
    spaceBelow < 260
      ? { bottom: window.innerHeight - rect.top + 8 }
      : { top: rect.bottom + 8 };

  return (
    <div
      className="pointer-events-none fixed z-40 w-[400px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-hairline bg-white p-4 shadow-[0_16px_40px_-20px_rgba(31,41,51,0.45)]"
      style={{ left, ...position, maxHeight: 280 }}
    >
      <p className="font-display text-[15px] text-graphite">{entry.slug}</p>
      <p className="mt-1 text-[12px] text-muted-foreground">
        {entry.active ? t("kb.active") : t("kb.inactive")} · {formatAdminDateTime(entry.updatedAt)}
      </p>
      <p className="mt-3 text-[12px] font-medium uppercase tracking-wide text-muted-foreground">{t("kb.intent")}</p>
      <p className="mt-1 text-[13px] leading-relaxed text-graphite">{entry.intent}</p>
      <p className="mt-3 text-[12px] font-medium uppercase tracking-wide text-muted-foreground">{t("kb.answer")}</p>
      <p className="mt-1 max-h-28 overflow-y-auto text-[13px] leading-relaxed text-graphite/90">{entry.approvedAnswer}</p>
    </div>
  );
}

function KbEditDialog({
  entry,
  onClose,
  onSaved,
  onDelete,
}: {
  entry: KbRow;
  onClose: () => void;
  onSaved: (entry: KbRow) => void;
  onDelete: () => void;
}) {
  const t = useTranslations("admin");
  const common = useTranslations("common");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState(entry.slug);
  const [intent, setIntent] = useState(entry.intent);
  const [approvedAnswer, setApprovedAnswer] = useState(entry.approvedAnswer);
  const [active, setActive] = useState(entry.active);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !pending) onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, pending]);

  function handleSave() {
    startTransition(async () => {
      const result = await updateKbEntryById({
        id: entry.id,
        slug,
        intent,
        approvedAnswer,
        active,
      });
      if (!result.ok) {
        setError(result.error === "slug" ? t("kb.slugTaken") : t("kb.saveError"));
        return;
      }
      onSaved({
        ...entry,
        slug,
        intent,
        approvedAnswer,
        active,
        updatedAt: new Date().toISOString(),
      });
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-graphite/35 px-4"
      onClick={() => {
        if (!pending) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="kb-edit-title"
        className="w-full max-w-xl rounded-xl border border-hairline bg-white p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="kb-edit-title" className="font-display text-xl text-graphite">
          {t("kb.edit")}
        </h2>
        <p className="mt-1 text-[13px] text-muted-foreground">{t("kb.editLead")}</p>
        <div className="mt-4 space-y-3">
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium">{t("kb.slugLabel")}</span>
            <input className={inputCls} value={slug} onChange={(event) => setSlug(event.target.value)} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium">{t("kb.intent")}</span>
            <input className={inputCls} value={intent} onChange={(event) => setIntent(event.target.value)} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13px] font-medium">{t("kb.answer")}</span>
            <textarea
              className={inputCls}
              rows={6}
              value={approvedAnswer}
              onChange={(event) => setApprovedAnswer(event.target.value)}
            />
          </label>
          <label className="flex items-center gap-2 text-[13px]">
            <input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} />
            {t("kb.active")}
          </label>
        </div>
        {error ? <p className="mt-3 text-[13px] text-destructive">{error}</p> : null}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={onDelete}
            className="inline-flex items-center gap-1.5 rounded-md border border-destructive/30 px-3 py-2 text-[13px] font-medium text-destructive hover:bg-destructive/5 disabled:opacity-60"
          >
            <Trash2 size={14} />
            {t("kb.delete")}
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={onClose}
              className="rounded-md border border-hairline px-3 py-2 text-[13px] font-medium text-graphite hover:bg-ivory disabled:opacity-60"
            >
              {common("cancel")}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 rounded-md bg-blue px-3 py-2 text-[13px] font-medium text-white hover:bg-blue/90 disabled:opacity-60"
            >
              {pending ? <Loader2 size={14} className="animate-spin" /> : null}
              {pending ? t("kb.saving") : t("kb.save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function KbDeleteDialog({
  entry,
  onCancel,
  onDeleted,
}: {
  entry: KbRow;
  onCancel: () => void;
  onDeleted: () => void;
}) {
  const t = useTranslations("admin");
  const common = useTranslations("common");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !pending) onCancel();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onCancel, pending]);

  function handleConfirm() {
    startTransition(async () => {
      const result = await deleteKbEntryById(entry.id);
      if (!result.ok) {
        setError(t("kb.deleteError"));
        return;
      }
      onDeleted();
    });
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-graphite/35 px-4"
      onClick={() => {
        if (!pending) onCancel();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="kb-delete-title"
        className="w-full max-w-md rounded-xl border border-hairline bg-white p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="kb-delete-title" className="font-display text-xl text-graphite">
          {t("kb.deleteTitle")}
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
          {t("kb.deleteBody", { slug: entry.slug })}
        </p>
        {error ? <p className="mt-3 text-[13px] text-destructive">{error}</p> : null}
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={onCancel}
            className="rounded-md border border-hairline px-3 py-2 text-[13px] font-medium text-graphite hover:bg-ivory disabled:opacity-60"
          >
            {common("cancel")}
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={handleConfirm}
            className="inline-flex items-center gap-1.5 rounded-md bg-destructive px-3 py-2 text-[13px] font-medium text-white hover:bg-destructive/90 disabled:opacity-60"
          >
            {pending ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            {pending ? t("kb.deleting") : t("kb.delete")}
          </button>
        </div>
      </div>
    </div>
  );
}
