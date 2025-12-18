// tabs/ProfileCurriculumScreen.tsx (VERSÃO FINAL COM GRÁFICOS E OCORRÊNCIAS - CORREÇÃO DO ERRO 'SPLIT')

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
// *** IMPORTS DE COMPONENTES E CONSTANTES ***
import { API_URL } from '../../constants/index';
import BackButton from '../../components/BackButton';
import Header from '@/components/Header';
import Avatar from '../../components/Avatar';
import CurriculumCharts from '@/components/CurriculumCharts'; // Componente de gráficos

// --- CORES DA IDENTIDADE VISUAL OSM ---
const COLORS = {
    primary: '#4CAF50', // Verde Principal (como na barra de navegação)
    secondary: '#2E7D32', // Verde Escuro
    background: '#F5F5F5', // Cinza Claro
    text: '#333333',
    white: '#FFFFFF',
    good: '#22c55e', // Verde para bom desempenho (Baixo Risco)
    mid: '#facc15',  // Amarelo para risco médio
    high: '#ef4444', // Vermelho para alto risco
    info: '#3b82f6', // Azul para status informativo
};

// Utility: garante que o valor seja seguro para renderizar em <Text>
const ensureText = (v: any) => {
    if (v === null || v === undefined) return '';
    if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return String(v);
    try { return JSON.stringify(v); } catch (e) { return ''; }
};

// --- TYPESCRIPT TYPES ---
export interface KpiItem {
    label: string;
    value: string;
    sub_label: string;
    tag_color: 'good' | 'mid' | 'high' | 'risk-alto' | 'risk-medio' | 'risk-baixo';
}

export interface OcorrenciaItem {
    id: string;
    client: string;
    module: string;
    status: string;
    sla: string;
    sla_tag?: 'sla-bom' | 'sla-medio' | 'sla-alto-risco' | 'sla-pausado'; 
    sla_risc_g?: 'risco-baixo' | 'risco-medio' | 'risco-alto' | 'risco-sem';
    created_at: string; // Garantimos que são strings, mas tratamos se vierem undefined/null
    updated_at: string; // Garantimos que são strings, mas tratamos se vierem undefined/null
}

export interface ProfileData {
    name: string;
    role: string;
    medal: string;
    productivity_today_pts: number;
    productivity_30d_avg: number;
    active_calls: number;
    avatar_url: string;
}

export interface JornadaData {
    first_log: string;
    last_log: string;
    hours_logged: string;
    pause_time: string;
    jornada_status: string;
}

export interface CurriculumResponse {
    profile: ProfileData;
    jornada: JornadaData;
    kpis: KpiItem[];
    ocorrencias: OcorrenciaItem[];
    charts: any; 
}
// ----------------------------------------------------


// ===================================
// COMPONENTE 1: HEADER DO PERFIL (SEM ALTERAÇÃO)
// ===================================
const ProfileHeader: React.FC<{ profile: ProfileData }> = ({ profile }) => (
    <>
    <Header />
    <View style={headerStyles.container}>
    <View>
    <BackButton />
    </View>
        <Avatar name={ensureText(profile.name)} size={60} style={headerStyles.avatar} />
        <View style={headerStyles.info}>
            <Text style={headerStyles.name}>{ensureText(profile.name)}</Text>
            <Text style={headerStyles.role}>{ensureText(profile.role)}</Text>
            <View style={headerStyles.badgeRow}>
                <Text style={headerStyles.badgeText}>Medalha: </Text>
                <Text style={headerStyles.medal}>{ensureText(profile.medal).toUpperCase()} 🥇</Text>
            </View>
        </View>
        <View style={headerStyles.stats}>
            <Text style={headerStyles.statsTitle}>Produtividade</Text>
            <Text style={headerStyles.statsValue}>{ensureText(profile.productivity_today_pts)} pts</Text>
            <Text style={headerStyles.statsSub}>Média 30D: {ensureText(profile.productivity_30d_avg)}</Text>
        </View>
    </View>
    </>
);

