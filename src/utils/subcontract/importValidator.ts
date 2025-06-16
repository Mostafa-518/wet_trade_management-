
import { SubcontractImportData } from './dataMapper';

export const validateRow = (row: SubcontractImportData, index: number): string[] => {
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

export const validateContractData = (row: SubcontractImportData): string[] => {
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
