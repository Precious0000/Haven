import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { RootScreenProps } from '../../navigation/types';
import { colors, fonts } from '../../theme';

const SUGGESTIONS: { text: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { text: '"What\'s on my schedule today?"', icon: 'calendar-outline' },
  { text: '"Send a message to my daughter"', icon: 'chatbubble-ellipses-outline' },
];

export function VoiceCheckInScreen({ navigation }: RootScreenProps<'VoiceCheckIn'>) {
  // TODO: connect real speech recognition and the assistant.
  const [listening, setListening] = useState(false);

  return (
    <LinearGradient colors={['#0d2340', colors.navy90]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 20 }} edges={['top', 'bottom']}>
        <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Back" style={styles.back}>
          <Ionicons name="arrow-back" size={16} color={colors.navy90} />
        </Pressable>

        <View style={styles.greetingWrap}>
          <Text style={styles.greeting}>Hello, Linda. Today is a bright day. How are you feeling today?</Text>
        </View>

        <Pressable style={styles.micWrap} onPress={() => setListening((l) => !l)} accessibilityRole="button">
          <LinearGradient colors={[colors.sage70, '#4f8c93']} style={[styles.orb, listening && { opacity: 0.8 }]}>
            {!listening ? <Ionicons name="mic" size={36} color={colors.navy90} /> : null}
          </LinearGradient>
          <Text style={styles.micLabel}>{listening ? 'Listening…' : 'Tap to speak'}</Text>
        </Pressable>

        <Text style={styles.tryLabel}>TRY ASKING ME</Text>
        <View style={{ gap: 16 }}>
          {SUGGESTIONS.map((s) => (
            <View key={s.text} style={styles.suggestion}>
              <Ionicons name={s.icon} size={18} color={colors.sage30} />
              <Text style={styles.suggestionText}>{s.text}</Text>
            </View>
          ))}
        </View>

        <Pressable style={styles.complete} onPress={() => navigation.popToTop()} accessibilityRole="button">
          <Text style={styles.completeText}>Complete Check-in</Text>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  back: { marginTop: 16, width: 30, height: 30, borderRadius: 15, backgroundColor: colors.sage20, alignItems: 'center', justifyContent: 'center' },
  greetingWrap: { flex: 1, paddingTop: 40 },
  greeting: { fontFamily: fonts.semibold, fontSize: 36, lineHeight: 44, color: colors.white, textAlign: 'center', letterSpacing: -1 },
  micWrap: { alignItems: 'center', gap: 12, marginBottom: 32 },
  orb: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  micLabel: { fontFamily: fonts.regular, fontSize: 14, color: colors.sage30 },
  tryLabel: { fontFamily: fonts.regular, fontSize: 11, color: colors.sage30, marginBottom: 14 },
  suggestion: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', backgroundColor: 'rgba(255,255,255,0.08)' },
  suggestionText: { fontFamily: fonts.regular, fontSize: 14, color: colors.white },
  complete: { alignSelf: 'center', marginTop: 24, marginBottom: 12, width: 213, paddingVertical: 14, borderRadius: 4, backgroundColor: '#fff9f2', alignItems: 'center' },
  completeText: { fontFamily: fonts.regular, fontSize: 14, color: colors.navy70 },
});
