import React, { useMemo, useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import BackButton from '@/components/BackButton';
import QuizIntro from '../components/QuizIntro';

type Option = { key: 'A' | 'B' | 'C' | 'D'; text: string };
type Question = { id: number; title: string; options: Option[]; correct: 'A' | 'B' | 'C' | 'D' };
type MissionData = {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  questions: Question[];
};

export default function QuizMission6() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [missionData, setMissionData] = useState<MissionData | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();
  const { refreshProfile } = useAuth();
  const { missionId = 'quiz6' } = useLocalSearchParams();

  // Carregar dados da missão
  useEffect(() => {
    const loadMissionData = async () => {
      try {
        const token = await AsyncStorage.getItem('@AppBeneficios:token');
        const response = await axios.get(`${API_URL}/missions/mission/${missionId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMissionData(response.data);
      } catch (error) {
        console.error('Erro ao carregar dados da missão:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados da missão');
      } finally {
        setIsLoading(false);
      }
    };

    loadMissionData();
  }, [missionId]);

  const question = useMemo(() => missionData?.questions[current], [current, missionData]);
  const isLast = current === (missionData?.questions.length || 0) - 1;

  // Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (startTime && !showIntro) {
      interval = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [startTime, showIntro]);

  const handleStartQuiz = () => {
    setShowIntro(false);
    setStartTime(Date.now());
  };

  const verify = () => {
    if (!selected || !question) return;
    setFeedback(selected === question.correct ? 'correct' : 'wrong');
  };

  const nextOrFinish = async () => {
    if (feedback === null || !question) return;
    const isAnswerCorrect = feedback === 'correct';
    if (!isLast) {
      if (isAnswerCorrect) setCorrectCount((c) => c + 1);
      setSelected(null);
      setFeedback(null);
      setCurrent((c) => c + 1);
      return;
    }
    
    const finalCorrect = isAnswerCorrect ? correctCount + 1 : correctCount;
    
    try {
      let endpoint = '/missions/complete-quiz-mission';
      let payload: { correctCount?: number; timeSpent?: number; totalTime?: number; correctAnswers?: number } = {};
      
      if (missionId === 'quiz3') {
        endpoint = '/missions/complete-quiz-mission-3';
        payload = { correctCount: finalCorrect, timeSpent: timeSpent };
      } else if (missionId === 'quiz4') {
        endpoint = '/missions/complete-quiz-mission-4';
        payload = { correctCount: finalCorrect, timeSpent: timeSpent };
      } else if (missionId === 'quiz5') {
        endpoint = '/missions/complete-quiz-mission-5';
        payload = { correctCount: finalCorrect, timeSpent: timeSpent };
      } else if (missionId === 'quiz6') {
        endpoint = '/missions/complete-mission-quiz6';
        payload = { totalTime: timeSpent, correctAnswers: finalCorrect };
      } else if (missionId === 'quiz7') {
        endpoint = '/missions/complete-mission-quiz7';
        payload = { totalTime: timeSpent, correctAnswers: finalCorrect };
      } else {
        payload = { correctCount: finalCorrect, timeSpent: timeSpent };
      }
      
      const token = await AsyncStorage.getItem('@AppBeneficios:token');
      await axios.post(`${API_URL}${endpoint}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await refreshProfile();
      router.back();
    } catch (error) {
      console.error('Erro ao completar missão:', error);
      Alert.alert('Erro', 'Não foi possível completar a missão');
    }
  };

  const nextButtonLabel = useMemo(() => {
    if (isLast) {
      const pendingCorrect = feedback === 'correct' ? 1 : 0;
      const totalCorrect = correctCount + pendingCorrect;
      
      // Para quiz6 e quiz7, usar a lógica específica do backend (15 base + bônus por acertos)
      if (missionId === 'quiz6' || missionId === 'quiz7') {
        const basePoints = 15;
        const totalQuestions = missionData?.questions.length || 4;
        const correctRatio = totalCorrect / totalQuestions;
        const baseBonus = 5;
        const finalBonus = Math.round(baseBonus * correctRatio);
        const awarded = basePoints + finalBonus;
        return `Finalizar (+${awarded} pontos)`;
      }
      
      // Para outros quizzes, usar a lógica padrão
      const basePoints = totalCorrect * 2;
      const timeBonus = Math.max(0, Math.floor((300 - timeSpent) / 30)); // Bônus baseado no tempo
      const awarded = Math.min(30, basePoints + timeBonus);
      return `Finalizar (+${awarded} pontos)`;
    }
    return 'Próxima';
  }, [isLast, feedback, correctCount, timeSpent, missionId, missionData]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!missionData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erro ao carregar dados da missão</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (showIntro) {
    return (
      <QuizIntro
        title={missionData.title}
        description={missionData.description}
        videoUrl={missionData.videoUrl}
        onStart={handleStartQuiz}
        onBack={() => router.back()}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
        <BackButton />
        
        {/* Timer */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>⏱️ {formatTime(timeSpent)}</Text>
        </View>

        <View style={styles.progressBarWrapper}>
          <View style={[styles.progressBar, { width: `${((current + 1) / (missionData.questions.length)) * 100}%` }]} />
        </View>

        <Text style={styles.heading}>Participe de um desafio</Text>
        <Text style={styles.subtitle}>Questão {current + 1} de {missionData.questions.length}</Text>

        {question && (
          <View style={styles.card}>
            <Text style={styles.question}>{question.title}</Text>

            {question.options.map((opt) => (
              <TouchableOpacity
                key={opt.key}
                style={[styles.option, selected === opt.key && styles.optionSelected]}
                onPress={() => { if (feedback === null) setSelected(opt.key); }}
              >
                <Text style={styles.optionText}>{opt.key}) {opt.text}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.verifyButton} onPress={verify}>
              <Text style={styles.verifyText}>Verificar</Text>
            </TouchableOpacity>

            {feedback && (
              <View style={[styles.feedback, feedback === 'correct' ? styles.correct : styles.wrong]}>
                <Text style={styles.feedbackText}>
                  {feedback === 'correct' ? 'Acertou! 🎉' : 'Errou 🥲 Ir para a próxima questão.'}
                </Text>
              </View>
            )}

            <TouchableOpacity
              disabled={feedback === null}
              style={[styles.nextButton, feedback === null && styles.nextButtonDisabled]}
              onPress={nextOrFinish}
            >
              <Text style={styles.nextText}>{nextButtonLabel}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ececec' },
  scrollView: { flex: 1 },
  scrollContainer: { flexGrow: 1, padding: 16 },
  heading: { fontSize: 22, fontWeight: '700', color: '#1a5d2b', textAlign: 'center', marginTop: 8 },
  subtitle: { fontSize: 14, color: '#333', textAlign: 'center', marginBottom: 40 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, elevation: 3, marginBottom: 20 },
  question: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12 },
  option: { borderWidth: 1, borderColor: '#cfd8cf', borderRadius: 10, padding: 12, marginVertical: 6 },
  optionSelected: { borderColor: '#4a7f37', backgroundColor: '#e9f3e6' },
  optionText: { color: '#333', fontSize: 14 },
  verifyButton: { backgroundColor: '#4a7f37', borderRadius: 10, padding: 12, marginTop: 10 },
  verifyText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
  feedback: { marginTop: 10, padding: 10, borderRadius: 10 },
  correct: { backgroundColor: '#e6f4ea' },
  wrong: { backgroundColor: '#fdeaea' },
  feedbackText: { textAlign: 'center', color: '#333', fontWeight: '600' },
  nextButton: { backgroundColor: '#1a5d2b', borderRadius: 10, padding: 12, marginTop: 12 },
  nextButtonDisabled: { backgroundColor: '#a8b5a8' },
  nextText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
  progressBarWrapper: { height: 8, backgroundColor: '#dfe6df', borderRadius: 8, overflow: 'hidden', marginVertical: 8 },
  progressBar: { height: 8, backgroundColor: '#4a7f37' },
  timerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timerText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4a7f37',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
  },
});
