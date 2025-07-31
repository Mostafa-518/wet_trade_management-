import React, { Suspense, lazy } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { Login } from "@/pages/Login";
import { SignUp } from "@/pages/SignUp";
import { AuthGuard } from "@/components/AuthGuard";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PageErrorBoundary } from "@/components/PageErrorBoundary";
import { Layout } from "@/components/Layout";
import { DataProvider } from "@/contexts/DataContext";
import { TableSkeleton } from "@/components/ui/table-skeleton";

// Lazy load components for better performance
const Index = lazy(() => import("@/pages/Index"));
const Projects = lazy(() => import("@/pages/Projects").then(m => ({ default: m.Projects })));
const ProjectDetail = lazy(() => import("@/pages/ProjectDetail").then(m => ({ default: m.ProjectDetail })));
const Subcontractors = lazy(() => import("@/pages/Subcontractors").then(m => ({ default: m.Subcontractors })));
const SubcontractorDetail = lazy(() => import("@/pages/SubcontractorDetail").then(m => ({ default: m.SubcontractorDetail })));
const Trades = lazy(() => import("@/pages/Trades").then(m => ({ default: m.Trades })));
const TradeDetail = lazy(() => import("@/pages/TradeDetail").then(m => ({ default: m.TradeDetail })));
const Responsibilities = lazy(() => import("@/pages/Responsibilities").then(m => ({ default: m.Responsibilities })));
const Subcontracts = lazy(() => import("@/pages/Subcontracts").then(m => ({ default: m.Subcontracts })));
const SubcontractDetail = lazy(() => import("@/pages/SubcontractDetail").then(m => ({ default: m.SubcontractDetail })));
const Report = lazy(() => import("@/pages/Report").then(m => ({ default: m.Report })));
const FilteredSubcontracts = lazy(() => import("@/pages/FilteredSubcontracts").then(m => ({ default: m.FilteredSubcontracts })));
const Users = lazy(() => import("@/pages/Users").then(m => ({ default: m.Users })));
const UserDetail = lazy(() => import("@/pages/UserDetail").then(m => ({ default: m.UserDetail })));
const Profile = lazy(() => import("@/pages/Profile").then(m => ({ default: m.Profile })));
const Dashboard = lazy(() => import("@/pages/Dashboard").then(m => ({ default: m.Dashboard })));
const Alerts = lazy(() => import("@/pages/Alerts").then(m => ({ default: m.Alerts })));
const RoleManagementPage = lazy(() => import("@/pages/RoleManagement").then(m => ({ default: m.RoleManagementPage })));

// Loading fallback
const PageLoading = () => <div className="p-6"><TableSkeleton columns={5} rows={3} /></div>;

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/login" element={
            <PageErrorBoundary pageName="Login">
              <Login />
            </PageErrorBoundary>
          } />
          <Route path="/signup" element={
            <PageErrorBoundary pageName="Sign Up">
              <SignUp />
            </PageErrorBoundary>
          } />
        <Route
          path="/"
          element={
            <AuthGuard>
              <Layout>
                <DataProvider>
                  <PageErrorBoundary>
                    <Suspense fallback={<PageLoading />}>
                      <Index />
                    </Suspense>
                  </PageErrorBoundary>
                </DataProvider>
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <Layout>
                <DataProvider>
                  <Dashboard />
                </DataProvider>
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/alerts"
          element={
            <AuthGuard>
              <Layout>
                <DataProvider>
                  <Alerts />
                </DataProvider>
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/projects"
          element={
            <AuthGuard>
              <Layout>
                <DataProvider>
                  <Projects />
                </DataProvider>
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <AuthGuard>
              <Layout>
                <DataProvider>
                  <ProjectDetail />
                </DataProvider>
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/subcontractors"
          element={
            <AuthGuard>
              <Layout>
                <DataProvider>
                  <Subcontractors />
                </DataProvider>
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/subcontractors/:id"
          element={
            <AuthGuard>
              <Layout>
                <DataProvider>
                  <SubcontractorDetail />
                </DataProvider>
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/trades"
          element={
            <AuthGuard>
              <Layout>
                <DataProvider>
                  <Trades />
                </DataProvider>
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/trades/:tradeId"
          element={
            <AuthGuard>
              <Layout>
                <DataProvider>
                  <TradeDetail />
                </DataProvider>
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/responsibilities"
          element={
            <AuthGuard>
              <Layout>
                <DataProvider>
                  <Responsibilities />
                </DataProvider>
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/subcontracts"
          element={
            <AuthGuard>
              <Layout>
                <DataProvider>
                  <Subcontracts />
                </DataProvider>
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/subcontracts/:id"
          element={
            <AuthGuard>
              <Layout>
                <DataProvider>
                  <SubcontractDetail />
                </DataProvider>
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/report"
          element={
            <AuthGuard>
              <Layout>
                <DataProvider>
                  <Report />
                </DataProvider>
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/reports/subcontracts"
          element={
            <AuthGuard>
              <Layout>
                <DataProvider>
                  <FilteredSubcontracts />
                </DataProvider>
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/users"
          element={
            <AuthGuard>
              <Layout>
                <DataProvider>
                  <Users />
                </DataProvider>
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/users/:id"
          element={
            <AuthGuard>
              <Layout>
                <DataProvider>
                  <UserDetail />
                </DataProvider>
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/admin/roles"
          element={
            <AuthGuard>
              <Layout>
                <DataProvider>
                  <RoleManagementPage />
                </DataProvider>
              </Layout>
            </AuthGuard>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthGuard>
              <Layout>
                <DataProvider>
                  <Profile />
                </DataProvider>
              </Layout>
            </AuthGuard>
          }
        />
      </Routes>
    </Router>
    </ErrorBoundary>
  );
}

export default App;
