import React from 'react';
import { Pressable, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

export function BackButton({ onPress, style }: { onPress: () => void; style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      onPress={onPress}
      hitSlop={8}
      style={[{ alignSelf: 'flex-start', padding: 8, borderRadius: 100, backgroundColor: colors.sage20 }, style]}
    >
      <Ionicons name="arrow-back" size={16} color={colors.navy70} />
    </Pressable>
  );
}
