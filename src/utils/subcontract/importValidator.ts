
import { SubcontractImportData } from './dataMapper';

export const validateRow = (row: SubcontractImportData, index: number): string[] => {
  const errors: string[] = [];

  console.log(`Validating row ${index}:`, row);

  // Required fields validation with more flexible checking
  if (!row['Project Name'] || !row['Project Name'].trim()) {
    errors.push('Project Name is required');
  }
  if (!row['Subcontractor Company'] || !row['Subcontractor Company'].trim()) {
    errors.push('Subcontractor Company is required');
  }
  if (!row['Type of contract'] || !row['Type of contract'].trim()) {
    errors.push('Type of contract is required');
  }

  // Only validate Trades and Items if we have contract-level data
  if (row['Project Name'] && row['Subcontractor Company']) {
    if (!row['Trades'] || !row['Trades'].trim()) {
      errors.push('Trades is required');
    }
    if (!row['Items'] || !row['Items'].trim()) {
      errors.push('Items is required');
    }
  }

  // Numeric validations - handle both string and number types from Excel
  const qtyValue = row['QTY'];
  if (qtyValue !== undefined && qtyValue !== null && qtyValue !== '') {
    const qty = Number(qtyValue);
    if (isNaN(qty) || qty < 0) {
      errors.push('QTY must be a non-negative number');
    }
  }
  
  const rateValue = row['Rate'];
  if (rateValue !== undefined && rateValue !== null && rateValue !== '') {
    const rate = Number(rateValue);
    if (isNaN(rate) || rate < 0) {
      errors.push('Rate must be a non-negative number');
    }
  }
  
  const wastageValue = row['wastage'];
  if (wastageValue !== undefined && wastageValue !== null && wastageValue !== '') {
    const wastage = Number(wastageValue);
    if (isNaN(wastage) || wastage < 0 || wastage > 100) {
      errors.push('Wastage must be a number between 0 and 100');
    }
  }

  // Date validation - be more flexible
  if (row['Date of Issuing'] && row['Date of Issuing'].trim()) {
    const dateStr = row['Date of Issuing'].trim();
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      // Try different date formats
      const altDate = new Date(dateStr.replace(/\//g, '-'));
      if (isNaN(altDate.getTime())) {
        errors.push('Date of Issuing must be a valid date (YYYY-MM-DD or MM/DD/YYYY format)');
      }
    }
  }

  // Contract type validation - be case insensitive
  if (row['Type of contract'] && row['Type of contract'].trim()) {
    const contractType = row['Type of contract'].trim().toLowerCase();
    if (!['subcontract', 'add'].includes(contractType)) {
      errors.push('Type of contract must be either "subcontract" or "ADD"');
    }
  }

  console.log(`Validation errors for row ${index}:`, errors);
  return errors;
};

export const validateContractData = (row: SubcontractImportData): string[] => {
  const errors: string[] = [];

  console.log('Validating contract data:', row);

  if (!row['Project Name'] || !row['Project Name'].trim()) {
    errors.push('Project Name is required');
  }
  if (!row['Subcontractor Company'] || !row['Subcontractor Company'].trim()) {
    errors.push('Subcontractor Company is required');
  }
  if (!row['Type of contract'] || !row['Type of contract'].trim()) {
    errors.push('Type of contract is required');
  }

  // Date validation
  if (row['Date of Issuing'] && row['Date of Issuing'].trim()) {
    const dateStr = row['Date of Issuing'].trim();
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      const altDate = new Date(dateStr.replace(/\//g, '-'));
      if (isNaN(altDate.getTime())) {
        errors.push('Date of Issuing must be a valid date');
      }
    }
  }

  // Contract type validation
  if (row['Type of contract'] && row['Type of contract'].trim()) {
    const contractType = row['Type of contract'].trim().toLowerCase();
    if (!['subcontract', 'add'].includes(contractType)) {
      errors.push('Type of contract must be either "subcontract" or "ADD"');
    }
  }

  console.log('Contract validation errors:', errors);
  return errors;
};
