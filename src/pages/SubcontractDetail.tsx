
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SubcontractDetailView } from '@/components/SubcontractDetailView';

export function SubcontractDetail() {
  const { contractId } = useParams<{ contractId: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/subcontracts');
  };

  const handleEdit = () => {
    console.log('Edit subcontract:', contractId);
  };

  if (!contractId) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Contract Not Found</h2>
        <p className="text-muted-foreground">The requested contract could not be found.</p>
      </div>
    );
  }

  return (
    <SubcontractDetailView
      contractId={contractId}
      onBack={handleBack}
      onEdit={handleEdit}
    />
  );
}
