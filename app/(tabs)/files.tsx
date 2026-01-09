import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, RefreshControl, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useAppAuth } from "@/lib/auth-context";
import { useData, FileItem } from "@/lib/data-context";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

function FileItemCard({ item, onPress }: { item: FileItem; onPress: () => void }) {
  const colors = useColors();

  const getIcon = () => {
    if (item.isFolder) return "folder.fill";
    if (item.mimeType?.includes("pdf")) return "doc.fill";
    if (item.mimeType?.includes("image")) return "photo.fill";
    return "doc.fill";
  };

  const getIconColor = () => {
    if (item.isFolder) return colors.accent;
    if (item.mimeType?.includes("pdf")) return colors.error;
    return colors.primary;
  };

  return (
    <TouchableOpacity
      className="flex-row items-center px-4 py-3 mx-4 mb-2 rounded-xl"
      style={{ backgroundColor: colors.surface }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        className="w-10 h-10 rounded-lg items-center justify-center"
        style={{ backgroundColor: `${getIconColor()}20` }}
      >
        <IconSymbol name={getIcon()} size={22} color={getIconColor()} />
      </View>
      <View className="flex-1 ml-3">
        <Text className="font-medium text-foreground" numberOfLines={1}>
          {item.name}
        </Text>
        {item.accessLevel === "socio" && (
          <View className="flex-row items-center mt-1">
            <IconSymbol name="lock.fill" size={12} color={colors.warning} />
            <Text className="text-xs ml-1" style={{ color: colors.warning }}>
              Restrito a sócios
            </Text>
          </View>
        )}
      </View>
      {item.isFolder && (
        <IconSymbol name="chevron.right" size={20} color={colors.muted} />
      )}
    </TouchableOpacity>
  );
}

export default function FilesScreen() {
  const colors = useColors();
  const { user, isAuthenticated, loading: authLoading } = useAppAuth();
  const { getFilesForUser } = useData();
  const [currentPath, setCurrentPath] = useState<{ id: number | null; name: string }[]>([
    { id: null, name: "Arquivos" },
  ]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authLoading, isAuthenticated]);

  const currentFolderId = currentPath[currentPath.length - 1].id;
  const files = getFilesForUser(currentFolderId);

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const isDesktop = width >= 1024;
  const contentMaxWidth = isDesktop ? 900 : isTablet ? 700 : undefined;

  const navigateToFolder = (folder: FileItem) => {
    setCurrentPath([...currentPath, { id: folder.id, name: folder.name }]);
  };

  const navigateBack = () => {
    if (currentPath.length > 1) {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };

  const navigateToPathIndex = (index: number) => {
    setCurrentPath(currentPath.slice(0, index + 1));
  };

  const handleFilePress = (item: FileItem) => {
    if (item.isFolder) {
      navigateToFolder(item);
    } else {
      // In a real app, this would open the file or download it
      // For demo, we just show an alert
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (authLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-muted">Carregando...</Text>
      </ScreenContainer>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <ScreenContainer>
      <View style={{ maxWidth: contentMaxWidth, alignSelf: contentMaxWidth ? 'center' : undefined, width: '100%', flex: 1 }}>
      {/* Header */}
      <View className="px-4 py-3 border-b" style={{ borderColor: colors.border }}>
        <Text className="text-2xl font-bold text-foreground">Arquivos</Text>
        <Text className="text-sm text-muted">{user?.unitNames?.[0] || "Grupo ONE"}</Text>
      </View>

      {/* Breadcrumb */}
      <View className="flex-row items-center px-4 py-2 flex-wrap" style={{ backgroundColor: colors.surface }}>
        {currentPath.map((item, index) => (
          <View key={index} className="flex-row items-center">
            {index > 0 && (
              <IconSymbol name="chevron.right" size={14} color={colors.muted} style={{ marginHorizontal: 4 }} />
            )}
            <TouchableOpacity
              onPress={() => navigateToPathIndex(index)}
              disabled={index === currentPath.length - 1}
            >
              <Text
                className={`text-sm ${index === currentPath.length - 1 ? "font-semibold" : ""}`}
                style={{ color: index === currentPath.length - 1 ? colors.foreground : colors.primary }}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Back Button */}
      {currentPath.length > 1 && (
        <TouchableOpacity
          className="flex-row items-center px-4 py-3"
          onPress={navigateBack}
          activeOpacity={0.7}
        >
          <IconSymbol name="arrow.left" size={20} color={colors.primary} />
          <Text className="ml-2 font-medium" style={{ color: colors.primary }}>
            Voltar
          </Text>
        </TouchableOpacity>
      )}

      {/* Files List */}
      <FlatList
        data={files}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <FileItemCard item={item} onPress={() => handleFilePress(item)} />
        )}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <View className="items-center py-12">
            <IconSymbol name="folder.fill" size={48} color={colors.muted} />
            <Text className="text-muted mt-4 text-center px-8">
              {currentPath.length === 1
                ? "Nenhum arquivo disponível para sua unidade"
                : "Esta pasta está vazia"}
            </Text>
          </View>
        }
      />

      {/* Info Banner */}
      {user?.appRole !== "socio" && (
        <View
          className="mx-4 mb-4 p-3 rounded-xl flex-row items-center"
          style={{ backgroundColor: `${colors.warning}20` }}
        >
          <IconSymbol name="info.circle.fill" size={20} color={colors.warning} />
          <Text className="flex-1 ml-2 text-sm" style={{ color: colors.warning }}>
            Alguns arquivos são restritos a sócios
          </Text>
        </View>
      )}
      </View>
    </ScreenContainer>
  );
}
