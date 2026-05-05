import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, hasAnyRole, rolesLoading } = useAuth();

  const profileQuery = useQuery({
    queryKey: ["my_profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user && hasAnyRole,
  });

  if (loading || (user && rolesLoading) || (user && hasAnyRole && profileQuery.isLoading)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user || !hasAnyRole) {
    return <Navigate to="/admin/login" replace />;
  }

  // Redirect new users without a name to profile setup
  const needsOnboarding = profileQuery.data && !profileQuery.data.full_name?.trim();
  const isOnProfilePage = window.location.pathname === "/admin/profile";

  if (needsOnboarding && !isOnProfilePage) {
    return <Navigate to="/admin/profile" replace />;
  }

  return <>{children}</>;
}
