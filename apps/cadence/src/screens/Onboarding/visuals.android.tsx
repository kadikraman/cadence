import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Visual } from './types';

export type { Visual } from './types';

const dotStyles = StyleSheet.create(() => ({
  dot: {
    height: 8,
    borderRadius: 4,
  },
}));

export function Dot({ isActive }: { isActive: boolean }) {
  const { theme } = useUnistyles();
  const animatedStyle = useAnimatedStyle(
    () => ({
      width: withTiming(isActive ? 24 : 8, { duration: 220 }),
      backgroundColor: withTiming(
        isActive ? theme.colors.primary : theme.colors.outlineVariant,
        { duration: 220 }
      ),
    }),
    [isActive, theme.colors.primary, theme.colors.outlineVariant]
  );
  return <Animated.View style={[dotStyles.dot, animatedStyle]} />;
}

const ICON_GRID = 7;
const ICON_CENTER = (ICON_GRID - 1) / 2;
const ICON_MAX_DIST = Math.hypot(ICON_CENTER, ICON_CENTER);

const BLUES_LIGHT = [
  '#0A5BD6',
  '#1F6FE0',
  '#3B86E9',
  '#5CA0F1',
  '#8BBDF5',
  '#B6D4F9',
  '#D7E6FB',
];
const BLUES_DARK = [
  '#9DC4FA',
  '#7BAEF5',
  '#5C97EE',
  '#4280DF',
  '#3168C2',
  '#23508F',
  '#1A3F6A',
];

function AndroidCadenceIcon({
  size,
  dark,
}: {
  size: number;
  dark: boolean;
}) {
  const pad = size * 0.2;
  const cell = (size - pad * 2) / ICON_GRID;
  const blues = dark ? BLUES_DARK : BLUES_LIGHT;
  const dots = [];
  for (let y = 0; y < ICON_GRID; y++) {
    for (let x = 0; x < ICON_GRID; x++) {
      const d = Math.hypot(x - ICON_CENTER, y - ICON_CENTER) / ICON_MAX_DIST;
      const t = Math.max(0, Math.min(1, d));
      const dotSize = cell * (0.78 - 0.46 * t);
      const ci = Math.min(blues.length - 1, Math.round(t * (blues.length - 1)));
      const cx = pad + cell * x + cell / 2;
      const cy = pad + cell * y + cell / 2;
      dots.push(
        <View
          key={`${x}-${y}`}
          style={{
            position: 'absolute',
            left: cx - dotSize / 2,
            top: cy - dotSize / 2,
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: blues[ci],
          }}
        />
      );
    }
  }
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: 'hidden',
        backgroundColor: dark ? '#222A3A' : '#F5F8FD',
      }}
    >
      {dots}
    </View>
  );
}

interface MenuItem {
  icon: string;
  label: string;
  highlight?: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  { icon: 'palette-outline', label: 'Wallpaper & style' },
  { icon: 'view-grid-outline', label: 'Widgets', highlight: true },
  { icon: 'view-list-outline', label: 'Apps list' },
  { icon: 'cog-outline', label: 'Home settings' },
];

