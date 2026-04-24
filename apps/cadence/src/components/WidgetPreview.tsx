import { Platform, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Task } from '../lib/types';
import { ColorKey, getTint } from '../utils/taskTints';
import {
  formatDueIn,
  getNextDueDate,
  getTaskStatus,
  isCompletedToday,
  isDueToday,
  isOverdue,
} from '../utils/taskUtils';
import TaskTile from './ui/TaskTile';

const IS_ANDROID = Platform.OS === 'android';

interface WidgetPreviewProps {
  size: 'small' | 'medium';
  tasks: Task[];
  scale?: number;
}

// Material 3 palette for the widget-preview chrome, matches CadenceWidget.tsx.
const M3 = {
  primaryContainer: '#D1E4FF',
  onPrimaryContainer: '#001D36',
  primary: '#0061A4',
  surface3: '#F3EDF7',
  label: '#1D1B20',
  label2: '#49454F',
  label3: '#79747E',
  error: '#BA1A1A',
  errorContainer: '#FFDAD6',
  outlineVariant: '#CAC4D0',
};

// Warmer task tile tints for the Material preview (match the widget).
const ANDROID_TILE_TINTS: Partial<
  Record<ColorKey, { tint: string; fg: string }>
> = {
  red: { tint: '#FFDAD6', fg: '#BA1A1A' },
  orange: { tint: '#FFDDB3', fg: '#8B5000' },
  yellow: { tint: '#F3E9C7', fg: '#6F5D10' },
  green: { tint: '#B0F1B7', fg: '#135322' },
  teal: { tint: '#B8EEEA', fg: '#00504C' },
  blue: { tint: '#D1E4FF', fg: '#00497D' },
  purple: { tint: '#EADDFF', fg: '#4F378B' },
  pink: { tint: '#FFD8E4', fg: '#7D2E4E' },
  slate: { tint: '#DDE2EB', fg: '#3D4450' },
  gray: { tint: '#E1E3E6', fg: '#44474F' },
};

function androidTintFor(color: ColorKey | undefined) {
  if (!color) return ANDROID_TILE_TINTS.gray!;
  return (
    ANDROID_TILE_TINTS[color] ?? {
      tint: getTint(color).tint,
      fg: getTint(color).accent,
    }
  );
}

function firstLetter(title: string): string {
  const t = title.trim();
  return t ? t.charAt(0).toUpperCase() : '?';
}

function AndroidTile({
  task,
  size,
  overdue,
}: {
  task: Task;
  size: number;
  overdue: boolean;
}) {
  const { tint, fg } = overdue
    ? { tint: M3.errorContainer, fg: M3.error }
    : androidTintFor(task.color);
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: tint,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          fontSize: Math.round(size * 0.48),
          fontWeight: '500',
          color: fg,
        }}
      >
        {firstLetter(task.title)}
      </Text>
    </View>
  );
}

