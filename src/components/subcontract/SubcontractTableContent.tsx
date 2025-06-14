
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

  const calculateBudget = (subcontract: Subcontract) => {
    // For now, assume budget is 10% more than total value
    // This can be replaced with actual budget data when available
    return subcontract.totalValue * 1.1;
  };

  const calculateVariance = (subcontract: Subcontract) => {
    const budget = calculateBudget(subcontract);
    return subcontract.totalValue - budget;
  };

  const getVarianceBadge = (variance: number) => {
    if (variance > 0) {
      return <Badge variant="destructive">Over Budget</Badge>;
    } else if (variance < 0) {
      return <Badge className="bg-green-100 text-green-800">Under Budget</Badge>;
    }
    return <Badge variant="outline">On Budget</Badge>;
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
            <TableHead>Trade</TableHead>
            <TableHead>Item</TableHead>
            <TableHead className="text-right">Qty</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Budget</TableHead>
            <TableHead className="text-right">Variance</TableHead>
            <TableHead>Responsibilities</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={14} className="text-center py-8">
                <div className="text-muted-foreground">
                  {searchTerm || showAdvancedSearch ? 'No subcontracts found matching your search.' : 'No subcontracts found.'}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredData.map((contract) => {
              const budget = calculateBudget(contract);
              const variance = calculateVariance(contract);
              
              return contract.tradeItems.length > 0 ? (
                // If there are trade items, show one row per trade item
                contract.tradeItems.map((item, index) => (
                  <TableRow 
                    key={`${contract.id}-${index}`}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => onViewDetail(contract.contractId)}
                  >
                    {index === 0 && (
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
                          <div>
                            <div className="font-medium">{getProjectName(contract.project)}</div>
                            <div className="text-sm text-muted-foreground">{getProjectCode(contract.project)}</div>
                          </div>
                        </TableCell>
                        <TableCell rowSpan={contract.tradeItems.length}>
                          {getSubcontractorName(contract.subcontractor)}
                        </TableCell>
                      </>
                    )}
                    <TableCell>{item.trade}</TableCell>
                    <TableCell>{item.item}</TableCell>
                    <TableCell className="text-right">{item.quantity} {item.unit}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(item.total)}</TableCell>
                    {index === 0 && (
                      <>
                        <TableCell rowSpan={contract.tradeItems.length} className="text-right font-medium">
                          {formatCurrency(budget)}
                        </TableCell>
                        <TableCell rowSpan={contract.tradeItems.length} className="text-right">
                          <div className="flex flex-col items-end gap-1">
                            <span className={variance > 0 ? 'text-red-600' : variance < 0 ? 'text-green-600' : 'text-gray-600'}>
                              {formatCurrency(Math.abs(variance))}
                            </span>
                            {getVarianceBadge(variance)}
                          </div>
                        </TableCell>
                        <TableCell rowSpan={contract.tradeItems.length}>
                          {contract.responsibilities.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {contract.responsibilities.slice(0, 2).map(resp => (
                                <Badge key={resp} variant="secondary" className="text-xs">
                                  {resp}
                                </Badge>
                              ))}
                              {contract.responsibilities.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{contract.responsibilities.length - 2}
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">None</span>
                          )}
                        </TableCell>
                        <TableCell rowSpan={contract.tradeItems.length}>
                          {getStatusBadge(contract.status)}
                        </TableCell>
                        <TableCell rowSpan={contract.tradeItems.length} onClick={(e) => e.stopPropagation()}>
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
                      </>
                    )}
                  </TableRow>
                ))
              ) : (
                // If no trade items, show a single row
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
                  <TableCell>
                    <div>
                      <div className="font-medium">{getProjectName(contract.project)}</div>
                      <div className="text-sm text-muted-foreground">{getProjectCode(contract.project)}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getSubcontractorName(contract.subcontractor)}</TableCell>
                  <TableCell className="text-muted-foreground">-</TableCell>
                  <TableCell className="text-muted-foreground">-</TableCell>
                  <TableCell className="text-muted-foreground">-</TableCell>
                  <TableCell className="text-muted-foreground">-</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(contract.totalValue)}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(budget)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end gap-1">
                      <span className={variance > 0 ? 'text-red-600' : variance < 0 ? 'text-green-600' : 'text-gray-600'}>
                        {formatCurrency(Math.abs(variance))}
                      </span>
                      {getVarianceBadge(variance)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {contract.responsibilities.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {contract.responsibilities.slice(0, 2).map(resp => (
                          <Badge key={resp} variant="secondary" className="text-xs">
                            {resp}
                          </Badge>
                        ))}
                        {contract.responsibilities.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{contract.responsibilities.length - 2}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">None</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(contract.status)}</TableCell>
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
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
