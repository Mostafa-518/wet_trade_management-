import { useState } from 'react';

export function useSubcontractorsTable() {
  const [data] = useState([]);
  const [isLoading] = useState(false);

  return {
    data,
    isLoading
  };
}