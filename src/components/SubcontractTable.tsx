import React, { useState } from 'react';
import { SubcontractEditModal } from './subcontract/SubcontractEditModal';
import { SubcontractTableHeader } from './subcontract/SubcontractTableHeader';
import { SubcontractTableSearch } from './subcontract/SubcontractTableSearch';
import { SubcontractTableContent } from './subcontract/SubcontractTableContent';
import { SubcontractTableSummary } from './subcontract/SubcontractTableSummary';
import { useSubcontracts } from '@/hooks/useSubcontracts';
import { useData } from '@/contexts/DataContext';

interface SubcontractTableProps {
  onCreateNew?: () => void;
  onViewDetail: (contractId: string) => void;
}

interface SearchCondition {
  field: string;
  value: string;
}

export function SubcontractTable({ onCreateNew, onViewDetail }: SubcontractTableProps) {
  const { projects, subcontractors, trades, tradeItems } = useData();
  const { subcontracts, updateSubcontract, deleteSubcontract, deleteManySubcontracts, isLoading } = useSubcontracts(trades, tradeItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(subcontracts);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [editingSubcontract, setEditingSubcontract] = useState<any>(null);

  // Update filtered data when subcontracts change
  React.useEffect(() => {
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
    const filtered = subcontracts.filter(item => {
      const projectName = getProjectName(item.project);
      const projectCode = getProjectCode(item.project);
      const subcontractorName = getSubcontractorName(item.subcontractor);
      
      return item.contractId.toLowerCase().includes(value.toLowerCase()) ||
        projectName.toLowerCase().includes(value.toLowerCase()) ||
        projectCode.toLowerCase().includes(value.toLowerCase()) ||
        subcontractorName.toLowerCase().includes(value.toLowerCase()) ||
        item.tradeItems.some(tradeItem => 
          tradeItem.trade.toLowerCase().includes(value.toLowerCase()) ||
          tradeItem.item.toLowerCase().includes(value.toLowerCase())
        );
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
        switch (condition.field) {
          case 'contractId':
            return item.contractId.toLowerCase().includes(condition.value.toLowerCase());
          case 'project':
            return projectName.toLowerCase().includes(condition.value.toLowerCase());
          case 'projectCode':
            return projectCode.toLowerCase().includes(condition.value.toLowerCase());
          case 'subcontractor':
            return subcontractorName.toLowerCase().includes(condition.value.toLowerCase());
          case 'trade':
            return item.tradeItems.some(tradeItem => 
              tradeItem.trade.toLowerCase().includes(condition.value.toLowerCase())
            );
          case 'item':
            return item.tradeItems.some(tradeItem => 
              tradeItem.item.toLowerCase().includes(condition.value.toLowerCase())
            );
          case 'status':
            return item.status.toLowerCase().includes(condition.value.toLowerCase());
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

  // Bulk select state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subcontracts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SubcontractTableHeader onCreateNew={onCreateNew} />

      <SubcontractTableSearch
        searchTerm={searchTerm}
        onSimpleSearch={handleSimpleSearch}
        onAdvancedSearch={handleAdvancedSearch}
      />

      <SubcontractTableContent
        filteredData={filteredData}
        selectedIds={selectedIds}
        searchTerm={searchTerm}
        showAdvancedSearch={showAdvancedSearch}
        allSelected={allSelected}
        getProjectName={getProjectName}
        getProjectCode={getProjectCode}
        getSubcontractorName={getSubcontractorName}
        onToggleAll={toggleAll}
        onToggleOne={toggleOne}
        onViewDetail={onViewDetail}
        onEdit={handleEdit}
        onDelete={deleteSubcontract}
        onBulkDelete={handleBulkDelete}
      />

      <SubcontractTableSummary filteredData={filteredData} />

      {editingSubcontract && (
        <SubcontractEditModal
          subcontract={editingSubcontract}
          open={!!editingSubcontract}
          onClose={() => setEditingSubcontract(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