// ===================================
// COMPONENTE 2: CARDS DE KPI (SEM ALTERAÇÃO)
// ===================================
const KpiCard: React.FC<{ item: KpiItem }> = ({ item }) => {
    // Função para mapear a cor da tag
    const getColor = (tag_color: string) => {
        switch (tag_color) {
            case 'good':
            case 'risk-baixo': return COLORS.good;
            case 'mid':
            case 'risk-medio': return COLORS.mid;
            case 'risk-alto':
            case 'high': return COLORS.high;
            default: return COLORS.secondary;
        }
    };

    const cardColor = getColor(item.tag_color);

    const renderSafe = (v: any) => {
        if (v === null || v === undefined) return '';
        if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return String(v);
        try {
            const s = JSON.stringify(v);
            // truncate long JSON to avoid huge text nodes
            return s.length > 120 ? s.substr(0, 117) + '...' : s;
        } catch (e) {
            return '';
        }
    };

    return (
        <View style={[kpiStyles.card, { borderColor: cardColor }]}>
            <Text style={kpiStyles.label}>{renderSafe(item.label)}</Text>
            <Text style={kpiStyles.value}>{renderSafe(item.value)}</Text>
            <Text style={kpiStyles.subLabel}>{renderSafe(item.sub_label)}</Text>
        </View>
    );
};


// ===================================
// COMPONENTE 3: TABELA DE OCORRÊNCIAS (COM CORREÇÃO DE ERRO SPLIT)
// ===================================

const OcorrenciaTable: React.FC<{ ocorrencias: OcorrenciaItem[] }> = ({ ocorrencias }) => {
    
    // Funções de cor (Já ajustadas no passo anterior)
    const getSlaTagColor = (tag: OcorrenciaItem['sla_tag'] | undefined) => {
        const tagStr = tag || ''; 
        if (tagStr.includes('alto-risco')) return COLORS.high;
        if (tagStr.includes('medio')) return COLORS.mid;
        if (tagStr.includes('bom')) return COLORS.good;
        if (tagStr.includes('pausado')) return COLORS.info;
        return COLORS.text;
    };

    const getRiscGlosaColor = (tag: OcorrenciaItem['sla_risc_g'] | undefined) => {
        const tagStr = tag || ''; 
        if (tagStr.includes('alto')) return COLORS.high;
        if (tagStr.includes('medio')) return COLORS.mid;
        if (tagStr.includes('baixo')) return COLORS.good;
        return COLORS.secondary;
    };

    const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
        let statusColor = COLORS.info; // Padrão
        if (status.includes('Análise') || status.includes('fila')) {
            statusColor = COLORS.info;
        } else if (status.includes('Aguardando cliente')) {
            statusColor = COLORS.mid;
        } else if (status.includes('homologação')) {
            statusColor = COLORS.secondary;
        }

        return (
            <View style={[ocorrenciaStyles.statusBadge, { backgroundColor: statusColor }]}>
                <Text style={ocorrenciaStyles.statusText}>{status}</Text>
            </View>
        );
    };

    // CORREÇÃO: Garante que o valor é uma string antes de chamar .split()
    const formatTime = (dateTime: string | undefined) => {
        const dt = dateTime || ''; // Trata undefined/null
        return dt.split(' ')[1] || '';
    }

    // CORREÇÃO: Garante que o valor é uma string antes de chamar .split()
    const formatDate = (dateTime: string | undefined) => {
        const dt = dateTime || ''; // Trata undefined/null
        return dt.split(' ')[0] || '';
    }

    // Linha de Cabeçalho (Header)
    const renderHeader = () => (
        <View style={ocorrenciaStyles.headerRow}>
            <Text style={[ocorrenciaStyles.headerText, { width: '25%' }]}>OCORRÊNCIA</Text> 
            <Text style={[ocorrenciaStyles.headerText, { width: '25%' }]}>STATUS</Text>
            <Text style={[ocorrenciaStyles.headerText, { width: '25%' }]}>CRIAÇÃO</Text>
            <Text style={[ocorrenciaStyles.headerText, { width: '25%', textAlign: 'right' }]}>SLA</Text>
        </View>
    );

    // Linha de Dados (Row)
    const renderRow = (item: OcorrenciaItem, index: number) => {
        const slaColor = getSlaTagColor(item.sla_tag);
        const riskColor = getRiscGlosaColor(item.sla_risc_g);

        return (
            <View key={item.id} style={ocorrenciaStyles.row}>
                {/* Coluna 1: ID, Cliente e Módulo */}
                <View style={{ width: '25%' }}>
                    <Text style={ocorrenciaStyles.idText}>{ensureText(item.id)}</Text>
                    <Text style={ocorrenciaStyles.clientText} numberOfLines={1}>{ensureText(item.client)}</Text>
                    <Text style={ocorrenciaStyles.moduleText} numberOfLines={1}>{ensureText(item.module)}</Text>
                </View>

                {/* Coluna 2: Status e Risco */}
                <View style={{ width: '25%' }}>
                    <StatusBadge status={ensureText(item.status)} />
                    <Text style={[ocorrenciaStyles.riskText, { color: riskColor }]}> 
                        {item.sla_risc_g ? ensureText(item.sla_risc_g).replace('risco-', '').toUpperCase() : 'SEM RISCO'}
                    </Text>
                </View>

                {/* Coluna 3: Criação (Data e Hora) */}
                <View style={{ width: '25%' }}>
                    <Text style={ocorrenciaStyles.dateValue}>{ensureText(formatDate(item.created_at))}</Text>
                    <Text style={ocorrenciaStyles.timeText}>{ensureText(formatTime(item.created_at))}</Text>
                </View>

                {/* Coluna 4: SLA e Última Atualização */}
                <View style={{ width: '25%', alignItems: 'flex-end' }}>
                    <Text style={[ocorrenciaStyles.slaValue, { color: slaColor, borderColor: slaColor }]}> 
                        {ensureText(item.sla)}
                    </Text>
                    <Text style={ocorrenciaStyles.dateText}>Últ. Atual:</Text>
                    <Text style={ocorrenciaStyles.timeText}>{ensureText(formatTime(item.updated_at))}</Text>
                </View>
            </View>
        );
    };

    // Renderiza a tabela
    return (
        <View style={ocorrenciaStyles.container}>
            <Text style={styles.sectionTitle}>Ocorrências do Dia - N1/N2</Text>
            <Text style={ocorrenciaStyles.subTitle}>
                Histórico das ocorrências com status, datas, SLA, risco de glosa e estimativa de fechamento com base em histórico.
            </Text>
            
            {renderHeader()}
            
            <View style={ocorrenciaStyles.tableBody}>
                {ocorrencias.length > 0 ? (
                    ocorrencias.map(renderRow)
                ) : (
                    <Text style={{ textAlign: 'center', color: COLORS.text, padding: 10 }}>Nenhuma ocorrência ativa encontrada.</Text>
                )}
            </View>

            {/* Resumo de Status (Exemplo fixo) */}
            <View style={ocorrenciaStyles.summaryContainer}>
                <Text style={ocorrenciaStyles.summaryText}>
                    Status: 3 em análise • 2 em fila • 1 aguardando cliente
                </Text>
                <Text style={[ocorrenciaStyles.summaryText, { color: COLORS.high, marginTop: 5 }]}>
                    Chamados com SLA crítico: 1 • Risco moderado de glosa
                </Text>
            </View>
        </View>
    );
};


