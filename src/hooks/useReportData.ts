import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useState, useMemo } from 'react';

interface ReportFilters {
  month: string;
  year: string;
  location: string;
  trades: string;
  projectName: string;
  projectCode: string;
  presentData: string;
  projectFilterType: 'name' | 'code';
  facilities: string[]; // NEW: Array of selected facilities/responsibilities
}

interface SubcontractWithDetails {
  id: string;
  contract_number: string;
  total_value: number;
  status: string;
  project_id: string;
  subcontractor_id: string;
  date_of_issuing: string;
  projects: {
    name: string;
    code: string;
    location: string;
  };
  subcontractors: {
    company_name: string;
  };
  subcontract_trade_items: Array<{
    quantity: number;
    unit_price: number;
    total_price: number;
    wastage_percentage: number;
    trade_item_id: string;
    trade_items: {
      name: string;
      unit: string;
      trade_id: string;
      trades: {
        name: string;
        category: string;
      };
    };
  }>;
  subcontract_responsibilities: Array<{
    responsibility_id: string;
    responsibilities: {
      name: string;
    };
  }>;
}

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
    facilities: [] // NEW: Initialize empty facilities array
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
  const filterOptions = useMemo(() => {
    const months = ['All', 'January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    
    const years = [...new Set(subcontracts
      .map(s => s.date_of_issuing ? new Date(s.date_of_issuing).getFullYear().toString() : '2024')
      .filter(Boolean)
    )].sort();
    
    const locations = [...new Set(subcontracts
      .map(s => s.projects?.location)
      .filter(Boolean)
    )];
    
    // Changed to use trade names instead of categories
    const trades = [...new Set(subcontracts
      .flatMap(s => s.subcontract_trade_items?.map(item => item.trade_items?.trades?.name))
      .filter(Boolean)
    )];
    
    const projectNames = [...new Set(subcontracts
      .map(s => s.projects?.name)
      .filter(Boolean)
    )];
    
    const projectCodes = [...new Set(subcontracts
      .map(s => s.projects?.code)
      .filter(Boolean)
    )];

    // NEW: Get all available facilities/responsibilities
    const facilities = [...new Set(subcontracts
      .flatMap(s => s.subcontract_responsibilities?.map(resp => resp.responsibilities?.name))
      .filter(Boolean)
    )];

    return {
      months,
      years: ['All', ...years],
      locations: ['All', ...locations],
      trades: ['All', ...trades],
      projectNames: ['All', ...projectNames],
      projectCodes: ['All', ...projectCodes],
      presentDataOptions: ['By Project', 'By Location'],
      facilities: ['All', ...facilities] // NEW: Add facilities to filter options
    };
  }, [subcontracts]);

  // Filter subcontracts based on current filters
  const filteredSubcontracts = useMemo(() => {
    return subcontracts.filter(subcontract => {
      // Month filter
      if (filters.month !== 'all') {
        const monthIndex = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'].indexOf(filters.month);
        if (monthIndex !== -1 && subcontract.date_of_issuing) {
          const subcontractMonth = new Date(subcontract.date_of_issuing).getMonth();
          if (subcontractMonth !== monthIndex) return false;
        }
      }

      // Year filter
      if (filters.year !== 'all' && filters.year !== 'All') {
        if (subcontract.date_of_issuing) {
          const subcontractYear = new Date(subcontract.date_of_issuing).getFullYear().toString();
          if (subcontractYear !== filters.year) return false;
        }
      }

      // Location filter (only active when present data is by location)
      if (filters.presentData === 'by-location' && filters.location !== 'all' && filters.location !== 'All') {
        if (subcontract.projects?.location !== filters.location) return false;
      }

      // Trade filter - FIXED: Check if ANY trade item in the subcontract matches the selected trade
      if (filters.trades !== 'all' && filters.trades !== 'All') {
        const hasMatchingTrade = subcontract.subcontract_trade_items?.some(
          item => item.trade_items?.trades?.name === filters.trades
        );
        if (!hasMatchingTrade) return false;
      }

      // Facilities filter - Check if subcontract has any of the selected facilities
      if (filters.facilities.length > 0 && !filters.facilities.includes('All')) {
        const subcontractFacilities = subcontract.subcontract_responsibilities?.map(
          resp => resp.responsibilities?.name
        ).filter(Boolean) || [];
        
        const hasMatchingFacility = filters.facilities.some(
          facility => subcontractFacilities.includes(facility)
        );
        
        if (!hasMatchingFacility) return false;
      }

      // Project name filter (only active when present data is by project and projectFilterType is 'name')
      if (filters.presentData === 'by-project' && filters.projectFilterType === 'name' && filters.projectName !== 'all' && filters.projectName !== 'All') {
        if (subcontract.projects?.name !== filters.projectName) return false;
      }

      // Project code filter (only active when present data is by project and projectFilterType is 'code')
      if (filters.presentData === 'by-project' && filters.projectFilterType === 'code' && filters.projectCode !== 'all' && filters.projectCode !== 'All') {
        if (subcontract.projects?.code !== filters.projectCode) return false;
      }

      return true;
    });
  }, [subcontracts, filters]);

  // Calculate report data - FIXED: Only include trade items that match the selected trade
  const reportData = useMemo(() => {
    const totalSubcontracts = subcontracts.length;
    const currentSubcontracts = filteredSubcontracts.length;
    
    // Group trade items by item name for the table
    const tradeItemsMap = new Map();
    
    filteredSubcontracts.forEach(subcontract => {
      subcontract.subcontract_trade_items?.forEach(item => {
        // FIXED: When trade filter is active, only include items from that trade
        if (filters.trades !== 'all' && filters.trades !== 'All') {
          if (item.trade_items?.trades?.name !== filters.trades) {
            return; // Skip this item if it doesn't match the selected trade
          }
        }

        const itemName = item.trade_items?.name || 'Unknown Item';
        const existingItem = tradeItemsMap.get(itemName);
        
        if (existingItem) {
          existingItem.totalAmount += item.total_price || 0;
          existingItem.totalQuantity += item.quantity || 0;
          existingItem.count += 1;
        } else {
          tradeItemsMap.set(itemName, {
            item: itemName,
            averageRate: item.unit_price || 0,
            totalAmount: item.total_price || 0,
            totalQuantity: item.quantity || 0,
            wastage: item.wastage_percentage || 0,
            unit: item.trade_items?.unit || '',
            count: 1
          });
        }
      });
    });

    // Calculate average rates
    const tableData = Array.from(tradeItemsMap.values()).map(item => ({
      ...item,
      averageRate: item.count > 0 ? item.totalAmount / item.totalQuantity : 0
    }));

    return {
      totalSubcontracts,
      currentSubcontracts,
      filters,
      tableData
    };
  }, [subcontracts, filteredSubcontracts, filters]);

  const updateFilter = (key: keyof ReportFilters, value: string | string[]) => {
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
      
      return newFilters;
    });
  };

  return {
    reportData,
    filterOptions,
    updateFilter,
    isLoading: subcontractsLoading,
    refetch
  };
}
