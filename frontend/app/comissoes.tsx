import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, SafeAreaView, Linking, TouchableOpacity } from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import Header from '@/components/Header';
import BackButton from '@/components/BackButton';


export default function ComissoesScreen() {
  const chartWidth = Dimensions.get("window").width - 32;
  const handlePress = () => {
    Linking.openURL("https://www.itau.com.br/itau-shop");
  };


  return (
    <SafeAreaView style={styles.containerG}>

      <Header />
    <ScrollView style={styles.container}>
      <BackButton />

      {/* Header */}
      <Text style={styles.title}>Comissões Itaú</Text>

      {/* Resumo em Cards */}
      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Total Vendas</Text>
          <Text style={styles.cardValue}>R$ 0</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Total Empréstimos</Text>
          <Text style={styles.cardValue}>R$ 0</Text>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Comissão OSM</Text>
          <Text style={styles.cardValue}>R$ 0</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Ticket Médio</Text>
          <Text style={styles.cardValue}>R$ 0</Text>
        </View>
      </View>

      {/* Lista de Operações */}
      <Text style={styles.section}>Operações</Text>
      <View style={styles.operationCard}>
        <Text style={styles.opText}>Data: 01/09/2025</Text>
        <Text style={styles.opText}>Cliente: Fulano</Text>
        <Text style={styles.opText}>Tipo: Crédito</Text>
        <Text style={styles.opText}>Valor: R$ 500</Text>
        <Text style={styles.opText}>Status: Pago</Text>
      </View>

      {/* Tendência */}
      <Text style={styles.section}>Tendência (Últimos 12 períodos)</Text>
      <LineChart
        data={{
          labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
          datasets: [{ data: [50, 80, 40, 95, 85, 100] }],
        }}
        width={chartWidth}
        height={220}
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          color: () => "#4a7f37",
          labelColor: () => "#4a7f37",
        }}
        style={styles.chart}
      />

      {/* Mix por Tipo */}
      <Text style={styles.section}>Mix por Tipo</Text>
      <PieChart
        data={[
          { name: "Crédito", population: 45, color: "#4a7f37", legendFontColor: "#333" },
          { name: "Débito", population: 30, color: "#666", legendFontColor: "#333" },
          { name: "Outros", population: 25, color: "#cecece", legendFontColor: "#333" },
        ]}
        width={chartWidth}
        height={220}
        chartConfig={{
          color: () => "#ff6600",
        }}
        accessor={"population"}
        backgroundColor={"transparent"}
        paddingLeft={"16"}
      />
      <View>
          <Text style={styles.promoTitle}>Emitir fatura</Text>
          <TouchableOpacity onPress={handlePress}>
            <Text style={styles.btnMission}>Clique aqui!</Text>
          </TouchableOpacity>
      </View>
    </ScrollView>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, marginBottom: 50, },
  containerG: { flex: 1, backgroundColor: "#fff"},
  title: { fontSize: 22, fontWeight: "bold", color: "#4a7f37", marginBottom: 16 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    elevation: 3,
    borderRadius: 12,
    padding: 16,
    margin: 6,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  cardLabel: { fontSize: 14, color: "#64748b" },
  cardValue: { fontSize: 16, fontWeight: "bold", color: "#0f172a", marginTop: 6 },
  section: { marginTop: 20, fontSize: 18, fontWeight: "bold", color: "#4a7f37" },
  operationCard: {
    backgroundColor: "#fff",
    elevation: 2,
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  opText: { fontSize: 14, color: "#0f172a", marginBottom: 2 },
  chart: { marginVertical: 12, borderRadius: 12 },
  promoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
    color: '#4a7f37',
  },
  btnMission: {
    backgroundColor: '#4a7f37',
    padding: 10,
    color: '#fff',
    borderRadius: 10,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 700
  },  

});
