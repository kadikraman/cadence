import { Text, View } from 'react-native';
import Svg, { Path, Text as SvgText } from 'react-native-svg';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { withAlpha } from '../../utils/colorUtils';
import { CurrentCycle } from '../../utils/statsUtils';
import { addDays, formatShortDay, formatWeekday } from '../../utils/taskUtils';

interface CycleDialProps {
  cycle: CurrentCycle;
  accent: string;
  size?: number;
}

const STROKE = 18;
const MAX_LABELLED_DAYS = 14;

export default function CycleDial({
  cycle,
  accent,
  size = 248,
}: CycleDialProps) {
  const { theme } = useUnistyles();
  const { days, elapsed, dueIn } = cycle;
  const overdue = dueIn < 0;
  const center = size / 2;
  const r = size / 2 - 34;
  const gap = days > 14 ? 1.2 : 4;
  const seg = 360 / days;

  const point = (angle: number, radius: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return [center + radius * Math.cos(rad), center + radius * Math.sin(rad)];
  };
  const arc = (a0: number, a1: number) => {
    const [x0, y0] = point(a0, r);
    const [x1, y1] = point(a1, r);
    return `M${x0} ${y0} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
  };
  const segmentColor = (day: number) => {
    if (overdue) return theme.colors.error;
    if (day < elapsed) return accent;
    if (day === elapsed) return withAlpha(accent, 0.38);
    return theme.colors.fill2;
  };

  let big: string;
  let caption: string;
  if (overdue) {
    big = String(-dueIn);
    caption = -dueIn === 1 ? 'day overdue' : 'days overdue';
  } else if (dueIn === 0) {
    big = 'Today';
    caption = 'due';
  } else {
    big = String(dueIn);
    caption = dueIn === 1 ? 'day left' : 'days left';
  }

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {Array.from({ length: days }, (_, i) => (
          <Path
            key={i}
            d={arc(i * seg + gap / 2, (i + 1) * seg - gap / 2)}
            stroke={segmentColor(i + 1)}
            strokeWidth={STROKE}
            fill="none"
          />
        ))}
        {days <= MAX_LABELLED_DAYS &&
          Array.from({ length: days }, (_, i) => {
            const [x, y] = point((i + 0.5) * seg, r + 25);
            const due = i === days - 1;
            const today = i + 1 === elapsed;
            return (
              <SvgText
                key={`label-${i}`}
                x={x}
                y={y + 4.5}
                textAnchor="middle"
                fontSize={13}
                fontWeight={due || today ? '700' : '500'}
                fill={
                  due ? accent : today ? theme.colors.text : theme.colors.label3
                }
              >
                {formatWeekday(addDays(cycle.start, i + 1), 'narrow')}
              </SvgText>
            );
          })}
      </Svg>
      <View style={styles.center}>
        <Text
          style={[
            styles.big,
            dueIn === 0 && styles.bigWord,
            overdue && { color: theme.colors.error },
          ]}
        >
          {big}
        </Text>
        <Text style={styles.caption}>{caption}</Text>
        <Text style={styles.due}>due {formatShortDay(cycle.nextDue)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  big: {
    fontSize: 56,
    fontWeight: '700',
    letterSpacing: -2,
    lineHeight: 60,
    color: theme.colors.text,
  },
  bigWord: {
    fontSize: 40,
    letterSpacing: -1,
    lineHeight: 46,
  },
  caption: {
    fontSize: 15,
    color: theme.colors.label2,
    marginTop: 2,
  },
  due: {
    fontSize: 13,
    color: theme.colors.label3,
    marginTop: 2,
  },
}));
