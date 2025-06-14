
import { useQuery } from '@tanstack/react-query';
import { subcontractService } from '@/services/supabaseService';
import { Subcontract } from '@/types/subcontract';
import { useToast } from '@/hooks/use-toast';

export function useSubcontracts() {
  const { toast } = useToast();

  const { data: subcontractsRaw = [], refetch: refetchSubcontracts, isLoading: subcontractsLoading } = useQuery({
    queryKey: ['subcontracts'],
    queryFn: () => subcontractService.getAll(),
    staleTime: 5 * 60 * 1000,
  });

  const addSubcontract = async (data: Partial<Subcontract>) => {
    try {
      console.log('Adding subcontract with data:', data);
      
      // Validate that project and subcontractor are UUIDs
      if (!data.project || !data.subcontractor) {
        throw new Error('Project and subcontractor are required');
      }

      const subcontractPayload = {
        contract_number: data.contractId,
        project_id: data.project, // Should be UUID
        subcontractor_id: data.subcontractor, // Should be UUID
        status: data.status || 'draft',
        total_value: data.totalValue || 0,
        start_date: data.startDate,
        end_date: data.endDate,
        description: data.description || '',
      };

      console.log('Supabase payload:', subcontractPayload);
      
      await subcontractService.create(subcontractPayload);
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

  return {
    subcontracts: subcontractsRaw.map((s: any) => ({
      id: s.id,
      contractId: s.contract_number,
      project: s.project_id,
      subcontractor: s.subcontractor_id,
      tradeItems: [],
      responsibilities: [],
      totalValue: s.total_value,
      status: s.status,
      startDate: s.start_date,
      endDate: s.end_date,
      description: s.description || '',
      createdAt: s.created_at,
      updatedAt: s.updated_at,
    })),
    addSubcontract,
    updateSubcontract,
    deleteSubcontract,
    deleteManySubcontracts,
    isLoading: subcontractsLoading
  };
}
