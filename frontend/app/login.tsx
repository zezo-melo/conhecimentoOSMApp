// LoginScreen.js
import { Ionicons } from '@expo/vector-icons';
import Swiper from 'react-native-swiper';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  View
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'expo-router'; // Importa o hook useRouter do Expo Router

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, isLoading } = useAuth();
  const router = useRouter(); // Inicializa o router

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }
    
    try {
      await signIn(email, password);
      // O contexto já cuida da navegação em um cenário real
      // Se necessário, você pode usar 'router.replace("(tabs)")' para ir para a tela principal
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Recuperar Senha', 'Funcionalidade será implementada em breve');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Logo e Título */}
          <View style={styles.header}>
            <Image
                    source={require('../assets/images/osm-logo.png')}
                    style={styles.logoOsm}
                    resizeMode="contain"
                  />
            <Text style={styles.title}>App do Conhecimento</Text>
            <Text style={styles.subtitle}>Faça login para continuar</Text>
          </View>

          {/* Formulário */}
          <View style={styles.form}>
            {/* Campo Email */}
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Ionicons name="mail" size={20} color="#fff" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Digite seu email"
                placeholderTextColor="#fff"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            {/* Campo Senha */}
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Ionicons name="lock-closed" size={20} color="#fff" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                placeholderTextColor="#fff"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                editable={!isLoading}
              />
              <TouchableOpacity 
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                <Ionicons 
                  name={showPassword ? "eye-off" : "eye"} 
                  size={20} 
                  color="#fff" 
                />
              </TouchableOpacity>
            </View>

            {/* Esqueci a senha */}
            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={handleForgotPassword}
              disabled={isLoading}
            >
              <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
            </TouchableOpacity>

            {/* Botão de Login */}
            <TouchableOpacity 
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Text style={styles.loginButtonText}>Entrar</Text>
                  <Ionicons name="arrow-forward" size={20} color="#fff" />
                </>
              )}
            </TouchableOpacity>

            {/* Divisor */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Botão de Cadastro */}
            <TouchableOpacity 
              style={styles.registerButton}
              onPress={() => router.navigate('register')} // Atualizado para usar o router
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <Text style={styles.registerButtonText}>Criar nova conta</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Ao fazer login, você concorda com nossos{' '}
              <Text style={styles.linkText}>Termos de Uso</Text> e{' '}
              <Text style={styles.linkText}>Política de Privacidade</Text>
            </Text>
          </View>
        </View>        
      </KeyboardAvoidingView>
    </SafeAreaView>
    </ScrollView>
    </KeyboardAvoidingView>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,

  },
  logoContainer: {
    flexDirection: 'row',
  },
logoCarousel: {
  height: 80,
  width: '100%',
  marginVertical: 20,
},

logo: {
  width: 120,
  height: 80,
  alignSelf: 'center',
},
  logoOsm: {
    width: 250,
    height: 80,
    marginLeft: -40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4a7f37',
  },
  subtitle: {
    fontSize: 16,
    color: '#4a7f37',
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
    color: '#fff',

  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a7f37',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#4a7f37',
  },
  inputIcon: {
    marginRight: 12,
    color: '#4a7f37'
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    paddingVertical: 16,
  },
  eyeIcon: {
    padding: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#4a7f37',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#4a7f37',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#4a7f37',
    marginBottom: 20
  },
  dividerText: {
    color: '#4a7f37',
    fontSize: 14,
    marginHorizontal: 16,
    marginBottom: 20

  },
  registerButton: {
    borderWidth: 2,
    borderColor: '#4a7f37',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',

  },
  registerButtonText: {
    color: '#4a7f37',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 20 
  },
  footerText: {
    color: '#4a7f37',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom:60,

  },
  linkText: {
    color: '#4a7f37',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});
