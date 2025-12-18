import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

type Props = {
  name?: string | null;
  size?: number;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
};

export default function Avatar({ name, size = 40, style, textStyle }: Props) {
  const initial = name && typeof name === 'string' && name.trim().length > 0
    ? name.trim().charAt(0).toUpperCase()
    : '?';

  const containerStyle = [
    {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: '#4a7f37',
      justifyContent: 'center',
      alignItems: 'center',
    },
    style,
  ];

  const txtStyle = [
    {
      color: '#fff',
      fontSize: Math.max(12, Math.round(size / 2)),
      fontWeight: '700',
    },
    textStyle,
  ];

  return (
    <View style={containerStyle as any}>
      <Text style={txtStyle as any}>{initial}</Text>
    </View>
  );
}
