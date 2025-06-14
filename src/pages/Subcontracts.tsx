
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubcontractTable } from '@/components/SubcontractTable';
import { SubcontractStepper } from '@/components/SubcontractStepper';
import { useSubcontracts } from '@/hooks/useSubcontracts';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export function Subcontracts() {
  const navigate = useNavigate();
  const [showStepper, setShowStepper] = useState(false);
  const { addSubcontract } = useSubcontracts();
  const { toast } = useToast();
  const { profile } = useAuth();
  const canModify = profile?.role !== 'viewer';

  const handleCreateNew = () => {
    if (!canModify) return;
    setShowStepper(true);
  };

  const handleViewDetail = (contractId: string) => {
    navigate(`/subcontracts/${contractId}`);
  };

  const handleSaveSubcontract = async (data: any) => {
    try {
      await addSubcontract(data);
      setShowStepper(false);
    } catch (error) {
      // Error handling is already done in the hook
    }
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
      onCreateNew={canModify ? handleCreateNew : undefined}
      onViewDetail={handleViewDetail}
    />
  );
}
