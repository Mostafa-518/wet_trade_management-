
import { TradeItem } from '@/types/subcontract';

// Helper function to map trade items from database to frontend format
export const mapTradeItemsToFrontend = (dbTradeItems: any[]): TradeItem[] => {
  console.log('Mapping trade items:', dbTradeItems);
  
  return dbTradeItems.map((dbItem: any) => {
    const tradeItem = dbItem.trade_items;
    const trade = tradeItem?.trades;
    
    console.log('Processing db item:', {
      dbItem,
      tradeItem,
      trade,
      tradeName: trade?.name,
      itemName: tradeItem?.name
    });
    
    return {
      id: dbItem.id,
      trade: trade?.name || 'Unknown Trade',
      item: tradeItem?.name || 'Unknown Item',
      unit: tradeItem?.unit || '',
      quantity: dbItem.quantity || 0,
      unitPrice: dbItem.unit_price || 0,
      total: dbItem.total_price || 0,
    };
  });
};

// Helper function to map responsibilities from database to frontend format
export const mapResponsibilitiesToFrontend = (dbResponsibilities: any[]): string[] => {
  console.log('Mapping responsibilities:', dbResponsibilities);
  
  return dbResponsibilities.map((dbItem: any) => {
    const responsibility = dbItem.responsibilities;
    return responsibility?.name || 'Unknown Responsibility';
  });
};

// Helper function to find trade item ID by trade ID and item name
export const findTradeItemId = (tradeItems: any[], tradeId: string, itemName: string): string | undefined => {
  const tradeItem = tradeItems.find(item => 
    item.trade_id === tradeId && item.name === itemName
  );
  return tradeItem?.id;
};

// Helper function to find responsibility ID by name
export const findResponsibilityId = (responsibilities: any[], responsibilityName: string): string | undefined => {
  const responsibility = responsibilities.find(item => 
    item.name === responsibilityName
  );
  return responsibility?.id;
};

// Map database subcontract to frontend format
export const mapSubcontractToFrontend = (s: any) => {
  console.log('Processing subcontract:', s.id, 'with tradeItems:', s.tradeItems, 'and responsibilities:', s.responsibilities);
  
  const mappedTradeItems = s.tradeItems && s.tradeItems.length > 0 
    ? mapTradeItemsToFrontend(s.tradeItems) 
    : [];
  
  const mappedResponsibilities = s.responsibilities && s.responsibilities.length > 0 
    ? mapResponsibilitiesToFrontend(s.responsibilities) 
    : [];
  
  console.log('Mapped trade items for subcontract', s.id, ':', mappedTradeItems);
  console.log('Mapped responsibilities for subcontract', s.id, ':', mappedResponsibilities);
  
  return {
    id: s.id,
    contractId: s.contract_number || `SC-${s.id.slice(0, 8)}`,
    project: s.project_id,
    subcontractor: s.subcontractor_id,
    tradeItems: mappedTradeItems,
    responsibilities: mappedResponsibilities,
    totalValue: s.total_value || 0,
    status: s.status || 'draft',
    startDate: s.start_date,
    endDate: s.end_date,
    description: s.description || '',
    createdAt: s.created_at,
    updatedAt: s.updated_at,
  };
};
