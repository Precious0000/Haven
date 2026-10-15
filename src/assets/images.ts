import { ImageSourcePropType } from 'react-native';

/**
 * TODO: export these images from Figma into /assets and replace `null` with require(...).
 * Until then, screens render a neutral placeholder.
 *
 * Onboarding photos, two per slide (Figma frames 453:37687, 453:37882, 453:37914:
 * nodes "Rectangle 4229" and "Rectangle 4230" in each frame).
 * Example: require('../../assets/onboarding-1a.png')
 */
export const onboardingPhotos: (ImageSourcePropType | null)[][] = [
  [null, null],
  [null, null],
  [null, null],
];

/** Home screen avatar (Figma frame 477:37962). */
export const avatar: ImageSourcePropType | null = null;
