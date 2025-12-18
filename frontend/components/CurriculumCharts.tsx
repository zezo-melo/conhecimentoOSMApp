// frontend/components/CurriculumCharts.tsx (NOVO ARQUIVO)

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';

// --- TYPESCRIPT TYPES (Tipos específicos para a estrutura dos dados de Charts) ---
interface ChartData {
    labels: string[];
    data: number[];
    user_index: number;
}

interface DistributionChartData {
    labels: string[];
    data: number[];
    backgroundColor: string[];
}

interface ChartsProps {
    charts: {
        tempo_operador: ChartData;
        status_distribuicao: DistributionChartData;
    };
}

// --- CORES DO SEU APP ---
const COLORS = {
    primary: '#4CAF50', // Verde Principal
    secondary: '#2E7D32', // Verde Escuro
    text: '#333333',
    white: '#FFFFFF',
};

// Define a largura da tela menos a margem para caber na seção
const screenWidth = Dimensions.get('window').width - 40; 

const CurriculumCharts: React.FC<ChartsProps> = ({ charts }) => {
    // Validações simples para evitar que objetos/arrays inválidos sejam renderizados
    const isValidBar = charts && Array.isArray(charts.tempo_operador?.labels) && Array.isArray(charts.tempo_operador?.data) && typeof charts.tempo_operador?.user_index === 'number';
    const isValidPie = charts && Array.isArray(charts.status_distribuicao?.labels) && Array.isArray(charts.status_distribuicao?.data);

    if (!isValidBar || !isValidPie) {
        return (
            <View style={styles.invalidContainer}>
                <Text style={styles.invalidText}>Gráficos indisponíveis — dados incompletos ou em formato inválido.</Text>
            </View>
        );
    }
    // 1. Data para o Gráfico de Barras (Tempo Operador)
    const barChartData = {
        labels: charts.tempo_operador.labels,
        datasets: [
            {
                data: charts.tempo_operador.data,
                // Define a cor da barra do usuário atual (index) como a cor primária
                colors: charts.tempo_operador.labels.map((_, index) => 
                    index === charts.tempo_operador.user_index ? 
                    (opacity = 1) => COLORS.primary : 
                    (opacity = 1) => COLORS.secondary
                ),
            },
        ],
    };

    // 2. Data para o Gráfico de Pizza (Status Distribuição)
    const pieChartData = charts.status_distribuicao.labels.map((label, index) => ({
        name: label,
        population: Number(charts.status_distribuicao.data[index]) || 0,
        // Usa a cor definida no Backend (para corresponder ao seu mock)
        color: charts.status_distribuicao.backgroundColor?.[index] || COLORS.secondary, 
        legendFontColor: COLORS.text,
        legendFontSize: 12,
    }));


    return (
        <View style={styles.container}>
            {/* GRÁFICO 1: TEMPO MÉDIO DO OPERADOR */}
            <Text style={styles.chartTitle}>Tempo Médio de Atendimento (min)</Text>
            <BarChart
                data={barChartData}
                width={screenWidth}
                height={240}
                chartConfig={{
                    backgroundColor: COLORS.white,
                    backgroundGradientFrom: COLORS.white,
                    backgroundGradientTo: COLORS.white,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Cor base (será sobrescrita por 'colors' acima)
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    barPercentage: 0.8,
                    decimalPlaces: 1,
                    fillShadowGradient: COLORS.primary, // Cor da sombra
                    fillShadowGradientOpacity: 0.5,
                }}
                style={styles.chartStyle}
                fromZero={true}
                withInnerLines={true} // Linhas de grade internas
                showValuesOnTopOfBars={true}
            />

            {/* GRÁFICO 2: STATUS DE DISTRIBUIÇÃO DOS CHAMADOS */}
            <Text style={styles.chartTitle}>Distribuição dos Chamados Ativos</Text>
            <PieChart
                data={pieChartData}
                width={screenWidth}
                height={220}
                chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                center={[0, 0]} // Centraliza a pizza na área de desenho
                absolute
                style={styles.chartStyle}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.secondary,
        marginBottom: 10,
        marginTop: 15,
        alignSelf: 'flex-start',
    },
    chartStyle: {
        borderRadius: 8,
        paddingHorizontal: 0,
        marginVertical: 10,
    }
    ,
    invalidContainer: {
        padding: 12,
        alignItems: 'center',
    },
    invalidText: {
        color: COLORS.text,
    }
});

export default CurriculumCharts;