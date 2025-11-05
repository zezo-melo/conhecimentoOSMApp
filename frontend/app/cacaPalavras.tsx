import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_URL } from '../constants';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import BackButton from '@/components/BackButton';
import { Ionicons } from '@expo/vector-icons';

const WORDS = ['OSM', 'MENTORH', 'ADAPTATIVA', 'CAFE', 'EQUIPE', 'CHAMADO'];
const GRID_SIZE = 12;
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

type Cell = {
  key: string;
  letter: string;
  row: number;
  col: number;
};

type WordPlacement = {
  word: string;
  coords: { row: number; col: number }[];
};

// 🔹 Gera grade fixa e SEM sobreposição
const generateFixedGrid = (): { grid: Cell[][]; placements: WordPlacement[] } => {
  const grid: Cell[][] = Array.from({ length: GRID_SIZE }, (_, r) =>
    Array.from({ length: GRID_SIZE }, (_, c) => ({
      key: `${r}-${c}`,
      letter: LETTERS[Math.floor(Math.random() * LETTERS.length)],
      row: r,
      col: c,
    }))
  );

  const placements: WordPlacement[] = [];

  const placeWord = (word: string, startR: number, startC: number, direction: 'horizontal' | 'vertical') => {
    const coords: { row: number; col: number }[] = [];
    for (let i = 0; i < word.length; i++) {
      const r = direction === 'horizontal' ? startR : startR + i;
      const c = direction === 'horizontal' ? startC + i : startC;

      if (r < GRID_SIZE && c < GRID_SIZE) {
        grid[r][c].letter = word[i];
        coords.push({ row: r, col: c });
      }
    }
    placements.push({ word, coords });
  };

  // 🔸 Posicionamentos fixos revisados (sem sobreposição)
  placeWord('MENTORH', 2, 1, 'horizontal');       // Linha 2
  placeWord('ADAPTATIVA', 4, 2, 'horizontal');    // Linha 4
  placeWord('CAFE', 0, 10, 'vertical');           // Vertical segura
  placeWord('EQUIPE', 6, 11, 'vertical');         // Vertical segura
  placeWord('CHAMADO', 8, 3, 'horizontal');       // Linha 8 (não sobrepõe)
  placeWord('OSM', 10, 5, 'horizontal');          // Linha 10 (nova posição, mais central)

  return { grid, placements };
};

