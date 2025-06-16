
import React from 'react';
import { SubcontractEditModal } from './subcontract/SubcontractEditModal';
import { SubcontractTableHeader } from './subcontract/SubcontractTableHeader';
import { SubcontractTableSearch } from './subcontract/SubcontractTableSearch';
import { SubcontractTableContent } from './subcontract/SubcontractTableContent';
import { SubcontractTableSummary } from './subcontract/SubcontractTableSummary';
import { ImportPreviewDialog } from '@/components/ImportPreviewDialog';
import { useSubcontractTableLogic } from '@/hooks/useSubcontractTableLogic';
import { useSubcontractsImport } from '@/hooks/useSubcontractsImport';

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

  const {
    isImporting,
    importData,
    showPreview,
    setShowPreview,
    handleFileUpload,
    processImport,
    downloadTemplate
  } = useSubcontractsImport();

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
      <SubcontractTableHeader 
        onCreateNew={onCreateNew}
        onFileUpload={handleFileUpload}
        onDownloadTemplate={downloadTemplate}
      />

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

      <ImportPreviewDialog
        open={showPreview}
        onClose={() => setShowPreview(false)}
        data={importData}
        columns={[
          { key: 'Date of Issuing', label: 'Date of Issuing' },
          { key: 'Project Name', label: 'Project Name' },
          { key: 'Subcontractor Company', label: 'Subcontractor Company' },
          { key: 'Type of contract', label: 'Type of Contract' },
          { key: 'Trades', label: 'Trades' },
          { key: 'Items', label: 'Items' },
          { key: 'QTY', label: 'Quantity' },
          { key: 'Rate', label: 'Rate' },
          { key: 'wastage', label: 'Wastage %' },
          { key: 'Responsibilities', label: 'Responsibilities' }
        ]}
        onImport={processImport}
      />

      {isImporting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span>Processing import...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
