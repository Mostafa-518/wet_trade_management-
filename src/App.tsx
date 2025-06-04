
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { DataProvider } from '@/contexts/DataContext';
import Index from '@/pages/Index';
import { Dashboard } from '@/pages/Dashboard';
import { Projects } from '@/pages/Projects';
import { ProjectDetail } from '@/pages/ProjectDetail';
import { Subcontractors } from '@/pages/Subcontractors';
import { SubcontractorDetail } from '@/pages/SubcontractorDetail';
import { Responsibilities } from '@/pages/Responsibilities';
import { Trades } from '@/pages/Trades';
import { TradeDetail } from '@/pages/TradeDetail';
import { Subcontracts } from '@/pages/Subcontracts';
import { SubcontractDetail } from '@/pages/SubcontractDetail';
import { Users } from '@/pages/Users';
import { UserDetail } from '@/pages/UserDetail';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <DataProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:projectId" element={<ProjectDetail />} />
            <Route path="/subcontractors" element={<Subcontractors />} />
            <Route path="/subcontractors/:subcontractorId" element={<SubcontractorDetail />} />
            <Route path="/responsibilities" element={<Responsibilities />} />
            <Route path="/trades" element={<Trades />} />
            <Route path="/trades/:tradeId" element={<TradeDetail />} />
            <Route path="/subcontracts" element={<Subcontracts />} />
            <Route path="/subcontracts/:contractId" element={<SubcontractDetail />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:userId" element={<UserDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </DataProvider>
  );
}

export default App;
