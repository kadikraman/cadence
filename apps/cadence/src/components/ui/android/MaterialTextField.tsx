import { useState } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

interface MaterialTextFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  multiline?: boolean;
}

export default function MaterialTextField({
  label,
  multiline = false,
  value,
  onFocus,
  onBlur,
  ...rest
}: MaterialTextFieldProps) {
  const { theme } = useUnistyles();
  const [focused, setFocused] = useState(false);
  const hasValue = !!value && value.length > 0;
  const floating = focused || hasValue;

  const borderColor = focused ? theme.colors.primary : theme.colors.outline;
  const labelColor = focused ? theme.colors.primary : theme.colors.label2;

  return (
    <View style={styles.wrapper}>
      <TextInput
        {...rest}
        value={value}
        onFocus={e => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={e => {
          setFocused(false);
          onBlur?.(e);
        }}
        multiline={multiline}
        placeholderTextColor={theme.colors.label3}
        style={[
          styles.input,
          {
            borderColor,
            borderWidth: focused ? 2 : 1,
            color: theme.colors.text,
          },
          multiline && styles.multiline,
        ]}
      />
      <View
        style={[
          styles.labelBg,
          {
            backgroundColor: floating ? theme.colors.background : 'transparent',
            top: floating ? -8 : multiline ? 14 : 18,
          },
        ]}
      >
        <Text
          style={[
            styles.label,
            {
              color: labelColor,
              fontSize: floating ? 12 : 16,
            },
          ]}
        >
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create(() => ({
  wrapper: {
    position: 'relative',
  },
  input: {
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    letterSpacing: 0.15,
    minHeight: 56,
  },
  multiline: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  labelBg: {
    position: 'absolute',
    left: 12,
    paddingHorizontal: 4,
  },
  label: {
    letterSpacing: 0.15,
  },
}));
