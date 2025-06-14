
import React from 'react';
import { Subcontract } from '@/types/subcontract';
import { SubcontractHeader } from '@/components/subcontract/SubcontractHeader';
import { SubcontractOverviewCards } from '@/components/subcontract/SubcontractOverviewCards';
import { SubcontractTradeItemsTable } from '@/components/subcontract/SubcontractTradeItemsTable';
import { SubcontractResponsibilities } from '@/components/subcontract/SubcontractResponsibilities';
import { SubcontractDescription } from '@/components/subcontract/SubcontractDescription';
import { SubcontractSidebar } from '@/components/subcontract/SubcontractSidebar';

interface SubcontractDetailViewProps {
  subcontract: Subcontract;
  onBack: () => void;
  onEdit: () => void;
}

export function SubcontractDetailView({ subcontract, onBack, onEdit }: SubcontractDetailViewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <SubcontractHeader 
        subcontract={subcontract} 
        onBack={onBack} 
        onEdit={onEdit} 
      />

      {/* Overview Cards */}
      <SubcontractOverviewCards subcontract={subcontract} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contract Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trade Items */}
          <SubcontractTradeItemsTable 
            tradeItems={subcontract.tradeItems} 
            totalValue={subcontract.totalValue} 
          />

          {/* Responsibilities */}
          <SubcontractResponsibilities responsibilities={subcontract.responsibilities} />

          {/* Description */}
          <SubcontractDescription description={subcontract.description} />
        </div>

        {/* Sidebar Information */}
        <SubcontractSidebar subcontract={subcontract} />
      </div>
    </div>
  );
}
