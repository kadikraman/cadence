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
- No code comments, with one exception: comments that pin a TypeScript declaration to its counterpart in another language (e.g. `utils/taskTints.ts` and `utils/glyphs.ts` flag the matching `targets/widget/*.swift` files). Without these notes, adding a new color or glyph will silently rot the iOS widget.
- Use `useCallback` and `useMemo` when appropriate
- PascalCase for component files, camelCase for utilities, hooks, and stores
- Keep components in separate files when >50 lines

## Patterns

- Handle loading and error states for async operations
- Use `useSafeAreaInsets` for screen boundaries
- Tests live alongside the file they test (e.g. `stores/taskReducers.test.ts`)

### Routing

- Expo Router typed routes are enabled (`experiments.typedRoutes: true` in `app.config.ts`). Renaming a route file generates a TypeScript error at every callsite.
- Don't pass literal route strings (`'/stats'`, `\`/task/${id}\``) to `router.push` / `router.replace`. Use `routes` from `lib/routes.ts`. Renames touch one file.
- Add new routes to `lib/routes.ts` when you add a new route file.
- For routes that build query strings dynamically (e.g. `EmptyStateStarters.buildStarterRoute`), it's fine to construct the full path locally; just keep the base path constant in sync with `lib/routes.ts`.

### Logs

- All structured log events go through helpers in `lib/logs.ts`. Don't call `AppMetrics.logEvent` directly from screens; add a typed helper. The catalog lives in one file so events are reviewable in PRs and attribute shapes are type-checked.
- Naming: `<surface>.<verb_in_past_tense>` (e.g. `task.completed`, `settings.export_completed`). Don't bake attribute values into the name; use the `attributes` map.
- Reserved: the `expo.` prefix is rejected by the SDK. Don't use it.
- **Privacy contract is enforced by the marketing-site policy** (`apps/marketing/app/privacy.tsx`). The policy promises that task names, contents, schedules, completion history, and settings stay on device. Per-event `attributes` therefore MUST NOT include: cadence type or value, color, glyph, days-since-last-completion, on-time/early flags, completion counts, task counts, theme mode, or any other settings value. Bare event firings (no attributes) are fine as aggregate counters.
- **Never log free-text user content.** No task titles, task details, feedback messages, or emails in `name`, `body`, or `attributes`.
- For caught errors, pass the `unknown` to the helper and let it derive a class-name `reason`. Don't pass `err.message` (it can wrap server output that includes user data).
- If you're tempted to add an attribute that the policy disallows, update the policy *first* (and call out the change in release notes per `privacy.tsx`'s "Changes to this policy" section), then add the attribute. Don't ship the data ahead of the policy.

### Widget payloads

Both home-screen widgets (iOS and Android) read JSON the app writes to platform storage. The producer and consumers must agree on field names, so all widget payload types live in `lib/widgetPayloads.ts`:

- `WidgetTaskPayload` and `WidgetStatsPayload` for the iOS widget (full shape).
- `WidgetTask` for the Android widget (subset; completed-today tasks are filtered out by the producer).

Rules:

- Don't redeclare these shapes inline in `WidgetContext.tsx` or `widgets/CadenceWidget.tsx`. Import from `lib/widgetPayloads.ts` so the producer-consumer contract lives in one place.
- The iOS Swift target (`targets/widget/`) has its own copy of these shapes. When you add or rename a field in `lib/widgetPayloads.ts`, update the Swift side too, otherwise the iOS widget reads stale data silently.

### List rows and memoization

Components rendered inside long lists (e.g. `TaskRow` inside `Home/Section`) must be `React.memo`'d, and their props must be reference-stable across the parent's re-renders. Otherwise tapping or expanding one row re-renders every row.

Rules for the list owner (the screen or hook that produces the items):

- Wrap every callback in `useCallback`. Keep dependency lists minimal so the references stay stable across renders.
- Bundle the callbacks into a single `useMemo`'d object (e.g. a `TaskRowCallbacks` shape) and pass that object as one prop. Don't pass an inline `{ ... }` literal or the row will re-render every time.
- The bundle should be threaded straight through any intermediate components (e.g. `Section`) without rebinding. Never write `() => callback(task.id)` at the section level; that defeats memoization.

Rules for the row component:

- Each callback in the bundle takes the item as its argument (e.g. `(task: Task) => void`), so the row can bind at the call site (`onPress={() => callbacks.onEdit(task)}`) without needing the parent to pre-bind. Closures created inside the memoized row are cheap; closures created in the parent break memoization.
- Wrap the component in `React.memo` (`export default memo(TaskRow)`).

