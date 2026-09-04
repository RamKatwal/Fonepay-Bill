import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme';

export type IconName = keyof typeof Ionicons.glyphMap;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

export function Icon({ name, size = 22, color }: IconProps) {
  const t = useTheme();
  return <Ionicons name={name} size={size} color={color ?? t.text.secondary} />;
}
