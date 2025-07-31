import { useState, useEffect } from 'react';
import subcontractService from '@/services/subcontractService';

export function useSubcontracts(trades: any[] = [], tradeItems: any[] = [], responsibilities: any[] = [], projects: any[] = []) {
  const [subcontracts, setSubcontracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubcontracts = async () => {
      try {
        setIsLoading(true);
        const data = await subcontractService.getAll();
        setSubcontracts(data);
      } catch (error) {
        console.error('Error fetching subcontracts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubcontracts();
  }, []);

  const addSubcontract = async (data: any) => {
    try {
      const newSubcontract = await subcontractService.create(data);
      setSubcontracts(prev => [newSubcontract, ...prev]);
    } catch (error) {
      console.error('Error adding subcontract:', error);
      throw error;
    }
  };

  const updateSubcontract = async (id: string, data: any) => {
    try {
      const updatedSubcontract = await subcontractService.update(id, data);
      setSubcontracts(prev => prev.map(item => item.id === id ? updatedSubcontract : item));
    } catch (error) {
      console.error('Error updating subcontract:', error);
      throw error;
    }
  };

  const deleteSubcontract = async (id: string) => {
    try {
      await subcontractService.delete(id);
      setSubcontracts(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting subcontract:', error);
      throw error;
    }
  };

  const deleteManySubcontracts = async (ids: string[]) => {
    try {
      await Promise.all(ids.map(id => subcontractService.delete(id)));
      setSubcontracts(prev => prev.filter(item => !ids.includes(item.id)));
    } catch (error) {
      console.error('Error deleting subcontracts:', error);
      throw error;
    }
  };

  return {
    subcontracts,
    isLoading,
    addSubcontract,
    updateSubcontract,
    deleteSubcontract,
    deleteManySubcontracts
  };
}