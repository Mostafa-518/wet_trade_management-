
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Tables = Database['public']['Tables'];

// Type aliases for cleaner code
export type Project = Tables['projects']['Row'];
export type ProjectInsert = Tables['projects']['Insert'];
export type ProjectUpdate = Tables['projects']['Update'];

export type Subcontractor = Tables['subcontractors']['Row'];
export type SubcontractorInsert = Tables['subcontractors']['Insert'];
export type SubcontractorUpdate = Tables['subcontractors']['Update'];

export type Trade = Tables['trades']['Row'];
export type TradeInsert = Tables['trades']['Insert'];
export type TradeUpdate = Tables['trades']['Update'];

export type TradeItem = Tables['trade_items']['Row'];
export type TradeItemInsert = Tables['trade_items']['Insert'];
export type TradeItemUpdate = Tables['trade_items']['Update'];

export type Subcontract = Tables['subcontracts']['Row'];
export type SubcontractInsert = Tables['subcontracts']['Insert'];
export type SubcontractUpdate = Tables['subcontracts']['Update'];

export type Responsibility = Tables['responsibilities']['Row'];
export type ResponsibilityInsert = Tables['responsibilities']['Insert'];
export type ResponsibilityUpdate = Tables['responsibilities']['Update'];

export type UserProfile = Tables['user_profiles']['Row'];
export type UserProfileInsert = Tables['user_profiles']['Insert'];
export type UserProfileUpdate = Tables['user_profiles']['Update'];

// Base service class with common CRUD operations
abstract class BaseService<T, TInsert, TUpdate> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async getAll() {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as T[];
  }

  async getById(id: string) {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as T;
  }

  async create(item: TInsert) {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(item)
      .select()
      .single();
    
    if (error) throw error;
    return data as T;
  }

  async update(id: string, item: TUpdate) {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ ...item, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as T;
  }

  async delete(id: string) {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}

// Project Service
export class ProjectService extends BaseService<Project, ProjectInsert, ProjectUpdate> {
  constructor() {
    super('projects');
  }
}

// Subcontractor Service
export class SubcontractorService extends BaseService<Subcontractor, SubcontractorInsert, SubcontractorUpdate> {
  constructor() {
    super('subcontractors');
  }
}

// Trade Service
export class TradeService extends BaseService<Trade, TradeInsert, TradeUpdate> {
  constructor() {
    super('trades');
  }
}

// Trade Item Service
export class TradeItemService extends BaseService<TradeItem, TradeItemInsert, TradeItemUpdate> {
  constructor() {
    super('trade_items');
  }

  async getByTradeId(tradeId: string) {
    const { data, error } = await supabase
      .from('trade_items')
      .select('*')
      .eq('trade_id', tradeId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as TradeItem[];
  }
}

// Responsibility Service
export class ResponsibilityService extends BaseService<Responsibility, ResponsibilityInsert, ResponsibilityUpdate> {
  constructor() {
    super('responsibilities');
  }
}

// Subcontract Service
export class SubcontractService extends BaseService<Subcontract, SubcontractInsert, SubcontractUpdate> {
  constructor() {
    super('subcontracts');
  }

  async getWithDetails(id: string) {
    const { data, error } = await supabase
      .from('subcontracts')
      .select(`
        *,
        projects(name, code),
        subcontractors(name, contact_person)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
}

// User Profile Service
export class UserProfileService extends BaseService<UserProfile, UserProfileInsert, UserProfileUpdate> {
  constructor() {
    super('user_profiles');
  }
}

// Authentication Service
export class AuthService {
  static async signUp(email: string, password: string, fullName?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || ''
        }
      }
    });
    
    if (error) throw error;
    return data;
  }

  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  }

  static async getUserProfile() {
    const user = await this.getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateProfile(updates: Partial<UserProfile>) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('user_profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null);
    });
  }
}

// Create service instances
export const projectService = new ProjectService();
export const subcontractorService = new SubcontractorService();
export const tradeService = new TradeService();
export const tradeItemService = new TradeItemService();
export const responsibilityService = new ResponsibilityService();
export const subcontractService = new SubcontractService();
export const userProfileService = new UserProfileService();
