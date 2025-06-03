
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, ProjectFormData } from '@/types/project';
import { Subcontractor, SubcontractorFormData } from '@/types/subcontractor';
import { Responsibility, ResponsibilityFormData } from '@/types/responsibility';
import { Trade, TradeFormData, TradeItem, TradeItemFormData } from '@/types/trade';
import { mockProjects } from '@/data/projectsData';
import { mockSubcontractors } from '@/data/subcontractorsData';
import { mockResponsibilities } from '@/data/responsibilitiesData';
import { mockTrades, mockTradeItems } from '@/data/tradesData';

interface DataContextType {
  // Projects
  projects: Project[];
  addProject: (data: ProjectFormData) => Project;
  updateProject: (id: string, data: ProjectFormData) => void;
  deleteProject: (id: string) => void;
  
  // Subcontractors
  subcontractors: Subcontractor[];
  addSubcontractor: (data: SubcontractorFormData) => Subcontractor;
  updateSubcontractor: (id: string, data: SubcontractorFormData) => void;
  deleteSubcontractor: (id: string) => void;
  
  // Responsibilities
  responsibilities: Responsibility[];
  addResponsibility: (data: ResponsibilityFormData) => Responsibility;
  updateResponsibility: (id: string, data: ResponsibilityFormData) => void;
  deleteResponsibility: (id: string) => void;
  
  // Trades
  trades: Trade[];
  addTrade: (data: TradeFormData) => Trade;
  updateTrade: (id: string, data: TradeFormData) => void;
  deleteTrade: (id: string) => void;
  
  // Trade Items
  tradeItems: TradeItem[];
  addTradeItem: (data: TradeItemFormData) => TradeItem;
  updateTradeItem: (id: string, data: TradeItemFormData) => void;
  deleteTradeItem: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);
  const [responsibilities, setResponsibilities] = useState<Responsibility[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [tradeItems, setTradeItems] = useState<TradeItem[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem('projects');
    const savedSubcontractors = localStorage.getItem('subcontractors');
    const savedResponsibilities = localStorage.getItem('responsibilities');
    const savedTrades = localStorage.getItem('trades');
    const savedTradeItems = localStorage.getItem('tradeItems');

    setProjects(savedProjects ? JSON.parse(savedProjects) : mockProjects);
    setSubcontractors(savedSubcontractors ? JSON.parse(savedSubcontractors) : mockSubcontractors);
    setResponsibilities(savedResponsibilities ? JSON.parse(savedResponsibilities) : mockResponsibilities);
    setTrades(savedTrades ? JSON.parse(savedTrades) : mockTrades);
    setTradeItems(savedTradeItems ? JSON.parse(savedTradeItems) : mockTradeItems);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('subcontractors', JSON.stringify(subcontractors));
  }, [subcontractors]);

  useEffect(() => {
    localStorage.setItem('responsibilities', JSON.stringify(responsibilities));
  }, [responsibilities]);

  useEffect(() => {
    localStorage.setItem('trades', JSON.stringify(trades));
  }, [trades]);

  useEffect(() => {
    localStorage.setItem('tradeItems', JSON.stringify(tradeItems));
  }, [tradeItems]);

  // Helper function to generate IDs
  const generateId = (prefix: string) => {
    return `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
  };

  // Project CRUD operations
  const addProject = (data: ProjectFormData): Project => {
    const newProject: Project = {
      id: generateId('PRJ'),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProjects(prev => [...prev, newProject]);
    return newProject;
  };

  const updateProject = (id: string, data: ProjectFormData) => {
    setProjects(prev => prev.map(project => 
      project.id === id 
        ? { ...project, ...data, updatedAt: new Date().toISOString() }
        : project
    ));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
  };

  // Subcontractor CRUD operations
  const addSubcontractor = (data: SubcontractorFormData): Subcontractor => {
    const newSubcontractor: Subcontractor = {
      id: generateId('SUB'),
      ...data,
      status: 'active' as const,
      rating: 0,
      totalProjects: 0,
      currentProjects: 0,
      registrationDate: new Date().toISOString()
    };
    setSubcontractors(prev => [...prev, newSubcontractor]);
    return newSubcontractor;
  };

  const updateSubcontractor = (id: string, data: SubcontractorFormData) => {
    setSubcontractors(prev => prev.map(subcontractor => 
      subcontractor.id === id 
        ? { ...subcontractor, ...data }
        : subcontractor
    ));
  };

  const deleteSubcontractor = (id: string) => {
    setSubcontractors(prev => prev.filter(subcontractor => subcontractor.id !== id));
  };

  // Responsibility CRUD operations
  const addResponsibility = (data: ResponsibilityFormData): Responsibility => {
    const newResponsibility: Responsibility = {
      id: generateId('RESP'),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setResponsibilities(prev => [...prev, newResponsibility]);
    return newResponsibility;
  };

  const updateResponsibility = (id: string, data: ResponsibilityFormData) => {
    setResponsibilities(prev => prev.map(responsibility => 
      responsibility.id === id 
        ? { ...responsibility, ...data, updatedAt: new Date().toISOString() }
        : responsibility
    ));
  };

  const deleteResponsibility = (id: string) => {
    setResponsibilities(prev => prev.filter(responsibility => responsibility.id !== id));
  };

  // Trade CRUD operations
  const addTrade = (data: TradeFormData): Trade => {
    const newTrade: Trade = {
      id: generateId('TRD'),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTrades(prev => [...prev, newTrade]);
    return newTrade;
  };

  const updateTrade = (id: string, data: TradeFormData) => {
    setTrades(prev => prev.map(trade => 
      trade.id === id 
        ? { ...trade, ...data, updatedAt: new Date().toISOString() }
        : trade
    ));
  };

  const deleteTrade = (id: string) => {
    setTrades(prev => prev.filter(trade => trade.id !== id));
    // Also delete related trade items
    setTradeItems(prev => prev.filter(item => item.tradeId !== id));
  };

  // Trade Item CRUD operations
  const addTradeItem = (data: TradeItemFormData): TradeItem => {
    const trade = trades.find(t => t.id === data.tradeId);
    const newTradeItem: TradeItem = {
      id: generateId('TI'),
      ...data,
      tradeName: trade?.name || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTradeItems(prev => [...prev, newTradeItem]);
    return newTradeItem;
  };

  const updateTradeItem = (id: string, data: TradeItemFormData) => {
    const trade = trades.find(t => t.id === data.tradeId);
    setTradeItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, ...data, tradeName: trade?.name || '', updatedAt: new Date().toISOString() }
        : item
    ));
  };

  const deleteTradeItem = (id: string) => {
    setTradeItems(prev => prev.filter(item => item.id !== id));
  };

  const value: DataContextType = {
    projects,
    addProject,
    updateProject,
    deleteProject,
    subcontractors,
    addSubcontractor,
    updateSubcontractor,
    deleteSubcontractor,
    responsibilities,
    addResponsibility,
    updateResponsibility,
    deleteResponsibility,
    trades,
    addTrade,
    updateTrade,
    deleteTrade,
    tradeItems,
    addTradeItem,
    updateTradeItem,
    deleteTradeItem
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
