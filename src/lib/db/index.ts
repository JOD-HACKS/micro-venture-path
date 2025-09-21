// Database layer - automatically switches between mock and Supabase based on environment

import { mockDb } from './mock-adapter';
import { SupabaseAdapter } from './supabase-adapter';

// Create Supabase adapter instance
const supabaseDb = new SupabaseAdapter();

// Environment-based database selection - hardcoded to use mock for frontend demo
const USE_SUPABASE = false; // Hardcoded to always use mock database

// Export the active database adapter
export const db = USE_SUPABASE ? supabaseDb : mockDb;

// Development helper to check which adapter is being used
if (import.meta.env.DEV) {
  console.log('Using Mock database adapter (hardcoded for frontend demo)');
}

// Re-export types for convenience
export type * from './types';