import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, useWindowDimensions, Linking, Image } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppAuth } from "@/lib/auth-context";
import { useData, FileItem } from "@/lib/data-context";
import { IconSymbol } from "@/components/ui/icon-symbol";

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
  const insets = useSafeAreaInsets();
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
        icon: "building.2.fill",
        iconColor: "#003FC3",
        iconBg: "#E6F0FF",
        description: `Documentos de ${access.unitName}`,
        children: [
          {
            id: `${access.unitName}-relatorios`,
            name: "Relatórios Mensais",
            type: "link" as const,
            icon: "chart.bar.fill",
            iconColor: "#22C55E",
            iconBg: "#DCFCE7",
            description: "Relatórios de desempenho mensal",
            url: access.relatoriosMensais,
          },
          {
            id: `${access.unitName}-notas`,
            name: "Notas Fiscais",
            type: "link" as const,
            icon: "doc.text.fill",
            iconColor: "#FF9012",
            iconBg: "#FFF3E0",
            description: "Notas fiscais e documentos fiscais",
            url: access.notasFiscais,
          },
          {
            id: `${access.unitName}-dados`,
            name: "Fonte de Dados",
            type: "link" as const,
            icon: "link",
            iconColor: "#DF007E",
            iconBg: "#FCE4EC",
            description: "Planilha de dados em tempo real",
            url: access.fonteDados,
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
        icon: "megaphone.fill",
        iconColor: "#003FC3",
        iconBg: "#E6F0FF",
        description: "Comunicados oficiais",
        children: [],
      },
      {
        id: "treinamentos",
        name: "Treinamentos",
        type: "folder",
        icon: "doc.text.fill",
        iconColor: "#22C55E",
        iconBg: "#DCFCE7",
        description: "Materiais de treinamento",
        children: [],
      },
      {
        id: "marketing",
        name: "Marketing",
        type: "folder",
        icon: "photo.fill",
        iconColor: "#FF9012",
        iconBg: "#FFF3E0",
        description: "Materiais de marketing",
        children: [],
      },
      {
        id: "procedimentos",
        name: "Procedimentos",
        type: "folder",
        icon: "doc.fill",
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
  const pageTitle = currentFolder?.name || "Arquivos";

  if (authLoading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-400">Carregando...</Text>
      </View>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header Azul */}
      <View style={{ backgroundColor: "#003FC3", paddingTop: insets.top }}>
        <View className="flex-row items-center px-4 py-3">
          {currentPath.length > 0 ? (
            <>
              <TouchableOpacity onPress={handleBack} className="mr-3 p-1">
                <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text className="text-white text-lg font-semibold">{pageTitle}</Text>
            </>
          ) : (
            <>
              <Image
                source={require("@/assets/images/logo-grupo-one.png")}
                style={{ width: 100, height: 36 }}
                resizeMode="contain"
              />
              <View className="flex-1" />
              <TouchableOpacity className="relative p-2" activeOpacity={0.7}>
                <IconSymbol name="bell.fill" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ maxWidth: isLargeScreen ? 800 : undefined, alignSelf: "center", width: "100%" }}>
          
          {/* Breadcrumb / Título */}
          {currentPath.length === 0 && (
            <View className="px-4 pt-4 pb-2">
              <Text className="text-2xl font-bold text-gray-900">Arquivos</Text>
              <Text className="text-sm text-gray-500">
                {isSocio ? "Acesse os documentos das suas unidades" : `Documentos de ${user?.unitNames?.[0] || "sua unidade"}`}
              </Text>
            </View>
          )}

          {/* Grid de Arquivos/Pastas */}
          <View className="px-4 py-4">
            {currentItems.length === 0 ? (
              <View className="bg-white rounded-xl p-8 items-center border border-gray-100">
                <IconSymbol name="folder.fill" size={48} color="#D1D5DB" />
                <Text className="text-gray-400 mt-4">Pasta vazia</Text>
                <Text className="text-gray-400 text-sm">Nenhum arquivo disponível</Text>
              </View>
            ) : (
              <View className="flex-row flex-wrap" style={{ marginHorizontal: -6 }}>
                {currentItems.map((item) => (
                  <View key={item.id} style={{ width: "50%", paddingHorizontal: 6, marginBottom: 12 }}>
                    <TouchableOpacity
                      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                      style={{ minHeight: 120 }}
                      activeOpacity={0.7}
                      onPress={() => handleItemPress(item)}
                    >
                      <View className="flex-row items-start justify-between mb-3">
                        <View
                          className="w-10 h-10 rounded-lg items-center justify-center"
                          style={{ backgroundColor: item.iconBg }}
                        >
                          <IconSymbol name={item.icon as any} size={20} color={item.iconColor} />
                        </View>
                        {item.type === "link" ? (
                          <IconSymbol name="link" size={16} color="#003FC3" />
                        ) : (
                          <IconSymbol name="chevron.right" size={16} color="#003FC3" />
                        )}
                      </View>
                      <Text className="text-sm font-semibold text-gray-900 mb-1">{item.name}</Text>
                      {item.description && (
                        <Text className="text-xs text-gray-500" numberOfLines={2}>{item.description}</Text>
                      )}
                      {item.type === "link" && (
                        <View className="flex-row items-center mt-2">
                          <View className="px-2 py-1 rounded-full" style={{ backgroundColor: "#E6F0FF" }}>
                            <Text className="text-xs" style={{ color: "#003FC3" }}>Abrir no Drive</Text>
                          </View>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Info para colaboradores */}
          {!isSocio && currentPath.length === 0 && (
            <View className="mx-4 p-4 rounded-xl" style={{ backgroundColor: "#E6F0FF" }}>
              <View className="flex-row items-start">
                <IconSymbol name="info.circle.fill" size={20} color="#003FC3" />
                <View className="flex-1 ml-3">
                  <Text className="text-sm font-medium" style={{ color: "#003FC3" }}>
                    Arquivos da sua unidade
                  </Text>
                  <Text className="text-xs text-gray-600 mt-1">
                    Você tem acesso aos documentos de {user?.unitNames?.[0] || "sua unidade"}. 
                    Para solicitar acesso a outros materiais, fale com sua gerente.
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
