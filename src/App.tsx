
import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from '@/components/Layout';
import { SubcontractTable } from '@/components/SubcontractTable';
import { SubcontractStepper } from '@/components/SubcontractStepper';
import { SubcontractDetailView } from '@/components/SubcontractDetailView';

const queryClient = new QueryClient();

const App = () => {
  const [currentPage, setCurrentPage] = useState('subcontracts');
  const [showStepper, setShowStepper] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);

  const handleSaveSubcontract = (data: any) => {
    console.log('Saving subcontract:', data);
    // Here you would typically save to your backend
  };

  const handleViewDetail = (contractId: string) => {
    setSelectedContractId(contractId);
    setCurrentPage('subcontract-detail');
  };

  const handleBackToList = () => {
    setSelectedContractId(null);
    setCurrentPage('subcontracts');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'subcontracts':
        return (
          <>
            <SubcontractTable 
              onCreateNew={() => setShowStepper(true)} 
              onViewDetail={handleViewDetail}
            />
            {showStepper && (
              <SubcontractStepper
                onClose={() => setShowStepper(false)}
                onSave={handleSaveSubcontract}
              />
            )}
          </>
        );
      case 'subcontract-detail':
        return selectedContractId ? (
          <SubcontractDetailView
            contractId={selectedContractId}
            onBack={handleBackToList}
            onEdit={() => setShowStepper(true)}
          />
        ) : null;
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Dashboard</h2>
              <p className="text-muted-foreground">Overview of your subcontractor management system</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-6 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">24</div>
                <div className="text-sm text-muted-foreground">Active Subcontracts</div>
              </div>
              <div className="p-6 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">EGP 2.5M</div>
                <div className="text-sm text-muted-foreground">Total Contract Value</div>
              </div>
              <div className="p-6 border rounded-lg">
                <div className="text-2xl font-bold text-orange-600">3</div>
                <div className="text-sm text-muted-foreground">Over Budget</div>
              </div>
              <div className="p-6 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">12</div>
                <div className="text-sm text-muted-foreground">Active Subcontractors</div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">{currentPage}</h2>
            <p className="text-muted-foreground">This module is coming soon...</p>
          </div>
        );
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
          {renderPage()}
        </Layout>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
