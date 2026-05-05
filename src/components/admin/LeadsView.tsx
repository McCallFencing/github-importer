import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLeads, type LeadFilters } from "@/hooks/useLeads";
import LeadsTable from "./LeadsTable";
import LeadsKanban from "./LeadsKanban";
import LeadFiltersBar from "./LeadFilters";
import { formatSource, formatEstimate, LEAD_STATUSES, STATUS_LABELS } from "@/lib/lead-utils";
import LeadDetail from "./LeadDetail";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, LayoutGrid, Table as TableIcon, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";

export default function LeadsView() {
  const [view, setView] = useState<"table" | "kanban">(() => {
    const saved = localStorage.getItem("leads-view-preference");
    return saved === "kanban" ? "kanban" : "table";
  });
  const [filters, setFilters] = useState<LeadFilters>({});
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const { user } = useAuth();
  const { leadsQuery, updateLeadStatus, deleteLead } = useLeads(filters);

  const leads = leadsQuery.data ?? [];

  const exportCSV = () => {
    if (!leads.length) return;
    const headers = ["Name", "Email", "Phone", "Source", "Status", "Fence Type", "Estimate", "Date"];
    const rows = leads.map((l) => [
      l.name, l.email, l.phone, formatSource(l.source), l.status,
      l.fence_name || l.fence_type || "", formatEstimate(l),
      new Date(l.created_at).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleStatusChange = (leadId: string, status: string) => {
    if (!user) return;
    updateLeadStatus.mutate({ leadId, status, userId: user.id });
  };

  const statusCounts = LEAD_STATUSES.reduce(
    (acc, s) => { acc[s] = leads.filter((l) => l.status === s).length; return acc; },
    { total: leads.length } as Record<string, number>,
  );

  const statColors: Record<string, string> = {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-2">
            <ClipboardList className="h-7 w-7 text-primary" />
            Leads
          </h2>
          <p className="text-sm text-muted-foreground mt-1">{statusCounts.total} total leads</p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={view} onValueChange={(v) => { const val = v as "table" | "kanban"; setView(val); localStorage.setItem("leads-view-preference", val); }}>
            <TabsList className="bg-muted/60">
              <TabsTrigger value="table" className="data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <TableIcon className="h-4 w-4 mr-1.5" />Table
              </TabsTrigger>
              <TabsTrigger value="kanban" className="data-[state=active]:bg-card data-[state=active]:shadow-sm">
                <LayoutGrid className="h-4 w-4 mr-1.5" />Board
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" onClick={exportCSV} className="border-border hover:bg-muted/50">
            <Download className="h-4 w-4 mr-1.5" />Export
          </Button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {LEAD_STATUSES.map((s) => (
          <motion.div
            key={s}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl border px-4 py-3 ${statColors[s]}`}
          >
            <p className="text-xs font-medium uppercase tracking-wider opacity-70 whitespace-nowrap">{STATUS_LABELS[s]}</p>
            <p className="text-2xl font-display font-bold mt-0.5">{statusCounts[s] || 0}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <LeadFiltersBar filters={filters} onChange={setFilters} />

      {/* Content */}
      {leadsQuery.isLoading ? (
        <div className="flex justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading leads…</p>
          </div>
        </div>
      ) : view === "table" ? (
        <LeadsTable leads={leads} onSelect={setSelectedLeadId} onStatusChange={handleStatusChange} />
      ) : (
        <LeadsKanban leads={leads} onSelect={setSelectedLeadId} onStatusChange={handleStatusChange} />
      )}

      <LeadDetail
        leadId={selectedLeadId}
        lead={leads.find((l) => l.id === selectedLeadId) ?? null}
        open={!!selectedLeadId}
        onClose={() => setSelectedLeadId(null)}
        onDelete={(id) => { deleteLead.mutate(id); setSelectedLeadId(null); }}
      />
    </div>
  );
}
