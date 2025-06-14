
import { useQuery } from '@tanstack/react-query';
import { projectService } from '@/services/supabaseService';
import { ProjectFormData } from '@/types/project';
import { useToast } from '@/hooks/use-toast';

export function useProjects() {
  const { toast } = useToast();

  const { data: projects = [], refetch: refetchProjects, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const addProject = async (data: ProjectFormData): Promise<void> => {
    try {
      await projectService.create({
        name: data.name,
        code: data.code,
        location: data.location,
        description: data.description,
        start_date: data.startDate,
        end_date: data.endDate,
        status: data.status as any
      });
      refetchProjects();
      toast({
        title: "Success",
        description: "Project created successfully",
      });
    } catch (error) {
      console.error('Error adding project:', error);
      toast({
        title: "Error",
        description: "Failed to add project",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateProject = async (id: string, data: ProjectFormData): Promise<void> => {
    try {
      await projectService.update(id, {
        name: data.name,
        code: data.code,
        location: data.location,
        description: data.description,
        start_date: data.startDate,
        end_date: data.endDate,
        status: data.status as any
      });
      refetchProjects();
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteProject = async (id: string): Promise<void> => {
    try {
      await projectService.delete(id);
      refetchProjects();
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    projects: projects.map(p => ({
      ...p,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
      startDate: p.start_date,
      endDate: p.end_date
    })),
    addProject,
    updateProject,
    deleteProject,
    isLoading: projectsLoading
  };
}
