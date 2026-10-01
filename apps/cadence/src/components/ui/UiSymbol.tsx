import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons/static';
import { SFSymbol, SymbolView } from 'expo-symbols';
import { UI_SYMBOL_TO_MATERIAL } from '../../utils/glyphs';

interface UiSymbolProps {
  name: SFSymbol;
  size: number;
  color: string;
}

export default function UiSymbol({ name, size, color }: UiSymbolProps) {
  return (
    <SymbolView
      name={name}
      size={size}
      tintColor={color}
      resizeMode="scaleAspectFit"
      fallback={
        <MaterialCommunityIcons
          name={UI_SYMBOL_TO_MATERIAL[name as string] ?? 'help-circle-outline'}
          size={Math.round(size * 1.1)}
          color={color}
        />
      }
    />
  );
}
