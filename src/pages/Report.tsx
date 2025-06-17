
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
import { useReportData } from '@/hooks/useReportData';
import { Loader2 } from 'lucide-react';

export function Report() {
  const { reportData, filterOptions, updateFilter, isLoading } = useReportData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading report data...</span>
      </div>
    );
  }

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
                {reportData.filters.presentData}
              </Badge>
              <Select 
                value={reportData.filters.presentData} 
                onValueChange={(value) => updateFilter('presentData', value)}
              >
                <SelectTrigger className="w-8 h-8 p-0 border-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.presentDataOptions.map((option) => (
                    <SelectItem key={option} value={option.toLowerCase().replace(' ', '-')}>
                      {option}
                    </SelectItem>
                  ))}
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
              <Select 
                value={reportData.filters.month} 
                onValueChange={(value) => updateFilter('month', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.months.map((month) => (
                    <SelectItem key={month} value={month.toLowerCase()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Year:</label>
              <Select 
                value={reportData.filters.year} 
                onValueChange={(value) => updateFilter('year', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location of work:</label>
              <Select 
                value={reportData.filters.location} 
                onValueChange={(value) => updateFilter('location', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Wet trade:</label>
              <Select 
                value={reportData.filters.wetTrade} 
                onValueChange={(value) => updateFilter('wetTrade', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.wetTrades.map((trade) => (
                    <SelectItem key={trade} value={trade}>
                      {trade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Project Name:</label>
              <Select 
                value={reportData.filters.projectName} 
                onValueChange={(value) => updateFilter('projectName', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.projectNames.map((project) => (
                    <SelectItem key={project} value={project}>
                      {project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Project Code:</label>
              <Select 
                value={reportData.filters.projectCode} 
                onValueChange={(value) => updateFilter('projectCode', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.projectCodes.map((code) => (
                    <SelectItem key={code} value={code}>
                      {code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                No. Of Subcontract: [{reportData.currentSubcontracts}] Subcontract
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
                {reportData.tableData.length > 0 ? (
                  reportData.tableData.map((row, index) => (
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No data available for the selected filters
                    </TableCell>
                  </TableRow>
                )}
                {/* Add empty rows if needed for consistent height */}
                {reportData.tableData.length < 5 && 
                  [...Array(5 - reportData.tableData.length)].map((_, index) => (
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
                  ))
                }
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
