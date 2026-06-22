import { useObserve } from 'expo-observe';
import { SymbolView } from 'expo-symbols';
import { useEffect } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import FormGroup from '../../components/ui/FormGroup';
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
      <View style={styles.nav}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <SymbolView
            name="chevron.left"
            size={18}
            tintColor={theme.colors.blue}
            resizeMode="scaleAspectFit"
            fallback={null}
          />
          <Text style={styles.backText}>Settings</Text>
        </Pressable>
      </View>
      <Text style={styles.title}>Archived</Text>

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
        <ScrollView contentContainerStyle={styles.scroll}>
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

const styles = StyleSheet.create(theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.groupedBackground,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    padding: 4,
  },
  backText: {
    color: theme.colors.blue,
    fontSize: 17,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: theme.colors.text,
    letterSpacing: 0.37,
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 12,
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
