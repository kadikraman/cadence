import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons/static';
import { SymbolView } from 'expo-symbols';
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { Task } from '../../lib/types';
import { getMaterialIcon, getSymbol } from '../../utils/glyphs';
import { getTint } from '../../utils/taskTints';
import { formatCadence, relativeLabel } from '../../utils/taskUtils';

function ArchivedRow({
  task,
  onPress,
}: {
  task: Task;
  onPress: (task: Task) => void;
}) {
  const { theme, rt } = useUnistyles();
  const dark = rt.themeName === 'dark';
  const tint = getTint(task.color);
  const tintAccent = dark ? tint.accentDark : tint.accent;
  const tintBg = dark ? tint.tintDark : tint.tint;

  const lastLabel = task.lastCompletedAt
    ? `Last done ${relativeLabel(task.lastCompletedAt).toLowerCase()}`
    : 'Never completed';

  return (
    <Pressable
      style={styles.row}
      onPress={() => onPress(task)}
      android_ripple={{ color: theme.colors.fill2, borderless: false }}
    >
      <View style={[styles.tile, { backgroundColor: tintBg }]}>
        <SymbolView
          name={getSymbol(task.glyph)}
          size={20}
          tintColor={tintAccent}
          resizeMode="scaleAspectFit"
          fallback={
            <MaterialCommunityIcons
              name={getMaterialIcon(task.glyph)}
              size={20}
              color={tintAccent}
            />
          }
        />
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>
          {task.title}
        </Text>
        <Text style={styles.sub} numberOfLines={1}>
          {formatCadence(task.cadence)} · {lastLabel}
        </Text>
      </View>
      <SymbolView
        name="chevron.right"
        size={14}
        tintColor={theme.colors.label4}
        resizeMode="scaleAspectFit"
        fallback={
          <MaterialCommunityIcons
            name="chevron-right"
            size={22}
            color={theme.colors.label3}
          />
        }
      />
    </Pressable>
  );
}

const styles = StyleSheet.create(theme => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  tile: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  },
  sub: {
    fontSize: 13,
    color: theme.colors.label3,
    marginTop: 2,
  },
}));

export default memo(ArchivedRow);
