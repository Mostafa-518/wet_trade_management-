
import { subcontractService, subcontractTradeItemService } from '@/services';
import { Subcontract } from '@/types/subcontract';
import { findTradeItemId } from '@/utils/subcontractMapping';
import { useToast } from '@/hooks/use-toast';

export const createSubcontractWithTradeItems = async (
  data: Partial<Subcontract>,
  trades: any[],
  tradeItems: any[],
  toast: ReturnType<typeof useToast>['toast']
) => {
  console.log('Adding subcontract with data:', data);
  
  if (!data.project || !data.subcontractor) {
    throw new Error('Project and subcontractor are required');
  }

  const subcontractPayload = {
    contract_number: data.contractId,
    project_id: data.project,
    subcontractor_id: data.subcontractor,
    status: data.status || 'draft',
    total_value: data.totalValue || 0,
    start_date: data.startDate,
    end_date: data.endDate,
    description: data.description || '',
  };

  console.log('Supabase payload:', subcontractPayload);
  
  const createdSubcontract = await subcontractService.create(subcontractPayload);
  
  // Save trade items if any
  if (data.tradeItems && data.tradeItems.length > 0) {
    console.log('Processing trade items:', data.tradeItems);
    
    const tradeItemsPayload = data.tradeItems.map((item, index) => {
      const tradeId = trades.find(t => t.name === item.trade)?.id;
      const tradeItemId = findTradeItemId(tradeItems, tradeId || '', item.item);
      
      console.log(`Trade item ${index}:`, {
        tradeName: item.trade,
        tradeId,
        itemName: item.item,
        tradeItemId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total
      });
      
      return {
        subcontract_id: createdSubcontract.id,
        trade_item_id: tradeItemId || '',
        quantity: item.quantity,
        unit_price: item.unitPrice,
        total_price: item.total,
      };
    }).filter(item => item.trade_item_id); // Only include items with valid trade_item_id

    console.log('Final trade items payload:', tradeItemsPayload);

    if (tradeItemsPayload.length > 0) {
      try {
        await subcontractTradeItemService.createMany(tradeItemsPayload);
        console.log('Trade items saved successfully');
      } catch (tradeItemError) {
        console.error('Error saving trade items:', tradeItemError);
        // If trade items fail, we should still show success for the subcontract
        // but inform user about trade items issue
        toast({
          title: "Partial Success",
          description: "Subcontract created but some trade items could not be saved. Please edit the subcontract to add them.",
          variant: "destructive"
        });
      }
    }
  }

  return createdSubcontract;
};

export const updateSubcontractWithTradeItems = async (
  id: string,
  data: Partial<Subcontract>,
  trades: any[],
  tradeItems: any[]
) => {
  console.log('Updating subcontract:', id, data);
  
  const updatePayload = {
    contract_number: data.contractId,
    project_id: data.project,
    subcontractor_id: data.subcontractor,
    status: data.status,
    total_value: data.totalValue,
    start_date: data.startDate,
    end_date: data.endDate,
    description: data.description || '',
  };

  await subcontractService.update(id, updatePayload);

  // Update trade items if provided
  if (data.tradeItems) {
    // Delete existing trade items
    await subcontractTradeItemService.deleteBySubcontractId(id);
    
    // Add new trade items
    if (data.tradeItems.length > 0) {
      const tradeItemsPayload = data.tradeItems.map(item => {
        const tradeId = trades.find(t => t.name === item.trade)?.id;
        const tradeItemId = findTradeItemId(tradeItems, tradeId || '', item.item);
        
        return {
          subcontract_id: id,
          trade_item_id: tradeItemId || '',
          quantity: item.quantity,
          unit_price: item.unitPrice,
          total_price: item.total,
        };
      }).filter(item => item.trade_item_id);

      if (tradeItemsPayload.length > 0) {
        await subcontractTradeItemService.createMany(tradeItemsPayload);
      }
    }
  }
};

export const deleteSubcontractWithTradeItems = async (id: string) => {
  // Delete trade items first (due to foreign key constraints)
  await subcontractTradeItemService.deleteBySubcontractId(id);
  // Delete the subcontract
  await subcontractService.delete(id);
};

export const deleteManySubcontractsWithTradeItems = async (ids: string[]) => {
  for (const id of ids) {
    await subcontractTradeItemService.deleteBySubcontractId(id);
    await subcontractService.delete(id);
  }
};
