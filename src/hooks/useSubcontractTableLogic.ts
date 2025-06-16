
import { useSubcontracts } from '@/hooks/useSubcontracts';
import { useData } from '@/contexts/DataContext';
import { useSubcontractHelpers } from './subcontract/useSubcontractHelpers';
import { useSubcontractSearch } from './subcontract/useSubcontractSearch';
import { useSubcontractSelection } from './subcontract/useSubcontractSelection';
import { useSubcontractEditing } from './subcontract/useSubcontractEditing';

export function useSubcontractTableLogic() {
  const { trades, tradeItems, responsibilities, projects } = useData();
  const { subcontracts, updateSubcontract, deleteSubcontract, deleteManySubcontracts, isLoading } = useSubcontracts(trades, tradeItems, responsibilities, projects);
  
  const { getProjectName, getProjectCode, getSubcontractorName } = useSubcontractHelpers();
  
  const {
    searchTerm,
    filteredData,
    handleSimpleSearch,
    handleAdvancedSearch,
  } = useSubcontractSearch(subcontracts);

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
    subcontracts,
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
