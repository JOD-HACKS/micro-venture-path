import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/lib/db/types';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

interface AuthUser extends User {
  session?: Session;
  college_id?: string; // Additional field for convenience
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ user: AuthUser | null; error: Error | null }>;
  signUp: (data: SignUpData) => Promise<{ user: AuthUser | null; error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
}

interface SignUpData {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: 'student' | 'employer' | 'college_admin' | 'coordinator';
  collegeId?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
      } else {
        setSession(session);
        if (session?.user) {
          await loadUserProfile(session.user.id);
        }
      }
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        
        if (session?.user) {
          await loadUserProfile(session.user.id);
        } else {
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      // For now, create a mock user profile since Supabase tables aren't set up yet
      // TODO: Replace with actual Supabase query when database is configured
      const mockProfile = {
        id: userId,
        email: session?.user?.email || '',
        name: session?.user?.user_metadata?.name || 'User',
        phone: session?.user?.user_metadata?.phone || '',
        role: (session?.user?.user_metadata?.role as any) || 'student',
        avatar_url: session?.user?.user_metadata?.avatar_url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        college_id: session?.user?.user_metadata?.college_id
      };

      setUser({
        ...mockProfile,
        session
      });
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      setLoading(true);
      
      // For now, simulate sign up since Supabase database isn't configured
      // TODO: Replace with actual Supabase auth when database is set up
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: AuthUser = {
        id: 'mock_' + Date.now(),
        email: data.email,
        name: data.name,
        phone: data.phone,
        role: data.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        college_id: data.collegeId
      };

      setUser(mockUser);
      return { user: mockUser, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // For now, simulate sign in since Supabase database isn't configured
      // TODO: Replace with actual Supabase auth when database is set up
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: AuthUser = {
        id: 'mock_user_1',
        email: email,
        name: 'Demo User',
        phone: '+91 98765 43210',
        role: 'student',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setUser(mockUser);
      return { user: mockUser, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // For now, just clear local state
      // TODO: Replace with actual Supabase auth when database is set up
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Failed to sign out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<AuthUser>) => {
    try {
      if (!user) {
        return { error: new Error('No user logged in') };
      }

      // For now, just update local state
      // TODO: Replace with actual Supabase update when database is set up
      setUser(prev => prev ? { ...prev, ...data, updated_at: new Date().toISOString() } : null);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // For now, simulate password reset
      // TODO: Replace with actual Supabase auth when database is set up
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};