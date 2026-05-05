import { Text, View } from 'react-native';
import { Task } from '../../lib/types';
import { ColorKey, getTint } from '../../utils/taskTints';
import {
  formatDueIn,
  getNextDueDate,
  getTaskStatus,
  isDueToday,
  isOverdue,
} from '../../utils/taskUtils';
import {
  WidgetPreviewProps,
  buildSummaryLabel,
  computePreviewData,
} from './helpers';

export type { WidgetPreviewProps } from './helpers';

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

const TILE_TINTS: Partial<Record<ColorKey, { tint: string; fg: string }>> = {
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

function tintFor(color: ColorKey | undefined) {
  if (!color) return TILE_TINTS.gray!;
  return (
    TILE_TINTS[color] ?? {
      tint: getTint(color).tint,
      fg: getTint(color).accent,
    }
  );
}

function firstLetter(title: string): string {
  const t = title.trim();
  return t ? t.charAt(0).toUpperCase() : '?';
}

function Tile({
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
    : tintFor(task.color);
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
  const { sorted, urgent, upcoming, overdueCount, todayCount } =
    computePreviewData(tasks);

  if (size === 'small') {
    const primary = urgent[0] ?? upcoming[0];
    const primaryOverdue = primary ? isOverdue(primary) : false;
    const primaryToday = primary ? isDueToday(primary) : false;
    const kicker = primaryOverdue ? 'OVERDUE' : primaryToday ? 'TODAY' : 'NEXT';
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
            <Tile task={primary} size={36 * scale} overdue={primaryOverdue} />
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
  const label = buildSummaryLabel(sorted.length, overdueCount, todayCount);

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
            <Tile task={t} size={26 * scale} overdue={overdue} />
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
