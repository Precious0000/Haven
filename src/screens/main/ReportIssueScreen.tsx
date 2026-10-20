import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Switch, Alert, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootScreenProps } from '../../navigation/types';
import { PageHeader } from '../../components/SettingsUI';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Chip } from '../../components/Card';
import { useCare } from '../../careData';
import { colors, fonts, radius } from '../../theme';

const CATEGORIES = ['Feeling unwell', 'I had a fall', 'Medication problem', 'Need assistance', 'App problem', 'Other'];

export function ReportIssueScreen({ navigation }: RootScreenProps<'ReportIssue'>) {
  const { addReport } = useCare();
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [notifyFamily, setNotifyFamily] = useState(true);
  const [sent, setSent] = useState(false);

  const send = () => {
    if (!category) return Alert.alert('Choose a category', 'Pick what the problem is about.');
    addReport({ category, description: description.trim(), notifyFamily });
    setSent(true);
  };

  if (sent) {
    return (
      <SafeAreaView style={[styles.root, { justifyContent: 'center' }]} edges={['top', 'bottom']}>
        <View style={styles.done}>
          <Ionicons name="checkmark-circle" size={72} color={colors.sage100} />
          <Text style={styles.doneTitle}>Report sent</Text>
          <Text style={styles.doneBody}>
            {notifyFamily ? 'Thank you. Your family contacts have been told, and we will follow up soon.' : 'Thank you. We will follow up soon.'}
          </Text>
        </View>
        <Button title="Back to Home" onPress={() => navigation.popToTop()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <PageHeader title="Report an Issue" onBack={() => navigation.goBack()} />
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.urgent}>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.urgentTitle}>Is this an emergency?</Text>
              <Text style={styles.urgentBody}>If you need help right now, tap the button.</Text>
            </View>
            <Pressable style={styles.urgentBtn} onPress={() => navigation.navigate('Emergency')} accessibilityRole="button">
              <Text style={styles.urgentBtnText}>I need help now</Text>
            </Pressable>
          </View>

          <View style={{ gap: 10 }}>
            <Text style={styles.label}>WHAT IS THE PROBLEM ABOUT?</Text>
            <View style={styles.chips}>
              {CATEGORIES.map((c) => (
                <Chip key={c} label={c} selected={category === c} onPress={() => setCategory(c)} />
              ))}
            </View>
          </View>

          <Input label="Tell us more (optional)" placeholder="Describe what happened..." multiline value={description} onChangeText={setDescription} />

          <View style={styles.notify}>
            <View style={{ flex: 1 }}>
              <Text style={styles.notifyTitle}>Let my family contacts know</Text>
              <Text style={styles.notifyBody}>They will get a message about this report.</Text>
            </View>
            <Switch value={notifyFamily} onValueChange={setNotifyFamily} trackColor={{ true: colors.navy70, false: '#d9d9d9' }} thumbColor={colors.white} />
          </View>
        </ScrollView>
        <Button title="Send report" onPress={send} style={{ marginBottom: 12 }} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20 },
  content: { paddingTop: 24, paddingBottom: 16, gap: 20 },
  label: { fontFamily: fonts.regular, fontSize: 12, color: colors.dark4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  urgent: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: '#fdecec', borderWidth: 1, borderColor: '#ef4444', borderRadius: radius.card },
  urgentTitle: { fontFamily: fonts.semibold, fontSize: 14, color: '#c0141c' },
  urgentBody: { fontFamily: fonts.regular, fontSize: 12, color: '#e0343a' },
  urgentBtn: { backgroundColor: '#ef4444', borderRadius: 6, paddingVertical: 10, paddingHorizontal: 12 },
  urgentBtnText: { fontFamily: fonts.regular, fontSize: 13, color: colors.white },
  notify: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.chipBorder, borderRadius: radius.card },
  notifyTitle: { fontFamily: fonts.regular, fontSize: 14, color: colors.dark12 },
  notifyBody: { fontFamily: fonts.regular, fontSize: 12, color: colors.dark6 },
  done: { alignItems: 'center', gap: 10, marginBottom: 32, paddingHorizontal: 12 },
  doneTitle: { fontFamily: fonts.semibold, fontSize: 24, color: colors.dark12 },
  doneBody: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.dark6, textAlign: 'center' },
});
