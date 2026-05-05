import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { LeadFilters } from "@/hooks/useLeads";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTeam } from "@/hooks/useTeam";
import { useState } from "react";

import { LEAD_STATUSES, STATUS_LABELS } from "@/lib/lead-utils";
const SOURCES = [
  { value: "estimate_calculator", label: "Estimator" },
  { value: "contact_form", label: "Contact Form" },
];

interface Props {
  filters: LeadFilters;
  onChange: (f: LeadFilters) => void;
}

export default function LeadFiltersBar({ filters, onChange }: Props) {
  const { membersQuery } = useTeam();
  const members = membersQuery.data ?? [];
  const [expanded, setExpanded] = useState(false);

  const update = (key: keyof LeadFilters, value: string) => {
    onChange({ ...filters, [key]: value === "all" ? undefined : value || undefined });
  };

  const hasFilters = Object.values(filters).some(Boolean);
  const filterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or phone…"
            value={filters.search ?? ""}
            onChange={(e) => update("search", e.target.value)}
            className="pl-10 h-10 bg-card border-border"
          />
        </div>
        <Button
          variant={expanded ? "secondary" : "outline"}
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="h-10 px-3 border-border"
        >
          <SlidersHorizontal className="h-4 w-4 mr-1.5" />
          Filters
          {filterCount > 0 && (
            <span className="ml-1.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {filterCount}
            </span>
          )}
        </Button>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={() => onChange({})} className="h-10 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4 mr-1" />Clear
          </Button>
        )}
      </div>

      {expanded && (
        <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-card border border-border">
          <Select value={filters.status ?? "all"} onValueChange={(v) => update("status", v)}>
            <SelectTrigger className="w-[140px] h-9 bg-background"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {LEAD_STATUSES.map((s) => <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.source ?? "all"} onValueChange={(v) => update("source", v)}>
            <SelectTrigger className="w-[150px] h-9 bg-background"><SelectValue placeholder="Source" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {SOURCES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.assignedTo ?? "all"} onValueChange={(v) => update("assignedTo", v)}>
            <SelectTrigger className="w-[160px] h-9 bg-background"><SelectValue placeholder="Assigned To" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reps</SelectItem>
              {members.map((m) => <SelectItem key={m.id} value={m.id}>{m.full_name || m.email}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={filters.dateFrom ?? ""}
              onChange={(e) => update("dateFrom", e.target.value)}
              className="flex h-9 w-[140px] rounded-md border border-input bg-background px-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 items-center"
            />
            <span className="text-xs text-muted-foreground leading-none">to</span>
            <input
              type="date"
              value={filters.dateTo ?? ""}
              onChange={(e) => update("dateTo", e.target.value)}
              className="flex h-9 w-[140px] rounded-md border border-input bg-background px-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 items-center"
            />
          </div>
        </div>
      )}
    </div>
  );
}
