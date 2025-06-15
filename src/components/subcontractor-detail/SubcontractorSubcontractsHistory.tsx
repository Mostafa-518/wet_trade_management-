
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import { Subcontract } from '@/types/subcontract';

interface SubcontractorSubcontractsHistoryProps {
  subcontractorProjects: Subcontract[];
}

export function SubcontractorSubcontractsHistory({ subcontractorProjects }: SubcontractorSubcontractsHistoryProps) {
  const navigate = useNavigate();

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract ID</TableHead>
                <TableHead>Project Name</TableHead>
                <TableHead className="text-right">Contract Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Created Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subcontractorProjects.map((project) => (
                <TableRow 
                  key={project.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSubcontractClick(project.id)}
                >
                  <TableCell className="font-medium text-blue-600 hover:text-blue-800">
                    {project.contractId}
                  </TableCell>
                  <TableCell>{project.project}</TableCell>
                  <TableCell className="text-right">{formatCurrency(project.totalValue)}</TableCell>
                  <TableCell>{getProjectStatusBadge(project.status)}</TableCell>
                  <TableCell className="text-sm">
                    {project.startDate ? new Date(project.startDate).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {project.endDate ? new Date(project.endDate).toLocaleDateString() : '-'}
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
