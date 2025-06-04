
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
import { useData } from '@/contexts/DataContext';

interface SubcontractTableProps {
  onCreateNew: () => void;
  onViewDetail: (contractId: string) => void;
}

interface SearchCondition {
  field: string;
  value: string;
}

export function SubcontractTable({ onCreateNew, onViewDetail }: SubcontractTableProps) {
  const { subcontracts } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(subcontracts);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  // Update filtered data when subcontracts change
  React.useEffect(() => {
    setFilteredData(subcontracts);
  }, [subcontracts]);

  const handleSimpleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = subcontracts.filter(item =>
      item.contractId.toLowerCase().includes(value.toLowerCase()) ||
      item.project.toLowerCase().includes(value.toLowerCase()) ||
      item.subcontractor.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const handleAdvancedSearch = (conditions: SearchCondition[]) => {
    if (conditions.length === 0) {
      setFilteredData(subcontracts);
      return;
    }

    const filtered = subcontracts.filter(item => {
      return conditions.every(condition => {
        const fieldValue = item[condition.field as keyof typeof item];
        if (typeof fieldValue === 'string') {
          return fieldValue.toLowerCase().includes(condition.value.toLowerCase());
        }
        return false;
      });
    });
    setFilteredData(filtered);
  };

  const getStatusBadge = (status: string) => {
    if (status === 'overbudget') {
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
              placeholder="Quick search by Contract ID, Project, or Subcontractor..."
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
              <TableHead>Items Count</TableHead>
              <TableHead className="text-right">Total Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created Date</TableHead>
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
                <TableCell>{contract.tradeItems.length}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(contract.totalValue)}</TableCell>
                <TableCell>{getStatusBadge(contract.status)}</TableCell>
                <TableCell>{new Date(contract.createdAt).toLocaleDateString()}</TableCell>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold">{filteredData.length}</div>
          <div className="text-sm text-muted-foreground">Total Contracts</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(filteredData.reduce((sum, item) => sum + item.totalValue, 0))}
          </div>
          <div className="text-sm text-muted-foreground">Total Value</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {filteredData.filter(item => item.status === 'active').length}
          </div>
          <div className="text-sm text-muted-foreground">Active Contracts</div>
        </div>
      </div>
    </div>
  );
}
