import { BaseService } from './base/BaseService';
import { supabase } from '@/integrations/supabase/client';
import { Subcontract } from '@/types/subcontract';

class SubcontractService extends BaseService<Subcontract, any, any> {
  constructor() {
    super('subcontracts');
  }

  async getAll() {
    const { data, error } = await supabase
      .from('subcontracts')
      .select(`
        *,
        projects(name),
        subcontractors(company_name, representative_name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Transform database data to match frontend interface
    return (data || []).map(item => ({
      id: item.id,
      contractId: item.contract_number || '',
      project: item.projects?.name || '',
      subcontractor: item.subcontractors?.company_name || '',
      tradeItems: [], // Will be loaded separately if needed
      responsibilities: [], // Will be loaded separately if needed
      totalValue: Number(item.total_value) || 0,
      status: item.status || 'draft',
      startDate: item.start_date || '',
      endDate: item.end_date || '',
      dateOfIssuing: item.date_of_issuing || '',
      description: item.description || '',
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      contractType: (item.contract_type as 'subcontract' | 'ADD') || 'subcontract',
      addendumNumber: item.addendum_number,
      parentSubcontractId: item.parent_subcontract_id
    }));
  }
}

export default new SubcontractService();