import { ImageSourcePropType } from 'react-native';

// Onboarding photos, two per slide. They were exported from Figma already tilted.
export const onboardingPhotos: ImageSourcePropType[][] = [
  [require('../../assets/Rectangle 4229.png'), require('../../assets/Rectangle 4230.png')],
  [require('../../assets/Rectangle 4231.png'), require('../../assets/Rectangle 4232.png')],
  [require('../../assets/Rectangle 4233.png'), require('../../assets/Rectangle 4234.png')],
];

/** Home screen avatar. */
export const avatar: ImageSourcePropType | null = require('../../assets/Ellipse 423.png');
