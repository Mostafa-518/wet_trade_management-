
import { BaseService } from './base/BaseService';
import { Alert, AlertInsert, AlertUpdate } from '@/types/alert';

export class AlertService extends BaseService<Alert, AlertInsert, AlertUpdate> {
  constructor() {
    super('alerts');
  }

  async getUnreadCount() {
    const { count, error } = await this.supabase
      .from('alerts')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false)
      .eq('is_dismissed', false);
    
    if (error) throw error;
    return count || 0;
  }

  async markAsRead(id: string) {
    const { error } = await this.supabase
      .from('alerts')
      .update({ is_read: true, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw error;
  }

  async markAsDismissed(id: string) {
    const { error } = await this.supabase
      .from('alerts')
      .update({ is_dismissed: true, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw error;
  }

  async getWithDetails() {
    const { data, error } = await this.supabase
      .from('alerts')
      .select(`
        *,
        projects(name, code),
        subcontractors(company_name, representative_name)
      `)
      .eq('is_dismissed', false)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
}

export const alertService = new AlertService();
