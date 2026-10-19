import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { FloatingTabBar } from './FloatingTabBar';
import { HomeScreen } from '../screens/main/HomeScreen';
import { HealthScreen } from '../screens/main/HealthScreen';
import { FamilyScreen } from '../screens/main/FamilyScreen';
import { SettingsScreen } from '../screens/main/SettingsScreen';
import { ComingSoon } from '../components/ComingSoonScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();


export function MainTabs() {
  return (
    <Tab.Navigator tabBar={(p) => <FloatingTabBar {...p} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
     <Tab.Screen name="Health" component={HealthScreen} />
      <Tab.Screen name="Family" component={FamilyScreen} />
     <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
