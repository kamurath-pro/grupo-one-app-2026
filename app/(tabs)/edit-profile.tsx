import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppAuth } from "@/lib/auth-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { AppHeader } from "@/components/app-header";
import { useNotifications } from "@/lib/notification-context";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { user, isAuthenticated, loading: authLoading } = useAppAuth();
  const { unreadCount } = useNotifications();

  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const isLargeScreen = width >= 768;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBirthDate(user.birthDate || "");
    }
  }, [user]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Erro", "Nome é obrigatório");
      return;
    }

    setIsSaving(true);
    try {
      // Simular salvamento (em produção, isso seria uma chamada à API)
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      Alert.alert("Sucesso", "Perfil atualizado com sucesso");
      router.back();
    } catch (error) {
      Alert.alert("Erro", "Falha ao atualizar perfil");
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-400">Carregando...</Text>
      </View>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header com Logo Espaçolaser */}
      <AppHeader 
        notificationCount={unreadCount}
        onNotificationPress={() => router.push("/notifications" as any)}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ maxWidth: isLargeScreen ? 600 : undefined, alignSelf: "center", width: "100%" }}>
          
          {/* Header da Página */}
          <View className="mx-4 mt-4 flex-row items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <IconSymbol name="chevron.left" size={24} color="#003FC3" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-gray-900 ml-3">Editar Perfil</Text>
          </View>

          {/* Card de Edição */}
          <View className="bg-white mx-4 mt-6 rounded-xl p-6 border border-gray-100">
            
            {/* Nome */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Nome Completo</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900"
                placeholder="Digite seu nome"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
                editable={!isSaving}
              />
            </View>

            {/* Data de Nascimento */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Data de Nascimento</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900"
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9CA3AF"
                value={birthDate}
                onChangeText={setBirthDate}
                editable={!isSaving}
              />
              <Text className="text-xs text-gray-500 mt-1">Formato: YYYY-MM-DD</Text>
            </View>

            {/* Cargo (Somente Leitura) */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Cargo</Text>
              <View className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                <Text className="text-gray-900">
                  {user.appRole === "socio" ? "Sócio(a)" : 
                   user.appRole === "gerente" ? "Gerente" :
                   user.appRole === "consultora" ? "Consultora" :
                   user.appRole === "admin" ? "Administrador" : user.appRole}
                </Text>
              </View>
              <Text className="text-xs text-gray-500 mt-1">Não pode ser alterado</Text>
            </View>

            {/* Unidades (Somente Leitura) */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Unidades</Text>
              <View className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                <Text className="text-gray-900">{user.unitNames?.join(", ") || "Grupo ONE"}</Text>
              </View>
              <Text className="text-xs text-gray-500 mt-1">Não pode ser alterado</Text>
            </View>

            {/* Email (Somente Leitura) */}
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-700 mb-2">Email</Text>
              <View className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                <Text className="text-gray-900">{user.email}</Text>
              </View>
              <Text className="text-xs text-gray-500 mt-1">Não pode ser alterado</Text>
            </View>

            {/* Botões de Ação */}
            <View className="flex-row gap-3 mt-8">
              <TouchableOpacity
                className="flex-1 bg-gray-200 rounded-lg py-3 items-center justify-center"
                onPress={() => router.back()}
                disabled={isSaving}
              >
                <Text className="text-gray-700 font-semibold">Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 rounded-lg py-3 items-center justify-center"
                style={{ backgroundColor: "#003FC3" }}
                onPress={handleSave}
                disabled={isSaving}
              >
                <Text className="text-white font-semibold">
                  {isSaving ? "Salvando..." : "Salvar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
