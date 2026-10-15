import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { RootScreenProps } from '../../navigation/types';
import { colors, fonts } from '../../theme';

const RED = '#f04444';
const DARK_RED = '#932b2b';
const COUNTDOWN_FROM = 10;

export function EmergencyScreen({ navigation }: RootScreenProps<'Emergency'>) {
  const insets = useSafeAreaInsets();
  const [phase, setPhase] = useState<'countdown' | 'help'>('countdown');
  const [seconds, setSeconds] = useState(COUNTDOWN_FROM);

  useEffect(() => {
    if (phase !== 'countdown') return;
    if (seconds <= 0) {
      // TODO: notify family and emergency services here.
      setPhase('help');
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, seconds]);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <View style={[styles.banner, { paddingTop: insets.top }]}>
        <View style={styles.bannerRow}>
          <Ionicons name="shield" size={14} color={colors.white} />
          <Text style={styles.bannerText}>EMERGENCY DETECTED</Text>
        </View>
      </View>

      <View style={styles.body}>
        {phase === 'countdown' ? (
          <>
            <Text style={styles.heading}>FALL DETECTED!</Text>
            <Text style={styles.sub}>
              We are notifying your family and energency services in 10s. If you are okay, Respond or tap the button below
            </Text>
            <View style={styles.middle}>
              <View style={styles.circle}>
                <Text style={styles.count}>{seconds}</Text>
              </View>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.heading}>HELP IS ON THE WAY</Text>
            <Text style={styles.sub}>Take slow, gentle breaths. You are safe and not alone. Please stay resting comfortably where you are.</Text>
            <View style={styles.middle}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardName}>Laura</Text>
                  <Text style={styles.cardMeta}>·  6 mins away</Text>
                  <Ionicons name="volume-medium-outline" size={14} color={colors.white} />
                </View>
                <Text style={styles.quote}>
                  "Mom, I'm turning onto Ebute Street right now! Keep your head gently rested on the pillow. I'm right here with you, sweetie!"
                </Text>
                {/* TODO: start a call with the contact. */}
                <Pressable style={styles.connect}>
                  <Text style={styles.connectText}>Connect with Sarah</Text>
                </Pressable>
              </View>
              <View style={[styles.card, styles.ems]}>
                <Ionicons name="medkit-outline" size={26} color={colors.white} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.emsTitle}>Oak Creek EMS Station 4</Text>
                  <Text style={styles.emsSub}>Unit 12 Ambulance</Text>
                </View>
                <Text style={styles.emsEta}>6 mins away</Text>
              </View>
            </View>
          </>
        )}

        <SafeAreaView edges={['bottom']} style={styles.bottom}>
          {/* TODO: real speech recognition for "I am fine". */}
          <View style={styles.mic}>
            <Ionicons name="mic" size={30} color={colors.navy90} />
          </View>
          <Text style={styles.listening}>I am listening, Please speak!</Text>
          <Pressable style={styles.fine} onPress={() => navigation.goBack()} accessibilityRole="button">
            <Text style={styles.fineText}>I am Fine</Text>
          </Pressable>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: RED },
  banner: { backgroundColor: DARK_RED },
  bannerRow: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  bannerText: { fontFamily: fonts.regular, fontSize: 14, color: colors.white, letterSpacing: -0.3 },
  body: { flex: 1, paddingHorizontal: 20 },
  heading: { marginTop: 48, fontFamily: fonts.regular, fontSize: 36, lineHeight: 44, color: colors.white, textAlign: 'center', letterSpacing: -1 },
  sub: { marginTop: 14, fontFamily: fonts.regular, fontSize: 20, lineHeight: 22, color: colors.white, textAlign: 'center', paddingHorizontal: 16, letterSpacing: -0.4 },
  middle: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  circle: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  count: { fontFamily: fonts.regular, fontSize: 56, color: colors.white },
  card: { alignSelf: 'stretch', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)', backgroundColor: 'rgba(255,255,255,0.25)', gap: 6 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardName: { fontFamily: fonts.regular, fontSize: 14, color: colors.white },
  cardMeta: { fontFamily: fonts.regular, fontSize: 12, fontStyle: 'italic', color: colors.white },
  quote: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 15, color: colors.white },
  connect: { alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.6)' },
  connectText: { fontFamily: fonts.regular, fontSize: 12, color: 'rgba(255,255,255,0.85)' },
  ems: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  emsTitle: { fontFamily: fonts.regular, fontSize: 14, color: colors.white },
  emsSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.white },
  emsEta: { fontFamily: fonts.regular, fontSize: 12, fontStyle: 'italic', color: colors.white },
  bottom: { alignItems: 'center', gap: 12, paddingBottom: 12 },
  mic: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  listening: { fontFamily: fonts.regular, fontSize: 14, color: colors.white },
  fine: { alignSelf: 'stretch', marginTop: 20, height: 64, borderRadius: 6, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  fineText: { fontFamily: fonts.regular, fontSize: 20, color: colors.dark12 },
});
