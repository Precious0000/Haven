import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootScreenProps } from '../../navigation/types';
import { BackButton } from '../../components/BackButton';
import { Badge, LineChart, ReadingRow } from '../../components/health';
import { colors, fonts } from '../../theme';

const RANGES = ['Day', 'Week', 'Month', 'Year'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
// Sample systolic values read off the design. TODO: replace with real data (and per-range data).
const SYSTOLIC = [132, 127, 129, 121, 128, 135, 130];

export function BloodPressureScreen({ navigation }: RootScreenProps<'BloodPressure'>) {
  const [range, setRange] = useState('Week');

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 0 }} />
          <Text style={styles.title}>Blood Pressure</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View style={styles.inline}>
              <View style={styles.drop}>
                <Ionicons name="water" size={14} color="#0f5257" />
              </View>
              <Text style={styles.muted}>Last Reading</Text>
            </View>
            <Badge status="Normal" />
          </View>
          <Text style={styles.big}>
            120/80 <Text style={styles.bigUnit}>mmHg</Text>
          </Text>
          <View style={styles.inline}>
            <Ionicons name="time-outline" size={14} color={colors.dark7} />
            <Text style={styles.small}>Measured today at 8:30 AM</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.segment}>
            {RANGES.map((r) => (
              <Pressable key={r} style={[styles.segItem, range === r && styles.segActive]} onPress={() => setRange(r)} accessibilityRole="button">
                <Text style={styles.segText}>{r}</Text>
              </Pressable>
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <View style={{ flex: 1, backgroundColor: '#f1f7f9', borderRadius: 2, paddingVertical: 4 }}>
              <LineChart values={SYSTOLIC} labels={DAYS} min={105} max={145} height={110} color={colors.navy70} hollow />
            </View>
            <View style={{ height: 110, justifyContent: 'space-between' }}>
              <Text style={styles.axisRight}>140 SYS</Text>
              <Text style={styles.axisRight}>120 SYS</Text>
              <Text style={styles.axisRight}>80 DIA</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Readings</Text>
          <ReadingRow value="120/80" unit="mmHg" when="Today, 8:30 AM" status="Normal" />
          <ReadingRow value="118/79" unit="mmHg" when="Yesterday, 9:15 PM" status="Normal" />
          <ReadingRow value="125/82" unit="mmHg" when="Oct 24, 2:10 PM" status="Slightly Elevated" last />
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
  drop: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#e3f4f4', alignItems: 'center', justifyContent: 'center' },
  muted: { fontFamily: fonts.regular, fontSize: 14, color: colors.dark6 },
  big: { fontFamily: fonts.semibold, fontSize: 36, color: colors.dark8, letterSpacing: -1 },
  bigUnit: { fontFamily: fonts.regular, fontSize: 16, color: colors.dark6 },
  small: { fontFamily: fonts.regular, fontSize: 12, color: colors.dark7 },
  segment: { flexDirection: 'row', backgroundColor: '#ececec', borderRadius: 100, padding: 3 },
  segItem: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 100 },
  segActive: { backgroundColor: colors.white },
  segText: { fontFamily: fonts.regular, fontSize: 13, color: colors.dark8 },
  axisRight: { fontFamily: fonts.regular, fontSize: 10, color: colors.dark6 },
  cardTitle: { fontFamily: fonts.semibold, fontSize: 18, color: colors.dark8, letterSpacing: -0.4 },
  record: { position: 'absolute', left: 30, right: 30, bottom: 36, height: 46, borderRadius: 5, backgroundColor: colors.navy70, alignItems: 'center', justifyContent: 'center' },
  recordText: { fontFamily: fonts.regular, fontSize: 14, color: colors.white },
});
