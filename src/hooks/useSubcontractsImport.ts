
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/contexts/DataContext';

interface SubcontractImportData {
  'Date of Issuing': string;
  'Project Name': string;
  'Subcontractor Company': string;
  'Type of contract': string;
  'Trades': string;
  'Items': string;
  'QTY': number;
  'Rate': number;
  'wastage': number;
  'Responsibilities': string;
}

export function useSubcontractsImport() {
  const [isImporting, setIsImporting] = useState(false);
  const [importData, setImportData] = useState<SubcontractImportData[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  const { addSubcontract, projects, subcontractors, trades, tradeItems, responsibilities } = useData();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an Excel file (.xlsx or .xls)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);
    
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as SubcontractImportData[];

      console.log('Parsed Excel data:', jsonData);

      if (jsonData.length === 0) {
        toast({
          title: "Empty file",
          description: "The Excel file appears to be empty",
          variant: "destructive"
        });
        return;
      }

      setImportData(jsonData);
      setShowPreview(true);
      
      toast({
        title: "File parsed successfully",
        description: `Found ${jsonData.length} records to review`
      });
    } catch (error) {
      console.error('Error parsing Excel file:', error);
      toast({
        title: "Error parsing file",
        description: "Could not read the Excel file. Please check the format.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  const validateRow = (row: SubcontractImportData, index: number): string[] => {
    const errors: string[] = [];

    // Required fields validation
    if (!row['Project Name']) {
      errors.push('Project Name is required');
    }
    if (!row['Subcontractor Company']) {
      errors.push('Subcontractor Company is required');
    }
    if (!row['Type of contract']) {
      errors.push('Type of contract is required');
    }
    if (!row['Trades']) {
      errors.push('Trades is required');
    }
    if (!row['Items']) {
      errors.push('Items is required');
    }

    // Numeric validations
    if (row['QTY'] && (isNaN(Number(row['QTY'])) || Number(row['QTY']) <= 0)) {
      errors.push('QTY must be a positive number');
    }
    if (row['Rate'] && (isNaN(Number(row['Rate'])) || Number(row['Rate']) <= 0)) {
      errors.push('Rate must be a positive number');
    }
    if (row['wastage'] && (isNaN(Number(row['wastage'])) || Number(row['wastage']) < 0)) {
      errors.push('Wastage must be a non-negative number');
    }

    // Date validation
    if (row['Date of Issuing']) {
      const date = new Date(row['Date of Issuing']);
      if (isNaN(date.getTime())) {
        errors.push('Date of Issuing must be a valid date');
      }
    }

    // Contract type validation
    if (row['Type of contract'] && !['subcontract', 'ADD'].includes(row['Type of contract'])) {
      errors.push('Type of contract must be either "subcontract" or "ADD"');
    }

    return errors;
  };

  const processImport = async (data: SubcontractImportData[]) => {
    setIsImporting(true);
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowErrors = validateRow(row, i + 1);

      if (rowErrors.length > 0) {
        errorCount++;
        errors.push(`Row ${i + 1}: ${rowErrors.join(', ')}`);
        continue;
      }

      try {
        // Find project ID
        const project = projects.find(p => 
          p.name.toLowerCase() === row['Project Name'].toLowerCase()
        );
        if (!project) {
          errorCount++;
          errors.push(`Row ${i + 1}: Project "${row['Project Name']}" not found`);
          continue;
        }

        // Find subcontractor ID
        const subcontractor = subcontractors.find(s => 
          s.company_name?.toLowerCase() === row['Subcontractor Company'].toLowerCase()
        );
        if (!subcontractor) {
          errorCount++;
          errors.push(`Row ${i + 1}: Subcontractor "${row['Subcontractor Company']}" not found`);
          continue;
        }

        // Parse trade items
        const tradeItem = {
          id: `imported-${Date.now()}-${i}`,
          trade: row['Trades'],
          item: row['Items'],
          unit: 'unit', // Default unit
          quantity: Number(row['QTY']) || 1,
          unitPrice: Number(row['Rate']) || 0,
          total: (Number(row['QTY']) || 1) * (Number(row['Rate']) || 0),
          wastagePercentage: Number(row['wastage']) || 0
        };

        // Parse responsibilities
        const responsibilityList = row['Responsibilities'] 
          ? row['Responsibilities'].split(',').map(r => r.trim())
          : [];

        // Create subcontract data
        const subcontractData = {
          project: project.id,
          subcontractor: subcontractor.id,
          tradeItems: [tradeItem],
          responsibilities: responsibilityList,
          totalValue: tradeItem.total,
          status: 'draft' as const,
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          dateOfIssuing: row['Date of Issuing'] ? new Date(row['Date of Issuing']).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          description: `Imported subcontract for ${project.name} with ${subcontractor.company_name}`,
          contractType: (row['Type of contract'] as 'subcontract' | 'ADD') || 'subcontract'
        };

        await addSubcontract(subcontractData);
        successCount++;
      } catch (error) {
        errorCount++;
        errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    setIsImporting(false);
    setShowPreview(false);
    setImportData([]);

    // Show results
    if (successCount > 0) {
      toast({
        title: "Import completed",
        description: `Successfully imported ${successCount} subcontract(s)${errorCount > 0 ? `, ${errorCount} failed` : ''}`
      });
    }

    if (errors.length > 0) {
      console.error('Import errors:', errors);
      toast({
        title: "Import errors",
        description: `${errorCount} rows failed to import. Check console for details.`,
        variant: "destructive"
      });
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        'Date of Issuing': '2024-01-15',
        'Project Name': 'Sample Project',
        'Subcontractor Company': 'ABC Construction',
        'Type of contract': 'subcontract',
        'Trades': 'Electrical',
        'Items': 'Cable Installation',
        'QTY': 100,
        'Rate': 25.50,
        'wastage': 5,
        'Responsibilities': 'Installation, Testing, Documentation'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Subcontracts');
    XLSX.writeFile(workbook, 'subcontracts_template.xlsx');
  };

  return {
    isImporting,
    importData,
    showPreview,
    setShowPreview,
    handleFileUpload,
    processImport,
    downloadTemplate
  };
}
