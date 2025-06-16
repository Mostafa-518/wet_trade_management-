
import { Subcontract, TradeItem } from '@/types/subcontract';

// This utility maps a DB row to the frontend Subcontract type.
export function mapSubcontractToFrontend(dbRow: any): Subcontract {
  console.log('Mapping DB row to frontend:', dbRow);
  
  // Fallbacks for required fields
  const contractType = dbRow.contractType || dbRow.contract_type || 'subcontract';
  const addendumNumber = dbRow.addendumNumber || dbRow.addendum_number || undefined;
  const parentSubcontractId = dbRow.parentSubcontractId || dbRow.parent_subcontract_id || undefined;

  // Map trade items from database format to frontend format
  let tradeItems: TradeItem[] = [];
  if (dbRow.tradeItems && Array.isArray(dbRow.tradeItems)) {
    tradeItems = dbRow.tradeItems.map((dbTradeItem: any) => {
      console.log('Processing trade item:', dbTradeItem);
      
      // Handle nested trade_items structure from Supabase joins
      const tradeItemData = dbTradeItem.trade_items || dbTradeItem;
      const tradeData = tradeItemData?.trades || {};
      
      const quantity = dbTradeItem.quantity || 0;
      const unitPrice = dbTradeItem.unit_price || 0;
      // Calculate total WITHOUT wastage: just QTY * Rate
      const total = quantity * unitPrice;
      
      return {
        id: dbTradeItem.id || crypto.randomUUID(),
        trade: tradeData.name || tradeItemData?.trade || 'Unknown Trade',
        item: tradeItemData?.name || 'Unknown Item',
        unit: tradeItemData?.unit || 'Each',
        quantity,
        unitPrice,
        total, // This excludes wastage
        wastagePercentage: dbTradeItem.wastage_percentage || 0
      };
    });
  }

  // Map responsibilities to an array of names (strings), not objects
  let responsibilities: string[] = [];
  if (dbRow.responsibilities && Array.isArray(dbRow.responsibilities)) {
    responsibilities = dbRow.responsibilities
      .map((respObj: any) => {
        // from Supabase join, format is:
        // respObj: { id, subcontract_id, responsibility_id, created_at, responsibilities: { id, name, ... } }
        if (respObj.responsibilities && respObj.responsibilities.name) {
          return respObj.responsibilities.name;
        }
        // fallback for old format or direct string
        if (typeof respObj === "string") return respObj;
        return undefined;
      })
      .filter(Boolean);
  }

  // Calculate total value without wastage
  const totalValue = tradeItems.reduce((sum, item) => sum + (item.total || 0), 0);

  const mapped = {
    id: dbRow.id,
    contractId: dbRow.contractId || dbRow.contract_number || '',
    project: dbRow.project || dbRow.project_id || '',
    subcontractor: dbRow.subcontractor || dbRow.subcontractor_id || '',
    tradeItems,
    responsibilities,
    totalValue, // Calculated without wastage
    status: dbRow.status || 'draft',
    startDate: dbRow.startDate || dbRow.start_date || '',
    endDate: dbRow.endDate || dbRow.end_date || '',
    dateOfIssuing: dbRow.dateOfIssuing || dbRow.date_of_issuing || '',
    description: dbRow.description || '',
    createdAt: dbRow.createdAt || dbRow.created_at || '',
    updatedAt: dbRow.updatedAt || dbRow.updated_at || '',
    contractType,
    addendumNumber: addendumNumber === null ? undefined : addendumNumber,
    parentSubcontractId: parentSubcontractId === null ? undefined : parentSubcontractId,
  };

  console.log('Mapped subcontract:', mapped);
  return mapped;
}

/**
 * Finds the trade item ID by tradeId and item name.
 * Used for mapping trade/item name to DB ID during subcontract save.
 */
export function findTradeItemId(tradeItems: any[], tradeId: string, itemName: string): string | undefined {
  // tradeItems: typically array of all trade items in the app [{ id, trade_id, name, ... }]
  return (tradeItems || []).find(
    (ti) => ti.trade_id === tradeId && ti.name === itemName
  )?.id;
}

/**
 * Finds the responsibility ID by name.
 * Used for mapping responsibility name to DB ID during subcontract save.
 */
export function findResponsibilityId(responsibilities: any[], responsibilityName: string): string | undefined {
  // responsibilities: typically array of all responsibilities [{ id, name, ... }]
  return (responsibilities || []).find(
    (resp) => resp.name === responsibilityName
  )?.id;
}

/**
 * Generates the next addendum number for a given parent contract
 * Uses the contract_number field to find existing addendums
 */
