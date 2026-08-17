import { formatAdminDateTime } from "@/lib/admin/format-date";
import { cn } from "@/lib/utils";

export type ChatTranscriptLine = {
  role: string;
  content: string;
  createdAt?: string;
};

export function ChatTranscript({
  title,
  lines,
  emptyMessage = "No messages recorded.",
}: {
  title: string;
  lines: ChatTranscriptLine[];
  emptyMessage?: string;
}) {
  const visible = lines.filter((line) => line.role === "user" || line.role === "assistant");

  if (visible.length === 0) {
    return (
      <section className="rounded-xl border border-hairline bg-white p-5">
        <h2 className="font-display text-lg">{title}</h2>
        <p className="mt-3 text-[14px] text-muted-foreground">{emptyMessage}</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-hairline bg-white p-5">
      <h2 className="font-display text-lg">{title}</h2>
      <div className="mt-4 max-h-[32rem] space-y-3 overflow-y-auto pr-1">
        {visible.map((line, index) => {
          const isUser = line.role === "user";
          return (
            <div
              key={`${line.createdAt ?? index}-${index}`}
              className={cn(
                "rounded-xl px-3.5 py-2.5 text-[13.5px] leading-relaxed",
                isUser ? "ml-8 bg-blue text-white" : "mr-8 border border-hairline bg-ivory text-graphite",
              )}
            >
              <div className="mb-1 flex items-center justify-between gap-3 text-[10.5px] uppercase tracking-wide opacity-75">
                <span>{isUser ? "Visitor" : "Assistant"}</span>
                {line.createdAt ? <span>{formatAdminDateTime(line.createdAt)}</span> : null}
              </div>
              <p className="whitespace-pre-wrap">{line.content}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
