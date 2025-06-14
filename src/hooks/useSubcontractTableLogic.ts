
import { useState, useEffect } from 'react';
import { useSubcontracts } from '@/hooks/useSubcontracts';
import { useData } from '@/contexts/DataContext';

interface SearchCondition {
  field: string;
  value: string;
}

export function useSubcontractTableLogic() {
  const { projects, subcontractors, trades, tradeItems, responsibilities } = useData();
  const { subcontracts, updateSubcontract, deleteSubcontract, deleteManySubcontracts, isLoading } = useSubcontracts(trades, tradeItems, responsibilities);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(subcontracts);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [editingSubcontract, setEditingSubcontract] = useState<any>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Update filtered data when subcontracts change
  useEffect(() => {
    setFilteredData(subcontracts);
  }, [subcontracts]);

  // Helper functions to resolve names from IDs
  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : projectId;
  };

  const getProjectCode = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.code : '';
  };

  const getSubcontractorName = (subcontractorId: string) => {
    const subcontractor = subcontractors.find(s => s.id === subcontractorId);
    return subcontractor ? subcontractor.name : subcontractorId;
  };

  const handleSimpleSearch = (value: string) => {
    setSearchTerm(value);
    
    if (!value.trim()) {
      setFilteredData(subcontracts);
      return;
    }

    const searchLower = value.toLowerCase();
    const filtered = subcontracts.filter(item => {
      const projectName = getProjectName(item.project);
      const projectCode = getProjectCode(item.project);
      const subcontractorName = getSubcontractorName(item.subcontractor);
      
      // Check basic fields
      const basicFieldsMatch = 
        item.contractId.toLowerCase().includes(searchLower) ||
        projectName.toLowerCase().includes(searchLower) ||
        projectCode.toLowerCase().includes(searchLower) ||
        subcontractorName.toLowerCase().includes(searchLower);

      // Check trade items
      const tradeItemsMatch = item.tradeItems && item.tradeItems.length > 0 && 
        item.tradeItems.some(tradeItem => 
          (tradeItem.trade && tradeItem.trade.toLowerCase().includes(searchLower)) ||
          (tradeItem.item && tradeItem.item.toLowerCase().includes(searchLower))
        );

      // Check responsibilities
      const responsibilitiesMatch = item.responsibilities && item.responsibilities.length > 0 &&
        item.responsibilities.some(resp => 
          resp && resp.toLowerCase().includes(searchLower)
        );

      return basicFieldsMatch || tradeItemsMatch || responsibilitiesMatch;
    });
    
    setFilteredData(filtered);
  };

  const handleAdvancedSearch = (conditions: SearchCondition[]) => {
    if (conditions.length === 0) {
      setFilteredData(subcontracts);
      return;
    }

    const filtered = subcontracts.filter(item => {
      const projectName = getProjectName(item.project);
      const projectCode = getProjectCode(item.project);
      const subcontractorName = getSubcontractorName(item.subcontractor);
      
      return conditions.every(condition => {
        const conditionLower = condition.value.toLowerCase();
        
        switch (condition.field) {
          case 'contractId':
            return item.contractId.toLowerCase().includes(conditionLower);
          case 'project':
            return projectName.toLowerCase().includes(conditionLower);
          case 'projectCode':
            return projectCode.toLowerCase().includes(conditionLower);
          case 'subcontractor':
            return subcontractorName.toLowerCase().includes(conditionLower);
          case 'trade':
            return item.tradeItems && item.tradeItems.length > 0 && 
              item.tradeItems.some(tradeItem => 
                tradeItem.trade && tradeItem.trade.toLowerCase().includes(conditionLower)
              );
          case 'item':
            return item.tradeItems && item.tradeItems.length > 0 && 
              item.tradeItems.some(tradeItem => 
                tradeItem.item && tradeItem.item.toLowerCase().includes(conditionLower)
              );
          case 'responsibilities':
            return item.responsibilities && item.responsibilities.length > 0 &&
              item.responsibilities.some(resp => 
                resp && resp.toLowerCase().includes(conditionLower)
              );
          case 'status':
            return item.status.toLowerCase().includes(conditionLower);
          default:
            return false;
        }
      });
    });
    setFilteredData(filtered);
  };

  const handleEdit = (subcontract: any) => {
    setEditingSubcontract(subcontract);
  };

  const handleSaveEdit = async (id: string, data: any) => {
    await updateSubcontract(id, data);
    setEditingSubcontract(null);
  };

  // Select all toggle
  const allSelected = filteredData.length > 0 && filteredData.every(p => selectedIds.has(p.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredData.map(p => p.id)));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleBulkDelete = async () => {
    try {
      await deleteManySubcontracts(Array.from(selectedIds));
      setSelectedIds(new Set());
    } catch (error) {
      // errors are already handled via toast
    }
  };

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
