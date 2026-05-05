import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "./components/ScrollToTop";

// Safety net: redirect recovery tokens from root to /admin/reset-password
const RecoveryRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (location.pathname === "/") {
      if (window.location.hash.includes("type=recovery")) {
        navigate("/admin/reset-password" + window.location.hash, { replace: true });
      }
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        navigate("/admin/reset-password?code=" + code, { replace: true });
      }
    }
  }, [location.pathname, navigate]);
  return null;
};

// Lazy load all pages for code splitting
const Home = lazy(() => import("./pages/Home"));
const Residential = lazy(() => import("./pages/Residential"));
const Commercial = lazy(() => import("./pages/Commercial"));
const Gates = lazy(() => import("./pages/Gates"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const Admin = lazy(() => import("./pages/Admin"));
const AcceptInvite = lazy(() => import("./pages/AcceptInvite"));
const AdminResetPassword = lazy(() => import("./pages/AdminResetPassword"));

import ProtectedRoute from "./components/admin/ProtectedRoute";


const queryClient = new QueryClient();

// Minimal loading fallback to avoid layout shift
const PageLoader = () => (
  <div className="min-h-screen bg-background" />
);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <RecoveryRedirect />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/residential" element={<Residential />} />
              <Route path="/commercial" element={<Commercial />} />
              <Route path="/gates" element={<Gates />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/reset-password" element={<AdminResetPassword />} />
              <Route path="/admin/accept-invite" element={<AcceptInvite />} />
              
              <Route path="/admin/*" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
