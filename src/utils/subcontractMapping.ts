import { Subcontract, TradeItem } from '@/types/subcontract';

// This utility maps a DB row to the frontend Subcontract type.
export function mapSubcontractToFrontend(dbRow: any): Subcontract {
  // Fallbacks for required fields
  const contractType = dbRow.contractType || dbRow.contract_type || 'subcontract';
  const addendumNumber = dbRow.addendumNumber || dbRow.addendum_number || undefined;
  const parentSubcontractId = dbRow.parentSubcontractId || dbRow.parent_subcontract_id || undefined;

  // Fix responsibilities: map array of objects to array of names
  // Handles both structures: array of objects (with .responsibilities.name), or array of strings
  let responsibilities: string[] = [];
  if (Array.isArray(dbRow.responsibilities)) {
    // handles the case where dbRow.responsibilities is an array of objects with a 'responsibilities' property
    responsibilities = dbRow.responsibilities.map((respObj: any) => {
      // Support both { name: "X" } and { responsibilities: { name: "X" } }
      if (typeof respObj === 'string') return respObj;
      if (respObj && typeof respObj === 'object') {
        if (respObj.responsibilities && respObj.responsibilities.name) return respObj.responsibilities.name;
        if (respObj.name) return respObj.name;
      }
      return null;
    }).filter(Boolean);
  }

  return {
    id: dbRow.id,
    contractId: dbRow.contractId || dbRow.contract_number || '', // adapt as needed
    project: dbRow.project || dbRow.project_id || '',
    subcontractor: dbRow.subcontractor || dbRow.subcontractor_id || '',
    tradeItems: dbRow.tradeItems || [],
    responsibilities,
    totalValue: dbRow.totalValue || dbRow.total_value || 0,
    status: dbRow.status || 'draft',
    startDate: dbRow.startDate || dbRow.start_date || '',
    endDate: dbRow.endDate || dbRow.end_date || '',
    dateOfIssuing: dbRow.dateOfIssuing || dbRow.date_of_issuing || '',
    description: dbRow.description || '',
    createdAt: dbRow.createdAt || dbRow.created_at || '',
    updatedAt: dbRow.updatedAt || dbRow.updated_at || '',
    contractType,
    addendumNumber,
    parentSubcontractId,
  };
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
