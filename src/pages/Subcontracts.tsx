
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SubcontractTable } from '@/components/SubcontractTable';
import { SubcontractStepper } from '@/components/SubcontractStepper';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useData } from '@/contexts/DataContext';

export function Subcontracts() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showStepper, setShowStepper] = useState(false);
  const [reportFilters, setReportFilters] = useState<any>(null);
  const { addSubcontract } = useData();
  const { toast } = useToast();
  const { profile } = useAuth();
  const canModify = profile?.role !== 'viewer';

  useEffect(() => {
    // Parse URL parameters to extract filters from report page
    const searchParams = new URLSearchParams(location.search);
    const filters: any = {};
    
    if (searchParams.get('month')) {
      filters.month = searchParams.get('month');
    }
    if (searchParams.get('year')) {
      filters.year = searchParams.get('year');
    }
    if (searchParams.get('location')) {
      filters.location = searchParams.get('location');
    }
    if (searchParams.get('trades')) {
      filters.trades = searchParams.get('trades');
    }
    if (searchParams.get('projectName')) {
      filters.projectName = searchParams.get('projectName');
    }
    if (searchParams.get('projectCode')) {
      filters.projectCode = searchParams.get('projectCode');
    }
    if (searchParams.get('facilities')) {
      filters.facilities = searchParams.get('facilities')?.split(',') || [];
    }
    
    if (Object.keys(filters).length > 0) {
      setReportFilters(filters);
    }
  }, [location.search]);

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
      reportFilters={reportFilters}
    />
  );
}
