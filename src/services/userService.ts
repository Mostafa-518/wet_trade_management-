
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert'];
type UserProfileUpdate = Database['public']['Tables']['user_profiles']['Update'];

export class UserService {
  static async getAll() {
    console.log('UserService: Getting all users');
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('UserService: Error getting users:', error);
      throw error;
    }
    
    console.log('UserService: Got users:', data);
    return data;
  }

  static async getById(id: string) {
    console.log('UserService: Getting user by ID:', id);
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('UserService: Error getting user by ID:', error);
      throw error;
    }
    
    console.log('UserService: Got user:', data);
    return data;
  }

  static async create(user: UserProfileInsert) {
    console.log('UserService: Creating user:', user);
    const { data, error } = await supabase
      .from('user_profiles')
      .insert(user)
      .select()
      .single();
    
    if (error) {
      console.error('UserService: Error creating user:', error);
      throw error;
    }
    
    console.log('UserService: Created user:', data);
    return data;
  }

  static async update(id: string, user: UserProfileUpdate) {
    console.log('UserService: Updating user ID:', id, 'with data:', user);
    
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ 
        ...user, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('UserService: Error updating user:', error);
      throw error;
    }
    
    console.log('UserService: Updated user:', data);
    return data;
  }

  static async delete(id: string) {
    console.log('UserService: Deleting user ID:', id);
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('UserService: Error deleting user:', error);
      throw error;
    }
    
    console.log('UserService: Deleted user successfully');
  }
}

// Export an instance as well for consistency
export const userService = UserService;
