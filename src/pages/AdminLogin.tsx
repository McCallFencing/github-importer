import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, ArrowRight, ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import mcCallLogo from "@/assets/mccall-logo-white.png";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const { signIn, user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      navigate("/admin", { replace: true });
    }
  }, [user, isAdmin, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      navigate("/admin", { replace: true });
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const redirectTo = window.location.origin + "/admin/reset-password";
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setResetSent(true);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <img src={mcCallLogo} alt="McCall Fence" className="h-10 mx-auto mb-4 opacity-80" />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <Lock className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary tracking-wide uppercase">McCall CRM</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-steel-dark/50 backdrop-blur-sm border border-secondary/20 rounded-xl p-8 shadow-2xl">
          <div className="mb-6">
            <h1 className="text-2xl font-display font-bold text-cream">Welcome back</h1>
            <p className="text-sm text-metal-light mt-1">Sign in to manage your leads</p>
          </div>

          {forgotMode ? (
            resetSent ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-4">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h2 className="text-lg font-display font-bold text-cream mb-2">Check your email</h2>
                <p className="text-sm text-metal-light mb-6">
                  We sent a password reset link to <span className="text-cream">{email}</span>
                </p>
                <button
                  onClick={() => { setForgotMode(false); setResetSent(false); setError(""); }}
                  className="text-sm text-primary hover:text-primary/80 inline-flex items-center gap-1"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to login
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-5">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                  >
                    {error}
                  </motion.div>
                )}
                <p className="text-sm text-metal-light">Enter your email and we'll send you a link to reset your password.</p>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-metal-light uppercase tracking-wider">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@mccallfencing.com"
                    required
                    className="bg-charcoal/50 border-secondary/30 text-cream placeholder:text-metal focus:border-primary h-11"
                  />
                </div>
                <Button type="submit" className="w-full h-11 font-semibold" disabled={loading}>
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" />
                  ) : (
                    <>Send Reset Link <Mail className="h-4 w-4 ml-1" /></>
                  )}
                </Button>
                <button
                  type="button"
                  onClick={() => { setForgotMode(false); setError(""); }}
                  className="w-full text-sm text-metal-light hover:text-cream inline-flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to login
                </button>
              </form>
            )
          ) : (
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
                <label className="text-xs font-medium text-metal-light uppercase tracking-wider">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@mccallfencing.com"
                  required
                  className="bg-charcoal/50 border-secondary/30 text-cream placeholder:text-metal focus:border-primary h-11"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-metal-light uppercase tracking-wider">Password</label>
                  <button
                    type="button"
                    onClick={() => { setForgotMode(true); setError(""); }}
                    className="text-xs text-primary hover:text-primary/80"
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-charcoal/50 border-secondary/30 text-cream placeholder:text-metal focus:border-primary h-11"
                />
              </div>
              <Button type="submit" className="w-full h-11 font-semibold" disabled={loading}>
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <>Sign In <ArrowRight className="h-4 w-4 ml-1" /></>
                )}
              </Button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-metal mt-6">
          McCall Commercial Fencing &middot; Serving the Tri-Cities Since 1997
        </p>
      </motion.div>
    </div>
  );
}
