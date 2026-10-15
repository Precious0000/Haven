import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { RootScreenProps } from '../../navigation/types';
import { Logo } from '../../components/Logo';
import { colors } from '../../theme';

export function SplashScreen({ navigation }: RootScreenProps<'Splash'>) {
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scale, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
    ]).start();
    // TODO: skip onboarding when the user already has a session.
    const t = setTimeout(() => navigation.replace('Onboarding'), 1800);
    return () => clearTimeout(t);
  }, [navigation, opacity, scale]);

  return (
    <View style={styles.root}>
      <Animated.View style={{ opacity, transform: [{ scale }] }}>
        <Logo size={44} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' } });