export async function getNextAddendumNumber(
  parentContractNumber: string,
  existingContracts: Subcontract[] = []
): Promise<string> {
  console.log('Getting next addendum number for parent contract:', parentContractNumber);
  
  // Find existing addendums for this parent contract using the contract_number pattern
  const addendumPattern = new RegExp(`^${parentContractNumber.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}-ADD(\\d{2})$`);
  
  const existingAddendums = existingContracts.filter(contract => {
    const match = contract.contractId.match(addendumPattern);
    return match && contract.contractType === 'ADD';
  });
  
  console.log('Found existing addendums:', existingAddendums.length);
  
  // Find the highest addendum number
  let maxAddendumNumber = 0;
  existingAddendums.forEach(contract => {
    const match = contract.contractId.match(addendumPattern);
    if (match) {
      const addendumNum = parseInt(match[1], 10);
      if (addendumNum > maxAddendumNumber) {
        maxAddendumNumber = addendumNum;
      }
    }
  });
  
  // Generate next addendum number (ADD01, ADD02, etc.)
  const nextAddendumNumber = (maxAddendumNumber + 1).toString().padStart(2, '0');
  console.log('Next addendum number:', nextAddendumNumber);
  
  return nextAddendumNumber;
}

/**
 * Generates a unique contract ID based on the contract type and project
 * Format: ID-[project-code]-XXXX for subcontracts
 * Format: [parent-contract-number]-ADDXX for addendums
 */
export async function generateContractId(
  contractType: 'subcontract' | 'ADD',
  projectCode: string,
  parentSubcontractId?: string,
  existingContracts: Subcontract[] = []
): Promise<string> {
  console.log('Generating contract ID:', { contractType, projectCode, parentSubcontractId });
  
  if (contractType === 'ADD') {
    if (!parentSubcontractId) {
      throw new Error('Parent contract ID is required for addendums');
    }
    
    // Find the parent contract to get its contract_number
    const parentContract = existingContracts.find(contract => contract.id === parentSubcontractId);
    if (!parentContract) {
      throw new Error('Parent contract not found');
    }
    
    const parentContractNumber = parentContract.contractId;
    console.log('Parent contract number:', parentContractNumber);
    
    // Get the next addendum number for this parent contract
    const nextAddendumNumber = await getNextAddendumNumber(parentContractNumber, existingContracts);
    const generatedId = `${parentContractNumber}-ADD${nextAddendumNumber}`;
    
    console.log('Generated addendum ID:', generatedId);
    return generatedId;
  } else {
    // For regular subcontracts: ID-[project-code]-XXXX
    // Find existing subcontracts for this project
    const projectPattern = `ID-${projectCode}-`;
    const projectContracts = existingContracts.filter(
      contract => contract.contractId.startsWith(projectPattern) && contract.contractType === 'subcontract'
    );
    
    console.log('Existing contracts for project:', projectContracts.length);
    
    // Find the highest sequential number for this project
    let maxNumber = 0;
    projectContracts.forEach(contract => {
      const match = contract.contractId.match(new RegExp(`ID-${projectCode}-(\\d{4})$`));
      if (match) {
        const number = parseInt(match[1], 10);
        if (number > maxNumber) {
          maxNumber = number;
        }
      }
    });
    
    // Generate next sequential number
    const nextNumber = (maxNumber + 1).toString().padStart(4, '0');
    const generatedId = `ID-${projectCode}-${nextNumber}`;
    
    console.log('Generated subcontract ID:', generatedId);
    return generatedId;
  }
}

/**
 * Validates that a contract ID is unique among existing contracts
 */
export function validateContractIdUniqueness(
  contractId: string,
  existingContracts: Subcontract[]
): boolean {
  const isDuplicate = existingContracts.some(contract => contract.contractId === contractId);
  console.log('Contract ID uniqueness check:', { contractId, isDuplicate: isDuplicate });
  return !isDuplicate;
}

/**
 * Validates addendum contract ID format
 * Expected format: [parent-contract-number]-ADDXX (e.g., ID-0504-0001-ADD01)
 */
export function validateAddendumFormat(contractId: string): boolean {
  const addendumPattern = /^.+-ADD\d{2}$/;
  return addendumPattern.test(contractId);
}

/**
 * Validates regular subcontract ID format
 * Expected format: ID-[project-code]-XXXX (e.g., ID-0504-0001)
 */
export function validateSubcontractFormat(contractId: string, projectCode: string): boolean {
  const subcontractPattern = new RegExp(`^ID-${projectCode}-\\d{4}$`);
  return subcontractPattern.test(contractId);
}
