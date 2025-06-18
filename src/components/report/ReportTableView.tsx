
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { ReportTableData } from '@/types/report';

interface ReportTableViewProps {
  tableData: ReportTableData[];
}

export function ReportTableView({ tableData }: ReportTableViewProps) {
  return (
    <Card className="print:shadow-none">
      <CardContent className="pt-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Item</TableHead>
                <TableHead className="font-semibold">Average Rate</TableHead>
                <TableHead className="font-semibold">Total Amount</TableHead>
                <TableHead className="font-semibold">Wastage %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.length > 0 ? (
                tableData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.item}</TableCell>
                    <TableCell>{row.averageRate.toFixed(2)}</TableCell>
                    <TableCell>{row.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>{row.wastage}%</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    No data available for the selected filters
                  </TableCell>
                </TableRow>
              )}
              {/* Add empty rows if needed for consistent height */}
              {tableData.length < 5 && 
                [...Array(5 - tableData.length)].map((_, index) => (
                  <TableRow key={`empty-${index}`}>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell>&nbsp;</TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
