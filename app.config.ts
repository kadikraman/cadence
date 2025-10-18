import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Cadence',
  slug: 'cadence',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  scheme: 'cadence',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    icon: './assets/cadence.icon',
    bundleIdentifier: 'dev.kadi.cadence',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
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
        image: './assets/icon-transparent.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#F8F9FA',
        dark: {
          backgroundColor: '#000000',
        },
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
