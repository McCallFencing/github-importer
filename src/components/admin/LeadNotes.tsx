import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { MessageSquare, Send, Trash2 } from "lucide-react";

interface Props {
  leadId: string;
  notes: any[];
}

export default function LeadNotes({ leadId, notes }: Props) {
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const addNote = async () => {
    if (!content.trim() || !user) return;
    setSaving(true);
    const { error } = await supabase.from("lead_notes").insert({ lead_id: leadId, user_id: user.id, content: content.trim() });
    if (!error) {
      await supabase.from("lead_activity_log").insert({
        lead_id: leadId, user_id: user.id, action: "note_added", new_value: content.trim(),
      });
      setContent("");
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ["lead_notes", leadId] }),
        queryClient.refetchQueries({ queryKey: ["lead_activity", leadId] }),
      ]);
    }
    setSaving(false);
  };

  const deleteNote = async (noteId: string) => {
    setDeleting(noteId);
    const { error } = await supabase.from("lead_notes").delete().eq("id", noteId);
    if (!error) {
      await queryClient.refetchQueries({ queryKey: ["lead_notes", leadId] });
      await queryClient.refetchQueries({ queryKey: ["lead_activity", leadId] });
    }
    setDeleting(null);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        <MessageSquare className="h-3.5 w-3.5" /> Notes
      </h4>
      <div className="space-y-2">
        <Textarea
          placeholder="Add a note…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={2}
          className="bg-card border-border resize-none"
        />
        <Button size="sm" onClick={addNote} disabled={saving || !content.trim()} className="h-8">
          <Send className="h-3.5 w-3.5 mr-1.5" />Add Note
        </Button>
      </div>
       <div className="space-y-2">
        {notes.map((note: any) => (
          <div key={note.id} className="rounded-lg bg-muted/40 border border-border/50 p-3 space-y-1.5">
            <div className="flex justify-between items-start gap-2">
              <div className="flex flex-col">
                <span className="font-medium text-foreground text-xs">{note.profiles?.full_name || note.profiles?.email || "Unknown"}</span>
                <span className="text-muted-foreground text-xs">{format(new Date(note.created_at), "MMM d, h:mm a")}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteNote(note.id)}
                disabled={deleting === note.id}
                className="h-6 w-6 p-0 hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{note.content}</p>
          </div>
        ))}
       </div>
    </div>
  );
}
