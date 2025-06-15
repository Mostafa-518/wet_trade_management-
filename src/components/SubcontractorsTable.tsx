
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Edit, Trash2, Plus } from 'lucide-react';
import { TableSelectionCheckbox } from './TableSelectionCheckbox';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';

export function SubcontractorsTable({ onCreateNew, onViewDetail, onEdit, onDelete }) {
  const { subcontractors, deleteSubcontractor } = useData();
  const { toast } = useToast();

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const allSelected = subcontractors.length > 0 && subcontractors.every(s => selectedIds.has(s.id));

  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(subcontractors.map(s => s.id)));
  };

  const toggleOne = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleBulkDelete = async () => {
    try {
      for (const id of selectedIds) {
        await deleteSubcontractor(id);
      }
      toast({ title: "Deleted", description: "Subcontractors deleted successfully" });
      setSelectedIds(new Set());
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete selected subcontractors", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Subcontractors</h2>
        <Button onClick={onCreateNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Subcontractor
        </Button>
      </div>
      {selectedIds.size > 0 && (
        <div className="p-2 bg-red-50 border-b flex items-center gap-2">
          <span className="font-medium">{selectedIds.size} selected</span>
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>Delete Selected</Button>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <TableSelectionCheckbox checked={allSelected} onCheckedChange={toggleAll} ariaLabel="Select all subcontractors"/>
            </TableHead>
            <TableHead>Business Name</TableHead>
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
          {subcontractors.map(sc => (
            <TableRow key={sc.id}>
              <TableCell>
                <TableSelectionCheckbox checked={selectedIds.has(sc.id)} onCheckedChange={() => toggleOne(sc.id)} ariaLabel={`Select subcontractor ${sc.name}`} />
              </TableCell>
              <TableCell>{sc.name}</TableCell>
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
                  <Button variant="ghost" size="sm" onClick={() => onEdit(sc)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(sc.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
