
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { TradeItem } from '@/types/subcontract';
import { formatCurrency } from '@/utils/currency';

interface TradeItemsListProps {
  items: TradeItem[];
  onRemoveItem: (id: string) => void;
  totalAmount: number;
}

export function TradeItemsList({ items, onRemoveItem, totalAmount }: TradeItemsListProps) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Added Items ({items.length})</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex-1">
              <div className="font-medium">{item.trade} - {item.item}</div>
              <div className="text-sm text-muted-foreground">
                {item.quantity} {item.unit} × {formatCurrency(item.unitPrice)} = {formatCurrency(item.total)} 
                {" "}
                <span className="ml-2 text-xs text-yellow-600">{(item.wastagePercentage ?? 0) > 0 ? `(Wastage: ${item.wastagePercentage}%)` : ''}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveItem(item.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="text-lg font-bold text-green-800">
          Contract Total: {formatCurrency(totalAmount)}
        </div>
      </div>
    </div>
  );
}
