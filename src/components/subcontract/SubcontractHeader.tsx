
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Edit } from 'lucide-react';
import { Subcontract } from '@/types/subcontract';
import { useData } from '@/contexts/DataContext';

interface SubcontractHeaderProps {
  subcontract: Subcontract;
  onBack: () => void;
  onEdit: () => void;
}

export function SubcontractHeader({ subcontract, onBack, onEdit }: SubcontractHeaderProps) {
  const { projects } = useData();
  const projectData = projects.find(p => p.id === subcontract.project);

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

  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Subcontracts
      </Button>
      <div className="flex-1">
        <h1 className="text-3xl font-bold">{subcontract.contractId}</h1>
        <p className="text-muted-foreground">{projectData?.name || subcontract.project}</p>
      </div>
      <div className="flex items-center gap-2">
        {getStatusBadge(subcontract.status)}
        <Button variant="outline" onClick={onEdit} className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Edit
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>
    </div>
  );
}
