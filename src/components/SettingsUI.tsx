import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BackButton } from './BackButton';
import { colors, fonts, radius } from '../theme';

export function PageHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View style={styles.header}>
      <BackButton onPress={onBack} style={{ position: 'absolute', left: 0 }} />
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
}

export function SettingsCard({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

type RowProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  last?: boolean;
  danger?: boolean;
};

export function SettingsRow({ icon, title, subtitle, onPress, right, last, danger }: RowProps) {
  const content = (
    <View style={[styles.row, !last && styles.divider]}>
      {icon ? <Ionicons name={icon} size={22} color={danger ? colors.error7 : colors.navy90} /> : null}
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowTitle, danger && { color: colors.error7 }]}>{title}</Text>
        {subtitle ? <Text style={styles.rowSub}>{subtitle}</Text> : null}
      </View>
      {right ?? (onPress && !danger ? <Ionicons name="chevron-forward" size={18} color={colors.navy70} /> : null)}
    </View>
  );
  return onPress ? (
    <Pressable onPress={onPress} accessibilityRole="button">
      {content}
    </Pressable>
  ) : (
    content
  );
}

const styles = StyleSheet.create({
  header: { height: 44, marginTop: 16, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: fonts.semibold, fontSize: 20, color: colors.dark12, letterSpacing: -0.5 },
  card: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.chipBorder, borderRadius: radius.card, paddingHorizontal: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.sage30 },
  rowTitle: { fontFamily: fonts.regular, fontSize: 14, color: colors.dark12, letterSpacing: -0.3 },
  rowSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.dark6, marginTop: 2 },
});
