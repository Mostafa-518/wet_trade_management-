
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Download, Edit, FileText, Building2, User, Calendar, DollarSign } from 'lucide-react';
import { Subcontract } from '@/types/subcontract';
import { useData } from '@/contexts/DataContext';

interface SubcontractDetailViewProps {
  subcontract: Subcontract;
  onBack: () => void;
  onEdit: () => void;
}

export function SubcontractDetailView({ subcontract, onBack, onEdit }: SubcontractDetailViewProps) {
  const { projects, subcontractors } = useData();

  // Resolve project and subcontractor names from IDs
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
      {/* Header */}
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

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(subcontract.totalValue)}
                </div>
                <div className="text-sm text-muted-foreground">Contract Value</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {subcontract.tradeItems.length}
                </div>
                <div className="text-sm text-muted-foreground">Trade Items</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {getStatusBadge(subcontract.status)}
                </div>
                <div className="text-sm text-muted-foreground">Status</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contract Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trade Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Trade Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              {subcontract.tradeItems.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Trade</TableHead>
                      <TableHead>Item</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subcontract.tradeItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.trade}</TableCell>
                        <TableCell>{item.item}</TableCell>
                        <TableCell className="text-right">{item.quantity} {item.unit}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(item.total)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-t-2">
                      <TableCell colSpan={4} className="font-bold">Total Contract Value</TableCell>
                      <TableCell className="text-right font-bold text-lg">{formatCurrency(subcontract.totalValue)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No trade items added yet
                </div>
              )}
            </CardContent>
          </Card>

          {/* Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle>Responsibilities</CardTitle>
            </CardHeader>
            <CardContent>
              {subcontract.responsibilities.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {subcontract.responsibilities.map(resp => (
                    <Badge key={resp} variant="secondary" className="px-3 py-1">
                      {resp}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No responsibilities assigned yet
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          {subcontract.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{subcontract.description}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Information */}
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
                    <span>{subcontractorData.contactPerson}</span>
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
      </div>
    </div>
  );
}
