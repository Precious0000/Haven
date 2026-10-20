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
import { AddContactScreen } from '../screens/main/AddContactScreen';
import { EditProfileScreen } from '../screens/settings/EditProfileScreen';
import { MedicationsScreen } from '../screens/settings/MedicationsScreen';
import { LanguageScreen } from '../screens/settings/LanguageScreen';
import { PrivacyScreen } from '../screens/settings/PrivacyScreen';
import { HelpCenterScreen } from '../screens/settings/HelpCenterScreen';
import { AboutScreen } from '../screens/settings/AboutScreen';
import { NotificationsScreen } from '../screens/main/NotificationsScreen';
    import { ActivityLogScreen } from '../screens/main/ActivityLogScreen';
    import { CallContactsScreen } from '../screens/main/CallContactsScreen';
    import { ReportIssueScreen } from '../screens/main/ReportIssueScreen';
    import { MedicationScheduleScreen } from '../screens/main/MedicationScheduleScreen';
    import { MedicationDetailScreen } from '../screens/main/MedicationDetailScreen';

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
            <Stack.Screen name="AddContact" component={AddContactScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Medications" component={MedicationsScreen} />
      <Stack.Screen name="Language" component={LanguageScreen} />
      <Stack.Screen name="Privacy" component={PrivacyScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="ActivityLog" component={ActivityLogScreen} />
    <Stack.Screen name="CallContacts" component={CallContactsScreen} />
    <Stack.Screen name="ReportIssue" component={ReportIssueScreen} />
    <Stack.Screen name="MedicationSchedule" component={MedicationScheduleScreen} />
    <Stack.Screen name="MedicationDetail" component={MedicationDetailScreen} />
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
