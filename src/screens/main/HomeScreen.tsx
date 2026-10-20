import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { avatar } from '../../assets/images';
import { useSettings } from '../../settings';
import { useCare } from '../../careData';
import { formatTime, groupMeds } from '../../medHelpers';
import { colors, fonts, radius } from '../../theme';

type Props = CompositeScreenProps<BottomTabScreenProps<MainTabParamList, 'Home'>, NativeStackScreenProps<RootStackParamList>>;

// Sample data from the design. TODO: replace with real date / weather.
const DATE = 'Tue, Feb 21';
const PLACE = 'Oak Creek · 71°F & Sunny';

const ACTIONS: { label: string; icon: keyof typeof Ionicons.glyphMap; color: string; route: 'DailyCheckIn' | 'ActivityLog' | 'CallContacts' | 'ReportIssue' }[] = [
  { label: 'Daily check-in', icon: 'calendar-outline', color: colors.sage100, route: 'DailyCheckIn' },
  { label: 'Activity log', icon: 'walk-outline', color: '#3b5bdb', route: 'ActivityLog' },
  { label: 'Call contacts', icon: 'call-outline', color: '#1f9d55', route: 'CallContacts' },
  { label: 'Report issues', icon: 'alert-circle-outline', color: colors.error7, route: 'ReportIssue' },
];

