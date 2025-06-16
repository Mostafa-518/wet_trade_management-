
import * as XLSX from 'xlsx';

export interface ExcelParseOptions {
  header?: number;
  defval?: string;
  raw?: boolean;
}

export const parseExcelFile = async (file: File): Promise<any[][]> => {
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
  return rawData as any[][];
};

export const validateExcelFile = (file: File): string | null => {
  // Validate file type
  if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
    return "Please upload an Excel file (.xlsx or .xls)";
  }

  // Validate file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    return "Please upload a file smaller than 5MB";
  }

  return null;
};

export const createExcelTemplate = (templateData: any[]) => {
  const worksheet = XLSX.utils.json_to_sheet(templateData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Subcontracts');
  return workbook;
};
