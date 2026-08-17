"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
import Link from "next/link";
import { formatAdminDateTime } from "@/lib/admin/format-date";
import { formatChatMode, truncateId } from "@/lib/admin/chat-session";
import type { ChatSession } from "@/lib/db/schema";

export type SessionRow = {
  id: string;
  visitorId: string | null;
  mode: ChatSession["mode"];
  messageCount: number;
  leadId: string | null;
  leadName: string | null;
  leadEmail: string | null;
  createdAt: string;
  updatedAt: string;
};

function SortIcon({ direction }: { direction: false | "asc" | "desc" }) {
  if (direction === "asc") return <ArrowUp size={14} className="text-blue" />;
  if (direction === "desc") return <ArrowDown size={14} className="text-blue" />;
  return <ArrowUpDown size={14} className="text-muted-foreground/70" />;
}

export function SessionsTable({ data }: { data: SessionRow[] }) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([{ id: "updatedAt", desc: true }]);
  const [rows, setRows] = useState(data);

  useEffect(() => {
    setRows(data);
  }, [data]);

  const columns = useMemo<ColumnDef<SessionRow>[]>(
    () => [
      {
        accessorKey: "updatedAt",
        header: ({ column }) => (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 font-medium hover:text-blue"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Last activity
            <SortIcon direction={column.getIsSorted()} />
          </button>
        ),
        cell: ({ getValue }) => (
          <span className="whitespace-nowrap text-graphite/90">{formatAdminDateTime(String(getValue()))}</span>
        ),
        sortingFn: (a, b) =>
          new Date(a.original.updatedAt).getTime() - new Date(b.original.updatedAt).getTime(),
      },
      {
        accessorKey: "mode",
        header: "Mode",
        cell: ({ getValue }) => (
          <span className="rounded-full bg-ivory px-2 py-0.5 text-[12px] text-muted-foreground">
            {formatChatMode(getValue() as SessionRow["mode"])}
          </span>
        ),
      },
      {
        accessorKey: "messageCount",
        header: ({ column }) => (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 font-medium hover:text-blue"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Messages
            <SortIcon direction={column.getIsSorted()} />
          </button>
        ),
        cell: ({ getValue }) => <span className="text-graphite/85">{String(getValue())}</span>,
      },
      {
        accessorKey: "visitorId",
        header: "Visitor",
        enableSorting: false,
        cell: ({ getValue }) => (
          <span className="font-mono text-[12px] text-muted-foreground">{truncateId(String(getValue() ?? ""))}</span>
        ),
      },
      {
        id: "lead",
        header: "Lead",
        enableSorting: false,
        cell: ({ row }) => {
          if (!row.original.leadId) {
            return <span className="text-muted-foreground">—</span>;
          }
          return (
            <Link
              href={`/admin/leads/${row.original.leadId}`}
              onClick={(event) => event.stopPropagation()}
              className="text-blue hover:underline"
            >
              {row.original.leadName || row.original.leadEmail || truncateId(row.original.leadId)}
            </Link>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 font-medium hover:text-blue"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Started
            <SortIcon direction={column.getIsSorted()} />
          </button>
        ),
        cell: ({ getValue }) => (
          <span className="whitespace-nowrap text-muted-foreground">{formatAdminDateTime(String(getValue()))}</span>
        ),
        sortingFn: (a, b) =>
          new Date(a.original.createdAt).getTime() - new Date(b.original.createdAt).getTime(),
      },
    ],
    [],
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
        No sessions match the current filters.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-hairline bg-white">
        <table className="w-full min-w-[860px] text-left text-[13.5px]">
          <thead className="border-b border-hairline bg-ivory/80 text-[12px] uppercase tracking-wide text-muted-foreground">
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
                onClick={() => router.push(`/admin/sessions/${row.original.id}`)}
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
          Showing{" "}
          <span className="font-medium text-graphite">
            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
          </span>
          {" – "}
          <span className="font-medium text-graphite">
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              rows.length,
            )}
          </span>{" "}
          of <span className="font-medium text-graphite">{rows.length}</span>
        </p>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2">
            Rows
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
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="min-w-20 text-center text-graphite">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-hairline bg-white disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
