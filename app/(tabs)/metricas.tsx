import { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, Pressable, RefreshControl, StyleSheet, ActivityIndicator, Linking } from "react-native";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAppAuth, UNITS } from "@/lib/auth-context";
import { AppHeader } from "@/components/app-header";

// Dados de métricas por unidade (links das planilhas Google Sheets)
const METRICAS_POR_UNIDADE: Record<string, { 
  sheetUrl: string; 
  relatorios: string; 
  notasFiscais: string;
}> = {
  "Araripina": {
    sheetUrl: "https://docs.google.com/spreadsheets/d/1XxorSEspVwY-VAa8XeR2YleixguDwGwVaumu3rQS9OI/edit?usp=sharing",
    relatorios: "https://drive.google.com/drive/folders/1_ruchybS9pn0wJLPPxQ532ERujkaFkXv?usp=sharing",
    notasFiscais: "https://drive.google.com/drive/folders/1KzbqZlewrEoKOajE3fO8ktOG25GCyb9z?usp=sharing",
  },
  "Serra Talhada": {
    sheetUrl: "https://docs.google.com/spreadsheets/d/1xkhRGEhHMyntv2DcGtZPovX3vAzKglqEnblRAFPxx10/edit?usp=sharing",
    relatorios: "https://drive.google.com/drive/folders/1rGELW3lZHYCSWwdxa-hKR2q3jHPi-RHy?usp=sharing",
    notasFiscais: "",
  },
  "Vitória Sto Antão": {
    sheetUrl: "https://docs.google.com/spreadsheets/d/1bZYM4-Iw-7TWMtNcgX1apj5jrSpR1pBPXKAVxciSOWo/edit?usp=sharing",
    relatorios: "https://drive.google.com/drive/folders/1wJRrTnvmljdl6rAUdCiV-h8BjNjGUrDl?usp=sharing",
    notasFiscais: "https://drive.google.com/drive/folders/11LxWga_VVM2BRszl06pCdjNuM5EKxXn1?usp=sharing",
  },
  "Shopping Plaza Macaé": {
    sheetUrl: "https://docs.google.com/spreadsheets/d/1example/edit?usp=sharing",
    relatorios: "https://drive.google.com/drive/folders/1dWjMOMh_4UPWAa553bT-WHNxpe7vLxJV?usp=sharing",
    notasFiscais: "https://drive.google.com/drive/folders/1sDRzGPbnanSmXuup83UiG5KvFDWqEcin?usp=sharing",
  },
  "Silva Jardim - Macaé": {
    sheetUrl: "https://docs.google.com/spreadsheets/d/1example2/edit?usp=sharing",
    relatorios: "",
    notasFiscais: "",
  },
};

// Interface para métricas
interface MetricasData {
  investimento: string;
  visualizacoes: string;
  pessoasAlcancadas: string;
  engajamento: string;
  cliques: string;
  ultimaAtualizacao: string;
}

// Dados de exemplo (em produção viriam do Google Sheets)
const METRICAS_EXEMPLO: MetricasData = {
  investimento: "R$ 802,00",
  visualizacoes: "81.369",
  pessoasAlcancadas: "43.473",
  engajamento: "26.904",
  cliques: "1.187",
  ultimaAtualizacao: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
};

