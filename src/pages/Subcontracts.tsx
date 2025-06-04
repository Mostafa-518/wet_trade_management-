
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubcontractTable } from '@/components/SubcontractTable';
import { SubcontractStepper } from '@/components/SubcontractStepper';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';

export function Subcontracts() {
  const navigate = useNavigate();
  const [showStepper, setShowStepper] = useState(false);
  const { addSubcontract } = useData();
  const { toast } = useToast();

  const handleCreateNew = () => {
    setShowStepper(true);
  };

  const handleViewDetail = (contractId: string) => {
    navigate(`/subcontracts/${contractId}`);
  };

  const handleSaveSubcontract = (data: any) => {
    try {
      addSubcontract(data);
      toast({
        title: "Subcontract Created",
        description: "New subcontract has been saved successfully"
      });
      setShowStepper(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save subcontract",
        variant: "destructive"
      });
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
      onCreateNew={handleCreateNew}
      onViewDetail={handleViewDetail}
    />
  );
}
