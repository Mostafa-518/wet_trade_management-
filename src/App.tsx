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
            
            {/* Protected routes */}
            <Route path="/" element={
              <AuthGuard>
                <DataProvider>
                  <Layout>
                    <Index />
                  </Layout>
                </DataProvider>
              </AuthGuard>
            } />
            
            <Route path="/dashboard" element={
              <AuthGuard>
                <DataProvider>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </DataProvider>
              </AuthGuard>
            } />
            
            <Route path="/projects" element={
              <AuthGuard>
                <DataProvider>
                  <Layout>
                    <Projects />
                  </Layout>
                </DataProvider>
              </AuthGuard>
            } />
            
            <Route path="/projects/:id" element={
              <AuthGuard>
                <DataProvider>
                  <Layout>
                    <ProjectDetail />
                  </Layout>
                </DataProvider>
              </AuthGuard>
            } />
            
            <Route path="/subcontractors" element={
              <AuthGuard>
                <DataProvider>
                  <Layout>
                    <Subcontractors />
                  </Layout>
                </DataProvider>
              </AuthGuard>
            } />
            
            <Route path="/subcontractors/:id" element={
              <AuthGuard>
                <DataProvider>
                  <Layout>
                    <SubcontractorDetail />
                  </Layout>
                </DataProvider>
              </AuthGuard>
            } />
            
            <Route path="/trades" element={
              <AuthGuard>
                <DataProvider>
                  <Layout>
                    <Trades />
                  </Layout>
                </DataProvider>
              </AuthGuard>
            } />
            
            <Route path="/trades/:id" element={
              <AuthGuard>
                <DataProvider>
                  <Layout>
                    <TradeDetail />
                  </Layout>
                </DataProvider>
              </AuthGuard>
            } />
            
            <Route path="/responsibilities" element={
              <AuthGuard>
                <DataProvider>
                  <Layout>
                    <Responsibilities />
                  </Layout>
                </DataProvider>
              </AuthGuard>
            } />
            
            <Route path="/subcontracts" element={
              <AuthGuard>
                <DataProvider>
                  <Layout>
                    <Subcontracts />
                  </Layout>
                </DataProvider>
              </AuthGuard>
            } />
            
            <Route path="/subcontracts/:id" element={
              <AuthGuard>
                <DataProvider>
                  <Layout>
                    <SubcontractDetail />
                  </Layout>
                </DataProvider>
              </AuthGuard>
            } />
            
            <Route path="/users" element={
              <AuthGuard>
                <DataProvider>
                  <Layout>
                    <Users />
                  </Layout>
                </DataProvider>
              </AuthGuard>
            } />
            
            <Route path="/users/:id" element={
              <AuthGuard>
                <DataProvider>
                  <Layout>
                    <UserDetail />
                  </Layout>
                </DataProvider>
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
