import { supabase } from '../services/supabase-auth-only';

export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error && error.code === '42P01') {
      console.log('Tables not found - this is expected for initial setup');
      return { connected: true, tablesExist: false };
    } else if (error) {
      console.error('Connection error:', error);
      return { connected: false, error: error.message };
    }
    
    console.log('✅ Supabase connection successful!');
    return { connected: true, tablesExist: true };
    
  } catch (error) {
    console.error('Test failed:', error);
    return { connected: false, error: 'Connection failed' };
  }
}

export async function testAuthentication() {
  try {
    console.log('Testing Supabase authentication...');
    
    // Test if we can get the current session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Auth test error:', error);
      return { authWorking: false, error: error.message };
    }
    
    console.log('✅ Supabase authentication working!');
    console.log('Current session:', session ? 'Logged in' : 'No active session');
    
    return { authWorking: true, hasSession: !!session };
    
  } catch (error) {
    console.error('Auth test failed:', error);
    return { authWorking: false, error: 'Auth test failed' };
  }
}

export async function createTestUser() {
  try {
    console.log('Creating test user...');
    
    const testEmail = 'test@apparently.app';
    const testPassword = 'testpass123';
    
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          first_name: 'Test',
          last_name: 'Parent',
        },
      },
    });
    
    if (error) {
      console.error('Test user creation error:', error);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Test user created successfully!');
    console.log('User ID:', data.user?.id);
    
    return { success: true, userId: data.user?.id };
    
  } catch (error) {
    console.error('Test user creation failed:', error);
    return { success: false, error: 'Failed to create test user' };
  }
} 