import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants';
import Header from '@/components/Header';
import BackButton from '@/components/BackButton';
import AvatarImage from '@/components/AvatarImage';

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
    
    // 1. CARREGAMENTO DE DADOS DE NÍVEL SUPERIOR
    setName(extractProfileField(user.name));
    setPhone(extractProfileField(user.phone));

    // Carrega a foto do usuário (pode ser base64 ou URL)
    if (user.photoUrl && typeof user.photoUrl === 'string') {
      const trimmed = user.photoUrl.trim();
      if (trimmed.startsWith('data:image/') || 
          trimmed.startsWith('http://') || 
          trimmed.startsWith('https://')) {
        setPhotoUrl(trimmed);
      } else {
        // Se for URI local antiga, limpa
        setPhotoUrl(null);
      }
    } else {
      setPhotoUrl(null);
    }

    // 2. CARREGAMENTO DE DADOS DE ENDEREÇO
    // addressObject é o objeto aninhado que contém street, city, state, etc.
    const addressObject = user.address && typeof user.address === 'object' 
        ? user.address 
        : {};
    
    // Type assertion para acessar propriedades dinâmicas que podem existir no banco
    const addr = addressObject as any;
    
    // ✅ CORREÇÃO CHAVES MOONGOSE: Acessa as chaves aninhadas definidas no seu Model.
    // Inclui tentativas de chaves comuns para o Endereço (rua/logradouro).
    setAddress(extractProfileField(
        addressObject.street ||          // Chave do seu schema
        addr.logradouro ||               // Tentativa 2 (Comum no Brasil)
        addr.rua ||                      // Tentativa 3 (Comum no Brasil)
        addr.endereco ||                 // Tentativa 4
        addr.line1                       // Tentativa 5
    )); 
    
    // As chaves abaixo usam o padrão do seu schema (city, state, zipCode)
    setCity(extractProfileField(addressObject.city));
    setState(extractProfileField(addressObject.state));
    setZipCode(extractProfileField(addr.zipCode));

    // Bio
    setBio(extractProfileField(user.bio));
    
    // 💡 LOG DE VERIFICAÇÃO FINAL: Verifique o console para ver o valor de 'street'
    console.log("Valores carregados (street/city/state): ", { 
        name: extractProfileField(user.name),
        phone: extractProfileField(user.phone), 
        street: extractProfileField(addressObject.street), 
        logradouro: extractProfileField(addr.logradouro),
        rua: extractProfileField(addr.rua),            
        city: extractProfileField(addressObject.city),     
        bio: extractProfileField(user.bio) 
    });

  }, [user]);

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar a galeria.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7, // Qualidade razoável para upload
      allowsMultipleSelection: false,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const uri = asset.uri;
      
      // Faz upload da imagem para o servidor
      try {
        await uploadImageToServer(uri);
      } catch (error: any) {
        console.error('Erro ao fazer upload da imagem:', error);
        Alert.alert('Erro', error.message || 'Não foi possível fazer upload da imagem. Tente novamente.');
      }
    }
  };

  const uploadImageToServer = async (imageUri: string) => {
    try {
      // Cria FormData para enviar o arquivo
      const formData = new FormData();
      
      // Obtém o nome do arquivo da URI
      const filename = imageUri.split('/').pop() || 'image.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;
      
      // Adiciona o arquivo ao FormData (formato correto para React Native)
      formData.append('image', {
        uri: Platform.OS === 'android' ? imageUri : imageUri.replace('file://', ''),
        name: filename,
        type: type,
      } as any);

      // Obtém o token de autenticação
      const token = await AsyncStorage.getItem('@AppBeneficios:token');
      
      if (!token) {
        throw new Error('Usuário não autenticado');
      }

      // Faz o upload (NÃO inclui Content-Type no header, o fetch define automaticamente)
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // NÃO definir Content-Type aqui, o fetch define automaticamente com boundary
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Erro ao fazer upload da imagem');
      }

      const data = await response.json();
      console.log('Upload realizado com sucesso:', data.imageUrl);
      
      // Salva a URL da imagem
      setPhotoUrl(data.imageUrl);
    } catch (error: any) {
      console.error('Erro no upload:', error);
      throw error;
    }
  };

  const handleUpdate = async () => {
    if (!name || !phone) {
      Alert.alert('Erro', 'Preencha nome e telefone.');
      return;
    }
    
    // Não precisa mais verificar tamanho de base64, pois agora usamos upload de arquivo
    
    // 3. ENVIO DE DADOS (Envia o endereço como objeto aninhado, conforme Model)
    const updatedData = {
      name,
      phone,
      photoUrl: photoUrl || undefined, // Converte null para undefined
      bio: bio || undefined,
      address: {
          street: address || undefined,
          city: city || undefined,
          state: state || undefined,
          zipCode: zipCode || undefined,
      }
    };

    try {
      console.log('Enviando atualização de perfil...');
      await updateProfile(updatedData); 
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      router.replace('/profile');
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Falha ao atualizar. Tente novamente.';
      Alert.alert('Erro', errorMessage);
    }
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
            <BackButton />

            <View style={styles.header}>
              <Text style={styles.title}>Atualizar Perfil</Text>
              <Text style={styles.subtitle}>Altere suas informações</Text>
            </View>

            <TouchableOpacity onPress={handleImagePicker} style={styles.profileImageContainer}>
              <AvatarImage
                photoUrl={photoUrl}
                name={user?.name || name}
                size={120}
                style={styles.profileImage}
                fallbackStyle={styles.initialContainer}
                fallbackTextStyle={styles.initialText}
              />
              <View style={styles.cameraIcon}>
                <Ionicons name="camera" size={24} color="#fff" />
              </View>
            </TouchableOpacity>

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