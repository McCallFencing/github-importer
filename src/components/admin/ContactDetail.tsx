import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { formatSource, formatPhone, SOURCE_STYLES } from "@/lib/lead-utils";
import { format } from "date-fns";
import { Mail, Phone, MapPin, Calendar, Trash2, Pencil, Save, X } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Lead = Tables<"leads">;

interface Props {
  contact: Lead | null;
  open: boolean;
  onClose: () => void;
  submissionCount: number;
}

export default function ContactDetail({ contact, open, onClose, submissionCount }: Props) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });

  const startEdit = () => {
    if (!contact) return;
    setForm({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      address: contact.address || "",
    });
    setEditing(true);
  };

  const cancelEdit = () => setEditing(false);

  const handleSave = async () => {
    if (!contact) return;
    setSaving(true);
    try {
      // Update all leads with matching email
      const { error } = await supabase
        .from("leads")
        .update({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          address: form.address.trim() || null,
        })
        .eq("email", contact.email);
      if (error) throw error;
      toast({ title: "Contact updated" });
      setEditing(false);
      queryClient.invalidateQueries({ queryKey: ["contacts_all"] });
    } catch {
      toast({ title: "Failed to update contact", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!contact) return;
    try {
      // Delete all leads with this email (and cascading data)
      const { data: leads } = await supabase
        .from("leads")
        .select("id")
        .eq("email", contact.email);

      if (leads) {
        const ids = leads.map((l) => l.id);
        await supabase.from("lead_notes").delete().in("lead_id", ids);
        await supabase.from("lead_activity_log").delete().in("lead_id", ids);
        await supabase.from("lead_assignments").delete().in("lead_id", ids);
        await supabase.from("follow_up_reminders").delete().in("lead_id", ids);
        await supabase.from("leads").delete().in("id", ids);
      }

      toast({ title: "Contact deleted" });
      queryClient.invalidateQueries({ queryKey: ["contacts_all"] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      onClose();
    } catch {
      toast({ title: "Failed to delete contact", variant: "destructive" });
    }
  };

  if (!contact) return null;

  return (
    <Sheet open={open} onOpenChange={(o) => { if (!o) { setEditing(false); onClose(); } }}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-0 [&>button]:text-cream [&>button]:hover:text-white [&>button]:opacity-100">
        {/* Header */}
        <div className="bg-charcoal p-6 pb-5">
          <SheetHeader>
            <SheetTitle className="font-display text-xl text-cream">{contact.name}</SheetTitle>
          </SheetHeader>
          <div className="flex items-center gap-2 mt-3">
            <Badge variant="outline" className="text-xs font-medium border-white/20 bg-white/10 text-white/90">
              {formatSource(contact.source)}
            </Badge>
            <span className="text-xs text-white/60">
              {submissionCount} submission{submissionCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Contact Info - View or Edit */}
          {editing ? (
            <div className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Edit Contact</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="edit-name" className="text-xs text-muted-foreground">Name</Label>
                  <Input id="edit-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="mt-1 h-9" />
                </div>
                <div>
                  <Label htmlFor="edit-email" className="text-xs text-muted-foreground">Email</Label>
                  <Input id="edit-email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="mt-1 h-9" />
                </div>
                <div>
                  <Label htmlFor="edit-phone" className="text-xs text-muted-foreground">Phone</Label>
                  <Input id="edit-phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="mt-1 h-9" />
                </div>
                <div>
                  <Label htmlFor="edit-address" className="text-xs text-muted-foreground">Address</Label>
                  <Input id="edit-address" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} className="mt-1 h-9" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={saving || !form.name.trim() || !form.email.trim() || !form.phone.trim()} className="flex-1">
                  <Save className="h-4 w-4 mr-1.5" />{saving ? "Saving…" : "Save"}
                </Button>
                <Button variant="outline" onClick={cancelEdit} className="flex-1">
                  <X className="h-4 w-4 mr-1.5" />Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact</h4>
                <Button variant="ghost" size="sm" onClick={startEdit} className="h-7 text-xs gap-1">
                  <Pencil className="h-3 w-3" /> Edit
                </Button>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <a href={`mailto:${contact.email}`} className="text-foreground hover:text-primary transition-colors">{contact.email}</a>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <a href={`tel:${contact.phone}`} className="text-foreground hover:text-primary transition-colors">{formatPhone(contact.phone)}</a>
                </div>
                {contact.address && (
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-foreground">{contact.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground">Last active {format(new Date(contact.created_at), "MMM d, yyyy 'at' h:mm a")}</span>
                </div>
              </div>
            </div>
          )}

          {/* Delete */}
          <div className="border-t border-border pt-6">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="h-4 w-4 mr-1.5" />Delete Contact
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this contact?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete <strong>{contact.name}</strong> and all {submissionCount} associated lead submission{submissionCount !== 1 ? "s" : ""}, including notes, activity, assignments, and reminders. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={handleDelete}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
