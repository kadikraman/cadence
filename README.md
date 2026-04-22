# Cadence

A task management app for iOS and Android, built with React Native and Expo.

Track recurring and one-off tasks, see your cadence over time, and glance at what's due from a home screen widget.

## Tech stack

- Expo SDK 55 with Expo Router (file-based routing)
- React Native 0.83 and React 19
- TypeScript
- [react-native-unistyles](https://www.unistyl.es/) for styling
- [@bacons/apple-targets](https://github.com/EvanBacon/expo-apple-targets) for the iOS widget
- [react-native-android-widget](https://github.com/sAleksovski/react-native-android-widget) for the Android widget
- Sentry for error reporting
- Bun as the package manager

## Getting started

Install dependencies:

```bash
bun install
```

Start the dev server:

```bash
bun run start
```

Run on a device or simulator:

```bash
bun run ios
bun run android
```

Installing new packages: use `npx expo install <package>` so versions stay aligned with the Expo SDK.

## Project layout

```
src/
├── app/           Expo Router pages
├── screens/       Screen components rendered by app/ routes
├── components/    Shared UI components
├── contexts/      React context providers (theme, etc.)
├── hooks/         Custom hooks
├── utils/         Pure utilities (date handling, task status, etc.)
├── widgets/       Android widget components
└── lib/           App-wide helpers
targets/widget/    iOS widget (Swift, via @bacons/apple-targets)
```

## Scripts

- `bun run start` start the Expo dev server
- `bun run ios` build and run on iOS
- `bun run android` build and run on Android
- `bun run lint` run ESLint
- `bun run format` format with Prettier
- `bun run prewidget` regenerate the iOS widget target

## Environment

The app reads `EXPO_PUBLIC_SENTRY_DSN` at build time. For local dev, put it in `.env.local` (gitignored). For EAS Build, also set `SENTRY_AUTH_TOKEN` as a project secret so source maps can upload on release builds.
