import { Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSettingsStore } from '../stores/settings';

interface WidgetNudgeProps {
  onLearnMore: () => void;
}

export default function WidgetNudge({ onLearnMore }: WidgetNudgeProps) {
  const { theme } = useUnistyles();
  const dismissed = useSettingsStore(s => s.widgetNudgeDismissed);
  const dismissNudge = useSettingsStore(s => s.dismissWidgetNudge);

  if (dismissed) return null;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outlineVariant,
        },
      ]}
    >
      <View
        style={[
          styles.iconWrap,
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
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Add the widget
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.label2 }]}>
          See what&apos;s due without opening the app.
        </Text>
      </View>
      <Pressable
        onPress={onLearnMore}
        android_ripple={{
          color: 'rgba(255,255,255,0.20)',
          borderless: false,
        }}
        style={[styles.cta, { backgroundColor: theme.colors.primary }]}
      >
        <Text style={[styles.ctaText, { color: theme.colors.onPrimary }]}>
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
        style={styles.dismiss}
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

const styles = StyleSheet.create(() => ({
  container: {
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
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
    letterSpacing: 0.25,
  },
  cta: {
    paddingHorizontal: 16,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ctaText: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  dismiss: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
}));
