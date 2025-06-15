
import { useState, useEffect } from 'react';
import { Subcontract } from '@/types/subcontract';
import { useSubcontractHelpers } from './useSubcontractHelpers';

interface SearchCondition {
  field: string;
  value: string;
}

export function useSubcontractSearch(subcontracts: Subcontract[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(subcontracts);
  const [advancedSearchConditions, setAdvancedSearchConditions] = useState<SearchCondition[]>([]);
  const { getProjectName, getProjectCode, getSubcontractorName } = useSubcontractHelpers();

  // Update filtered data when subcontracts change
  useEffect(() => {
    if (advancedSearchConditions.length > 0) {
      handleAdvancedSearch(advancedSearchConditions);
    } else if (searchTerm.trim()) {
      handleSimpleSearch(searchTerm);
    } else {
      setFilteredData(subcontracts);
    }
  }, [subcontracts]);

  const handleSimpleSearch = (value: string) => {
    setSearchTerm(value);
    setAdvancedSearchConditions([]); // Clear advanced search when using simple search
    
    if (!value.trim()) {
      setFilteredData(subcontracts);
      return;
    }

    const searchLower = value.toLowerCase();
    
    const filtered = subcontracts.filter(item => {
      const projectName = getProjectName(item.project);
      const projectCode = getProjectCode(item.project);
      const subcontractorName = getSubcontractorName(item.subcontractor);
      
      // Check basic fields
      const basicFieldsMatch = 
        item.contractId.toLowerCase().includes(searchLower) ||
        projectName.toLowerCase().includes(searchLower) ||
        projectCode.toLowerCase().includes(searchLower) ||
        subcontractorName.toLowerCase().includes(searchLower);

      // Check trade items
      const tradeItemsMatch = item.tradeItems && item.tradeItems.length > 0 && 
        item.tradeItems.some(tradeItem => {
          const tradeMatch = tradeItem.trade && tradeItem.trade.toLowerCase().includes(searchLower);
          const itemMatch = tradeItem.item && tradeItem.item.toLowerCase().includes(searchLower);
          return tradeMatch || itemMatch;
        });

      // Check responsibilities
      const responsibilitiesMatch = item.responsibilities && item.responsibilities.length > 0 &&
        item.responsibilities.some(resp => {
          const match = resp && resp.toLowerCase().includes(searchLower);
          return match;
        });

      return basicFieldsMatch || tradeItemsMatch || responsibilitiesMatch;
    });
    
    setFilteredData(filtered);
  };

  const handleAdvancedSearch = (conditions: SearchCondition[]) => {
    console.log('Advanced search triggered with conditions:', conditions);
    setAdvancedSearchConditions(conditions);
    setSearchTerm(''); // Clear simple search when using advanced search
    
    if (conditions.length === 0) {
      setFilteredData(subcontracts);
      return;
    }

    const filtered = subcontracts.filter(item => {
      const projectName = getProjectName(item.project);
      const projectCode = getProjectCode(item.project);
      const subcontractorName = getSubcontractorName(item.subcontractor);
      
      return conditions.every(condition => {
        const conditionLower = condition.value.toLowerCase();
        
        switch (condition.field) {
          case 'contractId':
            return item.contractId.toLowerCase().includes(conditionLower);
          case 'project':
            return projectName.toLowerCase().includes(conditionLower) ||
                   projectCode.toLowerCase().includes(conditionLower);
          case 'subcontractor':
            return subcontractorName.toLowerCase().includes(conditionLower);
          case 'trade':
            return item.tradeItems && item.tradeItems.length > 0 && 
              item.tradeItems.some(tradeItem => 
                tradeItem.trade && tradeItem.trade.toLowerCase().includes(conditionLower)
              );
          case 'item':
            return item.tradeItems && item.tradeItems.length > 0 && 
              item.tradeItems.some(tradeItem => 
                tradeItem.item && tradeItem.item.toLowerCase().includes(conditionLower)
              );
          case 'responsibilities':
            return item.responsibilities && item.responsibilities.length > 0 &&
              item.responsibilities.some(resp => 
                resp && resp.toLowerCase().includes(conditionLower)
              );
          case 'status':
            return item.status.toLowerCase().includes(conditionLower);
          default:
            return false;
        }
      });
    });
    
    console.log('Filtered results:', filtered.length, 'out of', subcontracts.length);
    setFilteredData(filtered);
  };

  return {
    searchTerm,
    filteredData,
    handleSimpleSearch,
    handleAdvancedSearch,
  };
}
