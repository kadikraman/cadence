# Cadence

React Native/Expo task management app using TypeScript.

## Commands

- `bun run start` - Start Expo dev server
- `bun run ios` - Run on iOS
- `bun run android` - Run on Android
- `bun run lint` - Run ESLint
- `bun run format` - Format with Prettier
- `npx expo install <package>` - Install packages (always use this, not bun add)

## Code Style

- TypeScript with strict typing
- Functional components with hooks only
- No code comments
- Use `expo-image` instead of `Image`
- Use `react-native-unistyles` for styling (not StyleSheet.create)
- Use `useCallback` and `useMemo` when appropriate
- PascalCase for component files, camelCase for utilities/hooks

## Folder Structure

```
src/
├── app/           # Expo Router pages
├── components/    # Shared components
├── screens/       # Screen components (returned from app/ routes)
├── hooks/         # Custom hooks
└── utils/         # Utility functions
```

## Patterns

- Keep components in separate files when >50 lines
- Handle loading and error states for async operations
- Use `useSafeAreaInsets` for screen boundaries
