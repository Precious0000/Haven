import React, { useState } from 'react';
import { View, Text, Image, ScrollView, Alert, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootScreenProps } from '../../navigation/types';
import { PageHeader } from '../../components/SettingsUI';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useSettings } from '../../settings';
import { avatar } from '../../assets/images';
import { colors, fonts } from '../../theme';

export function EditProfileScreen({ navigation }: RootScreenProps<'EditProfile'>) {
  const { settings, update } = useSettings();
  const [name, setName] = useState(settings.name);
  const [email, setEmail] = useState(settings.email);
  const [phone, setPhone] = useState(settings.phone);
  const [address, setAddress] = useState(settings.address);

  const save = () => {
    if (!name.trim() || !email.trim()) return Alert.alert('Missing details', 'Name and email are required.');
    // TODO: also save the profile to your backend.
    update({ name: name.trim(), email: email.trim(), phone: phone.trim(), address: address.trim() });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <PageHeader title="Edit Profile" onBack={() => navigation.goBack()} />
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={{ alignItems: 'center', gap: 8 }}>
            {avatar ? <Image source={avatar} style={styles.avatar} /> : <View style={[styles.avatar, { backgroundColor: colors.sage30 }]} />}
            {/* TODO: let the user pick a new photo (expo-image-picker). */}
            <Text style={styles.change}>Change photo</Text>
          </View>
          <Input label="Full name" placeholder="Enter your full name" value={name} onChangeText={setName} />
          <Input label="Email address" placeholder="Enter your email address" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
          <Input label="Phone number" placeholder="+234 000 000 000" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <Input label="Home address" placeholder="Enter your home address" value={address} onChangeText={setAddress} />
        </ScrollView>
        <Button title="Save changes" onPress={save} style={{ marginBottom: 12 }} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20 },
  content: { paddingTop: 24, paddingBottom: 16, gap: 16 },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  change: { fontFamily: fonts.regular, fontSize: 12, color: '#3b82f6' },
});
