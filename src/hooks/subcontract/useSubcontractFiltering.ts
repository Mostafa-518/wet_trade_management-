import { useState } from 'react';

export function useSubcontractFiltering(subcontracts: any[] = [], reportFilters: any = {}) {
  const filteredData = subcontracts;
  
  return {
    filteredData
  };
}