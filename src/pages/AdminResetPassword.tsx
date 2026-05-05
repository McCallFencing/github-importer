import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, ArrowRight, CheckCircle, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import mcCallLogo from "@/assets/mccall-logo-white.png";

export default function AdminResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidSession, setIsValidSession] = useState(false);
  const [linkError, setLinkError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const acceptActiveRecoverySession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!isMounted) return false;
      if (session?.user) {
        setIsValidSession(true);
        setLinkError("");
        setIsLoading(false);
        window.history.replaceState(null, "", window.location.pathname);
        return true;
      }
      return false;
    };

    const markInvalidLink = async () => {
      const recovered = await acceptActiveRecoverySession();
      if (recovered || !isMounted) return;
      setLinkError("This password reset link is invalid or has expired. Please request a new one.");
      setIsValidSession(false);
      setIsLoading(false);
    };

    // Listen for PASSWORD_RECOVERY event (works with both PKCE and implicit flows)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsValidSession(true);
        setIsLoading(false);
        // Clean URL
        window.history.replaceState(null, "", window.location.pathname);
      } else if (session?.user && window.location.pathname === "/admin/reset-password") {
        setIsValidSession(true);
        setLinkError("");
        setIsLoading(false);
      }
    });

    // Handle PKCE code exchange (code in query params)
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    // Handle implicit flow (tokens in hash)
    const hash = window.location.hash;
    const hashParams = new URLSearchParams(hash.substring(1));
    const accessToken = hashParams.get("access_token");

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          markInvalidLink();
        } else {
          setIsValidSession(true);
          setIsLoading(false);
          window.history.replaceState(null, "", window.location.pathname);
        }
      });
    } else if (accessToken) {
      // Legacy implicit flow fallback
      const refreshToken = hashParams.get("refresh_token");
      const type = hashParams.get("type");
      if (refreshToken && type === "recovery") {
        supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken }).then(({ error }) => {
          if (error) {
            markInvalidLink();
          } else {
            setIsValidSession(true);
            window.history.replaceState(null, "", window.location.pathname);
            setIsLoading(false);
          }
        });
      } else {
        markInvalidLink();
      }
    } else {
      // The auth client can consume the URL before this page mounts, so accept the recovered session if present.
      markInvalidLink();
    }

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      // Sign out for security, then redirect to login
      await supabase.auth.signOut();
      setTimeout(() => navigate("/admin/login", { replace: true }), 2500);
    }
  };

  const renderContent = () => {
    if (success) {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
          <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h2 className="text-xl font-display font-bold text-cream mb-2">Password Updated</h2>
          <p className="text-sm text-metal-light">Redirecting you to login…</p>
        </motion.div>
      );
    }

    if (isLoading) {
      return (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-metal-light">Verifying your reset link…</p>
        </div>
      );
    }

    if (linkError || !isValidSession) {
      return (
        <div className="text-center py-4">
          <AlertTriangle className="h-12 w-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-display font-bold text-cream mb-2">Invalid or Expired Link</h2>
          <p className="text-sm text-metal-light mb-6">{linkError || "Please request a new password reset link."}</p>
          <Button onClick={() => navigate("/admin/login", { replace: true })} className="w-full h-11 font-semibold">
            Back to Login <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      );
    }

    return (
      <>
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold text-cream">Set new password</h1>
          <p className="text-sm text-metal-light mt-1">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
            >
              {error}
            </motion.div>
          )}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-metal-light uppercase tracking-wider">New Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-charcoal/50 border-secondary/30 text-cream placeholder:text-metal focus:border-primary h-11"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-metal-light uppercase tracking-wider">Confirm Password</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-charcoal/50 border-secondary/30 text-cream placeholder:text-metal focus:border-primary h-11"
            />
          </div>
          <Button type="submit" className="w-full h-11 font-semibold" disabled={loading}>
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" />
            ) : (
              <>Update Password <ArrowRight className="h-4 w-4 ml-1" /></>
            )}
          </Button>
        </form>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <img src={mcCallLogo} alt="McCall Fence" className="h-10 mx-auto mb-4 opacity-80" />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <Lock className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary tracking-wide uppercase">Reset Password</span>
          </div>
        </div>

        <div className="bg-steel-dark/50 backdrop-blur-sm border border-secondary/20 rounded-xl p-8 shadow-2xl">
          {renderContent()}
        </div>

        <p className="text-center text-xs text-metal mt-6">
          McCall Commercial Fencing &middot; Serving the Tri-Cities Since 1997
        </p>
      </motion.div>
    </div>
  );
}
