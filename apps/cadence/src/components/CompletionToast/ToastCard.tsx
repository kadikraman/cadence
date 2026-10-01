import { Pressable, Text, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import UiSymbol from '../ui/UiSymbol';
import type { CompletionToastData } from './types';

interface ToastCardProps {
  toast: CompletionToastData;
  onChange: () => void;
  onUndo: () => void;
}

export default function ToastCard({ toast, onChange, onUndo }: ToastCardProps) {
  return (
    <View style={styles.toast}>
      <UiSymbol name="checkmark.circle.fill" size={21} color="#30D158" />
      <View style={styles.text}>
        <Text style={styles.title}>{toast.title}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {toast.subtitle}
        </Text>
      </View>
      {toast.canChange && (
        <Pressable
          onPress={onChange}
          accessibilityRole="button"
          style={styles.changeBtn}
        >
          <Text style={styles.action}>Change</Text>
        </Pressable>
      )}
      <Pressable onPress={onUndo} accessibilityRole="button" hitSlop={8}>
        <Text style={styles.action}>Undo</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor:
      rt.themeName === 'dark' ? 'rgba(58,58,60,0.96)' : 'rgba(28,28,30,0.94)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
  },
  text: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.white,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(235,235,245,0.6)',
    marginTop: 1,
  },
  changeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(10,132,255,0.18)',
  },
  action: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0A84FF',
  },
}));
