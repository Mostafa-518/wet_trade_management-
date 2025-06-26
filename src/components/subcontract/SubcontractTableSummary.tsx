
import React from 'react';
import { Subcontract } from '@/types/subcontract';

interface SubcontractTableSummaryProps {
  filteredData: Subcontract[];
}

export function SubcontractTableSummary({ filteredData }: SubcontractTableSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-card rounded-lg">
      <div className="text-center">
        <div className="text-2xl font-bold">{filteredData.length}</div>
        <div className="text-sm text-muted-foreground">Total Contracts</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">
          {formatCurrency(filteredData.reduce((sum, item) => sum + item.totalValue, 0))}
        </div>
        <div className="text-sm text-muted-foreground">Total Value</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600">
          {filteredData.filter(item => item.status === 'active').length}
        </div>
        <div className="text-sm text-muted-foreground">Active Contracts</div>
      </div>
    </div>
  );
}