function HomeMenuStep({ dark }: { dark: boolean }) {
  const { theme } = useUnistyles();
  const pillBg = dark ? '#2C2F38' : '#F0EEF5';
  const pillText = dark ? '#E6E1E5' : '#1C1B1F';
  return (
    <View style={visualStyles.homeWrap}>
      <LinearGradient
        colors={['#B7C7DC', '#6E7A93', '#3A4257']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={visualStyles.homeBg}
      >
        <Text style={visualStyles.homeDate}>Thu, May 14</Text>
        <View style={visualStyles.menuColumn}>
          {MENU_ITEMS.map(it => (
            <View
              key={it.label}
              style={[
                visualStyles.menuPill,
                {
                  backgroundColor: pillBg,
                  borderColor: it.highlight
                    ? theme.colors.primary
                    : 'transparent',
                  borderWidth: it.highlight ? 1.5 : 0,
                },
              ]}
            >
              <View
                style={[
                  visualStyles.menuIconWrap,
                  {
                    backgroundColor: it.highlight
                      ? theme.colors.primaryContainer
                      : 'transparent',
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name={it.icon}
                  size={14}
                  color={
                    it.highlight
                      ? theme.colors.onPrimaryContainer
                      : pillText
                  }
                />
              </View>
              <Text
                style={[
                  visualStyles.menuLabel,
                  {
                    color: pillText,
                    fontWeight: it.highlight ? '500' : '400',
                  },
                ]}
              >
                {it.label}
              </Text>
            </View>
          ))}
        </View>
      </LinearGradient>
    </View>
  );
}

function WidgetPickerStep({ dark }: { dark: boolean }) {
  const { theme } = useUnistyles();
  const sheetBg = dark ? '#1F1B22' : '#F7F2FA';
  const fieldBg = dark ? '#2C2F38' : '#FFFFFF';
  return (
    <View
      style={[
        visualStyles.sheet,
        { backgroundColor: sheetBg },
      ]}
    >
      <View style={visualStyles.handleRow}>
        <View
          style={[
            visualStyles.handle,
            { backgroundColor: theme.colors.outlineVariant },
          ]}
        />
      </View>
      <Text style={[visualStyles.sheetTitle, { color: theme.colors.text }]}>
        Widgets
      </Text>
      <View style={[visualStyles.search, { backgroundColor: fieldBg }]}>
        <MaterialCommunityIcons
          name="arrow-left"
          size={16}
          color={theme.colors.label2}
        />
        <Text style={[visualStyles.searchText, { color: theme.colors.text }]}>
          cadence
        </Text>
        <View
          style={[
            visualStyles.searchClear,
            { backgroundColor: theme.colors.label3 },
          ]}
        >
          <MaterialCommunityIcons name="close" size={10} color={sheetBg} />
        </View>
      </View>
      <View style={[visualStyles.resultRow, { backgroundColor: fieldBg }]}>
        <AndroidCadenceIcon size={38} dark={dark} />
        <View style={visualStyles.resultBody}>
          <Text style={[visualStyles.resultTitle, { color: theme.colors.text }]}>
            Cadence
          </Text>
          <Text
            style={[visualStyles.resultSub, { color: theme.colors.label2 }]}
            numberOfLines={1}
          >
            Cadence · Small, Cadence · Medium
          </Text>
        </View>
        <View
          style={[
            visualStyles.resultChevron,
            { backgroundColor: theme.colors.primaryContainer },
          ]}
        >
          <MaterialCommunityIcons
            name="chevron-right"
            size={14}
            color={theme.colors.onPrimaryContainer}
          />
        </View>
      </View>
    </View>
  );
}

export function OnboardingVisual({ kind }: { kind: Visual }) {
  const { rt } = useUnistyles();
  const dark = rt.themeName === 'dark';
  if (kind === 'home-menu') return <HomeMenuStep dark={dark} />;
  if (kind === 'widget-picker') return <WidgetPickerStep dark={dark} />;
  return null;
}

const visualStyles = StyleSheet.create(() => ({
  homeWrap: {
    width: 248,
    height: 250,
    borderRadius: 26,
    overflow: 'hidden',
  },
  homeBg: {
    flex: 1,
  },
  homeDate: {
    position: 'absolute',
    top: 14,
    left: 16,
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 0.2,
  },
  menuColumn: {
    position: 'absolute',
    top: 30,
    right: 14,
    width: 168,
    gap: 5,
  },
  menuPill: {
    borderRadius: 26,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: 12,
    letterSpacing: 0.1,
    flexShrink: 1,
  },
  sheet: {
    width: 264,
    borderRadius: 26,
    overflow: 'hidden',
    paddingBottom: 14,
  },
  handleRow: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 4,
  },
  handle: {
    width: 30,
    height: 4,
    borderRadius: 2,
  },
  sheetTitle: {
    textAlign: 'center',
    fontSize: 15,
    paddingTop: 4,
    paddingBottom: 10,
  },
  search: {
    marginHorizontal: 14,
    marginBottom: 10,
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchText: {
    flex: 1,
    fontSize: 13,
  },
  searchClear: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultRow: {
    marginHorizontal: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  resultBody: {
    flex: 1,
    minWidth: 0,
  },
  resultTitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  resultSub: {
    fontSize: 10,
    marginTop: 1,
  },
  resultChevron: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
