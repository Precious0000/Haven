import React, { useState } from 'react';
import { View, Text, Alert, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootScreenProps } from '../../navigation/types';
import { BackButton } from '../../components/BackButton';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { RELATIONSHIPS, useContacts } from '../../contacts';
import { colors, fonts } from '../../theme';

function NigeriaFlag() {
  return (
    <View style={{ flexDirection: 'row', width: 20, height: 14 }}>
      <View style={{ flex: 1, backgroundColor: '#0a6b3c' }} />
      <View style={{ flex: 1, backgroundColor: '#ffffff' }} />
      <View style={{ flex: 1, backgroundColor: '#0a6b3c' }} />
    </View>
  );
}

export function AddContactScreen({ navigation }: RootScreenProps<'AddContact'>) {
  const { addContact } = useContacts();
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [phone, setPhone] = useState('');

  const save = () => {
    if (!name.trim() || !phone.trim()) return Alert.alert('Missing details', 'Enter a name and phone number.');
    // TODO: also save this contact to your backend.
    addContact({ name: name.trim(), role: relationship || 'Other', phone: phone.trim() });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 0 }} />
          <Text style={styles.title}>Family & Contacts</Text>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 32, gap: 16 }} keyboardShouldPersistTaps="handled">
          <View>
            <Text style={styles.sectionLabel}>ADD CONTACTS</Text>
            <View style={styles.card}>
              <Input label="Full name" placeholder="Enter full name" value={name} onChangeText={setName} />
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Select containerStyle={{ width: 147 }} label="Relationship:" placeholder="Son" value={relationship} options={RELATIONSHIPS} onChange={setRelationship} />
                <Input containerStyle={{ flex: 1 }} label="Phone number" placeholder="Enter phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" left={<NigeriaFlag />} />
              </View>
            </View>
          </View>

          <View style={styles.notice}>
            <Ionicons name="alert-circle-outline" size={16} color={colors.error7} />
            <Text style={styles.noticeText}>
              Your contacts will be first alerted in case emergency is detected. If they do not respond, a nearby emergency call number will be alerted.
            </Text>
          </View>
        </ScrollView>

        <Button title="Add contact" onPress={save} style={{ marginBottom: 12 }} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20 },
  header: { height: 44, marginTop: 16, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.semibold, fontSize: 20, color: colors.dark12, letterSpacing: -0.5 },
  sectionLabel: { fontFamily: fonts.regular, fontSize: 12, color: colors.dark4, marginBottom: 8 },
  card: { backgroundColor: colors.white, borderRadius: 8, padding: 10, gap: 12 },
  notice: { flexDirection: 'row', gap: 10, padding: 8, backgroundColor: colors.error1, borderWidth: 1, borderColor: colors.error7, borderRadius: 4 },
  noticeText: { flex: 1, fontFamily: fonts.regular, fontSize: 12, lineHeight: 14, color: colors.error7 },
});
