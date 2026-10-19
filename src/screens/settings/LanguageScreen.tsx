import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootScreenProps } from '../../navigation/types';
import { PageHeader, SettingsCard, SettingsRow } from '../../components/SettingsUI';
import { useSettings } from '../../settings';
import { colors, fonts } from '../../theme';

const LANGUAGES = ['English', 'Yoruba', 'Igbo', 'Hausa', 'French'];

export function LanguageScreen({ navigation }: RootScreenProps<'Language'>) {
  const { settings, update } = useSettings();

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <PageHeader title="Language" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.note}>Choose the language for the app and the voice assistant.</Text>
        <SettingsCard>
          {LANGUAGES.map((l, i) => (
            <SettingsRow
              key={l}
              title={l}
              last={i === LANGUAGES.length - 1}
              // TODO: translate the app's text; for now this only saves the choice.
              onPress={() => {
                update({ language: l });
                navigation.goBack();
              }}
              right={settings.language === l ? <Ionicons name="checkmark-circle" size={22} color={colors.sage100} /> : <View style={{ width: 22 }} />}
            />
          ))}
        </SettingsCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20 },
  content: { paddingTop: 24, gap: 16 },
  note: { fontFamily: fonts.regular, fontSize: 14, color: colors.dark6 },
});
