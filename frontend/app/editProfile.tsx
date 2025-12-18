import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import Avatar from '../components/Avatar';
import { useRouter } from 'expo-router';
// Image picker/upload disabled for now
import Header from '@/components/Header';
import BackButton from '@/components/BackButton';

export default function UpdateProfileScreen() {
  const { user, updateProfile, isLoading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [bio, setBio] = useState('');

  // Função helper para garantir que a saída é uma string limpa
  const extractProfileField = (field: any): string => {
    if (field === null || field === undefined) return '';
    
    let result = '';
    if (typeof field === "string") {
      result = field;
    } else if (typeof field === "object") {
      result = field.value || field.bio || field.address || field.name || '';
    } else {
      result = String(field);
    }

    const lowerTrimmed = result.trim().toLowerCase();
    if (lowerTrimmed === 'object' || lowerTrimmed === 'null' || lowerTrimmed === 'undefined') {
      return '';
    }
    return result.trim();
  };

  useEffect(() => {
    if (!user) return;

    const profile = user.profile || {};
    
    // 1. CARREGAMENTO DE DADOS DE NÍVEL SUPERIOR
    setName(extractProfileField(profile.name || user.name));
    setPhone(extractProfileField(profile.phone || user.phone));

    setPhotoUrl(
      profile.photoUrl?.trim()
        ? profile.photoUrl
        : user.photoUrl?.trim()
        ? user.photoUrl
        : null
    );

    // 2. CARREGAMENTO DE DADOS DE ENDEREÇO
    // addressObject é o objeto aninhado que contém street, city, state, etc.
    const addressObject = user.address && typeof user.address === 'object' 
        ? user.address 
        : profile.address && typeof profile.address === 'object' 
        ? profile.address 
        : {}; 

    // ✅ CORREÇÃO CHAVES MOONGOSE: Acessa as chaves aninhadas definidas no seu Model.
    // Inclui tentativas de chaves comuns para o Endereço (rua/logradouro).
    setAddress(extractProfileField(
        addressObject.street ||          // Chave do seu schema
        addressObject.logradouro ||      // Tentativa 2 (Comum no Brasil)
        addressObject.rua ||             // Tentativa 3 (Comum no Brasil)
        addressObject.endereco ||        // Tentativa 4
        addressObject.line1              // Tentativa 5
    )); 
    
    // As chaves abaixo usam o padrão do seu schema (city, state, zipCode)
    setCity(extractProfileField(addressObject.city));
    setState(extractProfileField(addressObject.state));
    setZipCode(extractProfileField(addressObject.zipCode));

    // Bio
    setBio(extractProfileField(user.bio || profile.bio));
    
    // 💡 LOG DE VERIFICAÇÃO FINAL: Verifique o console para ver o valor de 'street'
    console.log("Valores carregados (street/city/state): ", { 
        name: extractProfileField(user.name),
        phone: extractProfileField(user.phone), 
        street: extractProfileField(addressObject.street), 
        logradouro: extractProfileField(addressObject.logradouro),
        rua: extractProfileField(addressObject.rua),            
        city: extractProfileField(addressObject.city),     
        bio: extractProfileField(user.bio) 
    }); 

  }, [user]);

  // Image upload is disabled for now — we show initials instead of avatars.

  const handleUpdate = async () => {
    if (!name || !phone) {
      Alert.alert('Erro', 'Preencha nome e telefone.');
      return;
    }
    
    // 3. ENVIO DE DADOS (Envia o endereço como objeto aninhado, conforme Model)
    const updatedData = {
      name,
      phone,
      photoUrl,
      bio,
      address: {
          street: address, // Envia o valor do campo "Endereço" para a chave 'street'
          city: city,
          state: state,
          zipCode: zipCode,
      }
    };

    try {
      // For now we don't upload photos; just update textual profile fields.
      await updateProfile(updatedData);
      Alert.alert('Sucesso', 'Perfil atualizado');
      router.replace('/profile');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Falha ao atualizar.');
    }
  };

  const getInitial = (userName?: string) =>
    userName ? userName.charAt(0).toUpperCase() : '';

  const hasValidPhoto = !!photoUrl && photoUrl.trim() !== '';

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <BackButton />

            <View style={styles.header}>
              <Text style={styles.title}>Atualizar Perfil</Text>
              <Text style={styles.subtitle}>Altere suas informações</Text>
            </View>

            <View style={styles.profileImageContainer}>
              <Avatar name={user?.name || name} size={120} />
            </View>

            <View style={styles.form}>
              {/* Nome */}
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Ionicons name="person" size={20} color="#4a7f37" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Nome completo"
                  placeholderTextColor="#999"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              {/* Email (readonly) */}
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Ionicons name="mail" size={20} color="#4a7f37" />
                </View>
                <TextInput
                  style={[styles.input, styles.inputDisabled]}
                  value={user?.email || ''}
                  editable={false}
                />
              </View>

              {/* Telefone */}
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
                />
              </View>

              {/* Endereço (Rua/Logradouro) */}
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Ionicons name="location" size={20} color="#4a7f37" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Endereço (Rua, Av.)"
                  placeholderTextColor="#999"
                  value={address} 
                  onChangeText={setAddress}
                />
              </View>

              {/* Cidade */}
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
                />
              </View>

              {/* Estado */}
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
                />
              </View>

              {/* CEP */}
              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Ionicons name="location" size={20} color="#4a7f37" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="CEP"
                  placeholderTextColor="#999"
                  value={zipCode}
                  keyboardType="numeric"
                  onChangeText={setZipCode}
                />
              </View>

              {/* BIO */}
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
                />
              </View>

              <TouchableOpacity
                style={[styles.updateButton, isLoading && styles.updateButtonDisabled]}
                onPress={handleUpdate}
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
  container: { flex: 1, backgroundColor: '#fff' },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 40,
  },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between' },
  header: { alignItems: 'center', paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#4a7f37', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center' },
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
    overflow: 'hidden',
  },
  profileImage: { width: '100%', height: '100%' },
  initialContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#4a7f37',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialText: { color: '#fff', fontSize: 50, fontWeight: 'bold' },
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
  form: { flex: 1, justifyContent: 'center', paddingVertical: 20, paddingBottom: 40 },
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
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: '#333', paddingVertical: 16 },
  bioInput: { minHeight: 100, textAlignVertical: 'center' },
  inputDisabled: { backgroundColor: '#e9ecef', color: '#999' },
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
  updateButtonDisabled: { backgroundColor: '#ccc', opacity: 0.7 },
  updateButtonText: { color: '#fff', fontSize: 18, fontWeight: '600', marginRight: 8 },
});