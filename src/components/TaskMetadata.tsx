import { Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

interface TaskMetadataProps {
  status: 'completed' | 'overdue' | 'dueToday' | 'default';
  completedToday: boolean;
  dueInText: string;
}

export default function TaskMetadata({
  status,
  completedToday,
  dueInText,
}: TaskMetadataProps) {
  const { theme } = useUnistyles();

  const getClockIconColor = () => {
    if (status === 'overdue' || status === 'dueToday')
      return theme.colors.white;
    return theme.colors.text;
  };

  const getBadgeBackgroundColor = () => {
    if (status === 'overdue') return theme.colors.error;
    if (status === 'dueToday') return theme.colors.blue;
    return 'transparent';
  };

  const showBadge = status === 'overdue' || status === 'dueToday';

  const textContent = completedToday ? 'Completed today' : dueInText;

  return (
    <View style={styles.metadataContainer}>
      <View style={styles.metadata}>
        {showBadge ? (
          <View
            style={[
              styles.badge,
              { backgroundColor: getBadgeBackgroundColor() },
            ]}
          >
            <EvilIcons name="clock" size={16} color={getClockIconColor()} />
            <Text style={styles.badgeText}>{textContent}</Text>
          </View>
        ) : (
          <>
            <EvilIcons name="clock" size={16} color={getClockIconColor()} />
            <Text style={styles.dueIn}>{textContent}</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  metadataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metadata: {
    gap: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueIn: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    flexDirection: 'row',
    gap: 4,
  },
  badgeText: {
    fontSize: 10,
    color: theme.colors.white,
    fontWeight: '500',
  },
}));
