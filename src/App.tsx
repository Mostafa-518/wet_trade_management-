
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { AuthGuard } from '@/components/AuthGuard';
import { Layout } from '@/components/Layout';
import { DataProvider } from '@/contexts/DataContext';
import { Toaster } from '@/components/ui/toaster';
import { ROUTES } from '@/config/routes';

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
import { Report } from '@/pages/Report';
import { FilteredSubcontracts } from '@/pages/FilteredSubcontracts';
import { Users } from '@/pages/Users';
import { UserDetail } from '@/pages/UserDetail';
import { ProfileSettings } from '@/pages/ProfileSettings';
import NotFound from '@/pages/NotFound';

interface ProtectedRouteProps {
  children: React.ReactNode;
  withDataProvider?: boolean;
}

function ProtectedRoute({ children, withDataProvider = true }: ProtectedRouteProps) {
  const content = withDataProvider ? (
    <DataProvider>{children}</DataProvider>
  ) : (
    children
  );

  return (
    <AuthGuard>
      <Layout>{content}</Layout>
    </AuthGuard>
  );
}

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Auth routes */}
            <Route path={ROUTES.LOGIN} element={
              <AuthGuard requireAuth={false}>
                <Login />
              </AuthGuard>
            } />
            <Route path={ROUTES.SIGNUP} element={
              <AuthGuard requireAuth={false}>
                <SignUp />
              </AuthGuard>
            } />
            
            {/* Protected routes */}
            <Route path={ROUTES.HOME} element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            
            <Route path={ROUTES.DASHBOARD} element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path={ROUTES.PROJECTS} element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            } />
            
            <Route path={ROUTES.PROJECT_DETAIL} element={
              <ProtectedRoute>
                <ProjectDetail />
              </ProtectedRoute>
            } />
            
            <Route path={ROUTES.SUBCONTRACTORS} element={
              <ProtectedRoute>
                <Subcontractors />
              </ProtectedRoute>
            } />
            
            <Route path={ROUTES.SUBCONTRACTOR_DETAIL} element={
              <ProtectedRoute>
                <SubcontractorDetail />
              </ProtectedRoute>
            } />
            
            <Route path={ROUTES.TRADES} element={
              <ProtectedRoute>
                <Trades />
              </ProtectedRoute>
            } />
            
            <Route path={ROUTES.TRADE_DETAIL} element={
              <ProtectedRoute>
                <TradeDetail />
              </ProtectedRoute>
            } />
            
            <Route path={ROUTES.RESPONSIBILITIES} element={
              <ProtectedRoute>
                <Responsibilities />
              </ProtectedRoute>
            } />
            
            <Route path={ROUTES.SUBCONTRACTS} element={
              <ProtectedRoute>
                <Subcontracts />
              </ProtectedRoute>
            } />
            
            <Route path={ROUTES.SUBCONTRACT_DETAIL} element={
              <ProtectedRoute>
                <SubcontractDetail />
              </ProtectedRoute>
            } />
            
            <Route path={ROUTES.REPORT} element={
              <ProtectedRoute>
                <Report />
              </ProtectedRoute>
            } />
            
            <Route path={ROUTES.FILTERED_SUBCONTRACTS} element={
              <ProtectedRoute>
                <FilteredSubcontracts />
              </ProtectedRoute>
            } />
            
            <Route path={ROUTES.USERS} element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            } />
            
            <Route path={ROUTES.USER_DETAIL} element={
              <ProtectedRoute>
                <UserDetail />
              </ProtectedRoute>
            } />
            
            <Route path={ROUTES.PROFILE} element={
              <ProtectedRoute withDataProvider={false}>
                <ProfileSettings />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;
