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

### Platform-divergent UI

iOS is the default. The bare `Foo.tsx` file is the iOS implementation. Android only gets its own `Foo.android.tsx` when the layout diverges substantially (more than ~20 lines of divergent JSX). Do NOT branch with `if (Platform.OS === 'android')` inside a single component once the divergence crosses that threshold; use the file split instead. Metro picks `Foo.android.tsx` on Android automatically and falls back to `Foo.tsx` everywhere else.

Recommended folder shape for a platform-divergent component:

```
components/Foo/
├── index.tsx               iOS implementation (default)
├── index.android.tsx       Android implementation (only if it diverges)
├── types.ts                shared props and prop types
├── useFooVisuals.ts        shared logic (status, colors, labels)
└── SharedSubview.tsx       any sub-view used by both platforms
```

If the component does NOT diverge, keep it as a single file (`Foo.tsx` or `Foo/index.tsx`). Don't preemptively create empty `.android.tsx` files.

Rules:

- Both `index.tsx` and `index.android.tsx` must `export type { ... } from './types'` so consumers can import types via the public path.
- Put shared status/color/label derivation in a colocated hook (`useFooVisuals.ts`). Never duplicate the logic across the two platform files.
- Pull any sub-view used by both platforms into its own file in the folder (e.g. `ExpandedBar.tsx`).
- Single-file `if (Platform.OS === ...)` branches are still fine for trivial divergences (one icon swap, one `paddingTop`). Reach for the file split when you start writing a second JSX tree.

Reference implementation: `components/TaskRow/`.

The same convention applies to screens. A platform-divergent screen lives at:

```
screens/Foo/
├── index.tsx           iOS implementation (default)
├── index.android.tsx   Android implementation (only if it diverges)
├── useFoo.ts           shared state and side effects (called by both platform files)
├── helpers.ts          shared pure helpers and option lists (when worth extracting)
└── SubView.tsx         shared sub-views used by both platforms
```

Screen-specific rules:

- The shared state hook (`useFoo.ts`) owns: `useRouter`, store reads, `useState`, async handlers (`save`, `submit`, etc.), and any derived data computed via `useMemo`. Each platform file should be presentation only.
- Per-platform constants (e.g. label arrays where copy or icon set differs) live in their respective platform file, not the shared hook.
- Trivial single-property platform divergences inside a shared file may use `Platform.select({ android: X, default: Y })` instead of forcing a file split.

Reference implementations: `screens/Settings/`, `screens/TaskForm/`, `screens/Home/`.

## Code Quality Rules

- Remove unused styles immediately, do not leave dead style definitions
- Never leave `console.log` statements in code
- Remove unused imports
- Extract repeated patterns (3+ occurrences) into utility functions
- Date normalization must use `getTodayTimestamp()` or `normalizeToMidnight()` from `utils/taskUtils.ts`
- Task status determination must use `getTaskStatus()` from `utils/taskUtils.ts`
- Date formatting must use utilities from `utils/taskUtils.ts` (`formatDueIn`, `formatCompletionDate`, `formatLastCompleted`)
