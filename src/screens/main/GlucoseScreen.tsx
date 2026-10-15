import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootScreenProps } from '../../navigation/types';
import { BackButton } from '../../components/BackButton';
import { LineChart, ReadingRow } from '../../components/health';
import { colors, fonts } from '../../theme';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
// Sample values read off the design. TODO: replace with real data.
const VALUES = [92, 106, 98, 118, 82, 102, 98];

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>
        <Text style={[styles.statNumber, color ? { color } : null]}>{value}</Text> mg/dL
      </Text>
    </View>
  );
}

export function GlucoseScreen({ navigation }: RootScreenProps<'Glucose'>) {
  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 0 }} />
          <Text style={styles.title}>Glucose Level</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inline}>
            <View style={styles.icon}>
              <Ionicons name="speedometer-outline" size={14} color={colors.dark7} />
            </View>
            <Text style={styles.muted}>CURRENT GLUCOSE</Text>
          </View>
          <Text style={styles.big}>
            95 <Text style={styles.bigUnit}>mg/dL</Text>
          </Text>
          <View style={styles.status}>
            <View style={styles.dot} />
            <Text style={styles.statusText}>Normal range (Stable)</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitleSmall}>7-Day Trend</Text>
            <Text style={styles.muted}>Avg. 98 mg/dL</Text>
          </View>
          <LineChart values={VALUES} labels={DAYS} min={75} max={125} height={140} />
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Stat label="Average" value="98" />
          <Stat label="Highest" value="118" color="#b3141c" />
          <Stat label="Lowest" value="82" color="#f08a3c" />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Readings</Text>
          <ReadingRow value="95" unit="mg/dL" when="Today, 8:30 AM" status="Normal" />
          <ReadingRow value="112" unit="mg/dL" when="Yesterday, 9:15 PM" status="High" />
          {/* Date is partly hidden in the design; confirm. */}
          <ReadingRow value="82" unit="mg/dL" when="Oct 24, 6:10 PM" status="Low" last />
        </View>
      </ScrollView>

      {/* TODO: open a form to record a reading (no design yet). */}
      <Pressable style={styles.record} onPress={() => navigation.navigate('ComingSoon', { title: 'Record new reading' })} accessibilityRole="button">
        <Text style={styles.recordText}>Record new reading</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100, gap: 16 },
  header: { height: 44, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.regular, fontSize: 18, color: colors.dark8 },
  card: { backgroundColor: colors.white, borderRadius: 16, borderWidth: 1, borderColor: '#ececec', padding: 16, gap: 12 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  inline: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  icon: { width: 26, height: 26, borderRadius: 6, backgroundColor: '#ececec', alignItems: 'center', justifyContent: 'center' },
  muted: { fontFamily: fonts.regular, fontSize: 13, color: colors.dark6 },
  big: { fontFamily: fonts.semibold, fontSize: 36, color: colors.dark8, letterSpacing: -1 },
  bigUnit: { fontFamily: fonts.regular, fontSize: 16, color: colors.dark6 },
  status: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#f1f1f1', borderRadius: 6, paddingVertical: 8, paddingHorizontal: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#1f9d55' },
  statusText: { fontFamily: fonts.regular, fontSize: 13, color: colors.dark8 },
  cardTitleSmall: { fontFamily: fonts.semibold, fontSize: 14, color: colors.dark8 },
  cardTitle: { fontFamily: fonts.semibold, fontSize: 18, color: colors.dark8, letterSpacing: -0.4 },
  stat: { flex: 1, backgroundColor: colors.white, borderRadius: 12, borderWidth: 1, borderColor: '#ececec', padding: 12, gap: 4 },
  statLabel: { fontFamily: fonts.regular, fontSize: 12, color: colors.dark6 },
  statValue: { fontFamily: fonts.regular, fontSize: 11, color: colors.dark6 },
  statNumber: { fontFamily: fonts.semibold, fontSize: 18, color: colors.dark8 },
  record: { position: 'absolute', left: 30, right: 30, bottom: 36, height: 46, borderRadius: 5, backgroundColor: colors.navy70, alignItems: 'center', justifyContent: 'center' },
  recordText: { fontFamily: fonts.regular, fontSize: 14, color: colors.white },
});
