import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootScreenProps } from '../../navigation/types';
import { PageHeader, SettingsCard, SettingsRow } from '../../components/SettingsUI';
import { confirmAction } from '../../confirm';
import { colors, fonts } from '../../theme';

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return <Switch value={value} onValueChange={onChange} trackColor={{ true: colors.navy70, false: '#d9d9d9' }} thumbColor={colors.white} />;
}

export function PrivacyScreen({ navigation }: RootScreenProps<'Privacy'>) {
  // TODO: save these choices with the user's account.
  const [shareLogs, setShareLogs] = useState(true);
  const [shareLocation, setShareLocation] = useState(true);
  const [biometric, setBiometric] = useState(false);

  const deleteAccount = () =>
    confirmAction('Delete account', 'This will permanently remove your account and data. This cannot be undone.', 'Delete', () => {
      // TODO: call your API to delete the account.
      navigation.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
    });

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <PageHeader title="Privacy and Security" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.label}>SHARING</Text>
          <SettingsCard>
            <SettingsRow icon="people-outline" title="Share daily logs" subtitle="Let family contacts see your check-ins." right={<Toggle value={shareLogs} onChange={setShareLogs} />} />
            <SettingsRow icon="location-outline" title="Share location in emergencies" subtitle="Send your location to contacts and responders." last right={<Toggle value={shareLocation} onChange={setShareLocation} />} />
          </SettingsCard>
        </View>

        <View>
          <Text style={styles.label}>SECURITY</Text>
          <SettingsCard>
            <SettingsRow icon="finger-print-outline" title="Biometric login" subtitle="Use fingerprint or face to sign in." right={<Toggle value={biometric} onChange={setBiometric} />} />
            <SettingsRow icon="key-outline" title="Change password" last onPress={() => navigation.navigate('ComingSoon', { title: 'Change password' })} />
          </SettingsCard>
        </View>

        <View>
          <Text style={styles.label}>YOUR DATA</Text>
          <SettingsCard>
            <SettingsRow icon="download-outline" title="Download my data" onPress={() => navigation.navigate('ComingSoon', { title: 'Download my data' })} />
            <SettingsRow icon="trash-outline" title="Delete account" danger last onPress={deleteAccount} />
          </SettingsCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20 },
  content: { paddingTop: 24, paddingBottom: 24, gap: 20 },
  label: { fontFamily: fonts.regular, fontSize: 12, color: colors.dark4, marginBottom: 8 },
});
