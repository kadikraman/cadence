import { CompletionStatus } from './statsUtils';

export const withAlpha = (hex: string, alpha: number): string => {
  const n = parseInt(hex.slice(1, 7), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${alpha})`;
};

interface StatusPalette {
  success: string;
  warning: string;
  blue: string;
  label4: string;
}

export const completionStatusColor = (
  status: CompletionStatus,
  colors: StatusPalette
): string => {
  if (status === 'late') return colors.warning;
  if (status === 'early') return colors.blue;
  if (status === 'first') return colors.label4;
  return colors.success;
};
