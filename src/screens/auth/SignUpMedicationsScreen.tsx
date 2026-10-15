import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RootScreenProps } from '../../navigation/types';
import { StepScreen } from '../../components/StepScreen';
import { Card, SectionLabel } from '../../components/Card';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Button } from '../../components/Button';
import { colors, fonts } from '../../theme';

type Medication = { name: string; type: string; strength: string; frequency: string; time: string; reminder: string; alert: string; note: string };

export function SignUpMedicationsScreen({ navigation }: RootScreenProps<'SignUpMedications'>) {
  const empty: Medication = { name: '', type: '', strength: '', frequency: '', time: '', reminder: '', alert: '', note: '' };
  const [med, setMed] = useState<Medication>(empty);
  const [meds, setMeds] = useState<Medication[]>([]);
  const [familyAlerts, setFamilyAlerts] = useState(false);
  const set = (k: keyof Medication) => (v: string) => setMed((m) => ({ ...m, [k]: v }));

  const add = () => {
    if (!med.name.trim()) return Alert.alert('Missing details', 'Enter the medication name.');
    setMeds((m) => [...m, med]);
    setMed(empty);
  };

  const complete = () => {
    // TODO: submit the whole sign-up payload (steps 1-5) to your backend here.
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  };

  return (
    <StepScreen
      step={5}
      title="Medications"
      subtitle="Add your daily pills here. We will remind you when it is time to take them."
      onBack={() => navigation.goBack()}
      ctaLabel="Complete Profile"
      onCta={complete}
    >
      <View>
        <SectionLabel>ADD MEDICATIONS</SectionLabel>
        <Card gap={12}>
          <Input label="Name of Medication" placeholder="Enter medication name" value={med.name} onChangeText={set('name')} />
          <View style={styles.pair}>
            <Select containerStyle={{ flex: 1 }} label="Medication type" placeholder="Tablet" value={med.type} options={['Tablet', 'Capsule', 'Liquid', 'Injection', 'Inhaler']} onChange={set('type')} />
            <Input containerStyle={{ flex: 1 }} label="Strength" placeholder="500mg" value={med.strength} onChangeText={set('strength')} />
          </View>
          <View style={styles.pair}>
            <Select containerStyle={{ flex: 1 }} label="Frequency" placeholder="Once daily" value={med.frequency} options={['Once daily', 'Twice daily', 'Three times daily', 'Weekly', 'As needed']} onChange={set('frequency')} />
            <Input containerStyle={{ flex: 1 }} label="Specific time" placeholder="8:00" value={med.time} onChangeText={set('time')} />
          </View>
          <View style={styles.pair}>
            <Select containerStyle={{ flex: 1 }} label="Reminder" placeholder="Never" value={med.reminder} options={['Never', 'On time', 'Every 10 mins until taken']} onChange={set('reminder')} />
            <Select containerStyle={{ flex: 1 }} label="Alert" placeholder="30 mins before" value={med.alert} options={['At time', '15 mins before', '30 mins before', '1 hour before']} onChange={set('alert')} />
          </View>
          <Input label="Additional note" placeholder="Type here" value={med.note} onChangeText={set('note')} />
          <Button title="Add medication" variant="outline" small onPress={add} />
          <View style={styles.divider} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Ionicons name="volume-high-outline" size={24} color={colors.navy90} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.title}>Family Alerts</Text>
              <Text style={styles.body}>Notify family if missed</Text>
            </View>
            <Switch value={familyAlerts} onValueChange={setFamilyAlerts} trackColor={{ true: colors.sage80, false: '#d9d9d9' }} thumbColor={colors.white} />
          </View>
        </Card>
      </View>

      {meds.map((m, i) => (
        <Card key={`${m.name}-${i}`} gap={2}>
          <Text style={styles.title}>{m.name}</Text>
          <Text style={styles.body}>{[m.strength, m.type, m.frequency, m.time].filter(Boolean).join(' · ')}</Text>
        </Card>
      ))}
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  pair: { flexDirection: 'row', gap: 10 },
  divider: { height: 1, backgroundColor: colors.cardBorder },
  title: { fontFamily: fonts.regular, fontSize: 14, color: colors.navy90, letterSpacing: -0.4 },
  body: { fontFamily: fonts.regular, fontSize: 12, color: colors.dark6, letterSpacing: -0.36 },
});
