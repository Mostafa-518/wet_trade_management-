
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { Projects } from '@/pages/Projects';
import { ProjectDetail } from '@/pages/ProjectDetail';
import { Subcontracts } from '@/pages/Subcontracts';
import { SubcontractDetail } from '@/pages/SubcontractDetail';
import { Subcontractors } from '@/pages/Subcontractors';
import { SubcontractorDetail } from '@/pages/SubcontractorDetail';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:projectId" element={<ProjectDetail />} />
              <Route path="/subcontracts" element={<Subcontracts />} />
              <Route path="/subcontracts/:contractId" element={<SubcontractDetail />} />
              <Route path="/subcontractors" element={<Subcontractors />} />
              <Route path="/subcontractors/:subcontractorId" element={<SubcontractorDetail />} />
              <Route path="*" element={
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
                  <p className="text-muted-foreground">The requested page could not be found.</p>
                </div>
              } />
            </Routes>
          </Layout>
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
