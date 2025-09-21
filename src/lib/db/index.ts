// Database layer - currently using mock, easily switchable to Supabase

import { mockDb } from './mock-adapter';
// import { supabaseDb } from './supabase-adapter'; // TODO: Uncomment when ready

// Export the active database adapter
// TODO: Switch to supabaseDb when ready for production
export const db = mockDb;

// Re-export types for convenience
export type * from './types';