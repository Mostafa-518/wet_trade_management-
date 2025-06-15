
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthService } from '@/services';
import { UserProfile } from '@/services/types';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: any;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log('AuthProvider useEffect starting');
    
    // Set up auth state listener first
    const { data: { subscription } } = AuthService.onAuthStateChange(async (user) => {
      console.log('Auth state changed, user:', user);
      setUser(user);
      
      if (user) {
        // Use setTimeout to avoid potential deadlock
        setTimeout(async () => {
          try {
            const userProfile = await AuthService.getUserProfile();
            console.log('Fetched user profile:', userProfile);
            setProfile(userProfile);
          } catch (error: any) {
            console.error('Error fetching user profile:', error);
          }
        }, 0);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    // Then get initial session
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...');
        const session = await AuthService.getSession();
        console.log('Initial session:', session);
        
        if (session?.user) {
          setUser(session.user);
          const userProfile = await AuthService.getUserProfile();
          setProfile(userProfile);
        }
      } catch (error: any) {
        console.error('Error getting initial session:', error);
        // Don't throw here, just log the error
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('useAuth.signIn called');
    
    try {
      await AuthService.signIn(email, password);
      toast({
        title: "Success",
        description: "Successfully signed in!"
      });
    } catch (error: any) {
      console.error('SignIn error in useAuth:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign in. Please check your Supabase configuration.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    console.log('useAuth.signUp called');
    
    try {
      await AuthService.signUp(email, password, fullName);
      toast({
        title: "Success",
        description: "Account created successfully! Please check your email to verify your account."
      });
    } catch (error: any) {
      console.error('SignUp error in useAuth:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create account. Please check your Supabase configuration.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const signOut = async () => {
    console.log('useAuth.signOut called');
    
    try {
      await AuthService.signOut();
      toast({
        title: "Success",
        description: "Successfully signed out!"
      });
    } catch (error: any) {
      console.error('SignOut error in useAuth:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign out",
        variant: "destructive"
      });
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    console.log('useAuth.updateProfile called');
    
    try {
      const updatedProfile = await AuthService.updateProfile(updates);
      setProfile(updatedProfile);
      toast({
        title: "Success",
        description: "Profile updated successfully!"
      });
    } catch (error: any) {
      console.error('UpdateProfile error in useAuth:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
      throw error;
    }
  };

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile
  };

  console.log('AuthProvider rendering with:', { user: !!user, profile: !!profile, loading });

  return (
    <AuthContext.Provider value={value}>
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
