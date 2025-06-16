
import React, { createContext, useContext } from 'react';
import { DataContextType } from '@/types/dataContext';
import { useProjects } from '@/hooks/useProjects';
import { useSubcontractors } from '@/hooks/useSubcontractors';
import { useTrades } from '@/hooks/useTrades';
import { useTradeItems } from '@/hooks/useTradeItems';
import { useResponsibilities } from '@/hooks/useResponsibilities';
import { useSubcontracts } from '@/hooks/useSubcontracts';

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const {
    projects,
    addProject,
    updateProject,
    deleteProject,
    isLoading: projectsLoading
  } = useProjects();

  const {
    subcontractors,
    addSubcontractor,
    updateSubcontractor,
    deleteSubcontractor,
    isLoading: subcontractorsLoading
  } = useSubcontractors();

  const {
    trades,
    addTrade,
    updateTrade,
    deleteTrade,
    bulkDeleteTrades,
    isLoading: tradesLoading
  } = useTrades();

  const {
    tradeItems,
    addTradeItem,
    updateTradeItem,
    deleteTradeItem,
    bulkDeleteTradeItems,
    isLoading: tradeItemsLoading
  } = useTradeItems();

  const {
    responsibilities,
    addResponsibility,
    updateResponsibility,
    deleteResponsibility,
    isLoading: responsibilitiesLoading
  } = useResponsibilities();

  // Only call useSubcontracts when we have the required dependencies
  const dependenciesReady = !tradesLoading && !tradeItemsLoading && !responsibilitiesLoading && !projectsLoading;
  
  const {
    subcontracts,
    addSubcontract,
    updateSubcontract,
    deleteSubcontract,
    deleteManySubcontracts,
    isLoading: subcontractsLoading
  } = useSubcontracts(
    dependenciesReady ? trades : [],
    dependenciesReady ? tradeItems : [],
    dependenciesReady ? responsibilities : [],
    dependenciesReady ? projects : []
  );

  const isLoading = projectsLoading || subcontractorsLoading || responsibilitiesLoading || tradesLoading || tradeItemsLoading || subcontractsLoading;

  // Always provide a valid context value
  const value: DataContextType = {
    // Projects
    projects: projects || [],
    addProject,
    updateProject,
    deleteProject,
    
    // Subcontractors
    subcontractors: subcontractors || [],
    addSubcontractor,
    updateSubcontractor,
    deleteSubcontractor,
    
    // Trades
    trades: trades || [],
    addTrade,
    updateTrade,
    deleteTrade,
    bulkDeleteTrades,
    
    // Trade Items
    tradeItems: tradeItems || [],
    addTradeItem,
    updateTradeItem,
    deleteTradeItem,
    bulkDeleteTradeItems,
    
    // Responsibilities
    responsibilities: responsibilities || [],
    addResponsibility,
    updateResponsibility,
    deleteResponsibility,
    
    // Subcontracts
    subcontracts: subcontracts || [],
    addSubcontract,
    updateSubcontract,
    deleteSubcontract,
    deleteManySubcontracts,
    
    // Loading state
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
