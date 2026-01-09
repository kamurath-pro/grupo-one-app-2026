import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, Image } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useAppAuth } from "@/lib/auth-context";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const PROFILE_PHOTO_KEY = "grupo_one_profile_photo";

function ProfileOption({
  icon,
  label,
  value,
  onPress,
  danger,
}: {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
}) {
  const colors = useColors();

  return (
    <TouchableOpacity
      className="flex-row items-center px-4 py-4"
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
    >
      <View
        className="w-10 h-10 rounded-full items-center justify-center"
        style={{ backgroundColor: danger ? `${colors.error}15` : colors.surface }}
      >
        <IconSymbol
          name={icon as any}
          size={20}
          color={danger ? colors.error : colors.primary}
        />
      </View>
      <View className="flex-1 ml-3">
        <Text
          className="font-medium"
          style={{ color: danger ? colors.error : colors.foreground }}
        >
          {label}
        </Text>
        {value && <Text className="text-sm text-muted">{value}</Text>}
      </View>
      {onPress && (
        <IconSymbol name="chevron.right" size={20} color={colors.muted} />
      )}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const { user, isAuthenticated, loading: authLoading, logout } = useAppAuth();
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

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
      <ScreenContainer className="items-center justify-center">
        <Text className="text-muted">Carregando...</Text>
      </ScreenContainer>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <ScreenContainer>
      <ScrollView>
        {/* Header */}
        <View className="items-center py-8 px-4">
          <TouchableOpacity onPress={handleChangePhoto} activeOpacity={0.8}>
            <View className="relative">
              {profilePhoto ? (
                <Image
                  source={{ uri: profilePhoto }}
                  className="w-24 h-24 rounded-full"
                  style={{ backgroundColor: colors.surface }}
                />
              ) : (
                <View
                  className="w-24 h-24 rounded-full items-center justify-center"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Text className="text-4xl font-bold text-white">{user.name[0]}</Text>
                </View>
              )}
              <View
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full items-center justify-center border-2"
                style={{ 
                  backgroundColor: colors.background, 
                  borderColor: colors.background 
                }}
              >
                <View
                  className="w-7 h-7 rounded-full items-center justify-center"
                  style={{ backgroundColor: colors.primary }}
                >
                  <IconSymbol name="camera.fill" size={14} color="#FFFFFF" />
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <Text className="text-xs text-muted mt-2">Toque para alterar a foto</Text>
          <Text className="text-2xl font-bold text-foreground mt-2">{user.name}</Text>
          <Text className="text-base text-muted mt-1">{getRoleLabel(user.appRole)}</Text>
          <View
            className="flex-row items-center mt-2 px-3 py-1 rounded-full"
            style={{ backgroundColor: colors.surface }}
          >
            <IconSymbol name="house.fill" size={14} color={colors.primary} />
            <Text className="ml-2 text-sm" style={{ color: colors.primary }}>
              {user.unitNames?.[0] || "Grupo ONE"}
            </Text>
          </View>
        </View>

        {/* Info Section */}
        <View className="mx-4 mb-6">
          <Text className="text-sm font-medium text-muted mb-2 px-2">INFORMAÇÕES</Text>
          <View className="rounded-2xl overflow-hidden" style={{ backgroundColor: colors.surface }}>
            <ProfileOption
              icon="envelope.fill"
              label="E-mail"
              value={user.email}
            />
            <View className="h-px mx-4" style={{ backgroundColor: colors.border }} />
            <ProfileOption
              icon="person.fill"
              label="Cargo"
              value={getRoleLabel(user.appRole)}
            />
            <View className="h-px mx-4" style={{ backgroundColor: colors.border }} />
            <ProfileOption
              icon="house.fill"
              label="Unidade"
              value={user.unitNames?.[0] || "Grupo ONE"}
            />
          </View>
        </View>

        {/* App Section */}
        <View className="mx-4 mb-6">
          <Text className="text-sm font-medium text-muted mb-2 px-2">APLICATIVO</Text>
          <View className="rounded-2xl overflow-hidden" style={{ backgroundColor: colors.surface }}>
            <ProfileOption
              icon="info.circle.fill"
              label="Sobre o Grupo ONE"
              onPress={() => {}}
            />
            <View className="h-px mx-4" style={{ backgroundColor: colors.border }} />
            <ProfileOption
              icon="doc.fill"
              label="Termos de Uso"
              onPress={() => {}}
            />
            <View className="h-px mx-4" style={{ backgroundColor: colors.border }} />
            <ProfileOption
              icon="lock.fill"
              label="Política de Privacidade"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Logout Section */}
        <View className="mx-4 mb-8">
          <View className="rounded-2xl overflow-hidden" style={{ backgroundColor: colors.surface }}>
            <ProfileOption
              icon="arrow.left"
              label="Sair da conta"
              onPress={handleLogout}
              danger
            />
          </View>
        </View>

        {/* Version */}
        <View className="items-center pb-8">
          <Text className="text-sm text-muted">Grupo ONE v1.0.0</Text>
          <Text className="text-xs text-muted mt-1">Desenvolvido por TráfegON</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
