import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Eye, Edit, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AdvancedSearch } from './subcontract/AdvancedSearch';

interface Subcontract {
  id: string;
  contractId: string;
  project: string;
  subcontractor: string;
  trade: string;
  item: string;
  quantity: number;
  unitPrice: number;
  total: number;
  budget: number;
  variance: number;
  status: 'active' | 'completed' | 'overbudget';
  responsibilities: string[];
}

interface SubcontractTableProps {
  onCreateNew: () => void;
  onViewDetail: (contractId: string) => void;
}

interface SearchCondition {
  field: string;
  value: string;
}

const mockSubcontracts: Subcontract[] = [
  {
    id: '1',
    contractId: 'SC-2024-001',
    project: 'Residential Complex A',
    subcontractor: 'Al-Khaleej Construction',
    trade: 'Electrical',
    item: 'Multiple Items',
    quantity: 1,
    unitPrice: 67500,
    total: 67500,
    budget: 65000,
    variance: 2500,
    status: 'overbudget',
    responsibilities: ['Installation', 'Testing', 'Documentation']
  },
  {
    id: '2',
    contractId: 'SC-2024-002',
    project: 'Commercial Tower B',
    subcontractor: 'Modern Plumbing Co.',
    trade: 'Plumbing',
    item: 'Water Supply System',
    quantity: 1,
    unitPrice: 125000,
    total: 125000,
    budget: 130000,
    variance: -5000,
    status: 'active',
    responsibilities: ['Installation', 'Commissioning']
  },
  {
    id: '3',
    contractId: 'SC-2024-003',
    project: 'Villa Project C',
    subcontractor: 'Elite HVAC Systems',
    trade: 'HVAC',
    item: 'Central Air Conditioning',
    quantity: 2,
    unitPrice: 45000,
    total: 90000,
    budget: 90000,
    variance: 0,
    status: 'completed',
    responsibilities: ['Installation', 'Maintenance Setup']
  }
];

export function SubcontractTable({ onCreateNew, onViewDetail }: SubcontractTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(mockSubcontracts);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const handleSimpleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = mockSubcontracts.filter(item =>
      item.contractId.toLowerCase().includes(value.toLowerCase()) ||
      item.project.toLowerCase().includes(value.toLowerCase()) ||
      item.subcontractor.toLowerCase().includes(value.toLowerCase()) ||
      item.trade.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleAdvancedSearch = (conditions: SearchCondition[]) => {
    if (conditions.length === 0) {
      setFilteredData(mockSubcontracts);
      return;
    }

    const filtered = mockSubcontracts.filter(item => {
      return conditions.every(condition => {
        const fieldValue = item[condition.field as keyof Subcontract];
        if (typeof fieldValue === 'string') {
          return fieldValue.toLowerCase().includes(condition.value.toLowerCase());
        }
        return false;
      });
    });
    setFilteredData(filtered);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Subcontract Management</h2>
          <p className="text-muted-foreground">Manage all subcontracts and track budget performance</p>
        </div>
        <Button onClick={onCreateNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Subcontract
        </Button>
      </div>

      {/* Search Section */}
      <div className="space-y-4">
        {/* Simple Search */}
        <div className="flex gap-2 items-center">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Quick search by Contract ID, Project, Trade, or Subcontractor..."
              value={searchTerm}
              onChange={(e) => handleSimpleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
          >
            Advanced Search
          </Button>
        </div>

        {/* Advanced Search */}
        {showAdvancedSearch && (
          <AdvancedSearch onSearch={handleAdvancedSearch} />
        )}
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contract ID</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Subcontractor</TableHead>
              <TableHead>Trade</TableHead>
              <TableHead>Item</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Budget</TableHead>
              <TableHead className="text-right">Variance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((contract) => (
              <TableRow 
                key={contract.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onViewDetail(contract.contractId)}
              >
                <TableCell className="font-medium text-blue-600">{contract.contractId}</TableCell>
                <TableCell>{contract.project}</TableCell>
                <TableCell>{contract.subcontractor}</TableCell>
                <TableCell>{contract.trade}</TableCell>
                <TableCell>{contract.item}</TableCell>
                <TableCell className="text-right">{contract.quantity}</TableCell>
                <TableCell className="text-right">{formatCurrency(contract.unitPrice)}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(contract.total)}</TableCell>
                <TableCell className="text-right">{formatCurrency(contract.budget)}</TableCell>
                <TableCell className={`text-right font-medium ${contract.variance > 0 ? 'text-red-600' : contract.variance < 0 ? 'text-green-600' : ''}`}>
                  {contract.variance > 0 ? '+' : ''}{formatCurrency(contract.variance)}
                </TableCell>
                <TableCell>{getStatusBadge(contract.status, contract.variance)}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" onClick={() => onViewDetail(contract.contractId)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold">{filteredData.length}</div>
          <div className="text-sm text-muted-foreground">Total Contracts</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(filteredData.reduce((sum, item) => sum + item.total, 0))}
          </div>
          <div className="text-sm text-muted-foreground">Total Value</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(filteredData.reduce((sum, item) => sum + item.budget, 0))}
          </div>
          <div className="text-sm text-muted-foreground">Total Budget</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${filteredData.reduce((sum, item) => sum + item.variance, 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {formatCurrency(filteredData.reduce((sum, item) => sum + item.variance, 0))}
          </div>
          <div className="text-sm text-muted-foreground">Total Variance</div>
        </div>
      </div>
    </div>
  );
}
