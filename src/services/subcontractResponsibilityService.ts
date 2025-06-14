
import { supabase } from '@/integrations/supabase/client';

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

export class SubcontractResponsibilityService {
  async getAll() {
    const { data, error } = await supabase
      .from('subcontract_responsibilities' as any)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as SubcontractResponsibility[];
  }

  async getById(id: string) {
    const { data, error } = await supabase
      .from('subcontract_responsibilities' as any)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as SubcontractResponsibility;
  }

  async create(item: SubcontractResponsibilityInsert) {
    const { data, error } = await supabase
      .from('subcontract_responsibilities' as any)
      .insert(item)
      .select()
      .single();
    
    if (error) throw error;
    return data as SubcontractResponsibility;
  }

  async update(id: string, item: SubcontractResponsibilityUpdate) {
    const { data, error } = await supabase
      .from('subcontract_responsibilities' as any)
      .update({ ...item, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as SubcontractResponsibility;
  }

  async delete(id: string) {
    const { error } = await supabase
      .from('subcontract_responsibilities' as any)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  async getBySubcontractId(subcontractId: string) {
    const { data, error } = await supabase
      .from('subcontract_responsibilities' as any)
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
      .from('subcontract_responsibilities' as any)
      .delete()
      .eq('subcontract_id', subcontractId);
    
    if (error) throw error;
  }

  async createMany(responsibilities: SubcontractResponsibilityInsert[]) {
    const { data, error } = await supabase
      .from('subcontract_responsibilities' as any)
      .insert(responsibilities)
      .select();
    
    if (error) throw error;
    return data;
  }
}

export const subcontractResponsibilityService = new SubcontractResponsibilityService();
