import React, { useMemo, useCallback } from 'react';
import { TableErrorBoundary } from '@/components/TableErrorBoundary';
import { SubcontractTableSkeleton } from '@/components/ui/loading-skeletons';
import { ImportPreviewDialog } from '@/components/ImportPreviewDialog';
import { ImportLoader } from '@/components/ui/loading-spinner';
import { SubcontractTableHeader } from './SubcontractTableHeader';
import { SubcontractTableSummary } from './SubcontractTableSummary';
import { SubcontractTableSearch } from './SubcontractTableSearch';
import { SubcontractTableContent } from './SubcontractTableContent';
import { SubcontractEditModal } from './SubcontractEditModal';
import { useSubcontractTableLogic } from '../hooks/useSubcontractTableLogic';
import { useSubcontractsImport } from '../hooks/useSubcontractsImport';

interface SubcontractTableProps {
  onCreateNew?: () => void;
  onViewDetail: (contractId: string) => void;
  reportFilters?: any;
}

export function SubcontractTable({ 
  onCreateNew, 
  onViewDetail, 
  reportFilters 
}: SubcontractTableProps) {
  const {
    filteredData,
    searchTerm,
    showAdvancedSearch,
    selectedIds,
    editingSubcontract,
    isLoading,
    rawData,
    handleSimpleSearch,
    handleAdvancedSearch,
    handleToggleAll,
    handleToggleOne,
    handleEdit,
    handleSave,
    handleDelete,
    handleBulkDelete,
    setEditingSubcontract
  } = useSubcontractTableLogic(reportFilters);

  const {
    handleFileUpload,
    downloadTemplate,
    importData,
    showPreview,
    isImporting,
    processImport,
    setShowPreview
  } = useSubcontractsImport();

  const importColumns = useMemo(() => [
    { key: 'contractId', label: 'Contract ID' },
    { key: 'project', label: 'Project' },
    { key: 'subcontractor', label: 'Subcontractor' },
    { key: 'trade', label: 'Trade' },
    { key: 'item', label: 'Item' },
    { key: 'unit', label: 'Unit' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'unitPrice', label: 'Unit Price' },
    { key: 'total', label: 'Total' },
    { key: 'dateOfIssuing', label: 'Date of Issuing' }
  ], []);

  const handleCloseEdit = useCallback(() => {
    setEditingSubcontract(null);
  }, [setEditingSubcontract]);

  const handleClosePreview = useCallback(() => {
    setShowPreview(false);
  }, [setShowPreview]);

  if (isLoading) {
    return <SubcontractTableSkeleton />;
  }

  return (
    <TableErrorBoundary>
      <div className="space-y-6">
        <SubcontractTableHeader
          onCreateNew={onCreateNew}
          onFileUpload={handleFileUpload}
          onDownloadTemplate={downloadTemplate}
        />

        <SubcontractTableSummary filteredData={filteredData} />

        <SubcontractTableSearch
          searchTerm={searchTerm}
          onSimpleSearch={handleSimpleSearch}
          onAdvancedSearch={handleAdvancedSearch}
          subcontracts={rawData}
        />

        <SubcontractTableContent
          filteredData={filteredData}
          selectedIds={selectedIds}
          searchTerm={searchTerm}
          showAdvancedSearch={showAdvancedSearch}
          onToggleAll={handleToggleAll}
          onToggleOne={handleToggleOne}
          onViewDetail={onViewDetail}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBulkDelete={handleBulkDelete}
        />

        {editingSubcontract && (
          <SubcontractEditModal
            subcontract={editingSubcontract}
            open={!!editingSubcontract}
            onClose={handleCloseEdit}
            onSave={handleSave}
          />
        )}

        {showPreview && importData && (
          <ImportPreviewDialog
            title="Import Subcontracts Preview"
            data={importData}
            columns={importColumns}
            onConfirm={processImport}
            onCancel={handleClosePreview}
          />
        )}

        {isImporting && <ImportLoader />}
      </div>
    </TableErrorBoundary>
  );
}