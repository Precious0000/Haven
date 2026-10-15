import React, { useRef, useState } from 'react';
import { View, Text, FlatList, Pressable, Image, StyleSheet, useWindowDimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootScreenProps } from '../../navigation/types';
import { Button } from '../../components/Button';
import { colors, fonts } from '../../theme';
import { onboardingPhotos } from '../../assets/images';

const CARD_W = 204;
const CARD_H = 227;

type Photo = { cx: number; cy: number; rotate: number };

// Photo-card centres/rotations (in the 402pt-wide Figma frame).
const SLIDES: { title: string; body: string; photos: [Photo, Photo] }[] = [
  {
    title: 'Care that stays with you',
    body: 'Your personal care companion, helping you stay connected, supported, and confident every day.',
    photos: [
      { cx: 141, cy: 241, rotate: -10.63 },
      { cx: 246, cy: 329, rotate: 19.78 },
    ],
  },
  {
    title: 'Your safety is always within reach',
    body: 'From daily check-ins to fall detection and emergency support, Haven helps you get assistance when you need it.',
    photos: [
      { cx: 141, cy: 306, rotate: -10.63 },
      { cx: 265, cy: 213, rotate: 10.09 },
    ],
  },
  {
    title: 'Care connects everyone',
    body: 'Haven keeps you and your trusted family members connected, so they can stay informed without taking away your independence.',
    photos: [
      { cx: 145, cy: 259, rotate: -13.28 },
      { cx: 254, cy: 266, rotate: 19.78 },
    ],
  },
];

export function OnboardingScreen({ navigation }: RootScreenProps<'Onboarding'>) {
  const { width } = useWindowDimensions();
  const scale = width / 402;
  const listRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);
  const last = index === SLIDES.length - 1;

  const goTo = (i: number) => {
    listRef.current?.scrollToIndex({ index: i, animated: true });
    setIndex(i);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(s) => s.title}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        renderItem={({ item, index: i }) => (
          <View style={{ width }}>
            <View style={{ height: 470 }}>
              {item.photos.map((p, k) => {
                const src = onboardingPhotos[i]?.[k];
                return (
                  <View
                    key={k}
                    style={[
                      styles.photo,
                      {
                        left: p.cx * scale - CARD_W / 2,
                        top: p.cy - CARD_H / 2 - 44,
                        transform: [{ rotate: `${p.rotate}deg` }],
                      },
                    ]}
                  >
                    {src ? <Image source={src} style={styles.photoImg} /> : <View style={[styles.photoImg, { backgroundColor: colors.sage30 }]} />}
                  </View>
                );
              })}
            </View>
            <View style={styles.dots}>
              {SLIDES.map((_, d) => (
                <View key={d} style={[styles.dot, d === i && styles.dotActive]} />
              ))}
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.body}</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        {last ? (
          <>
            <View style={styles.row}>
              <Button title="Sign up" style={{ flex: 1 }} onPress={() => navigation.navigate('SignUpPersonal')} />
              <Button title="Sign in" variant="outline" style={{ flex: 1 }} onPress={() => navigation.navigate('SignIn')} />
            </View>
            <Button
              title="Are you a professional caregiver?"
              variant="link"
              rightIcon={<Ionicons name="chevron-forward" size={16} color={colors.navy70} />}
              // TODO: caregiver flow isn't in the Figma section yet.
              onPress={() => Alert.alert('Coming soon', 'The professional caregiver flow is not designed yet.')}
            />
          </>
        ) : (
          <View style={[styles.row, { justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12 }]}>
            <Pressable onPress={() => goTo(SLIDES.length - 1)} hitSlop={12}>
              <Text style={styles.skip}>Skip</Text>
            </Pressable>
            <Pressable onPress={() => goTo(index + 1)} accessibilityLabel="Next" style={styles.nextOuter}>
              <View style={styles.nextInner}>
                <Ionicons name="arrow-forward" size={16} color={colors.white} />
              </View>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  photo: {
    position: 'absolute',
    width: CARD_W,
    height: CARD_H,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.white,
    overflow: 'hidden',
  },
  photoImg: { width: '100%', height: '100%' },
  dots: { flexDirection: 'row', gap: 4, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 6, height: 6, borderRadius: 10, backgroundColor: colors.sage30 },
  dotActive: { width: 42, backgroundColor: colors.sage80 },
  title: { fontFamily: fonts.semibold, fontSize: 24, lineHeight: 28, color: colors.dark12, letterSpacing: -0.72, textAlign: 'center', marginTop: 48, paddingHorizontal: 16 },
  body: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 20, color: colors.dark8, letterSpacing: -0.48, textAlign: 'center', marginTop: 13, paddingHorizontal: 52 },
  footer: { position: 'absolute', left: 20, right: 20, bottom: 36, gap: 8 },
  row: { flexDirection: 'row', gap: 20 },
  skip: { fontFamily: fonts.regular, fontSize: 14, color: colors.sage100, letterSpacing: -0.42 },
  nextOuter: { borderWidth: 1, borderColor: colors.navy60, borderRadius: 100, padding: 2 },
  nextInner: { backgroundColor: colors.navy70, borderRadius: 100, padding: 6 },
});
