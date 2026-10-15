import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RootScreenProps } from '../../navigation/types';
import { StepScreen } from '../../components/StepScreen';
import { Card, SectionLabel } from '../../components/Card';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Button } from '../../components/Button';
import { colors, fonts } from '../../theme';

type Contact = { name: string; relationship: string; phone: string };
const RELATIONSHIPS = ['Son', 'Daughter', 'Spouse', 'Sibling', 'Friend', 'Neighbour', 'Other'];

export function SignUpFamilyScreen({ navigation }: RootScreenProps<'SignUpFamily'>) {
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [phone, setPhone] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);

  const add = () => {
    if (!name.trim() || !phone.trim()) return Alert.alert('Missing details', 'Enter a name and phone number.');
    setContacts((c) => [...c, { name: name.trim(), relationship: relationship || 'Other', phone: phone.trim() }]);
    setName('');
    setRelationship('');
    setPhone('');
  };

  return (
    <StepScreen
      step={4}
      title="Family & Contacts"
      subtitle="In case of emergency, they are the ones we'll reach out to first"
      onBack={() => navigation.goBack()}
      ctaLabel="Save and Continue"
      onCta={() => navigation.navigate('SignUpMedications')}
    >
      <View>
        <SectionLabel>ADD CONTACTS</SectionLabel>
        <Card>
          <Input label="Full name" placeholder="Enter full name" value={name} onChangeText={setName} />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Select containerStyle={{ width: 145 }} label="Relationship:" placeholder="Son" value={relationship} options={RELATIONSHIPS} onChange={setRelationship} />
            <Input containerStyle={{ flex: 1 }} label="Phone number" placeholder="Enter phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" left={<Text>🇳🇬</Text>} />
          </View>
          <Button title="Add contact" variant="outline" small onPress={add} />
        </Card>
      </View>

      {contacts.map((c, i) => (
        <Card key={`${c.phone}-${i}`} gap={2}>
          <Text style={styles.contactName}>{c.name}</Text>
          <Text style={styles.contactMeta}>{`${c.relationship} · ${c.phone}`}</Text>
        </Card>
      ))}

      <View style={styles.notice}>
        <Ionicons name="alert-circle-outline" size={16} color={colors.error7} />
        <Text style={styles.noticeText}>
          Your contacts will be first alerted in case emergency is detected. If they do not respond, a nearby emergency call number will be alerted.
        </Text>
      </View>
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  notice: { flexDirection: 'row', gap: 13, padding: 8, backgroundColor: colors.error1, borderWidth: 1, borderColor: colors.error7, borderRadius: 4 },
  noticeText: { flex: 1, fontFamily: fonts.regular, fontSize: 12, lineHeight: 14, color: colors.error7 },
  contactName: { fontFamily: fonts.semibold, fontSize: 14, color: colors.navy90 },
  contactMeta: { fontFamily: fonts.regular, fontSize: 12, color: colors.dark6 },
});
