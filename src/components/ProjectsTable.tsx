
import React from 'react';
import { Project } from '@/types/project';
import { ImportPreviewDialog } from './ImportPreviewDialog';
import { ProjectsTableHeader } from './projects/ProjectsTableHeader';
import { ProjectsTableFilters } from './projects/ProjectsTableFilters';
import { ProjectsTableActions } from './projects/ProjectsTableActions';
import { ProjectsTableContent } from './projects/ProjectsTableContent';
import { useProjectsTable } from '@/hooks/useProjectsTable';

interface ProjectsTableProps {
  onCreateNew?: () => void;
  onViewDetail: (projectId: string) => void;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
}

export function ProjectsTable({ onCreateNew, onViewDetail, onEdit, onDelete }: ProjectsTableProps) {
  const {
    searchFilters,
    selectedIds,
    importedData,
    fileInputRef,
    filteredProjects,
    allSelected,
    handleFilterChange,
    clearFilters,
    handleImportClick,
    toggleAll,
    toggleOne,
    handleBulkDelete,
    handleFileChange,
    handleImport,
    setImportedData,
  } = useProjectsTable();

  const previewColumns = [
    { key: "name", label: "Name" },
    { key: "code", label: "Code" },
    { key: "location", label: "Location" },
  ];

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls"
        className="hidden"
        onChange={handleFileChange}
        data-testid="import-excel-input"
      />
      
      {!!importedData && importedData.length > 0 && (
        <ImportPreviewDialog
          open={!!importedData}
          data={importedData}
          columns={previewColumns}
          onImport={handleImport}
          onClose={() => setImportedData(null)}
        />
      )}

      <ProjectsTableHeader 
        onCreateNew={onCreateNew}
        onImportClick={handleImportClick}
      />

      <ProjectsTableFilters
        searchFilters={searchFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />

      <ProjectsTableActions
        selectedCount={selectedIds.size}
        onBulkDelete={handleBulkDelete}
      />

      <ProjectsTableContent
        filteredProjects={filteredProjects}
        selectedIds={selectedIds}
        allSelected={allSelected}
        onToggleAll={toggleAll}
        onToggleOne={toggleOne}
        onViewDetail={onViewDetail}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}
