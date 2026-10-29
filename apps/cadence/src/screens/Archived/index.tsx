import { useObserve } from 'expo-observe';
import { Stack } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import FormGroup from '../../components/ui/FormGroup';
import ArchivedRow from './ArchivedRow';
import { useArchived } from './useArchived';

export default function ArchivedScreen() {
  const { theme } = useUnistyles();
  const { archived, openTask } = useArchived();

  const { markInteractive } = useObserve();

  useEffect(() => {
    markInteractive();
  }, [markInteractive]);

  return (
    <View style={styles.root}>
      <Stack.Title large>Archived</Stack.Title>

      {archived.length === 0 ? (
        <View style={styles.empty}>
          <SymbolView
            name="archivebox"
            size={44}
            tintColor={theme.colors.label3}
            resizeMode="scaleAspectFit"
            fallback={null}
          />
          <Text style={styles.emptyTitle}>No archived tasks</Text>
          <Text style={styles.emptyText}>
            Tasks you archive are hidden from your list and the widget, but kept
            here with their full history.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          contentInsetAdjustmentBehavior="automatic"
        >
          <FormGroup>
            {archived.map((t, i) => (
              <View key={t.id}>
                {i > 0 && <View style={styles.sep} />}
                <ArchivedRow task={t} onPress={openTask} />
              </View>
            ))}
          </FormGroup>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.groupedBackground,
    paddingLeft: rt.insets.left,
    paddingRight: rt.insets.right,
  },
  scroll: {
    paddingBottom: 40,
  },
  sep: {
    height: 0.5,
    backgroundColor: theme.colors.sepSubtle,
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
    fontWeight: '600',
    color: theme.colors.text,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.label3,
    textAlign: 'center',
    lineHeight: 20,
  },
}));
