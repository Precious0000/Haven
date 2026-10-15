import React from 'react';
import { Text } from 'react-native';
import { colors, fonts } from '../theme';

// TODO: replace with the exported logo asset from Figma (node "Untitled design 1").
export function Logo({ size = 29 }: { size?: number }) {
  return (
    <Text style={{ fontFamily: fonts.bold, fontSize: size, letterSpacing: size * 0.08 }}>
      <Text style={{ color: colors.navy70 }}>HA</Text>
      <Text style={{ color: colors.sage70 }}>VEN</Text>
    </Text>
  );
}
