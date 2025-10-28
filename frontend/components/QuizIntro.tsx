import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import YoutubePlayer from 'react-native-youtube-iframe';
import Header from './Header';

interface QuizIntroProps {
  title: string;
  description: string;
  videoUrl?: string;
  onStart: () => void;
  onBack: () => void;
}

// Função para extrair ID do YouTube
const getYouTubeVideoId = (url: string): string => {
  // Se já for uma URL de embed, extrai o ID
  if (url.includes('youtube.com/embed/')) {
    return url.split('embed/')[1]?.split('?')[0];
  }
  
  let videoId = '';
  
  if (url.includes('youtube.com/watch?v=')) {
    videoId = url.split('v=')[1]?.split('&')[0];
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0];
  } else {
    // Assume que é um ID direto (sem URL completa)
    videoId = url;
  }
  
  return videoId;
};

const QuizIntro: React.FC<QuizIntroProps> = ({
  title,
  description,
  videoUrl,
  onStart,
  onBack
}) => {
  const [playing, setPlaying] = React.useState(false);

  const openYouTubeVideo = async () => {
    const videoId = getYouTubeVideoId(videoUrl || '');
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    try {
      const canOpen = await Linking.canOpenURL(youtubeUrl);
      if (canOpen) {
        await Linking.openURL(youtubeUrl);
      }
    } catch (error) {
      console.log('Erro ao abrir vídeo no YouTube:', error);
    }
  };

  const videoId = videoUrl ? getYouTubeVideoId(videoUrl) : '';

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#1a5d2b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Desafio</Text>
      </View>
      
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="brain" size={60} color="#4a7f37" />
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>

        {videoUrl && videoId && (
          <View style={styles.videoContainer}>
            <Text style={styles.videoTitle}>📹 Assista ao vídeo antes de começar:</Text>
            <YoutubePlayer
              height={200}
              videoId={videoId}
              play={playing}
              onChangeState={(state) => {
                if (state === 'playing') {
                  setPlaying(true);
                }
              }}
              onError={(error) => {
                console.log('Erro ao carregar vídeo:', error);
                setPlaying(false);
              }}
            />
            <TouchableOpacity 
              style={styles.youtubeButton}
              onPress={() => openYouTubeVideo()}
            >
              <MaterialCommunityIcons name="open-in-new" size={20} color="#fff" />
              <Text style={styles.youtubeButtonText}>Abrir no YouTube</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.rulesContainer}>
          <Text style={styles.rulesTitle}>📋 Como funciona:</Text>
          <View style={styles.ruleItem}>
            <Text style={styles.ruleText}>• Responda as perguntas corretamente</Text>
          </View>
          <View style={styles.ruleItem}>
            <Text style={styles.ruleText}>
              • Quanto mais rápido você responder, mais pontos ganha
            </Text>
          </View>
          <View style={styles.ruleItem}>
            <Text style={styles.ruleText}>
              • O timer começará quando você clicar em "Iniciar"
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={onStart}>
          <MaterialCommunityIcons name="play" size={24} color="#fff" />
          <Text style={styles.startButtonText}>Iniciar Desafio</Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ececec',
  },
  container: {
    flex: 1,
    backgroundColor: '#ececec',
  },
  contentContainer: {
    flexGrow: 1,
  },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a5d2b',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 30,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a5d2b',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  videoContainer: {
    width: '100%',
    marginBottom: 30,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  youtubeButton: {
    backgroundColor: '#4a7f37',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 12,
    width: '100%',
  },
  youtubeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  rulesContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
  },
  rulesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  ruleItem: {
    marginBottom: 8,
  },
  ruleText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: '#4a7f37',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 60,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
});

export default QuizIntro;
