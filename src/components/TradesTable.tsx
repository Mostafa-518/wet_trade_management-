
import React, { useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Eye, Edit, Trash2, FileDown, Package } from 'lucide-react';
import { Trade, TradeSearchFilters, TradeItem } from '@/types/trade';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

interface TradesTableProps {
  onCreateNew?: () => void;
  onViewDetail: (tradeId: string) => void;
  onEdit?: (trade: Trade) => void;
  onDelete?: (tradeId: string) => void;
  onAddItem?: (tradeId: string) => void;
  onEditItem?: (item: TradeItem) => void;
  onDeleteItem?: (itemId: string) => void;
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
  const { trades, tradeItems, addTrade, addTradeItem } = useData();
  const { toast } = useToast();
  const [searchFilters, setSearchFilters] = useState<TradeSearchFilters>({
    name: '',
    category: '',
    description: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [expandedTradeId, setExpandedTradeId] = useState<string | null>(null);

  const filteredTrades = trades.filter(trade => {
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

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
        
        // Skip header row and process data
        const [headers, ...rows] = jsonData;
        let successCount = 0;
        let errorCount = 0;

        for (const row of rows) {
          if (row.length >= 3) { // Ensure we have at least name, category, description
            try {
              await addTrade({
                name: row[0] || '',
                category: row[1] || '',
                description: row[2] || ''
              });
              successCount++;
            } catch (error) {
              errorCount++;
              console.error('Error importing trade:', error);
            }
          }
        }

        toast({
          title: "Import Complete",
          description: `Successfully imported ${successCount} trades. ${errorCount} errors.`,
        });
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error reading file:', error);
      toast({
        title: "Import Error",
        description: "Failed to read the Excel file.",
        variant: "destructive"
      });
    }
  };

  const getTradeItems = (tradeId: string) => {
    return tradeItems.filter(item => item.trade_id === tradeId);
  };

  const toggleTradeExpansion = (tradeId: string) => {
    setExpandedTradeId(expandedTradeId === tradeId ? null : tradeId);
  };

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx, .xls"
        className="hidden"
        onChange={handleFileChange}
        data-testid="import-excel-input"
      />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Trades & Items</h1>
          <p className="text-muted-foreground">Manage trades and their associated items</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleImportClick}>
            <FileDown className="h-4 w-4 mr-2" />
            Import Excel
          </Button>
          {onCreateNew && (
            <Button onClick={onCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Trade
            </Button>
          )}
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
                <TableHead>Items</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrades.map((trade) => {
                const items = getTradeItems(trade.id);
                const isExpanded = expandedTradeId === trade.id;
                
                return (
                  <React.Fragment key={trade.id}>
                    <TableRow>
                      <TableCell className="font-medium">{trade.name}</TableCell>
                      <TableCell>{trade.category}</TableCell>
                      <TableCell>{trade.description}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleTradeExpansion(trade.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Package className="h-4 w-4 mr-1" />
                          {items.length} items
                        </Button>
                      </TableCell>
                      <TableCell>{new Date(trade.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" size="sm" onClick={() => onViewDetail(trade.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {onEdit && (
                            <Button variant="outline" size="sm" onClick={() => onEdit(trade)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {onAddItem && (
                            <Button variant="outline" size="sm" onClick={() => onAddItem(trade.id)}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          )}
                          {onDelete && (
                            <Button variant="outline" size="sm" onClick={() => onDelete(trade.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow>
                        <TableCell colSpan={6} className="bg-gray-50 p-4">
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm">Trade Items:</h4>
                            {items.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {items.map((item) => (
                                  <div key={item.id} className="bg-white p-3 rounded border">
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <div className="font-medium text-sm">{item.name}</div>
                                        <div className="text-xs text-gray-600">Unit: {item.unit}</div>
                                        <div className="text-xs text-gray-500">{item.description}</div>
                                      </div>
                                      <div className="flex gap-1 ml-2">
                                        {onEditItem && (
                                          <Button variant="ghost" size="sm" onClick={() => onEditItem(item)}>
                                            <Edit className="h-3 w-3" />
                                          </Button>
                                        )}
                                        {onDeleteItem && (
                                          <Button variant="ghost" size="sm" onClick={() => onDeleteItem(item.id)}>
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">No items found for this trade.</p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
