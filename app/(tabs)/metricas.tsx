import { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, Pressable, RefreshControl, StyleSheet, ActivityIndicator, Linking } from "react-native";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAppAuth } from "@/lib/auth-context";
import { AppHeader } from "@/components/app-header";
import { fetchMetricas, formatCurrency, formatNumber, type MetricasData } from "@/lib/sheets-service";

// Dados de métricas por unidade (links das planilhas e pastas)
const UNIDADES_CONFIG: Record<string, { 
  sheetId: string;
  relatorios: string; 
  notasFiscais: string;
}> = {
  "Araripina": {
    sheetId: "1XxorSEspVwY-VAa8XeR2YleixguDwGwVaumu3rQS9OI",
    relatorios: "https://drive.google.com/drive/folders/1_ruchybS9pn0wJLPPxQ532ERujkaFkXv?usp=sharing",
    notasFiscais: "https://drive.google.com/drive/folders/1KzbqZlewrEoKOajE3fO8ktOG25GCyb9z?usp=sharing",
  },
  "Serra Talhada": {
    sheetId: "1xkhRGEhHMyntv2DcGtZPovX3vAzKglqEnblRAFPxx10",
    relatorios: "https://drive.google.com/drive/folders/1rGELW3lZHYCSWwdxa-hKR2q3jHPi-RHy?usp=sharing",
    notasFiscais: "",
  },
  "Vitória Sto Antão": {
    sheetId: "1bZYM4-Iw-7TWMtNcgX1apj5jrSpR1pBPXKAVxciSOWo",
    relatorios: "https://drive.google.com/drive/folders/1wJRrTnvmljdl6rAUdCiV-h8BjNjGUrDl?usp=sharing",
    notasFiscais: "https://drive.google.com/drive/folders/11LxWga_VVM2BRszl06pCdjNuM5EKxXn1?usp=sharing",
  },
  "Shopping Plaza Macaé": {
    sheetId: "",
    relatorios: "https://drive.google.com/drive/folders/1dWjMOMh_4UPWAa553bT-WHNxpe7vLxJV?usp=sharing",
    notasFiscais: "https://drive.google.com/drive/folders/1sDRzGPbnanSmXuup83UiG5KvFDWqEcin?usp=sharing",
  },
};

// Mapeamento de nome de unidade para ID usado no sheets-service
const UNIT_ID_MAP: Record<string, string> = {
  "Araripina": "araripina",
  "Serra Talhada": "serra",
  "Vitória Sto Antão": "vitoria",
  "Garanhuns": "garanhuns",
  "Cajazeiras": "cajazeiras",
  "Livramento": "livramento",
  "Muriaé": "muriae",
  "Vilhena": "vilhena",
  "Corumbá": "corumba",
  "Fortaleza": "fortaleza",
  "Shopping Plaza Macaé": "macae_plaza",
  "Silva Jardim - Macaé": "macae_centro",
};

