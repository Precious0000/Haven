import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootScreenProps } from '../../navigation/types';
import { PageHeader } from '../../components/SettingsUI';
import { Button } from '../../components/Button';
import { SectionLabel } from '../../components/Card';
import { useSettings, Medication } from '../../settings';
import { useCare } from '../../careData';
import { displayTime, groupMeds } from '../../medHelpers';
import { colors, fonts, radius } from '../../theme';

export function MedicationScheduleScreen({ navigation }: RootScreenProps<'MedicationSchedule'>) {
  const { settings } = useSettings();
  const { doses, setDose, history } = useCare();
  const meds = settings.medications;
  const groups = groupMeds(meds);
  const taken = meds.filter((m) => doses[m.id] === 'taken').length;
  const skipped = meds.filter((m) => doses[m.id] === 'skipped').length;
  const pct = meds.length ? (taken / meds.length) * 100 : 0;

  const Dose = ({ m }: { m: Medication }) => {
    const status = doses[m.id];
    return (
      <View style={styles.dose}>
        <View style={styles.doseTop}>
          <Pressable style={{ flex: 1 }} onPress={() => navigation.navigate('MedicationDetail', { id: m.id })} accessibilityRole="button">
            <Text style={styles.medName}>{m.name}</Text>
            <Text style={styles.medMeta}>{[m.strength, displayTime(m.time), m.note].filter(Boolean).join(' · ')}</Text>
          </Pressable>
          {status ? (
            <View style={[styles.status, status === 'taken' ? styles.statusTaken : styles.statusSkipped]}>
              <Text style={[styles.statusText, { color: status === 'taken' ? '#1f9d55' : colors.dark6 }]}>{status === 'taken' ? 'Taken' : 'Skipped'}</Text>
            </View>
          ) : null}
        </View>
        {status ? (
          <Pressable onPress={() => setDose(m, null)} accessibilityRole="button" hitSlop={8} style={{ alignSelf: 'flex-start' }}>
            <Text style={styles.undo}>Undo</Text>
          </Pressable>
        ) : (
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Button title="Take" small style={{ flex: 1 }} onPress={() => setDose(m, 'taken')} />
            <Button title="Skip" variant="outline" small style={{ flex: 1 }} onPress={() => setDose(m, 'skipped')} />
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <PageHeader title="Medications" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Today's progress</Text>
          <Text style={styles.summaryValue}>
            {taken} <Text style={styles.summaryUnit}>{`of ${meds.length} taken${skipped > 0 ? ` · ${skipped} skipped` : ''}`}</Text>
          </Text>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${pct}%` }]} />
          </View>
        </View>

        {groups.length === 0 ? <Text style={styles.empty}>No medications added yet.</Text> : null}

        {groups.map((g) => (
          <View key={g.key} style={{ gap: 10 }}>
            <View style={styles.groupHead}>
              <View style={styles.pill}>
                <Ionicons name="medkit-outline" size={16} color={colors.navy70} />
              </View>
              <View>
                <Text style={styles.groupTitle}>{g.title}</Text>
                <Text style={styles.medMeta}>{g.due}</Text>
              </View>
            </View>
            {g.meds.map((m) => (
              <Dose key={m.id} m={m} />
            ))}
          </View>
        ))}

        <View>
          <SectionLabel>RECENT ACTIVITY</SectionLabel>
          {history.length === 0 ? <Text style={styles.empty}>Nothing logged yet today.</Text> : null}
          <View style={{ gap: 8 }}>
            {history.slice(0, 6).map((h) => (
              <View key={h.id} style={styles.logRow}>
                <Ionicons name={h.status === 'taken' ? 'checkmark-circle' : 'close-circle'} size={20} color={h.status === 'taken' ? colors.sage100 : colors.dark4} />
                <Text style={styles.logText}>{`${h.name} ${h.status}`}</Text>
                <Text style={styles.logTime}>{h.at}</Text>
              </View>
            ))}
          </View>
        </View>

        <Button title="Manage medications" variant="outline" onPress={() => navigation.navigate('Medications')} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20 },
  content: { paddingTop: 24, paddingBottom: 24, gap: 20 },
  summary: { padding: 16, gap: 8, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.chipBorder, borderRadius: 16 },
  summaryTitle: { fontFamily: fonts.regular, fontSize: 13, color: colors.dark6 },
  summaryValue: { fontFamily: fonts.semibold, fontSize: 32, color: colors.dark12 },
  summaryUnit: { fontFamily: fonts.regular, fontSize: 14, color: colors.dark6 },
  track: { height: 8, borderRadius: 100, backgroundColor: '#dcdcdc', overflow: 'hidden' },
  fill: { height: 8, borderRadius: 100, backgroundColor: colors.navy70 },
  empty: { fontFamily: fonts.regular, fontSize: 14, color: colors.dark6 },
  groupHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pill: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.sage20, alignItems: 'center', justifyContent: 'center' },
  groupTitle: { fontFamily: fonts.semibold, fontSize: 16, color: colors.dark12 },
  dose: { padding: 12, gap: 12, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.chipBorder, borderRadius: radius.card },
  doseTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  medName: { fontFamily: fonts.regular, fontSize: 16, color: colors.dark12 },
  medMeta: { fontFamily: fonts.regular, fontSize: 12, color: colors.dark6 },
  status: { borderRadius: 100, paddingHorizontal: 12, paddingVertical: 6 },
  statusTaken: { backgroundColor: '#e0f3e6' },
  statusSkipped: { backgroundColor: '#ececec' },
  statusText: { fontFamily: fonts.regular, fontSize: 12 },
  undo: { fontFamily: fonts.regular, fontSize: 13, color: '#3b82f6' },
  logRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logText: { flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.dark8 },
  logTime: { fontFamily: fonts.regular, fontSize: 12, color: colors.dark4 },
});
