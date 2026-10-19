import React from 'react';
import { View, ActivityIndicator, Platform, Alert } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts, DMSans_400Regular, DMSans_600SemiBold, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ContactsProvider } from './src/contacts';
import { colors } from './src/theme';

const navTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.bg } };
if (Platform.OS === 'web') {
  Alert.alert = (title: string, message?: string) => {
    window.alert([title, message].filter(Boolean).join('\n\n'));
  };
}

export default function App() {
  const [loaded] = useFonts({ DMSans_400Regular, DMSans_600SemiBold, DMSans_700Bold });

  if (!loaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator color={colors.sage80} />
      </View>
    );
  }

  const app = (
    <SafeAreaProvider>
      <NavigationContainer theme={navTheme}>
        <StatusBar style="dark" />
               <ContactsProvider>
          <RootNavigator />
        </ContactsProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );

  // On the web, show the app in a phone-width column centred on the page.
  if (Platform.OS === 'web') {
    return (
      <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#e3ebeb' }}>
        <View
          style={{
            flex: 1,
            width: '100%',
            maxWidth: 430,
            backgroundColor: colors.bg,
            overflow: 'hidden',
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderColor: '#cfd9d9',
          }}
        >
          {app}
        </View>
      </View>
    );
  }

  return app;
}
