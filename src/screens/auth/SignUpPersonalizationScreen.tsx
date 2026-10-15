import React, { useState } from 'react';
import { View, Text, Pressable, Switch, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { RootScreenProps } from '../../navigation/types';
import { StepScreen } from '../../components/StepScreen';
import { Card, SectionLabel } from '../../components/Card';
import { Button } from '../../components/Button';
import { colors, fonts } from '../../theme';

const THEMES = [
  { name: 'Ivory', color: '#f9fbf9' },
  { name: 'Dusk', color: colors.navy100 },
  { name: 'Slate', color: '#0f0f13' },
  { name: 'Warm', color: '#fff9f2' },
];

function ToggleRow({ icon, title, body, value, onChange }: { icon: keyof typeof Ionicons.glyphMap; title: string; body: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={styles.toggleRow}>
      <Ionicons name={icon} size={24} color={colors.navy90} />
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowBody}>{body}</Text>
      </View>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: colors.sage80, false: '#d9d9d9' }} thumbColor={colors.white} />
    </View>
  );
}

export function SignUpPersonalizationScreen({ navigation }: RootScreenProps<'SignUpPersonalization'>) {
  const [theme, setTheme] = useState('Ivory');
  const [fontScale, setFontScale] = useState(0.2);
  const [voice, setVoice] = useState(false);
  const [haptics, setHaptics] = useState(false);

  return (
    <StepScreen
      step={2}
      title="Personalization"
      subtitle="Adjust the settings of your interface to your comfort"
      onBack={() => navigation.goBack()}
      ctaLabel="Save and Continue"
      onCta={() => navigation.navigate('SignUpHealth')}
    >
      <View>
        <SectionLabel>APPEARANCE</SectionLabel>
        <Card gap={12}>
          <View style={styles.titleRow}>
            <Ionicons name="contrast-outline" size={16} color={colors.navy90} />
            <Text style={styles.rowTitle}>App Theme</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 9 }}>
            {THEMES.map((t) => (
              <Pressable key={t.name} style={{ flex: 1, gap: 4 }} onPress={() => setTheme(t.name)}>
                <View style={[styles.swatch, { backgroundColor: t.color }, theme === t.name && { borderWidth: 1, borderColor: colors.sage80 }]} />
                <Text style={styles.rowBody}>{t.name}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.divider} />
          <View style={styles.titleRow}>
            <Ionicons name="text-outline" size={16} color={colors.navy90} />
            <Text style={styles.rowTitle}>Font Size</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <Text style={{ fontFamily: fonts.regular, fontSize: 10 }}>Aa</Text>
            <Text style={{ fontFamily: fonts.regular, fontSize: 16 }}>Aa</Text>
          </View>
          <Slider value={fontScale} onValueChange={setFontScale} minimumTrackTintColor={colors.navy70} maximumTrackTintColor="#f5f5f5" thumbTintColor={colors.navy70} />
        </Card>
      </View>

      <View>
        <SectionLabel>INTERACTION</SectionLabel>
        <Card>
          <ToggleRow icon="volume-high-outline" title="Voice Confirmation" body="The app will speak back to confirm your actions." value={voice} onChange={setVoice} />
          <View style={styles.divider} />
          <ToggleRow icon="hand-left-outline" title="Touch Vibration" body="Feel a gentle buzz when you press a button." value={haptics} onChange={setHaptics} />
        </Card>
      </View>

      <View>
        <SectionLabel>WEARABLE DEVICES</SectionLabel>
        <Card>
          <View style={styles.toggleRow}>
            <Ionicons name="watch-outline" size={24} color={colors.navy90} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.rowTitle}>Smart Watch</Text>
              <Text style={styles.rowBody}>Connect to your watch device</Text>
            </View>
            {/* TODO: pair with HealthKit / Health Connect. */}
            <Button title="Connect" variant="tonal" small style={{ width: 79 }} />
          </View>
        </Card>
      </View>
    </StepScreen>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rowTitle: { fontFamily: fonts.regular, fontSize: 14, color: colors.navy90, letterSpacing: -0.4 },
  rowBody: { fontFamily: fonts.regular, fontSize: 12, color: colors.dark4, letterSpacing: -0.36 },
  swatch: { height: 38, borderRadius: 4 },
  divider: { height: 1, backgroundColor: colors.cardBorder },
});
