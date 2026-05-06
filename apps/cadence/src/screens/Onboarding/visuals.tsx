import { SymbolView } from 'expo-symbols';
import { Platform, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import WidgetPreview from '../../components/WidgetPreview';
import { Task } from '../../lib/types';
import { MS_DAY } from '../../utils/taskUtils';
import { Visual } from './useOnboarding';

const today = (() => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
})();

const PREVIEW_TASKS: Task[] = [
  {
    id: 'preview-1',
    title: 'Water plants',
    color: 'green',
    glyph: 'plant',
    cadence: { type: 'custom', value: 3, unit: 'days' },
    createdAt: today - 30 * MS_DAY,
    lastCompletedAt: today - 3 * MS_DAY,
    nextDueDate: today,
    completedDates: [today - 3 * MS_DAY],
  },
  {
    id: 'preview-2',
    title: 'Pay car tax',
    color: 'slate',
    glyph: 'car',
    cadence: { type: 'monthly' },
    createdAt: today - 60 * MS_DAY,
    nextDueDate: today + 2 * MS_DAY,
    completedDates: [],
  },
  {
    id: 'preview-3',
    title: 'Clean the dishwasher',
    color: 'purple',
    glyph: 'trash',
    cadence: { type: 'monthly' },
    createdAt: today - 60 * MS_DAY,
    nextDueDate: today + 6 * MS_DAY,
    completedDates: [],
  },
];

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

export function OnboardingVisual({ kind }: { kind: Visual }) {
  const { theme, rt } = useUnistyles();
  const dark = rt.themeName === 'dark';

  if (kind === 'hero') {
    return (
      <View
        style={[
          visualStyles.hero,
          {
            backgroundColor: theme.colors.blue,
            shadowColor: theme.colors.blue,
          },
        ]}
      >
        <SymbolView
          name="square.grid.2x2.fill"
          size={80}
          tintColor="#fff"
          resizeMode="scaleAspectFit"
          fallback={
            <MaterialCommunityIcons name="apps" size={88} color="#fff" />
          }
        />
      </View>
    );
  }
  if (kind === 'jiggle') {
    return (
      <View
        style={[
          visualStyles.jigglePane,
          {
            backgroundColor: dark ? theme.colors.surface : '#fff',
            borderColor: theme.colors.sep,
          },
        ]}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <View
            key={i}
            style={[
              visualStyles.jiggleTile,
              {
                backgroundColor:
                  i === 3 ? theme.colors.blue : theme.colors.fill3,
                transform: [{ rotate: i % 2 === 0 ? '-2deg' : '2deg' }],
              },
            ]}
          />
        ))}
      </View>
    );
  }
  if (kind === 'plus') {
    return (
      <View
        style={[
          visualStyles.plusPane,
          { backgroundColor: theme.colors.surfaceElevated },
        ]}
      >
        <View
          style={[
            visualStyles.plusBadge,
            { backgroundColor: theme.colors.blue },
          ]}
        >
          <SymbolView
            name="plus"
            size={22}
            tintColor="#fff"
            resizeMode="scaleAspectFit"
            fallback={
              <MaterialCommunityIcons name="plus" size={22} color="#fff" />
            }
          />
        </View>
        <View style={visualStyles.plusGrid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <View
              key={i}
              style={[
                visualStyles.plusSlot,
                { backgroundColor: theme.colors.fill3 },
              ]}
            />
          ))}
        </View>
      </View>
    );
  }
  return (
    <View style={visualStyles.sizes}>
      <WidgetPreview size="small" tasks={PREVIEW_TASKS} scale={0.75} />
      <WidgetPreview size="medium" tasks={PREVIEW_TASKS} scale={0.6} />
    </View>
  );
}

const visualStyles = StyleSheet.create(() => ({
  hero: {
    width: 200,
    height: 200,
    borderRadius: Platform.select({ android: 60, default: 44 }),
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.25,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 20 },
  },
  jigglePane: {
    width: 240,
    height: 180,
    borderRadius: 22,
    padding: 12,
    borderWidth: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    alignContent: 'center',
  },
  jiggleTile: {
    width: 45,
    height: 45,
    borderRadius: 10,
  },
  plusPane: {
    width: 200,
    height: 200,
    borderRadius: 24,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 32,
    shadowOffset: { width: 0, height: 8 },
  },
  plusBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusGrid: {
    marginTop: 62,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  plusSlot: {
    width: 82,
    height: 54,
    borderRadius: 10,
  },
  sizes: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
}));
