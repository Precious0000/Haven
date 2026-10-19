import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootScreenProps } from '../../navigation/types';
import { PageHeader, SettingsCard, SettingsRow } from '../../components/SettingsUI';
import { Logo } from '../../components/Logo';
import { colors, fonts } from '../../theme';

const APP_VERSION = '1.0';

export function AboutScreen({ navigation }: RootScreenProps<'About'>) {
  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <PageHeader title="About Haven" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={{ alignItems: 'center', gap: 8 }}>
          <Logo size={36} />
          <Text style={styles.version}>{`Version ${APP_VERSION}`}</Text>
        </View>
        <Text style={styles.body}>
          Haven is an AI care companion designed to help older adults live more safely and independently, while keeping trusted family members and caregivers connected.
        </Text>
        <SettingsCard>
          <SettingsRow title="Terms of Service" onPress={() => navigation.navigate('ComingSoon', { title: 'Terms of Service' })} />
          <SettingsRow title="Privacy Policy" last onPress={() => navigation.navigate('ComingSoon', { title: 'Privacy Policy' })} />
        </SettingsCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20 },
  content: { paddingTop: 32, paddingBottom: 24, gap: 24 },
  version: { fontFamily: fonts.regular, fontSize: 14, color: colors.dark6 },
  body: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.dark8, textAlign: 'center' },
});
