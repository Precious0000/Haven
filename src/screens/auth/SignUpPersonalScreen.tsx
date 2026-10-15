import React, { useState } from 'react';
import { Text, Alert } from 'react-native';
import { RootScreenProps } from '../../navigation/types';
import { StepScreen } from '../../components/StepScreen';
import { Input } from '../../components/Input';

export function SignUpPersonalScreen({ navigation }: RootScreenProps<'SignUpPersonal'>) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', password: '', confirm: '' });
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const next = () => {
    if (!form.name.trim() || !form.email.trim() || !form.password) return Alert.alert('Missing details', 'Name, email and password are required.');
    if (form.password !== form.confirm) return Alert.alert('Passwords do not match');
    // TODO: persist `form` (e.g. in a sign-up context/store) and submit after step 5.
    navigation.navigate('SignUpPersonalization');
  };

  return (
    <StepScreen
      step={1}
      title="Personal Information"
      subtitle="Fill out your personal details for record keeping"
      onBack={() => navigation.goBack()}
      ctaLabel="Save and Continue"
      onCta={next}
      footerLink={{ label: 'Already have an account? Sign in', onPress: () => navigation.navigate('SignIn') }}
    >
      <Input label="Full name" placeholder="Enter your full name" value={form.name} onChangeText={set('name')} />
      <Input label="Email address" placeholder="Enter your email address" value={form.email} onChangeText={set('email')} autoCapitalize="none" keyboardType="email-address" />
      <Input label="Phone number" placeholder="+234 000 000 000" value={form.phone} onChangeText={set('phone')} keyboardType="phone-pad" left={<Text>🇳🇬</Text>} />
      <Input label="Home address" placeholder="Enter your home address" value={form.address} onChangeText={set('address')} />
      <Input label="Password" placeholder="Enter your password" secure value={form.password} onChangeText={set('password')} autoCapitalize="none" />
      <Input label="Confirm Password" placeholder="Confirm your password" secure value={form.confirm} onChangeText={set('confirm')} autoCapitalize="none" />
    </StepScreen>
  );
}
