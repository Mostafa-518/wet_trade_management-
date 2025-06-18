import { useMemo } from 'react';
import { Subcontract } from '@/types/subcontract';

export function useSubcontractFiltering(subcontracts: Subcontract[], reportFilters?: any) {
  return useMemo(() => {
    console.log('useSubcontractFiltering - Starting filtering process');
    console.log('Input subcontracts:', subcontracts.length);
    console.log('Report filters:', reportFilters);

    if (!reportFilters || Object.keys(reportFilters).length === 0) {
      console.log('No filters applied, returning all subcontracts');
      return subcontracts;
    }

    const filtered = subcontracts.filter(subcontract => {
      console.log('Checking subcontract:', subcontract.id, subcontract);

      // Filter by project name - since project is a string ID, we need to use helper functions
      if (reportFilters.projectName) {
        // For now, we'll check if the project string includes the filter text
        // This should be improved to use actual project data lookup
        const projectMatches = subcontract.project?.toLowerCase().includes(reportFilters.projectName.toLowerCase());
        console.log(`Project filter: ${reportFilters.projectName}, Project ID: ${subcontract.project}, Matches: ${projectMatches}`);
        if (!projectMatches) return false;
      }

      // Filter by project code - similar approach
      if (reportFilters.projectCode) {
        const codeMatches = subcontract.project?.toLowerCase().includes(reportFilters.projectCode.toLowerCase());
        console.log(`Project code filter: ${reportFilters.projectCode}, Project ID: ${subcontract.project}, Matches: ${codeMatches}`);
        if (!codeMatches) return false;
      }

      // Filter by subcontractor name - since subcontractor is a string ID
      if (reportFilters.subcontractorName) {
        const subcontractorMatches = subcontract.subcontractor?.toLowerCase().includes(reportFilters.subcontractorName.toLowerCase());
        console.log(`Subcontractor filter: ${reportFilters.subcontractorName}, Subcontractor ID: ${subcontract.subcontractor}, Matches: ${subcontractorMatches}`);
        if (!subcontractorMatches) return false;
      }

      // Filter by trades - using the trade field of TradeItem
      if (reportFilters.trades) {
        const tradesMatches = subcontract.tradeItems?.some(tradeItem => 
          tradeItem.trade?.toLowerCase().includes(reportFilters.trades.toLowerCase())
        );
        console.log(`Trades filter: ${reportFilters.trades}, Subcontract trades: ${subcontract.tradeItems?.map(ti => ti.trade)}, Matches: ${tradesMatches}`);
        if (!tradesMatches) return false;
      }

      // Filter by date range (month/year)
      if (reportFilters.month || reportFilters.year) {
        const contractDate = new Date(subcontract.dateOfIssuing || subcontract.createdAt);
        const contractMonth = contractDate.getMonth() + 1; // JavaScript months are 0-indexed
        const contractYear = contractDate.getFullYear();

        if (reportFilters.month) {
          const filterMonth = parseInt(reportFilters.month);
          if (contractMonth !== filterMonth) {
            console.log(`Month filter: ${filterMonth}, Contract month: ${contractMonth}, No match`);
            return false;
          }
        }

        if (reportFilters.year) {
          const filterYear = parseInt(reportFilters.year);
          if (contractYear !== filterYear) {
            console.log(`Year filter: ${filterYear}, Contract year: ${contractYear}, No match`);
            return false;
          }
        }
      }

      // Filter by location - since project is a string ID, we'll skip this for now
      // This filter would need to be implemented with proper project data lookup
      if (reportFilters.location) {
        console.log(`Location filter: ${reportFilters.location}, Skipping location filter as project is an ID`);
        // For now, we'll assume it matches to avoid breaking the filter
      }

      // Filter by facilities (keeping for backward compatibility)
      if (reportFilters.facilities && reportFilters.facilities.length > 0) {
        console.log(`Facilities filter: ${reportFilters.facilities}, Assuming match for backward compatibility`);
      }

      console.log('Subcontract passed all filters:', subcontract.id);
      return true;
    });

    console.log('Filtered subcontracts:', filtered.length);
    console.log('Filtered subcontract IDs:', filtered.map(s => s.id));
    
    return filtered;
  }, [subcontracts, reportFilters]);
}
