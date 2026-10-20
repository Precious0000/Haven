import React from 'react';
import { View, Text, Pressable, ScrollView, Linking, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootScreenProps } from '../../navigation/types';
import { PageHeader } from '../../components/SettingsUI';
import { Contact, useContacts } from '../../contacts';
import { colors, fonts, radius } from '../../theme';

// TODO: set the emergency number to call.
const EMERGENCY_NUMBER = '';

const clean = (phone: string) => phone.replace(/\s/g, '');
const initials = (name: string) =>
  name
    .replace(/^Dr\.?\s+/i, '')
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();

function Row({ c }: { c: Contact }) {
  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.initials}>{initials(c.name)}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{c.name}</Text>
        <Text style={styles.sub}>{c.role}</Text>
      </View>
      <Pressable style={styles.msg} accessibilityRole="button" accessibilityLabel={`Message ${c.name}`} onPress={() => Linking.openURL(`sms:${clean(c.phone)}`)}>
        <Ionicons name="chatbubble-ellipses-outline" size={20} color={colors.navy70} />
      </Pressable>
      <Pressable style={styles.call} accessibilityRole="button" accessibilityLabel={`Call ${c.name}`} onPress={() => Linking.openURL(`tel:${clean(c.phone)}`)}>
        <Ionicons name="call" size={20} color={colors.white} />
      </Pressable>
    </View>
  );
}

export function CallContactsScreen({ navigation }: RootScreenProps<'CallContacts'>) {
  const { contacts } = useContacts();

  const callEmergency = () => {
    if (!EMERGENCY_NUMBER) return Alert.alert('No number set', 'The emergency helpline number has not been set up yet.');
    Linking.openURL(`tel:${EMERGENCY_NUMBER}`);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <PageHeader title="Call Contacts" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.emergency} onPress={callEmergency} accessibilityRole="button">
          <View style={styles.emIcon}>
            <Ionicons name="call" size={22} color={colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.emTitle}>Emergency Helpline</Text>
            <Text style={styles.emSub}>Urgent Response (24/7)</Text>
          </View>
        </Pressable>

        <Text style={styles.label}>WHO WOULD YOU LIKE TO CALL?</Text>
        <View style={{ gap: 8 }}>
          {contacts.map((c) => (
            <Row key={c.id} c={c} />
          ))}
        </View>

        <Pressable onPress={() => navigation.navigate('AddContact')} accessibilityRole="button" style={{ alignSelf: 'center', padding: 8 }}>
          <Text style={styles.link}>Add a new contact</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20 },
  content: { paddingTop: 24, paddingBottom: 24, gap: 16 },
  label: { fontFamily: fonts.regular, fontSize: 12, color: colors.dark4 },
  emergency: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: '#fdecec', borderWidth: 1, borderColor: '#ef4444', borderRadius: radius.card },
  emIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#ef4444', alignItems: 'center', justifyContent: 'center' },
  emTitle: { fontFamily: fonts.semibold, fontSize: 16, color: '#c0141c' },
  emSub: { fontFamily: fonts.regular, fontSize: 12, color: '#e0343a' },
  card: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.chipBorder, borderRadius: radius.card },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.sage30, alignItems: 'center', justifyContent: 'center' },
  initials: { fontFamily: fonts.semibold, fontSize: 16, color: colors.navy70 },
  name: { fontFamily: fonts.regular, fontSize: 18, color: colors.dark8, letterSpacing: -0.3 },
  sub: { fontFamily: fonts.regular, fontSize: 12, color: colors.dark6 },
  msg: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.sage20, alignItems: 'center', justifyContent: 'center' },
  call: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#1f9d55', alignItems: 'center', justifyContent: 'center' },
  link: { fontFamily: fonts.regular, fontSize: 14, color: colors.navy70 },
});
