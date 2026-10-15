# Haven – React Native (Expo) app

Native iOS/Android app built from the **Haven** section of the Figma file *Precious Work*
(node `779:102422`). Stack: Expo + TypeScript + React Navigation, DM Sans via `@expo-google-fonts`.

## Run it

```bash
npm install
npx expo install --fix     # aligns dependency versions with your Expo SDK
npx expo start             # press i (iOS simulator) or a (Android emulator), or scan with Expo Go
```

## Navigation

```
Splash → Onboarding (3 slides) ─┬─ Sign up → SignUpPersonal → Personalization → Health → Family → Medications ─┐
                                ├─ Sign in → SignIn ───────────────────────────────────────────────────────────┤
                                                                                                                ▼
                                                    Main (floating tabs: Home | Health | Family | Settings) → VoiceAssistant
```

Quick actions on Home and unbuilt tabs open a `ComingSoon` placeholder so nothing dead-ends.

## Implemented screens (Figma frame → file)

| Figma frame | File |
|---|---|
| iPhone 17 – 1 / 33 / 34 (splash) | `src/screens/auth/SplashScreen.tsx` |
| iPhone 17 – 2, 3, 4 (onboarding) | `src/screens/auth/OnboardingScreen.tsx` |
| iPhone 17 – 5 (sign-up 1/5) | `SignUpPersonalScreen.tsx` |
| iPhone 17 – 6 (sign-up 2/5) | `SignUpPersonalizationScreen.tsx` |
| iPhone 17 – 7 (sign-up 3/5) | `SignUpHealthScreen.tsx` |
| iPhone 17 – 8 (sign-up 4/5) | `SignUpFamilyScreen.tsx` |
| iPhone 17 – 9 (sign-up 5/5) | `SignUpMedicationsScreen.tsx` |
| iPhone 17 – 11 (sign in) | `SignInScreen.tsx` |
| iPhone 17 – 10 (home) | `src/screens/main/HomeScreen.tsx` |
| iPhone 17 – 12, 13 (voice assistant) | `src/screens/main/VoiceAssistantScreen.tsx` |

## Not implemented yet (Figma node ids)

`535:59193` (14), `535:59344` (15), `545:41222` (18), `537:59617` (16), `538:59868` (17),
`546:41415` (20), `547:62511` (21), `547:62698` (22), `547:62835` (23), `557:63697` (25),
`560:39252` (26), `563:42630` (family-and-contacts), `565:39617` (28), `567:39724` (29),
`771:82346` (38), `570:40426` (Component 150).
Add each as a screen, register it in `src/navigation/RootNavigator.tsx` (or the tabs), and add its route to `types.ts`.

## Known gaps / TODOs

- **Images**: onboarding photos and the home avatar are placeholders. Export them from Figma into `assets/` and fill in `src/assets/images.ts`. The logo is text (`Logo.tsx`) until the real asset is exported.
- **Icons** use `@expo/vector-icons` (Ionicons) instead of the Iconly set used in Figma.
- Sample data (Linda, weather, medications) comes from the design and is hard-coded.
- Auth, sign-up submission, biometrics, speech recognition, wearables and reminders are stubbed with `TODO` comments.
- Light theme only; the theme/font-size choices on the personalization step aren't applied app-wide yet.
