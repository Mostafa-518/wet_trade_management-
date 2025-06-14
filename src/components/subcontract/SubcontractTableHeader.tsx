
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface SubcontractTableHeaderProps {
  onCreateNew?: () => void;
}

export function SubcontractTableHeader({ onCreateNew }: SubcontractTableHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">Subcontract Management</h2>
        <p className="text-muted-foreground">Manage all subcontracts and track budget performance</p>
      </div>
      {onCreateNew && (
        <Button onClick={onCreateNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Subcontract
        </Button>
      )}
    </div>
  );
}
