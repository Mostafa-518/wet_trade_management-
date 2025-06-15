
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubcontractTable } from '@/components/SubcontractTable';
import { SubcontractStepper } from '@/components/SubcontractStepper';
import { useSubcontracts } from '@/hooks/useSubcontracts';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useData } from '@/contexts/DataContext';

export function Subcontracts() {
  const navigate = useNavigate();
  const [showStepper, setShowStepper] = useState(false);
  const { trades, tradeItems, responsibilities } = useData();
  const { addSubcontract, isLoading } = useSubcontracts(trades, tradeItems, responsibilities);
  const { toast } = useToast();
  const { profile } = useAuth();
  const canModify = profile?.role !== 'viewer';
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleCreateNew = () => {
    if (!canModify) return;
    setShowStepper(true);
  };

  const handleViewDetail = (contractId: string) => {
    navigate(`/subcontracts/${contractId}`);
  };

  // Updated: await addSubcontract and manually refresh after saving
  const handleSaveSubcontract = async (data: any) => {
    setSaveError(null);
    try {
      await addSubcontract(data);
      setShowStepper(false);
      toast({ title: "Success", description: "Subcontract saved! It will now appear in the list." });
    } catch (error: any) {
      setSaveError(error instanceof Error ? error.message : 'Unknown error');
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
    <div>
      {saveError && (
        <div className="py-2 px-4 bg-red-100 text-red-800 rounded relative mb-3">
          <span className="font-semibold">Error:</span> {saveError}
        </div>
      )}
      <SubcontractTable 
        onCreateNew={canModify ? handleCreateNew : undefined}
        onViewDetail={handleViewDetail}
      />
    </div>
  );
}
