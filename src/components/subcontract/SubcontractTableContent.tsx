
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SubcontractTableHeaderRow } from './SubcontractTableHeaderRow';
import { SubcontractTableRow } from './SubcontractTableRow';
import { SubcontractTableEmpty } from './SubcontractTableEmpty';
import { Subcontract } from '@/types/subcontract';
import { usePagination } from '@/hooks/usePagination';
import { PaginationControls } from '@/components/PaginationControls';

interface SubcontractTableContentProps {
  filteredData: Subcontract[];
  selectedIds: Set<string>;
  searchTerm: string;
  showAdvancedSearch: boolean;
  allSelected: boolean;
  getProjectName: (projectId: string) => string;
  getProjectCode: (projectId: string) => string;
  getSubcontractorName: (subcontractorId: string) => string;
  onToggleAll: () => void;
  onToggleOne: (id: string) => void;
  onViewDetail: (contractId: string) => void;
  onEdit: (subcontract: Subcontract) => void;
  onDelete: (id: string) => Promise<void>;
  onBulkDelete: () => Promise<void>;
  onCreateNew?: () => void;
  isFiltered?: boolean;
}

export function SubcontractTableContent({ 
  filteredData,
  selectedIds,
  searchTerm,
  showAdvancedSearch,
  allSelected,
  getProjectName,
  getSubcontractorName,
  onToggleAll,
  onToggleOne,
  onViewDetail,
  onEdit,
  onDelete,
  onBulkDelete,
  onCreateNew,
  isFiltered = false
}: SubcontractTableContentProps) {
  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    hasNextPage,
    hasPreviousPage,
    totalItems,
    itemsPerPage,
  } = usePagination({ data: filteredData, itemsPerPage: 10 });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Subcontracts ({filteredData.length})
          {isFiltered && (
            <span className="text-sm font-normal text-blue-600 ml-2">
              (Filtered from report)
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedIds.size > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <span className="font-medium">{selectedIds.size} selected</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={onBulkDelete}
              className="ml-2"
            >
              Delete Selected
            </Button>
          </div>
        )}
        
        <div className="border rounded-lg overflow-auto">
          <Table>
            <SubcontractTableHeaderRow 
              allSelected={allSelected}
              onToggleAll={onToggleAll}
            />
            <TableBody>
              {paginatedData.length === 0 ? (
                <SubcontractTableEmpty 
                  searchTerm={searchTerm}
                  showAdvancedSearch={showAdvancedSearch}
                  onCreateNew={onCreateNew}
                  isFiltered={isFiltered}
                />
              ) : (
                paginatedData.map((contract) => (
                  <SubcontractTableRow
                    key={contract.id}
                    contract={contract}
                    isSelected={selectedIds.has(contract.id)}
                    getProjectName={getProjectName}
                    getSubcontractorName={getSubcontractorName}
                    onToggleOne={onToggleOne}
                    onViewDetail={onViewDetail}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
        />
      </CardContent>
    </Card>
  );
}
