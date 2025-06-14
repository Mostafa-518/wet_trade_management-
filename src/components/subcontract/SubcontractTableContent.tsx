
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
  getSubcontractorName,
  onToggleAll,
  onToggleOne,
  onViewDetail,
  onEdit,
  onDelete,
  onBulkDelete
}: SubcontractTableContentProps) {
  const getStatusBadge = (status: string) => {
    if (status === 'overbudget') {
      return <Badge variant="destructive">Over Budget</Badge>;
    }
    if (status === 'completed') {
      return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
    }
    if (status === 'active') {
      return <Badge className="bg-blue-100 text-blue-800">Active</Badge>;
    }
    if (status === 'pending') {
      return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
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
            <TableHead>Project</TableHead>
            <TableHead>Subcontractor</TableHead>
            <TableHead>Items Count</TableHead>
            <TableHead className="text-right">Total Value</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8">
                <div className="text-muted-foreground">
                  {searchTerm || showAdvancedSearch ? 'No subcontracts found matching your search.' : 'No subcontracts found.'}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredData.map((contract) => (
              <TableRow 
                key={contract.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onViewDetail(contract.contractId)}
              >
                <TableCell onClick={e => e.stopPropagation()}>
                  <TableSelectionCheckbox
                    checked={selectedIds.has(contract.id)}
                    onCheckedChange={() => onToggleOne(contract.id)}
                    ariaLabel={`Select contract ${contract.contractId}`}
                  />
                </TableCell>
                <TableCell className="font-medium text-blue-600">{contract.contractId}</TableCell>
                <TableCell>{getProjectName(contract.project)}</TableCell>
                <TableCell>{getSubcontractorName(contract.subcontractor)}</TableCell>
                <TableCell>{contract.tradeItems.length}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(contract.totalValue)}</TableCell>
                <TableCell>{getStatusBadge(contract.status)}</TableCell>
                <TableCell>{new Date(contract.createdAt).toLocaleDateString()}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <SubcontractTableActions
                    contractId={contract.contractId}
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
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
