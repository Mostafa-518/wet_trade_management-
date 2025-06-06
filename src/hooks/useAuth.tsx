
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthService, UserProfile } from '@/services/supabaseService';
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
    // Get initial session
    const getInitialSession = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
        
        if (currentUser) {
          const userProfile = await AuthService.getUserProfile();
          setProfile(userProfile);
        }
      } catch (error: any) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = AuthService.onAuthStateChange(async (user) => {
      setUser(user);
      if (user) {
        try {
          const userProfile = await AuthService.getUserProfile();
          setProfile(userProfile);
        } catch (error: any) {
          console.error('Error getting user profile:', error);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await AuthService.signIn(email, password);
      toast({
        title: "Success",
        description: "Successfully signed in!"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in",
        variant: "destructive"
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      await AuthService.signUp(email, password, fullName);
      toast({
        title: "Success",
        description: "Account created successfully! Please check your email to verify your account."
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive"
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AuthService.signOut();
      toast({
        title: "Success",
        description: "Successfully signed out!"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign out",
        variant: "destructive"
      });
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const updatedProfile = await AuthService.updateProfile(updates);
      setProfile(updatedProfile);
      toast({
        title: "Success",
        description: "Profile updated successfully!"
      });
    } catch (error: any) {
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
