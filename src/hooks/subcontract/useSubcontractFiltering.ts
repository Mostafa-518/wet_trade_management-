
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

      // Filter by project name
      if (reportFilters.projectName) {
        const projectMatches = subcontract.project_name?.toLowerCase().includes(reportFilters.projectName.toLowerCase());
        console.log(`Project filter: ${reportFilters.projectName}, Project name: ${subcontract.project_name}, Matches: ${projectMatches}`);
        if (!projectMatches) return false;
      }

      // Filter by project code
      if (reportFilters.projectCode) {
        const codeMatches = subcontract.project_code?.toLowerCase().includes(reportFilters.projectCode.toLowerCase());
        console.log(`Project code filter: ${reportFilters.projectCode}, Project code: ${subcontract.project_code}, Matches: ${codeMatches}`);
        if (!codeMatches) return false;
      }

      // Filter by subcontractor name
      if (reportFilters.subcontractorName) {
        const subcontractorMatches = subcontract.subcontractor_name?.toLowerCase().includes(reportFilters.subcontractorName.toLowerCase());
        console.log(`Subcontractor filter: ${reportFilters.subcontractorName}, Subcontractor: ${subcontract.subcontractor_name}, Matches: ${subcontractorMatches}`);
        if (!subcontractorMatches) return false;
      }

      // Filter by trades
      if (reportFilters.trades) {
        const tradesMatches = subcontract.trades?.some(trade => 
          trade.toLowerCase().includes(reportFilters.trades.toLowerCase())
        );
        console.log(`Trades filter: ${reportFilters.trades}, Subcontract trades: ${subcontract.trades}, Matches: ${tradesMatches}`);
        if (!tradesMatches) return false;
      }

      // Filter by date range (month/year)
      if (reportFilters.month || reportFilters.year) {
        const contractDate = new Date(subcontract.date_of_issuing);
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

      // Filter by location
      if (reportFilters.location) {
        const locationMatches = subcontract.location?.toLowerCase().includes(reportFilters.location.toLowerCase());
        console.log(`Location filter: ${reportFilters.location}, Location: ${subcontract.location}, Matches: ${locationMatches}`);
        if (!locationMatches) return false;
      }

      // Filter by facilities
      if (reportFilters.facilities && reportFilters.facilities.length > 0) {
        const facilityMatches = reportFilters.facilities.some((facility: string) =>
          subcontract.facilities?.some(f => f.toLowerCase().includes(facility.toLowerCase()))
        );
        console.log(`Facilities filter: ${reportFilters.facilities}, Subcontract facilities: ${subcontract.facilities}, Matches: ${facilityMatches}`);
        if (!facilityMatches) return false;
      }

      console.log('Subcontract passed all filters:', subcontract.id);
      return true;
    });

    console.log('Filtered subcontracts:', filtered.length);
    console.log('Filtered subcontract IDs:', filtered.map(s => s.id));
    
    return filtered;
  }, [subcontracts, reportFilters]);
}
