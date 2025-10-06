import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function BackButton() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity 
      onPress={() => navigation.goBack()} 
      style={{ paddingBottom: 10 }}
    >
      <Ionicons name="arrow-back" size={24} color="#4a7f37" />
    </TouchableOpacity>
  );
}