export default function MetricasScreen() {
  const { user, isSocio, isAuthenticated, loading: authLoading, getUserUnitAccess } = useAppAuth();
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [metricas, setMetricas] = useState<MetricasData | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

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
    // Simular carregamento de dados do Google Sheets
    // Em produção, isso faria uma chamada para a API do Google Sheets
    await new Promise(resolve => setTimeout(resolve, 800));
    setMetricas({
      ...METRICAS_EXEMPLO,
      ultimaAtualizacao: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    });
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
    if (selectedUnit && METRICAS_POR_UNIDADE[selectedUnit]?.relatorios) {
      Linking.openURL(METRICAS_POR_UNIDADE[selectedUnit].relatorios);
    }
  };

  const handleOpenNotasFiscais = () => {
    if (selectedUnit && METRICAS_POR_UNIDADE[selectedUnit]?.notasFiscais) {
      Linking.openURL(METRICAS_POR_UNIDADE[selectedUnit].notasFiscais);
    }
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
        <AppHeader showBack title="Métricas" />
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
        <AppHeader showBack title="Métricas" />
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
      <AppHeader showBack title="Métricas" />
      
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
          <View style={styles.unitIndicator}>
            <MaterialIcons name="location-on" size={16} color="#FFFFFF" />
            <Text style={styles.unitIndicatorText}>Espaçolaser {selectedUnit}</Text>
          </View>
        </View>

        {/* Recursos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recursos</Text>
          <View style={styles.resourcesRow}>
            <Pressable
              style={({ pressed }) => [
                styles.resourceCard,
                pressed && styles.resourceCardPressed,
              ]}
              onPress={handleOpenRelatorios}
            >
              <View style={[styles.resourceIcon, { backgroundColor: "#E6F0FF" }]}>
                <MaterialIcons name="add-circle-outline" size={24} color="#003FC3" />
              </View>
              <Text style={styles.resourceTitle}>Relatórios Mensais</Text>
              <Text style={styles.resourceAction}>ACESSAR DOCUMENTO</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.resourceCard,
                pressed && styles.resourceCardPressed,
              ]}
              onPress={handleOpenNotasFiscais}
            >
              <View style={[styles.resourceIcon, { backgroundColor: "#FFF3E0" }]}>
                <MaterialIcons name="description" size={24} color="#FF9012" />
              </View>
              <Text style={styles.resourceTitle}>Notas Fiscais</Text>
              <Text style={styles.resourceAction}>ACESSAR DOCUMENTO</Text>
            </Pressable>
          </View>
        </View>

        {/* Performance do Tráfego Pago */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance do Tráfego Pago</Text>
          <Text style={styles.updateTime}>
            Atualizado às {metricas?.ultimaAtualizacao || "--:--"} • Mês atual
          </Text>

          {loading ? (
            <View style={styles.loadingMetricas}>
              <ActivityIndicator size="large" color="#003FC3" />
            </View>
          ) : (
            <View style={styles.metricasGrid}>
              <View style={[styles.metricCard, { backgroundColor: "#DCFCE7" }]}>
                <Text style={[styles.metricValue, { color: "#22C55E" }]}>
                  {metricas?.investimento || "R$ 0,00"}
                </Text>
                <Text style={styles.metricLabel}>INVESTIMENTO</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: "#E6F0FF" }]}>
                <Text style={[styles.metricValue, { color: "#003FC3" }]}>
                  {metricas?.visualizacoes || "0"}
                </Text>
                <Text style={styles.metricLabel}>VISUALIZAÇÕES</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: "#E6F0FF" }]}>
                <Text style={[styles.metricValue, { color: "#003FC3" }]}>
                  {metricas?.pessoasAlcancadas || "0"}
                </Text>
                <Text style={styles.metricLabel}>PESSOAS ALCANÇADAS</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: "#E6F0FF" }]}>
                <Text style={[styles.metricValue, { color: "#003FC3" }]}>
                  {metricas?.engajamento || "0"}
                </Text>
                <Text style={styles.metricLabel}>ENGAJAMENTO</Text>
              </View>

              <View style={[styles.metricCard, { backgroundColor: "#E6F0FF" }]}>
                <Text style={[styles.metricValue, { color: "#003FC3" }]}>
                  {metricas?.cliques || "0"}
                </Text>
                <Text style={styles.metricLabel}>CLIQUES</Text>
              </View>
            </View>
          )}
        </View>

        {/* Botão Trocar Unidade */}
        {unitAccess.length > 1 && (
          <Pressable
            style={({ pressed }) => [
              styles.changeUnitButton,
              pressed && styles.changeUnitButtonPressed,
            ]}
            onPress={() => setSelectedUnit(null)}
          >
            <MaterialIcons name="swap-horiz" size={20} color="#003FC3" />
            <Text style={styles.changeUnitText}>TROCAR UNIDADE</Text>
          </Pressable>
        )}

        {/* Espaço para o rodapé fixo */}
        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },
  noAccessContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noAccessText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
  },
  selectUnitContainer: {
    padding: 20,
    alignItems: "center",
  },
  scrollContent: {
    padding: 0,
  },
  panelHeader: {
    backgroundColor: "#1A1A2E",
    padding: 24,
    paddingTop: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerBadge: {
    backgroundColor: "#003FC3",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  headerBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  unitIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  unitIndicatorText: {
    color: "#FFFFFF",
    fontSize: 14,
    opacity: 0.9,
  },
  selectUnitTitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 8,
    marginBottom: 24,
  },
  unitsGrid: {
    width: "100%",
    gap: 16,
  },
  unitCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  unitCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  unitIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#E6F0FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  unitName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A2E",
    marginBottom: 8,
  },
  unitAction: {
    fontSize: 11,
    color: "#003FC3",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A2E",
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
  },
  resourceCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  resourceCardPressed: {
    opacity: 0.9,
  },
  resourceIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  resourceTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A2E",
    marginBottom: 4,
  },
  resourceAction: {
    fontSize: 10,
    color: "#6B7280",
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  loadingMetricas: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  metricasGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: "45%",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 10,
    color: "#6B7280",
    fontWeight: "600",
    letterSpacing: 0.3,
    textAlign: "center",
  },
  changeUnitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 20,
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#003FC3",
    backgroundColor: "#FFFFFF",
  },
  changeUnitButtonPressed: {
    opacity: 0.8,
  },
  changeUnitText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#003FC3",
    letterSpacing: 0.5,
  },
});
