
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  ProjectService, 
  SubcontractorService, 
  TradeService, 
  ResponsibilityService,
  Project,
  Subcontractor, 
  Trade, 
  Responsibility
} from '@/services/supabaseService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

// Legacy types for compatibility with existing components
interface LegacyProject {
  id: string;
  name: string;
  code: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

interface LegacySubcontractor {
  id: string;
  name: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  trades: string[];
  status: 'active' | 'inactive' | 'suspended';
  rating: number;
  totalProjects: number;
  currentProjects: number;
  registrationDate: string;
  taxId: string;
  bankAccount: string;
}

interface LegacyResponsibility {
  id: string;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DataContextType {
  // Projects
  projects: LegacyProject[];
  addProject: (projectData: any) => Promise<void>;
  updateProject: (id: string, projectData: any) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  
  // Subcontractors
  subcontractors: LegacySubcontractor[];
  addSubcontractor: (subcontractorData: any) => Promise<void>;
  updateSubcontractor: (id: string, subcontractorData: any) => Promise<void>;
  deleteSubcontractor: (id: string) => Promise<void>;
  
  // Trades
  trades: Trade[];
  
  // Responsibilities
  responsibilities: LegacyResponsibility[];
  addResponsibility: (responsibilityData: any) => Promise<void>;
  updateResponsibility: (id: string, responsibilityData: any) => Promise<void>;
  deleteResponsibility: (id: string) => Promise<void>;
  
  // Legacy subcontracts data for compatibility
  subcontracts: any[];
  
  loading: boolean;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<LegacyProject[]>([]);
  const [subcontractors, setSubcontractors] = useState<LegacySubcontractor[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [responsibilities, setResponsibilities] = useState<LegacyResponsibility[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Convert Supabase project to legacy format
  const convertProject = (project: Project): LegacyProject => ({
    id: project.id,
    name: project.name,
    code: project.code,
    location: project.location,
    createdAt: project.created_at,
    updatedAt: project.updated_at
  });

  // Convert Supabase subcontractor to legacy format
  const convertSubcontractor = (subcontractor: Subcontractor): LegacySubcontractor => ({
    id: subcontractor.id,
    name: subcontractor.name,
    companyName: subcontractor.name, // Using name as company name
    contactPerson: subcontractor.contact_person || '',
    email: subcontractor.email || '',
    phone: subcontractor.phone || '',
    address: subcontractor.address || '',
    trades: [], // This would need to be fetched from a junction table
    status: 'active', // Default status
    rating: subcontractor.rating || 0,
    totalProjects: 0, // This would need to be calculated
    currentProjects: 0, // This would need to be calculated
    registrationDate: subcontractor.created_at,
    taxId: '', // Not in current schema
    bankAccount: '' // Not in current schema
  });

  // Convert Supabase responsibility to legacy format
  const convertResponsibility = (responsibility: Responsibility): LegacyResponsibility => ({
    id: responsibility.id,
    name: responsibility.name,
    description: responsibility.description || '',
    category: responsibility.category || '',
    isActive: true, // Default to active since not in schema
    createdAt: responsibility.created_at,
    updatedAt: responsibility.updated_at
  });

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const [projectsData, subcontractorsData, tradesData, responsibilitiesData] = await Promise.all([
        ProjectService.getAll(),
        SubcontractorService.getAll(),
        TradeService.getAll(),
        ResponsibilityService.getAll()
      ]);

      setProjects(projectsData.map(convertProject));
      setSubcontractors(subcontractorsData.map(convertSubcontractor));
      setTrades(tradesData);
      setResponsibilities(responsibilitiesData.map(convertResponsibility));
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    } else {
      setProjects([]);
      setSubcontractors([]);
      setTrades([]);
      setResponsibilities([]);
      setLoading(false);
    }
  }, [user]);

  // Project functions
  const addProject = async (projectData: any) => {
    try {
      const newProject = await ProjectService.create({
        name: projectData.name,
        code: projectData.code,
        location: projectData.location
      });
      setProjects(prev => [convertProject(newProject), ...prev]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateProject = async (id: string, projectData: any) => {
    try {
      const updatedProject = await ProjectService.update(id, {
        name: projectData.name,
        code: projectData.code,
        location: projectData.location
      });
      setProjects(prev => prev.map(p => p.id === id ? convertProject(updatedProject) : p));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update project",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await ProjectService.delete(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete project",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Subcontractor functions
  const addSubcontractor = async (subcontractorData: any) => {
    try {
      const newSubcontractor = await SubcontractorService.create({
        name: subcontractorData.name,
        contact_person: subcontractorData.contactPerson,
        email: subcontractorData.email,
        phone: subcontractorData.phone,
        address: subcontractorData.address
      });
      setSubcontractors(prev => [convertSubcontractor(newSubcontractor), ...prev]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create subcontractor",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateSubcontractor = async (id: string, subcontractorData: any) => {
    try {
      const updatedSubcontractor = await SubcontractorService.update(id, {
        name: subcontractorData.name,
        contact_person: subcontractorData.contactPerson,
        email: subcontractorData.email,
        phone: subcontractorData.phone,
        address: subcontractorData.address
      });
      setSubcontractors(prev => prev.map(s => s.id === id ? convertSubcontractor(updatedSubcontractor) : s));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update subcontractor",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteSubcontractor = async (id: string) => {
    try {
      await SubcontractorService.delete(id);
      setSubcontractors(prev => prev.filter(s => s.id !== id));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete subcontractor",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Responsibility functions
  const addResponsibility = async (responsibilityData: any) => {
    try {
      const newResponsibility = await ResponsibilityService.create({
        name: responsibilityData.name,
        description: responsibilityData.description,
        category: responsibilityData.category
      });
      setResponsibilities(prev => [convertResponsibility(newResponsibility), ...prev]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create responsibility",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateResponsibility = async (id: string, responsibilityData: any) => {
    try {
      const updatedResponsibility = await ResponsibilityService.update(id, {
        name: responsibilityData.name,
        description: responsibilityData.description,
        category: responsibilityData.category
      });
      setResponsibilities(prev => prev.map(r => r.id === id ? convertResponsibility(updatedResponsibility) : r));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update responsibility",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteResponsibility = async (id: string) => {
    try {
      await ResponsibilityService.delete(id);
      setResponsibilities(prev => prev.filter(r => r.id !== id));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete responsibility",
        variant: "destructive"
      });
      throw error;
    }
  };

  const refreshData = async () => {
    await loadData();
  };

  const value = {
    projects,
    addProject,
    updateProject,
    deleteProject,
    subcontractors,
    addSubcontractor,
    updateSubcontractor,
    deleteSubcontractor,
    trades,
    responsibilities,
    addResponsibility,
    updateResponsibility,
    deleteResponsibility,
    subcontracts: [], // Empty array for compatibility
    loading,
    refreshData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
