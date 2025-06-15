import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Edit, Trash2, Plus, Search, FileSpreadsheet } from 'lucide-react';
import { TableSelectionCheckbox } from './TableSelectionCheckbox';
import { ImportPreviewDialog } from './ImportPreviewDialog';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/hooks/use-toast';
import { SubcontractorFormData } from '@/types/subcontractor';
import * as XLSX from 'xlsx';

export function SubcontractorsTable({ onCreateNew, onViewDetail, onEdit, onDelete }) {
  const { subcontractors, deleteSubcontractor, addSubcontractor } = useData();
  const { toast } = useToast();

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('name');

  // Import state
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importData, setImportData] = useState<SubcontractorFormData[]>([]);

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Filter subcontractors based on search
  const filteredSubcontractors = subcontractors.filter(subcontractor => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    switch (searchBy) {
      case 'name':
        return subcontractor.name.toLowerCase().includes(term);
      case 'companyName':
        return subcontractor.companyName.toLowerCase().includes(term);
      case 'commercialRegistration':
        return subcontractor.commercialRegistration.toLowerCase().includes(term);
      case 'taxCardNo':
        return subcontractor.taxCardNo.toLowerCase().includes(term);
      case 'representative':
        return subcontractor.representativeName.toLowerCase().includes(term);
      case 'email':
        return subcontractor.email.toLowerCase().includes(term);
      case 'phone':
        return subcontractor.phone.toLowerCase().includes(term);
      default:
        return true;
    }
  });

  const allSelected = filteredSubcontractors.length > 0 && filteredSubcontractors.every(s => selectedIds.has(s.id));

  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(filteredSubcontractors.map(s => s.id)));
  };

  const toggleOne = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleBulkDelete = async () => {
    try {
      for (const id of selectedIds) {
        await deleteSubcontractor(id);
      }
      toast({ title: "Deleted", description: "Subcontractors deleted successfully" });
      setSelectedIds(new Set());
    } catch (err) {
      toast({ title: "Error", description: "Failed to delete selected subcontractors", variant: "destructive" });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('Starting file upload:', file.name, file.type);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON with proper handling for different data types
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1,
          defval: '', // Default value for empty cells
          raw: false // This ensures we get string values which is better for our use case
        });

        console.log('Raw Excel data:', jsonData);

        // Skip header row and convert to SubcontractorFormData
        const rows = jsonData.slice(1) as any[][];
        console.log('Data rows after removing header:', rows);

        const mappedData: SubcontractorFormData[] = rows
          .filter(row => row && row.length > 0 && row[0] && String(row[0]).trim()) // Filter out empty rows
          .map((row, index) => {
            console.log(`Processing row ${index + 1}:`, row);
            
            const mappedItem = {
              name: String(row[0] || '').trim(),
              companyName: String(row[1] || '').trim(),
              representativeName: String(row[2] || '').trim(),
              commercialRegistration: String(row[3] || '').trim(),
              taxCardNo: String(row[4] || '').trim(),
              email: String(row[5] || '').trim(),
              phone: String(row[6] || '').trim(),
              address: String(row[7] || '').trim(),
              trades: [],
              rating: 0
            };
            
            console.log(`Mapped item ${index + 1}:`, mappedItem);
            return mappedItem;
          })
          .filter(item => item.name && item.name.length > 0); // Only include rows with a business name

        console.log('Final mapped data for import:', mappedData);
        
        if (mappedData.length === 0) {
          toast({
            title: "Import Warning", 
            description: "No valid data found in the Excel file. Please ensure the first column contains business names.",
            variant: "destructive"
          });
          return;
        }
        
        setImportData(mappedData);
        setShowImportDialog(true);
      } catch (error) {
        console.error('Import error:', error);
        toast({
          title: "Import Error",
          description: "Failed to parse Excel file. Please check the format and try again.",
          variant: "destructive"
        });
      }
    };
    
    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      toast({
        title: "File Read Error",
        description: "Failed to read the Excel file. Please try again.",
        variant: "destructive"
      });
    };
    
    reader.readAsArrayBuffer(file);
    event.target.value = '';
  };

  const handleImport = async (data: SubcontractorFormData[]) => {
    console.log('Starting import process with data:', data);
    
    if (!data || data.length === 0) {
      toast({
        title: "Import Error",
        description: "No data to import",
        variant: "destructive"
      });
      return;
    }

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const [index, item] of data.entries()) {
      try {
        console.log(`Importing item ${index + 1}:`, item);
        
        // Validate required fields
        if (!item.name || !item.name.trim()) {
          console.warn(`Skipping item ${index + 1} without business name:`, item);
          errors.push(`Row ${index + 2}: Missing business name`);
          errorCount++;
          continue;
        }

        // Ensure all required fields have default values
        const subcontractorData: SubcontractorFormData = {
          name: item.name.trim(),
          companyName: item.companyName?.trim() || item.name.trim(),
          representativeName: item.representativeName?.trim() || '',
          commercialRegistration: item.commercialRegistration?.trim() || '',
          taxCardNo: item.taxCardNo?.trim() || '',
          email: item.email?.trim() || '',
          phone: item.phone?.trim() || '',
          address: item.address?.trim() || '',
          trades: item.trades || [],
          rating: item.rating || 0
        };

        console.log(`Attempting to add subcontractor:`, subcontractorData);
        await addSubcontractor(subcontractorData);
        successCount++;
        console.log(`Successfully imported: ${subcontractorData.name}`);
      } catch (error) {
        console.error(`Failed to import item ${index + 1}:`, item, error);
        errors.push(`Row ${index + 2}: ${item.name || 'Unknown'} - ${error.message || 'Unknown error'}`);
        errorCount++;
      }
    }

    // Show detailed results
    if (successCount > 0) {
      toast({
        title: "Import Completed",
        description: `${successCount} subcontractor${successCount !== 1 ? 's' : ''} imported successfully${errorCount > 0 ? `. ${errorCount} failed.` : ''}`,
      });
    } else {
      toast({
        title: "Import Failed", 
        description: errorCount > 0 ? `All ${errorCount} items failed to import. Please check the data format.` : "No items could be imported.",
        variant: "destructive"
      });
    }

    if (errors.length > 0) {
      console.error('Import errors:', errors);
    }

    setShowImportDialog(false);
    setImportData([]);
  };

  const downloadTemplate = () => {
    const template = [
      ['Business Name', 'Company Name', 'Representative Name', 'Commercial Registration', 'Tax Card No.', 'Email', 'Phone', 'Address'],
      ['Sample Business', 'Sample Company Ltd.', 'John Doe', 'CR-001-2024', 'TAX-001-2024', 'john@example.com', '+20 100 123 4567', 'Sample Address']
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Subcontractors Template');
    XLSX.writeFile(wb, 'subcontractors_template.xlsx');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Subcontractors</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={downloadTemplate} className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Download Template
          </Button>
          <div className="relative">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              id="excel-upload"
            />
            <Button variant="outline" className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Import Excel
            </Button>
          </div>
          {onCreateNew && (
            <Button onClick={onCreateNew} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Subcontractor
            </Button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search subcontractors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
          className="px-3 py-2 border border-input bg-background rounded-md text-sm"
        >
          <option value="name">Business Name</option>
          <option value="companyName">Company Name</option>
          <option value="representative">Representative</option>
          <option value="commercialRegistration">Commercial Registration</option>
          <option value="taxCardNo">Tax Card No.</option>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
        </select>
      </div>

      {selectedIds.size > 0 && (
        <div className="p-2 bg-red-50 border-b flex items-center gap-2">
          <span className="font-medium">{selectedIds.size} selected</span>
          <Button variant="destructive" size="sm" onClick={handleBulkDelete}>Delete Selected</Button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <TableSelectionCheckbox checked={allSelected} onCheckedChange={toggleAll} ariaLabel="Select all subcontractors"/>
            </TableHead>
            <TableHead>Business Name</TableHead>
            <TableHead>Company Name</TableHead>
            <TableHead>Representative</TableHead>
            <TableHead>Commercial Registration</TableHead>
            <TableHead>Tax Card No.</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSubcontractors.map(sc => (
            <TableRow key={sc.id}>
              <TableCell>
                <TableSelectionCheckbox checked={selectedIds.has(sc.id)} onCheckedChange={() => toggleOne(sc.id)} ariaLabel={`Select subcontractor ${sc.name}`} />
              </TableCell>
              <TableCell>{sc.name}</TableCell>
              <TableCell>{sc.companyName}</TableCell>
              <TableCell>{sc.representativeName}</TableCell>
              <TableCell>{sc.commercialRegistration}</TableCell>
              <TableCell>{sc.taxCardNo}</TableCell>
              <TableCell>{sc.email}</TableCell>
              <TableCell>{sc.phone}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onViewDetail(sc.id)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  {onEdit && (
                    <Button variant="ghost" size="sm" onClick={() => onEdit(sc)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button variant="ghost" size="sm" onClick={() => onDelete(sc.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
          {filteredSubcontractors.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8">
                {searchTerm ? 'No subcontractors found matching your search.' : 'No subcontractors found.'}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <ImportPreviewDialog
        open={showImportDialog}
        onClose={() => {
          setShowImportDialog(false);
          setImportData([]);
        }}
        data={importData}
        columns={[
          { key: 'name', label: 'Business Name' },
          { key: 'companyName', label: 'Company Name' },
          { key: 'representativeName', label: 'Representative Name' },
          { key: 'commercialRegistration', label: 'Commercial Registration' },
          { key: 'taxCardNo', label: 'Tax Card No.' },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Phone' },
          { key: 'address', label: 'Address' }
        ]}
        onImport={handleImport}
      />
    </div>
  );
}
