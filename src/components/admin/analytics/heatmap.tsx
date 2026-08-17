"use client";

import { CHART } from "@/components/admin/analytics/colors";
import { ChartEmpty } from "@/components/admin/analytics/chart-card";
import type { HeatmapCell } from "@/lib/admin/analytics";
import { cn } from "@/lib/utils";

export function ActivityHeatmap({
  data,
  empty,
  days,
}: {
  data: HeatmapCell[];
  empty: string;
  days: string[];
}) {
  const max = Math.max(...data.map((cell) => cell.count), 0);
  if (max === 0) return <ChartEmpty message={empty} />;

  const hours = Array.from({ length: 24 }, (_, hour) => hour);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[640px]">
        <div className="mb-1 grid grid-cols-[3.25rem_repeat(24,minmax(0,1fr))] gap-1 text-[10px] text-muted-foreground">
          <span />
          {hours.map((hour) => (
            <span key={hour} className="text-center">
              {hour % 3 === 0 ? hour : ""}
            </span>
          ))}
        </div>
        <div className="space-y-1">
          {days.map((day, dow) => (
            <div key={day} className="grid grid-cols-[3.25rem_repeat(24,minmax(0,1fr))] gap-1">
              <span className="self-center text-[11.5px] text-muted-foreground">{day}</span>
              {hours.map((hour) => {
                const cell = data.find((item) => item.dow === dow && item.hour === hour);
                const count = cell?.count ?? 0;
                const intensity = count === 0 ? 0 : 0.12 + (count / max) * 0.88;
                return (
                  <div
                    key={`${dow}-${hour}`}
                    title={`${day} ${hour}:00 · ${count}`}
                    className={cn("h-5 rounded-[3px]", count === 0 && "bg-ivory")}
                    style={count === 0 ? undefined : { backgroundColor: hexWithAlpha(CHART.teal, intensity) }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function hexWithAlpha(hex: string, alpha: number) {
  const value = Math.round(Math.min(1, Math.max(0, alpha)) * 255)
    .toString(16)
    .padStart(2, "0");
  return `${hex}${value}`;
}
