
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubcontractTable } from '@/components/SubcontractTable';
import { SubcontractStepper } from '@/components/SubcontractStepper';

export function Subcontracts() {
  const navigate = useNavigate();
  const [showStepper, setShowStepper] = useState(false);

  const handleCreateNew = () => {
    setShowStepper(true);
  };

  const handleViewDetail = (contractId: string) => {
    navigate(`/subcontracts/${contractId}`);
  };

  const handleSaveSubcontract = (data: any) => {
    console.log('Saving subcontract:', data);
    setShowStepper(false);
  };

  if (showStepper) {
    return (
      <SubcontractStepper
        onSave={handleSaveSubcontract}
        onClose={() => setShowStepper(false)}
      />
    );
  }

  return (
    <SubcontractTable 
      onCreateNew={handleCreateNew}
      onViewDetail={handleViewDetail}
    />
  );
}
