import { SymbolView } from 'expo-symbols';
import { Platform, Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSettingsStore } from '../stores/settings';

const IS_ANDROID = Platform.OS === 'android';

interface WidgetNudgeProps {
  onLearnMore: () => void;
}

export default function WidgetNudge({ onLearnMore }: WidgetNudgeProps) {
  const { theme } = useUnistyles();
  const dismissed = useSettingsStore(s => s.widgetNudgeDismissed);
  const dismissNudge = useSettingsStore(s => s.dismissWidgetNudge);

  if (dismissed) return null;

  if (IS_ANDROID) {
    return (
      <View
        style={[
          styles.androidContainer,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.outlineVariant,
          },
        ]}
      >
        <View
          style={[
            styles.androidIconWrap,
            { backgroundColor: theme.colors.primaryContainer },
          ]}
        >
          <MaterialCommunityIcons
            name="apps"
            size={22}
            color={theme.colors.onPrimaryContainer}
          />
        </View>
        <View style={styles.body}>
          <Text style={[styles.androidTitle, { color: theme.colors.text }]}>
            Add the widget
          </Text>
          <Text
            style={[styles.androidSubtitle, { color: theme.colors.label2 }]}
          >
            See what&apos;s due without opening the app.
          </Text>
        </View>
        <Pressable
          onPress={onLearnMore}
          android_ripple={{
            color: 'rgba(255,255,255,0.20)',
            borderless: false,
          }}
          style={[styles.androidCta, { backgroundColor: theme.colors.primary }]}
        >
          <Text
            style={[styles.androidCtaText, { color: theme.colors.onPrimary }]}
          >
            Show me
          </Text>
        </Pressable>
        <Pressable
          onPress={dismissNudge}
          hitSlop={10}
          android_ripple={{
            color: theme.colors.fill2,
            borderless: true,
            radius: 18,
          }}
          style={styles.androidDismiss}
          accessibilityLabel="Dismiss"
        >
          <MaterialCommunityIcons
            name="close"
            size={18}
            color={theme.colors.label3}
          />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <SymbolView
          name="square.grid.2x2.fill"
          size={18}
          tintColor={theme.colors.blue}
          resizeMode="scaleAspectFit"
          fallback={null}
        />
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>Add the widget</Text>
        <Text style={styles.subtitle}>
          See what&apos;s due without opening the app.
        </Text>
      </View>
      <Pressable onPress={onLearnMore} style={styles.cta}>
        <Text style={styles.ctaText}>Show me</Text>
      </Pressable>
      <Pressable onPress={dismissNudge} style={styles.dismiss}>
        <SymbolView
          name="xmark"
          size={14}
          tintColor={theme.colors.label3}
          resizeMode="scaleAspectFit"
          fallback={null}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(0,122,255,0.08)',
    borderWidth: 0.5,
    borderColor: 'rgba(0,122,255,0.25)',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(0,122,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 12,
    color: theme.colors.label3,
    marginTop: 1,
  },
  cta: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    backgroundColor: theme.colors.blue,
  },
  ctaText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  dismiss: {
    padding: 6,
  },
  androidContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  androidIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  androidTitle: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  androidSubtitle: {
    fontSize: 12,
    marginTop: 2,
    letterSpacing: 0.25,
  },
  androidCta: {
    paddingHorizontal: 16,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  androidCtaText: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  androidDismiss: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
}));
