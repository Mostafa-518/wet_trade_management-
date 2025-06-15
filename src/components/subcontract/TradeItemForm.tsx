
import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TradeItem } from '@/types/subcontract';
import { useData } from '@/contexts/DataContext';

interface TradeItemFormProps {
  currentTradeItem: Partial<TradeItem>;
  setCurrentTradeItem: React.Dispatch<React.SetStateAction<Partial<TradeItem>>>;
  onAddItem: () => void;
}

export function TradeItemForm({ currentTradeItem, setCurrentTradeItem, onAddItem }: TradeItemFormProps) {
  const { trades, tradeItems } = useData();

  // Filter out trades with empty or invalid IDs/names
  const validTrades = trades.filter(trade => trade.id && trade.name && trade.id.trim() !== '' && trade.name.trim() !== '');

  // Get available items for selected trade
  const availableItems = currentTradeItem.trade 
    ? tradeItems.filter(item => {
        const selectedTrade = validTrades.find(t => t.name === currentTradeItem.trade);
        return selectedTrade && item.trade_id === selectedTrade.id && item.id && item.name && item.id.trim() !== '' && item.name.trim() !== '';
      })
    : [];

  // Auto-fill unit when item is selected
  useEffect(() => {
    if (currentTradeItem.item && currentTradeItem.trade) {
      const selectedTrade = validTrades.find(t => t.name === currentTradeItem.trade);
      const selectedItem = tradeItems.find(
        item => item.name === currentTradeItem.item && 
                selectedTrade && item.trade_id === selectedTrade.id
      );
      if (selectedItem) {
        setCurrentTradeItem(prev => ({
          ...prev,
          unit: selectedItem.unit,
          total: (prev.quantity || 0) * (prev.unitPrice || 0)
        }));
      }
    }
  }, [currentTradeItem.item, currentTradeItem.trade, tradeItems, validTrades, setCurrentTradeItem]);

  // Calculate total when quantity or unit price changes
  useEffect(() => {
    const quantity = currentTradeItem.quantity || 0;
    const unitPrice = currentTradeItem.unitPrice || 0;
    const total = quantity * unitPrice;
    
    if (currentTradeItem.total !== total) {
      setCurrentTradeItem(prev => ({ ...prev, total }));
    }
  }, [currentTradeItem.quantity, currentTradeItem.unitPrice, currentTradeItem.total, setCurrentTradeItem]);

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Add Trade Item</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Trade</Label>
          <Select 
            value={currentTradeItem.trade || ''} 
            onValueChange={(value) => setCurrentTradeItem(prev => ({ 
              ...prev, 
              trade: value, 
              item: '', 
              unit: '', 
              unitPrice: 0 
            }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select trade..." />
            </SelectTrigger>
            <SelectContent>
              {validTrades.map(trade => (
                <SelectItem key={trade.id} value={trade.name}>
                  {trade.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Item</Label>
          <Select 
            value={currentTradeItem.item || ''} 
            onValueChange={(value) => setCurrentTradeItem(prev => ({ ...prev, item: value }))}
            disabled={!currentTradeItem.trade}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select item..." />
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
          <Label>Unit</Label>
          <Input 
            value={currentTradeItem.unit || ''} 
            disabled
            placeholder="Auto-filled"
          />
        </div>

        <div>
          <Label>Quantity</Label>
          <Input 
            type="number" 
            value={currentTradeItem.quantity || ''} 
            onChange={(e) => setCurrentTradeItem(prev => ({ 
              ...prev, 
              quantity: parseFloat(e.target.value) || 0 
            }))}
            placeholder="Enter quantity"
          />
        </div>

        <div>
          <Label>Unit Price</Label>
          <Input 
            type="number" 
            value={currentTradeItem.unitPrice || ''} 
            onChange={(e) => setCurrentTradeItem(prev => ({ 
              ...prev, 
              unitPrice: parseFloat(e.target.value) || 0 
            }))}
            placeholder="Enter unit price"
          />
        </div>

        <div>
          <Label>Total</Label>
          <Input 
            value={currentTradeItem.total?.toLocaleString() || '0'} 
            disabled
            placeholder="Calculated automatically"
          />
        </div>
      </div>

      <Button onClick={onAddItem} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Item to Contract
      </Button>
    </div>
  );
}
