import { useState } from 'react';

export function useSubcontractFiltering() {
  const [filteredData] = useState([]);
  
  return {
    filteredData
  };
}