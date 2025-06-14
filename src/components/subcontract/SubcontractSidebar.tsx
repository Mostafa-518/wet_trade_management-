
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, User, Calendar } from 'lucide-react';
import { Subcontract } from '@/types/subcontract';
import { useData } from '@/contexts/DataContext';

interface SubcontractSidebarProps {
  subcontract: Subcontract;
}

export function SubcontractSidebar({ subcontract }: SubcontractSidebarProps) {
  const { projects, subcontractors } = useData();
  
  const projectData = projects.find(p => p.id === subcontract.project);
  const subcontractorData = subcontractors.find(s => s.id === subcontract.subcontractor);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0
    }).format(amount);
  };

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
    <div className="space-y-6">
      {/* Project Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Project
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="font-semibold">{projectData?.name || 'Unknown Project'}</div>
            {projectData && (
              <div className="text-sm text-muted-foreground">
                {projectData.code} • {projectData.location}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Subcontractor Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Subcontractor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="font-semibold">{subcontractorData?.name || 'Unknown Subcontractor'}</div>
          </div>
          {subcontractorData && (
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{subcontractorData.contact_person}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">📞</span>
                <span>{subcontractorData.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">✉️</span>
                <span>{subcontractorData.email}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {subcontract.startDate && (
            <div>
              <div className="font-medium">Start Date</div>
              <div className="text-muted-foreground">{new Date(subcontract.startDate).toLocaleDateString()}</div>
            </div>
          )}
          {subcontract.endDate && (
            <div>
              <div className="font-medium">End Date</div>
              <div className="text-muted-foreground">{new Date(subcontract.endDate).toLocaleDateString()}</div>
            </div>
          )}
          <div>
            <div className="font-medium">Created</div>
            <div className="text-muted-foreground">{new Date(subcontract.createdAt).toLocaleDateString()}</div>
          </div>
          <div>
            <div className="font-medium">Last Updated</div>
            <div className="text-muted-foreground">{new Date(subcontract.updatedAt).toLocaleDateString()}</div>
          </div>
        </CardContent>
      </Card>

      {/* Contract Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Contract Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Contract ID:</span>
            <span className="font-medium">{subcontract.contractId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Total Value:</span>
            <span className="font-medium">{formatCurrency(subcontract.totalValue)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Status:</span>
            <span>{getStatusBadge(subcontract.status)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
