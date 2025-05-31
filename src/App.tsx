
import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Layout } from '@/components/Layout';
import { SubcontractTable } from '@/components/SubcontractTable';
import { SubcontractStepper } from '@/components/SubcontractStepper';
import { SubcontractDetailView } from '@/components/SubcontractDetailView';
import { SubcontractorsTable } from '@/components/SubcontractorsTable';
import { SubcontractorDetailView } from '@/components/SubcontractorDetailView';
import { Subcontractor } from '@/types/subcontractor';
import { SubcontractorForm } from '@/components/SubcontractorForm';
import { SubcontractorFormData } from '@/types/subcontractor';

const queryClient = new QueryClient();

const App = () => {
  const [currentPage, setCurrentPage] = useState('subcontracts');
  const [showStepper, setShowStepper] = useState(false);
  const [showSubcontractorForm, setShowSubcontractorForm] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);
  const [selectedSubcontractorId, setSelectedSubcontractorId] = useState<string | null>(null);
  const [editingSubcontractor, setEditingSubcontractor] = useState<Subcontractor | null>(null);

  const handleSaveSubcontract = (data: any) => {
    console.log('Saving subcontract:', data);
    // Here you would typically save to your backend
  };

  const handleSaveSubcontractor = (data: SubcontractorFormData) => {
    console.log('Saving subcontractor:', data);
    if (editingSubcontractor) {
      console.log('Updating existing subcontractor:', editingSubcontractor.id);
    } else {
      console.log('Creating new subcontractor');
    }
    // Here you would typically save to your backend
    setShowSubcontractorForm(false);
    setEditingSubcontractor(null);
  };

  const handleViewDetail = (contractId: string) => {
    setSelectedContractId(contractId);
    setCurrentPage('subcontract-detail');
  };

  const handleBackToList = () => {
    setSelectedContractId(null);
    setCurrentPage('subcontracts');
  };

  const handleViewSubcontractorDetail = (subcontractorId: string) => {
    setSelectedSubcontractorId(subcontractorId);
    setCurrentPage('subcontractor-detail');
  };

  const handleEditSubcontractor = (subcontractor: Subcontractor) => {
    setEditingSubcontractor(subcontractor);
    setShowSubcontractorForm(true);
  };

  const handleCreateNewSubcontractor = () => {
    setEditingSubcontractor(null);
    setShowSubcontractorForm(true);
  };

  const handleDeleteSubcontractor = (subcontractorId: string) => {
    console.log('Deleting subcontractor:', subcontractorId);
    // Here you would typically delete from your backend
  };

  const handleBackToSubcontractorsList = () => {
    setSelectedSubcontractorId(null);
    setEditingSubcontractor(null);
    setShowSubcontractorForm(false);
    setCurrentPage('subcontractors');
  };

  const renderPage = () => {
    if (showSubcontractorForm) {
      return (
        <SubcontractorForm
          subcontractor={editingSubcontractor}
          onSubmit={handleSaveSubcontractor}
          onCancel={() => {
            setShowSubcontractorForm(false);
            setEditingSubcontractor(null);
          }}
        />
      );
    }

    switch (currentPage) {
      case 'subcontracts':
        return (
          <SubcontractTable 
            onCreateNew={() => setShowStepper(true)}
            onViewDetail={handleViewDetail}
          />
        );
      case 'subcontractors':
        return (
          <SubcontractorsTable 
            onCreateNew={handleCreateNewSubcontractor}
            onViewDetail={handleViewSubcontractorDetail}
            onEdit={handleEditSubcontractor}
            onDelete={handleDeleteSubcontractor}
          />
        );
      case 'subcontractor-detail':
        return selectedSubcontractorId ? (
          <SubcontractorDetailView
            subcontractorId={selectedSubcontractorId}
            onBack={handleBackToSubcontractorsList}
            onEdit={handleEditSubcontractor}
          />
        ) : (
          <div className="space-y-4">
            <Button onClick={handleBackToSubcontractorsList}>← Back to Subcontractors</Button>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-2">Subcontractor Not Found</h2>
              <p className="text-muted-foreground">The requested subcontractor could not be found.</p>
            </div>
          </div>
        );
      case 'subcontract-detail':
        return (
          <div className="space-y-4">
            <Button onClick={handleBackToList}>← Back to Subcontracts</Button>
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-2">Subcontract Detail</h2>
              <p className="text-muted-foreground">ID: {selectedContractId}</p>
              <p className="text-muted-foreground">Detailed view coming soon...</p>
            </div>
          </div>
        );
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
