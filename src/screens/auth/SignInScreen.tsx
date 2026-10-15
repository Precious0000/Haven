import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootScreenProps } from '../../navigation/types';
import { BackButton } from '../../components/BackButton';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Checkbox } from '../../components/Card';
import { Logo } from '../../components/Logo';
import { colors, fonts } from '../../theme';

export function SignInScreen({ navigation }: RootScreenProps<'SignIn'>) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [stay, setStay] = useState(false);

  const signIn = () => {
    if (!email.trim() || !password) return Alert.alert('Missing details', 'Enter your email and password.');
    // TODO: call your auth API here.
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.top}>
        <BackButton onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 0 }} />
        <Logo />
      </View>
      <View style={styles.titleBlock}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to continue care services</Text>
      </View>
      <View style={styles.form}>
        <Input label="Email address" placeholder="Enter your email address" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <Input label="Password" placeholder="Enter your password" secure value={password} onChangeText={setPassword} autoCapitalize="none" />
        <Checkbox label="Stay signed in" checked={stay} onChange={setStay} />
      </View>
      <View style={styles.actions}>
        <Button title="Sign In" onPress={signIn} />
        <Text style={styles.or}>OR CONNECT WITH</Text>
        <Button
          title="Bio-metrics Login"
          variant="outline"
          leftIcon={<Ionicons name="phone-portrait-outline" size={16} color={colors.navy70} />}
          // TODO: wire up expo-local-authentication.
          onPress={() => Alert.alert('Coming soon', 'Biometric login is not wired up yet.')}
        />
      </View>
      <View style={{ flex: 1 }} />
      <Button title="Sign up, if you don't have an account" variant="link" onPress={() => navigation.navigate('SignUpPersonal')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 20 },
  top: { height: 44, marginTop: 16, alignItems: 'center', justifyContent: 'center', paddingLeft: 0 },
  titleBlock: { alignItems: 'center', marginTop: 40, gap: 6 },
  title: { fontFamily: fonts.semibold, fontSize: 20, color: colors.dark12, letterSpacing: -0.6 },
  subtitle: { fontFamily: fonts.regular, fontSize: 14, color: colors.dark8, letterSpacing: -0.42 },
  form: { marginTop: 32, gap: 16 },
  actions: { marginTop: 80, gap: 24 },
  or: { fontFamily: fonts.regular, fontSize: 12, color: colors.dark4, textAlign: 'center', letterSpacing: -0.3 },
});
