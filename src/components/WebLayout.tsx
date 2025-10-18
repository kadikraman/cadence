import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

interface WebLayoutProps {
  children: React.ReactNode;
  maxWidth?: number;
}

export default function WebLayout({
  children,
  maxWidth = 800,
}: WebLayoutProps) {
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.content, { maxWidth }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  content: {
    flex: 1,
    width: '100%',
  },
});
