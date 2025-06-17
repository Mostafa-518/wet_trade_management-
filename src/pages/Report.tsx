
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function Report() {
  // Dummy data for the report
  const reportData = {
    totalSubcontracts: 134,
    currentSubcontracts: 1,
    filters: {
      month: 'All',
      year: '2024',
      location: 'Alamein',
      wetTrade: 'Masonry',
      projectName: 'GEM Touristic Walkway',
      projectCode: '553'
    }
  };

  const tableData = [
    {
      item: 'Brick Work Foundation',
      averageRate: 45.50,
      totalAmount: 45500,
      wastage: 5,
      accommodation: 'Yes',
      transportation: 'Yes',
      safety: 'Yes',
      verticalTransportation: 'No'
    },
    {
      item: 'Stone Cladding',
      averageRate: 75.25,
      totalAmount: 150500,
      wastage: 3,
      accommodation: 'No',
      transportation: 'Yes',
      safety: 'Yes',
      verticalTransportation: 'Yes'
    },
    {
      item: 'Concrete Block Work',
      averageRate: 35.75,
      totalAmount: 71500,
      wastage: 7,
      accommodation: 'Yes',
      transportation: 'No',
      safety: 'Yes',
      verticalTransportation: 'No'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Report</h1>
      </div>

      {/* Filter Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Present Data Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Present Data:</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-gray-50">
                By Project
              </Badge>
              <Select defaultValue="by-project">
                <SelectTrigger className="w-8 h-8 p-0 border-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="by-project">By Project</SelectItem>
                  <SelectItem value="by-contractor">By Contractor</SelectItem>
                  <SelectItem value="by-trade">By Trade</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Empty Card for spacing */}
        <Card className="opacity-0">
          <CardContent className="h-20"></CardContent>
        </Card>

        {/* Total Subcontracts Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">No. Of All Subcontract:</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-center">
              [{reportData.totalSubcontracts}] Subcontract
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Month:</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="january">January</SelectItem>
                  <SelectItem value="february">February</SelectItem>
                  <SelectItem value="march">March</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Year:</label>
              <Select defaultValue="2024">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location of work:</label>
              <Select defaultValue="alamein">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alamein">Alamein</SelectItem>
                  <SelectItem value="cairo">Cairo</SelectItem>
                  <SelectItem value="giza">Giza</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Wet trade:</label>
              <Select defaultValue="masonry">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masonry">Masonry</SelectItem>
                  <SelectItem value="concrete">Concrete</SelectItem>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Project Name:</label>
              <div className="text-sm text-gray-700 p-2 bg-gray-50 rounded border">
                GEM Touristic Walkway
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Project Code:</label>
              <div className="text-sm text-gray-700 p-2 bg-gray-50 rounded border">
                553
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Subcontracts Card */}
      <div className="flex justify-center">
        <Card className="w-auto">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-lg font-semibold">
                No. Of Subcontract: [1] Subcontract
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button className="bg-green-500 hover:bg-green-600 text-white px-8 py-2">
          Submit
        </Button>
      </div>

      {/* Results Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Item</TableHead>
                  <TableHead className="font-semibold">Average Rate</TableHead>
                  <TableHead className="font-semibold">Total Amount</TableHead>
                  <TableHead className="font-semibold">Wastage %</TableHead>
                  <TableHead className="font-semibold">Accommodation</TableHead>
                  <TableHead className="font-semibold">Transportation</TableHead>
                  <TableHead className="font-semibold">Safety</TableHead>
                  <TableHead className="font-semibold">Vertical Transportation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.item}</TableCell>
                    <TableCell>{row.averageRate.toFixed(2)}</TableCell>
                    <TableCell>{row.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>{row.wastage}%</TableCell>
                    <TableCell>
                      <Badge variant={row.accommodation === 'Yes' ? 'default' : 'secondary'}>
                        {row.accommodation}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={row.transportation === 'Yes' ? 'default' : 'secondary'}>
                        {row.transportation}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={row.safety === 'Yes' ? 'default' : 'secondary'}>
                        {row.safety}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={row.verticalTransportation === 'Yes' ? 'default' : 'secondary'}>
                        {row.verticalTransportation}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Empty rows to match the image */}
                {[...Array(3)].map((_, index) => (
                  <TableRow key={`empty-${index}`}>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell>&nbsp;</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
