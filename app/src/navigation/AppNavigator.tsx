import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

// Placeholder screens - will be created in future tasks
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

// Main App Navigator
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Main" component={TabNavigator} />
        {/* Add auth screens, onboarding, etc. in future tasks */}
      </Stack.Navigator>
    </NavigationContainer>
  );
} 