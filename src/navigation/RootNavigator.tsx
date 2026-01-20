import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { BottomTabNavigator } from './BottomTabNavigator';
import { SearchResultsScreen, BusTrackingScreen } from '../screens';
import { RootStackParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        <Stack.Screen
          name="SearchResults"
          component={SearchResultsScreen}
          options={{
            headerShown: true,
            title: 'Search Results',
          }}
        />
        <Stack.Screen
          name="BusTracking"
          component={BusTrackingScreen}
          options={{
            headerShown: true,
            title: 'Bus Tracking',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
