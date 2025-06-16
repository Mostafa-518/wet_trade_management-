
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

export const mapRawDataToSubcontractData = (dataRows: any[][]): SubcontractImportData[] => {
  return dataRows
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
};

export const processExcelMergedCells = (data: SubcontractImportData[]): SubcontractImportData[] => {
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

export const groupByContract = (data: SubcontractImportData[]) => {
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

export { type SubcontractImportData };
