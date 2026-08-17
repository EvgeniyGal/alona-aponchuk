import Link from "next/link";
import { ANALYTICS_RANGES, type AnalyticsRange } from "@/lib/admin/analytics";
import { cn } from "@/lib/utils";

export function PeriodFilter({
  range,
  labels,
}: {
  range: AnalyticsRange;
  labels: Record<AnalyticsRange, string>;
}) {
  return (
    <div className="flex flex-wrap gap-2 text-[13px]">
      {ANALYTICS_RANGES.map((item) => (
        <Link
          key={item}
          href={item === "30d" ? "/admin" : `/admin?range=${item}`}
          className={cn(
            "rounded-full border px-3 py-1 hover:border-blue",
            range === item ? "border-blue bg-blue-soft/50 text-blue" : "border-hairline",
          )}
        >
          {labels[item]}
        </Link>
      ))}
    </div>
  );
}
