export const SOURCE_LABELS: Record<string, string> = {
  estimate_calculator: "Estimator",
  contact_form: "Contact",
};

export const LEAD_STATUSES = [
  "new",
  "1st_attempt",
  "2nd_attempt",
  "3rd_attempt",
  "emailed",
  "scheduled_estimate",
  "unresponsive",
  "quoted",
  "won",
  "lost",
] as const;

export const STATUS_LABELS: Record<string, string> = {
  new: "New",
  "1st_attempt": "1st Attempt Call",
  "2nd_attempt": "2nd Attempt Call",
  "3rd_attempt": "3rd Attempt Call",
  emailed: "Emailed",
  scheduled_estimate: "Scheduled Estimate",
  unresponsive: "Unresponsive",
  quoted: "Quoted",
  won: "Won",
  lost: "Lost",
};

export const STATUS_STYLES: Record<string, string> = {
  new: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
  "1st_attempt": "bg-amber-500/15 text-amber-600 border-amber-500/30",
  "2nd_attempt": "bg-orange-500/15 text-orange-600 border-orange-500/30",
  "3rd_attempt": "bg-rose-400/15 text-rose-500 border-rose-400/30",
  emailed: "bg-sky-500/15 text-sky-600 border-sky-500/30",
  scheduled_estimate: "bg-indigo-500/15 text-indigo-600 border-indigo-500/30",
  unresponsive: "bg-zinc-500/15 text-zinc-500 border-zinc-500/30",
  quoted: "bg-violet-500/15 text-violet-600 border-violet-500/30",
  won: "bg-green-500/15 text-green-600 border-green-500/30",
  lost: "bg-rose-500/15 text-rose-600 border-rose-500/30",
};

export const SOURCE_STYLES: Record<string, string> = {
  estimate_calculator: "bg-steel-blue/10 text-steel-blue border-steel-blue/30",
  contact_form: "bg-gold/10 text-gold-dark border-gold/30",
};

export function formatSource(source: string): string {
  return SOURCE_LABELS[source] || source;
}

export function formatEstimate(lead: {
  estimate_total?: number | null;
  estimate_low?: number | null;
  estimate_high?: number | null;
}): string {
  if (lead.estimate_low && lead.estimate_high) {
    return `$${lead.estimate_low.toLocaleString()} – $${lead.estimate_high.toLocaleString()}`;
  }
  if (lead.estimate_total) {
    return `$${lead.estimate_total.toLocaleString()}`;
  }
  return "—";
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits[0] === "1") {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return phone;
}
