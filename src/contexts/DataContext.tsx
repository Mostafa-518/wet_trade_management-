import React, { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  projectService, 
  subcontractorService, 
  tradeService, 
  responsibilityService,
  tradeItemService,
  subcontractService
} from '@/services/supabaseService';
import { Project, ProjectFormData } from '@/types/project';
import { Subcontractor, SubcontractorFormData } from '@/types/subcontractor';
import { Trade } from '@/types/trade';
import { Responsibility } from '@/types/responsibility';
import { Subcontract } from '@/types/subcontract';
import { useToast } from '@/hooks/use-toast';

// Define TradeItem type based on database schema
interface TradeItem {
  id: string;
  trade_id: string;
  name: string;
  description?: string;
  unit?: string;
  created_at: string;
  updated_at: string;
}

interface DataContextType {
  // Projects
  projects: Project[];
  addProject: (data: ProjectFormData) => Promise<void>;
  updateProject: (id: string, data: ProjectFormData) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  
  // Subcontractors
  subcontractors: Subcontractor[];
  addSubcontractor: (data: SubcontractorFormData) => Promise<void>;
  updateSubcontractor: (id: string, data: SubcontractorFormData) => Promise<void>;
  deleteSubcontractor: (id: string) => Promise<void>;
  
  // Trades
  trades: Trade[];
  addTrade: (data: Partial<Trade>) => Promise<void>;
  updateTrade: (id: string, data: Partial<Trade>) => Promise<void>;
  deleteTrade: (id: string) => Promise<void>;
  
  // Trade Items
  tradeItems: TradeItem[];
  addTradeItem: (data: Partial<TradeItem>) => Promise<void>;
  updateTradeItem: (id: string, data: Partial<TradeItem>) => Promise<void>;
  deleteTradeItem: (id: string) => Promise<void>;
  
  // Responsibilities
  responsibilities: Responsibility[];
  addResponsibility: (data: Partial<Responsibility>) => Promise<void>;
  updateResponsibility: (id: string, data: Partial<Responsibility>) => Promise<void>;
  deleteResponsibility: (id: string) => Promise<void>;
  
  // Subcontracts
  subcontracts: Subcontract[];
  addSubcontract: (data: Partial<Subcontract>) => Promise<void>;
  updateSubcontract: (id: string, data: Partial<Subcontract>) => Promise<void>;
  deleteSubcontract: (id: string) => Promise<void>;
  deleteManySubcontracts: (ids: string[]) => Promise<void>;
  
  // Loading states
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();

