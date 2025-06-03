
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Edit, Wrench, Package, Plus } from 'lucide-react';
import { useData } from '@/contexts/DataContext';

interface TradeDetailViewProps {
  tradeId: string;
  onBack: () => void;
  onEdit: (trade: any) => void;
  onAddItem: (tradeId: string) => void;
  onEditItem: (item: any) => void;
}

export function TradeDetailView({ tradeId, onBack, onEdit, onAddItem, onEditItem }: TradeDetailViewProps) {
  const { trades, tradeItems } = useData();
  
  const trade = trades.find(t => t.id === tradeId);
  const items = tradeItems.filter(item => item.tradeId === tradeId);

  if (!trade) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Trade Not Found</h2>
        <p className="text-muted-foreground">The requested trade could not be found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{trade.name}</h1>
            <p className="text-muted-foreground">{trade.category}</p>
          </div>
        </div>
        <Button onClick={() => onEdit(trade)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Trade
        </Button>
      </div>

      <Tabs defaultValue="info" className="space-y-6">
        <TabsList>
          <TabsTrigger value="info">Trade Info</TabsTrigger>
          <TabsTrigger value="items">Items ({items.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Trade Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Trade Name</label>
                  <p className="text-lg font-semibold">{trade.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Category</label>
                  <p className="text-lg font-semibold">{trade.category}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-lg font-semibold">{trade.description}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created Date</label>
                  <p className="text-lg font-semibold">{new Date(trade.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Trade Items
                </CardTitle>
                <Button onClick={() => onAddItem(tradeId)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {items.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>${item.unitPrice.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => onEditItem(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No items found for this trade.</p>
                  <Button className="mt-4" onClick={() => onAddItem(tradeId)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Item
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
