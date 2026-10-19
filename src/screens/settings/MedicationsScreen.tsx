import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootScreenProps } from '../../navigation/types';
import { PageHeader } from '../../components/SettingsUI';
import { Card, SectionLabel } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { useSettings } from '../../settings';
import { confirmAction } from '../../confirm';
import { colors, fonts } from '../../theme';

const FREQUENCIES = ['Once daily', 'Twice daily', 'Three times daily', 'Weekly', 'As needed'];

export function MedicationsScreen({ navigation }: RootScreenProps<'Medications'>) {
  const { settings, addMedication, removeMedication } = useSettings();
  const [name, setName] = useState('');
  const [strength, setStrength] = useState('');
  const [frequency, setFrequency] = useState('');
  const [time, setTime] = useState('');

  const add = () => {
    if (!name.trim()) return Alert.alert('Missing details', 'Enter the medication name.');
    // TODO: save to your backend, and use the same list on the Home screen.
    addMedication({ name: name.trim(), strength: strength.trim(), frequency: frequency || 'Once daily', time: time.trim() });
    setName('');
    setStrength('');
    setFrequency('');
    setTime('');
  };

  const remove = (id: string, medName: string) =>
    confirmAction('Remove medication', `Remove ${medName}?`, 'Remove', () => removeMedication(id));

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <PageHeader title="Medications" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View>
          <SectionLabel>YOUR MEDICATIONS</SectionLabel>
          <View style={{ gap: 8 }}>
            {settings.medications.length === 0 ? <Text style={styles.empty}>No medications added yet.</Text> : null}
            {settings.medications.map((m) => (
              <View key={m.id} style={styles.item}>
                <View style={styles.pill}>
                  <Ionicons name="medkit-outline" size={16} color={colors.navy70} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.medName}>{m.name}</Text>
                  <Text style={styles.medMeta}>{[m.strength, m.frequency, m.time].filter(Boolean).join(' · ')}</Text>
                </View>
                <Pressable onPress={() => remove(m.id, m.name)} accessibilityLabel={`Remove ${m.name}`} hitSlop={8}>
                  <Ionicons name="trash-outline" size={20} color={colors.error7} />
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        <View>
          <SectionLabel>ADD MEDICATION</SectionLabel>
          <Card gap={12}>
            <Input label="Name of Medication" placeholder="Enter medication name" value={name} onChangeText={setName} />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Input containerStyle={{ flex: 1 }} label="Strength" placeholder="500mg" value={strength} onChangeText={setStrength} />
              <Input containerStyle={{ flex: 1 }} label="Specific time" placeholder="8:00" value={time} onChangeText={setTime} />
            </View>
            <Select label="Frequency" placeholder="Once daily" value={frequency} options={FREQUENCIES} onChange={setFrequency} />
            <Button title="Add medication" variant="outline" small onPress={add} />
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20 },
  content: { paddingTop: 24, paddingBottom: 24, gap: 20 },
  empty: { fontFamily: fonts.regular, fontSize: 14, color: colors.dark6 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.chipBorder, borderRadius: 8 },
  pill: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.sage20, alignItems: 'center', justifyContent: 'center' },
  medName: { fontFamily: fonts.regular, fontSize: 16, color: colors.dark12 },
  medMeta: { fontFamily: fonts.regular, fontSize: 12, color: colors.dark6 },
});
