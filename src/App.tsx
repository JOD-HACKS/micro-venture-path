import { ThemeProvider } from "@/components/providers/theme-provider";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { AuthProvider } from "@/contexts/auth-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout/Layout";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { HelmetProvider } from "react-helmet-async";
import Landing from "./pages/Landing";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Apply from "./pages/Apply";
import NotFound from "./pages/NotFound";
import Applications from "./pages/Applications";
import ApplicationDetail from "./pages/ApplicationDetail";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Skills from "./pages/Skills";
import Help from "./pages/Help";
import Contact from "./pages/Contact";
import SmsGuide from "./pages/SmsGuide";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";
import Accessibility from "./pages/Accessibility";
import EmployerDashboard from "./pages/EmployerDashboard";
import EmployerProjectNew from "./pages/EmployerProjectNew";
import AdminPlacementCell from "./pages/AdminPlacementCell";
import AdminStudents from "./pages/AdminStudents";
import CoordinatorVerify from "./pages/CoordinatorVerify";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          <TooltipProvider>
            <HelmetProvider>
              <Toaster />
              <Sonner />
              <HashRouter>
              <ScrollToTop />
              <Layout>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:id" element={<ProjectDetail />} />
                  <Route
                    path="/projects/:id/apply"
                    element={
                      <ProtectedRoute allowedRoles={["student"]}>
                        <Apply />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/applications"
                    element={
                      <ProtectedRoute allowedRoles={["student"]}>
                        <Applications />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/applications/:id"
                    element={
                      <ProtectedRoute allowedRoles={["student"]}>
                        <ApplicationDetail />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/auth" element={<Auth />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={["student"]}>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/notifications"
                    element={
                      <ProtectedRoute>
                        <Notifications />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/skills"
                    element={
                      <ProtectedRoute allowedRoles={["student"]}>
                        <Skills />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/help" element={<Help />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/sms-guide" element={<SmsGuide />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/cookies" element={<Cookies />} />
                  <Route path="/accessibility" element={<Accessibility />} />
                  <Route
                    path="/employer/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={["employer"]}>
                        <EmployerDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/employer/projects/new"
                    element={
                      <ProtectedRoute allowedRoles={["employer"]}>
                        <EmployerProjectNew />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/placement-cell"
                    element={
                      <ProtectedRoute allowedRoles={["college_admin"]}>
                        <AdminPlacementCell />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/students"
                    element={
                      <ProtectedRoute allowedRoles={["college_admin"]}>
                        <AdminStudents />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/coordinator/verify"
                    element={
                      <ProtectedRoute allowedRoles={["coordinator"]}>
                        <CoordinatorVerify />
                      </ProtectedRoute>
                    }
                  />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </HashRouter>
            </HelmetProvider>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
