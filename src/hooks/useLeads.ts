import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface LeadFilters {
  search?: string;
  status?: string;
  source?: string;
  fenceType?: string;
  assignedTo?: string;
  dateFrom?: string;
  dateTo?: string;
}

export function useLeads(filters: LeadFilters = {}) {
  const queryClient = useQueryClient();

  const leadsQuery = useQuery({
    queryKey: ["leads", filters],
    queryFn: async () => {
      let query = supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (filters.status) query = query.eq("status", filters.status);
      if (filters.source) query = query.eq("source", filters.source);
      if (filters.fenceType) query = query.eq("fence_type", filters.fenceType);
      if (filters.dateFrom) query = query.gte("created_at", filters.dateFrom);
      if (filters.dateTo) query = query.lte("created_at", filters.dateTo);
      if (filters.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`
        );
      }

      const { data, error } = await query;
      if (error) throw error;

      // Filter by assignedTo client-side since assignments are in a separate table
      if (filters.assignedTo) {
        const { data: assignments, error: assignErr } = await supabase
          .from("lead_assignments")
          .select("lead_id")
          .eq("assigned_to", filters.assignedTo);
        if (assignErr) throw assignErr;
        const assignedLeadIds = new Set(assignments?.map((a) => a.lead_id));
        return data?.filter((l) => assignedLeadIds.has(l.id)) ?? [];
      }

      return data;
    },
  });

  const updateLeadStatus = useMutation({
    mutationFn: async ({ leadId, status, userId }: { leadId: string; status: string; userId: string }) => {
      // Get current status
      const { data: lead } = await supabase.from("leads").select("status").eq("id", leadId).single();
      const oldStatus = lead?.status;

      const { error } = await supabase.from("leads").update({ status }).eq("id", leadId);
      if (error) throw error;

      // Log activity
      await supabase.from("lead_activity_log").insert({
        lead_id: leadId,
        user_id: userId,
        action: "status_changed",
        old_value: oldStatus,
        new_value: status,
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leads"] }),
  });

  const deleteLead = useMutation({
    mutationFn: async (leadId: string) => {
      // Delete related records first
      await supabase.from("lead_notes").delete().eq("lead_id", leadId);
      await supabase.from("lead_activity_log").delete().eq("lead_id", leadId);
      await supabase.from("lead_assignments").delete().eq("lead_id", leadId);
      await supabase.from("follow_up_reminders").delete().eq("lead_id", leadId);
      const { error } = await supabase.from("leads").delete().eq("id", leadId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leads"] }),
  });

  return { leadsQuery, updateLeadStatus, deleteLead };
}

export function useLeadDetail(leadId: string | null) {
  const notesQuery = useQuery({
    queryKey: ["lead_notes", leadId],
    queryFn: async () => {
      if (!leadId) return [];
      const { data, error } = await supabase
        .from("lead_notes")
        .select("*, profiles:user_id(full_name, email)")
        .eq("lead_id", leadId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!leadId,
  });

  const activityQuery = useQuery({
    queryKey: ["lead_activity", leadId],
    queryFn: async () => {
      if (!leadId) return [];
      const { data, error } = await supabase
        .from("lead_activity_log")
        .select("*, profiles:user_id(full_name, email)")
        .eq("lead_id", leadId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!leadId,
  });

  const assignmentQuery = useQuery({
    queryKey: ["lead_assignment", leadId],
    queryFn: async () => {
      if (!leadId) return null;
      const { data, error } = await supabase
        .from("lead_assignments")
        .select("*, profiles:assigned_to(full_name, email)")
        .eq("lead_id", leadId)
        .order("assigned_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!leadId,
  });

  const remindersQuery = useQuery({
    queryKey: ["lead_reminders", leadId],
    queryFn: async () => {
      if (!leadId) return [];
      const { data, error } = await supabase
        .from("follow_up_reminders")
        .select("*")
        .eq("lead_id", leadId)
        .order("reminder_date", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!leadId,
  });

  return { notesQuery, activityQuery, assignmentQuery, remindersQuery };
}
