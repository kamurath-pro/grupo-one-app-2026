import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, RefreshControl, useWindowDimensions, Image } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppAuth, AppRole, PendingUser } from "@/lib/auth-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

type TabType = "pending" | "approved";

export default function AdminScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { 
    user, 
    isAuthenticated, 
    isAdmin, 
    loading: authLoading, 
    pendingUsers, 
    approveUser, 
    rejectUser,
    removeUser,
    getApprovedUsers,
    refreshPendingUsers 
  } = useAppAuth();
  
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [approvedUsers, setApprovedUsers] = useState<{ email: string; name: string; appRole: AppRole; unitNames: string[] }[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const isLargeScreen = width >= 768;

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      router.replace("/login");
    }
  }, [authLoading, isAuthenticated, isAdmin]);

  useEffect(() => {
    refreshPendingUsers();
    setApprovedUsers(getApprovedUsers());
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshPendingUsers();
    setApprovedUsers(getApprovedUsers());
    setRefreshing(false);
  };

  const handleApprove = async (userId: number, userName: string) => {
    Alert.alert(
      "Aprovar cadastro",
      `Deseja aprovar o cadastro de ${userName}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Aprovar",
          onPress: async () => {
            if (Platform.OS !== "web") {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            await approveUser(userId);
            setApprovedUsers(getApprovedUsers());
          },
        },
      ]
    );
  };

  const handleReject = async (userId: number, userName: string) => {
    Alert.alert(
      "Rejeitar cadastro",
      `Deseja rejeitar o cadastro de ${userName}? Esta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Rejeitar",
          style: "destructive",
          onPress: async () => {
            if (Platform.OS !== "web") {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
            await rejectUser(userId);
          },
        },
      ]
    );
  };

  const handleRemove = async (userEmail: string, userName: string) => {
    Alert.alert(
      "Remover usuário",
      `Deseja remover ${userName} do sistema? Esta pessoa perderá o acesso ao aplicativo imediatamente.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            if (Platform.OS !== "web") {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
            await removeUser(userEmail);
            setApprovedUsers(getApprovedUsers());
          },
        },
      ]
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "gerente":
        return "Gerente";
      case "consultora":
        return "Consultora";
      case "socio":
        return "Sócio(a)";
      default:
        return role;
    }
  };

  if (authLoading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-400">Carregando...</Text>
      </View>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header Azul */}
      <View style={{ backgroundColor: "#003FC3", paddingTop: insets.top }}>
        <View className="flex-row items-center justify-between px-4 py-3">
          <Image
            source={require("@/assets/images/logo-grupo-one.png")}
            style={{ width: 100, height: 36 }}
            resizeMode="contain"
          />
          <TouchableOpacity className="relative p-2" activeOpacity={0.7}>
            <IconSymbol name="bell.fill" size={24} color="#FFFFFF" />
            {pendingUsers.length > 0 && (
              <View className="absolute top-1 right-1 w-5 h-5 rounded-full items-center justify-center bg-red-500">
                <Text className="text-white text-xs font-bold">{pendingUsers.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Título */}
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-bold text-gray-900">Administração</Text>
        <Text className="text-sm text-gray-500">Gerencie usuários do Grupo ONE</Text>
      </View>

      {/* Tabs */}
      <View className="flex-row mx-4 mt-2 bg-gray-200 rounded-xl p-1">
        <TouchableOpacity
          className="flex-1 py-3 rounded-lg items-center"
          style={{ backgroundColor: activeTab === "pending" ? "#FFFFFF" : "transparent" }}
          onPress={() => setActiveTab("pending")}
        >
          <Text
            className="font-semibold"
            style={{ color: activeTab === "pending" ? "#003FC3" : "#6B7280" }}
          >
            Pendentes ({pendingUsers.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 py-3 rounded-lg items-center"
          style={{ backgroundColor: activeTab === "approved" ? "#FFFFFF" : "transparent" }}
          onPress={() => {
            setActiveTab("approved");
            setApprovedUsers(getApprovedUsers());
          }}
        >
          <Text
            className="font-semibold"
            style={{ color: activeTab === "approved" ? "#003FC3" : "#6B7280" }}
          >
            Aprovados ({approvedUsers.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#003FC3" />
        }
      >
        <View style={{ maxWidth: isLargeScreen ? 800 : undefined, alignSelf: "center", width: "100%" }}>
          {activeTab === "pending" ? (
            <View className="px-4 mt-4">
              {pendingUsers.length === 0 ? (
                <View className="bg-white rounded-xl p-8 items-center border border-gray-100">
                  <IconSymbol name="checkmark.circle.fill" size={48} color="#22C55E" />
                  <Text className="text-gray-900 font-semibold text-lg mt-4">
                    Nenhum cadastro pendente
                  </Text>
                  <Text className="text-gray-500 text-center mt-2">
                    Todos os cadastros foram analisados. Novos pedidos aparecerão aqui.
                  </Text>
                </View>
              ) : (
                pendingUsers.map((pendingUser) => (
                  <View
                    key={pendingUser.id}
                    className="bg-white rounded-xl p-4 mb-3 border border-gray-100"
                  >
                    <View className="flex-row items-start">
                      <View
                        className="w-12 h-12 rounded-full items-center justify-center"
                        style={{ backgroundColor: "#E6F0FF" }}
                      >
                        <Text className="text-lg font-bold" style={{ color: "#003FC3" }}>
                          {pendingUser.name.charAt(0)}
                        </Text>
                      </View>
                      <View className="flex-1 ml-3">
                        <Text className="font-semibold text-gray-900">{pendingUser.name}</Text>
                        <Text className="text-sm text-gray-500">{pendingUser.email}</Text>
                        <View className="flex-row items-center mt-1">
                          <View
                            className="px-2 py-0.5 rounded-full mr-2"
                            style={{ backgroundColor: "#FFF3E0" }}
                          >
                            <Text className="text-xs font-medium" style={{ color: "#FF9012" }}>
                              {getRoleLabel(pendingUser.appRole)}
                            </Text>
                          </View>
                          <Text className="text-xs text-gray-400">{pendingUser.unitName}</Text>
                        </View>
                        <Text className="text-xs text-gray-400 mt-1">
                          Solicitado em {formatDate(pendingUser.registeredAt)}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row mt-4">
                      <TouchableOpacity
                        className="flex-1 mr-2 py-3 rounded-xl items-center border border-red-200"
                        onPress={() => handleReject(pendingUser.id, pendingUser.name)}
                        activeOpacity={0.7}
                      >
                        <Text className="font-semibold text-red-500">Rejeitar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="flex-1 ml-2 py-3 rounded-xl items-center"
                        style={{ backgroundColor: "#003FC3" }}
                        onPress={() => handleApprove(pendingUser.id, pendingUser.name)}
                        activeOpacity={0.7}
                      >
                        <Text className="font-semibold text-white">Aprovar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          ) : (
            <View className="px-4 mt-4">
              {approvedUsers.length === 0 ? (
                <View className="bg-white rounded-xl p-8 items-center border border-gray-100">
                  <IconSymbol name="person.2.fill" size={48} color="#D1D5DB" />
                  <Text className="text-gray-900 font-semibold text-lg mt-4">
                    Nenhum usuário aprovado
                  </Text>
                  <Text className="text-gray-500 text-center mt-2">
                    Usuários aprovados aparecerão aqui.
                  </Text>
                </View>
              ) : (
                approvedUsers.map((approvedUser) => (
                  <View
                    key={approvedUser.email}
                    className="bg-white rounded-xl p-4 mb-3 border border-gray-100"
                  >
                    <View className="flex-row items-center">
                      <View
                        className="w-12 h-12 rounded-full items-center justify-center"
                        style={{ backgroundColor: "#003FC3" }}
                      >
                        <Text className="text-lg font-bold text-white">
                          {approvedUser.name.charAt(0)}
                        </Text>
                      </View>
                      <View className="flex-1 ml-3">
                        <Text className="font-semibold text-gray-900">{approvedUser.name}</Text>
                        <Text className="text-sm text-gray-500">{approvedUser.email}</Text>
                        <View className="flex-row items-center mt-1">
                          <View
                            className="px-2 py-0.5 rounded-full mr-2"
                            style={{ backgroundColor: "#DCFCE7" }}
                          >
                            <Text className="text-xs font-medium" style={{ color: "#22C55E" }}>
                              {getRoleLabel(approvedUser.appRole)}
                            </Text>
                          </View>
                          {approvedUser.unitNames.map((unit, idx) => (
                            <Text key={idx} className="text-xs text-gray-400">{unit}</Text>
                          ))}
                        </View>
                      </View>
                      <TouchableOpacity
                        className="p-2 rounded-full"
                        style={{ backgroundColor: "#FEE2E2" }}
                        onPress={() => handleRemove(approvedUser.email, approvedUser.name)}
                        activeOpacity={0.7}
                      >
                        <IconSymbol name="trash.fill" size={20} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
