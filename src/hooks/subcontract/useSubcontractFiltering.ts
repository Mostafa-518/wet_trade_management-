
import { useMemo } from 'react';
import { Subcontract } from '@/types/subcontract';
import { useData } from '@/contexts/DataContext';

export function useSubcontractFiltering(subcontracts: Subcontract[], reportFilters?: any) {
  const { projects, subcontractors } = useData();
  
  return useMemo(() => {
    console.log('=== FILTERING: Starting filtering process ===');
    console.log('Input subcontracts:', subcontracts.length);
    console.log('Report filters received:', reportFilters);

    if (!reportFilters || Object.keys(reportFilters).length === 0) {
      console.log('No filters applied, returning all subcontracts');
      return subcontracts;
    }

    const filtered = subcontracts.filter(subcontract => {
      console.log('=== FILTERING: Checking subcontract ===');
      console.log('Subcontract ID:', subcontract.id);

      // Get project data using the correct field name
      const project = projects.find(p => p.id === subcontract.project);
      const subcontractorData = subcontractors.find(s => s.id === subcontract.subcontractor);
      
      console.log('Found project:', project);
      console.log('Found subcontractor:', subcontractorData);

      // Filter by project name - this should be inclusive, not exact match
      if (reportFilters.projectName && reportFilters.projectName !== 'all') {
        const projectMatches = project?.name?.toLowerCase().includes(reportFilters.projectName.toLowerCase());
        console.log(`Project filter: ${reportFilters.projectName}, Project name: ${project?.name}, Matches: ${projectMatches}`);
        if (!projectMatches) return false;
      }

      // Filter by project code
      if (reportFilters.projectCode && reportFilters.projectCode !== 'all') {
        const projectCode = project?.code;
        const codeMatches = projectCode?.toLowerCase().includes(reportFilters.projectCode.toLowerCase());
        console.log(`Project code filter: ${reportFilters.projectCode}, Project code: ${projectCode}, Matches: ${codeMatches}`);
        if (!codeMatches) return false;
      }

      // Filter by subcontractor name - this should be inclusive, not exact match
      if (reportFilters.subcontractorName && reportFilters.subcontractorName !== 'all') {
        const subcontractorMatches = subcontractorData?.name?.toLowerCase().includes(reportFilters.subcontractorName.toLowerCase()) ||
                                   subcontractorData?.company_name?.toLowerCase().includes(reportFilters.subcontractorName.toLowerCase());
        console.log(`Subcontractor filter: ${reportFilters.subcontractorName}, Subcontractor: ${subcontractorData?.name || subcontractorData?.company_name}, Matches: ${subcontractorMatches}`);
        if (!subcontractorMatches) return false;
      }

      // Filter by trades
      if (reportFilters.trades && reportFilters.trades !== 'all') {
        const tradesMatches = subcontract.tradeItems?.some(tradeItem => 
          tradeItem.trade?.toLowerCase().includes(reportFilters.trades.toLowerCase())
        );
        console.log(`Trades filter: ${reportFilters.trades}, Subcontract trades: ${subcontract.tradeItems?.map(t => t.trade)}, Matches: ${tradesMatches}`);
        if (!tradesMatches) return false;
      }

      // Filter by date range (month/year) - be more flexible with date filtering
      if (reportFilters.month && reportFilters.month !== 'all') {
        const contractDate = new Date(subcontract.dateOfIssuing || subcontract.startDate);
        const contractMonth = contractDate.getMonth() + 1;
        const filterMonth = parseInt(reportFilters.month);
        
        if (contractMonth !== filterMonth) {
          console.log(`Month filter: ${filterMonth}, Contract month: ${contractMonth}, No match`);
          return false;
        }
      }

      if (reportFilters.year && reportFilters.year !== 'all') {
        const contractDate = new Date(subcontract.dateOfIssuing || subcontract.startDate);
        const contractYear = contractDate.getFullYear();
        const filterYear = parseInt(reportFilters.year);
        
        if (contractYear !== filterYear) {
          console.log(`Year filter: ${filterYear}, Contract year: ${contractYear}, No match`);
          return false;
        }
      }

      // Filter by location
      if (reportFilters.location && reportFilters.location !== 'all') {
        const locationMatches = project?.location?.toLowerCase().includes(reportFilters.location.toLowerCase());
        console.log(`Location filter: ${reportFilters.location}, Location: ${project?.location}, Matches: ${locationMatches}`);
        if (!locationMatches) return false;
      }

      // Filter by facilities (responsibilities) - make this more flexible
      if (reportFilters.facilities && reportFilters.facilities.length > 0) {
        const facilityMatches = reportFilters.facilities.some((facility: string) =>
          subcontract.responsibilities?.some(responsibility => 
            responsibility.toLowerCase().includes(facility.toLowerCase())
          )
        );
        console.log(`Facilities filter: ${reportFilters.facilities}, Subcontract responsibilities: ${subcontract.responsibilities}, Matches: ${facilityMatches}`);
        if (!facilityMatches) return false;
      }

      console.log('✅ FILTERING: Subcontract passed all filters:', subcontract.id);
      return true;
    });

    console.log('=== FILTERING: Final results ===');
    console.log('Filtered subcontracts count:', filtered.length);
    console.log('Filtered subcontract IDs:', filtered.map(s => s.id));
    
    // Add a warning if we expected more results
    if (filtered.length === 0) {
      console.warn('⚠️ FILTERING: No subcontracts matched the filters. This might indicate a data mismatch.');
    } else if (filtered.length === 1 && reportFilters.expectedCount && reportFilters.expectedCount > 1) {
      console.warn(`⚠️ FILTERING: Only 1 subcontract found but expected ${reportFilters.expectedCount}. Check filter logic.`);
    }
    
    console.log('=== FILTERING: Process complete ===');
    
    return filtered;
  }, [subcontracts, reportFilters, projects, subcontractors]);
}