export default function MetricasScreen() {
  const { user, isSocio, isAuthenticated, loading: authLoading, getUserUnitAccess } = useAppAuth();
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [metricas, setMetricas] = useState<MetricasData | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unitAccess = getUserUnitAccess();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    // Se só tem uma unidade, seleciona automaticamente
    if (unitAccess.length === 1 && !selectedUnit) {
      setSelectedUnit(unitAccess[0].unitName);
      loadMetricas(unitAccess[0].unitName);
    }
  }, [unitAccess, selectedUnit]);

  const loadMetricas = async (unitName: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const unitId = UNIT_ID_MAP[unitName] || unitName.toLowerCase();
      const data = await fetchMetricas(unitId);
      
      if (data) {
        setMetricas(data);
      } else {
        // Se não conseguiu buscar dados reais, mostrar mensagem
        setError("Dados não disponíveis para esta unidade");
        setMetricas(null);
      }
    } catch (err) {
      console.error("Erro ao carregar métricas:", err);
      setError("Erro ao carregar dados. Tente novamente.");
      setMetricas(null);
    }
    
    setLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (selectedUnit) {
      await loadMetricas(selectedUnit);
    }
    setRefreshing(false);
  }, [selectedUnit]);

  const handleSelectUnit = (unitName: string) => {
    setSelectedUnit(unitName);
    loadMetricas(unitName);
  };

  const handleOpenRelatorios = () => {
    if (selectedUnit && UNIDADES_CONFIG[selectedUnit]?.relatorios) {
      Linking.openURL(UNIDADES_CONFIG[selectedUnit].relatorios);
    }
  };

  const handleOpenNotasFiscais = () => {
    if (selectedUnit && UNIDADES_CONFIG[selectedUnit]?.notasFiscais) {
      Linking.openURL(UNIDADES_CONFIG[selectedUnit].notasFiscais);
    }
  };

  const handleChangeUnit = () => {
    setSelectedUnit(null);
    setMetricas(null);
    setError(null);
  };

  if (authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#003FC3" />
      </View>
    );
  }

  if (!isAuthenticated || !isSocio) {
    return (
      <View style={styles.container}>
        <AppHeader showBack />
        <View style={styles.noAccessContainer}>
          <MaterialIcons name="lock" size={48} color="#9CA3AF" />
          <Text style={styles.noAccessText}>Acesso restrito a sócios</Text>
        </View>
      </View>
    );
  }

  // Tela de seleção de unidade
  if (!selectedUnit) {
    return (
      <View style={styles.container}>
        <AppHeader showBack />
        <ScrollView contentContainerStyle={styles.selectUnitContainer}>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>PAINEL EXECUTIVO</Text>
          </View>
          <Text style={styles.welcomeText}>Olá, {user?.name}! 👋</Text>
          <Text style={styles.selectUnitTitle}>Escolha uma unidade</Text>
          
          <View style={styles.unitsGrid}>
            {unitAccess.map((access) => (
              <Pressable
                key={access.unitName}
                style={({ pressed }) => [
                  styles.unitCard,
                  pressed && styles.unitCardPressed,
                ]}
                onPress={() => handleSelectUnit(access.unitName)}
              >
                <View style={styles.unitIconContainer}>
                  <MaterialIcons name="business" size={28} color="#003FC3" />
                </View>
                <Text style={styles.unitName}>{access.unitName}</Text>
                <Text style={styles.unitAction}>ACESSAR INTELIGÊNCIA DE TRÁFEGO</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  // Tela de métricas da unidade selecionada
  return (
    <View style={styles.container}>
      <AppHeader showBack />
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#003FC3"]} />
        }
      >
        {/* Header do Painel */}
        <View style={styles.panelHeader}>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>PAINEL EXECUTIVO</Text>
          </View>
          <Text style={styles.welcomeText}>Olá, {user?.name}! 👋</Text>
          <Pressable style={styles.unitIndicator} onPress={handleChangeUnit}>
            <MaterialIcons name="location-on" size={16} color="#FFFFFF" />
            <Text style={styles.unitIndicatorText}>Espaçolaser {selectedUnit}</Text>
            {unitAccess.length > 1 && (
              <MaterialIcons name="keyboard-arrow-down" size={16} color="#FFFFFF" />
            )}
          </Pressable>
        </View>

        {/* Performance do Tráfego Pago */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance do Tráfego Pago</Text>
          {metricas && (
            <Text style={styles.updateTime}>
              Atualizado às {metricas.ultimaAtualizacao.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} • Dados em tempo real
            </Text>
          )}

          {loading ? (
            <View style={styles.loadingMetricas}>
              <ActivityIndicator size="large" color="#003FC3" />
              <Text style={styles.loadingText}>Carregando dados do Google Sheets...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={48} color="#EF4444" />
              <Text style={styles.errorText}>{error}</Text>
              <Pressable style={styles.retryButton} onPress={() => loadMetricas(selectedUnit)}>
                <Text style={styles.retryButtonText}>Tentar novamente</Text>
              </Pressable>
            </View>
          ) : metricas ? (
            <View style={styles.metricasGrid}>
              <View style={[styles.metricCard, { backgroundColor: "#DCFCE7" }]}>
                <Text style={[styles.metricValue, { color: "#22C55E" }]}>
                  {formatCurrency(metricas.investimento)}
                </Text>
                <Text style={styles.metricLabel}>INVESTIMENTO</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: "#E6F0FF" }]}>
                <Text style={[styles.metricValue, { color: "#003FC3" }]}>
                  {formatNumber(metricas.visualizacoes)}
                </Text>
                <Text style={styles.metricLabel}>VISUALIZAÇÕES</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: "#E6F0FF" }]}>
                <Text style={[styles.metricValue, { color: "#003FC3" }]}>
                  {formatNumber(metricas.alcance)}
                </Text>
                <Text style={styles.metricLabel}>PESSOAS ALCANÇADAS</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: "#E6F0FF" }]}>
                <Text style={[styles.metricValue, { color: "#003FC3" }]}>
                  {formatNumber(metricas.engajamento)}
                </Text>
                <Text style={styles.metricLabel}>ENGAJAMENTO</Text>
              </View>

              <View style={[styles.metricCard, styles.metricCardFull, { backgroundColor: "#FEF3C7" }]}>
                <Text style={[styles.metricValue, { color: "#D97706" }]}>
                  {formatNumber(metricas.cliques)}
                </Text>
                <Text style={styles.metricLabel}>CLIQUES NO LINK</Text>
              </View>
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              <MaterialIcons name="analytics" size={48} color="#9CA3AF" />
              <Text style={styles.noDataText}>Selecione uma unidade para ver as métricas</Text>
            </View>
          )}
        </View>

        {/* Informação sobre atualização */}
        <View style={styles.infoSection}>
          <MaterialIcons name="info-outline" size={16} color="#6B7280" />
          <Text style={styles.infoText}>
            Os dados são atualizados automaticamente a partir das planilhas do Google Sheets. 
            Puxe para baixo para atualizar.
          </Text>
        </View>

        {/* Espaço para o rodapé */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  noAccessContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  noAccessText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 12,
  },
  selectUnitContainer: {
    padding: 20,
  },
  headerBadge: {
    backgroundColor: "#003FC3",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  headerBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  selectUnitTitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 24,
  },
  unitsGrid: {
    gap: 16,
  },
  unitCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  unitCardPressed: {
    backgroundColor: "#F9FAFB",
    transform: [{ scale: 0.98 }],
  },
  unitIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E6F0FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  unitName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  unitAction: {
    fontSize: 10,
    fontWeight: "600",
    color: "#003FC3",
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  panelHeader: {
    backgroundColor: "#003FC3",
    padding: 20,
    paddingTop: 16,
  },
  unitIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  unitIndicatorText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  updateTime: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 16,
  },
  resourcesRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  resourceCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  resourceCardPressed: {
    backgroundColor: "#F9FAFB",
  },
  resourceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  resourceTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  resourceAction: {
    fontSize: 9,
    fontWeight: "600",
    color: "#003FC3",
    letterSpacing: 0.5,
  },
  loadingMetricas: {
    padding: 40,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },
  errorContainer: {
    padding: 40,
    alignItems: "center",
  },
  errorText: {
    marginTop: 12,
    fontSize: 14,
    color: "#EF4444",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: "#003FC3",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  noDataContainer: {
    padding: 40,
    alignItems: "center",
  },
  noDataText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  metricasGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metricCard: {
    width: "48%",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  metricCardFull: {
    width: "100%",
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#6B7280",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  infoSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 20,
    paddingTop: 0,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 18,
  },
});
