
import { useData } from '@/contexts/DataContext';
import { useSubcontractHelpers } from './subcontract/useSubcontractHelpers';
import { useSubcontractSearch } from './subcontract/useSubcontractSearch';
import { useSubcontractSelection } from './subcontract/useSubcontractSelection';
import { useSubcontractEditing } from './subcontract/useSubcontractEditing';
import { useSubcontractFiltering } from './subcontract/useSubcontractFiltering';

export function useSubcontractTableLogic(reportFilters?: any) {
  const { subcontracts, updateSubcontract, deleteSubcontract, deleteManySubcontracts, isLoading } = useData();
  
  const { getProjectName, getProjectCode, getSubcontractorName } = useSubcontractHelpers();
  
  // Apply report filters if provided
  const preFilteredSubcontracts = useSubcontractFiltering(subcontracts, reportFilters);
  
  console.log('useSubcontractTableLogic - Report filters applied');
  console.log('Original subcontracts count:', subcontracts.length);
  console.log('After filtering count:', preFilteredSubcontracts.length);
  console.log('Report filters:', reportFilters);
  
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
    isFiltered: !!reportFilters, // Flag to indicate if we're in filtered mode
  };
}
