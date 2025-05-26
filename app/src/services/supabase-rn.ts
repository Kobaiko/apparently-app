import { createClient } from '@supabase/supabase-js';

// For Expo, we'll use environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hkmswnomcnwmqczsncck.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrbXN3bm9tY253bXFjenNuY2NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNTY1MjksImV4cCI6MjA2MzgzMjUyOX0.xo_0ptxD5pXO9BlTFAssodyEXhcJE4B9v39jcjSH3l4';

// React Native compatible Supabase client - NO REALTIME
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    // Storage will use React Native AsyncStorage by default
    storage: undefined, // Let Supabase handle this automatically
  },
  // Completely disable realtime to avoid WebSocket issues
  realtime: {
    params: {
      eventsPerSecond: 0, // Disable all realtime events
    },
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-react-native',
    },
    fetch: fetch, // Use React Native's fetch
  },
});

// Database table names
export const TABLES = {
  USERS: 'users',
  CHILDREN: 'children',
  CO_PARENTS: 'co_parents',
  CHILD_CO_PARENTS: 'child_co_parents',
  MESSAGES: 'messages',
  EXPENSES: 'expenses',
  SCHEDULE_EVENTS: 'schedule_events',
  DOCUMENTS: 'documents',
} as const;

// Storage bucket names
export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  DOCUMENTS: 'documents',
  ATTACHMENTS: 'attachments',
} as const; 