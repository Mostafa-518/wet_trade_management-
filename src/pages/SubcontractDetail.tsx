
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SubcontractDetailView } from '@/components/SubcontractDetailView';
import { useData } from '@/contexts/DataContext';

export function SubcontractDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { subcontracts } = useData();

  const handleBack = () => {
    navigate('/subcontracts');
  };

  const handleEdit = () => {
    console.log('Edit subcontract:', id);
  };

  if (!id) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Contract Not Found</h2>
        <p className="text-muted-foreground">The requested contract could not be found.</p>
      </div>
    );
  }

  const subcontract = subcontracts.find(s => s.contractId === id);

  if (!subcontract) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Contract Not Found</h2>
        <p className="text-muted-foreground">The requested contract could not be found.</p>
      </div>
    );
  }

  // Create a properly typed subcontract object for the detail view
  const subcontractForDetailView = {
    id: subcontract.contractId,
    contractId: subcontract.contractId,
    project: subcontract.project,
    subcontractor: subcontract.subcontractor,
    tradeItems: subcontract.tradeItems || [],
    responsibilities: subcontract.responsibilities || [],
    totalValue: subcontract.totalValue,
    status: subcontract.status,
    startDate: subcontract.startDate || new Date().toISOString().split('T')[0],
    endDate: subcontract.endDate || new Date().toISOString().split('T')[0],
    createdAt: subcontract.createdAt || new Date().toISOString(),
    updatedAt: subcontract.updatedAt || new Date().toISOString()
  };

  return (
    <SubcontractDetailView
      subcontract={subcontractForDetailView}
      onBack={handleBack}
      onEdit={handleEdit}
    />
  );
}
