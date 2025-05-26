
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Download, Edit, FileText, Building2, User, Calendar, DollarSign } from 'lucide-react';

interface TradeItem {
  id: string;
  trade: string;
  item: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface SubcontractDetail {
  id: string;
  contractId: string;
  project: string;
  subcontractor: string;
  subcontractorContact: {
    rep: string;
    phone: string;
    email: string;
  };
  tradeItems: TradeItem[];
  totalAmount: number;
  budget: number;
  variance: number;
  status: 'active' | 'completed' | 'overbudget';
  responsibilities: string[];
  createdDate: string;
  startDate: string;
  endDate: string;
  pdfUrl?: string;
}

interface SubcontractDetailViewProps {
  contractId: string;
  onBack: () => void;
  onEdit: () => void;
}

// Mock data - in real app this would come from API
const mockSubcontractDetail: SubcontractDetail = {
  id: '1',
  contractId: 'SC-2024-001',
  project: 'Residential Complex A',
  subcontractor: 'Al-Khaleej Construction',
  subcontractorContact: {
    rep: 'Ahmed Ali',
    phone: '+20 123 456 7890',
    email: 'ahmed.ali@alkhaleej.com'
  },
  tradeItems: [
    {
      id: '1',
      trade: 'Electrical',
      item: 'Power Distribution Panels',
      unit: 'Each',
      quantity: 15,
      unitPrice: 2500,
      total: 37500
    },
    {
      id: '2',
      trade: 'Electrical',
      item: 'Lighting Systems',
      unit: 'Sqm',
      quantity: 200,
      unitPrice: 150,
      total: 30000
    }
  ],
  totalAmount: 67500,
  budget: 65000,
  variance: 2500,
  status: 'overbudget',
  responsibilities: ['Installation', 'Testing', 'Documentation', 'Commissioning'],
  createdDate: '2024-01-15',
  startDate: '2024-02-01',
  endDate: '2024-04-30',
  pdfUrl: '/contracts/SC-2024-001.pdf'
};

export function SubcontractDetailView({ contractId, onBack, onEdit }: SubcontractDetailViewProps) {
  const contract = mockSubcontractDetail; // In real app, fetch by contractId

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string, variance: number) => {
    if (status === 'overbudget' || variance > 0) {
      return <Badge variant="destructive">Over Budget</Badge>;
    }
    if (status === 'completed') {
      return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
    }
    return <Badge variant="outline">Active</Badge>;
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
          <h1 className="text-3xl font-bold">{contract.contractId}</h1>
          <p className="text-muted-foreground">{contract.project}</p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(contract.status, contract.variance)}
          <Button variant="outline" onClick={onEdit} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          {contract.pdfUrl && (
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          )}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(contract.totalAmount)}
                </div>
                <div className="text-sm text-muted-foreground">Contract Value</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(contract.budget)}
                </div>
                <div className="text-sm text-muted-foreground">Budget</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-red-600" />
              <div>
                <div className={`text-2xl font-bold ${contract.variance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {contract.variance > 0 ? '+' : ''}{formatCurrency(contract.variance)}
                </div>
                <div className="text-sm text-muted-foreground">Variance</div>
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
                  {contract.tradeItems.length}
                </div>
                <div className="text-sm text-muted-foreground">Trade Items</div>
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
                  {contract.tradeItems.map((item) => (
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
                    <TableCell className="text-right font-bold text-lg">{formatCurrency(contract.totalAmount)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle>Responsibilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {contract.responsibilities.map(resp => (
                  <Badge key={resp} variant="secondary" className="px-3 py-1">
                    {resp}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Information */}
        <div className="space-y-6">
          {/* Subcontractor Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Subcontractor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="font-semibold">{contract.subcontractor}</div>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{contract.subcontractorContact.rep}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">📞</span>
                  <span>{contract.subcontractorContact.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">✉️</span>
                  <span>{contract.subcontractorContact.email}</span>
                </div>
              </div>
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
              <div>
                <div className="font-medium">Created</div>
                <div className="text-muted-foreground">{new Date(contract.createdDate).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="font-medium">Start Date</div>
                <div className="text-muted-foreground">{new Date(contract.startDate).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="font-medium">End Date</div>
                <div className="text-muted-foreground">{new Date(contract.endDate).toLocaleDateString()}</div>
              </div>
            </CardContent>
          </Card>

          {/* Budget Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Contract Value:</span>
                <span className="font-medium">{formatCurrency(contract.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Budget:</span>
                <span className="font-medium">{formatCurrency(contract.budget)}</span>
              </div>
              <div className="flex justify-between text-sm border-t pt-2">
                <span>Variance:</span>
                <span className={`font-bold ${contract.variance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {contract.variance > 0 ? '+' : ''}{formatCurrency(contract.variance)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Status:</span>
                <span>{getStatusBadge(contract.status, contract.variance)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
