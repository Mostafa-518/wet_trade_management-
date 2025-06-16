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

interface ProcessedContractData {
  dateOfIssuing: string;
  projectName: string;
  subcontractorCompany: string;
  contractType: string;
  tradeItems: Array<{
    trade: string;
    item: string;
    quantity: number;
    rate: number;
    wastage: number;
    responsibilities: string;
  }>;
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
      
      console.log('Raw worksheet:', worksheet);
      
      // Parse as array of arrays first to handle merged cells better
      const rawData = XLSX.utils.sheet_to_json(worksheet, { 
        header: 1,
        defval: '',
        raw: false
      });

      console.log('Raw data as arrays:', rawData);

      if (rawData.length === 0) {
        toast({
          title: "Empty file",
          description: "The Excel file appears to be empty",
          variant: "destructive"
        });
        return;
      }

      // Find header row and convert to objects
      const headerRow = rawData[0] as string[];
      console.log('Header row:', headerRow);
      
      const dataRows = rawData.slice(1) as any[][];
      console.log('Data rows:', dataRows);

      // Map array data to objects with proper headers
      const mappedData: SubcontractImportData[] = dataRows
        .filter(row => row && row.length > 0 && row.some(cell => cell && String(cell).trim()))
        .map(row => {
          const mapped: any = {};
          
          // Map based on column positions (adjust indices based on your Excel structure)
          mapped['Date of Issuing'] = String(row[0] || '').trim();
          mapped['Project Name'] = String(row[1] || '').trim();
          mapped['Subcontractor Company'] = String(row[2] || '').trim();
          mapped['Type of contract'] = String(row[3] || '').trim();
          mapped['Trades'] = String(row[4] || '').trim();
          mapped['Items'] = String(row[5] || '').trim();
          mapped['QTY'] = parseFloat(row[6]) || 0;
          mapped['Rate'] = parseFloat(row[7]) || 0;
          mapped['wastage'] = parseFloat(row[8]) || 0;
          mapped['Responsibilities'] = String(row[9] || '').trim();
          
          return mapped as SubcontractImportData;
        });

      console.log('Mapped data before processing merged cells:', mappedData);

      if (mappedData.length === 0) {
        toast({
          title: "No valid data",
          description: "Could not find valid data rows in the Excel file",
          variant: "destructive"
        });
        return;
      }

      // Process merged cells - fill empty cells with previous values
      const processedData = processExcelMergedCells(mappedData);
      
      console.log('Processed data after handling merged cells:', processedData);
      
      setImportData(processedData);
      setShowPreview(true);
      
