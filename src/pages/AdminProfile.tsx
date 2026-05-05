import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Camera, User, Save, LogOut } from "lucide-react";

export default function AdminProfile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const profileQuery = useQuery({
    queryKey: ["my_profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const profile = profileQuery.data;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const isOnboarding = profile && !profile.full_name?.trim();

  useEffect(() => {
    if (profile && !initialized) {
      const parts = (profile.full_name || "").trim().split(/\s+/);
      setFirstName(parts[0] || "");
      setLastName(parts.slice(1).join(" ") || "");
      setInitialized(true);
    }
  }, [profile, initialized]);

  const avatarUrl = avatarPreview || profile?.avatar_url || null;

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);

      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      setAvatarPreview(publicUrl);
      queryClient.invalidateQueries({ queryKey: ["my_profile"] });
      queryClient.invalidateQueries({ queryKey: ["team_members"] });
      toast({ title: "Photo updated" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    if (!firstName.trim() || !lastName.trim()) {
      toast({ title: "Name required", description: "Please enter both first and last name.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName })
        .eq("id", user.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["my_profile"] });
      queryClient.invalidateQueries({ queryKey: ["team_members"] });
      toast({ title: "Profile updated" });

      if (isOnboarding) {
        navigate("/admin");
      }
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (profileQuery.isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-md">
      <div>
        <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground flex items-center gap-2">
          <User className="h-7 w-7 text-primary" />
          {isOnboarding ? "Welcome! Set Up Your Profile" : "Profile"}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {isOnboarding ? "Please add your name and photo to get started" : "Update your name and photo"}
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <div
            className="relative h-24 w-24 rounded-full bg-muted flex items-center justify-center overflow-hidden cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-muted-foreground">
                {(firstName || profile?.email || "?").charAt(0).toUpperCase()}
              </span>
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="h-6 w-6 text-white" />
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-xs text-primary hover:underline"
            disabled={uploading}
          >
            {uploading ? "Uploading…" : "Change photo"}
          </button>
        </div>

        {/* First Name */}
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            First Name <span className="text-destructive">*</span>
          </label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            className="bg-background"
            required
          />
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <label htmlFor="lastName" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Last Name <span className="text-destructive">*</span>
          </label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
            className="bg-background"
            required
          />
        </div>

        {/* Email (read only) */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Email
          </label>
          <Input value={profile?.email || ""} disabled className="bg-muted/50" />
        </div>

        <Button onClick={handleSave} disabled={saving || !firstName.trim() || !lastName.trim()} className="w-full">
          <Save className="h-4 w-4 mr-1.5" />
          {saving ? "Saving…" : isOnboarding ? "Complete Setup" : "Save Changes"}
        </Button>
      </div>

      {!isOnboarding && (
        <Button
          variant="outline"
          onClick={async () => {
            await signOut();
            navigate("/admin/login");
          }}
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
        >
          <LogOut className="h-4 w-4 mr-1.5" />
          Sign Out
        </Button>
      )}
    </div>
  );
}
