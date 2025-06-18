
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import { Subcontract } from '@/types/subcontract';
import { useData } from '@/contexts/DataContext';

interface SubcontractorSubcontractsHistoryProps {
  subcontractorProjects: Subcontract[];
}

export function SubcontractorSubcontractsHistory({ subcontractorProjects }: SubcontractorSubcontractsHistoryProps) {
  const navigate = useNavigate();
  const { projects } = useData();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getProjectStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'active':
        return <Badge className="bg-blue-100 text-blue-800">Active</Badge>;
      case 'overbudget':
        return <Badge variant="destructive">Over Budget</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : projectId;
  };

  const handleSubcontractClick = (subcontractId: string) => {
    navigate(`/subcontracts/${subcontractId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Subcontracts History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {subcontractorProjects.length > 0 ? (
          <div className="space-y-4">
            {subcontractorProjects.map(subcontract => (
              <div 
                key={subcontract.id} 
                className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleSubcontractClick(subcontract.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div>
                      <h3 className="font-semibold text-lg text-blue-600 hover:text-blue-800">
                        {subcontract.contractId}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Project: {getProjectName(subcontract.project)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Trades:</span> {subcontract.tradeItems.map(item => item.trade).join(', ') || 'No trades specified'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Total Value:</span> {formatCurrency(subcontract.totalValue)}
                      </p>
                      {subcontract.responsibilities.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Responsibilities:</span> {subcontract.responsibilities.join(', ')}
                        </p>
                      )}
                    </div>
                    {subcontract.startDate && subcontract.endDate && (
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Duration:</span> {new Date(subcontract.startDate).toLocaleDateString()} - {new Date(subcontract.endDate).toLocaleDateString()}
                      </div>
                    )}
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Created:</span> {new Date(subcontract.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    {getProjectStatusBadge(subcontract.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No subcontracts found for this subcontractor.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
