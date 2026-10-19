import React from 'react';
import { View, Text, Pressable, ScrollView, Linking, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { Contact, useContacts } from '../../contacts';
import { colors, fonts, radius } from '../../theme';

type Props = CompositeScreenProps<BottomTabScreenProps<MainTabParamList, 'Family'>, NativeStackScreenProps<RootStackParamList>>;

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

function RoundButton({ icon, label, onPress, style, iconColor }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void; style?: object; iconColor?: string }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={[styles.round, style]}>
      <Ionicons name={icon} size={18} color={iconColor ?? colors.navy70} />
    </Pressable>
  );
}

function ContactCard({ c }: { c: Contact }) {
  return (
    <View style={styles.card}>
      {/* TODO: show the contact's photo instead of initials once the images are added. */}
      <View style={styles.avatar}>
        <Text style={styles.initials}>{initials(c.name)}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{c.name}</Text>
        <Text style={styles.sub}>{`${c.role} · ${c.phone}`}</Text>
      </View>
      <RoundButton icon="chatbubble-ellipses-outline" label={`Message ${c.name}`} onPress={() => Linking.openURL(`sms:${clean(c.phone)}`)} />
      <RoundButton icon="call-outline" label={`Call ${c.name}`} onPress={() => Linking.openURL(`tel:${clean(c.phone)}`)} />
    </View>
  );
}

export function FamilyScreen({ navigation }: Props) {
  const { contacts } = useContacts();
  const family = contacts.filter((c) => c.group === 'family');
  const care = contacts.filter((c) => c.group === 'care');

  const callEmergency = () => {
    if (!EMERGENCY_NUMBER) return Alert.alert('No number set', 'The emergency helpline number has not been set up yet.');
    Linking.openURL(`tel:${EMERGENCY_NUMBER}`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Family & Contacts</Text>

        <Text style={styles.section}>Family Members</Text>
        <View style={{ gap: 8 }}>
          {family.map((c) => (
            <ContactCard key={c.id} c={c} />
          ))}
        </View>

        <Text style={[styles.section, { marginTop: 12 }]}>Care & Medical Support</Text>
        <View style={{ gap: 8 }}>
          {care.map((c) => (
            <ContactCard key={c.id} c={c} />
          ))}
        </View>

        <View style={styles.emergency}>
          <View style={styles.cross}>
            <Ionicons name="medical" size={24} color="#e0343a" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.emTitle}>Emergency Helpline</Text>
            <Text style={styles.emSub}>Urgent Response (24/7)</Text>
          </View>
          <Pressable onPress={callEmergency} accessibilityRole="button" accessibilityLabel="Call emergency helpline" style={styles.emCall}>
            <Ionicons name="call" size={18} color={colors.white} />
          </Pressable>
        </View>

        <Button title="Add new contact" style={{ marginTop: 8 }} onPress={() => navigation.navigate('AddContact')} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 150, gap: 12 },
  title: { fontFamily: fonts.semibold, fontSize: 20, color: colors.dark12, textAlign: 'center', letterSpacing: -0.5, marginBottom: 12 },
  section: { fontFamily: fonts.semibold, fontSize: 16, color: colors.navy70, letterSpacing: -0.3 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.chipBorder, borderRadius: radius.card },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.sage30, alignItems: 'center', justifyContent: 'center', marginRight: 4 },
  initials: { fontFamily: fonts.semibold, fontSize: 16, color: colors.navy70 },
  name: { fontFamily: fonts.regular, fontSize: 16, color: colors.dark8, letterSpacing: -0.3 },
  sub: { fontFamily: fonts.regular, fontSize: 11, color: colors.dark6 },
  round: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.sage20, alignItems: 'center', justifyContent: 'center' },
  emergency: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 10, marginTop: 12, backgroundColor: '#fdecec', borderWidth: 1, borderColor: '#ef4444', borderRadius: radius.card },
  cross: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#f6e4e4', alignItems: 'center', justifyContent: 'center' },
  emTitle: { fontFamily: fonts.semibold, fontSize: 16, color: '#c0141c' },
  emSub: { fontFamily: fonts.regular, fontSize: 12, color: '#e0343a' },
  emCall: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#ef4444', alignItems: 'center', justifyContent: 'center' },
});
