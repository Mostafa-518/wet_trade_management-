
import { Subcontract, TradeItem } from '@/types/subcontract';

// This utility maps a DB row to the frontend Subcontract type.
export function mapSubcontractToFrontend(dbRow: any): Subcontract {
  // Fallbacks for required fields
  const contractType = dbRow.contractType || dbRow.contract_type || 'subcontract';
  const addendumNumber = dbRow.addendumNumber || dbRow.addendum_number || undefined;
  const parentSubcontractId = dbRow.parentSubcontractId || dbRow.parent_subcontract_id || undefined;

  // --- NEW FIX: Map responsibilities to an array of names (strings), not objects ---
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

