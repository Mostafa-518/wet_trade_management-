
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState, useMemo } from 'react';
import { 
  ReportFilters, 
  SubcontractWithDetails, 
  ReportData 
} from '@/types/report';
import { generateFilterOptions } from '@/utils/report/filterOptions';
import { filterSubcontracts } from '@/utils/report/subcontractFilter';
import { processReportData } from '@/utils/report/reportDataProcessor';

export function useReportData() {
  const [filters, setFilters] = useState<ReportFilters>({
    month: 'all',
    year: '2024',
    location: 'all',
    trades: 'all',
    projectName: 'all',
    projectCode: 'all',
    presentData: 'by-project',
    projectFilterType: 'name',
    facilities: []
  });

  // Fetch all subcontracts with related data
  const { data: subcontracts = [], isLoading: subcontractsLoading, refetch } = useQuery({
    queryKey: ['report-subcontracts'],
    queryFn: async () => {
      console.log('Fetching subcontracts for report...');
      const { data, error } = await supabase
        .from('subcontracts')
        .select(`
          *,
          projects(name, code, location),
          subcontractors(company_name),
          subcontract_trade_items(
            quantity,
            unit_price,
            total_price,
            wastage_percentage,
            trade_item_id,
            trade_items(
              name,
              unit,
              trade_id,
              trades(name, category)
            )
          ),
          subcontract_responsibilities(
            responsibility_id,
            responsibilities(name)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching subcontracts for report:', error);
        throw error;
      }
      
      console.log('Fetched subcontracts for report:', data);
      return data as SubcontractWithDetails[];
    },
  });

  // Get filter options from data
  const filterOptions = useMemo(() => generateFilterOptions(subcontracts), [subcontracts]);

  // Filter subcontracts based on current filters
  const filteredSubcontracts = useMemo(() => 
    filterSubcontracts(subcontracts, filters), 
    [subcontracts, filters]
  );

  // Calculate report data
  const reportData = useMemo((): ReportData => {
    const totalSubcontracts = subcontracts.length;
    const currentSubcontracts = filteredSubcontracts.length;
    const tableData = processReportData(filteredSubcontracts, filters);

    return {
      totalSubcontracts,
      currentSubcontracts,
      filters,
      tableData
    };
  }, [subcontracts, filteredSubcontracts, filters]);

  const updateFilter = (key: keyof ReportFilters, value: string | string[]) => {
    console.log(`Updating filter ${key} to:`, value);
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      
      // When switching project filter type, reset the other project filter
      if (key === 'projectFilterType') {
        if (value === 'name') {
          newFilters.projectCode = 'all';
        } else if (value === 'code') {
          newFilters.projectName = 'all';
        }
      }
      
      // When changing project name, switch to name filter type and reset code
      if (key === 'projectName' && value !== 'all' && value !== 'All') {
        newFilters.projectFilterType = 'name';
        newFilters.projectCode = 'all';
      }
      
      // When changing project code, switch to code filter type and reset name
      if (key === 'projectCode' && value !== 'all' && value !== 'All') {
        newFilters.projectFilterType = 'code';
        newFilters.projectName = 'all';
      }
      
      console.log('New filters state:', newFilters);
      return newFilters;
    });
  };

  return {
    reportData,
    filterOptions,
    updateFilter,
    isLoading: subcontractsLoading,
    refetch,
    filteredSubcontracts // Expose filtered subcontracts for graphs
  };
}
