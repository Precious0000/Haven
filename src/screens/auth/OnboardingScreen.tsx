import React, { useRef, useState } from 'react';
import { View, Text, FlatList, Pressable, Image, StyleSheet, useWindowDimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RootScreenProps } from '../../navigation/types';
import { Button } from '../../components/Button';
import { colors, fonts } from '../../theme';
import { onboardingPhotos } from '../../assets/images';

const DESIGN_W = 402;

// Position and size of each (already tilted) photo in the 402pt-wide Figma frame.
type Box = { left: number; top: number; w: number; h: number };

const SLIDES: { title: string; body: string; photos: [Box, Box] }[] = [
  {
    title: 'Care that stays with you',
    body: 'Your personal care companion, helping you stay connected, supported, and confident every day.',
    photos: [
      { left: 20, top: 111, w: 242, h: 261 },
      { left: 112, top: 188, w: 269, h: 283 },
    ],
  },
  {
    title: 'Your safety is always within reach',
    body: 'From daily check-ins to fall detection and emergency support, Haven helps you get assistance when you need it.',
    photos: [
      { left: 20, top: 176, w: 242, h: 261 },
      { left: 145, top: 83, w: 241, h: 259 },
    ],
  },
  {
    title: 'Care connects everyone',
    body: 'Haven keeps you and your trusted family members connected, so they can stay informed without taking away your independence.',
    photos: [
      { left: 20, top: 125, w: 251, h: 268 },
      { left: 120, top: 125, w: 269, h: 283 },
    ],
  },
];

function PhotoArea({ slideIndex, width }: { slideIndex: number; width: number }) {
  const [h, setH] = useState(0);
  const boxes = SLIDES[slideIndex].photos;
  const top = Math.min(...boxes.map((b) => b.top));
  const bottom = Math.max(...boxes.map((b) => b.top + b.h));
  const groupH = bottom - top;
  const groupCy = (top + bottom) / 2;
  const k = h > 0 ? Math.min(1, (h - 8) / groupH) : 1; // shrink the photos when space is tight

  return (
    <View style={{ flex: 1, minHeight: 160 }} onLayout={(e) => setH(e.nativeEvent.layout.height)}>
      {h > 0 &&
        boxes.map((b, i) => {
          const cx = width / 2 + (b.left + b.w / 2 - DESIGN_W / 2) * k;
          const cy = h / 2 + (b.top + b.h / 2 - groupCy) * k;
          return (
            <Image
              key={i}
              source={onboardingPhotos[slideIndex][i]}
              resizeMode="contain"
              style={{ position: 'absolute', width: b.w * k, height: b.h * k, left: cx - (b.w * k) / 2, top: cy - (b.h * k) / 2 }}
            />
          );
        })}
    </View>
  );
}

export function OnboardingScreen({ navigation }: RootScreenProps<'Onboarding'>) {
  const { width: windowWidth } = useWindowDimensions();
  const width = Math.min(windowWidth, 430);
  const listRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);
  const [listH, setListH] = useState(0);
  const last = index === SLIDES.length - 1;

  const goTo = (i: number) => {
    listRef.current?.scrollToIndex({ index: i, animated: true });
    setIndex(i);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <FlatList
        ref={listRef}
        style={{ flex: 1 }}
        onLayout={(e) => setListH(e.nativeEvent.layout.height)}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(s) => s.title}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        renderItem={({ item, index: i }) => (
         <View style={{ width, height: listH, paddingTop: 16 }}>
            <PhotoArea slideIndex={i} width={width} />
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
          <View style={[styles.row, { justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, height: 100 }]}>
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
  dots: { flexDirection: 'row', gap: 4, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  dot: { width: 6, height: 6, borderRadius: 10, backgroundColor: colors.sage30 },
  dotActive: { width: 42, backgroundColor: colors.sage80 },
  title: { fontFamily: fonts.semibold, fontSize: 24, lineHeight: 28, color: colors.dark12, letterSpacing: -0.72, textAlign: 'center', marginTop: 24, paddingHorizontal: 16 },
  body: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 20, color: colors.dark8, letterSpacing: -0.48, textAlign: 'center', marginTop: 10, paddingHorizontal: 40 },
  footer: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, gap: 8 },
  row: { flexDirection: 'row', gap: 20 },
  skip: { fontFamily: fonts.regular, fontSize: 14, color: colors.sage100, letterSpacing: -0.42 },
  nextOuter: { borderWidth: 1, borderColor: colors.navy60, borderRadius: 100, padding: 2 },
  nextInner: { backgroundColor: colors.navy70, borderRadius: 100, padding: 6 },
});
