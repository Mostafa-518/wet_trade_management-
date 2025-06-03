import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Eye, Edit, Trash2, FileDown } from 'lucide-react';
import { mockTrades } from '@/data/tradesData';
import { Trade, TradeSearchFilters, TradeItem } from '@/types/trade';

interface TradesTableProps {
  onCreateNew: () => void;
  onViewDetail: (tradeId: string) => void;
  onEdit: (trade: Trade) => void;
  onDelete: (tradeId: string) => void;
  onAddItem: (tradeId: string) => void;
  onEditItem: (item: TradeItem) => void;
  onDeleteItem: (itemId: string) => void;
}

export function TradesTable({ 
  onCreateNew, 
  onViewDetail, 
  onEdit, 
  onDelete, 
  onAddItem, 
  onEditItem, 
  onDeleteItem 
}: TradesTableProps) {
  const [searchFilters, setSearchFilters] = useState<TradeSearchFilters>({
    name: '',
    category: '',
    description: ''
  });

  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const filteredTrades = mockTrades.filter(trade => {
    return (
      trade.name.toLowerCase().includes(searchFilters.name.toLowerCase()) &&
      trade.category.toLowerCase().includes(searchFilters.category.toLowerCase()) &&
      trade.description.toLowerCase().includes(searchFilters.description.toLowerCase())
    );
  });

  const handleFilterChange = (field: keyof TradeSearchFilters, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setSearchFilters({
      name: '',
      category: '',
      description: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Trades & Items</h1>
          <p className="text-muted-foreground">Manage trades and their associated items</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileDown className="h-4 w-4 mr-2" />
            Import Excel
          </Button>
          <Button onClick={onCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Trade
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Search Trades</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
            >
              <Search className="h-4 w-4 mr-2" />
              {showAdvancedSearch ? 'Simple Search' : 'Advanced Search'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Trade Name</label>
                <Input
                  placeholder="Search by trade name..."
                  value={searchFilters.name}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                />
              </div>
              {showAdvancedSearch && (
                <>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Input
                      placeholder="Search by category..."
                      value={searchFilters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Input
                      placeholder="Search by description..."
                      value={searchFilters.description}
                      onChange={(e) => handleFilterChange('description', e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
            {showAdvancedSearch && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trades ({filteredTrades.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trade Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrades.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell className="font-medium">{trade.name}</TableCell>
                  <TableCell>{trade.category}</TableCell>
                  <TableCell>{trade.description}</TableCell>
                  <TableCell>{new Date(trade.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="sm" onClick={() => onViewDetail(trade.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => onEdit(trade)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => onDelete(trade.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
