import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons/static';
import { useObserve } from 'expo-observe';
import { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import TopAppBar from '../../components/ui/android/TopAppBar';
import ArchivedRow from './ArchivedRow';
import { useArchived } from './useArchived';

export default function ArchivedScreen() {
  const { theme, rt } = useUnistyles();
  const { router, archived, openTask } = useArchived();

  const { markInteractive } = useObserve();

  useEffect(() => {
    markInteractive();
  }, [markInteractive]);

  return (
    <View style={[styles.root, { paddingTop: rt.insets.top }]}>
      <TopAppBar title="Archived" onBack={() => router.back()} />

      {archived.length === 0 ? (
        <View style={styles.empty}>
          <MaterialCommunityIcons
            name="archive-outline"
            size={48}
            color={theme.colors.label3}
          />
          <Text style={styles.emptyTitle}>No archived tasks</Text>
          <Text style={styles.emptyText}>
            Tasks you archive are hidden from your list and the widget, but kept
            here with their full history.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          <View
            style={[
              styles.group,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.outlineVariant,
              },
            ]}
          >
            {archived.map((t, i) => (
              <View key={t.id}>
                {i > 0 && (
                  <View
                    style={[
                      styles.sep,
                      { backgroundColor: theme.colors.outlineVariant },
                    ]}
                  />
                )}
                <ArchivedRow task={t} onPress={openTask} />
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.groupedBackground,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  group: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  sep: {
    height: 1,
    marginLeft: 68,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 80,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: theme.colors.text,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.label2,
    textAlign: 'center',
    lineHeight: 20,
  },
}));
