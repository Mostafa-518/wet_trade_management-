import { useState } from 'react';

export function useSubcontractorsTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState('name');
  const [selectedIds] = useState(new Set<string>());
  const [data] = useState([]);
  const [isLoading] = useState(false);

  return {
    data,
    isLoading,
    searchTerm,
    setSearchTerm,
    searchBy,
    setSearchBy,
    selectedIds,
    filteredSubcontractors: data,
    allSelected: false,
    toggleAll: () => {},
    toggleOne: () => {},
    handleBulkDelete: () => {}
  };
}