import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '../theme';

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home: 'home',
  Health: 'heart-outline',
  Family: 'people-outline',
  Settings: 'settings-outline',
};

export function FloatingTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom: Math.max(insets.bottom, 12) + 12 }]}>
      <View style={styles.pill}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
          };
          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityLabel={route.name}
              accessibilityState={{ selected: focused }}
              style={styles.item}
            >
              {focused ? (
                <View style={styles.activeRow}>
                  <View style={styles.activeTile}>
                    <Ionicons name={ICONS[route.name]} size={20} color={colors.white} />
                  </View>
                  <Text style={styles.label}>{route.name}</Text>
                </View>
              ) : (
                <Ionicons name={ICONS[route.name]} size={26} color={colors.navy70} />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 40,
    backgroundColor: 'rgba(226,240,240,0.96)',
    borderWidth: 1,
    borderColor: colors.sage30,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  item: { paddingHorizontal: 10, paddingVertical: 4 },
  activeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  activeTile: { width: 34, height: 34, borderRadius: 10, backgroundColor: colors.navy70, alignItems: 'center', justifyContent: 'center' },
  label: { fontFamily: fonts.bold, fontSize: 16, color: colors.navy70 },
});
