import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Cadence',
  slug: 'cadence',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  scheme: 'cadence',
  userInterfaceStyle: 'automatic',
  ios: {
    supportsTablet: false,
    icon: {
      light: './assets/icon.png',
      dark: './assets/icon-dark.png',
      tinted: './assets/icon-tinted.png',
    },
    bundleIdentifier: 'dev.kadi.cadence',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
    entitlements: {
      'com.apple.security.application-groups': ['group.dev.kadi.cadence'],
    },
    appleTeamId: 'XQAX5LF48P',
    appStoreUrl: 'https://apps.apple.com/app/id6754192837',
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#F7F9FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
    package: 'dev.kadi.cadence',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=dev.kadi.cadence',
  },
  web: {
    output: 'server',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/icon-transparent.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#F7F9FE',
        dark: {
          image: './assets/icon-dark-transparent.png',
          backgroundColor: '#040A1F',
        },
      },
    ],
    '@bacons/apple-targets',
    'react-native-edge-to-edge',
    '@react-native-community/datetimepicker',
    'expo-image',
    'expo-font',
    'expo-web-browser',
    'expo-sharing',
    [
      '@sentry/react-native',
      {
        organization: 'kadi-org',
        project: 'cadence',
      },
    ],
    [
      'react-native-android-widget',
      {
        widgets: [
          {
            name: 'CadenceWidget',
            label: 'Cadence Tasks',
            description: 'View your upcoming tasks. Resize for a compact tile, a three-row list, or a full overview.',
            minWidth: '110dp',
            minHeight: '110dp',
            targetCellWidth: 2,
            targetCellHeight: 2,
            maxResizeWidth: '400dp',
            maxResizeHeight: '400dp',
            resizeMode: 'horizontal|vertical',
          },
        ],
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    eas: {
      projectId: 'd2bef239-3212-4e73-b7ba-dc29e7272621',
    },
  },
};

export default config;
