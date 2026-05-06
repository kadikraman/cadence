/**
 * Centralized route helpers. Always import from here instead of writing
 * literal route strings at the call site, so a route rename only touches
 * this file.
 *
 * Expo Router's typed routes (`experiments.typedRoutes` in app.config.ts)
 * type-checks these values against the actual file tree at build time.
 */

export const routes = {
  home: '/',
  newTask: '/new',
  stats: '/stats',
  settings: '/settings',
  feedback: '/feedback',
  onboarding: '/onboarding',
  taskDetail: (taskId: string) => `/task/${taskId}` as const,
  editTask: (taskId: string) => `/new?taskId=${taskId}` as const,
} as const;
