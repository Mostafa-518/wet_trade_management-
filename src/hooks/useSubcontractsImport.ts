
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/contexts/DataContext';
import { parseExcelFile, validateExcelFile, createExcelTemplate } from '@/utils/excel/excelParser';
import { mapRawDataToSubcontractData, processExcelMergedCells } from '@/utils/subcontract/dataMapper';
import { processImportData } from '@/utils/subcontract/importProcessor';
import * as XLSX from 'xlsx';

export function useSubcontractsImport() {
  const [isImporting, setIsImporting] = useState(false);
  const [importData, setImportData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();
  const { addSubcontract, projects, subcontractors } = useData();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validationError = validateExcelFile(file);
    if (validationError) {
      toast({
        title: "Invalid file",
        description: validationError,
        variant: "destructive"
      });
      return;
    }

    try {
      setIsImporting(true);
      
      // Parse Excel file
      const rawData = await parseExcelFile(file);
      console.log('Parsed raw data:', rawData);
      
      if (rawData.length <= 1) {
        toast({
          title: "No data found",
          description: "The Excel file appears to be empty or contains only headers.",
          variant: "destructive"
        });
        return;
      }

      // Skip header row and map data
      const dataRows = rawData.slice(1);
      const mappedData = mapRawDataToSubcontractData(dataRows);
      console.log('Mapped data:', mappedData);

      // Process merged cells
      const processedData = processExcelMergedCells(mappedData);
      console.log('Processed data with merged cells:', processedData);

      if (processedData.length === 0) {
        toast({
          title: "No valid data",
          description: "No valid subcontract data found in the file.",
          variant: "destructive"
        });
        return;
      }

      setImportData(processedData);
      setShowPreview(true);
    } catch (error) {
      console.error('Error parsing Excel file:', error);
      toast({
        title: "Import failed",
        description: "Failed to parse Excel file. Please check the format.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const processImport = async (data: any[]) => {
    setIsImporting(true);
    setShowPreview(false);
    
    try {
      await processImportData(data, addSubcontract, projects, subcontractors, toast);
    } catch (error) {
      console.error('Import processing error:', error);
      toast({
        title: "Import failed",
        description: "An error occurred while processing the import.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = () => {
    const templateData = [
      {
        'Date of Issuing': '2024-01-15',
        'Project Name': 'Sample Project',
        'Subcontractor Company': 'Sample Company',
        'Type of contract': 'subcontract',
        'Trades': 'Masonry',
        'Items': 'Brick Work',
        'QTY': 100,
        'Rate': 50,
        'wastage': 5,
        'Responsibilities': 'Material supply, Labor'
      }
    ];

    const workbook = createExcelTemplate(templateData);
    XLSX.writeFile(workbook, 'subcontract_import_template.xlsx');
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
