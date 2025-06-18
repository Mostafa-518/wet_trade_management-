import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useReportData } from '@/hooks/useReportData';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Report() {
  const navigate = useNavigate();
  const { reportData, filterOptions, updateFilter, isLoading } = useReportData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading report data...</span>
      </div>
    );
  }

  const isPresentDataByProject = reportData.filters.presentData === 'by-project';

  const handleFacilityToggle = (facility: string) => {
    if (facility === 'All') {
      updateFilter('facilities', []);
      return;
    }

    const currentFacilities = reportData.filters.facilities;
    const newFacilities = currentFacilities.includes(facility)
      ? currentFacilities.filter(f => f !== facility)
      : [...currentFacilities, facility];
    
    updateFilter('facilities', newFacilities);
  };

  const removeFacility = (facility: string) => {
    const newFacilities = reportData.filters.facilities.filter(f => f !== facility);
    updateFilter('facilities', newFacilities);
  };

  const handleNavigateToSubcontracts = () => {
    // Create URL parameters from current filters
    const params = new URLSearchParams();
    
    if (reportData.filters.month !== 'all' && reportData.filters.month !== 'All') {
      params.set('month', reportData.filters.month);
    }
    if (reportData.filters.year !== 'all' && reportData.filters.year !== 'All') {
      params.set('year', reportData.filters.year);
    }
    if (reportData.filters.location !== 'all' && reportData.filters.location !== 'All') {
      params.set('location', reportData.filters.location);
    }
    if (reportData.filters.trades !== 'all' && reportData.filters.trades !== 'All') {
      params.set('trades', reportData.filters.trades);
    }
    if (reportData.filters.projectName !== 'all' && reportData.filters.projectName !== 'All') {
      params.set('projectName', reportData.filters.projectName);
    }
    if (reportData.filters.projectCode !== 'all' && reportData.filters.projectCode !== 'All') {
      params.set('projectCode', reportData.filters.projectCode);
    }
    if (reportData.filters.facilities.length > 0) {
      params.set('facilities', reportData.filters.facilities.join(','));
    }
    
    // Navigate to subcontracts page with filters
    const queryString = params.toString();
    navigate(`/subcontracts${queryString ? `?${queryString}` : ''}`);
  };

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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

            {/* Conditional filters based on Present Data selection */}
            {!isPresentDataByProject && (
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
            )}

            {isPresentDataByProject && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {reportData.filters.projectFilterType === 'name' ? 'Project Name:' : 'Project Code:'}
                  </label>
                  <div className="flex gap-2">
                    <Select 
                      value={reportData.filters.projectFilterType === 'name' ? reportData.filters.projectName : reportData.filters.projectCode}
                      onValueChange={(value) => updateFilter(reportData.filters.projectFilterType === 'name' ? 'projectName' : 'projectCode', value)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(reportData.filters.projectFilterType === 'name' ? filterOptions.projectNames : filterOptions.projectCodes).map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select 
                      value={reportData.filters.projectFilterType}
                      onValueChange={(value) => updateFilter('projectFilterType', value)}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="code">Code</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Trades:</label>
              <Select 
                value={reportData.filters.trades} 
                onValueChange={(value) => updateFilter('trades', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.trades.map((trade) => (
                    <SelectItem key={trade} value={trade}>
                      {trade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* NEW: Facilities Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Facilities (Responsibilities):</label>
              <Select onValueChange={handleFacilityToggle}>
                <SelectTrigger>
                  <SelectValue placeholder="Select facilities..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">Clear All</SelectItem>
                  {filterOptions.facilities.filter(f => f !== 'All').map((facility) => (
                    <SelectItem key={facility} value={facility}>
                      {facility}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Show selected facilities */}
              {reportData.filters.facilities.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {reportData.filters.facilities.map((facility) => (
                    <Badge key={facility} variant="secondary" className="flex items-center gap-1">
                      {facility}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 w-4 h-4"
                        onClick={() => removeFacility(facility)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Subcontracts Card */}
      <div className="flex justify-center">
        <Card 
          className="w-auto cursor-pointer hover:shadow-lg transition-shadow"
          onClick={handleNavigateToSubcontracts}
        >
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-lg font-semibold">
                No. Of Subcontract: [{reportData.currentSubcontracts}] Subcontract
              </div>
            </div>
          </CardContent>
        </Card>
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
                {reportData.tableData.length < 5 && 
                  [...Array(5 - reportData.tableData.length)].map((_, index) => (
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
    </div>
  );
}
