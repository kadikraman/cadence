import { SymbolView } from 'expo-symbols';
import { View } from 'react-native';
import { useUnistyles } from 'react-native-unistyles';
import { Task } from '../../lib/storage';
import { getSymbol, GlyphKey } from '../../utils/glyphs';
import { ColorKey, getTint } from '../../utils/taskTints';

interface TaskTileProps {
  task?: Pick<Task, 'color' | 'glyph'>;
  color?: ColorKey;
  glyph?: GlyphKey;
  size?: number;
  overdue?: boolean;
}

export default function TaskTile({
  task,
  color,
  glyph,
  size = 40,
  overdue = false,
}: TaskTileProps) {
  const { rt } = useUnistyles();
  const dark = rt.themeName === 'dark';
  const c = getTint(task?.color ?? color);
  const bg = overdue
    ? dark
      ? 'rgba(255,69,58,0.22)'
      : '#FFE5E5'
    : dark
      ? c.tintDark
      : c.tint;
  const fg = overdue ? (dark ? '#FF453A' : '#FF3B30') : c.accent;
  const symbolName = getSymbol(task?.glyph ?? glyph);

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: Math.max(7, size * 0.28),
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <SymbolView
        name={symbolName}
        size={Math.round(size * 0.58)}
        tintColor={fg}
        resizeMode="scaleAspectFit"
        fallback={null}
      />
    </View>
  );
}
