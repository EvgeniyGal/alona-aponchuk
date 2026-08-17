export const CHART = {
  blue: "#466a86",
  teal: "#4f9da6",
  sage: "#9caf9f",
  gold: "#c8a96a",
  graphite: "#1f2933",
  muted: "#5a6472",
  hairline: "#e6e3d9",
  ivory: "#f8f7f2",
  white: "#ffffff",
} as const;

export const PALETTE = [
  CHART.blue,
  CHART.teal,
  CHART.sage,
  CHART.gold,
  "#6b7c8d",
  "#b08968",
  "#7d9b8a",
];

export const STATUS_COLORS: Record<string, string> = {
  new: CHART.teal,
  contacted: CHART.blue,
  call_scheduled: CHART.gold,
  qualified: CHART.sage,
  closed: CHART.muted,
};

export const SOURCE_COLORS: Record<string, string> = {
  chat_assessment: CHART.blue,
  contact_form: CHART.gold,
};

export const tooltipStyle = {
  background: CHART.white,
  border: `1px solid ${CHART.hairline}`,
  borderRadius: 12,
  boxShadow: "0 10px 30px rgba(31, 41, 51, 0.08)",
  fontSize: 12.5,
  color: CHART.graphite,
};

export const tooltipLabelStyle = {
  color: CHART.muted,
  fontSize: 11.5,
  marginBottom: 4,
};
