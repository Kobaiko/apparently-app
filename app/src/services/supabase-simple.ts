import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hkmswnomcnwmqczsncck.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrbXN3bm9tY253bXFjenNuY2NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNTY1MjksImV4cCI6MjA2MzgzMjUyOX0.xo_0ptxD5pXO9BlTFAssodyEXhcJE4B9v39jcjSH3l4';

// Simple Supabase client - Auth only, no realtime features
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

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