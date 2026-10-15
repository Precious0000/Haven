import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius } from '../theme';

export function SectionLabel({ children }: { children: string }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

export function Card({ children, gap = 10 }: { children: React.ReactNode; gap?: number }) {
  return <View style={[styles.card, { gap }]}>{children}</View>;
}

export function Chip({ label, selected, onPress }: { label: string; selected?: boolean; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && { backgroundColor: colors.sage20, borderColor: colors.sage80 }]}
    >
      <Text style={styles.chipText}>{label}</Text>
    </Pressable>
  );
}

export function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <Pressable style={styles.checkRow} onPress={() => onChange(!checked)} accessibilityRole="checkbox" accessibilityState={{ checked }}>
      <View style={[styles.box, checked && { backgroundColor: colors.navy70, borderColor: colors.navy70 }]}>
        {checked ? <Ionicons name="checkmark" size={14} color={colors.white} /> : null}
      </View>
      <Text style={styles.checkLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sectionLabel: { fontFamily: fonts.regular, fontSize: 12, color: colors.dark4, letterSpacing: -0.4, marginBottom: 8 },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: radius.card,
    paddingHorizontal: 10,
    paddingVertical: 13,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.chipBorder,
    borderRadius: 50,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  chipText: { fontFamily: fonts.regular, fontSize: 12, color: colors.dark7, letterSpacing: -0.4 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  box: {
    width: 20,
    height: 20,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#b9b9b9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkLabel: { fontFamily: fonts.regular, fontSize: 14, color: colors.navy90, letterSpacing: -0.4 },
});
