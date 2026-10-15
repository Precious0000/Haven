import React from 'react';
import { Pressable, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors, fonts, radius } from '../theme';

type Props = {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'outline' | 'link' | 'tonal';
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  small?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export function Button({ title, onPress, variant = 'primary', style, disabled, small, leftIcon, rightIcon }: Props) {
  const textColor =
    variant === 'primary' ? colors.white : variant === 'tonal' ? colors.navy90 : colors.navy70;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        small ? styles.small : styles.regular,
        variant === 'primary' && styles.primary,
        variant === 'outline' && styles.outline,
        variant === 'tonal' && styles.tonal,
        variant === 'link' && styles.link,
        (pressed || disabled) && { opacity: disabled ? 0.5 : 0.85 },
        style,
      ]}
    >
      {leftIcon}
      <Text style={[styles.text, { color: textColor }, small && { fontSize: 12 }]}>{title}</Text>
      {rightIcon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: radius.button },
  regular: { paddingVertical: 17, paddingHorizontal: 16 },
  small: { paddingVertical: 13, paddingHorizontal: 12 },
  primary: { backgroundColor: colors.navy70, borderWidth: 1, borderColor: colors.navy70 },
  outline: { borderWidth: 1, borderColor: colors.navy70 },
  tonal: { backgroundColor: colors.sage50 },
  link: { paddingVertical: 14 },
  text: { fontFamily: fonts.regular, fontSize: 14, letterSpacing: -0.5 },
});
