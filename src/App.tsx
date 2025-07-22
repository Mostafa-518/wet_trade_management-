import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Index from "@/pages/Index";
import { Login } from "@/pages/Login";
import { SignUp } from "@/pages/SignUp";
import { AuthGuard } from "@/components/AuthGuard";
import { Layout } from "@/components/Layout";
import { DataProvider } from "@/contexts/DataContext";
import { Projects } from "@/pages/Projects";
import { ProjectDetail } from "@/pages/ProjectDetail";
import { Subcontractors } from "@/pages/Subcontractors";
import { SubcontractorDetail } from "@/pages/SubcontractorDetail";
import { Trades } from "@/pages/Trades";
import { TradeDetail } from "@/pages/TradeDetail";
import { Responsibilities } from "@/pages/Responsibilities";
import { Subcontracts } from "@/pages/Subcontracts";
import { SubcontractDetail } from "@/pages/SubcontractDetail";
import { Report } from "@/pages/Report";
import { FilteredSubcontracts } from "@/pages/FilteredSubcontracts";
import { Users } from "@/pages/Users";
import { UserDetail } from "@/pages/UserDetail";
import { Profile } from "@/pages/Profile";
import { Dashboard } from "@/pages/Dashboard";
import { Alerts } from "@/pages/Alerts";
import { RoleManagementPage } from "@/pages/RoleManagement";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/"
          element={
            <AuthGuard>
              <Layout>
                <DataProvider>
                  <Index />
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
    
  );
}

export default App;
