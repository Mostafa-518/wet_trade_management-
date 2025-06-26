
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SubcontractTable } from '@/components/SubcontractTable';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useSubcontracts } from '@/hooks/useSubcontracts';
import { usePersistentFormState } from '@/hooks/persistent-form';
import { FormResetButton } from '@/components/FormResetButton';

const initialFilters = {
  month: '',
  year: '',
  location: '',
  trades: '',
  projectName: '',
  projectCode: '',
  facilities: ''
};

export function FilteredSubcontracts() {
  const location = useLocation();
  const navigate = useNavigate();
  const { subcontracts = [], isLoading } = useSubcontracts();

  const {
    formValues: filters,
    handleChange,
    handleBatchChange,
    resetForm,
    hasPersistedData
  } = usePersistentFormState(initialFilters, {
    customKey: 'filtered-subcontracts',
    syncWithUrl: true,
    expirationHours: 24,
    debounceMs: 100
  });

  // Parse URL parameters on mount and update form state
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const urlFilters: Record<string, string> = {};
    
    urlParams.forEach((value, key) => {
      if (key in initialFilters && value) {
        urlFilters[key] = value;
      }
    });

    // Update form with URL parameters if they exist
    if (Object.keys(urlFilters).length > 0) {
      console.log('Loading filters from URL:', urlFilters);
      handleBatchChange(urlFilters);
    }
  }, [location.search, handleBatchChange]);

  // Filter subcontracts based on current filters
  const filteredSubcontracts = subcontracts.filter(subcontract => {
    if (filters.month && subcontract.dateOfIssuing) {
      const monthIndex = ['January', 'February', 'March', 'April', 'May', 'June',
                         'July', 'August', 'September', 'October', 'November', 'December']
                         .indexOf(filters.month);
      if (monthIndex !== -1) {
        const subcontractMonth = new Date(subcontract.dateOfIssuing).getMonth();
        if (subcontractMonth !== monthIndex) return false;
      }
    }

    if (filters.year && subcontract.dateOfIssuing) {
      const subcontractYear = new Date(subcontract.dateOfIssuing).getFullYear().toString();
      if (subcontractYear !== filters.year) return false;
    }

    if (filters.location && subcontract.project !== filters.location) {
      return false;
    }

    if (filters.projectName && subcontract.project !== filters.projectName) {
      return false;
    }

    if (filters.projectCode && subcontract.project !== filters.projectCode) {
      return false;
    }

    return true;
  });

  const handleGoBack = () => {
    navigate('/report');
  };

  const handleViewDetail = (contractId: string) => {
    navigate(`/subcontract/${contractId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
           <Button 
            variant="outline" 
            onClick={() => navigate('/report')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Report
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Filtered Subcontracts ({filteredSubcontracts.length})
          </h1>
        </div>
        <FormResetButton 
          onReset={resetForm}
          hasData={hasPersistedData()}
          variant="outline"
          size="sm"
        >
          Clear All Filters
        </FormResetButton>
      </div>

      {/* Show active filters */}
      {hasPersistedData() && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Active Filters:</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (value) {
                return (
                  <span key={key} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {key}: {value}
                  </span>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}

      <SubcontractTable
        onViewDetail={handleViewDetail}
        reportFilters={filteredSubcontracts}
      />
    </div>
  );
}
