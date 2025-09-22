import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { User, UserRole } from '@/lib/db/types';

interface AuthUser extends User {
  session?: Session | null;
  college_id?: string;
}

interface StoredUser extends Omit<AuthUser, 'session'> {
  password: string;
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
  role: UserRole;
  collegeId?: string;
}

const USERS_STORAGE_KEY = 'prashiskshan.users';
const SESSION_STORAGE_KEY = 'prashiskshan.session';
const isBrowser = typeof window !== 'undefined';

const roleHomeRoute: Record<UserRole, string> = {
  student: '/dashboard',
  employer: '/employer/dashboard',
  college_admin: '/admin/placement-cell',
  coordinator: '/coordinator/verify',
};

export const ROLE_HOME_ROUTE = roleHomeRoute;

const DEMO_USERS: StoredUser[] = [
  {
    id: 'demo-student-001',
    email: 'student@gmail.com',
    name: 'Demo Student',
    phone: '+911234567890',
    role: 'student',
    avatar_url: undefined,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
    college_id: 'demo-college-123',
    password: 'demo1234',
  },
  {
    id: 'demo-coordinator-001',
    email: 'coordinator@gmail.com',
    name: 'Demo Coordinator',
    phone: '+911234567891',
    role: 'coordinator',
    avatar_url: undefined,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
    college_id: undefined,
    password: 'demo1234',
  },
  {
    id: 'demo-employer-001',
    email: 'employer@gmail.com',
    name: 'Demo Employer',
    phone: '+911234567892',
    role: 'employer',
    avatar_url: undefined,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
    college_id: undefined,
    password: 'demo1234',
  },
  {
    id: 'demo-admin-001',
    email: 'collegeadmin@gmail.com',
    name: 'Demo College Admin',
    phone: '+911234567893',
    role: 'college_admin',
    avatar_url: undefined,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
    college_id: undefined,
    password: 'demo1234',
  },
];

const stripPassword = (user: StoredUser): AuthUser => {
  const { password: _password, ...rest } = user;
  return { ...rest, session: null };
};

const getStoredUsers = (): StoredUser[] => {
  if (!isBrowser) return [];
  try {
    const raw = window.localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to parse stored users', error);
    return [];
  }
};

const setStoredUsers = (users: StoredUser[]) => {
  if (!isBrowser) return;
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

const getStoredSession = (): string | null => {
  if (!isBrowser) return null;
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { userId?: string } | null;
    return parsed?.userId ?? null;
  } catch (error) {
    console.error('Failed to parse stored session', error);
    return null;
  }
};

const setStoredSession = (userId: string) => {
  if (!isBrowser) return;
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ userId }));
};

const clearStoredSession = () => {
  if (!isBrowser) return;
  window.localStorage.removeItem(SESSION_STORAGE_KEY);
};

const generateUserId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
};

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
    if (!isBrowser) {
      setLoading(false);
      return;
    }

    let storedUsers = getStoredUsers();
    const existingEmails = new Set(storedUsers.map(u => u.email.toLowerCase()));
    const demoUsersToAdd = DEMO_USERS.filter(demo => !existingEmails.has(demo.email.toLowerCase()));

    if (demoUsersToAdd.length > 0) {
      storedUsers = [...storedUsers, ...demoUsersToAdd];
      setStoredUsers(storedUsers);
      console.info('Seeded demo accounts for quick testing.');
    }

    const sessionUserId = getStoredSession();
    if (sessionUserId) {
      const existing = storedUsers.find(stored => stored.id === sessionUserId);
      if (existing) {
        setUser(stripPassword(existing));
      } else {
        clearStoredSession();
      }
    }

    setSession(null);
    setLoading(false);
  }, []);

  const signUp = async (data: SignUpData) => {
    setLoading(true);
    try {
      const email = data.email.trim().toLowerCase();
      const users = getStoredUsers();

      const existing = users.find(u => u.email.toLowerCase() === email);
      if (existing) {
        return { user: null, error: new Error('An account with this email already exists.') };
      }

      const timestamp = new Date().toISOString();
      const newUser: StoredUser = {
        id: generateUserId(),
        email,
        name: data.name.trim(),
        phone: data.phone.trim(),
        role: data.role,
        avatar_url: undefined,
        created_at: timestamp,
        updated_at: timestamp,
        college_id: data.collegeId?.trim() || undefined,
        password: data.password,
      };

      const updatedUsers = [...users, newUser];
      setStoredUsers(updatedUsers);
      setStoredSession(newUser.id);

      const authUser = stripPassword(newUser);
      setUser(authUser);
      return { user: authUser, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const users = getStoredUsers();
      const existing = users.find(u => u.email.toLowerCase() === normalizedEmail);

      if (!existing || existing.password !== password) {
        return { user: null, error: new Error('Invalid email or password.') };
      }

      setStoredSession(existing.id);
      const authUser = stripPassword(existing);
      setUser(authUser);
      return { user: authUser, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      clearStoredSession();
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

      const users = getStoredUsers();
      const index = users.findIndex(stored => stored.id === user.id);

      if (index === -1) {
        return { error: new Error('User profile not found') };
      }

      const { session: _session, ...rest } = data;
      const updatedUser: StoredUser = {
        ...users[index],
        ...rest,
        updated_at: new Date().toISOString(),
        password: users[index].password,
      };

      users[index] = updatedUser;
      setStoredUsers(users);
      setUser(stripPassword(updatedUser));
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const users = getStoredUsers();
      const exists = users.some(u => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!exists) {
        return { error: new Error('No account found with that email.') };
      }

      console.info(`Password reset requested for ${email}. Implement email flow when backend is available.`);
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
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
