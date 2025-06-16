
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import { DataProvider } from '@/contexts/DataContext';
import { AuthGuard } from '@/components/AuthGuard';
import { Layout } from '@/components/Layout';
import { Toaster } from '@/components/ui/toaster';

// Auth pages
import { Login } from '@/pages/Login';
import { SignUp } from '@/pages/SignUp';

// Protected pages
import Index from '@/pages/Index';
import { Dashboard } from '@/pages/Dashboard';
import { Projects } from '@/pages/Projects';
import { ProjectDetail } from '@/pages/ProjectDetail';
import { Subcontractors } from '@/pages/Subcontractors';
import { SubcontractorDetail } from '@/pages/SubcontractorDetail';
import { Trades } from '@/pages/Trades';
import { TradeDetail } from '@/pages/TradeDetail';
import { Responsibilities } from '@/pages/Responsibilities';
import { Subcontracts } from '@/pages/Subcontracts';
import { SubcontractDetail } from '@/pages/SubcontractDetail';
import { Users } from '@/pages/Users';
import { UserDetail } from '@/pages/UserDetail';
import { ProfileSettings } from '@/pages/ProfileSettings';
import NotFound from '@/pages/NotFound';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Protected routes with Layout but DataProvider only for page content */}
            <Route path="/" element={
              <AuthGuard>
                <Layout>
                  <DataProvider>
                    <Index />
                  </DataProvider>
                </Layout>
              </AuthGuard>
            } />
            
            <Route path="/dashboard" element={
              <AuthGuard>
                <Layout>
                  <DataProvider>
                    <Dashboard />
                  </DataProvider>
                </Layout>
              </AuthGuard>
            } />
            
            <Route path="/projects" element={
              <AuthGuard>
                <Layout>
                  <DataProvider>
                    <Projects />
                  </DataProvider>
                </Layout>
              </AuthGuard>
            } />
            
            <Route path="/projects/:id" element={
              <AuthGuard>
                <Layout>
                  <DataProvider>
                    <ProjectDetail />
                  </DataProvider>
                </Layout>
              </AuthGuard>
            } />
            
            <Route path="/subcontractors" element={
              <AuthGuard>
                <Layout>
                  <DataProvider>
                    <Subcontractors />
                  </DataProvider>
                </Layout>
              </AuthGuard>
            } />
            
            <Route path="/subcontractors/:id" element={
              <AuthGuard>
                <Layout>
                  <DataProvider>
                    <SubcontractorDetail />
                  </DataProvider>
                </Layout>
              </AuthGuard>
            } />
            
            <Route path="/trades" element={
              <AuthGuard>
                <Layout>
                  <DataProvider>
                    <Trades />
                  </DataProvider>
                </Layout>
              </AuthGuard>
            } />
            
            <Route path="/trades/:id" element={
              <AuthGuard>
                <Layout>
                  <DataProvider>
                    <TradeDetail />
                  </DataProvider>
                </Layout>
              </AuthGuard>
            } />
            
            <Route path="/responsibilities" element={
              <AuthGuard>
                <Layout>
                  <DataProvider>
                    <Responsibilities />
                  </DataProvider>
                </Layout>
              </AuthGuard>
            } />
            
            <Route path="/subcontracts" element={
              <AuthGuard>
                <Layout>
                  <DataProvider>
                    <Subcontracts />
                  </DataProvider>
                </Layout>
              </AuthGuard>
            } />
            
            <Route path="/subcontracts/:id" element={
              <AuthGuard>
                <Layout>
                  <DataProvider>
                    <SubcontractDetail />
                  </DataProvider>
                </Layout>
              </AuthGuard>
            } />
            
            <Route path="/users" element={
              <AuthGuard>
                <Layout>
                  <DataProvider>
                    <Users />
                  </DataProvider>
                </Layout>
              </AuthGuard>
            } />
            
            <Route path="/users/:id" element={
              <AuthGuard>
                <Layout>
                  <DataProvider>
                    <UserDetail />
                  </DataProvider>
                </Layout>
              </AuthGuard>
            } />
            
            <Route path="/profile" element={
              <AuthGuard>
                <Layout>
                  <ProfileSettings />
                </Layout>
              </AuthGuard>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
