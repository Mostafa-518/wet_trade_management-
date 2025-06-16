
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { TableSelectionCheckbox } from '@/components/TableSelectionCheckbox';
import { SubcontractTableActions } from './SubcontractTableActions';
import { Subcontract } from '@/types/subcontract';
import { 
  formatCurrency, 
  calculateTotalWithoutWastage, 
  formatResponsibilities, 
  formatDate 
} from './SubcontractTableHelpers';

interface SubcontractTableRowProps {
  contract: Subcontract;
  isSelected: boolean;
  getProjectName: (projectId: string) => string;
  getSubcontractorName: (subcontractorId: string) => string;
  onToggleOne: (id: string) => void;
  onViewDetail: (contractId: string) => void;
  onEdit: (subcontract: Subcontract) => void;
  onDelete: (id: string) => Promise<void>;
}

export function SubcontractTableRow({
  contract,
  isSelected,
  getProjectName,
  getSubcontractorName,
  onToggleOne,
  onViewDetail,
  onEdit,
  onDelete
}: SubcontractTableRowProps) {
  if (contract.tradeItems && contract.tradeItems.length > 0) {
    // Render multiple rows for each trade item
    return (
      <>
        {contract.tradeItems.map((item, idx) => (
          <TableRow 
            key={`${contract.id}-${item.id}`}
            className="cursor-pointer hover:bg-muted/50"
            onClick={() => onViewDetail(contract.id)}
          >
            {idx === 0 && (
              <>
                <TableCell rowSpan={contract.tradeItems.length} onClick={e => e.stopPropagation()}>
                  <TableSelectionCheckbox
                    checked={isSelected}
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
        ))}
      </>
    );
  }

  // Single row for contracts without trade items
  return (
    <TableRow 
      key={contract.id}
      className="cursor-pointer hover:bg-muted/50"
      onClick={() => onViewDetail(contract.id)}
    >
      <TableCell onClick={e => e.stopPropagation()}>
        <TableSelectionCheckbox
          checked={isSelected}
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
  );
}