export function HomeScreen({ navigation }: Props) {
  const { settings } = useSettings();
  const { doses, setDose, unreadCount } = useCare();
  const groups = groupMeds(settings.medications);
  const [open, setOpen] = useState<string | null>(groups.length > 0 ? groups[0].key : null);
  const [reminders, setReminders] = useState<Record<string, string>>({});
  const firstName = settings.name.split(' ')[0];

  const remind = (key: string) => {
    // TODO: schedule a real local notification (expo-notifications).
    const d = new Date(Date.now() + 15 * 60 * 1000);
    setReminders((r) => ({ ...r, [key]: formatTime(d.getHours() * 60 + d.getMinutes()) }));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          {avatar ? <Image source={avatar} style={styles.avatar} /> : <View style={[styles.avatar, { backgroundColor: colors.sage30 }]} />}
          <View style={{ flex: 1 }}>
            <Text style={styles.date}>{DATE}</Text>
            <Text style={styles.place}>{PLACE}</Text>
          </View>
          <Pressable style={styles.bell} accessibilityLabel="Notifications" onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={18} color={colors.navy70} />
            {unreadCount > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            ) : null}
          </Pressable>
        </View>

        <LinearGradient colors={['#0d2340', '#071222']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ai}>
          <Text style={styles.aiLabel}>AI COMPANION</Text>
          <Text style={styles.aiTitle}>{`Hello, ${firstName}. Today is a bright day. How are you feeling today?`}</Text>
          <Pressable style={styles.speak} onPress={() => navigation.navigate('VoiceAssistant')} accessibilityRole="button">
            <View style={styles.mic}>
              <Ionicons name="mic" size={20} color={colors.navy90} />
            </View>
            <Text style={styles.speakText}>Tap to speak</Text>
          </Pressable>
        </LinearGradient>

        <View style={styles.grid}>
          {ACTIONS.map((a) => (
            <Pressable key={a.label} style={styles.action} onPress={() => navigation.navigate(a.route)} accessibilityRole="button">
              <Ionicons name={a.icon} size={18} color={a.color} />
              <Text style={styles.actionText}>{a.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Today's medication</Text>
          <Pressable onPress={() => navigation.navigate('MedicationSchedule')} accessibilityRole="button" hitSlop={8}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        </View>

        {groups.length === 0 ? <Text style={styles.empty}>No medications added yet. Add them in Settings.</Text> : null}

        {groups.map((g) => {
          const expanded = open === g.key;
          const takenCount = g.meds.filter((m) => doses[m.id] === 'taken').length;
          const pending = g.meds.filter((m) => !doses[m.id]);
          return (
            <View key={g.key} style={styles.medCard}>
              <Pressable style={styles.medHeader} onPress={() => setOpen(expanded ? null : g.key)} accessibilityRole="button" accessibilityState={{ expanded }}>
                <View style={styles.pill}>
                  <Ionicons name="medkit-outline" size={16} color={colors.navy70} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.medTitle}>{g.title}</Text>
                  <Text style={styles.medMeta}>{`Today · ${g.due}${takenCount > 0 ? ` · ${takenCount}/${g.meds.length} taken` : ''}`}</Text>
                </View>
                <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.navy70} />
              </Pressable>

              {expanded ? (
                <View style={{ gap: 12 }}>
                  <View style={styles.divider} />
                  {g.meds.map((m) => {
                    const status = doses[m.id];
                    return (
                      <View key={m.id} style={styles.medItem}>
                        <Pressable style={{ flex: 1 }} onPress={() => navigation.navigate('MedicationDetail', { id: m.id })} accessibilityRole="button">
                          <Text style={styles.medName}>{m.name}</Text>
                          <Text style={styles.medMeta}>{[m.strength, m.note].filter(Boolean).join(' · ')}</Text>
                        </Pressable>
                        <Pressable
                          onPress={() => setDose(m, status === 'taken' ? null : 'taken')}
                          accessibilityRole="checkbox"
                          accessibilityState={{ checked: status === 'taken' }}
                          accessibilityLabel={`Mark ${m.name} as taken`}
                          hitSlop={8}
                        >
                          <Ionicons
                            name={status === 'taken' ? 'checkmark-circle' : status === 'skipped' ? 'close-circle' : 'ellipse-outline'}
                            size={24}
                            color={status === 'taken' ? colors.sage100 : status === 'skipped' ? colors.dark4 : colors.dark7}
                          />
                        </Pressable>
                      </View>
                    );
                  })}
                  {pending.length > 0 ? (
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                      <Button title="Take Pills" small style={{ flex: 1 }} onPress={() => pending.forEach((m) => setDose(m, 'taken'))} />
                      <Button title="Remind me in 15 mins" variant="outline" small style={{ flex: 1.2 }} onPress={() => remind(g.key)} />
                    </View>
                  ) : (
                    <View style={styles.allDone}>
                      <Ionicons name="checkmark-circle" size={18} color={colors.sage100} />
                      <Text style={styles.allDoneText}>All done for this time</Text>
                    </View>
                  )}
                  {reminders[g.key] && pending.length > 0 ? <Text style={styles.reminder}>{`Reminder set for ${reminders[g.key]}`}</Text> : null}
                </View>
              ) : null}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 140, gap: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  date: { fontFamily: fonts.regular, fontSize: 12, color: colors.dark6 },
  place: { fontFamily: fonts.semibold, fontSize: 14, color: colors.dark12, letterSpacing: -0.3 },
  bell: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.sage20, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: -3, right: -3, minWidth: 16, height: 16, borderRadius: 8, paddingHorizontal: 4, backgroundColor: colors.error7, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontFamily: fonts.semibold, fontSize: 10, color: colors.white },
  ai: { borderRadius: 20, padding: 16, gap: 12 },
  aiLabel: { fontFamily: fonts.regular, fontSize: 11, color: colors.sage30, letterSpacing: 0.3 },
  aiTitle: { fontFamily: fonts.semibold, fontSize: 24, lineHeight: 28, color: colors.white, letterSpacing: -0.6 },
  speak: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 },
  mic: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.sage70, alignItems: 'center', justifyContent: 'center' },
  speakText: { fontFamily: fonts.regular, fontSize: 16, color: colors.sage30 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20 },
  action: {
    width: '47%',
    flexGrow: 1,
    height: 74,
    padding: 14,
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.chipBorder,
    borderRadius: radius.card,
  },
  actionText: { fontFamily: fonts.regular, fontSize: 16, color: colors.dark12, letterSpacing: -0.3 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  sectionTitle: { fontFamily: fonts.regular, fontSize: 14, color: colors.dark12 },
  seeAll: { fontFamily: fonts.regular, fontSize: 13, color: colors.sage100 },
  empty: { fontFamily: fonts.regular, fontSize: 14, color: colors.dark6 },
  medCard: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.chipBorder, borderRadius: radius.card, padding: 12, gap: 12 },
  medHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pill: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.sage20, alignItems: 'center', justifyContent: 'center' },
  medTitle: { fontFamily: fonts.regular, fontSize: 16, color: colors.dark12 },
  medMeta: { fontFamily: fonts.regular, fontSize: 11, color: colors.dark6 },
  medName: { fontFamily: fonts.regular, fontSize: 14, color: colors.dark12 },
  medItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  divider: { height: 1, backgroundColor: colors.cardBorder },
  allDone: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center', paddingVertical: 6 },
  allDoneText: { fontFamily: fonts.regular, fontSize: 13, color: colors.sage100 },
  reminder: { fontFamily: fonts.regular, fontSize: 12, color: colors.sage100, textAlign: 'center' },
});
