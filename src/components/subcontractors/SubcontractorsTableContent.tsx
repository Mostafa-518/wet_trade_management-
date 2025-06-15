
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { TableSelectionCheckbox } from '../TableSelectionCheckbox';
import { Subcontractor } from '@/types/subcontractor';

interface SubcontractorsTableContentProps {
  filteredSubcontractors: Subcontractor[];
  selectedIds: Set<string>;
  allSelected: boolean;
  onToggleAll: () => void;
  onToggleOne: (id: string) => void;
  onViewDetail: (id: string) => void;
  onEdit?: (subcontractor: Subcontractor) => void;
  onDelete?: (id: string) => void;
  searchTerm: string;
}

export function SubcontractorsTableContent({
  filteredSubcontractors,
  selectedIds,
  allSelected,
  onToggleAll,
  onToggleOne,
  onViewDetail,
  onEdit,
  onDelete,
  searchTerm
}: SubcontractorsTableContentProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <TableSelectionCheckbox 
              checked={allSelected} 
              onCheckedChange={onToggleAll} 
              ariaLabel="Select all subcontractors"
            />
          </TableHead>
          <TableHead>Company Name</TableHead>
          <TableHead>Representative</TableHead>
          <TableHead>Commercial Registration</TableHead>
          <TableHead>Tax Card No.</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredSubcontractors.map(sc => (
          <TableRow key={sc.id}>
            <TableCell>
              <TableSelectionCheckbox 
                checked={selectedIds.has(sc.id)} 
                onCheckedChange={() => onToggleOne(sc.id)} 
                ariaLabel={`Select subcontractor ${sc.companyName}`} 
              />
            </TableCell>
            <TableCell>{sc.companyName}</TableCell>
            <TableCell>{sc.representativeName}</TableCell>
            <TableCell>{sc.commercialRegistration}</TableCell>
            <TableCell>{sc.taxCardNo}</TableCell>
            <TableCell>{sc.email}</TableCell>
            <TableCell>{sc.phone}</TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => onViewDetail(sc.id)}>
                  <Eye className="h-4 w-4" />
                </Button>
                {onEdit && (
                  <Button variant="ghost" size="sm" onClick={() => onEdit(sc)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button variant="ghost" size="sm" onClick={() => onDelete(sc.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
        {filteredSubcontractors.length === 0 && (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8">
              {searchTerm ? 'No subcontractors found matching your search.' : 'No subcontractors found.'}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
