import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getSession, setSession, setUser } from '../store/authSlice';
import { AuthService } from '../services/auth';
import type { AppDispatch, RootState } from '../store';

// Auth navigation
import AuthStack from './AuthStack';

// Main app screens
import DashboardScreen from '../screens/DashboardScreen';
import CalendarScreen from '../screens/CalendarScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ExpensesScreen from '../screens/ExpensesScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Main Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          paddingBottom: 10,
          paddingTop: 10,
          height: 80,
        },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          // tabBarIcon will be added when we have icons
        }}
      />
      <Tab.Screen 
        name="Calendar" 
        component={CalendarScreen}
        options={{
          tabBarLabel: 'Calendar',
        }}
      />
      <Tab.Screen 
        name="Messages" 
        component={MessagesScreen}
        options={{
          tabBarLabel: 'Messages',
        }}
      />
      <Tab.Screen 
        name="Expenses" 
        component={ExpensesScreen}
        options={{
          tabBarLabel: 'Expenses',
        }}
      />
    </Tab.Navigator>
  );
}

// Loading Screen Component
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0ea5e9" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

// Main App Navigator
export default function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Check for existing session on app start
    const initializeAuth = async () => {
      try {
        const { session } = await AuthService.getSession();
        
        if (session) {
          dispatch(setSession(session));
          const { user } = await AuthService.getCurrentUser();
          if (user) {
            dispatch(setUser(user as any));
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = AuthService.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session ? 'Session exists' : 'No session');
      dispatch(setSession(session));
      
      if (session?.user) {
        dispatch(setUser(session.user as any));
      } else {
        dispatch(setUser(null));
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [dispatch]);

  if (isLoading) {
    return (
      <NavigationContainer>
        <LoadingScreen />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={TabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
}); 