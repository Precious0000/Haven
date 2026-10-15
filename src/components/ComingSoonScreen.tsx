import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

/** Placeholder for screens whose Figma frames haven't been implemented yet. */
export function ComingSoon({ title }: { title: string }) {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>This screen hasn't been implemented yet.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg, padding: 32, gap: 8 },
  title: { fontFamily: fonts.semibold, fontSize: 20, color: colors.dark12 },
  body: { fontFamily: fonts.regular, fontSize: 14, color: colors.dark6, textAlign: 'center' },
});
