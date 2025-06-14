
import { supabase } from '@/integrations/supabase/client';
import { BaseService } from './base/BaseService';

interface SubcontractResponsibility {
  id: string;
  subcontract_id: string;
  responsibility_id: string;
  created_at: string;
}

interface SubcontractResponsibilityInsert {
  subcontract_id: string;
  responsibility_id: string;
}

interface SubcontractResponsibilityUpdate {
  subcontract_id?: string;
  responsibility_id?: string;
}

export class SubcontractResponsibilityService extends BaseService<SubcontractResponsibility, SubcontractResponsibilityInsert, SubcontractResponsibilityUpdate> {
  constructor() {
    super('subcontract_responsibilities');
  }

  async getBySubcontractId(subcontractId: string) {
    const { data, error } = await supabase
      .from('subcontract_responsibilities')
      .select(`
        *,
        responsibilities(*)
      `)
      .eq('subcontract_id', subcontractId);
    
    if (error) throw error;
    return data;
  }

  async deleteBySubcontractId(subcontractId: string) {
    const { error } = await supabase
      .from('subcontract_responsibilities')
      .delete()
      .eq('subcontract_id', subcontractId);
    
    if (error) throw error;
  }

  async createMany(responsibilities: SubcontractResponsibilityInsert[]) {
    const { data, error } = await supabase
      .from('subcontract_responsibilities')
      .insert(responsibilities)
      .select();
    
    if (error) throw error;
    return data;
  }
}

export const subcontractResponsibilityService = new SubcontractResponsibilityService();