export default function CacaPalavrasScreen() {
  const router = useRouter();
  const { refreshProfile } = useAuth();

  const [gridData, setGridData] = useState<Cell[][]>([]);
  const [placementsData, setPlacementsData] = useState<WordPlacement[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedCells, setSelectedCells] = useState<Cell[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [missionCompleted, setMissionCompleted] = useState(false);

  useEffect(() => {
    const { grid, placements } = generateFixedGrid();
    setGridData(grid);
    setPlacementsData(placements);
    setStartTime(Date.now());
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (startTime) {
      interval = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCellPress = (cell: Cell) => {
    if (missionCompleted) return;

    if (!isSelecting) {
      setSelectedCells([cell]);
      setIsSelecting(true);
    } else {
      setSelectedCells((prev) => [...prev, cell]);
      setIsSelecting(false);
    }
  };

  useEffect(() => {
    if (selectedCells.length === 2 && !isSelecting) {
      const startCell = selectedCells[0];
      const endCell = selectedCells[1];
      const potentialWord = getWordFromSelection(startCell, endCell, gridData);

      if (potentialWord) {
        const found = placementsData.find(
          (p) => p.word === potentialWord && !foundWords.includes(potentialWord)
        );
        if (found) {
          Alert.alert('🎉 Boa!', `Você encontrou a palavra: ${found.word}`);
          setFoundWords((prev) => [...prev, found.word]);
          setSelectedCells([]);
          return;
        }
      }

      const potentialWordReversed = getWordFromSelection(endCell, startCell, gridData);
      if (potentialWordReversed) {
        const foundReversed = placementsData.find(
          (p) =>
            p.word === potentialWordReversed &&
            !foundWords.includes(potentialWordReversed)
        );
        if (foundReversed) {
          Alert.alert('🎉 Boa!', `Você encontrou a palavra: ${foundReversed.word}`);
          setFoundWords((prev) => [...prev, foundReversed.word]);
          setSelectedCells([]);
          return;
        }
      }

      setTimeout(() => setSelectedCells([]), 500);
    }
  }, [selectedCells, isSelecting, placementsData, foundWords, gridData]);

  const getWordFromSelection = (start: Cell, end: Cell, grid: Cell[][]): string | null => {
    const dR = Math.sign(end.row - start.row);
    const dC = Math.sign(end.col - start.col);
    if (dR !== 0 && dC !== 0 && Math.abs(end.row - start.row) !== Math.abs(end.col - start.col)) return null;
    if (dR === 0 && dC === 0) return null;

    let word = '';
    let r = start.row;
    let c = start.col;

    while (r !== end.row || c !== end.col) {
      word += grid[r][c].letter;
      r += dR;
      c += dC;
    }
    word += grid[r][c].letter;
    return word;
  };

  const completeMission = useCallback(async () => {
    if (missionCompleted || !startTime) return;
    setMissionCompleted(true);

    const timeToComplete = Math.floor((Date.now() - startTime) / 1000);
    const basePoints = 15;
    const timeBonus = Math.max(0, Math.floor((300 - timeToComplete) / 60));
    const awardedPoints = basePoints + timeBonus;

    try {
      await axios.post(`${API_URL}/missions/complete-word-search`, {
        points: awardedPoints,
        timeSpent: timeToComplete,
      });
      await refreshProfile();

      Alert.alert('Missão concluída! 🎯', `Você ganhou ${awardedPoints} pontos!`);
      router.back();
    } catch (error) {
      console.error('Erro ao completar missão:', error);
    }
  }, [refreshProfile, router, startTime, missionCompleted]);

  useEffect(() => {
    if (foundWords.length === WORDS.length && startTime) {
      completeMission();
    }
  }, [foundWords, completeMission, startTime]);

  const isCellHighlighted = useCallback(
    (cell: Cell) => {
      const isSelected = selectedCells.some(
        (sc) => sc.row === cell.row && sc.col === cell.col
      );
      if (isSelected) return true;

      for (const placement of placementsData) {
        if (foundWords.includes(placement.word)) {
          const isFound = placement.coords.some(
            (c) => c.row === cell.row && c.col === cell.col
          );
          if (isFound) return true;
        }
      }
      return false;
    },
    [selectedCells, foundWords, placementsData]
  );

  return (
    <ScrollView style={styles.safeArea}>
      <Header />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.backBtnContainer}>
          <BackButton />
        </View>
        <Text style={styles.heading}>Caça Palavras OSM</Text>
        <Text style={styles.subtitle}>Encontre os termos abaixo na grade.</Text>

        <View style={styles.statusContainer}>
          <Text style={styles.timerText}>⏱️ {formatTime(timeSpent)}</Text>
          <Text style={styles.progressText}>
            {foundWords.length}/{WORDS.length} Palavras
          </Text>
        </View>

        <View style={styles.gridContainer}>
          {gridData.map((row, rIndex) => (
            <View key={rIndex} style={styles.gridRow}>
              {row.map((cell) => (
                <TouchableOpacity
                  key={cell.key}
                  style={[
                    styles.gridCell,
                    isCellHighlighted(cell) && styles.highlightedCell,
                    foundWords.length === WORDS.length && styles.completedCell,
                  ]}
                  onPress={() => handleCellPress(cell)}
                >
                  <Text
                    style={[
                      styles.cellText,
                      isCellHighlighted(cell) && styles.highlightedText,
                    ]}
                  >
                    {cell.letter}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        <Text style={styles.wordsTitle}>Palavras a Encontrar:</Text>
        <View style={styles.wordsList}>
          {WORDS.map((word) => (
            <Text
              key={word}
              style={[
                styles.wordItem,
                foundWords.includes(word) && styles.wordFound,
              ]}
            >
              {word}
            </Text>
          ))}
        </View>

        {isSelecting && (
          <View style={styles.tipContainer}>
            <Ionicons name="bulb-outline" size={20} color="#4a7f37" />
            <Text style={styles.tipText}>
              Toque na próxima letra para finalizar a seleção.
            </Text>
          </View>
        )}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ececec' },
  scrollView: { flex: 1 },
  scrollContainer: { flexGrow: 1, padding: 16, alignItems: 'center' },
  heading: { fontSize: 22, fontWeight: '700', color: '#1a5d2b', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backBtnContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20 },
  timerText: { fontSize: 18, fontWeight: '700', color: '#4a7f37' },
  progressText: { fontSize: 18, fontWeight: '700', color: '#1a5d2b' },
  gridContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    padding: 5,
    marginBottom: 30,
  },
  gridRow: { flex: 1, flexDirection: 'row', justifyContent: 'space-between' },
  gridCell: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 1,
    borderRadius: 4,
  },
  highlightedCell: { backgroundColor: '#e6f4ea' },
  completedCell: { backgroundColor: '#d6f0d1' },
  cellText: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  highlightedText: { color: '#1a5d2b' },
  wordsTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 10 },
  wordsList: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', width: '100%', paddingHorizontal: 10, paddingBottom: 50 },
  wordItem: { margin: 5, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: '#4a7f37', borderRadius: 5, fontWeight: 'bold', color: '#4a7f37' },
  wordFound: { backgroundColor: '#4a7f37', color: '#fff', textDecorationLine: 'line-through' },
  tipContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e0f7fa', padding: 10, borderRadius: 10, marginTop: 20, width: '90%' },
  tipText: { marginLeft: 8, color: '#00bcd4', fontSize: 14 },
});
