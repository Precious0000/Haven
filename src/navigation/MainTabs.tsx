import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { FloatingTabBar } from './FloatingTabBar';
import { HomeScreen } from '../screens/main/HomeScreen';
import { ComingSoon } from '../components/ComingSoonScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

// TODO: replace the placeholders with the Health / Family / Settings screens from Figma.
const Health = () => <ComingSoon title="Health" />;
const Family = () => <ComingSoon title="Family" />;
const Settings = () => <ComingSoon title="Settings" />;

export function MainTabs() {
  return (
    <Tab.Navigator tabBar={(p) => <FloatingTabBar {...p} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Health" component={Health} />
      <Tab.Screen name="Family" component={Family} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}
