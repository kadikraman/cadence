import { SymbolView } from 'expo-symbols';
import { UnistylesThemes, useUnistyles } from 'react-native-unistyles';

interface TaskIconProps {
  completedToday: boolean;
  overdue: boolean;
  dueToday: boolean;
}

export const getIconColor = ({
  overdue,
  dueToday,
  completedToday,
  theme,
}: {
  overdue: boolean;
  dueToday: boolean;
  completedToday: boolean;
  theme: UnistylesThemes['dark'];
}) => {
  if (overdue) return theme.colors.error;
  if (dueToday) return theme.colors.blue;
  if (completedToday) return theme.colors.success;
  return theme.colors.textSecondary;
};

export default function TaskIcon({
  completedToday,
  overdue,
  dueToday,
}: TaskIconProps) {
  const { theme } = useUnistyles();
  const iconColor = getIconColor({
    completedToday,
    overdue,
    dueToday,
    theme,
  });

  if (completedToday) {
    return <SymbolView name="checkmark" size={18} tintColor={iconColor} />;
  }

  if (overdue) {
    return (
      <SymbolView name="exclamationmark" size={18} tintColor={iconColor} />
    );
  }

  if (dueToday) {
    return null;
  }

  return (
    <SymbolView
      name={'calendar.badge' as any}
      size={18}
      tintColor={iconColor}
    />
  );
}
