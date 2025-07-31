import React from 'react';
import { useSubcontractContext } from '@/contexts/SubcontractContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface SubcontractTableProps {
  onCreateNew?: () => void;
  onViewDetail: (contractId: string) => void;
  reportFilters?: any;
}

export function SubcontractTable({ onCreateNew, onViewDetail, reportFilters }: SubcontractTableProps) {
  const { subcontracts, isLoading } = useSubcontractContext();

  if (isLoading) {
    return (
      <div className="p-4">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Subcontracts</h2>
        {onCreateNew && (
          <Button onClick={onCreateNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Subcontract
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Subcontracts ({subcontracts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {subcontracts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No subcontracts found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contract ID</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Subcontractor</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subcontracts.map((subcontract) => (
                  <TableRow key={subcontract.id}>
                    <TableCell className="font-mono">
                      {subcontract.contractId}
                    </TableCell>
                    <TableCell>{subcontract.project}</TableCell>
                    <TableCell>{subcontract.subcontractor}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'EGP'
                      }).format(subcontract.totalValue)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        subcontract.status === 'active' ? 'default' :
                        subcontract.status === 'completed' ? 'secondary' :
                        subcontract.status === 'cancelled' ? 'destructive' :
                        'outline'
                      }>
                        {subcontract.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {subcontract.startDate ? new Date(subcontract.startDate).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetail(subcontract.id)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}