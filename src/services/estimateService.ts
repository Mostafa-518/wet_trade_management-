
import { supabase } from '@/integrations/supabase/client';

export type CreateEstimateInput = {
  item_name: string;
  unit: string;
  trade_id?: string;
  quantity?: number;
  currency?: string; // defaults to EGP
  location?: string;
  specs?: string;
  project_id?: string;
};

export class EstimateService {
  async createDraft(input: CreateEstimateInput) {
    const {
      item_name,
      unit,
      trade_id,
      quantity,
      currency = 'EGP',
      location,
      specs,
      project_id,
    } = input;

    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;
    if (!user) throw new Error('You must be logged in to create an estimate');

    const payload: any = {
      user_id: user.id,
      status: 'draft',
      item_name,
      unit,
      trade_id: trade_id ?? null,
      quantity: quantity ?? null,
      currency,
      location: location ?? null,
      specs: specs ?? null,
      project_id: project_id ?? null,
    };

    const { data, error } = await supabase
      .from('estimates')
      .insert(payload)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  async getById(id: string) {
    const { data, error } = await supabase
      .from('estimates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async listMyRecent(limit = 10) {
    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;
    if (!user) throw new Error('You must be logged in');

    const { data, error } = await supabase
      .from('estimates')
      .select('id, item_name, unit, status, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data ?? [];
  }
}

export const estimateService = new EstimateService();
