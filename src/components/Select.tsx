import React, { useState } from 'react';
import { View, Text, Pressable, Modal, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius } from '../theme';

type Props = {
  label?: string;
  value?: string;
  placeholder?: string;
  options: string[];
  onChange: (v: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
};

export function Select({ label, value, placeholder, options, onChange, containerStyle }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <View style={[{ gap: 4 }, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable style={styles.field} onPress={() => setOpen(true)} accessibilityRole="button">
        <Text style={[styles.value, !value && { color: colors.dark2 }]} numberOfLines={1}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={16} color={colors.dark12} />
      </Pressable>
      <Modal transparent animationType="fade" visible={open} onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            {options.map((o) => (
              <Pressable
                key={o}
                style={styles.option}
                onPress={() => {
                  onChange(o);
                  setOpen(false);
                }}
              >
                <Text style={[styles.optionText, o === value && { fontFamily: fonts.semibold }]}>{o}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontFamily: fonts.regular, fontSize: 14, color: colors.heading, letterSpacing: -0.5 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 36,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.field,
  },
  value: { flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.dark12 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', padding: 32 },
  sheet: { backgroundColor: colors.white, borderRadius: radius.card, paddingVertical: 8 },
  option: { paddingVertical: 14, paddingHorizontal: 20 },
  optionText: { fontFamily: fonts.regular, fontSize: 14, color: colors.dark12 },
});
