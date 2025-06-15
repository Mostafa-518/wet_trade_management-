
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './types';

export class AuthService {
  static async signUp(email: string, password: string, fullName?: string) {
    console.log('AuthService.signUp called with:', { email, fullName });
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || ''
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      console.log('SignUp response:', { data, error });
      
      if (error) {
        console.error('SignUp error:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('SignUp catch block:', error);
      throw error;
    }
  }

  static async signIn(email: string, password: string) {
    console.log('AuthService.signIn called with:', { email });
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      console.log('SignIn response:', { data, error });
      
      if (error) {
        console.error('SignIn error:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('SignIn catch block:', error);
      throw error;
    }
  }

  static async signOut() {
    console.log('AuthService.signOut called');
    
    try {
      const { error } = await supabase.auth.signOut();
      console.log('SignOut response:', { error });
      
      if (error) {
        console.error('SignOut error:', error);
        throw error;
      }
    } catch (error) {
      console.error('SignOut catch block:', error);
      throw error;
    }
  }

  static async getCurrentUser() {
    console.log('AuthService.getCurrentUser called');
    
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      console.log('GetCurrentUser response:', { user, error });
      
      if (error) {
        console.error('GetCurrentUser error:', error);
        throw error;
      }
      return user;
    } catch (error) {
      console.error('GetCurrentUser catch block:', error);
      throw error;
    }
  }

  static async getUserProfile() {
    console.log('AuthService.getUserProfile called');
    
    try {
      const user = await this.getCurrentUser();
      if (!user) {
        console.log('No user found, returning null');
        return null;
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      console.log('GetUserProfile response:', { data, error });
      
      if (error) {
        console.error('GetUserProfile error:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('GetUserProfile catch block:', error);
      throw error;
    }
  }

  static async updateProfile(updates: Partial<UserProfile>) {
    console.log('AuthService.updateProfile called with:', updates);
    
    try {
      const user = await this.getCurrentUser();
      if (!user) {
        const error = new Error('No authenticated user');
        console.error('UpdateProfile error:', error);
        throw error;
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .single();
      
      console.log('UpdateProfile response:', { data, error });
      
      if (error) {
        console.error('UpdateProfile error:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('UpdateProfile catch block:', error);
      throw error;
    }
  }

  static onAuthStateChange(callback: (user: any) => void) {
    console.log('AuthService.onAuthStateChange called');
    
    return supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', { event, session });
      callback(session?.user || null);
    });
  }

  static async getSession() {
    console.log('AuthService.getSession called');
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log('GetSession response:', { session, error });
      
      if (error) {
        console.error('GetSession error:', error);
        throw error;
      }
      return session;
    } catch (error) {
      console.error('GetSession catch block:', error);
      throw error;
    }
  }
}

// Export an instance as well for consistency
export const authService = AuthService;
