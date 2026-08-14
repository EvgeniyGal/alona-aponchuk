import { UserPlus, ClipboardList, Stethoscope, CalendarDays, HeartHandshake, MessageSquare, Repeat } from "lucide-react";

const steps = [
  { icon: UserPlus, label: "First Contact", meta: "Inquiry received" },
  { icon: ClipboardList, label: "Intake", meta: "Verified form" },
  { icon: Stethoscope, label: "Consultation", meta: "Prepared visit" },
  { icon: CalendarDays, label: "Scheduling", meta: "Confirmed slot" },
  { icon: HeartHandshake, label: "Service", meta: "Delivered care" },
  { icon: MessageSquare, label: "Follow-up", meta: "Structured touchpoint" },
  { icon: Repeat, label: "Repeat Visit", meta: "Continuity" },
];

export function JourneyDiagram() {
  return (
    <div className="relative z-10 rounded-2xl border border-hairline bg-white p-6 shadow-[0_1px_0_rgba(31,41,51,0.03),0_20px_40px_-24px_rgba(31,41,51,0.15)]">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="eyebrow">Client Journey</div>
          <div className="mt-1 font-display text-[15px] font-semibold text-graphite">Connected operational system</div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="status-ping inline-block h-2 w-2 rounded-full bg-sage text-sage" /> On track
          <span className="ml-3 inline-block h-2 w-2 rounded-full bg-gold" /> Needs review
        </div>
      </div>

      <ol className="journey-live space-y-2.5">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const status = i === 3 ? "gold" : "sage";
          return (
            <li
              key={s.label}
              className="flex items-center gap-3 rounded-lg border border-hairline bg-ivory/60 px-3.5 py-3 transition-colors hover:bg-white"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white border border-hairline text-blue">
                <Icon size={17} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-medium text-graphite">{s.label}</div>
                <div className="text-[11.5px] text-muted-foreground">{s.meta}</div>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-medium ${
                  status === "gold"
                    ? "bg-[#f6ecd7] text-[#8a6a2b]"
                    : "bg-[#e5ede5] text-[#3b5a3f]"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${status === "gold" ? "bg-gold" : "bg-sage"}`} />
                Step {i + 1}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="mt-5 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-md bg-teal-soft py-2 text-[11px] font-medium text-graphite">CRM</div>
        <div className="rounded-md bg-blue-soft py-2 text-[11px] font-medium text-graphite">Scheduling</div>
        <div className="rounded-md bg-[#e5ede5] py-2 text-[11px] font-medium text-graphite">Messaging</div>
      </div>
    </div>
  );
}
