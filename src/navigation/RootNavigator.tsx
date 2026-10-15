import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { MainTabs } from './MainTabs';
import { SplashScreen } from '../screens/auth/SplashScreen';
import { OnboardingScreen } from '../screens/auth/OnboardingScreen';
import { SignInScreen } from '../screens/auth/SignInScreen';
import { SignUpPersonalScreen } from '../screens/auth/SignUpPersonalScreen';
import { SignUpPersonalizationScreen } from '../screens/auth/SignUpPersonalizationScreen';
import { SignUpHealthScreen } from '../screens/auth/SignUpHealthScreen';
import { SignUpFamilyScreen } from '../screens/auth/SignUpFamilyScreen';
import { SignUpMedicationsScreen } from '../screens/auth/SignUpMedicationsScreen';
import { VoiceAssistantScreen } from '../screens/main/VoiceAssistantScreen';
import { ChatScreen } from '../screens/main/ChatScreen';
import { EmergencyScreen } from '../screens/main/EmergencyScreen';
import { DailyCheckInScreen } from '../screens/main/DailyCheckInScreen';
import { VoiceCheckInScreen } from '../screens/main/VoiceCheckInScreen';
import { BloodPressureScreen } from '../screens/main/BloodPressureScreen';
import { GlucoseScreen } from '../screens/main/GlucoseScreen';
import { ComingSoon } from '../components/ComingSoonScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ animation: 'fade' }} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUpPersonal" component={SignUpPersonalScreen} />
      <Stack.Screen name="SignUpPersonalization" component={SignUpPersonalizationScreen} />
      <Stack.Screen name="SignUpHealth" component={SignUpHealthScreen} />
      <Stack.Screen name="SignUpFamily" component={SignUpFamilyScreen} />
      <Stack.Screen name="SignUpMedications" component={SignUpMedicationsScreen} />
      <Stack.Screen name="Main" component={MainTabs} options={{ animation: 'fade', gestureEnabled: false }} />
      <Stack.Screen name="VoiceAssistant" component={VoiceAssistantScreen} options={{ animation: 'fade_from_bottom' }} />
      <Stack.Screen name="BloodPressure" component={BloodPressureScreen} />
      <Stack.Screen name="Glucose" component={GlucoseScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} options={{ animation: 'fade_from_bottom' }} />
      <Stack.Screen name="Emergency" component={EmergencyScreen} options={{ animation: 'fade', gestureEnabled: false }} />
            <Stack.Screen name="DailyCheckIn" component={DailyCheckInScreen} />
      <Stack.Screen name="VoiceCheckIn" component={VoiceCheckInScreen} options={{ animation: 'fade_from_bottom' }} />
      <Stack.Screen
        name="ComingSoon"
        options={{ headerShown: true, title: '' }}
        children={({ route }) => <ComingSoon title={route.params.title} />}
      />
    </Stack.Navigator>
  );
}
