import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  SignIn: undefined;
  SignUpPersonal: undefined;
  SignUpPersonalization: undefined;
  SignUpHealth: undefined;
  SignUpFamily: undefined;
  SignUpMedications: undefined;
  Main: undefined;
  VoiceAssistant: undefined;
  ComingSoon: { title: string };
};

export type MainTabParamList = {
  Home: undefined;
  Health: undefined;
  Family: undefined;
  Settings: undefined;
};

export type RootScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;
