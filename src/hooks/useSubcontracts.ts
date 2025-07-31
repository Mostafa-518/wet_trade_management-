import { useState } from 'react';

export function useSubcontracts() {
  const [subcontracts] = useState([]);
  const [isLoading] = useState(false);

  const addSubcontract = async (data: any) => {
    console.log('Add subcontract:', data);
  };

  const updateSubcontract = async (id: string, data: any) => {
    console.log('Update subcontract:', id, data);
  };

  const deleteSubcontract = async (id: string) => {
    console.log('Delete subcontract:', id);
  };

  const deleteManySubcontracts = async (ids: string[]) => {
    console.log('Delete many subcontracts:', ids);
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