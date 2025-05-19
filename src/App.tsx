import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Layout from "@/components/Layout";
import { AuthProvider } from "@/context/AuthContext";
import { useAuth } from "@/context/AuthContext";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import ChatHistory from "./pages/ChatHistory";
import Auth from "./pages/Auth";
import CertificateSubmission from "./pages/CertificateSubmission";
import AdminCertificates from "./pages/AdminCertificates";
import AdminDrugs from "./pages/AdminDrugs";
import DrugSearch from "./pages/DrugSearch";
import DrugInteractionChecker from "./pages/DrugInteractionChecker";
import ChatSession from './pages/ChatSession';
import Chat from '@/components/Chat';
import LandingPage from "./pages/LandingPage";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null; // Or a loading spinner
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

// For routes that only admins can access
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAdmin } = useAuth();
  
  if (loading) return null; // Or a loading spinner
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Route that redirects to landing when not authenticated */}
            <Route 
              path="/" 
              element={
                <AuthenticatedRedirect>
                  <SidebarProvider>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </SidebarProvider>
                </AuthenticatedRedirect>
              } 
            />
            
            <Route path="/chat-history" element={
              <SidebarProvider>
                <Layout>
                  <ProtectedRoute>
                    <ChatHistory />
                  </ProtectedRoute>
                </Layout>
              </SidebarProvider>
            } />
            
            <Route path="/certificate" element={
              <SidebarProvider>
                <Layout>
                  <ProtectedRoute>
                    <CertificateSubmission />
                  </ProtectedRoute>
                </Layout>
              </SidebarProvider>
            } />
            
            <Route path="/admin/certificates" element={
              <SidebarProvider>
                <Layout>
                  <AdminRoute>
                    <AdminCertificates />
                  </AdminRoute>
                </Layout>
              </SidebarProvider>
            } />
            
            <Route path="/admin/drugs" element={
              <SidebarProvider>
                <Layout>
                  <AdminRoute>
                    <AdminDrugs />
                  </AdminRoute>
                </Layout>
              </SidebarProvider>
            } />

            <Route path="/drug-search" element={
              <SidebarProvider>
                <Layout>
                  <ProtectedRoute>
                    <DrugSearch />
                  </ProtectedRoute>
                </Layout>
              </SidebarProvider>
            } />

            <Route path="/drug-interaction" element={
              <SidebarProvider>
                <Layout>
                  <ProtectedRoute>
                    <DrugInteractionChecker />
                  </ProtectedRoute>
                </Layout>
              </SidebarProvider>
            } />

            <Route path="/assistant" element={
              <SidebarProvider>
                <Layout>
                  <ProtectedRoute>
                    <div className="h-[calc(100vh-4rem)]">
                      <Chat />
                    </div>
                  </ProtectedRoute>
                </Layout>
              </SidebarProvider>
            } />

            <Route path="/profile" element={
              <SidebarProvider>
                <Layout>
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                </Layout>
              </SidebarProvider>
            } />

            <Route path="/chat/:sessionId" element={
              <SidebarProvider>
                <Layout>
                  <ProtectedRoute>
                    <ChatSession />
                  </ProtectedRoute>
                </Layout>
              </SidebarProvider>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Redirect authenticated users to dashboard, unauthenticated users to landing page
const AuthenticatedRedirect = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  
  if (!user) {
    return <Navigate to="/landing" replace />;
  }
  
  return <>{children}</>;
};

export default App;
