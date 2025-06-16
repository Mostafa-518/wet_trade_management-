
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { TradeItem } from '@/types/subcontract';

interface TradeItemFormProps {
  currentTradeItem: Partial<TradeItem>;
  setCurrentTradeItem: React.Dispatch<React.SetStateAction<Partial<TradeItem>>>;
  onAddItem: () => void;
}

export function TradeItemForm({ currentTradeItem, setCurrentTradeItem, onAddItem }: TradeItemFormProps) {
  const { trades, tradeItems } = useData();
  const [availableItems, setAvailableItems] = useState<any[]>([]);

  // Filter items based on selected trade
  useEffect(() => {
    if (currentTradeItem.trade) {
      const selectedTrade = trades.find(t => t.name === currentTradeItem.trade);
      if (selectedTrade) {
        const items = tradeItems.filter(item => item.trade_id === selectedTrade.id);
        setAvailableItems(items);
      }
    } else {
      setAvailableItems([]);
    }
  }, [currentTradeItem.trade, trades, tradeItems]);

  // Calculate total when quantity, unit price, or wastage changes
  useEffect(() => {
    const quantity = currentTradeItem.quantity || 0;
    const unitPrice = currentTradeItem.unitPrice || 0;
    const wastagePercentage = currentTradeItem.wastagePercentage || 0;
    
    const baseAmount = quantity * unitPrice;
    const wastageAmount = baseAmount * (wastagePercentage / 100);
    const total = baseAmount + wastageAmount;
    
    setCurrentTradeItem(prev => ({ ...prev, total }));
  }, [currentTradeItem.quantity, currentTradeItem.unitPrice, currentTradeItem.wastagePercentage, setCurrentTradeItem]);

  const handleTradeChange = (tradeName: string) => {
    setCurrentTradeItem(prev => ({
      ...prev,
      trade: tradeName,
      item: '',
      unit: ''
    }));
  };

  const handleItemChange = (itemName: string) => {
    const selectedItem = availableItems.find(item => item.name === itemName);
    setCurrentTradeItem(prev => ({
      ...prev,
      item: itemName,
      unit: selectedItem?.unit || ''
    }));
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="font-semibold">Add Trade Item</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="trade">Trade</Label>
          <Select value={currentTradeItem.trade || ''} onValueChange={handleTradeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select trade" />
            </SelectTrigger>
            <SelectContent>
              {trades.map(trade => (
                <SelectItem key={trade.id} value={trade.name}>
                  {trade.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="item">Item</Label>
          <Select value={currentTradeItem.item || ''} onValueChange={handleItemChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select item" />
            </SelectTrigger>
            <SelectContent>
              {availableItems.map(item => (
                <SelectItem key={item.id} value={item.name}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="unit">Unit</Label>
          <Input
            id="unit"
            value={currentTradeItem.unit || ''}
            onChange={(e) => setCurrentTradeItem(prev => ({ ...prev, unit: e.target.value }))}
            placeholder="Unit"
            readOnly
          />
        </div>

        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            value={currentTradeItem.quantity || ''}
            onChange={(e) => setCurrentTradeItem(prev => ({ ...prev, quantity: Number(e.target.value) }))}
            placeholder="Quantity"
          />
        </div>

        <div>
          <Label htmlFor="unitPrice">Unit Price</Label>
          <Input
            id="unitPrice"
            type="number"
            step="0.01"
            value={currentTradeItem.unitPrice || ''}
            onChange={(e) => setCurrentTradeItem(prev => ({ ...prev, unitPrice: Number(e.target.value) }))}
            placeholder="Unit price"
          />
        </div>

        <div>
          <Label htmlFor="wastagePercentage">Wastage %</Label>
          <Input
            id="wastagePercentage"
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={currentTradeItem.wastagePercentage || ''}
            onChange={(e) => setCurrentTradeItem(prev => ({ ...prev, wastagePercentage: Number(e.target.value) }))}
            placeholder="Wastage percentage"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-lg font-semibold">
          Total: EGP {(currentTradeItem.total || 0).toLocaleString()}
        </div>
        <Button onClick={onAddItem} className="ml-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>
    </div>
  );
}
