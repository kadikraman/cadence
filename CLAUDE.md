# Cadence

Bun workspace monorepo for the Cadence task management app, built with React Native and Expo.

## Workspaces

- `apps/cadence` the iOS/Android app (Expo SDK 55, Expo Router, React Native 0.83)
- `apps/marketing` the marketing site (Expo Router for web)
- `packages/` reserved for shared code (currently empty)

Root scripts in `package.json` delegate into `apps/cadence` (via `bun run --cwd`), so day-to-day commands run from the repo root.

## Commands (run from the repo root)

- `bun run start` Start the cadence Expo dev server
- `bun run ios` Run cadence on iOS
- `bun run android` Run cadence on Android
- `bun run test` Run cadence tests (`bun test`)
- `bun run lint` Run ESLint on the cadence app
- `bun run marketing` Start the marketing site
- `bun run marketing:build` Export the marketing site for web
- `bun run format` Format with Prettier (whole repo)

Install packages with `npx expo install <package>` from inside the relevant workspace (`apps/cadence` or `apps/marketing`), not `bun add`, so versions stay aligned with the Expo SDK.

## Tech stack

- TypeScript with strict typing
- React 19, React Native 0.83, Expo SDK 55, Expo Router
- `react-native-unistyles` for styling (not `StyleSheet.create`)
- `expo-image` instead of `Image`
- `zustand` for state; stores live in `apps/cadence/src/stores/`
- Sentry for error reporting
- `@bacons/apple-targets` for the iOS widget; `react-native-android-widget` for the Android widget

## Folder Structure

```
apps/cadence/
├── src/
│   ├── app/         Expo Router pages
│   ├── screens/     Screen components rendered by app/ routes (folder per screen)
│   ├── components/  Shared UI components
│   ├── contexts/    React context providers (theme, widget)
│   ├── stores/      Zustand stores and reducers (with colocated tests)
│   ├── lib/         App-wide helpers and shared types
│   ├── utils/       Pure utilities (taskUtils, statsUtils, etc.)
│   └── widgets/     Android widget components
└── targets/widget/  iOS widget (Swift, via @bacons/apple-targets)

apps/marketing/
├── app/         Expo Router web pages
└── components/  Site components (Footer, Nav)
```

There is no `src/hooks/` directory; custom hooks (when needed) are colocated with the code that uses them.

## Code Style

- Functional components with hooks only
- No code comments
- Use `useCallback` and `useMemo` when appropriate
- PascalCase for component files, camelCase for utilities, hooks, and stores
- Keep components in separate files when >50 lines

## Patterns

- Handle loading and error states for async operations
- Use `useSafeAreaInsets` for screen boundaries
- Tests live alongside the file they test (e.g. `stores/taskReducers.test.ts`)

## Code Quality Rules

- Remove unused styles immediately, do not leave dead style definitions
- Never leave `console.log` statements in code
- Remove unused imports
- Extract repeated patterns (3+ occurrences) into utility functions
- Date normalization must use `getTodayTimestamp()` or `normalizeToMidnight()` from `utils/taskUtils.ts`
- Task status determination must use `getTaskStatus()` from `utils/taskUtils.ts`
- Date formatting must use utilities from `utils/taskUtils.ts` (`formatDueIn`, `formatCompletionDate`, `formatLastCompleted`)
