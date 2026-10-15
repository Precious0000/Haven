import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RootScreenProps } from '../../navigation/types';
import { StepScreen } from '../../components/StepScreen';
import { Card, Chip, Checkbox, SectionLabel } from '../../components/Card';
import { Input } from '../../components/Input';
import { colors, fonts } from '../../theme';

/** Free-text input + suggestion chips, as used for conditions and allergies. */
function TagPicker({ placeholder, hint, suggestions, selected, onChange }: { placeholder: string; hint: string; suggestions: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  const [text, setText] = useState('');
  const toggle = (v: string) => onChange(selected.includes(v) ? selected.filter((s) => s !== v) : [...selected, v]);
  const add = () => {
    const v = text.trim();
    if (v && !selected.includes(v)) onChange([...selected, v]);
    setText('');
  };
  const all = [...suggestions, ...selected.filter((s) => !suggestions.includes(s))];
  return (
    <Card>
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <Input containerStyle={{ flex: 1 }} placeholder={placeholder} value={text} onChangeText={setText} onSubmitEditing={add} />
        <Pressable onPress={add} accessibilityLabel="Add" style={styles.plus}>
          <Ionicons name="add" size={16} color={colors.white} />
        </Pressable>
      </View>
      <Text style={styles.hint}>{hint}</Text>
      <View style={styles.chips}>
        {all.map((s) => (
          <Chip key={s} label={s} selected={selected.includes(s)} onPress={() => toggle(s)} />
        ))}
      </View>
    </Card>
  );
}

export function SignUpHealthScreen({ navigation }: RootScreenProps<'SignUpHealth'>) {
  const [conditions, setConditions] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [mobility, setMobility] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState('');

  return (
    <StepScreen
      step={3}
      title="Health Profile"
      subtitle="Allows in monitoring your safety"
      onBack={() => navigation.goBack()}
      ctaLabel="Save and Continue"
      onCta={() => navigation.navigate('SignUpFamily')}
    >
      <View>
        <SectionLabel>CONDITIONS/ SYMPTOMS</SectionLabel>
        <TagPicker
          placeholder="Add conditions, e.g...Diabetics"
          hint="Select from this option if they are your conditions or type if they are not there"
          suggestions={['Hypertension', 'Type 2 Diabetics', 'Arthritis']}
          selected={conditions}
          onChange={setConditions}
        />
      </View>
      <View>
        <SectionLabel>ALLERGIES</SectionLabel>
        <TagPicker
          placeholder="Add allergies, e.g...Latex"
          hint="Select from this option if they are your allergy or type if they are not there"
          suggestions={['Penicillin', 'Peanuts', 'Dairy', 'Latex']}
          selected={allergies}
          onChange={setAllergies}
        />
      </View>
      <View>
        <SectionLabel>MOBILITY NEEDS</SectionLabel>
        <Card>
          {['Cane', 'Walker / Rollator', 'Wheel chair'].map((m) => (
            <Checkbox key={m} label={m} checked={!!mobility[m]} onChange={(v) => setMobility((s) => ({ ...s, [m]: v }))} />
          ))}
          <Input multiline placeholder="Add additional notes: Describe any specific help you need with moving around..." value={notes} onChangeText={setNotes} />
        </Card>
      </View>
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  plus: { backgroundColor: colors.navy70, borderRadius: 100, padding: 8 },
  hint: { fontFamily: fonts.regular, fontSize: 10, color: colors.dark4, textAlign: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
