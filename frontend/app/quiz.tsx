import React, { useMemo, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_URL } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import BackButton from '@/components/BackButton';

type Option = { key: 'A' | 'B' | 'C' | 'D'; text: string };
type Question = { id: number; title: string; options: Option[]; correct: 'A' | 'B' | 'C' | 'D' };

const QUESTIONS: Question[] = [
  { id: 1, title: 'Ao ingressar no órgão onde é realizado o cadastro com os dados básicos no MENTORH?', options: [
    { key: 'A', text: 'Dados Funcionais > Servidores > Cadastro' },
    { key: 'B', text: 'Dados Funcionais > Pessoas > Cadastro' },
    { key: 'C', text: 'Folha de Pagamento > Lançamentos > Rubrica Individual' },
    { key: 'D', text: 'Tabelas Básicas e Cadastrais > Institucional' },
  ], correct: 'B' },
  { id: 2, title: 'Após ingressado no órgão e cadastrado os dados básicos do servidor, onde é realizado o cadastro com os dados funcionais no MENTORH?', options: [
    { key: 'A', text: 'Dados Funcionais > Servidores > Cadastro' },
    { key: 'B', text: 'Administração > Parametrização > Parametros do Sistema' },
    { key: 'C', text: 'Folha de Pagamento > Lançamentos > Rubrica Individual' },
    { key: 'D', text: 'Tabelas Básicas e Cadastrais > Institucional' },
  ], correct: 'A' },
  { id: 3, title: 'Qual módulo é cadastrado no MENTORH Cargo Efetivo?', options: [
    { key: 'A', text: 'Administração > Parametrização > Parametros do Sistema' },
    { key: 'B', text: 'Folha de Pagamento > Prepara Cálculo > Congelamento de Dados' },
    { key: 'C', text: 'Dados Funcionais > Cargo Efetivo > Cadastro' },
    { key: 'D', text: 'Dados Funcionais > Movimentação' },
  ], correct: 'C' },
  { id: 4, title: 'Servidor informou ao órgão que possui 2 dependentes, onde é realizado o cadastro?', options: [
    { key: 'A', text: 'Dados Funcionais > Pensão Alimentícia' },
    { key: 'B', text: 'Dados Funcionais > Cadastro de Dependentes' },
    { key: 'C', text: 'Estágio Probatório > Avaliação > Cadastro' },
    { key: 'D', text: 'Frequência > Férias > Concessão' },
  ], correct: 'B' },
  { id: 5, title: 'Servidor completou 12 meses de ingresso ao órgão e deseja marcar as suas férias, contudo é necessário realizar dois cadastros: concessão e gozo. Qual é o módulo para cadastro da Concessão?', options: [
    { key: 'A', text: 'Frequência > Férias > Concessão' },
    { key: 'B', text: 'Frequência > Férias > Gozo' },
    { key: 'C', text: 'Frequência > Ficha de Frequência > Emissão' },
    { key: 'D', text: 'Frequência > Ponto Eletrônico > Horário Individual > Cadastro Horário Individual' },
  ], correct: 'A' },
  { id: 6, title: 'Servidor com atestado de 10 dias. Onde registrar o afastamento?', options: [
    { key: 'A', text: 'Frequência > Afastamento > Cadastro' },
    { key: 'B', text: 'Frequência > Licença Prêmio/Capacitação > Concessão' },
    { key: 'C', text: 'Treinamento / Capacitação > Formação Acadêmica' },
    { key: 'D', text: 'Registro Funcional > Abono de Permanência' },
  ], correct: 'A' },
  { id: 7, title: 'Qual módulo é cadastrado o Regime Jurídico do servidor?', options: [
    { key: 'A', text: 'Dados Funcionais > Servidores > Cadastro' },
    { key: 'B', text: 'Registro Funcional > Regime Jurídico' },
    { key: 'C', text: 'Folha de Pagamento > Prepara Cálculo > Congelamento de Dados' },
    { key: 'D', text: 'Estágio Probatório > Avaliação > Cadastro' },
  ], correct: 'B' },
  { id: 8, title: 'Qual módulo eu busco as informações sobre condição de processamento?', options: [
    { key: 'A', text: 'Dados Funcionais > Servidores > Cadastro' },
    { key: 'B', text: 'Dados Funcionais > Pensão Alimentícia' },
    { key: 'C', text: 'Frequência > Licença Prêmio/Capacitação > Concessão' },
    { key: 'D', text: 'Administração > Condição de Processamento' },
  ], correct: 'D' },
  { id: 9, title: 'Qual módulo eu seleciono uma determinada folha?', options: [
    { key: 'A', text: 'Folha de Pagamento > Controle da Folha > Abre/Fecha Folha' },
    { key: 'B', text: 'Folha de Pagamento > Seleção de Folha' },
    { key: 'C', text: 'Folha de Pagamento > Fechamento > Folha Calculada' },
    { key: 'D', text: 'Folha de Pagamento > Prepara Cálculo > Benefícios' },
  ], correct: 'B' },
  { id: 10, title: 'Qual caminho/módulo eu posso acessar a folha de um determinado servidor?', options: [
    { key: 'A', text: 'Folha de Pagamento > Seleção de Folha' },
    { key: 'B', text: 'Folha de Pagamento > Lançamentos > Transfere Rubrica' },
    { key: 'C', text: 'Folha de Pagamento > Lançamentos > Rubrica Individual' },
    { key: 'D', text: 'Folha de Pagamento > Lançamentos > Devolução/Reposição' },
  ], correct: 'C' },
];

export default function QuizMission() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const router = useRouter();
  const { refreshProfile } = useAuth();

  const question = useMemo(() => QUESTIONS[current], [current]);
  const isLast = current === QUESTIONS.length - 1;

  const verify = () => {
    if (!selected) return;
    setFeedback(selected === question.correct ? 'correct' : 'wrong');
  };

  const nextOrFinish = async () => {
    // Só permite avançar após verificar, independentemente de certo/errado
    if (feedback === null) return;
    const isAnswerCorrect = feedback === 'correct';
    if (!isLast) {
      if (isAnswerCorrect) {
        setCorrectCount((c) => c + 1);
      }
      setSelected(null);
      setFeedback(null);
      setCurrent((c) => c + 1);
      return;
    }
    // Finalizar: creditar pontos e bloquear missão
    const finalCorrect = isAnswerCorrect ? correctCount + 1 : correctCount;
    await axios.post(`${API_URL}/missions/complete-quiz-mission`, { correctCount: finalCorrect });
    await refreshProfile();
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <View style={styles.container}>
        <BackButton />
        <View style={styles.progressBarWrapper}>
          <View style={[styles.progressBar, { width: `${((current + 1) / QUESTIONS.length) * 100}%` }]} />
        </View>
        <Text style={styles.heading}>Participe de um desafio</Text>
        <Text style={styles.subtitle}>Questão {current + 1} de {QUESTIONS.length}</Text>
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
            <Text style={styles.nextText}>
              {isLast
                ? (() => {
                    const pendingCorrect = feedback === 'correct' ? 1 : 0;
                    const totalCorrect = correctCount + pendingCorrect;
                    const awarded = Math.min(20, Math.max(0, totalCorrect * 2));
                    return `Finalizar (+${awarded} pontos)`;
                  })()
                : 'Próxima'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ececec' },
  container: { flex: 1, padding: 16 },
  heading: { fontSize: 22, fontWeight: '700', color: '#1a5d2b', textAlign: 'center', marginTop: 8 },
  subtitle: { fontSize: 14, color: '#333', textAlign: 'center', marginBottom: 40 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, elevation: 3 },
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
});


