
import React from 'react';
import { ImportPreviewDialog } from './ImportPreviewDialog';
import { SubcontractorsTableHeader } from './subcontractors/SubcontractorsTableHeader';
import { SubcontractorsTableSearch } from './subcontractors/SubcontractorsTableSearch';
import { SubcontractorsTableActions } from './subcontractors/SubcontractorsTableActions';
import { SubcontractorsTableContent } from './subcontractors/SubcontractorsTableContent';
import { useSubcontractorsTable } from '@/hooks/useSubcontractorsTable';
import { useSubcontractorsImport } from '@/hooks/useSubcontractorsImport';

export function SubcontractorsTable({ onCreateNew, onViewDetail, onEdit, onDelete }) {
  const {
    searchTerm,
    setSearchTerm,
    searchBy,
    setSearchBy,
    selectedIds,
    filteredSubcontractors,
    allSelected,
    toggleAll,
    toggleOne,
    handleBulkDelete
  } = useSubcontractorsTable();

  const {
    showImportDialog,
    setShowImportDialog,
    importData,
    setImportData,
    handleFileUpload,
    handleImport,
    downloadTemplate
  } = useSubcontractorsImport();

  return (
    <div className="space-y-4">
      <SubcontractorsTableHeader
        onCreateNew={onCreateNew}
        onFileUpload={handleFileUpload}
        onDownloadTemplate={downloadTemplate}
      />

      <SubcontractorsTableSearch
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchBy={searchBy}
        setSearchBy={setSearchBy}
      />

      <SubcontractorsTableActions
        selectedCount={selectedIds.size}
        onBulkDelete={handleBulkDelete}
      />

      <SubcontractorsTableContent
        filteredSubcontractors={filteredSubcontractors}
        selectedIds={selectedIds}
        allSelected={allSelected}
        onToggleAll={toggleAll}
        onToggleOne={toggleOne}
        onViewDetail={onViewDetail}
        onEdit={onEdit}
        onDelete={onDelete}
        searchTerm={searchTerm}
      />

      <ImportPreviewDialog
        open={showImportDialog}
        onClose={() => {
          setShowImportDialog(false);
          setImportData([]);
        }}
        data={importData}
        columns={[
          { key: 'name', label: 'Business Name' },
          { key: 'companyName', label: 'Company Name' },
          { key: 'representativeName', label: 'Representative Name' },
          { key: 'commercialRegistration', label: 'Commercial Registration' },
          { key: 'taxCardNo', label: 'Tax Card No.' },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Phone' },
          { key: 'address', label: 'Address' },
          { key: 'rating', label: 'Rating (0-5)' }
        ]}
        onImport={handleImport}
      />
    </div>
  );
}
