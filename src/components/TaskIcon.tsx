import { SymbolView } from 'expo-symbols';
import { View } from 'react-native';
import {
  StyleSheet,
  UnistylesThemes,
  useUnistyles,
} from 'react-native-unistyles';

interface TaskIconProps {
  completedToday: boolean;
  overdue: boolean;
  dueToday: boolean;
}

const getIconColor = ({
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
  if (completedToday) return theme.colors.white;
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

  const isFuture = !completedToday && !overdue && !dueToday;

  const getStatus = () => {
    if (completedToday) return 'completed';
    if (overdue) return 'overdue';
    if (dueToday) return 'dueToday';
    return 'default';
  };

  const status = getStatus();

  const getIcon = () => {
    if (completedToday) {
      return <SymbolView name="checkmark" size={14} tintColor={iconColor} />;
    }

    if (isFuture)
      return (
        <SymbolView
          name={'calendar.badge' as any}
          size={24}
          tintColor={iconColor}
        />
      );

    return null;
  };

  return (
    <View
      style={[
        styles.icon,
        status === 'completed' && styles.iconCompleted,
        status === 'overdue' && styles.iconOverdue,
        status === 'dueToday' && styles.iconDueToday,
        isFuture && styles.iconFuture,
      ]}
    >
      {getIcon()}
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  icon: {
    width: 24,
    height: 24,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  iconCompleted: {
    borderColor: theme.colors.success,
    backgroundColor: theme.colors.success,
  },
  iconOverdue: {
    borderColor: theme.colors.error,
  },
  iconDueToday: {
    borderColor: theme.colors.blue,
  },
  iconFuture: {
    borderColor: 'transparent',
  },
}));
