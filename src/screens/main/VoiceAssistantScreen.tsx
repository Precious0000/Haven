import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { RootScreenProps } from '../../navigation/types';
import { colors, fonts } from '../../theme';

type Line = { from: 'ai' | 'user'; text: string };

const GREETING = 'Hello, Linda. Today is a bright day. How are you feeling today?';

// Sample conversation from the design. TODO: replace with real speech-to-text and assistant replies.
const SCRIPT: { delay: number; line: Line }[] = [
  { delay: 0, line: { from: 'user', text: 'I am feeling energetic this morning… I woke up and drank some water and also took some steps' } },
  { delay: 2500, line: { from: 'ai', text: "That's beautiful to hear. Is there anything I can do for you today or suggest for you?" } },
  { delay: 5000, line: { from: 'user', text: "What's on my schedule today?" } },
];

const SUGGESTIONS: { text: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { text: '"What\'s on my schedule today?"', icon: 'calendar-outline' },
  { text: '"Send a message to my daughter"', icon: 'chatbubble-ellipses-outline' },
];

export function VoiceAssistantScreen({ navigation }: RootScreenProps<'VoiceAssistant'>) {
  const [listening, setListening] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!listening) return;
    setLines([]);
    const timers = SCRIPT.map((s) => setTimeout(() => setLines((l) => [...l, s.line]), s.delay));
    return () => timers.forEach(clearTimeout);
  }, [listening]);

  return (
    <LinearGradient colors={['#0d2340', colors.navy90]} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 20 }} edges={['top', 'bottom']}>
        <Pressable onPress={() => navigation.goBack()} accessibilityLabel="Back" style={styles.back}>
          <Ionicons name="arrow-back" size={16} color={colors.navy90} />
        </Pressable>

        {listening ? (
          <ScrollView
            ref={scrollRef}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingTop: 36, paddingBottom: 12, gap: 18 }}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.aiText}>{GREETING}</Text>
            {lines.map((l, i) =>
              l.from === 'user' ? (
                <View key={i} style={styles.bubble}>
                  <Text style={styles.bubbleText}>{l.text}</Text>
                </View>
              ) : (
                <Text key={i} style={styles.aiText}>
                  {l.text}
                </Text>
              )
            )}
          </ScrollView>
        ) : (
          <View style={styles.greetingWrap}>
            <Text style={styles.greetingLarge}>{GREETING}</Text>
          </View>
        )}

        <Pressable style={styles.micWrap} onPress={() => setListening((l) => !l)} accessibilityRole="button" accessibilityLabel={listening ? 'Stop listening' : 'Tap to speak'}>
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

        <Pressable style={styles.end} onPress={() => navigation.replace('Chat')} accessibilityRole="button">
          <Text style={styles.endText}>End conversation</Text>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  back: { marginTop: 16, width: 30, height: 30, borderRadius: 15, backgroundColor: colors.sage20, alignItems: 'center', justifyContent: 'center' },
  greetingWrap: { flex: 1, justifyContent: 'flex-start', paddingTop: 40 },
  greetingLarge: { fontFamily: fonts.semibold, fontSize: 36, lineHeight: 44, color: colors.white, textAlign: 'center', letterSpacing: -1 },
  aiText: { fontFamily: fonts.semibold, fontSize: 18, lineHeight: 22, color: colors.sage30 },
  bubble: { alignSelf: 'flex-end', width: '70%', padding: 10, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', backgroundColor: 'rgba(255,255,255,0.08)' },
  bubbleText: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 18, color: colors.white, textAlign: 'right' },
  micWrap: { alignItems: 'center', gap: 12, marginBottom: 32 },
  orb: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  micLabel: { fontFamily: fonts.regular, fontSize: 14, color: colors.sage30 },
  tryLabel: { fontFamily: fonts.regular, fontSize: 11, color: colors.sage30, marginBottom: 14 },
  suggestion: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', backgroundColor: 'rgba(255,255,255,0.08)' },
  suggestionText: { fontFamily: fonts.regular, fontSize: 14, color: colors.white },
  end: { alignSelf: 'center', marginTop: 24, marginBottom: 12, width: 186, paddingVertical: 14, borderRadius: 4, backgroundColor: colors.danger, alignItems: 'center' },
  endText: { fontFamily: fonts.regular, fontSize: 14, color: colors.white },
});
