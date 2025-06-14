
import { subcontractService, subcontractTradeItemService, subcontractResponsibilityService } from '@/services';
import { Subcontract } from '@/types/subcontract';
import { findTradeItemId, findResponsibilityId } from '@/utils/subcontractMapping';
import { useToast } from '@/hooks/use-toast';

export const createSubcontractWithTradeItems = async (
  data: Partial<Subcontract>,
  trades: any[],
  tradeItems: any[],
  toast: ReturnType<typeof useToast>['toast'],
  responsibilities: any[] = []
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
    }).filter(item => item.trade_item_id);

    console.log('Final trade items payload:', tradeItemsPayload);

    if (tradeItemsPayload.length > 0) {
      try {
        await subcontractTradeItemService.createMany(tradeItemsPayload);
        console.log('Trade items saved successfully');
      } catch (tradeItemError) {
        console.error('Error saving trade items:', tradeItemError);
        toast({
          title: "Partial Success",
          description: "Subcontract created but some trade items could not be saved. Please edit the subcontract to add them.",
          variant: "destructive"
        });
      }
    }
  }

  // Save responsibilities if any
  if (data.responsibilities && data.responsibilities.length > 0) {
    console.log('Processing responsibilities:', data.responsibilities);
    
    const responsibilityPayload = data.responsibilities.map((responsibilityName) => {
      const responsibilityId = findResponsibilityId(responsibilities, responsibilityName);
      
      console.log('Responsibility mapping:', {
        responsibilityName,
        responsibilityId
      });
      
      return {
        subcontract_id: createdSubcontract.id,
        responsibility_id: responsibilityId || '',
      };
    }).filter(item => item.responsibility_id);

    console.log('Final responsibilities payload:', responsibilityPayload);

    if (responsibilityPayload.length > 0) {
      try {
        await subcontractResponsibilityService.createMany(responsibilityPayload);
        console.log('Responsibilities saved successfully');
      } catch (responsibilityError) {
        console.error('Error saving responsibilities:', responsibilityError);
        toast({
          title: "Partial Success",
          description: "Subcontract created but some responsibilities could not be saved. Please edit the subcontract to add them.",
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
  tradeItems: any[],
  responsibilities: any[] = []
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

  // Update responsibilities if provided
  if (data.responsibilities) {
    // Delete existing responsibilities
    await subcontractResponsibilityService.deleteBySubcontractId(id);
    
    // Add new responsibilities
    if (data.responsibilities.length > 0) {
      const responsibilityPayload = data.responsibilities.map(responsibilityName => {
        const responsibilityId = findResponsibilityId(responsibilities, responsibilityName);
        
        return {
          subcontract_id: id,
          responsibility_id: responsibilityId || '',
        };
      }).filter(item => item.responsibility_id);

      if (responsibilityPayload.length > 0) {
        await subcontractResponsibilityService.createMany(responsibilityPayload);
      }
    }
  }
};

export const deleteSubcontractWithTradeItems = async (id: string) => {
  // Delete responsibilities first
  await subcontractResponsibilityService.deleteBySubcontractId(id);
  // Delete trade items
  await subcontractTradeItemService.deleteBySubcontractId(id);
  // Delete the subcontract
  await subcontractService.delete(id);
};

export const deleteManySubcontractsWithTradeItems = async (ids: string[]) => {
  for (const id of ids) {
    await subcontractResponsibilityService.deleteBySubcontractId(id);
    await subcontractTradeItemService.deleteBySubcontractId(id);
    await subcontractService.delete(id);
  }
};