Reference implementation: `screens/Home/useHomeContent.ts` (callbacks bundle) and `components/TaskRow/` (memoized row).

### Per-task stats

- All per-task stats computations that walk completion history go through `iterCompletionDeltas(task, sinceTs?)` from `utils/statsUtils.ts`. The generator handles sorting, the per-pair walk, the cadence comparison, and the binary `isLate` / three-way `status` classification.
- Don't re-implement the "sort, walk consecutive pairs, classify against cadence" loop locally. Compute functions (`computeOnTimePct`, `computeTaskStats`, `computeAvgLateDrift`, `computeMostReliable`) are short reductions over this generator and serve as reference implementations.
- The on-time threshold is `drift > cadDays * 0.1` (10% tolerance late). The three-way `DriftStatus` has the same tolerance applied symmetrically (`|drift| <= cadDays * 0.1` is on-time, drift below that band is early).
- Tests for these helpers live in `utils/statsUtils.test.ts`; they're pure and need no mocking.

### Stores

- Stores live in `apps/cadence/src/stores/` and use `zustand`.
- Persisted stores must keep their mutation logic as **pure reducers** in a separate `*Reducers.ts` file (e.g. `taskReducers.ts`). The store's `create()` callback wires reducers to state and persistence; it should not contain branching business logic.
- Inside `create((set, get) => ...)`, define a single helper that captures the "apply reducer → set → persist" pattern and reuse it for every mutation. See `stores/tasks.ts` (`apply`) and `stores/settings.ts` (`updateAndPersist`) for the canonical shapes.
- New mutations should go through the helper. Don't open-code `set({ ... })` followed by `await persist(...)` in the store body, or the persistence guarantee can drift method-by-method.
- Tests for the reducers live in `*Reducers.test.ts`. Because reducers are pure they need no AsyncStorage mocking.

### Theming

- Read colors and theme tokens directly from `useUnistyles()` (e.g. `theme.colors.text`, `theme.colors.label2`). Do not wrap unistyles in a custom context.
- Theme mode preference (`'light' | 'dark' | 'system'`) lives in `useSettingsStore`. Read `themeMode` and call `setThemeMode` directly from the store.
- The bridge between the settings store and the unistyles runtime lives in `app/_layout.tsx` as a single `useEffect` that watches `themeMode` and calls `applyThemeMode` from `unistyles.ts`. Don't call `applyThemeMode` from anywhere else.
- Detecting dark mode: `useUnistyles().rt.themeName === 'dark'`. Don't introduce a separate `isDark` helper or context.

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
- No `console.*` calls in app code. Pipe caught errors to Sentry (`Sentry.captureException(err)`). Deliberate logging in API routes (`src/app/*+api.ts`, where logs ARE the delivery mechanism, e.g. `feedback+api.ts`) is allowed; pair with a `TODO` comment if the log is a placeholder for a real delivery path.
- Remove unused imports
- Extract repeated patterns (3+ occurrences) into utility functions
- Date normalization must use `getTodayTimestamp()` or `normalizeToMidnight()` from `utils/taskUtils.ts`
- Task status determination must use `getTaskStatus()` from `utils/taskUtils.ts`
- Date formatting must use utilities from `utils/taskUtils.ts` (`formatDueIn`, `formatCompletionDate`, `formatLastCompleted`)
- The day-in-milliseconds constant (`MS_DAY = 86400000`) is exported from `utils/taskUtils.ts`. Never redeclare it locally or write a bare `86400000` literal; always import `MS_DAY`.
- For task bucketing into `overdue` / `today` / `thisWeek` / `later`, use `bucketizeTasks(tasks)` from `utils/taskUtils.ts`. It computes "today" once per call and walks the list a single time. Don't recreate the loop locally; the predicate functions (`isOverdue`, `isDueToday`, `isCompletedToday`) re-derive `getTodayTimestamp()` per call, so calling them in a tight loop is wasteful.
- `Task.completedDates` entries are always midnight timestamps. The `markCompleted` reducer normalizes inputs and dedupes same-day marks; `editCompletionDate` normalizes the new timestamp. Don't push raw `Date.now()` into `completedDates` from anywhere else.
- Each color in `utils/taskTints.ts` exposes `tint` / `tintDark` (background) and `accent` / `accentDark` (foreground). Pick the dark variants when `useUnistyles().rt.themeName === 'dark'`. For colors with vivid accents `accentDark === accent`; for dim ones (slate, charcoal, ink, navy, forest, etc.) the dark variant is hand-tuned to read against `tintDark`. The iOS widget's `TaskTileView` (in `targets/widget/widgets.swift`) does the same switch via `@Environment(\.colorScheme)`. Keep both sides in sync when adding a color.
