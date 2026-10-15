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
import { colors, fonts, radius } from '../../theme';

type Props = CompositeScreenProps<BottomTabScreenProps<MainTabParamList, 'Home'>, NativeStackScreenProps<RootStackParamList>>;

// Sample data from the design. TODO: replace with real user / weather / medication data.
const USER = { name: 'Linda', date: 'Tue, Feb 21', place: 'Oak Creek · 71°F & Sunny' };
const GROUPS = [
  {
    title: 'Morning medication',
    meta: 'Today · Due 9:30 am',
    items: [
      { name: 'Metformin', detail: '500 mg · With morning breakfast' },
      { name: 'Lisinopril', detail: '10 mg · With 1 full glass of water' },
    ],
  },
  // The second group is collapsed (and partly hidden by the tab bar) in the design.
  { title: 'Next medication', meta: 'Today', items: [] as { name: string; detail: string }[] },
];

const ACTIONS: { label: string; icon: keyof typeof Ionicons.glyphMap; color: string }[] = [
  { label: 'Daily check-in', icon: 'calendar-outline', color: colors.sage100 },
  { label: 'Activity log', icon: 'walk-outline', color: '#3b5bdb' },
  { label: 'Call contacts', icon: 'call-outline', color: '#1f9d55' },
  { label: 'Report issues', icon: 'alert-circle-outline', color: colors.error7 },
];

export function HomeScreen({ navigation }: Props) {
  const [open, setOpen] = useState(0);
  const [taken, setTaken] = useState<Record<string, boolean>>({});

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          {avatar ? <Image source={avatar} style={styles.avatar} /> : <View style={[styles.avatar, { backgroundColor: colors.sage30 }]} />}
          <View style={{ flex: 1 }}>
            <Text style={styles.date}>{USER.date}</Text>
            <Text style={styles.place}>{USER.place}</Text>
          </View>
          <Pressable style={styles.bell} accessibilityLabel="Notifications" onPress={() => navigation.navigate('ComingSoon', { title: 'Notifications' })}>
            <Ionicons name="notifications-outline" size={18} color={colors.navy70} />
          </Pressable>
        </View>

        <LinearGradient colors={['#0d2340', '#071222']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.ai}>
          <Text style={styles.aiLabel}>AI COMPANION</Text>
          <Text style={styles.aiTitle}>{`Hello, ${USER.name}. Today is a bright day. How are you feeling today?`}</Text>
          <Pressable style={styles.speak} onPress={() => navigation.navigate('VoiceAssistant')} accessibilityRole="button">
            <View style={styles.mic}>
              <Ionicons name="mic" size={20} color={colors.navy90} />
            </View>
            <Text style={styles.speakText}>Tap to speak</Text>
          </Pressable>
        </LinearGradient>

        <View style={styles.grid}>
          {ACTIONS.map((a) => (
                      <Pressable
              key={a.label}
              style={styles.action}
              // TODO: in the real app the emergency screen opens from fall detection, not from this button.
              onPress={() => (a.label === 'Report issues' ? navigation.navigate('Emergency') : navigation.navigate('ComingSoon', { title: a.label }))}
            >
              <Ionicons name={a.icon} size={18} color={a.color} />
              <Text style={styles.actionText}>{a.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Today's medication</Text>
        {GROUPS.map((g, gi) => {
          const expanded = open === gi;
          return (
            <View key={g.title} style={styles.medCard}>
              <Pressable style={styles.medHeader} onPress={() => setOpen(expanded ? -1 : gi)} accessibilityRole="button">
                <View style={styles.pill}>
                  <Ionicons name="medkit-outline" size={16} color={colors.navy70} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.medTitle}>{g.title}</Text>
                  <Text style={styles.medMeta}>{g.meta}</Text>
                </View>
                <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.navy70} />
              </Pressable>
              {expanded && g.items.length > 0 ? (
                <View style={{ gap: 12 }}>
                  <View style={styles.divider} />
                  {g.items.map((m) => {
                    const done = !!taken[m.name];
                    return (
                      <Pressable key={m.name} style={styles.medItem} onPress={() => setTaken((t) => ({ ...t, [m.name]: !t[m.name] }))}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.medName}>{m.name}</Text>
                          <Text style={styles.medMeta}>{m.detail}</Text>
                        </View>
                        <Ionicons name={done ? 'checkmark-circle' : 'ellipse-outline'} size={22} color={done ? colors.sage100 : colors.dark7} />
                      </Pressable>
                    );
                  })}
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <Button
                      title="Take Pills"
                      small
                      style={{ flex: 1 }}
                      onPress={() => setTaken(Object.fromEntries(g.items.map((m) => [m.name, true])))}
                    />
                    {/* TODO: schedule a local notification (expo-notifications). */}
                    <Button title="Remind me in 15 mins" variant="outline" small style={{ flex: 1.2 }} />
                  </View>
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
  sectionTitle: { fontFamily: fonts.regular, fontSize: 14, color: colors.dark12, marginTop: 4 },
  medCard: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.chipBorder, borderRadius: radius.card, padding: 12, gap: 12 },
  medHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pill: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.sage20, alignItems: 'center', justifyContent: 'center' },
  medTitle: { fontFamily: fonts.regular, fontSize: 16, color: colors.dark12 },
  medMeta: { fontFamily: fonts.regular, fontSize: 11, color: colors.dark6 },
  medName: { fontFamily: fonts.regular, fontSize: 14, color: colors.dark12 },
  medItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  divider: { height: 1, backgroundColor: colors.cardBorder },
});
