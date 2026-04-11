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
    supportsTablet: true,
    icon: './assets/cadence.icon',
    bundleIdentifier: 'dev.kadi.cadence',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
    entitlements: {
      'com.apple.security.application-groups': ['group.dev.kadi.cadence'],
    },
    appleTeamId: 'XQAX5LF48P',
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: 'dev.kadi.cadence',
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#FFFFFF',
        dark: {
          image: './assets/icon-dark.png',
          backgroundColor: '#000000',
        },
      },
    ],
    '@bacons/apple-targets',
    'react-native-edge-to-edge',
    '@react-native-community/datetimepicker',
    'expo-image',
    'expo-font',
    'expo-web-browser',
    [
      'react-native-android-widget',
      {
        widgets: [
          {
            name: 'CadenceWidget',
            label: 'Cadence Tasks',
            description: 'View your upcoming tasks',
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
