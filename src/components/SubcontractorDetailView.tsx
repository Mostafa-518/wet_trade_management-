
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Subcontractor } from '@/types/subcontractor';
import { useData } from '@/contexts/DataContext';
import { SubcontractorDetailHeader } from './subcontractor-detail/SubcontractorDetailHeader';
import { SubcontractorOverviewCards } from './subcontractor-detail/SubcontractorOverviewCards';
import { SubcontractorContactInfo } from './subcontractor-detail/SubcontractorContactInfo';
import { SubcontractorBusinessInfo } from './subcontractor-detail/SubcontractorBusinessInfo';
import { SubcontractorSubcontractsHistory } from './subcontractor-detail/SubcontractorSubcontractsHistory';

interface SubcontractorDetailViewProps {
  subcontractor: Subcontractor;
  onBack: () => void;
  onEdit: (subcontractor: Subcontractor) => void;
}

export function SubcontractorDetailView({ subcontractor, onBack, onEdit }: SubcontractorDetailViewProps) {
  const { subcontracts } = useData();

  // Get subcontracts for this subcontractor
  const subcontractorProjects = subcontracts.filter(s => s.subcontractor === subcontractor.name);
  const totalContractValue = subcontractorProjects.reduce((sum, project) => sum + project.totalValue, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <SubcontractorDetailHeader 
        subcontractor={subcontractor} 
        onBack={onBack} 
        onEdit={onEdit} 
      />

      {/* Overview Cards */}
      <SubcontractorOverviewCards 
        totalContractValue={totalContractValue}
        totalProjects={subcontractor.totalProjects}
        currentProjects={subcontractor.currentProjects}
      />

      {/* Tabs */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="info">Subcontractor Info</TabsTrigger>
          <TabsTrigger value="subcontracts">Subcontracts ({subcontractorProjects.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Information */}
            <SubcontractorContactInfo subcontractor={subcontractor} />

            {/* Business Information */}
            <SubcontractorBusinessInfo subcontractor={subcontractor} />
          </div>
        </TabsContent>

        <TabsContent value="subcontracts" className="space-y-6">
          <SubcontractorSubcontractsHistory subcontractorProjects={subcontractorProjects} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
