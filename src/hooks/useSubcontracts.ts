
import { useQuery } from '@tanstack/react-query';
import { subcontractService, subcontractTradeItemService } from '@/services';
import { Subcontract } from '@/types/subcontract';
import { useToast } from '@/hooks/use-toast';

export function useSubcontracts(trades: any[] = [], tradeItems: any[] = []) {
  const { toast } = useToast();

  const { data: subcontractsRaw = [], refetch: refetchSubcontracts, isLoading: subcontractsLoading } = useQuery({
    queryKey: ['subcontracts'],
    queryFn: async () => {
      const data = await subcontractService.getWithTradeItems();
      console.log('Raw subcontracts from database:', data);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Helper function to map trade items from database to frontend format
  const mapTradeItemsToFrontend = (dbTradeItems: any[]) => {
    return dbTradeItems.map((dbItem: any) => {
      const tradeItem = dbItem.trade_items;
      const trade = tradeItem?.trades;
      
      return {
        id: dbItem.id,
        trade: trade?.name || tradeItem?.trade_id || '',
        item: tradeItem?.name || '',
        unit: tradeItem?.unit || '',
        quantity: dbItem.quantity || 0,
        unitPrice: dbItem.unit_price || 0,
        total: dbItem.total_price || 0,
      };
    });
  };

  // Helper function to find trade item ID by trade ID and item name
  const findTradeItemId = (tradeId: string, itemName: string) => {
    const tradeItem = tradeItems.find(item => 
      item.trade_id === tradeId && item.name === itemName
    );
    return tradeItem?.id;
  };

  const addSubcontract = async (data: Partial<Subcontract>) => {
    try {
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
        const tradeItemsPayload = data.tradeItems.map(item => {
          const tradeId = trades.find(t => t.name === item.trade)?.id;
          const tradeItemId = findTradeItemId(tradeId || '', item.item);
          
          return {
            subcontract_id: createdSubcontract.id,
            trade_item_id: tradeItemId || '',
            quantity: item.quantity,
            unit_price: item.unitPrice,
            total_price: item.total,
          };
        }).filter(item => item.trade_item_id); // Only include items with valid trade_item_id

        if (tradeItemsPayload.length > 0) {
          await subcontractTradeItemService.createMany(tradeItemsPayload);
        }
      }

      await refetchSubcontracts();
      toast({ title: "Success", description: "Subcontract created successfully" });
    } catch (error) {
      console.error('Error adding subcontract:', error);
      toast({ 
        title: "Error", 
        description: `Failed to add subcontract: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        variant: "destructive" 
      });
      throw error;
    }
  };

  const updateSubcontract = async (id: string, data: Partial<Subcontract>) => {
    try {
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
            const tradeItemId = findTradeItemId(tradeId || '', item.item);
            
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

      await refetchSubcontracts();
      toast({ title: "Success", description: "Subcontract updated successfully" });
    } catch (error) {
      console.error('Error updating subcontract:', error);
      toast({ title: "Error", description: "Failed to update subcontract", variant: "destructive" });
      throw error;
    }
  };

  const deleteSubcontract = async (id: string) => {
    try {
      // Delete trade items first (due to foreign key constraints)
      await subcontractTradeItemService.deleteBySubcontractId(id);
      // Delete the subcontract
      await subcontractService.delete(id);
      await refetchSubcontracts();
      toast({ title: "Success", description: "Subcontract deleted successfully" });
    } catch (error) {
      console.error('Error deleting subcontract:', error);
      toast({ title: "Error", description: "Failed to delete subcontract", variant: "destructive" });
      throw error;
    }
  };

  const deleteManySubcontracts = async (ids: string[]) => {
    try {
      for (const id of ids) {
        await subcontractTradeItemService.deleteBySubcontractId(id);
        await subcontractService.delete(id);
      }
      await refetchSubcontracts();
      toast({ title: "Deleted", description: "Subcontracts deleted successfully" });
    } catch (error) {
      console.error('Error bulk deleting subcontracts:', error);
      toast({ title: "Error", description: "Failed to delete selected subcontracts", variant: "destructive" });
      throw error;
    }
  };

  // Map database fields to frontend expected format
  const subcontracts = subcontractsRaw.map((s: any) => ({
    id: s.id,
    contractId: s.contract_number || `SC-${s.id.slice(0, 8)}`,
    project: s.project_id,
    subcontractor: s.subcontractor_id,
    tradeItems: s.tradeItems ? mapTradeItemsToFrontend(s.tradeItems) : [],
    responsibilities: [],
    totalValue: s.total_value || 0,
    status: s.status || 'draft',
    startDate: s.start_date,
    endDate: s.end_date,
    description: s.description || '',
    createdAt: s.created_at,
    updatedAt: s.updated_at,
  }));

  console.log('Mapped subcontracts:', subcontracts);

  return {
    subcontracts,
    addSubcontract,
    updateSubcontract,
    deleteSubcontract,
    deleteManySubcontracts,
    isLoading: subcontractsLoading
  };
}
