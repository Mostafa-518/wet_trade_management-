
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { TradeItem } from '@/types/subcontract';
import { mockTrades } from '@/data/mockData';
import { formatCurrency } from '@/utils/currency';

interface TradeItemFormProps {
  currentTradeItem: Partial<TradeItem>;
  setCurrentTradeItem: React.Dispatch<React.SetStateAction<Partial<TradeItem>>>;
  onAddItem: () => void;
}

export function TradeItemForm({ currentTradeItem, setCurrentTradeItem, onAddItem }: TradeItemFormProps) {
  const handleTradeChange = (trade: string) => {
    setCurrentTradeItem(prev => ({
      ...prev,
      trade,
      item: '',
      unit: ''
    }));
  };

  const handleItemChange = (item: string) => {
    const selectedTrade = mockTrades[currentTradeItem.trade as keyof typeof mockTrades];
    const selectedItem = selectedTrade?.find(t => t.item === item);
    
    setCurrentTradeItem(prev => ({
      ...prev,
      item,
      unit: selectedItem?.unit || ''
    }));
  };

  const handleQuantityOrPriceChange = (field: 'quantity' | 'unitPrice', value: number) => {
    setCurrentTradeItem(prev => {
      const updated = { ...prev, [field]: value };
      updated.total = (updated.quantity || 0) * (updated.unitPrice || 0);
      return updated;
    });
  };

  return (
    <div className="space-y-4 border rounded-lg p-4">
      <h3 className="font-semibold">Add Trade Item</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="trade">Select Trade</Label>
          <Select value={currentTradeItem.trade} onValueChange={handleTradeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a trade..." />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(mockTrades).map(trade => (
                <SelectItem key={trade} value={trade}>
                  {trade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {currentTradeItem.trade && (
          <div>
            <Label htmlFor="item">Select Item</Label>
            <Select value={currentTradeItem.item} onValueChange={handleItemChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an item..." />
              </SelectTrigger>
              <SelectContent>
                {mockTrades[currentTradeItem.trade as keyof typeof mockTrades]?.map(item => (
                  <SelectItem key={item.item} value={item.item}>
                    <div>
                      <div className="font-medium">{item.item}</div>
                      <div className="text-sm text-muted-foreground">Unit: {item.unit}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {currentTradeItem.unit && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Unit of Measurement</Label>
            <Input value={currentTradeItem.unit} disabled className="bg-muted" />
          </div>
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              type="number"
              value={currentTradeItem.quantity || ''}
              onChange={(e) => handleQuantityOrPriceChange('quantity', Number(e.target.value))}
              placeholder="Enter quantity"
            />
          </div>
          <div>
            <Label htmlFor="unitPrice">Unit Price (EGP)</Label>
            <Input
              type="number"
              value={currentTradeItem.unitPrice || ''}
              onChange={(e) => handleQuantityOrPriceChange('unitPrice', Number(e.target.value))}
              placeholder="Enter unit price"
            />
          </div>
        </div>
      )}

      {currentTradeItem.quantity! > 0 && currentTradeItem.unitPrice! > 0 && (
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div>
            <div className="font-semibold">
              Total: {formatCurrency(currentTradeItem.total!)}
            </div>
            <div className="text-sm text-muted-foreground">
              {currentTradeItem.quantity} {currentTradeItem.unit} × {formatCurrency(currentTradeItem.unitPrice!)}
            </div>
          </div>
          <Button onClick={onAddItem} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>
      )}
    </div>
  );
}
