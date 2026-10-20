import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Alert, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootScreenProps } from '../../navigation/types';
import { PageHeader } from '../../components/SettingsUI';
import { Card, SectionLabel } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { useCare } from '../../careData';
import { colors, fonts, radius } from '../../theme';

const TYPES = ['Walk', 'Exercise', 'Stretching', 'Rest', 'Other'];
const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Walk: 'walk-outline',
  Exercise: 'barbell-outline',
  Stretching: 'body-outline',
  Rest: 'bed-outline',
  Other: 'ellipse-outline',
};

export function ActivityLogScreen({ navigation }: RootScreenProps<'ActivityLog'>) {
  const { activities, addActivity, removeActivity } = useCare();
  const [type, setType] = useState('');
  const [minutes, setMinutes] = useState('');
  const [note, setNote] = useState('');

  const total = activities.reduce((sum, a) => sum + a.minutes, 0);

  const add = () => {
    const mins = parseInt(minutes, 10);
    if (!mins || mins <= 0) return Alert.alert('Missing details', 'Enter how many minutes you were active.');
    addActivity({ type: type || 'Other', minutes: mins, note: note.trim() });
    setType('');
    setMinutes('');
    setNote('');
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <PageHeader title="Activity Log" onBack={() => navigation.goBack()} />
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.summary}>
            <View style={styles.summaryIcon}>
              <Ionicons name="walk" size={22} color={colors.navy70} />
            </View>
            <View>
              <Text style={styles.summaryValue}>
                {total} <Text style={styles.summaryUnit}>min active today</Text>
              </Text>
              <Text style={styles.summarySub}>{`${activities.length} ${activities.length === 1 ? 'activity' : 'activities'} logged`}</Text>
            </View>
          </View>

          <View>
            <SectionLabel>ADD ACTIVITY</SectionLabel>
            <Card gap={12}>
              <Select label="Type" placeholder="Walk" value={type} options={TYPES} onChange={setType} />
              <Input label="Minutes" placeholder="20" value={minutes} onChangeText={setMinutes} keyboardType="number-pad" />
              <Input label="Note (optional)" placeholder="e.g. Assisted with companion cane" value={note} onChangeText={setNote} />
              <Button title="Add activity" variant="outline" small onPress={add} />
            </Card>
          </View>

          <View>
            <SectionLabel>TODAY</SectionLabel>
            <View style={{ gap: 8 }}>
              {activities.length === 0 ? <Text style={styles.empty}>Nothing logged yet today.</Text> : null}
              {activities.map((a) => (
                <View key={a.id} style={styles.item}>
                  <View style={styles.itemIcon}>
                    <Ionicons name={ICONS[a.type] ?? 'ellipse-outline'} size={16} color={colors.navy70} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitle}>{`${a.type} · ${a.minutes} min`}</Text>
                    <Text style={styles.itemSub}>{[a.note, a.at].filter(Boolean).join(' · ')}</Text>
                  </View>
                  <Pressable onPress={() => removeActivity(a.id)} accessibilityLabel={`Remove ${a.type}`} hitSlop={8}>
                    <Ionicons name="trash-outline" size={20} color={colors.error7} />
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20 },
  content: { paddingTop: 24, paddingBottom: 24, gap: 20 },
  summary: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.chipBorder, borderRadius: 16 },
  summaryIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.sage20, alignItems: 'center', justifyContent: 'center' },
  summaryValue: { fontFamily: fonts.semibold, fontSize: 28, color: colors.dark12 },
  summaryUnit: { fontFamily: fonts.regular, fontSize: 14, color: colors.dark6 },
  summarySub: { fontFamily: fonts.regular, fontSize: 12, color: colors.dark6 },
  empty: { fontFamily: fonts.regular, fontSize: 14, color: colors.dark6 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.chipBorder, borderRadius: radius.card },
  itemIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.sage20, alignItems: 'center', justifyContent: 'center' },
  itemTitle: { fontFamily: fonts.regular, fontSize: 16, color: colors.dark12 },
  itemSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.dark6 },
});
