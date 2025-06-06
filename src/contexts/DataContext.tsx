import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProjectService, SubcontractorService, TradeService, ResponsibilityService } from '@/services/supabaseService';
import { Project, ProjectFormData } from '@/types/project';
import { Subcontractor, SubcontractorFormData } from '@/types/subcontractor';
import { Trade } from '@/types/trade';
import { Responsibility } from '@/types/responsibility';
import { Subcontract } from '@/types/subcontract';
import { useToast } from '@/hooks/use-toast';

// Define TradeItem type
interface TradeItem {
  id: string;
  tradeId: string;
  tradeName: string;
  name: string;
  description?: string;
  unit?: string;
  category?: string;
  unitPrice?: number;
  createdAt: string;
  updatedAt: string;
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
  addTradeItem: (data: Partial<TradeItem>) => void;
  updateTradeItem: (id: string, data: Partial<TradeItem>) => void;
  deleteTradeItem: (id: string) => void;
  
  // Responsibilities
  responsibilities: Responsibility[];
  addResponsibility: (data: Partial<Responsibility>) => Promise<void>;
  updateResponsibility: (id: string, data: Partial<Responsibility>) => Promise<void>;
  deleteResponsibility: (id: string) => Promise<void>;
  
  // Subcontracts
  subcontracts: Subcontract[];
  addSubcontract: (data: any) => void;
  
  // Loading states
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  
  // State for mock data that doesn't exist in Supabase yet
  const [tradeItems, setTradeItems] = useState<TradeItem[]>([]);
  const [subcontracts, setSubcontracts] = useState<Subcontract[]>([]);

  // Fetch data using React Query
  const { data: projects = [], refetch: refetchProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: ProjectService.getAll,
  });

  const { data: subcontractors = [], refetch: refetchSubcontractors } = useQuery({
    queryKey: ['subcontractors'],
    queryFn: SubcontractorService.getAll,
  });

  const { data: trades = [], refetch: refetchTrades } = useQuery({
    queryKey: ['trades'],
    queryFn: TradeService.getAll,
  });

  const { data: responsibilities = [], refetch: refetchResponsibilities } = useQuery({
    queryKey: ['responsibilities'],
    queryFn: ResponsibilityService.getAll,
  });

  // Project operations
  const addProject = async (data: ProjectFormData) => {
    try {
      await ProjectService.create({
        name: data.name,
        code: data.code,
        location: data.location,
        description: data.description,
        start_date: data.startDate,
        end_date: data.endDate,
        status: data.status as any
      });
      refetchProjects();
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

  const updateProject = async (id: string, data: ProjectFormData) => {
    try {
      await ProjectService.update(id, {
        name: data.name,
        code: data.code,
        location: data.location,
        description: data.description,
        start_date: data.startDate,
        end_date: data.endDate,
        status: data.status as any
      });
      refetchProjects();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await ProjectService.delete(id);
      refetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  // Subcontractor operations
  const addSubcontractor = async (data: SubcontractorFormData) => {
    try {
      await SubcontractorService.create({
        name: data.name,
        contact_person: data.contactPerson,
        email: data.email,
        phone: data.phone,
        address: data.address,
        license_number: data.licenseNumber,
        rating: data.rating
      });
      refetchSubcontractors();
    } catch (error) {
      console.error('Error adding subcontractor:', error);
      throw error;
    }
  };

  const updateSubcontractor = async (id: string, data: SubcontractorFormData) => {
    try {
      await SubcontractorService.update(id, {
        name: data.name,
        contact_person: data.contactPerson,
        email: data.email,
        phone: data.phone,
        address: data.address,
        license_number: data.licenseNumber,
        rating: data.rating
      });
      refetchSubcontractors();
    } catch (error) {
      console.error('Error updating subcontractor:', error);
    }
  };

  const deleteSubcontractor = async (id: string) => {
    try {
      await SubcontractorService.delete(id);
      refetchSubcontractors();
    } catch (error) {
      console.error('Error deleting subcontractor:', error);
    }
  };

  // Trade operations
  const addTrade = async (data: Partial<Trade>) => {
    try {
      await TradeService.create({
        name: data.name!,
        category: data.category!,
        description: data.description
      });
      refetchTrades();
    } catch (error) {
      console.error('Error adding trade:', error);
    }
  };

  const updateTrade = async (id: string, data: Partial<Trade>) => {
    try {
      await TradeService.update(id, {
        name: data.name,
        category: data.category,
        description: data.description
      });
      refetchTrades();
    } catch (error) {
      console.error('Error updating trade:', error);
    }
  };

  const deleteTrade = async (id: string) => {
    try {
      await TradeService.delete(id);
      refetchTrades();
    } catch (error) {
      console.error('Error deleting trade:', error);
    }
  };

  // Trade Item operations (mock for now)
  const addTradeItem = (data: Partial<TradeItem>) => {
    const newItem: TradeItem = {
      id: Math.random().toString(36).substr(2, 9),
      tradeId: data.tradeId!,
      tradeName: data.tradeName || '',
      name: data.name!,
      unit: data.unit || '',
      category: data.category || '',
      unitPrice: data.unitPrice || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTradeItems(prev => [...prev, newItem]);
  };

  const updateTradeItem = (id: string, data: Partial<TradeItem>) => {
    setTradeItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...data, updatedAt: new Date().toISOString() } : item
    ));
  };

  const deleteTradeItem = (id: string) => {
    setTradeItems(prev => prev.filter(item => item.id !== id));
  };

  // Responsibility operations
  const addResponsibility = async (data: Partial<Responsibility>) => {
    try {
      await ResponsibilityService.create({
        name: data.name!,
        description: data.description,
        category: data.category
      });
      refetchResponsibilities();
    } catch (error) {
      console.error('Error adding responsibility:', error);
    }
  };

  const updateResponsibility = async (id: string, data: Partial<Responsibility>) => {
    try {
      await ResponsibilityService.update(id, {
        name: data.name,
        description: data.description,
        category: data.category
      });
      refetchResponsibilities();
    } catch (error) {
      console.error('Error updating responsibility:', error);
    }
  };

  const deleteResponsibility = async (id: string) => {
    try {
      await ResponsibilityService.delete(id);
      refetchResponsibilities();
    } catch (error) {
      console.error('Error deleting responsibility:', error);
    }
  };

  // Subcontract operations (mock for now)
  const addSubcontract = (data: any) => {
    const newSubcontract: Subcontract = {
      id: Math.random().toString(36).substr(2, 9),
      contractId: `CONTRACT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      project: data.project || data.projectName || '',
      subcontractor: data.subcontractor || data.subcontractorName || '',
      tradeItems: data.tradeItems || [],
      responsibilities: data.responsibilities || [],
      totalValue: data.totalValue || data.value || 0,
      status: data.status || 'draft',
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      endDate: data.endDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSubcontracts(prev => [...prev, newSubcontract]);
  };

  const value: DataContextType = {
    // Projects
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
    
    // Subcontracts
    subcontracts,
    addSubcontract,
    
    // Loading states
    isLoading: false
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
