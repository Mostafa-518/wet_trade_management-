
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
  reportFilters?: any;
  expectedCount?: number | null;
}

export function SubcontractTable({ onCreateNew, onViewDetail, reportFilters, expectedCount }: SubcontractTableProps) {
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
    isFiltered,
  } = useSubcontractTableLogic(reportFilters);

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

  // Show warning if filtered results don't match expected count
  const showCountMismatch = expectedCount && filteredData.length !== expectedCount && isFiltered;

  return (
    <div className="space-y-4">
      <SubcontractTableHeader 
        onCreateNew={onCreateNew}
        onFileUpload={handleFileUpload}
        onDownloadTemplate={downloadTemplate}
        isFiltered={isFiltered}
      />

      {showCountMismatch && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-900">Count Mismatch Warning</h4>
          <p className="text-sm text-yellow-700">
            Expected {expectedCount} subcontract(s) from report, but found {filteredData.length}.
            This might indicate a filtering issue or data inconsistency.
          </p>
        </div>
      )}

      {isFiltered && filteredData.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No subcontracts found</h3>
          <p className="text-gray-600 mb-4">
            No subcontracts found for this report segment.
          </p>
          <p className="text-sm text-gray-500">
            Try adjusting the filters or check if the data matches the report criteria.
          </p>
        </div>
      )}

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
        onCreateNew={onCreateNew}
        isFiltered={isFiltered}
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
