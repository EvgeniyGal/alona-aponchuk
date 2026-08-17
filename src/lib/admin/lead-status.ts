export const LEAD_STATUSES = ["new", "contacted", "call_scheduled", "qualified", "closed"] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_I18N_KEYS = {
  new: "statusNew",
  contacted: "statusContacted",
  call_scheduled: "statusCallScheduled",
  qualified: "statusQualified",
  closed: "statusClosed",
} as const;

export const LEAD_STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; badge: string; dot: string; select: string }
> = {
  new: {
    label: "New",
    badge: "bg-teal-soft text-teal border-teal/30",
    dot: "bg-teal",
    select: "border-teal/40 bg-teal-soft/50 text-teal",
  },
  contacted: {
    label: "Contacted",
    badge: "bg-blue-soft text-blue border-blue/30",
    dot: "bg-blue",
    select: "border-blue/40 bg-blue-soft/60 text-blue",
  },
  call_scheduled: {
    label: "Call Scheduled",
    badge: "bg-[#f3ead4] text-[#9a7b2f] border-[#e5d4a8]",
    dot: "bg-gold",
    select: "border-gold/40 bg-[#f3ead4]/80 text-[#8a6d28]",
  },
  qualified: {
    label: "Qualified",
    badge: "bg-sage-soft text-graphite border-sage/40",
    dot: "bg-sage",
    select: "border-sage/50 bg-sage-soft/70 text-graphite",
  },
  closed: {
    label: "Closed",
    badge: "bg-muted text-muted-foreground border-hairline",
    dot: "bg-muted-foreground/50",
    select: "border-hairline bg-muted text-muted-foreground",
  },
};

export function isLeadStatus(value: string): value is LeadStatus {
  return LEAD_STATUSES.includes(value as LeadStatus);
}

export function formatLeadStatus(status: LeadStatus) {
  return LEAD_STATUS_CONFIG[status].label;
}

export function formatLeadSource(source: "chat_assessment" | "contact_form") {
  return source === "contact_form" ? "Contact form" : "Chat assessment";
}
