import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useTeam } from "@/hooks/useTeam";
import { useAuth } from "@/hooks/useAuth";
import { UserPlus, Mail, Users, Send, Trash2, RotateCw, Pencil, KeyRound } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function TeamManagement() {
  const [email, setEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<string>("worker");
  const { user, isAdmin } = useAuth();
  const { membersQuery, invitationsQuery, inviteMember, resendInvitation, deleteInvitation, deleteMember, changeRole, updateMemberName, resetMemberPassword } = useTeam();
  const [editingMember, setEditingMember] = useState<{ id: string; firstName: string; lastName: string } | null>(null);

  const members = membersQuery.data ?? [];
  const invitations = invitationsQuery.data ?? [];

  const handleInvite = () => {
    if (!email.trim() || !user) return;
    inviteMember.mutate({ email: email.trim(), invitedBy: user.id, role: inviteRole });
    setEmail("");
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-2">
          <Users className="h-7 w-7 text-primary" />
          Team
        </h2>
        <p className="text-sm text-muted-foreground mt-1">{members.length} team member{members.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Invite - only for admins */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card p-5 space-y-4"
        >
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <UserPlus className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-foreground text-sm">Invite Team Member</h3>
              <p className="text-xs text-muted-foreground">They'll receive an invite to join McCall CRM</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-background h-10"
              onKeyDown={(e) => e.key === "Enter" && handleInvite()}
            />
            <Select value={inviteRole} onValueChange={setInviteRole}>
              <SelectTrigger className="w-[120px] h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="worker">Worker</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleInvite} disabled={inviteMember.isPending || !email.trim()} className="h-10">
              <Send className="h-4 w-4 mr-1.5" />Invite
            </Button>
          </div>
        </motion.div>
      )}

      {/* Members */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-3 bg-muted/40 border-b border-border">
          <h3 className="font-semibold text-sm text-foreground">Team Members</h3>
        </div>
        <div className="divide-y divide-border">
          {members.map((m) => {
            const memberIsAdmin = (m.roles || []).includes("admin");
            const memberIsWorker = (m.roles || []).includes("worker");
            const isSelf = m.id === user?.id;
            const currentRole = memberIsAdmin ? "admin" : memberIsWorker ? "worker" : "—";
            return (
              <div key={m.id} className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                  {m.avatar_url ? (
                    <img src={m.avatar_url} alt="" className="h-9 w-9 rounded-full object-cover" />
                  ) : (
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {(m.full_name || m.email)?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-foreground">{m.full_name || "—"}</p>
                      <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                        memberIsAdmin
                          ? "bg-primary/15 text-primary border-primary/20"
                          : "bg-muted text-muted-foreground border-border"
                      }`}>
                        {memberIsAdmin ? "Admin" : "Worker"}
                      </span>
                      {isSelf && (
                        <span className="text-[10px] text-muted-foreground">(you)</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{m.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Role change dropdown - admin only, not for self */}
                  {isAdmin && !isSelf && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-primary"
                      aria-label={`Edit name for ${m.full_name || m.email}`}
                      title="Edit name"
                      onClick={() => {
                        const parts = (m.full_name || "").trim().split(/\s+/);
                        setEditingMember({ id: m.id, firstName: parts[0] || "", lastName: parts.slice(1).join(" ") || "" });
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  {isAdmin && !isSelf && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-primary"
                          aria-label={`Reset password for ${m.full_name || m.email}`}
                          title="Reset password"
                        >
                          <KeyRound className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Send password reset?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will send a password reset email to <strong>{m.email}</strong>. They'll receive a link to set a new password.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => resetMemberPassword.mutate(m.email)}
                          >
                            Send Reset Email
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  {isAdmin && !isSelf && (
                    <Select
                      value={currentRole}
                      onValueChange={(newRole) => changeRole.mutate({ userId: m.id, newRole })}
                    >
                      <SelectTrigger className="w-[100px] h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="worker">Worker</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  {m.created_at && !isNaN(new Date(m.created_at).getTime()) && (
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      Joined {format(new Date(m.created_at), "MMM d, yyyy")}
                    </span>
                  )}
                  {isAdmin && !isSelf && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          aria-label={`Remove ${m.full_name || m.email}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove team member?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently remove <strong>{m.full_name || m.email}</strong> from the team. They will lose access to McCall CRM and all their data will be deleted. This cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => deleteMember.mutate(m.id)}
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            );
          })}
          {members.length === 0 && (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-muted-foreground">No team members yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Pending Invitations - only visible to admins */}
      {isAdmin && invitations.length > 0 && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-3 bg-muted/40 border-b border-border flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm text-foreground">Pending Invitations</h3>
          </div>
          <div className="divide-y divide-border">
            {invitations.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-foreground">{inv.email}</p>
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                      inv.role === "admin"
                        ? "bg-primary/15 text-primary border-primary/20"
                        : "bg-muted text-muted-foreground border-border"
                    }`}>
                      {inv.role === "admin" ? "Admin" : "Worker"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    Expires {format(new Date(inv.expires_at), "MMM d")}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-primary"
                    onClick={() => resendInvitation.mutate(inv.email)}
                    disabled={resendInvitation.isPending}
                    aria-label={`Resend invitation to ${inv.email}`}
                    title="Resend invite"
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteInvitation.mutate(inv.id)}
                    disabled={deleteInvitation.isPending}
                    aria-label={`Delete invitation for ${inv.email}`}
                    title="Delete invite"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Name Dialog */}
      <Dialog open={!!editingMember} onOpenChange={(open) => !open && setEditingMember(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Name</DialogTitle>
          </DialogHeader>
          {editingMember && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">First Name</label>
                <Input
                  value={editingMember.firstName}
                  onChange={(e) => setEditingMember({ ...editingMember, firstName: e.target.value })}
                  placeholder="First name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Last Name</label>
                <Input
                  value={editingMember.lastName}
                  onChange={(e) => setEditingMember({ ...editingMember, lastName: e.target.value })}
                  placeholder="Last name"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingMember(null)}>Cancel</Button>
                <Button
                  disabled={!editingMember.firstName.trim() || !editingMember.lastName.trim() || updateMemberName.isPending}
                  onClick={() => {
                    const fullName = `${editingMember.firstName.trim()} ${editingMember.lastName.trim()}`;
                    updateMemberName.mutate({ userId: editingMember.id, fullName }, { onSuccess: () => setEditingMember(null) });
                  }}
                >
                  {updateMemberName.isPending ? "Saving…" : "Save"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
