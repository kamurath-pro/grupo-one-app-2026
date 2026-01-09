import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, RefreshControl } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useAppAuth, AppRole, PendingUser } from "@/lib/auth-context";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

type TabType = "pending" | "approved";

function PendingUserCard({
  user,
  onApprove,
  onReject,
}: {
  user: PendingUser;
  onApprove: () => void;
  onReject: () => void;
}) {
  const colors = useColors();

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
      default:
        return role;
    }
  };

  return (
    <View
      className="mx-4 mb-3 rounded-2xl p-4"
      style={{ backgroundColor: colors.surface }}
    >
      <View className="flex-row items-center mb-3">
        <View
          className="w-12 h-12 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-xl font-bold text-white">{user.name[0]}</Text>
        </View>
        <View className="flex-1 ml-3">
          <Text className="font-semibold text-foreground">{user.name}</Text>
          <Text className="text-sm text-muted">{user.email}</Text>
        </View>
      </View>

      <View className="flex-row flex-wrap gap-2 mb-3">
        <View
          className="px-2 py-1 rounded-full"
          style={{ backgroundColor: `${colors.primary}20` }}
        >
          <Text className="text-xs" style={{ color: colors.primary }}>
            {getRoleLabel(user.appRole)}
          </Text>
        </View>
        <View
          className="px-2 py-1 rounded-full"
          style={{ backgroundColor: `${colors.muted}20` }}
        >
          <Text className="text-xs text-muted">{user.unitName}</Text>
        </View>
      </View>

      <Text className="text-xs text-muted mb-3">
        Solicitado em {formatDate(user.registeredAt)}
      </Text>

      <View className="flex-row gap-2">
        <TouchableOpacity
          className="flex-1 py-3 rounded-xl items-center"
          style={{ backgroundColor: colors.error }}
          onPress={onReject}
        >
          <Text className="font-semibold text-white">Rejeitar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 py-3 rounded-xl items-center"
          style={{ backgroundColor: colors.success }}
          onPress={onApprove}
        >
          <Text className="font-semibold text-white">Aprovar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ApprovedUserCard({
  name,
  email,
  role,
  unitNames,
  onRemove,
}: {
  name: string;
  email: string;
  role: AppRole;
  unitNames: string[];
  onRemove: () => void;
}) {
  const colors = useColors();

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

  return (
    <View
      className="mx-4 mb-3 rounded-2xl p-4"
      style={{ backgroundColor: colors.surface }}
    >
      <View className="flex-row items-center">
        <View
          className="w-12 h-12 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-xl font-bold text-white">{name[0]}</Text>
        </View>
        <View className="flex-1 ml-3">
          <Text className="font-semibold text-foreground">{name}</Text>
          <Text className="text-sm text-muted">{email}</Text>
          <View className="flex-row flex-wrap gap-1 mt-1">
            <View
              className="px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${colors.primary}20` }}
            >
              <Text className="text-xs" style={{ color: colors.primary }}>
                {getRoleLabel(role)}
              </Text>
            </View>
            {unitNames.map((unit, idx) => (
              <View
                key={idx}
                className="px-2 py-0.5 rounded-full"
                style={{ backgroundColor: `${colors.muted}20` }}
              >
                <Text className="text-xs text-muted">{unit}</Text>
              </View>
            ))}
          </View>
        </View>
        <TouchableOpacity
          className="p-2 rounded-full"
          style={{ backgroundColor: `${colors.error}15` }}
          onPress={onRemove}
        >
          <IconSymbol name="trash.fill" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function AdminScreen() {
  const colors = useColors();
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

  if (authLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-muted">Carregando...</Text>
      </ScreenContainer>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <ScreenContainer>
      {/* Header */}
      <View className="px-4 py-3 border-b" style={{ borderColor: colors.border }}>
        <Text className="text-2xl font-bold text-foreground">Administração</Text>
        <Text className="text-sm text-muted">Gerencie usuários do Grupo ONE</Text>
      </View>

      {/* Tabs */}
      <View className="flex-row px-4 py-3 gap-2">
        <TouchableOpacity
          className="flex-1 py-3 rounded-xl items-center"
          style={{
            backgroundColor: activeTab === "pending" ? colors.primary : colors.surface,
          }}
          onPress={() => setActiveTab("pending")}
        >
          <Text
            className="font-semibold"
            style={{ color: activeTab === "pending" ? "#fff" : colors.foreground }}
          >
            Pendentes ({pendingUsers.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 py-3 rounded-xl items-center"
          style={{
            backgroundColor: activeTab === "approved" ? colors.primary : colors.surface,
          }}
          onPress={() => {
            setActiveTab("approved");
            setApprovedUsers(getApprovedUsers());
          }}
        >
          <Text
            className="font-semibold"
            style={{ color: activeTab === "approved" ? "#fff" : colors.foreground }}
          >
            Aprovados ({approvedUsers.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {activeTab === "pending" ? (
          <>
            {pendingUsers.length === 0 ? (
              <View className="flex-1 items-center justify-center py-16">
                <View
                  className="w-20 h-20 rounded-full items-center justify-center mb-4"
                  style={{ backgroundColor: colors.surface }}
                >
                  <IconSymbol name="checkmark.circle.fill" size={40} color={colors.success} />
                </View>
                <Text className="text-lg font-semibold text-foreground mb-2">
                  Nenhum cadastro pendente
                </Text>
                <Text className="text-sm text-muted text-center px-8">
                  Todos os cadastros foram analisados. Novos pedidos aparecerão aqui.
                </Text>
              </View>
            ) : (
              <View className="py-2">
                {pendingUsers.map((pendingUser) => (
                  <PendingUserCard
                    key={pendingUser.id}
                    user={pendingUser}
                    onApprove={() => handleApprove(pendingUser.id, pendingUser.name)}
                    onReject={() => handleReject(pendingUser.id, pendingUser.name)}
                  />
                ))}
              </View>
            )}
          </>
        ) : (
          <>
            {approvedUsers.length === 0 ? (
              <View className="flex-1 items-center justify-center py-16">
                <View
                  className="w-20 h-20 rounded-full items-center justify-center mb-4"
                  style={{ backgroundColor: colors.surface }}
                >
                  <IconSymbol name="person.2.fill" size={40} color={colors.muted} />
                </View>
                <Text className="text-lg font-semibold text-foreground mb-2">
                  Nenhum usuário aprovado
                </Text>
                <Text className="text-sm text-muted text-center px-8">
                  Usuários aprovados aparecerão aqui.
                </Text>
              </View>
            ) : (
              <View className="py-2">
                {approvedUsers.map((approvedUser) => (
                  <ApprovedUserCard
                    key={approvedUser.email}
                    name={approvedUser.name}
                    email={approvedUser.email}
                    role={approvedUser.appRole}
                    unitNames={approvedUser.unitNames}
                    onRemove={() => handleRemove(approvedUser.email, approvedUser.name)}
                  />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
