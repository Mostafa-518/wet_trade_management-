
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TableSelectionCheckbox } from '@/components/TableSelectionCheckbox';
import { SubcontractTableActions } from './SubcontractTableActions';
import { Subcontract } from '@/types/subcontract';

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
}

export function SubcontractTableContent({ 
  filteredData,
  selectedIds,
  searchTerm,
  showAdvancedSearch,
  allSelected,
  getProjectName,
  getProjectCode,
  getSubcontractorName,
  onToggleAll,
  onToggleOne,
  onViewDetail,
  onEdit,
  onDelete,
  onBulkDelete
}: SubcontractTableContentProps) {

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0
    }).format(amount ?? 0);
  };

  // Calculate total without wastage: QTY * Rate only
  const calculateTotalWithoutWastage = (quantity: number, unitPrice: number) => {
    return (quantity || 0) * (unitPrice || 0);
  };

  // Ensure responsibilities come as a comma separated string, safe against object/array forms
  const formatResponsibilities = (responsibilities: any) => {
    if (Array.isArray(responsibilities) && responsibilities.length > 0) {
      // If values are objects with name, extract; else print as string
      return responsibilities.map(r => {
        if (typeof r === 'string') return r;
        if (r && typeof r === 'object' && 'name' in r) return r.name;
        return '';
      }).filter(Boolean).join(', ');
    }
    return '-';
  };

  // Format date from string YYYY-MM-DD to "Month, YYYY"
  const formatDate = (isoDate: string | undefined) => {
    if (!isoDate) return '-';
    try {
      const date = new Date(isoDate);
      if (isNaN(date.getTime())) return isoDate;
      const month = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      return `${month}, ${year}`;
    } catch {
      return isoDate;
    }
  };

  return (
    <div className="border rounded-lg overflow-auto">
      {selectedIds.size > 0 && (
        <div className="p-2 bg-red-50 border-b flex items-center gap-2">
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <TableSelectionCheckbox 
                checked={allSelected} 
                onCheckedChange={onToggleAll} 
                ariaLabel="Select all subcontracts"
              />
            </TableHead>
            <TableHead>Contract ID</TableHead>
            <TableHead>Date of Issuing</TableHead>
            <TableHead>Project Name</TableHead>
            <TableHead>Subcontractor Company</TableHead>
            <TableHead>Trades</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>QTY</TableHead>
            <TableHead>Rate</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Responsibilities</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={12} className="text-center py-8">
                <div className="text-muted-foreground">
                  {searchTerm || showAdvancedSearch ? 'No subcontracts found matching your search.' : 'No subcontracts found.'}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            // For each subcontract, render a row for each trade item,
            // with shared cells (contract id, etc) only on the first row
            filteredData.map((contract) => (
              contract.tradeItems && contract.tradeItems.length > 0 ? (
                contract.tradeItems.map((item, idx) => (
                  <TableRow 
                    key={`${contract.id}-${item.id}`}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onViewDetail(contract.id)}
                  >
                    {idx === 0 && (
                      <>
                        <TableCell rowSpan={contract.tradeItems.length} onClick={e => e.stopPropagation()}>
                          <TableSelectionCheckbox
                            checked={selectedIds.has(contract.id)}
                            onCheckedChange={() => onToggleOne(contract.id)}
                            ariaLabel={`Select contract ${contract.contractId}`}
                          />
                        </TableCell>
                        <TableCell rowSpan={contract.tradeItems.length} className="font-medium text-blue-600">
                          {contract.contractId}
                        </TableCell>
                        <TableCell rowSpan={contract.tradeItems.length}>
                          {formatDate(contract.dateOfIssuing)}
                        </TableCell>
                        <TableCell rowSpan={contract.tradeItems.length}>
                          {getProjectName(contract.project)}
                        </TableCell>
                        <TableCell rowSpan={contract.tradeItems.length}>
                          {getSubcontractorName(contract.subcontractor)}
                        </TableCell>
                      </>
                    )}
                    {/* Trades, Items, QTY, Rate, Total (without wastage) */}
                    <TableCell>{item.trade || '-'}</TableCell>
                    <TableCell>{item.item || '-'}</TableCell>
                    <TableCell className="text-right">{item.quantity ?? '-'} {item.unit || ''}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.unitPrice ?? 0)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(calculateTotalWithoutWastage(item.quantity ?? 0, item.unitPrice ?? 0))}
                    </TableCell>
                    {idx === 0 && (
                      <>
                        <TableCell rowSpan={contract.tradeItems.length}>
                          {formatResponsibilities(contract.responsibilities)}
                        </TableCell>
                        <TableCell rowSpan={contract.tradeItems.length} onClick={(e) => e.stopPropagation()}>
                          <SubcontractTableActions
                            contractId={contract.id}
                            onView={onViewDetail}
                            onEdit={() => onEdit(contract)}
                            onDelete={async () => {
                              try {
                                await onDelete(contract.id);
                              } catch {
                                // toast already handled
                              }
                            }}
                          />
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow 
                  key={contract.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onViewDetail(contract.id)}
                >
                  <TableCell onClick={e => e.stopPropagation()}>
                    <TableSelectionCheckbox
                      checked={selectedIds.has(contract.id)}
                      onCheckedChange={() => onToggleOne(contract.id)}
                      ariaLabel={`Select contract ${contract.contractId}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-blue-600">{contract.contractId}</TableCell>
                  <TableCell>{formatDate(contract.dateOfIssuing)}</TableCell>
                  <TableCell>{getProjectName(contract.project)}</TableCell>
                  <TableCell>{getSubcontractorName(contract.subcontractor)}</TableCell>
                  <TableCell className="text-muted-foreground">-</TableCell>
                  <TableCell className="text-muted-foreground">-</TableCell>
                  <TableCell className="text-muted-foreground">-</TableCell>
                  <TableCell className="text-muted-foreground">-</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(contract.totalValue ?? 0)}</TableCell>
                  <TableCell>{formatResponsibilities(contract.responsibilities)}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <SubcontractTableActions
                      contractId={contract.id}
                      onView={onViewDetail}
                      onEdit={() => onEdit(contract)}
                      onDelete={async () => {
                        try {
                          await onDelete(contract.id);
                        } catch {
                          // toast already handled
                        }
                      }}
                    />
                  </TableCell>
                </TableRow>
              )
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
