
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText } from 'lucide-react';
import { TradeItem } from '@/types/subcontract';

interface SubcontractTradeItemsTableProps {
  tradeItems: TradeItem[];
  totalValue: number;
}

export function SubcontractTradeItemsTable({ tradeItems, totalValue }: SubcontractTradeItemsTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Trade Items
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tradeItems.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trade</TableHead>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tradeItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.trade}</TableCell>
                  <TableCell>{item.item}</TableCell>
                  <TableCell className="text-right">{item.quantity} {item.unit}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(item.total)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="border-t-2">
                <TableCell colSpan={4} className="font-bold">Total Contract Value</TableCell>
                <TableCell className="text-right font-bold text-lg">{formatCurrency(totalValue)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No trade items added yet
          </div>
        )}
      </CardContent>
    </Card>
  );
}
