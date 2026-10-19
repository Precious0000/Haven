import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Image, Switch, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { SettingsCard, SettingsRow } from '../../components/SettingsUI';
import { Button } from '../../components/Button';
import { useSettings } from '../../settings';
import { confirmAction } from '../../confirm';
import { avatar } from '../../assets/images';
import { colors, fonts, radius } from '../../theme';

type Props = CompositeScreenProps<BottomTabScreenProps<MainTabParamList, 'Settings'>, NativeStackScreenProps<RootStackParamList>>;

const THEMES = [
  { name: 'Ivory', color: '#f9fbf9' },
  { name: 'Dusk', color: '#071222' },
  { name: 'Slate', color: '#0f0f13' },
  { name: 'Warm', color: '#fff9f2' },
];

const PACES: { key: 'Gentle' | 'Standard'; title: string; body: string }[] = [
  { key: 'Gentle', title: 'Gentle Pace', body: 'Slower, peaceful words.' },
  { key: 'Standard', title: 'Standard Pace', body: 'Natural conversation.' },
];

const APP_VERSION = '1.0';

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return <Switch value={value} onValueChange={onChange} trackColor={{ true: colors.navy70, false: '#d9d9d9' }} thumbColor={colors.white} />;
}

export function SettingsScreen({ navigation }: Props) {
  const { settings, update } = useSettings();
  const [accessOpen, setAccessOpen] = useState(false);

  const signOut = () =>
    confirmAction('Sign out', 'Are you sure you want to sign out?', 'Sign out', () => {
      // TODO: clear the user's session here.
      navigation.getParent()?.reset({ index: 0, routes: [{ name: 'Onboarding' }] });
    });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.profile}>
          {avatar ? <Image source={avatar} style={styles.avatar} /> : <View style={[styles.avatar, { backgroundColor: colors.sage30 }]} />}
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{settings.name}</Text>
            <Text style={styles.email}>{settings.email}</Text>
          </View>
          <Pressable onPress={() => navigation.navigate('EditProfile')} accessibilityRole="button">
            <Text style={styles.edit}>EDIT PROFILE</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => setAccessOpen((o) => !o)}
          accessibilityRole="button"
          accessibilityState={{ expanded: accessOpen }}
          style={[styles.accessHeader, !accessOpen && styles.accessHeaderClosed]}
        >
          <Text style={[styles.accessTitle, accessOpen && { fontSize: 18 }]}>Accessibility</Text>
          <Ionicons name={accessOpen ? 'chevron-up' : 'chevron-down'} size={18} color={colors.navy70} />
        </Pressable>

        {accessOpen ? (
          <View style={{ gap: 16 }}>
            <View>
              <Text style={styles.label}>INTERACTION</Text>
              <SettingsCard>
                <SettingsRow
                  icon="volume-high-outline"
                  title="Voice Assistance"
                  subtitle="The app will speak back to confirm your actions."
                  right={<Toggle value={settings.voiceAssistance} onChange={(v) => update({ voiceAssistance: v })} />}
                />
                <SettingsRow
                  icon="hand-left-outline"
                  title="Touch Vibration"
                  subtitle="Feel a gentle buzz when you press a button."
                  right={<Toggle value={settings.touchVibration} onChange={(v) => update({ touchVibration: v })} />}
                />
                <SettingsRow
                  icon="volume-medium-outline"
                  title="Speak Aloud"
                  subtitle="Read instructions when tapped."
                  last
                  right={<Toggle value={settings.speakAloud} onChange={(v) => update({ speakAloud: v })} />}
                />
              </SettingsCard>
            </View>

            <View>
              <Text style={styles.label}>APPEARANCE</Text>
              <View style={styles.appearance}>
                <View style={styles.inline}>
                  <Ionicons name="contrast-outline" size={16} color={colors.navy90} />
                  <Text style={styles.rowTitle}>App Theme</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 9 }}>
                  {THEMES.map((t) => (
                    <Pressable key={t.name} style={{ flex: 1, gap: 4 }} onPress={() => update({ theme: t.name })} accessibilityRole="button">
                      <View style={[styles.swatch, { backgroundColor: t.color }, settings.theme === t.name && { borderWidth: 1, borderColor: colors.sage80 }]} />
                      <Text style={styles.small}>{t.name}</Text>
                    </Pressable>
                  ))}
                </View>
                <View style={styles.line} />
                <View style={styles.inline}>
                  <Ionicons name="text-outline" size={16} color={colors.navy90} />
                  <Text style={styles.rowTitle}>Font Size</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <Text style={{ fontFamily: fonts.regular, fontSize: 10 }}>Aa</Text>
                  <Text style={{ fontFamily: fonts.regular, fontSize: 16 }}>Aa</Text>
                </View>
                <Slider
                  value={settings.fontScale}
                  onValueChange={(v) => update({ fontScale: v })}
                  minimumTrackTintColor={colors.navy70}
                  maximumTrackTintColor="#f0f0f0"
                  thumbTintColor={colors.navy70}
                />
                <View style={styles.line} />
                <View style={styles.inline}>
                  <Ionicons name="volume-medium-outline" size={16} color={colors.navy90} />
                  <Text style={styles.rowTitle}>Speaking Pace</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  {PACES.map((p) => {
                    const on = settings.pace === p.key;
                    return (
                      <Pressable
                        key={p.key}
                        onPress={() => update({ pace: p.key })}
                        accessibilityRole="radio"
                        accessibilityState={{ selected: on }}
                        style={[styles.pace, on && { backgroundColor: colors.sage20 }]}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={styles.paceTitle}>{p.title}</Text>
                          <Text style={styles.paceBody}>{p.body}</Text>
                        </View>
                        <View style={[styles.radio, on && { borderColor: '#2f5fbf' }]}>{on ? <View style={styles.radioDot} /> : null}</View>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </View>

            <View>
              <Text style={styles.label}>WEARABLE DEVICES</Text>
              <SettingsCard>
                <SettingsRow
                  icon="watch-outline"
                  title="Smart Watch"
                  subtitle="Connect to your watch device"
                  last
                  // TODO: pair with HealthKit / Health Connect.
                  right={<Button title="Connect" variant="tonal" small style={{ width: 79 }} />}
                />
              </SettingsCard>
            </View>
          </View>
        ) : null}

        <Text style={styles.section}>App Settings</Text>
        <SettingsCard>
          <SettingsRow icon="medkit-outline" title="Medications" onPress={() => navigation.navigate('Medications')} />
          <SettingsRow
            icon="notifications-outline"
            title="Notifications"
            subtitle="Daily check-ins reminders"
            right={<Toggle value={settings.notifications} onChange={(v) => update({ notifications: v })} />}
          />
          <SettingsRow icon="language-outline" title="Language" subtitle={settings.language} onPress={() => navigation.navigate('Language')} />
          <SettingsRow icon="shield-checkmark-outline" title="Privacy and Security" subtitle="Password and data permissions" last onPress={() => navigation.navigate('Privacy')} />
        </SettingsCard>

        <Text style={styles.section}>Support</Text>
        <SettingsCard>
          <SettingsRow icon="help-buoy-outline" title="Help Center" subtitle="FAQs and contact" onPress={() => navigation.navigate('HelpCenter')} />
          <SettingsRow icon="information-circle-outline" title="About Haven" subtitle={`V ${APP_VERSION}`} last onPress={() => navigation.navigate('About')} />
        </SettingsCard>

        <SettingsCard>
          <SettingsRow icon="log-out-outline" title="Sign Out" danger last onPress={signOut} />
        </SettingsCard>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 150, gap: 14 },
  title: { fontFamily: fonts.semibold, fontSize: 20, color: colors.dark12, textAlign: 'center', letterSpacing: -0.5, marginBottom: 6 },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.chipBorder, borderRadius: 12 },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  name: { fontFamily: fonts.semibold, fontSize: 14, color: colors.dark12 },
  email: { fontFamily: fonts.regular, fontSize: 12, color: colors.dark6 },
  edit: { fontFamily: fonts.regular, fontSize: 12, color: '#3b82f6' },
  accessHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6, paddingHorizontal: 8 },
  accessHeaderClosed: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.chipBorder, borderRadius: radius.card, paddingVertical: 14, paddingHorizontal: 10 },
  accessTitle: { fontFamily: fonts.regular, fontSize: 16, color: colors.dark12 },
  label: { fontFamily: fonts.regular, fontSize: 12, color: colors.dark4, marginBottom: 8 },
  section: { fontFamily: fonts.regular, fontSize: 16, color: colors.dark12, marginTop: 6 },
  appearance: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.chipBorder, borderRadius: radius.card, padding: 12, gap: 10 },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowTitle: { fontFamily: fonts.regular, fontSize: 14, color: colors.dark12 },
  small: { fontFamily: fonts.regular, fontSize: 12, color: colors.dark6 },
  swatch: { height: 38, borderRadius: 4, borderWidth: 1, borderColor: '#ececec' },
  line: { height: 1, backgroundColor: colors.sage30 },
  pace: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: colors.chipBorder },
  paceTitle: { fontFamily: fonts.regular, fontSize: 12, color: colors.dark12 },
  paceBody: { fontFamily: fonts.regular, fontSize: 10, color: colors.dark6 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: '#9a9a9a', alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#2f5fbf' },
});
