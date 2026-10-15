import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootScreenProps } from '../../navigation/types';
import { BackButton } from '../../components/BackButton';
import { colors, fonts } from '../../theme';

type Msg = { id: string; from: 'ai' | 'user'; text: string };

// Sample conversation from the design.
const INITIAL: Msg[] = [
  { id: '1', from: 'ai', text: 'Hello Linda, Today is a bright day. How are you feeling today?' },
  { id: '2', from: 'user', text: 'I am feeling energetic this morning… I woke up and drank some water and also took some steps' },
  { id: '3', from: 'ai', text: "That's beautiful  to hear. Is there anything I can do for you today or suggest for you?" },
  { id: '4', from: 'user', text: "What's on my schedule today?" },
];

const CHIPS = ['Daily news reminder', 'Send a message to my daughter'];

// TODO: replace with a real assistant response.
const PLACEHOLDER_REPLY = "I can't help with that just yet, but I'm learning.";

export function ChatScreen({ navigation }: RootScreenProps<'Chat'>) {
  const [messages, setMessages] = useState<Msg[]>(INITIAL);
  const [typing, setTyping] = useState(true);
  const [text, setText] = useState('');
  const scrollRef = useRef<ScrollView>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const reply = () => {
    setTyping(true);
    timer.current = setTimeout(() => {
      setMessages((m) => [...m, { id: String(Date.now()), from: 'ai', text: PLACEHOLDER_REPLY }]);
      setTyping(false);
    }, 1500);
  };

  useEffect(() => {
    reply(); // the design opens with the assistant "typing"
    return () => clearTimeout(timer.current);
  }, []);

  const send = (value: string) => {
    const v = value.trim();
    if (!v) return;
    clearTimeout(timer.current);
    setMessages((m) => [...m, { id: String(Date.now()), from: 'user', text: v }]);
    setText('');
    reply();
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 0 }} />
          <Text style={styles.title}>HavAi</Text>
        </View>

        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={styles.messages}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((m) => (
            <View key={m.id} style={[styles.bubble, m.from === 'user' ? styles.user : styles.ai]}>
              <Text style={[styles.bubbleText, m.from === 'user' && { color: colors.white }]}>{m.text}</Text>
            </View>
          ))}
          {typing ? (
            <View style={[styles.bubble, styles.ai, { paddingHorizontal: 10 }]}>
              <Text style={styles.bubbleText}>…</Text>
            </View>
          ) : null}
        </ScrollView>

        <View style={styles.chips}>
          {CHIPS.map((c) => (
            <Pressable key={c} style={styles.chip} onPress={() => send(c)}>
              <Text style={styles.chipText}>{c}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Ask HavAi"
              placeholderTextColor={colors.dark2}
              value={text}
              onChangeText={setText}
              onSubmitEditing={() => send(text)}
              returnKeyType="send"
            />
            <Ionicons name="happy-outline" size={22} color={colors.dark6} />
          </View>
          <Pressable style={styles.mic} accessibilityLabel="Talk to HavAi" onPress={() => navigation.replace('VoiceAssistant')}>
            <Ionicons name="mic" size={22} color={colors.white} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20 },
  header: { height: 44, marginTop: 16, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.semibold, fontSize: 18, color: colors.dark12 },
  messages: { paddingTop: 24, paddingBottom: 12, gap: 20 },
  bubble: { maxWidth: '82%', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8 },
  ai: { alignSelf: 'flex-start', backgroundColor: '#e7f2f2' },
  user: { alignSelf: 'flex-end', backgroundColor: '#0d1f3a' },
  bubbleText: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 18, color: colors.navy90, textAlign: 'right' },
  chips: { alignItems: 'flex-start', gap: 8, paddingBottom: 10 },
  chip: { borderWidth: 1, borderColor: colors.sage50, borderRadius: 100, paddingHorizontal: 10, paddingVertical: 5 },
  chipText: { fontFamily: fonts.regular, fontSize: 12, color: colors.dark8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingBottom: 8 },
  inputWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', height: 46, paddingHorizontal: 14, borderRadius: 23, borderWidth: 1, borderColor: colors.sage30, backgroundColor: colors.white },
  input: { flex: 1, fontFamily: fonts.regular, fontSize: 14, color: colors.dark12 },
  mic: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#0d1f3a', alignItems: 'center', justifyContent: 'center' },
});
