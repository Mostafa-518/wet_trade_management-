import React from 'react';

interface SubcontractTableProps {
  onCreateNew?: () => void;
  onViewDetail: (contractId: string) => void;
  reportFilters?: any;
}

export function SubcontractTable({ onViewDetail }: SubcontractTableProps) {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Subcontracts</h2>
      <div className="text-center py-8 text-muted-foreground">
        No subcontracts found.
      </div>
    </div>
  );
}