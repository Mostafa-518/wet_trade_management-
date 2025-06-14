
import { useQuery } from '@tanstack/react-query';
import { subcontractorService } from '@/services/supabaseService';
import { SubcontractorFormData } from '@/types/subcontractor';
import { useToast } from '@/hooks/use-toast';

export function useSubcontractors() {
  const { toast } = useToast();

  const { data: subcontractors = [], refetch: refetchSubcontractors, isLoading: subcontractorsLoading } = useQuery({
    queryKey: ['subcontractors'],
    queryFn: () => subcontractorService.getAll(),
    staleTime: 5 * 60 * 1000,
  });

  const addSubcontractor = async (data: SubcontractorFormData): Promise<void> => {
    try {
      await subcontractorService.create({
        name: data.name,
        contact_person: data.contactPerson,
        email: data.email,
        phone: data.phone,
        address: data.address,
        license_number: data.licenseNumber,
        rating: data.rating
      });
      refetchSubcontractors();
      toast({
        title: "Success",
        description: "Subcontractor created successfully",
      });
    } catch (error) {
      console.error('Error adding subcontractor:', error);
      toast({
        title: "Error",
        description: "Failed to add subcontractor",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateSubcontractor = async (id: string, data: SubcontractorFormData): Promise<void> => {
    try {
      await subcontractorService.update(id, {
        name: data.name,
        contact_person: data.contactPerson,
        email: data.email,
        phone: data.phone,
        address: data.address,
        license_number: data.licenseNumber,
        rating: data.rating
      });
      refetchSubcontractors();
      toast({
        title: "Success",
        description: "Subcontractor updated successfully",
      });
    } catch (error) {
      console.error('Error updating subcontractor:', error);
      toast({
        title: "Error",
        description: "Failed to update subcontractor",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteSubcontractor = async (id: string): Promise<void> => {
    try {
      await subcontractorService.delete(id);
      refetchSubcontractors();
      toast({
        title: "Success",
        description: "Subcontractor deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting subcontractor:', error);
      toast({
        title: "Error",
        description: "Failed to delete subcontractor",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    subcontractors: subcontractors.map(s => ({
      id: s.id,
      name: s.name,
      companyName: s.name,
      contactPerson: s.contact_person || '',
      email: s.email || '',
      phone: s.phone || '',
      address: s.address || '',
      licenseNumber: s.license_number,
      rating: s.rating || 0,
      trades: [],
      status: 'active' as const,
      totalProjects: 0,
      currentProjects: 0,
      taxId: '',
      bankAccount: '',
      registrationDate: s.created_at,
      createdAt: s.created_at,
      updatedAt: s.updated_at
    })),
    addSubcontractor,
    updateSubcontractor,
    deleteSubcontractor,
    isLoading: subcontractorsLoading
  };
}
