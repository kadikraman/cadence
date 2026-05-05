# Cadence

A task management app for iOS and Android, built with React Native and Expo.

Track recurring and one-off tasks, see your cadence over time, and glance at what's due from a home screen widget.

## Repo layout

This is a Bun workspace monorepo:

- `apps/cadence` the iOS/Android app
- `apps/marketing` the marketing site (Expo Router web export)
- `packages/` reserved for shared code (currently empty)

## Tech stack

- Expo SDK 55 with Expo Router (file-based routing)
- React Native 0.83 and React 19
- TypeScript
- [react-native-unistyles](https://www.unistyl.es/) for styling
- [zustand](https://github.com/pmndrs/zustand) for state management
- [@bacons/apple-targets](https://github.com/EvanBacon/expo-apple-targets) for the iOS widget
- [react-native-android-widget](https://github.com/sAleksovski/react-native-android-widget) for the Android widget
- Sentry for error reporting
- Bun as the package manager

## Getting started

Install dependencies (from the repo root):

```bash
bun install
```

Start the cadence dev server:

```bash
bun run start
```

Run on a device or simulator:

```bash
bun run ios
bun run android
```

Run the marketing site:

```bash
bun run marketing
```

Installing new packages: `cd` into the relevant workspace and use `npx expo install <package>` so versions stay aligned with the Expo SDK.

## Project layout

```
apps/cadence/
├── src/
│   ├── app/         Expo Router pages
│   ├── screens/     Screen components rendered by app/ routes
│   ├── components/  Shared UI components
│   ├── contexts/    React context providers (theme, widget)
│   ├── stores/      Zustand stores and reducers
│   ├── lib/         App-wide helpers and shared types
│   ├── utils/       Pure utilities (date handling, task status, etc.)
│   └── widgets/     Android widget components
└── targets/widget/  iOS widget (Swift, via @bacons/apple-targets)

apps/marketing/
├── app/         Expo Router web pages
└── components/  Site components
```

## Scripts (from the repo root)

- `bun run start` start the cadence Expo dev server
- `bun run ios` build and run cadence on iOS
- `bun run android` build and run cadence on Android
- `bun run test` run cadence tests
- `bun run lint` run ESLint on cadence
- `bun run marketing` start the marketing site
- `bun run marketing:build` export the marketing site for web
- `bun run format` format the repo with Prettier
- `bun run --cwd apps/cadence prewidget` regenerate the iOS widget target

## Environment

The cadence app reads `EXPO_PUBLIC_SENTRY_DSN` at build time. For local dev, put it in `apps/cadence/.env.local` (gitignored). For EAS Build, also set `SENTRY_AUTH_TOKEN` as a project secret so source maps can upload on release builds.
