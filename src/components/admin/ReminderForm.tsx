import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Bell, CheckCircle2, Plus, SendHorizonal, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  leadId: string;
  reminders: any[];
}

export default function ReminderForm({ leadId, reminders }: Props) {
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const refetchReminders = () => Promise.all([
    queryClient.refetchQueries({ queryKey: ["lead_reminders", leadId] }),
    queryClient.refetchQueries({ queryKey: ["lead_activity", leadId] }),
  ]);

  const addReminder = async () => {
    if (!date || !user) return;
    setSaving(true);
    await supabase.from("follow_up_reminders").insert({
      lead_id: leadId, assigned_to: user.id, created_by: user.id,
      reminder_date: new Date(date).toISOString(), message: message || null,
    });
    await supabase.from("lead_activity_log").insert({
      lead_id: leadId, user_id: user.id, action: "reminder_set",
      new_value: format(new Date(date), "MMM d, yyyy"),
    });
    setDate("");
    setMessage("");
    setShowForm(false);
    await refetchReminders();
    setSaving(false);
  };

  const markSent = async (reminderId: string) => {
    if (!user) return;
    setActionId(reminderId);
    await supabase.from("follow_up_reminders").update({ sent: true }).eq("id", reminderId);
    await supabase.from("lead_activity_log").insert({
      lead_id: leadId, user_id: user.id, action: "reminder_completed",
      new_value: "Marked as sent",
    });
    await refetchReminders();
    setActionId(null);
  };

  const deleteReminder = async (reminderId: string) => {
    setActionId(reminderId);
    await supabase.from("follow_up_reminders").delete().eq("id", reminderId);
    await refetchReminders();
    setActionId(null);
  };

  const pending = reminders.filter((r) => !r.sent);
  const sent = reminders.filter((r) => r.sent);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Bell className="h-3.5 w-3.5" /> Reminders
        </h4>
        {!showForm && (
          <Button variant="ghost" size="sm" onClick={() => setShowForm(true)} className="h-7 text-xs">
            <Plus className="h-3 w-3 mr-1" />Add
          </Button>
        )}
      </div>

      {showForm && (
        <div className="space-y-2 p-3 rounded-lg border border-border bg-muted/30">
          <Input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className="h-9 bg-card" />
          <Textarea
            placeholder="Optional reminder message…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={1}
            className="bg-card resize-none"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={addReminder} disabled={saving || !date} className="h-8">Set Reminder</Button>
            <Button size="sm" variant="ghost" onClick={() => setShowForm(false)} className="h-8">Cancel</Button>
          </div>
        </div>
      )}

      {pending.length > 0 && (
        <div className="space-y-2">
          {pending.map((r: any) => (
            <div key={r.id} className="flex items-start justify-between gap-2 text-sm p-2.5 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-start gap-2.5 min-w-0">
                <Bell className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {format(new Date(r.reminder_date), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                  {r.message && <p className="text-xs text-muted-foreground mt-0.5 truncate">{r.message}</p>}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markSent(r.id)}
                  disabled={actionId === r.id}
                  className="h-6 w-6 p-0 hover:text-primary hover:bg-primary/10"
                  title="Mark as sent"
                >
                  <SendHorizonal className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteReminder(r.id)}
                  disabled={actionId === r.id}
                  className="h-6 w-6 p-0 hover:text-destructive hover:bg-destructive/10"
                  title="Delete reminder"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {sent.length > 0 && (
        <div className="space-y-2">
          {sent.map((r: any) => (
            <div key={r.id} className="flex items-start justify-between gap-2 text-sm p-2.5 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-start gap-2.5 min-w-0">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground line-through">
                    {format(new Date(r.reminder_date), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                  {r.message && <p className="text-xs text-muted-foreground/60 mt-0.5 truncate">{r.message}</p>}
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Badge variant="outline" className="text-[10px] shrink-0 border-primary/30 text-primary bg-primary/10">
                  Sent
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteReminder(r.id)}
                  disabled={actionId === r.id}
                  className="h-6 w-6 p-0 hover:text-destructive hover:bg-destructive/10"
                  title="Delete reminder"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
