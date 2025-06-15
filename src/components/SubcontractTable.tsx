
import React from 'react';
import { SubcontractEditModal } from './subcontract/SubcontractEditModal';
import { SubcontractTableHeader } from './subcontract/SubcontractTableHeader';
import { SubcontractTableSearch } from './subcontract/SubcontractTableSearch';
import { SubcontractTableContent } from './subcontract/SubcontractTableContent';
import { SubcontractTableSummary } from './subcontract/SubcontractTableSummary';
import { useSubcontractTableLogic } from '@/hooks/useSubcontractTableLogic';

interface SubcontractTableProps {
  onCreateNew?: () => void;
  onViewDetail: (contractId: string) => void;
}

export function SubcontractTable({ onCreateNew, onViewDetail }: SubcontractTableProps) {
  const {
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
  } = useSubcontractTableLogic();

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
        subcontracts={subcontracts}
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
