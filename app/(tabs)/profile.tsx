import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, Image, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppAuth } from "@/lib/auth-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { AppHeader } from "@/components/app-header";
import { useNotifications } from "@/lib/notification-context";
import { useData } from "@/lib/data-context";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const PROFILE_PHOTO_KEY = "grupo_one_profile_photo";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { user, isAuthenticated, loading: authLoading, logout } = useAppAuth();
  const { unreadCount } = useNotifications();
  const { posts } = useData();
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  
  const userPosts = user ? posts.filter((p) => p.authorId === user.id) : [];

  const isLargeScreen = width >= 768;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authLoading, isAuthenticated]);

  // Load saved profile photo
  useEffect(() => {
    const loadProfilePhoto = async () => {
      if (user?.email) {
        try {
          const savedPhoto = await AsyncStorage.getItem(`${PROFILE_PHOTO_KEY}_${user.email}`);
          if (savedPhoto) {
            setProfilePhoto(savedPhoto);
          }
        } catch (error) {
          console.log("Error loading profile photo:", error);
        }
      }
    };
    loadProfilePhoto();
  }, [user?.email]);

  const handleChangePhoto = async () => {
    Alert.alert(
      "Foto de Perfil",
      "Escolha uma opção",
      [
        {
          text: "Tirar Foto",
          onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== "granted") {
              Alert.alert("Permissão necessária", "Precisamos de acesso à câmera para tirar fotos.");
              return;
            }
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ["images"],
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });
            if (!result.canceled && result.assets[0]) {
              const uri = result.assets[0].uri;
              setProfilePhoto(uri);
              if (user?.email) {
                await AsyncStorage.setItem(`${PROFILE_PHOTO_KEY}_${user.email}`, uri);
              }
              if (Platform.OS !== "web") {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }
            }
          },
        },
        {
          text: "Escolher da Galeria",
          onPress: async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
              Alert.alert("Permissão necessária", "Precisamos de acesso à galeria para escolher fotos.");
              return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ["images"],
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });
            if (!result.canceled && result.assets[0]) {
              const uri = result.assets[0].uri;
              setProfilePhoto(uri);
              if (user?.email) {
                await AsyncStorage.setItem(`${PROFILE_PHOTO_KEY}_${user.email}`, uri);
              }
              if (Platform.OS !== "web") {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }
            }
          },
        },
        profilePhoto ? {
          text: "Remover Foto",
          style: "destructive",
          onPress: async () => {
            setProfilePhoto(null);
            if (user?.email) {
              await AsyncStorage.removeItem(`${PROFILE_PHOTO_KEY}_${user.email}`);
            }
          },
        } : null,
        { text: "Cancelar", style: "cancel" },
      ].filter(Boolean) as any
    );
  };

  const handleLogout = () => {
    Alert.alert(
      "Sair da conta",
      "Tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            if (Platform.OS !== "web") {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
            await logout();
            router.replace("/login");
          },
        },
      ]
    );
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case "socio":
        return "Sócio(a)";
      case "gerente":
        return "Gerente";
      case "consultora":
        return "Consultora";
      case "admin":
        return "Administrador";
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
          
          {/* Card do Perfil */}
          <View className="bg-white mx-4 mt-4 rounded-xl p-6 items-center border border-gray-100">
            {/* Foto */}
            <TouchableOpacity onPress={handleChangePhoto} activeOpacity={0.8}>
              <View className="relative">
                {profilePhoto ? (
                  <Image
                    source={{ uri: profilePhoto }}
                    className="w-24 h-24 rounded-full"
                    style={{ backgroundColor: "#F3F4F6" }}
                  />
                ) : (
                  <View
                    className="w-24 h-24 rounded-full items-center justify-center"
                    style={{ backgroundColor: "#003FC3" }}
                  >
                    <Text className="text-white text-3xl font-bold">
                      {user.name.charAt(0)}
                    </Text>
                  </View>
                )}
                <View
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full items-center justify-center border-2 border-white"
                  style={{ backgroundColor: "#003FC3" }}
                >
                  <IconSymbol name="camera.fill" size={14} color="#FFFFFF" />
                </View>
              </View>
            </TouchableOpacity>
            <Text className="text-xs text-gray-400 mt-2">Toque para alterar</Text>

            {/* Nome e Cargo */}
            <Text className="text-xl font-bold text-gray-900 mt-3">{user.name}</Text>
            <View className="flex-row items-center mt-2">
              <View
                className="px-3 py-1 rounded-full"
                style={{ backgroundColor: user.appRole === "socio" ? "#FFF3E0" : "#E6F0FF" }}
              >
                <Text
                  className="text-sm font-medium"
                  style={{ color: user.appRole === "socio" ? "#FF9012" : "#003FC3" }}
                >
                  {getRoleLabel(user.appRole)}
                </Text>
              </View>
            </View>

            {/* Unidades */}
            <View className="flex-row items-center mt-3">
              <IconSymbol name="building.2.fill" size={16} color="#6B7280" />
              <Text className="text-sm text-gray-500 ml-2">
                {user.unitNames?.join(", ") || "Grupo ONE"}
              </Text>
            </View>

            {/* Email */}
            <View className="flex-row items-center mt-2">
              <IconSymbol name="envelope.fill" size={16} color="#6B7280" />
              <Text className="text-sm text-gray-500 ml-2">{user.email}</Text>
            </View>

            {/* Data de Nascimento */}
            {user.birthDate && (
              <View className="flex-row items-center mt-2">
                <IconSymbol name="calendar" size={16} color="#6B7280" />
                <Text className="text-sm text-gray-500 ml-2">{user.birthDate}</Text>
              </View>
            )}
          </View>

          {/* Seção de Postagens */}
          {userPosts.length > 0 && (
            <View className="mx-4 mt-6">
              <Text className="text-sm font-medium text-gray-500 mb-3 px-2">MINHAS POSTAGENS</Text>
              {userPosts.map((post) => (
                <View key={post.id} className="bg-white rounded-lg p-4 mb-3 border border-gray-100">
                  <Text className="text-sm text-gray-900 mb-2">{post.content}</Text>
                  <View className="flex-row items-center gap-4 mt-3">
                    <View className="flex-row items-center">
                      <MaterialIcons name="favorite-outline" size={16} color="#EF4444" />
                      <Text className="text-xs text-gray-500 ml-1">{post.likes}</Text>
                    </View>
                    <View className="flex-row items-center">
                      <MaterialIcons name="chat-bubble-outline" size={16} color="#003FC3" />
                      <Text className="text-xs text-gray-500 ml-1">{post.comments}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Seção de Opções */}
          <View className="mx-4 mt-6">
            <Text className="text-sm font-medium text-gray-500 mb-3 px-2">CONFIGURAÇÕES</Text>
            
            <View className="bg-white rounded-xl overflow-hidden border border-gray-100">
              {/* Editar Perfil */}
              <TouchableOpacity
                className="flex-row items-center p-4"
                activeOpacity={0.7}
                onPress={() => router.push("/(tabs)/edit-profile" as any)}
              >
                <View className="w-10 h-10 rounded-lg items-center justify-center" style={{ backgroundColor: "#E6F0FF" }}>
                  <IconSymbol name="person.fill" size={20} color="#003FC3" />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="font-medium text-gray-900">Editar Perfil</Text>
                  <Text className="text-sm text-gray-500">Altere suas informações</Text>
                </View>
                <IconSymbol name="chevron.right" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Botão Sair */}
          <View className="mx-4 mt-6">
            <TouchableOpacity
              className="bg-white rounded-xl p-4 flex-row items-center justify-center border border-red-200"
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <IconSymbol name="arrow.right.square.fill" size={20} color="#EF4444" />
              <Text className="text-red-500 font-semibold ml-2">Sair do Aplicativo</Text>
            </TouchableOpacity>
          </View>

          {/* Rodapé com Logo TráfegON */}
          <View className="items-center mt-8 mb-4">
            <Text className="text-xs text-gray-400 mb-2">Desenvolvido por</Text>
            <Image
              source={require("@/assets/images/logo-trafegon.png")}
              style={{ width: 100, height: 30 }}
              resizeMode="contain"
            />
            <Text className="text-xs text-gray-400 mt-2">Versão 1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
