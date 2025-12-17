import { SymbolView } from 'expo-symbols';
import { useUnistyles } from 'react-native-unistyles';

interface TaskIconProps {
  completedToday: boolean;
  overdue: boolean;
  dueToday: boolean;
}

export default function TaskIcon({
  completedToday,
  overdue,
  dueToday,
}: TaskIconProps) {
  const { theme } = useUnistyles();

  const getIconColor = () => {
    if (overdue) return theme.colors.error;
    if (dueToday) return theme.colors.blue;
    if (completedToday) return theme.colors.success;
    return theme.colors.textSecondary;
  };

  if (completedToday) {
    return <SymbolView name="checkmark" size={18} tintColor={getIconColor()} />;
  }

  if (overdue) {
    return (
      <SymbolView name="exclamationmark" size={18} tintColor={getIconColor()} />
    );
  }

  if (dueToday) {
    return <SymbolView name="circle" size={18} tintColor={getIconColor()} />;
  }

  return (
    <SymbolView
      name={'calendar.badge' as any}
      size={18}
      tintColor={getIconColor()}
    />
  );
}