export default function WidgetPreview({
  size,
  tasks,
  scale = 1,
}: WidgetPreviewProps) {
  const { theme } = useUnistyles();
  const active = tasks.filter(t => !isCompletedToday(t));
  const sorted = [...active].sort(
    (a, b) => getNextDueDate(a) - getNextDueDate(b)
  );
  const overdueCount = sorted.filter(isOverdue).length;
  const todayCount = sorted.filter(t => !isOverdue(t) && isDueToday(t)).length;
  const urgent = sorted.filter(t => isOverdue(t) || isDueToday(t));
  const upcoming = sorted.filter(t => !isOverdue(t) && !isDueToday(t));

  if (IS_ANDROID) {
    if (size === 'small') {
      const primary = urgent[0] ?? upcoming[0];
      const primaryOverdue = primary ? isOverdue(primary) : false;
      const primaryToday = primary ? isDueToday(primary) : false;
      const kicker = primaryOverdue
        ? 'OVERDUE'
        : primaryToday
          ? 'TODAY'
          : 'NEXT';
      const kickerColor = primaryOverdue ? M3.error : M3.primary;
      const count = urgent.length;

      return (
        <View
          style={{
            width: 170 * scale,
            height: 170 * scale,
            borderRadius: 28 * scale,
            padding: 16 * scale,
            backgroundColor: M3.primaryContainer,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 13 * scale,
                fontWeight: '500',
                color: M3.onPrimaryContainer,
                letterSpacing: 0.1,
              }}
            >
              Cadence
            </Text>
            <Text
              style={{
                fontSize: 20 * scale,
                fontWeight: '500',
                color: primaryOverdue ? M3.error : M3.onPrimaryContainer,
                letterSpacing: -0.4,
                lineHeight: 22 * scale,
              }}
            >
              {count}
            </Text>
          </View>
          {primary && (
            <View
              style={{
                marginTop: 10 * scale,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <AndroidTile
                task={primary}
                size={36 * scale}
                overdue={primaryOverdue}
              />
              <View style={{ flex: 1, marginLeft: 10 * scale }}>
                <Text
                  style={{
                    fontSize: 10 * scale,
                    fontWeight: '500',
                    color: kickerColor,
                    letterSpacing: 0.8,
                  }}
                >
                  {kicker}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 13 * scale,
                    fontWeight: '500',
                    color: M3.onPrimaryContainer,
                    marginTop: 2 * scale,
                    letterSpacing: 0.15,
                  }}
                >
                  {primary.title}
                </Text>
              </View>
            </View>
          )}
        </View>
      );
    }

    const rows = sorted.slice(0, 3);
    const label = (() => {
      if (sorted.length === 0) return 'No tasks';
      if (overdueCount > 0 && todayCount > 0)
        return `${overdueCount} overdue · ${todayCount} today`;
      if (overdueCount > 0)
        return overdueCount === 1 ? '1 overdue' : `${overdueCount} overdue`;
      if (todayCount === 0) return 'Nothing due today';
      return todayCount === 1 ? '1 due today' : `${todayCount} due today`;
    })();

    return (
      <View
        style={{
          width: 360 * scale,
          height: 170 * scale,
          borderRadius: 28 * scale,
          padding: 16 * scale,
          backgroundColor: M3.surface3,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 4 * scale,
          }}
        >
          <Text
            style={{
              fontSize: 14 * scale,
              fontWeight: '500',
              color: M3.primary,
              letterSpacing: 0.1,
            }}
          >
            Cadence
          </Text>
          <Text
            style={{
              fontSize: 11 * scale,
              fontWeight: '500',
              color: overdueCount > 0 ? M3.error : M3.label2,
            }}
          >
            {label}
          </Text>
        </View>
        {rows.map(t => {
          const status = getTaskStatus(t);
          const overdue = status === 'overdue';
          const dueToday = status === 'dueToday';
          return (
            <View
              key={t.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 4 * scale,
              }}
            >
              <AndroidTile task={t} size={26 * scale} overdue={overdue} />
              <Text
                numberOfLines={1}
                style={{
                  flex: 1,
                  fontSize: 13 * scale,
                  color: M3.label,
                  marginLeft: 12 * scale,
                  letterSpacing: 0.1,
                }}
              >
                {t.title}
              </Text>
              <Text
                style={{
                  fontSize: 11 * scale,
                  fontWeight: '500',
                  color: overdue ? M3.error : dueToday ? M3.primary : M3.label2,
                }}
              >
                {formatDueIn(getNextDueDate(t))}
              </Text>
            </View>
          );
        })}
      </View>
    );
  }

  const headerTone =
    overdueCount > 0
      ? theme.colors.error
      : todayCount > 0
        ? theme.colors.blue
        : theme.colors.label3;

  if (size === 'small') {
    const primary = urgent[0] ?? upcoming[0];
    const next = urgent[0] ? upcoming[0] : upcoming[1];
    const primaryOverdue = primary ? isOverdue(primary) : false;
    const primaryToday = primary ? isDueToday(primary) : false;
    const labelText = primaryOverdue
      ? formatDueIn(getNextDueDate(primary)).toUpperCase()
      : 'TODAY';
    const labelColor = primaryOverdue ? theme.colors.error : theme.colors.blue;
    const count = urgent.length;

    return (
      <View
        style={[
          styles.shell,
          {
            width: 158 * scale,
            height: 158 * scale,
            borderRadius: 22 * scale,
            padding: 14 * scale,
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={[styles.brand, { fontSize: 13 * scale }]}>Cadence</Text>
          <Text
            style={[styles.big, { fontSize: 20 * scale, color: headerTone }]}
          >
            {count}
          </Text>
        </View>

        {primary && (primaryOverdue || primaryToday) && (
          <View style={[styles.smallHero, { marginTop: 8 * scale }]}>
            <TaskTile
              task={primary}
              size={34 * scale}
              overdue={primaryOverdue}
            />
            <View style={styles.smallText}>
              <Text
                style={[
                  styles.heroLabel,
                  { fontSize: 9 * scale, color: labelColor },
                ]}
              >
                {labelText}
              </Text>
              <Text
                style={[styles.heroTitle, { fontSize: 14 * scale }]}
                numberOfLines={2}
              >
                {primary.title}
              </Text>
            </View>
          </View>
        )}

        {next && (
          <View style={[styles.smallNext, { marginTop: 'auto' }]}>
            <TaskTile task={next} size={18 * scale} overdue={false} />
            <Text
              style={[styles.nextTitle, { fontSize: 11 * scale }]}
              numberOfLines={1}
            >
              {next.title}
            </Text>
            <Text style={[styles.nextDue, { fontSize: 10 * scale }]}>
              {formatDueIn(getNextDueDate(next))}
            </Text>
          </View>
        )}
      </View>
    );
  }

  const rows = sorted.slice(0, 3);
  const mediumLabel = (() => {
    if (sorted.length === 0) return 'No tasks';
    if (overdueCount > 0 && todayCount > 0)
      return `${overdueCount} overdue · ${todayCount} today`;
    if (overdueCount > 0)
      return overdueCount === 1 ? '1 overdue' : `${overdueCount} overdue`;
    if (todayCount === 0) return 'Nothing due today';
    return todayCount === 1 ? '1 due today' : `${todayCount} due today`;
  })();

  return (
    <View
      style={[
        styles.shell,
        {
          width: 338 * scale,
          height: 158 * scale,
          borderRadius: 22 * scale,
          padding: 14 * scale,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.brand, { fontSize: 13 * scale }]}>Cadence</Text>
        <Text
          style={[styles.counter, { fontSize: 12 * scale, color: headerTone }]}
        >
          {mediumLabel}
        </Text>
      </View>
      <View style={styles.mediumBody}>
        {rows.map(t => {
          const status = getTaskStatus(t);
          const overdue = status === 'overdue';
          const dueToday = status === 'dueToday';
          return (
            <View key={t.id} style={styles.mediumRow}>
              <TaskTile task={t} size={24 * scale} overdue={overdue} />
              <Text
                style={[styles.title, { fontSize: 12 * scale, flex: 1 }]}
                numberOfLines={1}
              >
                {t.title}
              </Text>
              <Text
                style={[
                  styles.dueChip,
                  {
                    fontSize: 11 * scale,
                    color: overdue
                      ? theme.colors.error
                      : dueToday
                        ? theme.colors.blue
                        : theme.colors.label3,
                  },
                ]}
              >
                {dueToday ? 'TODAY' : formatDueIn(getNextDueDate(t))}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  shell: {
    backgroundColor: theme.colors.surfaceElevated,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  brand: {
    fontWeight: '700',
    color: theme.colors.blue,
    letterSpacing: -0.2,
  },
  big: {
    fontWeight: '700',
    lineHeight: 22,
  },
  counter: {
    fontWeight: '600',
  },
  smallHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  smallText: {
    flex: 1,
    minWidth: 0,
  },
  heroLabel: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontWeight: '700',
    color: theme.colors.text,
    letterSpacing: -0.2,
    marginTop: 2,
  },
  smallNext: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nextTitle: {
    flex: 1,
    fontWeight: '500',
    color: theme.colors.label2,
  },
  nextDue: {
    fontWeight: '600',
    color: theme.colors.label3,
  },
  title: {
    fontWeight: '600',
    color: theme.colors.text,
    letterSpacing: -0.2,
  },
  mediumBody: {
    flex: 1,
    justifyContent: 'space-around',
    gap: 4,
  },
  mediumRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  dueChip: {
    fontWeight: '700',
    minWidth: 44,
    textAlign: 'right',
  },
}));
