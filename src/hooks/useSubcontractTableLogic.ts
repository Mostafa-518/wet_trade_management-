
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
    if (!reportFilters) return subcontracts;
    
    return subcontracts.filter(subcontract => {
      // Month filter
      if (reportFilters.month) {
        const monthIndex = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'].indexOf(reportFilters.month);
        if (monthIndex !== -1 && subcontract.dateOfIssuing) {
          const subcontractMonth = new Date(subcontract.dateOfIssuing).getMonth();
          if (subcontractMonth !== monthIndex) return false;
        }
      }

      // Year filter
      if (reportFilters.year) {
        if (subcontract.dateOfIssuing) {
          const subcontractYear = new Date(subcontract.dateOfIssuing).getFullYear().toString();
          if (subcontractYear !== reportFilters.year) return false;
        }
      }

      // Location filter
      if (reportFilters.location) {
        const projectName = getProjectName(subcontract.project);
        // This is a simplified check - you might need to adjust based on your project structure
        if (!projectName.toLowerCase().includes(reportFilters.location.toLowerCase())) return false;
      }

      // Trade filter
      if (reportFilters.trades) {
        const hasMatchingTrade = subcontract.tradeItems?.some(
          item => item.trade && item.trade.toLowerCase().includes(reportFilters.trades.toLowerCase())
        );
        if (!hasMatchingTrade) return false;
      }

      // Project name filter
      if (reportFilters.projectName) {
        const projectName = getProjectName(subcontract.project);
        if (projectName !== reportFilters.projectName) return false;
      }

      // Project code filter
      if (reportFilters.projectCode) {
        const projectCode = getProjectCode(subcontract.project);
        if (projectCode !== reportFilters.projectCode) return false;
      }

      // Facilities filter
      if (reportFilters.facilities && reportFilters.facilities.length > 0) {
        const hasMatchingFacility = reportFilters.facilities.some((selectedFacility: string) => 
          subcontract.responsibilities?.includes(selectedFacility)
        );
        if (!hasMatchingFacility) return false;
      }

      return true;
    });
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
