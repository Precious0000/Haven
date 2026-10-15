import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { RootScreenProps } from '../../navigation/types';
import { BackButton } from '../../components/BackButton';
import { SectionLabel } from '../../components/Card';
import { colors, fonts, radius } from '../../theme';

const MOODS = [
  { label: 'Great', emoji: '👍' },
  { label: 'Good', emoji: '😃' },
  { label: 'Okay', emoji: '😐' },
  { label: 'Not bad', emoji: '☹️' },
];

const GOAL = 8;

const CHECKS: { key: string; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'pills', label: 'I have taken my morning pills', icon: 'medkit-outline' },
  { key: 'pain', label: 'I am not in any pain', icon: 'heart-outline' },
  { key: 'call', label: 'I need a call from AI Companion', icon: 'call-outline' },
];

export function DailyCheckInScreen({ navigation }: RootScreenProps<'DailyCheckIn'>) {
  const [mood, setMood] = useState<string | null>(null);
  const [glasses, setGlasses] = useState(3); // sample value from the design
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const complete = () => {
    // TODO: save the check-in (mood, glasses, checks) to your backend.
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 0 }} />
          <Text style={styles.title}>Daily Check-in</Text>
        </View>

        <View style={{ gap: 4 }}>
          <Text style={styles.greeting}>Good morning Linda.</Text>
          <Text style={styles.intro}>Taking a moment for yourself helps us keep you safe and healthy. How are you feeling today?</Text>
        </View>

        <View style={styles.moods}>
          {MOODS.map((m) => (
            <Pressable
              key={m.label}
              onPress={() => setMood(m.label)}
              accessibilityRole="button"
              accessibilityState={{ selected: mood === m.label }}
              style={[styles.mood, mood === m.label && styles.moodSelected]}
            >
              <Text style={styles.emoji}>{m.emoji}</Text>
              <Text style={styles.moodLabel}>{m.label}</Text>
            </Pressable>
          ))}
        </View>

        <View>
          <SectionLabel>STAY HYDRATED</SectionLabel>
          <View style={styles.card}>
            <View style={styles.hydrationRow}>
              <Ionicons name="water" size={22} color={colors.navy70} />
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>Hydration</Text>
                <Text style={styles.rowSub}>{`${glasses} of ${GOAL} glasses`}</Text>
              </View>
              <Pressable style={styles.add} onPress={() => setGlasses((g) => Math.min(GOAL, g + 1))} accessibilityRole="button">
                <Text style={styles.addText}>Add</Text>
              </Pressable>
            </View>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${(glasses / GOAL) * 100}%` }]} />
            </View>
          </View>
        </View>

        <View>
          <SectionLabel>HOW ARE YOU DOING TODAY?</SectionLabel>
          <View style={[styles.card, { paddingVertical: 4 }]}>
            {CHECKS.map((c, i) => {
              const on = !!checked[c.key];
              return (
                <Pressable
                  key={c.key}
                  style={[styles.checkRow, i < CHECKS.length - 1 && styles.checkDivider]}
                  onPress={() => setChecked((s) => ({ ...s, [c.key]: !s[c.key] }))}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: on }}
                >
                  <Ionicons name={c.icon} size={22} color={colors.navy70} />
                  <Text style={styles.checkLabel}>{c.label}</Text>
                  <View style={[styles.box, on && styles.boxOn]}>{on ? <Ionicons name="checkmark" size={16} color={colors.white} /> : null}</View>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Pressable onPress={() => navigation.navigate('VoiceCheckIn')} accessibilityRole="button">
          <LinearGradient colors={['#0d2340', '#071222']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.voiceCard}>
            <View style={styles.mic}>
              <Ionicons name="mic" size={18} color={colors.navy90} />
            </View>
            <View>
              <Text style={styles.preferText}>Prefer to talk?</Text>
              <Text style={styles.voiceTitle}>Start Voice check-in</Text>
            </View>
          </LinearGradient>
        </Pressable>

        <Pressable
          disabled={!mood}
          onPress={complete}
          accessibilityRole="button"
          style={[styles.complete, { backgroundColor: mood ? colors.navy70 : '#8b8b8b' }]}
        >
          <Text style={[styles.completeText, { color: mood ? colors.white : '#bdbdbd' }]}>Complete Check-in</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, gap: 20 },
  header: { height: 44, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.regular, fontSize: 18, color: colors.dark12, letterSpacing: -0.4 },
  greeting: { fontFamily: fonts.semibold, fontSize: 20, color: colors.dark12, letterSpacing: -0.6 },
  intro: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 18, color: colors.dark6, letterSpacing: -0.4 },
  moods: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  mood: {
    flexBasis: '47%',
    flexGrow: 1,
    height: 85,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.chipBorder,
    borderRadius: radius.card,
  },
  moodSelected: { borderWidth: 2, borderColor: colors.sage80 },
  emoji: { fontSize: 24 },
  moodLabel: { fontFamily: fonts.regular, fontSize: 16, color: colors.dark8 },
  card: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.cardBorder, borderRadius: radius.card, paddingHorizontal: 12, paddingVertical: 12, gap: 10 },
  hydrationRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowTitle: { fontFamily: fonts.regular, fontSize: 14, color: colors.navy90 },
  rowSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.dark6 },
  add: { backgroundColor: colors.sage50, borderRadius: radius.button, paddingVertical: 12, paddingHorizontal: 24 },
  addText: { fontFamily: fonts.regular, fontSize: 12, color: colors.navy90 },
  track: { height: 8, borderRadius: 100, backgroundColor: '#dcdcdc', overflow: 'hidden' },
  fill: { height: 8, borderRadius: 100, backgroundColor: colors.navy70 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  checkDivider: { borderBottomWidth: 1, borderBottomColor: colors.sage30 },
  checkLabel: { flex: 1, fontFamily: fonts.regular, fontSize: 16, color: colors.navy90 },
  box: { width: 24, height: 24, borderRadius: 4, borderWidth: 1, borderColor: '#b9b9b9', alignItems: 'center', justifyContent: 'center' },
  boxOn: { backgroundColor: colors.navy70, borderColor: colors.navy70 },
  voiceCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 20 },
  mic: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.sage70, alignItems: 'center', justifyContent: 'center' },
  preferText: { fontFamily: fonts.regular, fontSize: 12, color: colors.sage30 },
  voiceTitle: { fontFamily: fonts.semibold, fontSize: 24, color: colors.white, letterSpacing: -0.6 },
  complete: { height: 46, borderRadius: radius.button, alignItems: 'center', justifyContent: 'center' },
  completeText: { fontFamily: fonts.regular, fontSize: 14, letterSpacing: -0.4 },
});
