import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";
import { formatSource, formatEstimate, formatPhone, STATUS_STYLES, SOURCE_STYLES, STATUS_LABELS } from "@/lib/lead-utils";
import { ChevronRight, ArrowUp, ArrowDown, ArrowUpDown, ClipboardList, UserPlus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

type Lead = Tables<"leads">;
type SortKey = "name" | "email" | "source" | "status" | "assignee" | "estimate" | "date";
type SortDir = "asc" | "desc";

interface Props {
  leads: Lead[];
  onSelect: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />;
  return dir === "asc"
    ? <ArrowUp className="h-3.5 w-3.5 text-primary" />
    : <ArrowDown className="h-3.5 w-3.5 text-primary" />;
}

function getEstimateValue(lead: Lead): number {
  return lead.estimate_total || lead.estimate_low || 0;
}

export default function LeadsTable({ leads, onSelect }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all assignments with profile info
  const assignmentsQuery = useQuery({
    queryKey: ["all_lead_assignments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lead_assignments")
        .select("lead_id, assigned_to, profiles:assigned_to(full_name, email)")
        .order("assigned_at", { ascending: false });
      if (error) throw error;
      // Keep only the latest assignment per lead
      const map = new Map<string, typeof data[0]>();
      for (const a of data) {
        if (!map.has(a.lead_id)) map.set(a.lead_id, a);
      }
      return map;
    },
  });

  // Fetch team members for the dropdown
  const teamQuery = useQuery({
    queryKey: ["team_members"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("id, full_name, email").order("full_name");
      if (error) throw error;
      return data;
    },
  });

  const assignMutation = useMutation({
    mutationFn: async ({ leadId, assignedTo }: { leadId: string; assignedTo: string | null }) => {
      // Remove existing assignments for this lead
      await supabase.from("lead_assignments").delete().eq("lead_id", leadId);
      if (assignedTo && user) {
        const { error } = await supabase.from("lead_assignments").insert({
          lead_id: leadId,
          assigned_to: assignedTo,
          assigned_by: user.id,
        });
        if (error) throw error;

        // Log activity
        const member = teamQuery.data?.find((m) => m.id === assignedTo);
        await supabase.from("lead_activity_log").insert({
          lead_id: leadId,
          user_id: user.id,
          action: "assigned",
          new_value: member?.full_name || member?.email || assignedTo,
        });

        // Send email notification to assignee (fire and forget)
        const assignerProfile = teamQuery.data?.find((m) => m.id === user.id);
        const assignedByName = assignerProfile?.full_name || assignerProfile?.email || "Someone";
        supabase.functions.invoke("send-assignment-email", {
          body: { assigneeId: assignedTo, leadId, assignedByName },
        }).catch((err) => console.error("Assignment email failed:", err));
      }
    },
    onMutate: async ({ leadId, assignedTo }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["all_lead_assignments"] });

      // Snapshot previous value
      const previous = queryClient.getQueryData<Map<string, any>>(["all_lead_assignments"]);

      // Optimistically update the cache
      queryClient.setQueryData<Map<string, any>>(["all_lead_assignments"], (old) => {
        const next = new Map(old ?? []);
        if (assignedTo) {
          const member = teamQuery.data?.find((m) => m.id === assignedTo);
          next.set(leadId, {
            lead_id: leadId,
            assigned_to: assignedTo,
            profiles: { full_name: member?.full_name || null, email: member?.email || "" },
          });
        } else {
          next.delete(leadId);
        }
        return next;
      });

      return { previous };
    },
    onError: (_err, _vars, context) => {
      // Roll back on error
      if (context?.previous) {
        queryClient.setQueryData(["all_lead_assignments"], context.previous);
      }
      toast({ title: "Failed to update assignee", variant: "destructive" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["all_lead_assignments"] });
      queryClient.invalidateQueries({ queryKey: ["lead_assignment"] });
      queryClient.invalidateQueries({ queryKey: ["lead_activity"] });
      toast({ title: "Assignee updated" });
    },
  });

  const assignments = assignmentsQuery.data ?? new Map();
  const team = teamQuery.data ?? [];

  const getAssigneeName = (leadId: string): string => {
    const a = assignments.get(leadId);
    if (!a) return "";
    const p = a.profiles as unknown as { full_name: string | null; email: string } | null;
    return p?.full_name || p?.email || "";
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = useMemo(() => {
    const copy = [...leads];
    const dir = sortDir === "asc" ? 1 : -1;
    copy.sort((a, b) => {
      switch (sortKey) {
        case "name": return dir * a.name.localeCompare(b.name);
        case "email": return dir * a.email.localeCompare(b.email);
        case "source": return dir * a.source.localeCompare(b.source);
        case "status": return dir * a.status.localeCompare(b.status);
        case "assignee": return dir * getAssigneeName(a.id).localeCompare(getAssigneeName(b.id));
        case "estimate": return dir * (getEstimateValue(a) - getEstimateValue(b));
        case "date": return dir * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        default: return 0;
      }
    });
    return copy;
  }, [leads, sortKey, sortDir, assignments]);

  const thClass = "font-semibold text-foreground cursor-pointer select-none hover:text-primary transition-colors";

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className={thClass} onClick={() => handleSort("name")}>
              <span className="inline-flex items-center gap-1">Name <SortIcon active={sortKey === "name"} dir={sortDir} /></span>
            </TableHead>
            <TableHead className={`hidden md:table-cell ${thClass}`} onClick={() => handleSort("email")}>
              <span className="inline-flex items-center gap-1">Contact <SortIcon active={sortKey === "email"} dir={sortDir} /></span>
            </TableHead>
            <TableHead className={thClass} onClick={() => handleSort("source")}>
              <span className="inline-flex items-center gap-1">Source <SortIcon active={sortKey === "source"} dir={sortDir} /></span>
            </TableHead>
            <TableHead className={thClass} onClick={() => handleSort("status")}>
              <span className="inline-flex items-center gap-1">Status <SortIcon active={sortKey === "status"} dir={sortDir} /></span>
            </TableHead>
            <TableHead className={`hidden lg:table-cell ${thClass}`} onClick={() => handleSort("assignee")}>
              <span className="inline-flex items-center gap-1">Assignee <SortIcon active={sortKey === "assignee"} dir={sortDir} /></span>
            </TableHead>
            <TableHead className={`hidden lg:table-cell ${thClass}`} onClick={() => handleSort("estimate")}>
              <span className="inline-flex items-center gap-1">Estimate <SortIcon active={sortKey === "estimate"} dir={sortDir} /></span>
            </TableHead>
            <TableHead className={`hidden md:table-cell ${thClass}`} onClick={() => handleSort("date")}>
              <span className="inline-flex items-center gap-1">Date <SortIcon active={sortKey === "date"} dir={sortDir} /></span>
            </TableHead>
            <TableHead className="w-8" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((lead) => {
            const assigneeName = getAssigneeName(lead.id);
            const currentAssignment = assignments.get(lead.id);
            const currentAssignedTo = currentAssignment?.assigned_to as string | undefined;
            return (
              <TableRow
                key={lead.id}
                className="cursor-pointer hover:bg-primary/5 transition-colors group"
                onClick={() => onSelect(lead.id)}
              >
                <TableCell>
                  <div>
                    <p className="font-semibold text-foreground">{lead.name}</p>
                    <p className="text-xs text-muted-foreground md:hidden">{lead.email}</p>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="space-y-0.5">
                    <p className="text-sm text-muted-foreground">{lead.email}</p>
                    <p className="text-xs text-muted-foreground">{formatPhone(lead.phone)}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-xs font-medium ${SOURCE_STYLES[lead.source] || "border-border"}`}>
                    {formatSource(lead.source)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-semibold border ${STATUS_STYLES[lead.status] || ""}`}>
                    {STATUS_LABELS[lead.status] || lead.status}
                  </span>
                </TableCell>
                <TableCell className="hidden lg:table-cell" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                        {assigneeName ? (
                          <span className="font-medium text-foreground">{assigneeName}</span>
                        ) : (
                          <>
                            <UserPlus className="h-3.5 w-3.5" />
                            <span className="text-xs">Assign</span>
                          </>
                        )}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-[180px]">
                      {team.map((member) => (
                        <DropdownMenuItem
                          key={member.id}
                          onClick={() => assignMutation.mutate({ leadId: lead.id, assignedTo: member.id })}
                          className={member.id === currentAssignedTo ? "bg-primary/10 font-medium" : ""}
                        >
                          {member.full_name || member.email}
                        </DropdownMenuItem>
                      ))}
                      {currentAssignedTo && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => assignMutation.mutate({ leadId: lead.id, assignedTo: null })}
                            className="text-destructive"
                          >
                            Unassign
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <span className="text-sm font-medium text-foreground">
                    {formatEstimate(lead)}
                  </span>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(lead.created_at), "MM/dd/yy")}
                  </span>
                </TableCell>
                <TableCell>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </TableCell>
              </TableRow>
            );
          })}
          {leads.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-16">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <ClipboardList className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground font-medium">No leads found</p>
                  <p className="text-xs text-muted-foreground">Try adjusting your filters</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
