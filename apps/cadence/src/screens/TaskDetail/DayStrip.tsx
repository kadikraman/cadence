import { View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { withAlpha } from '../../utils/colorUtils';
import {
  CompletionStatus,
  stripSquareIndex,
  stripSquares,
  StripUnit,
} from '../../utils/statsUtils';

type DayStripProps =
  | {
      kind: 'now';
      days: number;
      elapsed: number;
      unit: StripUnit;
      accent: string;
    }
  | {
      kind: 'entry';
      cadDays: number;
      deltaDays: number | null;
      status: CompletionStatus;
      unit: StripUnit;
      accent: string;
    };

type Square =
  | { fill: string }
  | { border: string; dashed?: boolean; width?: number };

export default function DayStrip(props: DayStripProps) {
  const { theme } = useUnistyles();
  const { accent, unit } = props;
  const unitDays = unit.days;
  const muted = theme.colors.label4;
  const squares: Square[] = [];

  if (props.kind === 'now') {
    const days = stripSquares(props.days, unitDays);
    const elapsed = stripSquareIndex(props.elapsed, props.days, unitDays);
    for (let k = 1; k <= Math.max(days, elapsed); k++) {
      if (k > days) {
        squares.push(
          k === elapsed
            ? { border: theme.colors.error, width: 2 }
            : { fill: withAlpha(theme.colors.error, 0.3) }
        );
      } else if (k < elapsed) squares.push({ fill: withAlpha(accent, 0.25) });
      else if (k === elapsed) squares.push({ border: accent, width: 2 });
      else squares.push({ border: k === days ? accent : muted, dashed: true });
    }
  } else if (props.deltaDays === null) {
    squares.push({ fill: accent });
  } else {
    const { status } = props;
    const cadDays = stripSquares(props.cadDays, unitDays);
    const deltaDays = stripSquareIndex(
      props.deltaDays,
      props.cadDays,
      unitDays
    );
    for (let k = 1; k <= Math.max(deltaDays, cadDays); k++) {
      if (k === deltaDays) {
        squares.push({
          fill: status === 'late' ? theme.colors.warning : accent,
        });
      } else if (k < deltaDays) {
        squares.push({
          fill:
            k > cadDays
              ? withAlpha(theme.colors.warning, 0.3)
              : withAlpha(accent, 0.25),
        });
      } else squares.push({ border: muted, dashed: true });
    }
  }

  const dense = squares.length > 20;

  return (
    <View
      accessible
      accessibilityLabel={`${squares.length} ${squares.length === 1 ? 'square' : 'squares'}, one per ${unit.label}`}
      style={[styles.strip, { gap: dense ? 1 : 3 }]}
    >
      {squares.map((s, i) => (
        <View
          key={i}
          style={[
            styles.square,
            dense && styles.squareDense,
            'fill' in s
              ? { backgroundColor: s.fill }
              : {
                  borderColor: s.border,
                  borderWidth: s.width ?? 1.5,
                  borderStyle: s.dashed ? 'dashed' : 'solid',
                },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
  },
  square: {
    flex: 1,
    maxWidth: 14,
    height: 14,
    borderRadius: 4,
  },
  squareDense: {
    borderRadius: 2,
  },
});