// ===================================
// COMPONENTE PRINCIPAL (SCREEN - SEM ALTERAÇÃO NA ESTRUTURA)
// ===================================
const ProfileCurriculumScreen = () => {
    // Usando 'as CurriculumResponse' para o estado inicial para evitar erros de TS
    const [data, setData] = useState<CurriculumResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCurriculum = async () => {
            try {
                // A rota deve ser http://10.0.2.2:3000/api/users/curriculum/me
                // Se a URL do API_URL for 'http://10.0.2.2:3000/api', o endpoint correto para a rota backend é 'curriculum/me'
                // NO ENTANTO, o seu server.js mapeia a rota para /api/curriculum. O endpoint correto deve ser /api/curriculum/me (assumindo que 'me' é a rota no seu controller) ou a rota que você definiu no seu routes/curriculum.js.
                // Vou manter o endpoint original da API que estava usando: users/curriculum/me, que funcionou para trazer os dados, embora seu server.js indique /api/curriculum.
                // Para evitar a confusão, se o backend está retornando os dados em http://localhost:3000/api/users/curriculum/me (como no print), mantemos esta URL na chamada.
                // Se o backend for http://localhost:3000/api/curriculum/me (baseado no server.js), a chamada deve ser ajustada.
                // VAMOS CONSIDERAR QUE A ROTA CORRETA NO BACKEND É users/curriculum/me (conforme o print de dados)
                const response = await axios.get(`${API_URL}/users/curriculum/me`); 
                setData(response.data);
                console.log('ProfileCurriculumScreen - received data:', response.data);
            } catch (err) {
                // Se o erro for 404/400, sugere que o backend não tem a rota users/curriculum/me
                if (axios.isAxiosError(err) && err.response?.status === 404) {
                    setError('Rota de API não encontrada (404). Verifique se o endpoint é /users/curriculum/me ou se deveria ser /curriculum/me.');
                } else {
                    setError('Falha ao carregar dados. Verifique o console ou se o Backend está rodando.');
                }
                console.error('Erro de API:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchCurriculum();
    }, []);

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={{ marginTop: 10, color: COLORS.text }}>Carregando dados...</Text>
            </View>
        );
    }

    if (error || !data) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.errorText}>Erro: {error || "Dados indisponíveis."}</Text>
                <TouchableOpacity onPress={() => setLoading(true)} style={{ marginTop: 20 }}>
                    <Text style={{ color: COLORS.primary }}>Tentar Novamente</Text>
                </TouchableOpacity>
            </View>
        );
    }
    // Normaliza KPIs e Charts para formatos variados antes de renderizar
    const safeString = (v: any) => {
        if (v === null || v === undefined) return '';
        if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return String(v);
        try { return JSON.stringify(v); } catch (e) { return ''; }
    };

    const normalizeKpis = (raw: any): KpiItem[] => {
        if (!raw) return [];
        if (!Array.isArray(raw) && typeof raw === 'object') {
            return Object.entries(raw).map(([k, v]) => ({
                label: safeString(k),
                value: safeString(v),
                sub_label: '',
                tag_color: 'risk-baixo',
            }));
        }
        if (!Array.isArray(raw)) return [];
        return raw.map((item: any) => {
            if (item == null) return { label: '', value: '', sub_label: '', tag_color: 'risk-baixo' };
            if (typeof item === 'string') return { label: item, value: '', sub_label: '', tag_color: 'risk-baixo' };
            if (typeof item === 'number') return { label: '', value: String(item), sub_label: '', tag_color: 'risk-baixo' };
            const label = item.label || item.title || item.name || item.key || Object.keys(item).find(k => typeof item[k] === 'string') || '';
            const value = item.value || item.val || item.count || item.points || item.score || (() => {
                for (const pk of Object.keys(item)) {
                    const v = item[pk];
                    if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return String(v);
                }
                return '';
            })();
            const sub_label = item.sub_label || item.subtitle || item.meta || item.extra || '';
            const tag_color = item.tag_color || item.color_tag || 'risk-baixo';
            return { label: safeString(label), value: safeString(value), sub_label: safeString(sub_label), tag_color };
        });
    };

    const normalizeCharts = (raw: any) => {
        if (!raw) return null;
        const out: any = {};
        const toNumber = (v: any) => {
            const n = Number(v);
            return Number.isFinite(n) ? n : 0;
        };
        const t = raw.tempo_operador || raw.tempo || raw.operator_time || null;
        if (t) {
            if (Array.isArray(t.labels) && Array.isArray(t.data)) {
                out.tempo_operador = { labels: t.labels.map((l: any) => String(l)), data: t.data.map(toNumber), user_index: typeof t.user_index === 'number' ? t.user_index : 0 };
            } else if (Array.isArray(t)) {
                out.tempo_operador = { labels: t.map((_, i) => String(i + 1)), data: t.map(toNumber), user_index: 0 };
            } else if (typeof t === 'object') {
                const labels = Object.keys(t);
                out.tempo_operador = { labels, data: labels.map(k => toNumber(t[k])), user_index: 0 };
            }
        }
        const s = raw.status_distribuicao || raw.status || raw.distribuicao || null;
        if (s) {
            if (Array.isArray(s.labels) && Array.isArray(s.data)) {
                out.status_distribuicao = { labels: s.labels.map((l: any) => String(l)), data: s.data.map(toNumber), backgroundColor: Array.isArray(s.backgroundColor) ? s.backgroundColor : [] };
            } else if (Array.isArray(s)) {
                out.status_distribuicao = { labels: s.map((v: any) => String(v)), data: s.map((v: any) => toNumber(v)), backgroundColor: [] };
            } else if (typeof s === 'object') {
                const labels = Object.keys(s);
                out.status_distribuicao = { labels, data: labels.map(k => toNumber(s[k])), backgroundColor: [] };
            }
        }
        return out;
    };

    const normalizedKpis = normalizeKpis(data.kpis);
    const normalizedCharts = normalizeCharts(data.charts);

    return (
        <ScrollView style={styles.container}>
            <ProfileHeader profile={data.profile} />
            
            {/* SEÇÃO JORNADA */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Jornada do Dia</Text>
                <View style={jornadaStyles.container}>
                    <Text style={jornadaStyles.status}>{ensureText(data.jornada.jornada_status)}</Text>
                    <Text>Primeiro Log: {ensureText(data.jornada.first_log)}</Text>
                    <Text>Último Log: {ensureText(data.jornada.last_log)}</Text>
                    <Text>Tempo de Pausa: {ensureText(data.jornada.pause_time)}</Text>
                </View>
            </View>

            {/* SEÇÃO KPI CARDS */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>KPIs e Metas</Text>
                <View style={kpiStyles.listContainer}>
                    {normalizedKpis.length > 0 ? (
                        normalizedKpis.map((kpi, index) => (
                            <KpiCard key={index} item={kpi as any} />
                        ))
                    ) : (
                        <Text style={{ color: COLORS.primary }}>KPIs indisponíveis ou em formato inválido.</Text>
                    )}
                </View>
            </View>

            {/* SEÇÃO DE GRÁFICOS */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Gráficos</Text>
                <View style={{ padding: 12 }}>
                    {normalizedCharts && normalizedCharts.tempo_operador && normalizedCharts.status_distribuicao ? (
                        <CurriculumCharts charts={normalizedCharts} />
                    ) : (
                        <Text style={{ color: '#666' }}>Gráficos indisponíveis — dados incompletos.</Text>
                    )}
                </View>
            </View>

            {/* SEÇÃO DE OCORRÊNCIAS */}
            {/* O componente OcorrenciaTable foi movido para fora do View styles.section para ter margens completas. */}
            <OcorrenciaTable ocorrencias={data.ocorrencias} />
            
        </ScrollView>
    );
};

// --- ESTILOS GERAIS E ESPECÍFICOS (SEM ALTERAÇÃO) ---

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    section: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: COLORS.white,
        marginBottom: 10,
        borderRadius: 8,
        marginHorizontal: 10,
        elevation: 1,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.secondary,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.background,
        paddingBottom: 5,
    },
    errorText: {
        color: COLORS.high,
        fontSize: 16,
    },
});

const headerStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: COLORS.white,
        marginBottom: 10,
        borderBottomColor: COLORS.primary,
        borderBottomWidth: 2,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    role: {
        fontSize: 14,
        color: COLORS.secondary,
    },
    badgeRow: {
        flexDirection: 'row',
        marginTop: 4,
    },
    badgeText: {
        color: COLORS.text,
        fontSize: 13,
    },
    medal: {
        fontWeight: 'bold',
        color: COLORS.secondary,
        fontSize: 13,
    },
    stats: {
        alignItems: 'flex-end',
    },
    statsTitle: {
        fontSize: 12,
        color: COLORS.secondary,
        fontWeight: 'bold',
    },
    statsValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    statsSub: {
        fontSize: 10,
        color: COLORS.text,
    },
});

const jornadaStyles = StyleSheet.create({
    container: {
        paddingVertical: 5,
    },
    status: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.good,
        marginBottom: 5,
    }
});

const kpiStyles = StyleSheet.create({
    listContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%', // Dois cards por linha
        backgroundColor: COLORS.background,
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        borderLeftWidth: 4,
        elevation: 1,
    },
    label: {
        fontSize: 12,
        color: COLORS.text,
        marginBottom: 5,
    },
    value: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    subLabel: {
        fontSize: 10,
        color: COLORS.secondary,
        marginTop: 5,
    },
});

