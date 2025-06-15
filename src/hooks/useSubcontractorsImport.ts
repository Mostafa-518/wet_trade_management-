
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SubcontractorFormData } from '@/types/subcontractor';
import { useData } from '@/contexts/DataContext';
import * as XLSX from 'xlsx';

export function useSubcontractorsImport() {
  const { addSubcontractor } = useData();
  const { toast } = useToast();
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importData, setImportData] = useState<SubcontractorFormData[]>([]);

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
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1,
          defval: '',
          raw: false
        });

        console.log('Raw Excel data:', jsonData);

        // Don't skip any rows - start from the first row
        const rows = jsonData as any[][];
        console.log('All data rows:', rows);

        const mappedData: SubcontractorFormData[] = rows
          .filter((row, index) => {
            // Filter out completely empty rows
            const hasData = row && row.length > 0 && row.some(cell => cell && String(cell).trim());
            console.log(`Row ${index + 1} has data:`, hasData, row);
            return hasData;
          })
          .map((row, index) => {
            console.log(`Processing row ${index + 1}:`, row);
            
            const mappedItem = {
              name: String(row[0] || '').trim(),
              companyName: String(row[1] || row[0] || '').trim(), // Use business name as company name if not provided
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
          .filter(item => {
            // Only filter out items that have no business name
            const isValid = item.name && item.name.length > 0;
            console.log('Item is valid:', isValid, item.name);
            return isValid;
          });

        console.log('Final mapped data for import:', mappedData);
        
        if (mappedData.length === 0) {
          toast({
            title: "No Data Found", 
            description: "No valid business names found in the Excel file. Please ensure your data contains business names in the first column.",
            variant: "destructive"
          });
          return;
        }
        
        console.log('Setting import data and showing dialog:', mappedData.length, 'records');
        setImportData(mappedData);
        setShowImportDialog(true);
        
        toast({
          title: "File Processed",
          description: `Found ${mappedData.length} records to import`,
        });
        
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
        
        if (!item.name || !item.name.trim()) {
          console.warn(`Skipping item ${index + 1} without business name:`, item);
          errors.push(`Row ${index + 1}: Missing business name`);
          errorCount++;
          continue;
        }

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
        errors.push(`Row ${index + 1}: ${item.name || 'Unknown'} - ${error instanceof Error ? error.message : 'Unknown error'}`);
        errorCount++;
      }
    }

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

    console.log('Closing import dialog');
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

  console.log('useSubcontractorsImport state:', { showImportDialog, importDataLength: importData.length });

  return {
    showImportDialog,
    setShowImportDialog,
    importData,
    setImportData,
    handleFileUpload,
    handleImport,
    downloadTemplate
  };
}
