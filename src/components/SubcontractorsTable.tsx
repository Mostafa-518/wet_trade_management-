
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

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Skip header row and convert to SubcontractorFormData
        const rows = jsonData.slice(1) as any[][];
        const mappedData: SubcontractorFormData[] = rows
          .filter(row => row.length > 0 && row[0]) // Filter out empty rows
          .map(row => ({
            name: row[0] || '',
            companyName: row[1] || '',
            representativeName: row[2] || '',
            commercialRegistration: row[3] || '',
            taxCardNo: row[4] || '',
            email: row[5] || '',
            phone: row[6] || '',
            address: row[7] || '',
            trades: [],
            rating: 0
          }));

        setImportData(mappedData);
        setShowImportDialog(true);
      } catch (error) {
        toast({
          title: "Import Error",
          description: "Failed to parse Excel file. Please check the format.",
          variant: "destructive"
        });
      }
    };
    reader.readAsArrayBuffer(file);
    event.target.value = '';
  };

  const handleImport = async (data: SubcontractorFormData[]) => {
    try {
      for (const item of data) {
        await addSubcontractor(item);
      }
      toast({
        title: "Import Successful",
        description: `${data.length} subcontractors imported successfully`
      });
    } catch (error) {
      toast({
        title: "Import Error",
        description: "Failed to import some subcontractors",
        variant: "destructive"
      });
    }
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
        onClose={() => setShowImportDialog(false)}
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
