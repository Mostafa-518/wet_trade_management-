
import { BaseService } from './base/BaseService';
import { Alert } from '@/types/alert';

export class AlertService extends BaseService {
  constructor() {
    super('alerts');
  }

  async getAlerts(): Promise<Alert[]> {
    const { data, error } = await this.client
      .from('alerts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async markAsRead(alertId: string): Promise<void> {
    const { error } = await this.client
      .from('alerts')
      .update({ is_read: true })
      .eq('id', alertId);
    
    if (error) throw error;
  }

  async dismissAlert(alertId: string): Promise<void> {
    const { error } = await this.client
      .from('alerts')
      .update({ is_dismissed: true })
      .eq('id', alertId);
    
    if (error) throw error;
  }

  async getUnreadCount(): Promise<number> {
    const { count, error } = await this.client
      .from('alerts')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false)
      .eq('is_dismissed', false);
    
    if (error) throw error;
    return count || 0;
  }
}

export const alertService = new AlertService();
