import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useToast } from "@/hooks/use-toast"
import { useData } from "@/contexts/DataContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ModeToggle } from "@/components/mode-toggle"
import { Icons } from "@/components/icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@/components/ui/command"
import { CalendarIcon, CheckCheck, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

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
  ]);

  const handleSubcontractClick = (item: any) => {
    console.log('handleSubcontractClick called with item:', item);
    
    // Build filter parameters based on the clicked item
    const filterParams = new URLSearchParams();
    
    // Add basic filters
    if (selectedMonth) filterParams.append('month', selectedMonth);
    if (selectedYear) filterParams.append('year', selectedYear);
    if (selectedLocation) filterParams.append('location', selectedLocation);
    if (selectedTrades) filterParams.append('trades', selectedTrades);
    
    // Add specific filters based on the clicked item
    if (item.project_name) {
      filterParams.append('projectName', item.project_name);
      console.log('Added projectName filter:', item.project_name);
    }
    if (item.project_code) {
      filterParams.append('projectCode', item.project_code);
      console.log('Added projectCode filter:', item.project_code);
    }
    if (item.subcontractor_name) {
      filterParams.append('subcontractorName', item.subcontractor_name);
      console.log('Added subcontractorName filter:', item.subcontractor_name);
    }
    
    // Add facilities if they exist
    if (selectedFacilities && selectedFacilities.length > 0) {
      filterParams.append('facilities', selectedFacilities.join(','));
    }
    
    // Add present data filter
    if (presentData) {
      filterParams.append('presentData', presentData);
    }
    
    // Add project filter type
    if (projectFilterType) {
      filterParams.append('projectFilterType', projectFilterType);
    }
    
    console.log('Final filter params:', filterParams.toString());
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
                <TableCell>{item.total_contracts}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Report;
