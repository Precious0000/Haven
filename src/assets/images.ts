import { ImageSourcePropType } from 'react-native';

// Onboarding photos, two per slide. They were exported from Figma already tilted.
export const onboardingPhotos: ImageSourcePropType[][] = [
  [require('../../assets/Rectangle_4229.png'), require('../../assets/Rectangle_4230.png')],
  [require('../../assets/Rectangle_4231.png'), require('../../assets/Rectangle_4232.png')],
  [require('../../assets/Rectangle_4233.png'), require('../../assets/Rectangle_4234.png')],
];

/** Home screen avatar. TODO: export it from Figma and add it to /assets. */
export const avatar: ImageSourcePropType | null = null;
