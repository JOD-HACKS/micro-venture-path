import React, { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
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

  const loadUserProfile = useCallback(async (userId: string) => {
    try {
      // Try to get user profile from Supabase database
      // Using type casting to handle incomplete database types
      let userProfile = null;
      
      try {
        const { data, error } = await (supabase as any)
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (!error) {
          userProfile = data;
        }
      } catch (dbError) {
        console.log('Database not ready, using auth metadata');
      }

      // If user doesn't exist in database or database is not ready, use auth metadata
      if (!userProfile) {
        const profileFromAuth = {
          id: userId,
          email: session?.user?.email || '',
          name: session?.user?.user_metadata?.name || 'User',
          phone: session?.user?.user_metadata?.phone || null,
          role: (session?.user?.user_metadata?.role as 'student' | 'employer' | 'college_admin' | 'coordinator') || 'student',
          avatar_url: session?.user?.user_metadata?.avatar_url || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          college_id: session?.user?.user_metadata?.college_id
        };

        // Try to create user in database if possible
        try {
          const { data: createdUser } = await (supabase as any)
            .from('users')
            .insert(profileFromAuth)
            .select()
            .single();
          
          if (createdUser) {
            userProfile = createdUser;
          }
        } catch (createError) {
          console.log('Could not create user in database, using auth metadata');
          userProfile = profileFromAuth;
        }
      }

      setUser({
        ...userProfile,
        session
      });
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  }, [session]);

  useEffect(() => {
    // Hardcoded mock session for frontend demo - no real auth
    console.log('Using mock authentication for frontend demo');
    
    // Set a mock user for demo purposes
    const mockUser: AuthUser = {
      id: 'demo-user-123',
      email: 'demo@prashiskshan.com',
      name: 'Demo Student',
      phone: '+919876543210',
      role: 'student',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      college_id: 'demo-college-123',
      session: null
    };
    
    setUser(mockUser);
    setSession(null);
    setLoading(false);
    
    // No subscription cleanup needed for mock auth
  }, []);

  const signUp = async (data: SignUpData) => {
    try {
      setLoading(true);
      
      // Mock sign up for frontend demo
      console.log('Mock sign up:', data);
      
      const mockUser: AuthUser = {
        id: `mock-user-${Date.now()}`,
        email: data.email,
        name: data.name,
        phone: data.phone,
        role: data.role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        college_id: data.collegeId,
        session: null
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
      
      // Mock sign in for frontend demo
      console.log('Mock sign in:', email);
      
      const mockUser: AuthUser = {
        id: 'demo-user-signin-123',
        email: email,
        name: 'Demo User',
        phone: '+919876543210',
        role: 'student', // default; UI can set role during sign up
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        college_id: 'demo-college-123',
        session: null
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
      
      // Mock sign out for frontend demo
      console.log('Mock sign out');
      
      // Clear local state
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

      // Mock profile update for frontend demo
      console.log('Mock profile update:', data);

      // Update local state
      setUser(prev => prev ? { ...prev, ...data, updated_at: new Date().toISOString() } : null);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // Mock password reset for frontend demo
      console.log('Mock password reset for:', email);
      
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