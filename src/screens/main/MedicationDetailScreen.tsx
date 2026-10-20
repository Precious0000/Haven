import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootScreenProps } from '../../navigation/types';
import { PageHeader } from '../../components/SettingsUI';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { SectionLabel } from '../../components/Card';
import { useSettings } from '../../settings';
import { useCare } from '../../careData';
import { confirmAction } from '../../confirm';
import { displayTime } from '../../medHelpers';
import { colors, fonts, radius } from '../../theme';

const FREQUENCIES = ['Once daily', 'Twice daily', 'Three times daily', 'Weekly', 'As needed'];
const LOW_SUPPLY = 7;

export function MedicationDetailScreen({ navigation, route }: RootScreenProps<'MedicationDetail'>) {
  const { settings, updateMedication, removeMedication } = useSettings();
  const { doses, setDose, history } = useCare();
  const med = settings.medications.find((m) => m.id === route.params.id);

  const [editing, setEditing] = useState(false);
  const [strength, setStrength] = useState(med?.strength ?? '');
  const [frequency, setFrequency] = useState(med?.frequency ?? '');
  const [time, setTime] = useState(med?.time ?? '');
  const [note, setNote] = useState(med?.note ?? '');
  const [supply, setSupply] = useState(med?.supply !== undefined ? String(med.supply) : '');

  if (!med) {
    return (
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <PageHeader title="Medication" onBack={() => navigation.goBack()} />
        <Text style={[styles.value, { marginTop: 24 }]}>This medication is no longer in your list.</Text>
      </SafeAreaView>
    );
  }

  const status = doses[med.id];
  const own = history.filter((h) => h.medId === med.id);
  const low = med.supply !== undefined && med.supply <= LOW_SUPPLY;

  const startEdit = () => {
    setStrength(med.strength);
    setFrequency(med.frequency);
    setTime(med.time);
    setNote(med.note ?? '');
    setSupply(med.supply !== undefined ? String(med.supply) : '');
    setEditing(true);
  };

  const save = () => {
    const n = supply.trim() === '' ? undefined : parseInt(supply, 10);
    if (n !== undefined && (isNaN(n) || n < 0)) return Alert.alert('Check the number', 'Pills left must be a number.');
    // TODO: also save this change to your backend.
    updateMedication(med.id, { strength: strength.trim(), frequency, time: time.trim(), note: note.trim(), supply: n });
    setEditing(false);
  };

  const remove = () =>
    confirmAction('Remove medication', `Remove ${med.name} from your list?`, 'Remove', () => {
      removeMedication(med.id);
      navigation.goBack();
    });

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <PageHeader title="Medication" onBack={() => navigation.goBack()} />
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <View style={styles.heroIcon}>
              <Ionicons name="medkit" size={26} color={colors.navy70} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroName}>{med.name}</Text>
              <Text style={styles.heroSub}>{[med.strength, med.frequency].filter(Boolean).join(' · ')}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Today</Text>
            <Text style={styles.value}>
              {status === 'taken' ? 'Taken ✓' : status === 'skipped' ? 'Skipped' : `Due at ${displayTime(med.time)}`}
            </Text>
            {status ? (
              <Button title="Undo" variant="outline" small onPress={() => setDose(med, null)} />
            ) : (
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Button title="Mark as taken" small style={{ flex: 1 }} onPress={() => setDose(med, 'taken')} />
                <Button title="Skip" variant="outline" small style={{ flex: 1 }} onPress={() => setDose(med, 'skipped')} />
              </View>
            )}
          </View>

          {editing ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Edit details</Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Input containerStyle={{ flex: 1 }} label="Strength" placeholder="500 mg" value={strength} onChangeText={setStrength} />
                <Input containerStyle={{ flex: 1 }} label="Time" placeholder="9:30 am" value={time} onChangeText={setTime} />
              </View>
              <Select label="Frequency" placeholder="Once daily" value={frequency} options={FREQUENCIES} onChange={setFrequency} />
              <Input label="Notes" placeholder="e.g. With breakfast" value={note} onChangeText={setNote} />
              <Input label="Pills left" placeholder="e.g. 18" value={supply} onChangeText={setSupply} keyboardType="number-pad" />
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Button title="Save" small style={{ flex: 1 }} onPress={save} />
                <Button title="Cancel" variant="outline" small style={{ flex: 1 }} onPress={() => setEditing(false)} />
              </View>
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Details</Text>
              <Detail label="Time" value={displayTime(med.time)} />
              <Detail label="Frequency" value={med.frequency || '—'} />
              <Detail label="Notes" value={med.note || '—'} last />
              <Button title="Edit details" variant="outline" small onPress={startEdit} />
            </View>
          )}

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Supply</Text>
            {med.supply === undefined ? (
              <Text style={styles.sub}>No supply count set. Tap "Edit details" to add pills left.</Text>
            ) : (
              <>
                <Text style={styles.value}>{`${med.supply} pills left`}</Text>
                <View style={styles.track}>
                  <View style={[styles.fill, { width: `${Math.min(100, (med.supply / 30) * 100)}%`, backgroundColor: low ? '#e8891a' : colors.navy70 }]} />
                </View>
                {low ? <Text style={styles.warn}>Running low. It may be time to request a refill.</Text> : null}
              </>
            )}
            {med.refillRequested ? (
              <View style={styles.requested}>
                <Ionicons name="checkmark-circle" size={18} color={colors.sage100} />
                <Text style={styles.requestedText}>Refill requested</Text>
              </View>
            ) : (
              // TODO: send the refill request to a pharmacy or your care team.
              <Button title="Request refill" variant="outline" small onPress={() => updateMedication(med.id, { refillRequested: true })} />
            )}
          </View>

          <View>
            <SectionLabel>TODAY'S LOG</SectionLabel>
            {own.length === 0 ? <Text style={styles.sub}>Nothing logged for this medication today.</Text> : null}
            {own.map((h) => (
              <Text key={h.id} style={styles.logLine}>{`${h.status === 'taken' ? 'Taken' : 'Skipped'} at ${h.at}`}</Text>
            ))}
          </View>

          <Button title="Remove medication" variant="link" onPress={remove} style={{ alignSelf: 'center' }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Detail({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.detail, !last && styles.detailLine]}>
      <Text style={styles.sub}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20 },
  content: { paddingTop: 24, paddingBottom: 24, gap: 16 },
  hero: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.chipBorder, borderRadius: 16 },
  heroIcon: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.sage20, alignItems: 'center', justifyContent: 'center' },
  heroName: { fontFamily: fonts.semibold, fontSize: 22, color: colors.dark12 },
  heroSub: { fontFamily: fonts.regular, fontSize: 14, color: colors.dark6 },
  card: { padding: 14, gap: 12, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.chipBorder, borderRadius: radius.card },
  cardTitle: { fontFamily: fonts.semibold, fontSize: 16, color: colors.dark12 },
  value: { fontFamily: fonts.regular, fontSize: 18, color: colors.dark12 },
  sub: { fontFamily: fonts.regular, fontSize: 13, color: colors.dark6 },
  detail: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, gap: 12 },
  detailLine: { borderBottomWidth: 1, borderBottomColor: colors.sage30 },
  detailValue: { flex: 1, textAlign: 'right', fontFamily: fonts.regular, fontSize: 14, color: colors.dark12 },
  track: { height: 8, borderRadius: 100, backgroundColor: '#dcdcdc', overflow: 'hidden' },
  fill: { height: 8, borderRadius: 100 },
  warn: { fontFamily: fonts.regular, fontSize: 13, color: '#e8891a' },
  requested: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  requestedText: { fontFamily: fonts.regular, fontSize: 14, color: colors.sage100 },
  logLine: { fontFamily: fonts.regular, fontSize: 14, color: colors.dark8, marginTop: 4 },
});
