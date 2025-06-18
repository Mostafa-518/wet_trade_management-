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
  const [expectedCount, setExpectedCount] = useState<number | null>(null);
  const { addSubcontract } = useData();
  const { toast } = useToast();
  const { profile } = useAuth();
  const canModify = profile?.role !== 'viewer';

  useEffect(() => {
    console.log('Subcontracts page - parsing URL parameters:', location.search);
    // Parse URL parameters to extract filters from report page
    const searchParams = new URLSearchParams(location.search);
    const filters: any = {};
    
    // Get expected count for validation
    if (searchParams.get('expectedCount')) {
      const count = parseInt(searchParams.get('expectedCount') || '0');
      setExpectedCount(count);
      filters.expectedCount = count;
      console.log('Found expected count:', count);
    }
    
    if (searchParams.get('month')) {
      filters.month = searchParams.get('month');
      console.log('Found month filter:', filters.month);
    }
    if (searchParams.get('year')) {
      filters.year = searchParams.get('year');
      console.log('Found year filter:', filters.year);
    }
    if (searchParams.get('location')) {
      filters.location = searchParams.get('location');
      console.log('Found location filter:', filters.location);
    }
    if (searchParams.get('trades')) {
      filters.trades = searchParams.get('trades');
      console.log('Found trades filter:', filters.trades);
    }
    if (searchParams.get('projectName')) {
      filters.projectName = searchParams.get('projectName');
      console.log('Found projectName filter:', filters.projectName);
    }
    if (searchParams.get('projectCode')) {
      filters.projectCode = searchParams.get('projectCode');
      console.log('Found projectCode filter:', filters.projectCode);
    }
    if (searchParams.get('subcontractorName')) {
      filters.subcontractorName = searchParams.get('subcontractorName');
      console.log('Found subcontractorName filter:', filters.subcontractorName);
    }
    if (searchParams.get('facilities')) {
      filters.facilities = searchParams.get('facilities')?.split(',') || [];
      console.log('Found facilities filter:', filters.facilities);
    }
    if (searchParams.get('presentData')) {
      filters.presentData = searchParams.get('presentData');
      console.log('Found presentData filter:', filters.presentData);
    }
    if (searchParams.get('projectFilterType')) {
      filters.projectFilterType = searchParams.get('projectFilterType');
      console.log('Found projectFilterType filter:', filters.projectFilterType);
    }
    
    console.log('Final parsed filters:', filters);
    
    if (Object.keys(filters).length > 0) {
      setReportFilters(filters);
      console.log('Setting report filters:', filters);
    } else {
      console.log('No filters found in URL');
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
    <div className="space-y-4">
      {reportFilters && expectedCount && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900">Report Filter Applied</h3>
          <p className="text-sm text-blue-700">
            Showing subcontracts filtered from report. Expected: {expectedCount} subcontract(s)
          </p>
          {reportFilters.projectName && (
            <p className="text-xs text-blue-600">Project: {reportFilters.projectName}</p>
          )}
          {reportFilters.subcontractorName && (
            <p className="text-xs text-blue-600">Subcontractor: {reportFilters.subcontractorName}</p>
          )}
        </div>
      )}
      
      <SubcontractTable 
        onCreateNew={canModify ? handleCreateNew : undefined}
        onViewDetail={handleViewDetail}
        reportFilters={reportFilters}
        expectedCount={expectedCount}
      />
    </div>
  );
}
