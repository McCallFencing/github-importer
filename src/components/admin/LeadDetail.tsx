import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLeadDetail } from "@/hooks/useLeads";
import { useAuth } from "@/hooks/useAuth";
import { useTeam } from "@/hooks/useTeam";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import LeadNotes from "./LeadNotes";
import LeadActivity from "./LeadActivity";
import ReminderForm from "./ReminderForm";
import type { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";
import { formatSource, formatEstimate, formatPhone, LEAD_STATUSES, STATUS_LABELS } from "@/lib/lead-utils";
import { Mail, Phone, MapPin, Calendar, Fence, DollarSign, MessageSquare, Trash2 } from "lucide-react";

interface Props {
  leadId: string | null;
  lead: Tables<"leads"> | null;
  open: boolean;
  onClose: () => void;
  onDelete: (leadId: string) => void;
}

export default function LeadDetail({ leadId, lead, open, onClose, onDelete }: Props) {
  const { user, isAdmin } = useAuth();
  const { membersQuery } = useTeam();
  const { notesQuery, activityQuery, assignmentQuery, remindersQuery } = useLeadDetail(leadId);
  const queryClient = useQueryClient();
  const members = membersQuery.data ?? [];

  if (!lead || !leadId) return null;

  const handleStatusChange = async (status: string) => {
    if (!user) return;
    const old = lead.status;
    await supabase.from("leads").update({ status }).eq("id", leadId);
    await supabase.from("lead_activity_log").insert({
      lead_id: leadId, user_id: user.id, action: "status_changed",
      old_value: old, new_value: status,
    });
    queryClient.invalidateQueries({ queryKey: ["leads"] });
    queryClient.invalidateQueries({ queryKey: ["lead_activity", leadId] });
    queryClient.invalidateQueries({ queryKey: ["kanban_assignments"] });
  };

  const handleAssign = async (assignedTo: string) => {
    if (!user) return;
    // Remove existing assignments first
    await supabase.from("lead_assignments").delete().eq("lead_id", leadId);
    if (assignedTo !== "unassigned") {
      await supabase.from("lead_assignments").insert({
        lead_id: leadId, assigned_to: assignedTo, assigned_by: user.id,
      });
      await supabase.from("lead_activity_log").insert({
        lead_id: leadId, user_id: user.id, action: "assigned",
        new_value: members.find((m) => m.id === assignedTo)?.full_name || assignedTo,
      });
    }
    queryClient.invalidateQueries({ queryKey: ["lead_assignment", leadId] });
    queryClient.invalidateQueries({ queryKey: ["all_lead_assignments"] });
    queryClient.invalidateQueries({ queryKey: ["kanban_assignments"] });
    queryClient.invalidateQueries({ queryKey: ["lead_activity", leadId] });
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-0 [&>button]:text-cream [&>button]:hover:text-white [&>button]:opacity-100">
        {/* Header */}
        <div className="bg-charcoal p-6 pb-5">
          <SheetHeader>
            <SheetTitle className="font-display text-xl text-cream">{lead.name}</SheetTitle>
          </SheetHeader>
          <div className="flex items-center gap-2 mt-3">
            <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-bold border border-white/20 bg-white/10 text-white">
              {STATUS_LABELS[lead.status] || lead.status}
            </span>
            <Badge variant="outline" className="text-xs font-medium border-white/20 bg-white/10 text-white/90">
              {formatSource(lead.source)}
            </Badge>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Contact Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact</h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                <a href={`mailto:${lead.email}`} className="text-foreground hover:text-primary transition-colors">{lead.email}</a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                <a href={`tel:${lead.phone}`} className="text-foreground hover:text-primary transition-colors">{formatPhone(lead.phone)}</a>
              </div>
              {lead.address && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground">{lead.address}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground">{format(new Date(lead.created_at), "MMM d, yyyy 'at' h:mm a")}</span>
              </div>
            </div>
          </div>

          {/* Status & Assignment */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Status</label>
              <Select value={lead.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LEAD_STATUSES.map((s) => <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">Assigned To</label>
              <Select value={assignmentQuery.data?.assigned_to ?? "unassigned"} onValueChange={handleAssign}>
                <SelectTrigger className="h-9"><SelectValue placeholder="Unassigned" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {members.map((m) => <SelectItem key={m.id} value={m.id}>{m.full_name || m.email}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Estimate Details */}
          {lead.fence_type && (
            <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Fence className="h-3.5 w-3.5" /> Estimate Details
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {lead.fence_name && <div><span className="text-muted-foreground">Fence:</span> <span className="font-medium">{lead.fence_name}</span></div>}
                {lead.fence_height && <div><span className="text-muted-foreground">Height:</span> <span className="font-medium">{lead.fence_height} ft</span></div>}
                {lead.linear_feet && <div><span className="text-muted-foreground">Linear Feet:</span> <span className="font-medium">{lead.linear_feet}</span></div>}
                {lead.single_gates != null && lead.single_gates > 0 && <div><span className="text-muted-foreground">Single Gates:</span> <span className="font-medium">{lead.single_gates}</span></div>}
                {lead.double_gates != null && lead.double_gates > 0 && <div><span className="text-muted-foreground">Double Gates:</span> <span className="font-medium">{lead.double_gates}</span></div>}
                {lead.material_cost != null && lead.material_cost > 0 && <div><span className="text-muted-foreground">Material:</span> <span className="font-medium">${lead.material_cost.toLocaleString()}</span></div>}
                {lead.gate_costs != null && lead.gate_costs > 0 && <div><span className="text-muted-foreground">Gate Cost:</span> <span className="font-medium">${lead.gate_costs.toLocaleString()}</span></div>}
              </div>
              <div className="pt-2 border-t border-border flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="font-display font-bold text-foreground">{formatEstimate(lead)}</span>
              </div>
            </div>
          )}

          {/* Message */}
          {lead.message && (
            <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5" /> Message
              </h4>
              <p className="text-sm text-foreground leading-relaxed">{lead.message}</p>
            </div>
          )}

          {/* Sections with dividers */}
          <div className="border-t border-border pt-6">
            <ReminderForm leadId={leadId} reminders={remindersQuery.data ?? []} />
          </div>

          <div className="border-t border-border pt-6">
            <LeadNotes leadId={leadId} notes={notesQuery.data ?? []} />
          </div>

          {isAdmin && (
            <div className="border-t border-border pt-6">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="h-4 w-4 mr-1.5" />Delete Lead
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this lead?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete <strong>{lead.name}</strong> and all associated notes, activity, assignments, and reminders. This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => { onDelete(leadId); onClose(); }}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