      toast({
        title: "File parsed successfully",
        description: `Found ${processedData.length} records to review`
      });
    } catch (error) {
      console.error('Error parsing Excel file:', error);
      toast({
        title: "Error parsing file",
        description: `Could not read the Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  const processExcelMergedCells = (data: SubcontractImportData[]): SubcontractImportData[] => {
    const processedData: SubcontractImportData[] = [];
    let lastValidValues = {
      'Date of Issuing': '',
      'Project Name': '',
      'Subcontractor Company': '',
      'Type of contract': ''
    };

    for (const row of data) {
      // For each row, use the current value if it exists, otherwise use the last valid value
      const processedRow: SubcontractImportData = {
        'Date of Issuing': row['Date of Issuing'] || lastValidValues['Date of Issuing'],
        'Project Name': row['Project Name'] || lastValidValues['Project Name'],
        'Subcontractor Company': row['Subcontractor Company'] || lastValidValues['Subcontractor Company'],
        'Type of contract': row['Type of contract'] || lastValidValues['Type of contract'],
        'Trades': row['Trades'],
        'Items': row['Items'],
        'QTY': row['QTY'],
        'Rate': row['Rate'],
        'wastage': row['wastage'],
        'Responsibilities': row['Responsibilities']
      };

      // Update last valid values if current row has them
      if (row['Date of Issuing']) lastValidValues['Date of Issuing'] = row['Date of Issuing'];
      if (row['Project Name']) lastValidValues['Project Name'] = row['Project Name'];
      if (row['Subcontractor Company']) lastValidValues['Subcontractor Company'] = row['Subcontractor Company'];
      if (row['Type of contract']) lastValidValues['Type of contract'] = row['Type of contract'];

      // Only add rows that have trade items (skip empty rows)
      if (processedRow['Trades'] || processedRow['Items']) {
        processedData.push(processedRow);
      }
    }

    return processedData;
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

    // Group data by contract (same Date of Issuing, Project Name, Subcontractor Company, Type of contract)
    const contractGroups = groupByContract(data);

    for (const [groupKey, groupData] of Object.entries(contractGroups)) {
      try {
        // Use the first row for contract details
        const contractRow = groupData[0];
        
        // Validate contract-level data
        const contractErrors = validateContractData(contractRow);
        if (contractErrors.length > 0) {
          errorCount++;
          errors.push(`Contract ${groupKey}: ${contractErrors.join(', ')}`);
          continue;
        }

        // Find project ID
        const project = projects.find(p => 
          p.name.toLowerCase() === contractRow['Project Name'].toLowerCase()
        );
        if (!project) {
          errorCount++;
          errors.push(`Contract ${groupKey}: Project "${contractRow['Project Name']}" not found`);
          continue;
        }

        // Find subcontractor ID
        const subcontractor = subcontractors.find(s => 
          s.companyName?.toLowerCase() === contractRow['Subcontractor Company'].toLowerCase()
        );
        if (!subcontractor) {
          errorCount++;
          errors.push(`Contract ${groupKey}: Subcontractor "${contractRow['Subcontractor Company']}" not found`);
          continue;
        }

        // Process all trade items for this contract
        const tradeItemsList = [];
        let hasValidTradeItems = false;

        for (let i = 0; i < groupData.length; i++) {
          const row = groupData[i];
          const rowErrors = validateRow(row, i + 1);

          if (rowErrors.length > 0) {
            errors.push(`Contract ${groupKey}, Row ${i + 1}: ${rowErrors.join(', ')}`);
            continue;
          }

          // Create trade item
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

          tradeItemsList.push(tradeItem);
          hasValidTradeItems = true;
        }

        if (!hasValidTradeItems) {
          errorCount++;
          errors.push(`Contract ${groupKey}: No valid trade items found`);
          continue;
        }

        // Calculate total value
        const totalValue = tradeItemsList.reduce((sum, item) => sum + item.total, 0);

        // Parse responsibilities from the first row (assuming they apply to the whole contract)
        const responsibilityList = contractRow['Responsibilities'] 
          ? contractRow['Responsibilities'].split(',').map(r => r.trim())
          : [];

        // Create subcontract data
        const subcontractData = {
          project: project.id,
          subcontractor: subcontractor.id,
          tradeItems: tradeItemsList,
          responsibilities: responsibilityList,
          totalValue,
          status: 'draft' as const,
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          dateOfIssuing: contractRow['Date of Issuing'] ? new Date(contractRow['Date of Issuing']).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          description: `Imported subcontract for ${project.name} with ${subcontractor.companyName}`,
          contractType: (contractRow['Type of contract'] as 'subcontract' | 'ADD') || 'subcontract'
        };

        await addSubcontract(subcontractData);
        successCount++;
      } catch (error) {
        errorCount++;
        errors.push(`Contract ${groupKey}: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
        description: `${errorCount} contracts failed to import. Check console for details.`,
        variant: "destructive"
      });
    }
  };

  const groupByContract = (data: SubcontractImportData[]) => {
    const groups: { [key: string]: SubcontractImportData[] } = {};

    data.forEach(row => {
      const key = `${row['Date of Issuing']}_${row['Project Name']}_${row['Subcontractor Company']}_${row['Type of contract']}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(row);
    });

    return groups;
  };

  const validateContractData = (row: SubcontractImportData): string[] => {
    const errors: string[] = [];

    if (!row['Project Name']) {
      errors.push('Project Name is required');
    }
    if (!row['Subcontractor Company']) {
      errors.push('Subcontractor Company is required');
    }
    if (!row['Type of contract']) {
      errors.push('Type of contract is required');
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
      },
      {
        'Date of Issuing': '', // Empty for merged cell simulation
        'Project Name': '', // Empty for merged cell simulation
        'Subcontractor Company': '', // Empty for merged cell simulation
        'Type of contract': '', // Empty for merged cell simulation
        'Trades': 'Plumbing',
        'Items': 'Pipe Installation',
        'QTY': 50,
        'Rate': 30.00,
        'wastage': 3,
        'Responsibilities': 'Installation, Testing'
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