  // Fetch data using React Query with proper error handling
  const { data: projects = [], refetch: refetchProjects, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Subcontractors
  const { data: subcontractors = [], refetch: refetchSubcontractors, isLoading: subcontractorsLoading } = useQuery({
    queryKey: ['subcontractors'],
    queryFn: () => subcontractorService.getAll(),
    staleTime: 5 * 60 * 1000,
  });

  // Trades
  const { data: trades = [], refetch: refetchTrades, isLoading: tradesLoading } = useQuery({
    queryKey: ['trades'],
    queryFn: () => tradeService.getAll(),
    staleTime: 5 * 60 * 1000,
  });

  // Trade Items
  const { data: tradeItems = [], refetch: refetchTradeItems, isLoading: tradeItemsLoading } = useQuery({
    queryKey: ['tradeItems'],
    queryFn: () => tradeItemService.getAll(),
    staleTime: 5 * 60 * 1000,
  });

  // Responsibilities
  const { data: responsibilities = [], refetch: refetchResponsibilities, isLoading: responsibilitiesLoading } = useQuery({
    queryKey: ['responsibilities'],
    queryFn: () => responsibilityService.getAll(),
    staleTime: 5 * 60 * 1000,
  });

  // Subcontracts
  const { data: subcontractsRaw = [], refetch: refetchSubcontracts, isLoading: subcontractsLoading } = useQuery({
    queryKey: ['subcontracts'],
    queryFn: () => subcontractService.getAll(),
    staleTime: 5 * 60 * 1000,
  });

  // Project operations
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

  // Subcontractor operations
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

  // Trade operations
  const addTrade = async (data: Partial<Trade>): Promise<void> => {
    try {
      await tradeService.create({
        name: data.name!,
        category: data.category!,
        description: data.description
      });
      refetchTrades();
      toast({
        title: "Success",
        description: "Trade created successfully",
      });
    } catch (error) {
      console.error('Error adding trade:', error);
      toast({
        title: "Error",
        description: "Failed to add trade",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateTrade = async (id: string, data: Partial<Trade>): Promise<void> => {
    try {
      await tradeService.update(id, {
        name: data.name,
        category: data.category,
        description: data.description
      });
      refetchTrades();
      toast({
        title: "Success",
        description: "Trade updated successfully",
      });
    } catch (error) {
      console.error('Error updating trade:', error);
      toast({
        title: "Error",
        description: "Failed to update trade",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteTrade = async (id: string): Promise<void> => {
    try {
      await tradeService.delete(id);
      refetchTrades();
      toast({
        title: "Success",
        description: "Trade deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting trade:', error);
      toast({
        title: "Error",
        description: "Failed to delete trade",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Trade Item operations
  const addTradeItem = async (data: Partial<TradeItem>): Promise<void> => {
    try {
      await tradeItemService.create({
        trade_id: data.trade_id!,
        name: data.name!,
        description: data.description,
        unit: data.unit
      });
      refetchTradeItems();
      toast({
        title: "Success",
        description: "Trade item created successfully",
      });
    } catch (error) {
      console.error('Error adding trade item:', error);
      toast({
        title: "Error",
        description: "Failed to add trade item",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateTradeItem = async (id: string, data: Partial<TradeItem>): Promise<void> => {
    try {
      await tradeItemService.update(id, {
        name: data.name,
        description: data.description,
        unit: data.unit
      });
      refetchTradeItems();
      toast({
        title: "Success",
        description: "Trade item updated successfully",
      });
    } catch (error) {
      console.error('Error updating trade item:', error);
      toast({
        title: "Error",
        description: "Failed to update trade item",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteTradeItem = async (id: string): Promise<void> => {
    try {
      await tradeItemService.delete(id);
      refetchTradeItems();
      toast({
        title: "Success",
        description: "Trade item deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting trade item:', error);
      toast({
        title: "Error",
        description: "Failed to delete trade item",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Responsibility operations
  const addResponsibility = async (data: Partial<Responsibility>): Promise<void> => {
    try {
      await responsibilityService.create({
        name: data.name!,
        description: data.description,
        category: data.category
      });
      refetchResponsibilities();
      toast({
        title: "Success",
        description: "Responsibility created successfully",
      });
    } catch (error) {
      console.error('Error adding responsibility:', error);
      toast({
        title: "Error",
        description: "Failed to add responsibility",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateResponsibility = async (id: string, data: Partial<Responsibility>): Promise<void> => {
    try {
      await responsibilityService.update(id, {
        name: data.name,
        description: data.description,
        category: data.category
      });
      refetchResponsibilities();
      toast({
        title: "Success",
        description: "Responsibility updated successfully",
      });
    } catch (error) {
      console.error('Error updating responsibility:', error);
      toast({
        title: "Error",
        description: "Failed to update responsibility",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteResponsibility = async (id: string): Promise<void> => {
    try {
      await responsibilityService.delete(id);
      refetchResponsibilities();
      toast({
        title: "Success",
        description: "Responsibility deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting responsibility:', error);
      toast({
        title: "Error",
        description: "Failed to delete responsibility",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Subcontract operations (mock for now)
  const addSubcontract = async (data: Partial<Subcontract>) => {
    try {
      await subcontractService.create({
        contract_number: data.contractId,
        project_id: data.project,
        subcontractor_id: data.subcontractor,
        status: data.status,
        total_value: data.totalValue,
        start_date: data.startDate,
        end_date: data.endDate,
        description: data.description,
      });
      await refetchSubcontracts();
      toast({ title: "Success", description: "Subcontract created successfully" });
    } catch (error) {
      console.error('Error adding subcontract:', error);
      toast({ title: "Error", description: "Failed to add subcontract", variant: "destructive" });
      throw error;
    }
  };

  const updateSubcontract = async (id: string, data: Partial<Subcontract>) => {
    try {
      await subcontractService.update(id, {
        contract_number: data.contractId,
        project_id: data.project,
        subcontractor_id: data.subcontractor,
        status: data.status,
        total_value: data.totalValue,
        start_date: data.startDate,
        end_date: data.endDate,
        description: data.description,
      });
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

  // Map DB subcontracts to frontend Subcontract type
  const subcontracts = subcontractsRaw.map((s: any) => ({
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
    description: s.description,
    createdAt: s.created_at,
    updatedAt: s.updated_at,
  }));

  const isLoading = projectsLoading || subcontractorsLoading || tradesLoading || responsibilitiesLoading || tradeItemsLoading;

  const value: DataContextType = {
    // Projects - Map database fields to frontend types
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
    
    // Subcontractors - Map database fields to frontend types
    subcontractors: subcontractors.map(s => ({
      id: s.id,
      name: s.name,
      companyName: s.name, // Using name as company name for now
      contactPerson: s.contact_person || '',
      email: s.email || '',
      phone: s.phone || '',
      address: s.address || '',
      licenseNumber: s.license_number,
      rating: s.rating || 0,
      trades: [], // Empty array for now
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
    
    // Trades
    trades: trades.map(t => ({
      ...t,
      createdAt: t.created_at,
      updatedAt: t.updated_at
    })),
    addTrade,
    updateTrade,
    deleteTrade,
    
    // Trade Items
    tradeItems,
    addTradeItem,
    updateTradeItem,
    deleteTradeItem,
    
    // Responsibilities - Map database fields and add missing properties
    responsibilities: responsibilities.map(r => ({
      id: r.id,
      name: r.name,
      description: r.description || '',
      category: r.category || '',
      isActive: true, // Default to true
      createdAt: r.created_at,
      updatedAt: r.updated_at
    })),
    addResponsibility,
    updateResponsibility,
    deleteResponsibility,
    
    // Subcontracts (mock for now)
    subcontracts,
    addSubcontract,
    
    // Loading states
    isLoading
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
