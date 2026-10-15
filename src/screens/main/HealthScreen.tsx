import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { colors, fonts, radius } from '../../theme';

type Props = CompositeScreenProps<BottomTabScreenProps<MainTabParamList, 'Health'>, NativeStackScreenProps<RootStackParamList>>;

const GREEN = '#1f9d55';
const GOAL = 8;

function Metric({
  bar,
  value,
  label,
  icon,
  iconBg,
  iconColor,
  footer,
  onPress,
}: {
  bar: string;
  value: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  footer: React.ReactNode;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.metric} onPress={onPress} accessibilityRole="button">
      <View style={[styles.bar, { backgroundColor: bar }]} />
      <View style={{ flex: 1, gap: 8 }}>
        <View style={styles.metricTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.metricValue}>{value}</Text>
            <Text style={styles.metricLabel}>{label}</Text>
          </View>
          <View style={[styles.metricIcon, { backgroundColor: iconBg }]}>
            <Ionicons name={icon} size={16} color={iconColor} />
          </View>
        </View>
        <View style={styles.pill}>{footer}</View>
      </View>
    </Pressable>
  );
}

function RoutineCard({ icon, title, sub, chevron }: { icon: keyof typeof Ionicons.glyphMap; title: string; sub: string; chevron?: boolean }) {
  return (
    <View style={styles.routine}>
      <View style={styles.routineIcon}>
        <Ionicons name={icon} size={16} color={colors.navy70} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.routineTitle}>{title}</Text>
        <Text style={styles.routineSub}>{sub}</Text>
      </View>
      {chevron ? <Ionicons name="chevron-down" size={18} color={colors.navy70} /> : null}
    </View>
  );
}

export function HealthScreen({ navigation }: Props) {
  const [glasses, setGlasses] = useState(3); // sample value from the design

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Health</Text>

        <View style={styles.grid}>
          <Metric
            bar="#0f5257"
            value="120/80"
            label="Blood Pressure"
            icon="water"
            iconBg="#e3f4f4"
            iconColor="#0f5257"
            footer={<Text style={[styles.pillText, { color: GREEN }]}>+  Record new reading</Text>}
            onPress={() => navigation.navigate('BloodPressure')}
          />
          <Metric
            bar="#f08a1c"
            value="72"
            label="Heart Rate"
            icon="pulse"
            iconBg="#fff1de"
            iconColor="#f08a1c"
            footer={
              <View style={styles.inline}>
                <Ionicons name="bluetooth" size={12} color={GREEN} />
                <Text style={[styles.pillText, { color: GREEN }]}>Sync watch</Text>
              </View>
            }
            onPress={() => navigation.navigate('ComingSoon', { title: 'Heart Rate' })}
          />
          <Metric
            bar="#2b2b2b"
            value="95"
            label="Glucose Level"
            icon="speedometer-outline"
            iconBg="#ececec"
            iconColor="#2b2b2b"
            footer={
              <Text style={styles.pillText}>
                <Text style={{ color: GREEN }}>mg/dL</Text>
                <Text style={{ color: colors.dark6 }}> · Normal range</Text>
              </Text>
            }
            onPress={() => navigation.navigate('Glucose')}
          />
          <Metric
            bar="#2f4a9c"
            value="84%"
            label="Hydration Level"
            icon="water"
            iconBg="#e6ecfa"
            iconColor="#2f4a9c"
            footer={<Text style={[styles.pillText, { color: GREEN }]}>Good standing</Text>}
            onPress={() => navigation.navigate('ComingSoon', { title: 'Hydration' })}
          />
        </View>

        <Text style={styles.section}>Today's Routine</Text>
        <View style={{ gap: 12 }}>
          <RoutineCard icon="walk-outline" title="Morning walk" sub="Assisted with companion cane · Due 9:30 am" />
          {/* TODO: expand to show the medication list (same data as Home). */}
          <RoutineCard icon="medkit-outline" title="Morning medication" sub="Today · Due 9:30 am" chevron />

          <View style={styles.hydration}>
            <View style={styles.hydrationRow}>
              <View style={styles.routineIcon}>
                <Ionicons name="water" size={16} color={colors.navy70} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.routineTitle}>Hydration</Text>
                <Text style={styles.routineSub}>{`${glasses} of ${GOAL} glasses`}</Text>
              </View>
              <Pressable style={styles.add} onPress={() => setGlasses((g) => Math.min(GOAL, g + 1))} accessibilityRole="button">
                <Text style={styles.addText}>Add</Text>
              </Pressable>
            </View>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${(glasses / GOAL) * 100}%` }]} />
            </View>
          </View>

          <RoutineCard icon="medkit-outline" title="Afternoon medication" sub="Today · Due 07:30 pm" chevron />
        </View>

        <LinearGradient colors={['#0d2340', '#071222']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.notice}>
          <View style={styles.inline}>
            <Ionicons name="information-circle-outline" size={20} color={colors.white} />
            <Text style={styles.noticeTitle}>Contacts Updated</Text>
          </View>
          <Text style={styles.noticeBody}>Your daily logs have been shared with Laura. She can see you're doing great today!</Text>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 150, gap: 16 },
  title: { fontFamily: fonts.semibold, fontSize: 20, color: colors.dark12, textAlign: 'center', letterSpacing: -0.5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  metric: {
    flexBasis: '46%',
    flexGrow: 1,
    flexDirection: 'row',
    gap: 8,
    padding: 10,
    backgroundColor: colors.white,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  bar: { width: 3, borderRadius: 2 },
  metricTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  metricValue: { fontFamily: fonts.regular, fontSize: 24, color: colors.dark12, letterSpacing: -0.5 },
  metricLabel: { fontFamily: fonts.regular, fontSize: 13, color: colors.dark6 },
  metricIcon: { width: 28, height: 28, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  pill: { backgroundColor: '#f1f1f1', borderRadius: 4, paddingVertical: 6, paddingHorizontal: 8 },
  pillText: { fontFamily: fonts.regular, fontSize: 12 },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  section: { fontFamily: fonts.regular, fontSize: 14, color: colors.dark12, marginTop: 4 },
  routine: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.chipBorder, borderRadius: radius.card },
  routineIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.sage20, alignItems: 'center', justifyContent: 'center' },
  routineTitle: { fontFamily: fonts.regular, fontSize: 16, color: colors.dark12 },
  routineSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.dark6 },
  hydration: { padding: 12, gap: 10, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.chipBorder, borderRadius: radius.card },
  hydrationRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  add: { backgroundColor: colors.sage50, borderRadius: radius.button, paddingVertical: 12, paddingHorizontal: 24 },
  addText: { fontFamily: fonts.regular, fontSize: 12, color: colors.navy90 },
  track: { height: 8, borderRadius: 100, backgroundColor: '#dcdcdc', overflow: 'hidden' },
  fill: { height: 8, borderRadius: 100, backgroundColor: colors.navy70 },
  notice: { borderRadius: 16, padding: 16, gap: 6 },
  noticeTitle: { fontFamily: fonts.semibold, fontSize: 18, color: colors.white },
  noticeBody: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 17, color: colors.sage30 },
});
