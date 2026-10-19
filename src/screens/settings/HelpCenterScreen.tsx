import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Linking, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootScreenProps } from '../../navigation/types';
import { PageHeader } from '../../components/SettingsUI';
import { Button } from '../../components/Button';
import { colors, fonts, radius } from '../../theme';

// TODO: set your real support details.
const SUPPORT_PHONE = '';
const SUPPORT_EMAIL = '';

// Placeholder FAQ text written for this draft. TODO: replace with your real answers.
const FAQS = [
  { q: 'How do I record a glucose or blood pressure reading?', a: 'Open the Health tab, choose the reading, and tap "Record new reading".' },
  { q: 'Who is alerted if I fall?', a: 'Your family contacts are alerted first. If they do not respond, a nearby emergency service is alerted.' },
  { q: 'How do I change my medication reminders?', a: 'Go to Settings, then Medications, to add, change or remove a medication.' },
  { q: 'Can I make the text bigger?', a: 'Yes. Open Settings, then Accessibility, and use the Font Size slider.' },
];

export function HelpCenterScreen({ navigation }: RootScreenProps<'HelpCenter'>) {
  const [open, setOpen] = useState<number | null>(0);

  const contact = (kind: 'tel' | 'mailto', value: string) => {
    if (!value) return Alert.alert('Not set up yet', 'Support contact details have not been added yet.');
    Linking.openURL(`${kind}:${value}`);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <PageHeader title="Help Center" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>FREQUENTLY ASKED QUESTIONS</Text>
        <View style={{ gap: 8 }}>
          {FAQS.map((f, i) => {
            const on = open === i;
            return (
              <Pressable key={f.q} style={styles.faq} onPress={() => setOpen(on ? null : i)} accessibilityRole="button" accessibilityState={{ expanded: on }}>
                <View style={styles.faqHead}>
                  <Text style={styles.q}>{f.q}</Text>
                  <Ionicons name={on ? 'chevron-up' : 'chevron-down'} size={18} color={colors.navy70} />
                </View>
                {on ? <Text style={styles.a}>{f.a}</Text> : null}
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.label, { marginTop: 8 }]}>NEED MORE HELP?</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Button title="Call support" style={{ flex: 1 }} leftIcon={<Ionicons name="call-outline" size={16} color={colors.white} />} onPress={() => contact('tel', SUPPORT_PHONE)} />
          <Button title="Email support" variant="outline" style={{ flex: 1 }} leftIcon={<Ionicons name="mail-outline" size={16} color={colors.navy70} />} onPress={() => contact('mailto', SUPPORT_EMAIL)} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20 },
  content: { paddingTop: 24, paddingBottom: 24, gap: 12 },
  label: { fontFamily: fonts.regular, fontSize: 12, color: colors.dark4 },
  faq: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.chipBorder, borderRadius: radius.card, padding: 12, gap: 8 },
  faqHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  q: { flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.dark12 },
  a: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18, color: colors.dark6 },
});
