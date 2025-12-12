import React, { useState } from 'react';
import { Image, View, Text, StyleSheet, ImageErrorEventData, NativeSyntheticEvent } from 'react-native';
import { isValidImageUrl, normalizeImageUrl } from '../utils/imageUtils';

interface AvatarImageProps {
  photoUrl?: string | null;
  name?: string;
  size?: number;
  style?: any;
  fallbackStyle?: any;
  fallbackTextStyle?: any;
}

export default function AvatarImage({
  photoUrl,
  name = '',
  size = 80,
  style,
  fallbackStyle,
  fallbackTextStyle,
}: AvatarImageProps) {
  const [imageError, setImageError] = useState(false);
  
  // Normaliza a URL
  let normalizedUrl: string | null = null;
  if (photoUrl && typeof photoUrl === 'string') {
    const trimmed = photoUrl.trim();
    if (trimmed !== '') {
      // Aceita HTTP, HTTPS e base64
      if (trimmed.startsWith('http://') || 
          trimmed.startsWith('https://') || 
          trimmed.startsWith('data:image/')) {
        normalizedUrl = trimmed;
      }
      // Ignora URIs locais (file://, content://, ph://) que não funcionam do banco
    }
  }
  
  const hasValidUrl = normalizedUrl && !imageError;
  
  const getInitial = (userName?: string) => {
    if (!userName) return '?';
    return userName.charAt(0).toUpperCase();
  };

  const handleError = (error: NativeSyntheticEvent<ImageErrorEventData>) => {
    console.log('Erro ao carregar imagem do avatar. URL:', normalizedUrl?.substring(0, 50) || 'null');
    setImageError(true);
  };

  if (hasValidUrl && normalizedUrl) {
    return (
      <Image
        source={{ uri: normalizedUrl }}
        style={[{ width: size, height: size, borderRadius: size / 2 }, style]}
        onError={handleError}
      />
    );
  }

  // Fallback: mostra inicial do nome
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#4a7f37',
          justifyContent: 'center',
          alignItems: 'center',
        },
        fallbackStyle,
      ]}
    >
      <Text
        style={[
          {
            color: '#fff',
            fontSize: size * 0.4,
            fontWeight: 'bold',
          },
          fallbackTextStyle,
        ]}
      >
        {getInitial(name)}
      </Text>
    </View>
  );
}

