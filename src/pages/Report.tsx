import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { useData } from "@/contexts/DataContext";

const Report = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedTrades, setSelectedTrades] = useState('');
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [presentData, setPresentData] = useState('');
  const [projectFilterType, setProjectFilterType] = useState('');
  const [reportData, setReportData] = useState([
    { project_name: 'Project A', project_code: 'PA123', subcontractor_name: 'Subcontractor X', total_contracts: 5 },
    { project_name: 'Project B', project_code: 'PB456', subcontractor_name: 'Subcontractor Y', total_contracts: 3 },
    { project_name: 'Project C', project_code: 'PC789', subcontractor_name: 'Subcontractor Z', total_contracts: 9 },
  ]);

  const handleSubcontractClick = (item: any) => {
    console.log('=== REPORT: handleSubcontractClick called ===');
    console.log('Clicked item:', item);
    
    // Build filter parameters based on the clicked item
    const filterParams = new URLSearchParams();
    
    // Add the expected count for debugging
    filterParams.append('expectedCount', item.total_contracts.toString());
    console.log('Added expectedCount:', item.total_contracts);
    
    // Add basic filters from form - only if they have values
    if (selectedMonth && selectedMonth !== 'all') {
      filterParams.append('month', selectedMonth);
      console.log('Added month filter:', selectedMonth);
    }
    if (selectedYear && selectedYear !== 'all') {
      filterParams.append('year', selectedYear);
      console.log('Added year filter:', selectedYear);
    }
    if (selectedLocation && selectedLocation.trim()) {
      filterParams.append('location', selectedLocation);
      console.log('Added location filter:', selectedLocation);
    }
    if (selectedTrades && selectedTrades.trim()) {
      filterParams.append('trades', selectedTrades);
      console.log('Added trades filter:', selectedTrades);
    }
    
    // Add specific filters based on the clicked item - be more flexible with matching
    if (item.project_name && item.project_name.trim()) {
      filterParams.append('projectName', item.project_name);
      console.log('Added projectName filter:', item.project_name);
    }
    if (item.project_code && item.project_code.trim()) {
      filterParams.append('projectCode', item.project_code);
      console.log('Added projectCode filter:', item.project_code);
    }
    if (item.subcontractor_name && item.subcontractor_name.trim()) {
      filterParams.append('subcontractorName', item.subcontractor_name);
      console.log('Added subcontractorName filter:', item.subcontractor_name);
    }
    
    // Add facilities if they exist and are selected
    if (selectedFacilities && selectedFacilities.length > 0) {
      filterParams.append('facilities', selectedFacilities.join(','));
      console.log('Added facilities filter:', selectedFacilities);
    }
    
    // Add present data filter if selected
    if (presentData && presentData.trim()) {
      filterParams.append('presentData', presentData);
    }
    
    // Add project filter type if selected
    if (projectFilterType && projectFilterType.trim()) {
      filterParams.append('projectFilterType', projectFilterType);
    }
    
    console.log('=== REPORT: Final filter params string ===');
    console.log('Filter params string:', filterParams.toString());
    console.log('=== REPORT: Navigating to subcontracts ===');
    
    navigate(`/subcontracts?${filterParams.toString()}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Report</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <Label htmlFor="month">Month</Label>
          <Select onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <SelectItem key={month} value={String(month).padStart(2, '0')}>
                  {new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="year">Year</Label>
          <Select onValueChange={setSelectedYear}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            type="text"
            id="location"
            placeholder="Enter location"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="trades">Trades</Label>
          <Input
            type="text"
            id="trades"
            placeholder="Enter trades"
            value={selectedTrades}
            onChange={(e) => setSelectedTrades(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="facilities">Facilities</Label>
          <Select onValueChange={(value) => setSelectedFacilities(value === '' ? [] : value.split(','))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select facilities" />
            </SelectTrigger>
            <SelectContent>
              {['Facility A', 'Facility B', 'Facility C'].map((facility) => (
                <SelectItem key={facility} value={facility}>
                  {facility}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="presentData">Present Data</Label>
          <Input
            type="text"
            id="presentData"
            placeholder="Enter present data"
            value={presentData}
            onChange={(e) => setPresentData(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="projectFilterType">Project Filter Type</Label>
          <Input
            type="text"
            id="projectFilterType"
            placeholder="Enter project filter type"
            value={projectFilterType}
            onChange={(e) => setProjectFilterType(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Project Code</TableHead>
              <TableHead>Subcontractor Name</TableHead>
              <TableHead>Total Contracts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportData.map((item, index) => (
              <TableRow key={index} className="cursor-pointer hover:bg-gray-100" onClick={() => handleSubcontractClick(item)}>
                <TableCell>{item.project_name}</TableCell>
                <TableCell>{item.project_code}</TableCell>
                <TableCell>{item.subcontractor_name}</TableCell>
                <TableCell>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto font-normal text-blue-600 hover:text-blue-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubcontractClick(item);
                    }}
                  >
                    No. of Subcontract: [{item.total_contracts}] Subcontract
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Report;
