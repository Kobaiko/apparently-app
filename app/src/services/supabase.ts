import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// For Expo, we'll use the expo-constants to get environment variables
// In production, these should be set via Expo's environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hkmswnomcnwmqczsncck.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrbXN3bm9tY253bXFjenNuY2NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNTY1MjksImV4cCI6MjA2MzgzMjUyOX0.xo_0ptxD5pXO9BlTFAssodyEXhcJE4B9v39jcjSH3l4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Disable automatic token refresh for React Native
    autoRefreshToken: true,
    persistSession: true,
    // Use secure storage for tokens in React Native
    detectSessionInUrl: false,
  },
});

// Database table names (to be created)
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

// Storage bucket names (to be created)
export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  DOCUMENTS: 'documents',
  ATTACHMENTS: 'attachments',
} as const; 