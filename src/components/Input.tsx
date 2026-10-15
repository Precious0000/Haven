import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, Pressable, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, radius } from '../theme';

type Props = TextInputProps & {
  label?: string;
  secure?: boolean;
  left?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
};

export function Input({ label, secure, left, multiline, containerStyle, style, ...rest }: Props) {
  const [hidden, setHidden] = useState(!!secure);
  return (
    <View style={[{ gap: 4 }, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.field, multiline && styles.multiline]}>
        {left}
        <TextInput
          placeholderTextColor={colors.dark2}
          secureTextEntry={hidden}
          multiline={multiline}
          style={[styles.input, multiline && { textAlignVertical: 'top' }, style]}
          {...rest}
        />
        {secure ? (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={8} accessibilityLabel="Toggle password visibility">
            <Ionicons name={hidden ? 'eye-off-outline' : 'eye-outline'} size={16} color={colors.dark8} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontFamily: fonts.regular, fontSize: 14, color: colors.heading, letterSpacing: -0.5 },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 36,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.field,
  },
  multiline: { height: 61, alignItems: 'flex-start', paddingVertical: 8 },
  input: { flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.dark12, padding: 0 },
});
