import { View, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Visual } from './types';

export type { Visual } from './types';

const dotStyles = StyleSheet.create(() => ({
  dot: {
    height: 6,
    borderRadius: 3,
  },
}));

export function Dot({ isActive }: { isActive: boolean }) {
  const { theme } = useUnistyles();
  const animatedStyle = useAnimatedStyle(
    () => ({
      width: withTiming(isActive ? 22 : 6, { duration: 220 }),
      backgroundColor: withTiming(
        isActive ? theme.colors.blue : theme.colors.fill2,
        { duration: 220 }
      ),
    }),
    [isActive, theme.colors.blue, theme.colors.fill2]
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

function CadenceAppIcon({ size, dark }: { size: number; dark: boolean }) {
  const radius = size * 0.2237;
  const pad = size * 0.13;
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
        borderRadius: radius,
        backgroundColor: dark ? '#222A3A' : '#FFFFFF',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(20,40,90,0.08)',
        shadowColor: '#0A2245',
        shadowOpacity: dark ? 0.5 : 0.22,
        shadowRadius: dark ? 18 : 22,
        shadowOffset: { width: 0, height: 12 },
      }}
    >
      {dots}
    </View>
  );
}

function IconStep({ dark }: { dark: boolean }) {
  return (
    <View style={visualStyles.iconWrap}>
      <CadenceAppIcon size={132} dark={dark} />
      <Text style={[visualStyles.iconLabel, { color: dark ? '#fff' : '#000' }]}>
        Cadence
      </Text>
    </View>
  );
}

function WidgetShape({
  kind,
  selected,
  dark,
}: {
  kind: 'grid' | 'small' | 'medium' | 'large';
  selected?: boolean;
  dark: boolean;
}) {
  const stroke = dark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.85)';
  const selBg = dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)';
  return (
    <View
      style={[
        visualStyles.shape,
        { backgroundColor: selected ? selBg : 'transparent' },
      ]}
    >
      {kind === 'grid' && (
        <View style={visualStyles.shapeGrid}>
          <View
            style={[visualStyles.shapeGridCell, { backgroundColor: stroke }]}
          />
          <View
            style={[visualStyles.shapeGridCell, { backgroundColor: stroke }]}
          />
          <View
            style={[visualStyles.shapeGridCell, { backgroundColor: stroke }]}
          />
          <View
            style={[visualStyles.shapeGridCell, { backgroundColor: stroke }]}
          />
        </View>
      )}
      {kind === 'small' && (
        <View
          style={[
            visualStyles.shapeOutline,
            { width: 18, height: 18, borderColor: stroke },
          ]}
        >
          <View
            style={{
              position: 'absolute',
              left: 3,
              top: 3,
              width: 5,
              height: 5,
              borderRadius: 1,
              backgroundColor: stroke,
            }}
          />
        </View>
      )}
      {kind === 'medium' && (
        <View
          style={[
            visualStyles.shapeOutline,
            { width: 22, height: 13, borderColor: stroke },
          ]}
        >
          <View
            style={{
              position: 'absolute',
              left: 2,
              top: 2,
              width: 6,
              height: 7,
              borderRadius: 1,
              backgroundColor: stroke,
            }}
          />
        </View>
      )}
      {kind === 'large' && (
        <View
          style={[
            visualStyles.shapeOutline,
            { width: 19, height: 22, borderColor: stroke },
          ]}
        >
          <View
            style={{
              position: 'absolute',
              left: 2,
              top: 2,
              width: 7,
              height: 4,
              borderRadius: 1,
              backgroundColor: stroke,
            }}
          />
        </View>
      )}
    </View>
  );
}

function MenuStep({ dark }: { dark: boolean }) {
  const { theme } = useUnistyles();
  const menuBg = dark ? 'rgba(44,44,46,0.96)' : 'rgba(245,245,247,0.96)';
  const rowDivider = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  const labelColor = dark ? '#fff' : '#000';

  return (
    <View style={visualStyles.menuWrap}>
      <View style={visualStyles.menuIconBox}>
        <CadenceAppIcon size={60} dark={dark} />
        <View
          style={[
            visualStyles.menuRing,
            {
              borderRadius: (60 + 14) * 0.2237,
              borderColor: dark
                ? 'rgba(255,255,255,0.55)'
                : 'rgba(255,255,255,0.85)',
              shadowColor: theme.colors.blue,
            },
          ]}
        />
      </View>
      <View style={[visualStyles.menu, { backgroundColor: menuBg }]}>
        <View
          style={[visualStyles.menuShapes, { borderBottomColor: rowDivider }]}
        >
          <WidgetShape kind="grid" selected dark={dark} />
          <WidgetShape kind="small" dark={dark} />
          <WidgetShape kind="medium" dark={dark} />
          <WidgetShape kind="large" dark={dark} />
        </View>
        <View style={[visualStyles.menuRow, { borderBottomColor: rowDivider }]}>
          <Text style={[visualStyles.menuRowText, { color: labelColor }]}>
            Edit Home Screen
          </Text>
        </View>
        <View style={[visualStyles.menuRow, { borderBottomColor: rowDivider }]}>
          <Text style={[visualStyles.menuRowText, { color: labelColor }]}>
            Require Face ID
          </Text>
        </View>
        <View style={[visualStyles.menuRow, { borderBottomWidth: 0 }]}>
          <Text
            style={[visualStyles.menuRowText, { color: theme.colors.error }]}
          >
            Remove App
          </Text>
        </View>
      </View>
    </View>
  );
}

export function OnboardingVisual({ kind }: { kind: Visual }) {
  const { rt } = useUnistyles();
  const dark = rt.themeName === 'dark';
  if (kind === 'icon') return <IconStep dark={dark} />;
  if (kind === 'menu') return <MenuStep dark={dark} />;
  return null;
}

const visualStyles = StyleSheet.create(() => ({
  iconWrap: {
    alignItems: 'center',
    gap: 12,
  },
  iconLabel: {
    fontSize: 14,
    fontWeight: '400',
    letterSpacing: -0.1,
  },
  menuWrap: {
    alignItems: 'center',
  },
  menuIconBox: {
    marginBottom: 10,
    width: 60,
    height: 60,
  },
  menuRing: {
    position: 'absolute',
    top: -7,
    left: -7,
    right: -7,
    bottom: -7,
    borderWidth: 2,
    shadowOpacity: 0.35,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
  },
  menu: {
    width: 224,
    borderRadius: 13,
    overflow: 'hidden',
  },
  menuShapes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  shape: {
    width: 30,
    height: 30,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shapeOutline: {
    borderWidth: 1.4,
    borderRadius: 4,
  },
  shapeGrid: {
    width: 18,
    height: 18,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 1.5,
  },
  shapeGridCell: {
    width: 8,
    height: 8,
    borderRadius: 1.3,
  },
  menuRow: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  menuRowText: {
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: -0.1,
  },
}));
