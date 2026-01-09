import { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable, useWindowDimensions, Linking, StyleSheet } from "react-native";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAppAuth } from "@/lib/auth-context";
import { useData, FileItem } from "@/lib/data-context";
import { AppHeader } from "@/components/app-header";
// FooterLogos agora está fixo no _layout.tsx

// Tipos de arquivos/pastas
interface FileFolderItem {
  id: string;
  name: string;
  type: "folder" | "file" | "link";
  icon: string;
  iconColor: string;
  iconBg: string;
  description?: string;
  url?: string;
  children?: FileFolderItem[];
}

export default function FilesScreen() {
  const { width } = useWindowDimensions();
  const { user, isSocio, isAuthenticated, loading: authLoading, getUserUnitAccess } = useAppAuth();
  const { getFilesForUser } = useData();

  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [currentFolder, setCurrentFolder] = useState<FileFolderItem | null>(null);

  const isLargeScreen = width >= 768;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authLoading, isAuthenticated]);

  // Estrutura de arquivos baseada no tipo de usuário
  const getFilesStructure = (): FileFolderItem[] => {
    const unitAccess = getUserUnitAccess();
    
    if (isSocio && unitAccess.length > 0) {
      // Sócios veem links do Drive por unidade
      return unitAccess.map((access) => ({
        id: access.unitName.toLowerCase().replace(/\s/g, "-"),
        name: access.unitName,
        type: "folder" as const,
        icon: "business",
        iconColor: "#003FC3",
        iconBg: "#E6F0FF",
        description: `Documentos de ${access.unitName}`,
        children: [
          {
            id: `${access.unitName}-relatorios`,
            name: "Relatórios Mensais",
            type: "link" as const,
            icon: "bar-chart",
            iconColor: "#22C55E",
            iconBg: "#DCFCE7",
            description: "Relatórios de desempenho mensal",
            url: access.relatoriosMensais,
          },
          {
            id: `${access.unitName}-notas`,
            name: "Notas Fiscais",
            type: "link" as const,
            icon: "description",
            iconColor: "#FF9012",
            iconBg: "#FFF3E0",
            description: "Notas fiscais e documentos fiscais",
            url: access.notasFiscais,
          },
        ],
      }));
    }

    // Colaboradores veem estrutura padrão
    return [
      {
        id: "comunicados",
        name: "Comunicados",
        type: "folder",
        icon: "campaign",
        iconColor: "#003FC3",
        iconBg: "#E6F0FF",
        description: "Comunicados oficiais",
        children: [],
      },
      {
        id: "treinamentos",
        name: "Treinamentos",
        type: "folder",
        icon: "school",
        iconColor: "#22C55E",
        iconBg: "#DCFCE7",
        description: "Materiais de treinamento",
        children: [],
      },
      {
        id: "marketing",
        name: "Marketing",
        type: "folder",
        icon: "photo-library",
        iconColor: "#FF9012",
        iconBg: "#FFF3E0",
        description: "Materiais de marketing",
        children: [],
      },
      {
        id: "procedimentos",
        name: "Procedimentos",
        type: "folder",
        icon: "article",
        iconColor: "#DF007E",
        iconBg: "#FCE4EC",
        description: "Procedimentos operacionais",
        children: [],
      },
    ];
  };

  const filesStructure = getFilesStructure();

  const getCurrentItems = (): FileFolderItem[] => {
    if (currentPath.length === 0) {
      return filesStructure;
    }

    let current: FileFolderItem[] = filesStructure;
    for (const pathId of currentPath) {
      const folder = current.find((f) => f.id === pathId);
      if (folder?.children) {
        current = folder.children;
      }
    }
    return current;
  };

  const handleItemPress = (item: FileFolderItem) => {
    if (item.type === "folder" && item.children && item.children.length > 0) {
      setCurrentPath([...currentPath, item.id]);
      setCurrentFolder(item);
    } else if (item.type === "link" && item.url) {
      Linking.openURL(item.url);
    }
  };

  const handleBack = () => {
    if (currentPath.length > 0) {
      const newPath = currentPath.slice(0, -1);
      setCurrentPath(newPath);
      
      if (newPath.length === 0) {
        setCurrentFolder(null);
      } else {
        let current: FileFolderItem[] = filesStructure;
        let folder: FileFolderItem | null = null;
        for (const pathId of newPath) {
          folder = current.find((f) => f.id === pathId) || null;
          if (folder?.children) {
            current = folder.children;
          }
        }
        setCurrentFolder(folder);
      }
    }
  };

  const currentItems = getCurrentItems();
  const pageTitle = currentFolder?.name || "Documentos";

  if (authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <AppHeader
        showBack={currentPath.length > 0}
        title={currentPath.length > 0 ? pageTitle : undefined}
        onBackPress={handleBack}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.content, isLargeScreen && styles.contentLarge]}>
          
          {/* Título da página */}
          {currentPath.length === 0 && (
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Documentos</Text>
              <Text style={styles.subtitle}>
                {isSocio ? "Acesse os documentos das suas unidades" : `Documentos de ${user?.unitNames?.[0] || "sua unidade"}`}
              </Text>
            </View>
          )}

          {/* Grid de Arquivos/Pastas */}
          <View style={styles.gridContainer}>
            {currentItems.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialIcons name="folder" size={48} color="#D1D5DB" />
                <Text style={styles.emptyTitle}>Pasta vazia</Text>
                <Text style={styles.emptySubtitle}>Nenhum arquivo disponível</Text>
              </View>
            ) : (
              <View style={styles.grid}>
                {currentItems.map((item) => (
                  <View key={item.id} style={styles.gridItem}>
                    <Pressable
                      style={({ pressed }) => [
                        styles.card,
                        pressed && styles.cardPressed,
                      ]}
                      onPress={() => handleItemPress(item)}
                    >
                      <View style={styles.cardHeader}>
                        <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
                          <MaterialIcons name={item.icon as any} size={20} color={item.iconColor} />
                        </View>
                        <MaterialIcons 
                          name={item.type === "link" ? "open-in-new" : "chevron-right"} 
                          size={16} 
                          color="#003FC3" 
                        />
                      </View>
                      <Text style={styles.cardTitle}>{item.name}</Text>
                      {item.description && (
                        <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text>
                      )}
                      {item.type === "link" && (
                        <View style={styles.linkBadge}>
                          <Text style={styles.linkBadgeText}>Abrir no Drive</Text>
                        </View>
                      )}
                    </Pressable>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Info para colaboradores */}
          {!isSocio && currentPath.length === 0 && (
            <View style={styles.infoBox}>
              <MaterialIcons name="info-outline" size={20} color="#003FC3" />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Arquivos da sua unidade</Text>
                <Text style={styles.infoText}>
                  Você tem acesso aos documentos de {user?.unitNames?.[0] || "sua unidade"}. 
                  Para solicitar acesso a outros materiais, fale com sua gerente.
                </Text>
              </View>
            </View>
          )}
        </View>

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
    backgroundColor: "#F5F7FA",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#9CA3AF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  content: {
    width: "100%",
    alignSelf: "center",
  },
  contentLarge: {
    maxWidth: 800,
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  gridContainer: {
    padding: 16,
  },
  emptyState: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  emptyTitle: {
    color: "#9CA3AF",
    marginTop: 16,
    fontSize: 16,
  },
  emptySubtitle: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  gridItem: {
    width: "50%",
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: "#6B7280",
  },
  linkBadge: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#E6F0FF",
    alignSelf: "flex-start",
  },
  linkBadgeText: {
    fontSize: 12,
    color: "#003FC3",
  },
  infoBox: {
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#E6F0FF",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#003FC3",
  },
  infoText: {
    fontSize: 12,
    color: "#4B5563",
    marginTop: 4,
  },
});
