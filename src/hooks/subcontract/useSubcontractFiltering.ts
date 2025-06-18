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

      // Filter by project name (using project relation)
      if (reportFilters.projectName) {
        const projectMatches = subcontract.project?.name?.toLowerCase().includes(reportFilters.projectName.toLowerCase());
        console.log(`Project filter: ${reportFilters.projectName}, Project name: ${subcontract.project?.name}, Matches: ${projectMatches}`);
        if (!projectMatches) return false;
      }

      // Filter by project code (using project relation)
      if (reportFilters.projectCode) {
        const codeMatches = subcontract.project?.code?.toLowerCase().includes(reportFilters.projectCode.toLowerCase());
        console.log(`Project code filter: ${reportFilters.projectCode}, Project code: ${subcontract.project?.code}, Matches: ${codeMatches}`);
        if (!codeMatches) return false;
      }

      // Filter by subcontractor name (using subcontractor relation)
      if (reportFilters.subcontractorName) {
        const subcontractorMatches = subcontract.subcontractor?.companyName?.toLowerCase().includes(reportFilters.subcontractorName.toLowerCase());
        console.log(`Subcontractor filter: ${reportFilters.subcontractorName}, Subcontractor: ${subcontractor.subcontractor?.companyName}, Matches: ${subcontractorMatches}`);
        if (!subcontractorMatches) return false;
      }

      // Filter by trades (using trade items relation)
      if (reportFilters.trades) {
        const tradesMatches = subcontract.tradeItems?.some(tradeItem => 
          tradeItem.tradeItem?.trade?.name?.toLowerCase().includes(reportFilters.trades.toLowerCase())
        );
        console.log(`Trades filter: ${reportFilters.trades}, Subcontract trades: ${subcontract.tradeItems?.map(ti => ti.tradeItem?.trade?.name)}, Matches: ${tradesMatches}`);
        if (!tradesMatches) return false;
      }

      // Filter by date range (month/year)
      if (reportFilters.month || reportFilters.year) {
        const contractDate = new Date(subcontract.dateOfIssuing);
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

      // Filter by location (using project relation)
      if (reportFilters.location) {
        const locationMatches = subcontract.project?.location?.toLowerCase().includes(reportFilters.location.toLowerCase());
        console.log(`Location filter: ${reportFilters.location}, Location: ${subcontract.project?.location}, Matches: ${locationMatches}`);
        if (!locationMatches) return false;
      }

      // Filter by facilities (this field may not exist in the current structure, keeping for backward compatibility)
      if (reportFilters.facilities && reportFilters.facilities.length > 0) {
        // Since facilities isn't in the Subcontract type, we'll assume this filter passes for now
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
