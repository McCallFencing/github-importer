import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function useTeam() {
  const queryClient = useQueryClient();

  const membersQuery = useQuery({
    queryKey: ["team_members"],
    queryFn: async () => {
      const [profilesRes, rolesRes] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: true }),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      if (profilesRes.error) throw profilesRes.error;
      if (rolesRes.error) throw rolesRes.error;
      const rolesMap = new Map<string, string[]>();
      for (const r of rolesRes.data) {
        const arr = rolesMap.get(r.user_id) || [];
        arr.push(r.role);
        rolesMap.set(r.user_id, arr);
      }
      return profilesRes.data.map((p) => ({ ...p, roles: rolesMap.get(p.id) || [] }));
    },
  });

  const invitationsQuery = useQuery({
    queryKey: ["invitations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invitations")
        .select("id, email, role, accepted, accepted_at, expires_at, created_at, invited_by")
        .is("accepted_at", null)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const inviteMember = useMutation({
    mutationFn: async ({ email, invitedBy, role }: { email: string; invitedBy: string; role?: string }) => {
      const siteUrl = window.location.origin;
      const { data, error } = await supabase.functions.invoke("invite-team-member", {
        body: { email, role: role || "worker", siteUrl: siteUrl || undefined },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      queryClient.invalidateQueries({ queryKey: ["team_members"] });
      toast({ title: "Invitation sent", description: "An email has been sent with login instructions." });
    },
    onError: (error: Error) => {
      toast({ title: "Invite failed", description: error.message, variant: "destructive" });
    },
  });

  const resendInvitation = useMutation({
    mutationFn: async (email: string) => {
      const siteUrl = window.location.origin;
      const { data, error } = await supabase.functions.invoke("invite-team-member", {
        body: { email, resend: true, siteUrl: siteUrl || undefined },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      toast({ title: "Invitation resent", description: "A new invite email has been sent." });
    },
    onError: (error: Error) => {
      toast({ title: "Resend failed", description: error.message, variant: "destructive" });
    },
  });

  const deleteInvitation = useMutation({
    mutationFn: async (invitationId: string) => {
      const { error } = await supabase.from("invitations").delete().eq("id", invitationId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      toast({ title: "Invitation deleted" });
    },
  });

  const deleteMember = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase.functions.invoke("delete-team-member", {
        body: { userId },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team_members"] });
      toast({ title: "Team member removed" });
    },
    onError: (error: Error) => {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    },
  });

  const changeRole = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: string }) => {
      // Delete existing roles, then insert new one
      const { error: delErr } = await supabase.from("user_roles").delete().eq("user_id", userId);
      if (delErr) throw delErr;
      const { error: insErr } = await supabase.from("user_roles").insert({
        user_id: userId,
        role: newRole as any,
      });
      if (insErr) throw insErr;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team_members"] });
      toast({ title: "Role updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Role change failed", description: error.message, variant: "destructive" });
    },
  });

  const updateMemberName = useMutation({
    mutationFn: async ({ userId, fullName }: { userId: string; fullName: string }) => {
      const { error } = await supabase.from("profiles").update({ full_name: fullName }).eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team_members"] });
      toast({ title: "Name updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    },
  });

  const resetMemberPassword = useMutation({
    mutationFn: async (email: string) => {
      const redirectTo = window.location.origin + "/admin/reset-password";
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Password reset email sent", description: "They'll receive a link to set a new password." });
    },
    onError: (error: Error) => {
      toast({ title: "Reset failed", description: error.message, variant: "destructive" });
    },
  });

  return { membersQuery, invitationsQuery, inviteMember, resendInvitation, deleteInvitation, deleteMember, changeRole, updateMemberName, resetMemberPassword };
}
