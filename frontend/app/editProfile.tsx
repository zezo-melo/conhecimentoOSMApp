import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Header from '@/components/Header';

export default function UpdateProfileScreen() {
  const { user, updateProfile, isLoading, completeMission } = useAuth();
  const router = useRouter();

  // Inicializa o estado com os dados do usuário ou com strings vazias
  const [name, setName] = useState(user?.profile?.name || '');
  const [phone, setPhone] = useState(user?.profile?.phone || '');
  const [photoUrl, setPhotoUrl] = useState<string | null>(user?.profile?.photoUrl || null);
  const [address, setAddress] = useState(user?.profile?.address || '');
  const [city, setCity] = useState(user?.profile?.city || '');
  const [state, setState] = useState(user?.profile?.state || '');
  const [zipCode, setZipCode] = useState(user?.profile?.zipCode || '');
  const [bio, setBio] = useState(user?.profile?.bio || '');

  // O useEffect não é mais necessário porque o estado é inicializado diretamente com os dados do usuário
  
  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar a sua galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setPhotoUrl(result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    if (!name || !phone) {
      Alert.alert('Erro', 'Por favor, preencha o nome e o telefone.');
      return;
    }

    const updatedData = {
      name,
      phone,
      photoUrl,
      address,
      city,
      state,
      zipCode,
      bio,
    };

    try {
      await updateProfile(updatedData);
      await completeMission('1');
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      router.replace('/profile');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao atualizar o perfil. Tente novamente.');
    }
  };

  const getInitial = (userName: string) => {
    return userName ? userName.charAt(0).toUpperCase() : '';
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Atualizar Perfil</Text>
              <Text style={styles.subtitle}>Altere as suas informações da conta</Text>
            </View>

            <TouchableOpacity onPress={handleImagePicker} style={styles.profileImageContainer}>
              {photoUrl ? (
                <Image source={{ uri: photoUrl }} style={styles.profileImage} />
              ) : (
                <View style={styles.initialContainer}>
                  <Text style={styles.initialText}>{getInitial(name)}</Text>
                </View>
              )}
              <View style={styles.cameraIcon}>
                <Ionicons name="camera" size={24} color="#fff" />
              </View>
            </TouchableOpacity>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Ionicons name="person" size={20} color="#4a7f37" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder={user?.name}
                  placeholderTextColor="#999"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Ionicons name="mail" size={20} color="#4a7f37" />
                </View>
                <TextInput
                  style={[styles.input, styles.inputDisabled]}
                  placeholder="Email"
                  placeholderTextColor="#999"
                  value={user?.email || ''}
                  editable={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Ionicons name="call" size={20} color="#4a7f37" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Telefone"
                  placeholderTextColor="#999"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Ionicons name="location" size={20} color="#4a7f37" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Endereço"
                  placeholderTextColor="#999"
                  value={address}
                  onChangeText={setAddress}
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Ionicons name="location" size={20} color="#4a7f37" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Cidade"
                  placeholderTextColor="#999"
                  value={city}
                  onChangeText={setCity}
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Ionicons name="map" size={20} color="#4a7f37" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Estado"
                  placeholderTextColor="#999"
                  value={state}
                  onChangeText={setState}
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Ionicons name="location" size={20} color="#4a7f37" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="CEP"
                  placeholderTextColor="#999"
                  value={zipCode}
                  onChangeText={setZipCode}
                  keyboardType="numeric"
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Ionicons name="book" size={20} color="#4a7f37" />
                </View>
                <TextInput
                  style={[styles.input, styles.bioInput]}
                  placeholder="Biografia breve"
                  placeholderTextColor="#999"
                  value={bio}
                  onChangeText={setBio}
                  multiline
                  numberOfLines={4}
                  editable={!isLoading}
                />
              </View>

              <TouchableOpacity
                style={[styles.updateButton, isLoading && styles.updateButtonDisabled]}
                onPress={handleUpdate}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Text style={styles.updateButtonText}>Salvar</Text>
                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4a7f37',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#4a7f37',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  initialContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#4a7f37',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialText: {
    color: '#fff',
    fontSize: 50,
    fontWeight: 'bold',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#4a7f37',
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
    paddingBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 16,
  },
  bioInput: {
    minHeight: 100,
    textAlignVertical: 'center',
  },
  inputDisabled: {
    backgroundColor: '#e9ecef',
    color: '#999',
  },
  updateButton: {
    backgroundColor: '#4a7f37',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  updateButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
});
