
import { useMemo } from 'react';
import { useSubcontractHelpers } from './useSubcontractHelpers';

export function useSubcontractFiltering(subcontracts: any[], reportFilters?: any) {
  const { getProjectName, getProjectCode } = useSubcontractHelpers();

  const filteredSubcontracts = useMemo(() => {
    console.log('useSubcontractFiltering - Starting filter process');
    console.log('Report filters received:', reportFilters);
    console.log('Total subcontracts:', subcontracts.length);
    
    if (!reportFilters) {
      console.log('No report filters, returning all subcontracts');
      return subcontracts;
    }
    
    const filtered = subcontracts.filter(subcontract => {
      console.log(`\n--- Processing Subcontract ${subcontract.contractId} ---`);
      console.log('Full subcontract object:', subcontract);
      
      // Month filter
      if (reportFilters.month && reportFilters.month !== 'all' && reportFilters.month !== 'All') {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        const monthIndex = monthNames.findIndex(m => m.toLowerCase() === reportFilters.month.toLowerCase());
        
        if (monthIndex !== -1 && subcontract.dateOfIssuing) {
          const subcontractMonth = new Date(subcontract.dateOfIssuing).getMonth();
          if (subcontractMonth !== monthIndex) {
            console.log(`❌ Month filter failed: expected ${reportFilters.month} (${monthIndex}), got month ${subcontractMonth}`);
            return false;
          }
          console.log(`✅ Month filter passed: ${reportFilters.month}`);
        }
      }

      // Year filter
      if (reportFilters.year && reportFilters.year !== 'all' && reportFilters.year !== 'All') {
        if (subcontract.dateOfIssuing) {
          const subcontractYear = new Date(subcontract.dateOfIssuing).getFullYear().toString();
          if (subcontractYear !== reportFilters.year) {
            console.log(`❌ Year filter failed: expected ${reportFilters.year}, got ${subcontractYear}`);
            return false;
          }
          console.log(`✅ Year filter passed: ${reportFilters.year}`);
        }
      }

      // Location filter
      if (reportFilters.location && reportFilters.location !== 'all' && reportFilters.location !== 'All') {
        const projectName = getProjectName(subcontract.project);
        // For now, we'll check if the project name contains the location
        // This might need adjustment based on your actual project-location relationship
        if (!projectName.toLowerCase().includes(reportFilters.location.toLowerCase())) {
          console.log(`❌ Location filter failed: project "${projectName}" doesn't contain "${reportFilters.location}"`);
          return false;
        }
        console.log(`✅ Location filter passed: ${reportFilters.location}`);
      }

      // Trade filter - check against trade items
      if (reportFilters.trades && reportFilters.trades !== 'all' && reportFilters.trades !== 'All') {
        const hasMatchingTrade = subcontract.tradeItems?.some(item => {
          // Handle both string trade and object trade structures
          const tradeName = typeof item.trade === 'string' ? item.trade : item.trade?.name;
          return tradeName && tradeName.toLowerCase().includes(reportFilters.trades.toLowerCase());
        });
        if (!hasMatchingTrade) {
          console.log(`❌ Trade filter failed: no matching trade "${reportFilters.trades}"`);
          return false;
        }
        console.log(`✅ Trade filter passed: ${reportFilters.trades}`);
      }

      // Project name filter
      if (reportFilters.projectName && reportFilters.projectName !== 'all' && reportFilters.projectName !== 'All') {
        const projectName = getProjectName(subcontract.project);
        if (projectName !== reportFilters.projectName) {
          console.log(`❌ Project name filter failed: expected "${reportFilters.projectName}", got "${projectName}"`);
          return false;
        }
        console.log(`✅ Project name filter passed: ${reportFilters.projectName}`);
      }

      // Project code filter
      if (reportFilters.projectCode && reportFilters.projectCode !== 'all' && reportFilters.projectCode !== 'All') {
        const projectCode = getProjectCode(subcontract.project);
        if (projectCode !== reportFilters.projectCode) {
          console.log(`❌ Project code filter failed: expected "${reportFilters.projectCode}", got "${projectCode}"`);
          return false;
        }
        console.log(`✅ Project code filter passed: ${reportFilters.projectCode}`);
      }

      // Facilities filter - STRICT: ALL selected facilities must be present
      if (reportFilters.facilities && reportFilters.facilities.length > 0) {
        console.log(`🔍 FACILITIES FILTER - STRICT MODE`);
        console.log(`Selected facilities (${reportFilters.facilities.length}):`, reportFilters.facilities);
        
        // Handle different data structures for responsibilities
        let responsibilityNames: string[] = [];
        
        if (!subcontract.responsibilities) {
          console.log(`❌ FACILITIES FILTER FAILED: No responsibilities property`);
          return false;
        }
        
        if (Array.isArray(subcontract.responsibilities)) {
          // Handle array of strings or objects
          responsibilityNames = subcontract.responsibilities.map(resp => {
            if (typeof resp === 'string') {
              return resp;
            } else if (typeof resp === 'object' && resp !== null) {
              return (resp as any).name || (resp as any).responsibility || '';
            }
            return '';
          }).filter(Boolean);
        } else if (typeof subcontract.responsibilities === 'string') {
          // Handle single string responsibility
          responsibilityNames = [subcontract.responsibilities];
        }
        
        console.log(`Extracted responsibility names (${responsibilityNames.length}):`, responsibilityNames);
        
        // Check each selected facility individually (strict AND logic)
        for (const selectedFacility of reportFilters.facilities) {
          const isPresent = responsibilityNames.includes(selectedFacility);
          console.log(`  - Checking facility "${selectedFacility}": ${isPresent ? '✅ PRESENT' : '❌ MISSING'}`);
          
          if (!isPresent) {
            console.log(`❌ FACILITIES FILTER FAILED: Missing facility "${selectedFacility}"`);
            return false;
          }
        }
        
        console.log(`✅ FACILITIES FILTER PASSED: All ${reportFilters.facilities.length} facilities are present`);
      }

      console.log(`✅ Subcontract ${subcontract.contractId} passed all filters`);
      return true;
    });

    console.log('\n=== FILTER RESULTS ===');
    console.log('Filtered subcontracts count:', filtered.length);
    console.log('Filtered subcontract IDs:', filtered.map(s => s.contractId));
    console.log('=== END FILTER PROCESS ===\n');
    
    return filtered;
  }, [subcontracts, reportFilters, getProjectName, getProjectCode]);

  return filteredSubcontracts;
}
