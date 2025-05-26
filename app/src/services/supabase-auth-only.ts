import { AuthClient } from '@supabase/auth-js';
import { PostgrestClient } from '@supabase/postgrest-js';

const supabaseUrl = 'https://hkmswnomcnwmqczsncck.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrbXN3bm9tY253bXFjenNuY2NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNTY1MjksImV4cCI6MjA2MzgzMjUyOX0.xo_0ptxD5pXO9BlTFAssodyEXhcJE4B9v39jcjSH3l4';

// Create auth client only (no WebSocket dependencies)
export const authClient = new AuthClient({
  url: `${supabaseUrl}/auth/v1`,
  headers: {
    'Authorization': `Bearer ${supabaseAnonKey}`,
    'apikey': supabaseAnonKey,
  },
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: false,
});

// Create database client for queries (no WebSocket dependencies)
export const dbClient = new PostgrestClient(`${supabaseUrl}/rest/v1`, {
  headers: {
    'Authorization': `Bearer ${supabaseAnonKey}`,
    'apikey': supabaseAnonKey,
  },
});

// Create a supabase-like object for compatibility
export const supabase = {
  auth: authClient,
  from: (table: string) => dbClient.from(table),
};

// Export constants
export const TABLES = {
  USERS: 'users',
  CHILDREN: 'children',
  CO_PARENTS: 'co_parents',
  MESSAGES: 'messages',
  EXPENSES: 'expenses',
  SCHEDULE_EVENTS: 'schedule_events',
  DOCUMENTS: 'documents',
} as const; 