import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '../../components/Header';

// Dados do usuário
const USER_DATA = {
  name: 'João Silva',
  accountNumber: '1234-5678-9012-3456',
  balance: 'R$ 2.450,00'
};

// Histórico de transações
const TRANSACTIONS = [
  {
    id: '1',
    type: 'credit',
    title: 'Pontos convertidos',
    description: 'Conversão de 150 pontos',
    amount: '+R$ 15,00',
    date: '15/05/2024',
    time: '14:30',
    category: 'points',
    status: 'completed'
  },
  {
    id: '2',
    type: 'debit',
    title: 'Curso de Investimentos',
    description: 'Pagamento com pontos',
    amount: '-R$ 197,00',
    date: '14/05/2024',
    time: '10:15',
    category: 'education',
    status: 'completed'
  },
  {
    id: '3',
    type: 'credit',
    title: 'Cashback',
    description: 'Retorno de compra',
    amount: '+R$ 8,50',
    date: '13/05/2024',
    time: '16:45',
    category: 'cashback',
    status: 'completed'
  },
  {
    id: '4',
    type: 'debit',
    title: 'Desconto Tênis',
    description: 'Aplicação de desconto',
    amount: '-R$ 45,00',
    date: '12/05/2024',
    time: '09:20',
    category: 'discount',
    status: 'completed'
  },
  {
    id: '5',
    type: 'credit',
    title: 'Bônus mensal',
    description: 'Bônus por fidelidade',
    amount: '+R$ 25,00',
    date: '11/05/2024',
    time: '00:00',
    category: 'bonus',
    status: 'completed'
  },
  {
    id: '6',
    type: 'debit',
    title: 'Academia Premium',
    description: 'Assinatura mensal',
    amount: '-R$ 89,90',
    date: '10/05/2024',
    time: '08:00',
    category: 'subscription',
    status: 'completed'
  },
  {
    id: '7',
    type: 'credit',
    title: 'Pontos por missão',
    description: 'Missão: Complete 3 desafios',
    amount: '+R$ 3,00',
    date: '09/05/2024',
    time: '18:30',
    category: 'mission',
    status: 'completed'
  },
  {
    id: '8',
    type: 'debit',
    title: 'Livraria Online',
    description: 'Compra com desconto',
    amount: '-R$ 32,40',
    date: '08/05/2024',
    time: '15:10',
    category: 'shopping',
    status: 'completed'
  }
];

// Resumo financeiro
const FINANCIAL_SUMMARY = {
  totalCredits: 'R$ 51,50',
  totalDebits: 'R$ 364,30',
  netBalance: 'R$ -312,80',
  pointsEarned: 420,
  pointsSpent: 150
};

export default function ExtratoScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('Mês');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const categories = ['Todas', 'Pontos', 'Educação', 'Cashback', 'Desconto', 'Bônus', 'Assinatura', 'Missão', 'Compras'];

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      points: '🎯',
      education: '📚',
      cashback: '💰',
      discount: '🏷️',
      bonus: '🎁',
      subscription: '📱',
      mission: '⭐',
      shopping: '🛒'
    };
    return icons[category] || '💳';
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      points: '#0e76e0',
      education: '#28a745',
      cashback: '#ffc107',
      discount: '#dc3545',
      bonus: '#6f42c1',
      subscription: '#fd7e14',
      mission: '#20c997',
      shopping: '#6c757d'
    };
    return colors[category] || '#6c757d';
  };

  const filteredTransactions = TRANSACTIONS.filter(transaction => {
    if (selectedCategory !== 'Todas' && transaction.category !== selectedCategory.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header com informações da conta */}
        <View style={styles.headerSection}>
          <View style={styles.accountCard}>
            <View style={styles.accountInfo}>
              <Text style={styles.accountName}>{USER_DATA.name}</Text>
              <Text style={styles.accountNumber}>{USER_DATA.accountNumber}</Text>
            </View>
            <View style={styles.balanceInfo}>
              <Text style={styles.balanceLabel}>Saldo Disponível</Text>
              <Text style={styles.balanceValue}>{USER_DATA.balance}</Text>
            </View>
          </View>

          {/* Resumo financeiro */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Entradas</Text>
                <Text style={styles.summaryValueCredit}>{FINANCIAL_SUMMARY.totalCredits}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Saídas</Text>
                <Text style={styles.summaryValueDebit}>{FINANCIAL_SUMMARY.totalDebits}</Text>
              </View>
            </View>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Pontos Ganhos</Text>
                <Text style={styles.summaryValuePoints}>{FINANCIAL_SUMMARY.pointsEarned}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Pontos Gastos</Text>
                <Text style={styles.summaryValuePoints}>{FINANCIAL_SUMMARY.pointsSpent}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Filtros */}
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity 
                key={category}
                style={[
                  styles.filterChip, 
                  selectedCategory === category && styles.filterChipActive
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedCategory === category && styles.filterChipTextActive
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Lista de transações */}
        <View style={styles.transactionsContainer}>
          <Text style={styles.transactionsTitle}>Histórico de Transações</Text>
          
          {filteredTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              {/* Ícone da categoria */}
              <View style={[
                styles.categoryIcon, 
                { backgroundColor: getCategoryColor(transaction.category) + '20' }
              ]}>
                <Text style={styles.categoryIconText}>
                  {getCategoryIcon(transaction.category)}
                </Text>
              </View>
              
              {/* Informações da transação */}
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>{transaction.title}</Text>
                <Text style={styles.transactionDescription}>{transaction.description}</Text>
                <Text style={styles.transactionDate}>
                  {transaction.date} às {transaction.time}
                </Text>
              </View>
              
              {/* Valor e status */}
              <View style={styles.transactionAmount}>
                <Text style={[
                  styles.amountText,
                  { color: transaction.type === 'credit' ? '#28a745' : '#dc3545' }
                ]}>
                  {transaction.amount}
                </Text>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: transaction.status === 'completed' ? '#28a745' : '#ffc107' }
                ]} />
              </View>
            </View>
          ))}
        </View>

        {/* Botão para mais detalhes */}
        <View style={styles.moreDetailsContainer}>
          <TouchableOpacity style={styles.btnMoreDetails}>
            <Text style={styles.btnMoreDetailsText}>Ver Extrato Completo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f8f9fa',
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 25,
  },
  accountCard: {
    backgroundColor: '#0e76e0',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  accountInfo: {
    marginBottom: 16,
  },
  accountName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  accountNumber: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  balanceInfo: {
    alignItems: 'flex-end',
  },
  balanceLabel: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.9,
    marginBottom: 4,
  },
  balanceValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  summaryValueCredit: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
  },
  summaryValueDebit: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc3545',
  },
  summaryValuePoints: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0e76e0',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterChipActive: {
    backgroundColor: '#0e76e0',
    borderColor: '#0e76e0',
  },
  filterChipText: {
    color: '#666',
    fontSize: 14,
  },
  filterChipTextActive: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  transactionsContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#292a2b',
    marginBottom: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryIconText: {
    fontSize: 20,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#292a2b',
    marginBottom: 4,
  },
  transactionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  moreDetailsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  btnMoreDetails: {
    backgroundColor: '#0e76e0',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnMoreDetailsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 