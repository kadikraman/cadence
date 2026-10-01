import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { formatShortDay } from '../../utils/taskUtils';
import UiSymbol from '../ui/UiSymbol';

interface NextDuePreviewProps {
  nextDue: number;
  note: string;
  late: boolean;
}

export default function NextDuePreview({
  nextDue,
  note,
  late,
}: NextDuePreviewProps) {
  const { theme, rt } = useUnistyles();
  const dark = rt.themeName === 'dark';
  const background = late
    ? dark
      ? 'rgba(255,69,58,0.22)'
      : '#FFE5E5'
    : dark
      ? 'rgba(48,209,88,0.18)'
      : '#DCF5E3';
  const iconColor = late
    ? theme.colors.error
    : dark
      ? theme.colors.success
      : '#248A3D';

  return (
    <View style={[styles.panel, { backgroundColor: background }]}>
      <UiSymbol
        name="arrow.triangle.2.circlepath"
        size={15}
        color={iconColor}
      />
      <Text style={styles.label}>
        Next due <Text style={styles.date}>{formatShortDay(nextDue)}</Text>
      </Text>
      <Text style={[styles.note, late && { color: theme.colors.error }]}>
        {note}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  panel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  label: {
    flex: 1,
    fontSize: 15,
    color: theme.colors.text,
  },
  date: {
    fontWeight: '600',
  },
  note: {
    fontSize: 15,
    color: theme.colors.label3,
  },
}));
