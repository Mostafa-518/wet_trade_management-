import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TradeItem {
  id: string;
  trade: string;
  item: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface SubcontractTradeItemsTableProps {
  tradeItems: TradeItem[];
  totalValue: number;
}

export function SubcontractTradeItemsTable({ tradeItems, totalValue }: SubcontractTradeItemsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade Items</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm">
          {tradeItems.length > 0 ? (
            <div>
              <p>Total Items: {tradeItems.length}</p>
              <p>Total Value: {totalValue}</p>
            </div>
          ) : (
            <p>No trade items found</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}