
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
import { SubcontractEditModal } from './subcontract/SubcontractEditModal';
import { useSubcontracts } from '@/hooks/useSubcontracts';
import { useData } from '@/contexts/DataContext';
import { TableSelectionCheckbox } from './TableSelectionCheckbox';

interface SubcontractTableProps {
  onCreateNew?: () => void;
  onViewDetail: (contractId: string) => void;
}

interface SearchCondition {
  field: string;
  value: string;
}

export function SubcontractTable({ onCreateNew, onViewDetail }: SubcontractTableProps) {
  const { subcontracts, updateSubcontract, deleteSubcontract, deleteManySubcontracts, isLoading } = useSubcontracts();
  const { projects, subcontractors } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(subcontracts);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [editingSubcontract, setEditingSubcontract] = useState<any>(null);

  // Update filtered data when subcontracts change
  React.useEffect(() => {
    setFilteredData(subcontracts);
  }, [subcontracts]);

  // Helper functions to resolve names from IDs
  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : projectId;
  };

  const getSubcontractorName = (subcontractorId: string) => {
    const subcontractor = subcontractors.find(s => s.id === subcontractorId);
    return subcontractor ? subcontractor.name : subcontractorId;
  };

  const handleSimpleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = subcontracts.filter(item => {
      const projectName = getProjectName(item.project);
      const subcontractorName = getSubcontractorName(item.subcontractor);
      
      return item.contractId.toLowerCase().includes(value.toLowerCase()) ||
        projectName.toLowerCase().includes(value.toLowerCase()) ||
        subcontractorName.toLowerCase().includes(value.toLowerCase()) ||
        item.tradeItems.some(tradeItem => 
          tradeItem.trade.toLowerCase().includes(value.toLowerCase()) ||
          tradeItem.item.toLowerCase().includes(value.toLowerCase())
        );
    });
    setFilteredData(filtered);
  };

  const handleAdvancedSearch = (conditions: SearchCondition[]) => {
    if (conditions.length === 0) {
      setFilteredData(subcontracts);
      return;
    }

    const filtered = subcontracts.filter(item => {
      const projectName = getProjectName(item.project);
      const subcontractorName = getSubcontractorName(item.subcontractor);
      
      return conditions.every(condition => {
        switch (condition.field) {
          case 'contractId':
            return item.contractId.toLowerCase().includes(condition.value.toLowerCase());
          case 'project':
            return projectName.toLowerCase().includes(condition.value.toLowerCase());
          case 'subcontractor':
            return subcontractorName.toLowerCase().includes(condition.value.toLowerCase());
          case 'trade':
            return item.tradeItems.some(tradeItem => 
              tradeItem.trade.toLowerCase().includes(condition.value.toLowerCase())
            );
          case 'item':
            return item.tradeItems.some(tradeItem => 
              tradeItem.item.toLowerCase().includes(condition.value.toLowerCase())
            );
          case 'status':
            return item.status.toLowerCase().includes(condition.value.toLowerCase());
          default:
            return false;
        }
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
    if (status === 'active') {
      return <Badge className="bg-blue-100 text-blue-800">Active</Badge>;
    }
    if (status === 'pending') {
      return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleEdit = (subcontract: any) => {
    setEditingSubcontract(subcontract);
  };

  const handleSaveEdit = async (id: string, data: any) => {
    await updateSubcontract(id, data);
    setEditingSubcontract(null);
  };

  // Bulk select state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Select all toggle
  const allSelected = filteredData.length > 0 && filteredData.every(p => selectedIds.has(p.id));

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredData.map(p => p.id)));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleBulkDelete = async () => {
    try {
      await deleteManySubcontracts(Array.from(selectedIds));
      setSelectedIds(new Set());
    } catch (error) {
      // errors are already handled via toast
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading subcontracts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Subcontract Management</h2>
          <p className="text-muted-foreground">Manage all subcontracts and track budget performance</p>
        </div>
        {onCreateNew && (
          <Button onClick={onCreateNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Subcontract
          </Button>
        )}
      </div>

      {/* Search Section */}
      <div className="space-y-4">
        <div className="flex gap-2 items-center">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by Contract ID, Project, Subcontractor, Trade, or Trade Item..."
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

        {showAdvancedSearch && (
          <AdvancedSearch onSearch={handleAdvancedSearch} />
        )}
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        {selectedIds.size > 0 && (
          <div className="p-2 bg-red-50 border-b flex items-center gap-2">
            <span className="font-medium">{selectedIds.size} selected</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              className="ml-2"
            >
              Delete Selected
            </Button>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <TableSelectionCheckbox checked={allSelected} onCheckedChange={toggleAll} ariaLabel="Select all subcontracts"/>
              </TableHead>
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
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  <div className="text-muted-foreground">
                    {searchTerm || showAdvancedSearch ? 'No subcontracts found matching your search.' : 'No subcontracts found.'}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((contract) => (
                <TableRow 
                  key={contract.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onViewDetail(contract.contractId)}
                >
                  <TableCell onClick={e => e.stopPropagation()}>
                    <TableSelectionCheckbox
                      checked={selectedIds.has(contract.id)}
                      onCheckedChange={() => toggleOne(contract.id)}
                      ariaLabel={`Select contract ${contract.contractId}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-blue-600">{contract.contractId}</TableCell>
                  <TableCell>{getProjectName(contract.project)}</TableCell>
                  <TableCell>{getSubcontractorName(contract.subcontractor)}</TableCell>
                  <TableCell>{contract.tradeItems.length}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(contract.totalValue)}</TableCell>
                  <TableCell>{getStatusBadge(contract.status)}</TableCell>
                  <TableCell>{new Date(contract.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" onClick={() => onViewDetail(contract.contractId)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(contract)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          try {
                            await deleteSubcontract(contract.id);
                          } catch {
                            // toast already handled
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
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

      {/* Edit Modal */}
      {editingSubcontract && (
        <SubcontractEditModal
          subcontract={editingSubcontract}
          open={!!editingSubcontract}
          onClose={() => setEditingSubcontract(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
