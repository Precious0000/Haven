import React from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts } from '../theme';
import { BackButton } from './BackButton';
import { Button } from './Button';

type Props = {
  step: number;
  total?: number;
  title: string;
  subtitle: string;
  onBack: () => void;
  ctaLabel: string;
  onCta: () => void;
  footerLink?: { label: string; onPress: () => void };
  children: React.ReactNode;
};

/** Shared layout for the 5-step sign-up flow (progress bar, back button, title, CTA). */
export function StepScreen({ step, total = 5, title, subtitle, onBack, ctaLabel, onCta, footerLink, children }: Props) {
  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Text style={styles.stepText}>{`Step ${step} of ${total}`}</Text>
          <View style={styles.bars}>
            {Array.from({ length: total }).map((_, i) => (
              <View key={i} style={[styles.bar, { backgroundColor: i < step ? colors.sage80 : colors.sage30 }]} />
            ))}
          </View>
          <BackButton onPress={onBack} style={{ marginTop: 18 }} />
        </View>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
        <View style={styles.footer}>
          <Button title={ctaLabel} onPress={onCta} />
          {footerLink ? <Button title={footerLink.label} variant="link" onPress={footerLink.onPress} /> : null}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 26, paddingTop: 12 },
  stepText: { fontFamily: fonts.regular, fontSize: 12, color: colors.sage100, letterSpacing: -0.36, lineHeight: 16 },
  bars: { flexDirection: 'row', gap: 4, marginTop: 2 },
  bar: { flex: 1, height: 8, borderRadius: 10 },
  titleBlock: { alignItems: 'center', paddingHorizontal: 47, marginTop: 8, gap: 6 },
  title: { fontFamily: fonts.semibold, fontSize: 20, lineHeight: 24, color: colors.dark12, letterSpacing: -0.6, textAlign: 'center' },
  subtitle: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 16, color: colors.dark8, letterSpacing: -0.4, textAlign: 'center' },
  content: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 24, gap: 16 },
  footer: { paddingHorizontal: 20, paddingBottom: 8 },
});
