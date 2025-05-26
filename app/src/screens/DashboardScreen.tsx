import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { testSupabaseConnection, testAuthentication, createTestUser } from '../utils/testSupabase';

interface TestResult {
  connected?: boolean;
  tablesExist?: boolean;
  authWorking?: boolean;
  hasSession?: boolean;
  error?: string;
}

export default function DashboardScreen() {
  const [connectionResult, setConnectionResult] = useState<TestResult>({});
  const [authResult, setAuthResult] = useState<TestResult>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    runInitialTests();
  }, []);

  const runInitialTests = async () => {
    setIsLoading(true);
    
    // Test connection
    const connResult = await testSupabaseConnection();
    setConnectionResult(connResult);
    
    // Test authentication
    const authRes = await testAuthentication();
    setAuthResult(authRes);
    
    setIsLoading(false);
  };

  const handleCreateTestUser = async () => {
    setIsLoading(true);
    const result = await createTestUser();
    setIsLoading(false);
    
    if (result.success) {
      // Refresh auth status
      const authRes = await testAuthentication();
      setAuthResult(authRes);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Apparently Co-Parenting App</Text>
      
      <View style={styles.testSection}>
        <Text style={styles.sectionTitle}>🔗 Supabase Connection Test</Text>
        {isLoading ? (
          <Text style={styles.loading}>Testing...</Text>
        ) : (
          <View>
            <Text style={connectionResult.connected ? styles.success : styles.error}>
              Connection: {connectionResult.connected ? '✅ Connected' : '❌ Failed'}
            </Text>
            {connectionResult.error && (
              <Text style={styles.error}>Error: {connectionResult.error}</Text>
            )}
            <Text style={styles.info}>
              Tables: {connectionResult.tablesExist ? '✅ Exist' : '⚠️ Need to be created'}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.testSection}>
        <Text style={styles.sectionTitle}>🔐 Authentication Test</Text>
        <Text style={authResult.authWorking ? styles.success : styles.error}>
          Auth System: {authResult.authWorking ? '✅ Working' : '❌ Failed'}
        </Text>
        <Text style={styles.info}>
          Session: {authResult.hasSession ? '✅ Active' : '⚠️ No session'}
        </Text>
        
        <TouchableOpacity style={styles.button} onPress={handleCreateTestUser}>
          <Text style={styles.buttonText}>Create Test User</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.testSection}>
        <Text style={styles.sectionTitle}>📝 Next Steps</Text>
        <Text style={styles.info}>1. Apply database schema in Supabase dashboard</Text>
        <Text style={styles.info}>2. Set up storage buckets</Text>
        <Text style={styles.info}>3. Configure real-time subscriptions</Text>
        <Text style={styles.info}>4. Test user creation and data storage</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  testSection: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  success: {
    color: '#10b981',
    fontSize: 16,
    marginBottom: 5,
  },
  error: {
    color: '#ef4444',
    fontSize: 16,
    marginBottom: 5,
  },
  info: {
    color: '#666',
    fontSize: 14,
    marginBottom: 3,
  },
  loading: {
    color: '#3b82f6',
    fontSize: 16,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#0ea5e9',
    padding: 12,
    borderRadius: 6,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 