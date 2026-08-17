import { cn } from "@/lib/utils";

export function ChartCard({
  title,
  description,
  children,
  className,
  footer,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
}) {
  return (
    <section className={cn("min-w-0 rounded-xl border border-hairline bg-white p-5", className)}>
      <div className="mb-4">
        <h2 className="font-display text-lg text-graphite">{title}</h2>
        {description ? <p className="mt-1 text-[13px] text-muted-foreground">{description}</p> : null}
      </div>
      {children}
      {footer ? <div className="mt-4 border-t border-hairline pt-3">{footer}</div> : null}
    </section>
  );
}

export function ChartEmpty({ message }: { message: string }) {
  return (
    <div className="flex h-[240px] items-center justify-center rounded-lg bg-ivory/70 text-[13px] text-muted-foreground">
      {message}
    </div>
  );
}