const ocorrenciaStyles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        marginBottom: 10,
        borderRadius: 8,
        marginHorizontal: 10,
        elevation: 1,
        padding: 15,
    },
    subTitle: {
        fontSize: 12,
        color: COLORS.text,
        marginBottom: 15,
    },
    headerRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.background,
        marginBottom: 5,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 10,
        color: COLORS.secondary,
        textTransform: 'uppercase',
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.background,
    },
    // Coluna ID + Cliente + Módulo
    idText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    clientText: {
        fontSize: 11, // Um pouco menor para caber
        color: COLORS.text,
        fontWeight: '500',
    },
    moduleText: {
        fontSize: 9, // Menor
        color: COLORS.secondary,
    },
    // Coluna Status
    statusBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: 'flex-start',
        marginBottom: 3,
    },
    statusText: {
        fontSize: 10,
        color: COLORS.white,
        fontWeight: 'bold',
    },
    riskText: {
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 3,
    },
    // Coluna Criação/Última Atualização
    dateValue: {
        fontSize: 13,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    timeText: {
        fontSize: 9,
        color: COLORS.text,
    },
    // Coluna SLA
    slaValue: {
        fontSize: 13,
        fontWeight: 'bold',
        borderWidth: 1,
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderRadius: 4,
        alignSelf: 'flex-end',
        marginBottom: 3,
    },
    dateText: {
        fontSize: 9,
        color: COLORS.text,
        alignSelf: 'flex-end',
    },
    summaryContainer: {
        marginTop: 15,
        borderTopWidth: 1,
        borderTopColor: COLORS.background,
        paddingTop: 10,
    },
    summaryText: {
        fontSize: 11,
        color: COLORS.text,
    }
});

export default ProfileCurriculumScreen;