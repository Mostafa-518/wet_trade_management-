
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { AuthService } from '@/services/authService';
import { UserProfile } from '@/services/types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener...');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = AuthService.onAuthStateChange((user) => {
      console.log('AuthProvider: Auth state changed:', { user });
      setUser(user);
      
      if (user) {
        // Defer profile fetch to avoid blocking
        setTimeout(() => {
          fetchUserProfile(user.id);
        }, 0);
      } else {
        setProfile(null);
        setSession(null);
      }
      setLoading(false);
    });

    // THEN check for existing session
    AuthService.getSession().then(({ data: { session } }) => {
      console.log('AuthProvider: Initial session:', { session });
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    }).catch((error) => {
      console.error('AuthProvider: Error getting initial session:', error);
      setLoading(false);
    });

    return () => {
      console.log('AuthProvider: Cleaning up auth subscription...');
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('AuthProvider: Fetching user profile for:', userId);
      const userProfile = await AuthService.getUserProfile();
      console.log('AuthProvider: User profile fetched:', userProfile);
      setProfile(userProfile);
    } catch (error) {
      console.error('AuthProvider: Error fetching user profile:', error);
      // Don't set profile to null here - the user might just not have a profile yet
      // The trigger should create it automatically for new users
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('AuthProvider: Sign in attempt for:', email);
    try {
      const data = await AuthService.signIn(email, password);
      setUser(data.user);
      setSession(data.session);
      if (data.user) {
        await fetchUserProfile(data.user.id);
      }
      return { error: null };
    } catch (error) {
      console.error('AuthProvider: Sign in catch:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    console.log('AuthProvider: Sign up attempt for:', email, 'with fullName:', fullName);
    try {
      const data = await AuthService.signUp(email, password, fullName);
      // Note: user profile will be created automatically by the database trigger
      console.log('AuthProvider: Sign up successful, user profile should be created automatically');
      return { error: null };
    } catch (error) {
      console.error('AuthProvider: Sign up catch:', error);
      return { error };
    }
  };

  const signOut = async () => {
    console.log('AuthProvider: Sign out attempt...');
    try {
      await AuthService.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
    } catch (error) {
      console.error('AuthProvider: Sign out error:', error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    console.log('AuthProvider: Update profile attempt:', updates);
    try {
      const updatedProfile = await AuthService.updateProfile(updates);
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error('AuthProvider: Update profile error:', error);
      throw error;
    }
  };

  const contextValue: AuthContextType = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
