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
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { updateLeadStatusById } from "@/app/admin/leads/actions";
import { DeleteLeadButton } from "@/components/admin/delete-lead-button";
import {
  isLeadStatus,
  LEAD_STATUSES,
  LEAD_STATUS_CONFIG,
  LEAD_STATUS_I18N_KEYS,
  type LeadStatus,
} from "@/lib/admin/lead-status";
import { formatAdminDateTime } from "@/lib/admin/format-date";
import { cn, adminTableHeadClass } from "@/lib/utils";

export type LeadRow = {
  id: string;
  fullName: string;
  organizationName: string;
  workEmail: string;
  source: "chat_assessment" | "contact_form";
  status: LeadStatus;
  createdAt: string;
};

function SortIcon({ direction }: { direction: false | "asc" | "desc" }) {
  if (direction === "asc") return <ArrowUp size={14} className="text-blue" />;
  if (direction === "desc") return <ArrowDown size={14} className="text-blue" />;
  return <ArrowUpDown size={14} className="text-muted-foreground/70" />;
}

function StatusSelect({
  leadId,
  status,
  onUpdated,
}: {
  leadId: string;
  status: LeadStatus;
  onUpdated: (status: LeadStatus) => void;
}) {
  const t = useTranslations("admin");
  const [pending, startTransition] = useTransition();
  const config = LEAD_STATUS_CONFIG[status];

  return (
    <select
      value={status}
      disabled={pending}
      onClick={(event) => event.stopPropagation()}
      onChange={(event) => {
        const next = event.target.value;
        if (!isLeadStatus(next) || next === status) return;
        startTransition(async () => {
          const result = await updateLeadStatusById(leadId, next);
          if (result.ok) onUpdated(next);
        });
      }}
      className={cn(
        "w-full min-w-[9.5rem] rounded-md border px-2.5 py-1.5 text-[12.5px] font-medium outline-none focus:ring-2 focus:ring-blue/20 disabled:opacity-60",
        config.select,
      )}
      aria-label={t("leads.updateStatus")}
    >
      {LEAD_STATUSES.map((item) => (
        <option key={item} value={item}>
          {t(`leads.${LEAD_STATUS_I18N_KEYS[item]}`)}
        </option>
      ))}
    </select>
  );
}

export function LeadsTable({ data }: { data: LeadRow[] }) {
  const t = useTranslations("admin");
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([{ id: "createdAt", desc: true }]);
  const [rows, setRows] = useState(data);

  useEffect(() => {
    setRows(data);
  }, [data]);

  const columns = useMemo<ColumnDef<LeadRow>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: t("leads.name"),
        cell: ({ row }) => (
          <span className="font-medium text-graphite group-hover:text-blue">{row.original.fullName}</span>
        ),
      },
      {
        accessorKey: "organizationName",
        header: t("leads.organization"),
        cell: ({ getValue }) => <span className="text-graphite/90">{String(getValue())}</span>,
      },
      {
        accessorKey: "workEmail",
        header: ({ column }) => (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 font-medium hover:text-blue"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("leads.email")}
            <SortIcon direction={column.getIsSorted()} />
          </button>
        ),
        cell: ({ getValue }) => <span className="text-graphite/85">{String(getValue())}</span>,
        sortingFn: "alphanumeric",
      },
      {
        accessorKey: "source",
        header: t("leads.source"),
        cell: ({ getValue }) => (
          <span className="rounded-full bg-ivory px-2 py-0.5 text-[12px] text-muted-foreground">
            {getValue() === "contact_form" ? t("leads.sourceContact") : t("leads.sourceChat")}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: t("leads.status"),
        enableSorting: false,
        cell: ({ row }) => (
          <StatusSelect
            leadId={row.original.id}
            status={row.original.status}
            onUpdated={(status) => {
              setRows((current) =>
                current.map((item) => (item.id === row.original.id ? { ...item, status } : item)),
              );
            }}
          />
        ),
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 font-medium hover:text-blue"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("leads.created")}
            <SortIcon direction={column.getIsSorted()} />
          </button>
        ),
        cell: ({ getValue }) => (
          <span className="whitespace-nowrap text-muted-foreground">
            {formatAdminDateTime(String(getValue()))}
          </span>
        ),
        sortingFn: (a, b) =>
          new Date(a.original.createdAt).getTime() - new Date(b.original.createdAt).getTime(),
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <DeleteLeadButton
            leadId={row.original.id}
            leadName={row.original.fullName}
            onDeleted={() => {
              setRows((current) => current.filter((item) => item.id !== row.original.id));
            }}
          />
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
        {t("leads.empty")}
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
        <table className="w-full min-w-[920px] text-left text-[13.5px]">
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
                onClick={() => router.push(`/admin/leads/${row.original.id}`)}
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
        <p>
          {t("leads.showing", { from, to, total: rows.length })}
        </p>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2">
            {t("leads.rows")}
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
            aria-label={t("leads.prev")}
          >
            <ChevronLeft size={16} />
          </button>
          <span className="min-w-20 text-center text-graphite">
            {t("leads.page", { current: table.getState().pagination.pageIndex + 1, total: table.getPageCount() })}
          </span>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-hairline bg-white disabled:opacity-40"
            aria-label={t("leads.next")}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
