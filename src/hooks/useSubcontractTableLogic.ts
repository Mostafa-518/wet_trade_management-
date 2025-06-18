
import { useData } from '@/contexts/DataContext';
import { useSubcontractHelpers } from './subcontract/useSubcontractHelpers';
import { useSubcontractSearch } from './subcontract/useSubcontractSearch';
import { useSubcontractSelection } from './subcontract/useSubcontractSelection';
import { useSubcontractEditing } from './subcontract/useSubcontractEditing';
import { useMemo } from 'react';

export function useSubcontractTableLogic(reportFilters?: any) {
  const { subcontracts, updateSubcontract, deleteSubcontract, deleteManySubcontracts, isLoading } = useData();
  
  const { getProjectName, getProjectCode, getSubcontractorName } = useSubcontractHelpers();
  
  // Apply report filters if provided
  const preFilteredSubcontracts = useMemo(() => {
    console.log('useSubcontractTableLogic - Starting filter process');
    console.log('Report filters received:', reportFilters);
    console.log('Total subcontracts:', subcontracts.length);
    
    if (!reportFilters) {
      console.log('No report filters, returning all subcontracts');
      return subcontracts;
    }
    
    const filtered = subcontracts.filter(subcontract => {
      console.log(`\n--- Processing Subcontract ${subcontract.contractId} ---`);
      
      // Month filter
      if (reportFilters.month && reportFilters.month !== 'all' && reportFilters.month !== 'All') {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        const monthIndex = monthNames.findIndex(m => m.toLowerCase() === reportFilters.month.toLowerCase());
        
        if (monthIndex !== -1 && subcontract.dateOfIssuing) {
          const subcontractMonth = new Date(subcontract.dateOfIssuing).getMonth();
          if (subcontractMonth !== monthIndex) {
            console.log(`❌ Month filter failed: expected ${reportFilters.month} (${monthIndex}), got month ${subcontractMonth}`);
            return false;
          }
          console.log(`✅ Month filter passed: ${reportFilters.month}`);
        }
      }

      // Year filter
      if (reportFilters.year && reportFilters.year !== 'all' && reportFilters.year !== 'All') {
        if (subcontract.dateOfIssuing) {
          const subcontractYear = new Date(subcontract.dateOfIssuing).getFullYear().toString();
          if (subcontractYear !== reportFilters.year) {
            console.log(`❌ Year filter failed: expected ${reportFilters.year}, got ${subcontractYear}`);
            return false;
          }
          console.log(`✅ Year filter passed: ${reportFilters.year}`);
        }
      }

      // Location filter
      if (reportFilters.location && reportFilters.location !== 'all' && reportFilters.location !== 'All') {
        const projectName = getProjectName(subcontract.project);
        // This is a simplified check - you might need to adjust based on your project structure
        if (!projectName.toLowerCase().includes(reportFilters.location.toLowerCase())) {
          console.log(`❌ Location filter failed: project "${projectName}" doesn't contain "${reportFilters.location}"`);
          return false;
        }
        console.log(`✅ Location filter passed: ${reportFilters.location}`);
      }

      // Trade filter
      if (reportFilters.trades && reportFilters.trades !== 'all' && reportFilters.trades !== 'All') {
        const hasMatchingTrade = subcontract.tradeItems?.some(
          item => item.trade && item.trade.toLowerCase().includes(reportFilters.trades.toLowerCase())
        );
        if (!hasMatchingTrade) {
          console.log(`❌ Trade filter failed: no matching trade "${reportFilters.trades}"`);
          return false;
        }
        console.log(`✅ Trade filter passed: ${reportFilters.trades}`);
      }

      // Project name filter
      if (reportFilters.projectName && reportFilters.projectName !== 'all' && reportFilters.projectName !== 'All') {
        const projectName = getProjectName(subcontract.project);
        if (projectName !== reportFilters.projectName) {
          console.log(`❌ Project name filter failed: expected "${reportFilters.projectName}", got "${projectName}"`);
          return false;
        }
        console.log(`✅ Project name filter passed: ${reportFilters.projectName}`);
      }

      // Project code filter
      if (reportFilters.projectCode && reportFilters.projectCode !== 'all' && reportFilters.projectCode !== 'All') {
        const projectCode = getProjectCode(subcontract.project);
        if (projectCode !== reportFilters.projectCode) {
          console.log(`❌ Project code filter failed: expected "${reportFilters.projectCode}", got "${projectCode}"`);
          return false;
        }
        console.log(`✅ Project code filter passed: ${reportFilters.projectCode}`);
      }

      // Facilities filter - Modified to require ALL selected facilities to be present
      if (reportFilters.facilities && reportFilters.facilities.length > 0) {
        console.log(`🔍 Checking facilities filter. Selected facilities:`, reportFilters.facilities);
        console.log(`Subcontract responsibilities:`, subcontract.responsibilities);
        
        // Check if ALL selected facilities are present in the subcontract's responsibilities
        const allFacilitiesPresent = reportFilters.facilities.every((selectedFacility: string) => 
          subcontract.responsibilities?.includes(selectedFacility)
        );
        
        if (!allFacilitiesPresent) {
          console.log(`❌ Facilities filter failed: not all selected facilities are present in subcontract`);
          return false;
        }
        console.log(`✅ Facilities filter passed: all selected facilities are present`);
      }

      console.log(`✅ Subcontract ${subcontract.contractId} passed all filters`);
      return true;
    });

    console.log('\n=== FILTER RESULTS ===');
    console.log('Filtered subcontracts count:', filtered.length);
    console.log('Filtered subcontract IDs:', filtered.map(s => s.contractId));
    console.log('=== END FILTER PROCESS ===\n');
    
    return filtered;
  }, [subcontracts, reportFilters, getProjectName, getProjectCode]);
  
  const {
    searchTerm,
    filteredData,
    handleSimpleSearch,
    handleAdvancedSearch,
  } = useSubcontractSearch(preFilteredSubcontracts);

  const {
    selectedIds,
    allSelected,
    toggleAll,
    toggleOne,
    handleBulkDelete,
  } = useSubcontractSelection(filteredData, deleteManySubcontracts);

  const {
    editingSubcontract,
    showAdvancedSearch,
    handleEdit,
    handleSaveEdit,
    setEditingSubcontract,
    setShowAdvancedSearch,
  } = useSubcontractEditing(updateSubcontract);

  return {
    subcontracts: preFilteredSubcontracts,
    filteredData,
    searchTerm,
    showAdvancedSearch,
    editingSubcontract,
    selectedIds,
    allSelected,
    isLoading,
    getProjectName,
    getProjectCode,
    getSubcontractorName,
    handleSimpleSearch,
    handleAdvancedSearch,
    handleEdit,
    handleSaveEdit,
    toggleAll,
    toggleOne,
    handleBulkDelete,
    deleteSubcontract,
    setEditingSubcontract,
    setShowAdvancedSearch,
  };
}
