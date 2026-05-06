import { SymbolView } from 'expo-symbols';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { logs } from '../lib/logs';
import { useSettingsStore } from '../stores/settings';

interface WidgetNudgeProps {
  onLearnMore: () => void;
}

export default function WidgetNudge({ onLearnMore }: WidgetNudgeProps) {
  const { theme } = useUnistyles();
  const dismissed = useSettingsStore(s => s.widgetNudgeDismissed);
  const dismissNudge = useSettingsStore(s => s.dismissWidgetNudge);

  if (dismissed) return null;

  const handleLearnMore = () => {
    logs.widgetNudgeDismissed('learn_more');
    onLearnMore();
  };

  const handleDismiss = () => {
    logs.widgetNudgeDismissed('dismiss');
    dismissNudge();
  };

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
      <Pressable onPress={handleLearnMore} style={styles.cta}>
        <Text style={styles.ctaText}>Show me</Text>
      </Pressable>
      <Pressable onPress={handleDismiss} style={styles.dismiss}>
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
}));
