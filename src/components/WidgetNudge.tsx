import AsyncStorage from '@react-native-async-storage/async-storage';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

const STORAGE_KEY = 'cadence_widget_nudge_dismissed';

interface WidgetNudgeProps {
  onLearnMore: () => void;
}

export default function WidgetNudge({ onLearnMore }: WidgetNudgeProps) {
  const { theme } = useUnistyles();
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(v => {
      setVisible(v !== '1');
      setLoaded(true);
    });
  }, []);

  const dismiss = async () => {
    setVisible(false);
    await AsyncStorage.setItem(STORAGE_KEY, '1');
  };

  if (!loaded || !visible) return null;

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
      <Pressable onPress={dismiss} style={styles.dismiss}>
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
