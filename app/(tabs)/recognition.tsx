import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput, Modal, ScrollView, useWindowDimensions, Image } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppAuth } from "@/lib/auth-context";
import { useData, Recognition } from "@/lib/data-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { AppHeader } from "@/components/app-header";
import { useNotifications } from "@/lib/notification-context";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

const RECOGNITION_TYPES = [
  { value: "parabens" as const, label: "Parabéns!", emoji: "🎉", description: "Reconheça uma conquista", color: "#22C55E", bg: "#DCFCE7" },
  { value: "obrigado" as const, label: "Obrigado!", emoji: "🙏", description: "Agradeça pela ajuda", color: "#003FC3", bg: "#E6F0FF" },
  { value: "destaque" as const, label: "Destaque!", emoji: "⭐", description: "Destaque um bom trabalho", color: "#FF9012", bg: "#FFF3E0" },
];

function RecognitionCard({ recognition }: { recognition: Recognition }) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Agora";
    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  const typeInfo = RECOGNITION_TYPES.find((t) => t.value === recognition.type) || RECOGNITION_TYPES[0];

  return (
    <View className="bg-white mx-4 mb-3 rounded-xl p-4 border border-gray-100">
      {/* Header */}
      <View className="flex-row items-center mb-3">
        <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: "#003FC3" }}>
          <Text className="text-white font-bold">{recognition.senderName[0]}</Text>
        </View>
        <View className="ml-3 flex-1">
          <Text className="text-gray-900">
            <Text className="font-semibold">{recognition.senderName}</Text>
            <Text className="text-gray-500"> enviou para </Text>
            <Text className="font-semibold">{recognition.receiverName}</Text>
          </Text>
          <Text className="text-xs text-gray-400 mt-1">
            {recognition.senderUnit} → {recognition.receiverUnit} • {formatTime(recognition.createdAt)}
          </Text>
        </View>
      </View>

      {/* Recognition Type */}
      <View className="flex-row items-center p-3 rounded-xl" style={{ backgroundColor: typeInfo.bg }}>
        <Text className="text-2xl mr-3">{typeInfo.emoji}</Text>
        <View className="flex-1">
          <Text className="font-semibold" style={{ color: typeInfo.color }}>{typeInfo.label}</Text>
          {recognition.message && (
            <Text className="text-gray-700 mt-1">{recognition.message}</Text>
          )}
        </View>
      </View>
    </View>
  );
}

function NewRecognitionModal({
  visible,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (receiverId: number, type: Recognition["type"], message?: string) => void;
}) {
  const insets = useSafeAreaInsets();
  const { user } = useAppAuth();
  const { allUsers } = useData();
  const [step, setStep] = useState<"user" | "type" | "message">("user");
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<Recognition["type"] | null>(null);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const filteredUsers = allUsers.filter(
    (u) =>
      u.id !== user?.id &&
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.unitName.toLowerCase().includes(search.toLowerCase()))
  );

  const selectedUserData = allUsers.find((u) => u.id === selectedUser);

  const handleClose = () => {
    setStep("user");
    setSelectedUser(null);
    setSelectedType(null);
    setMessage("");
    setSearch("");
    onClose();
  };

  const handleSubmit = () => {
    if (selectedUser && selectedType) {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      onSubmit(selectedUser, selectedType, message.trim() || undefined);
      handleClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View className="bg-white rounded-t-3xl max-h-[85%]">
          {/* Header */}
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <TouchableOpacity
              onPress={() => {
                if (step === "type") setStep("user");
                else if (step === "message") setStep("type");
                else handleClose();
              }}
            >
              <IconSymbol name="chevron.left" size={24} color="#1A1A2E" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-900">
              {step === "user" ? "Escolha quem reconhecer" : step === "type" ? "Tipo de reconhecimento" : "Adicionar mensagem"}
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <IconSymbol name="xmark" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Step 1: Select User */}
          {step === "user" && (
            <>
              <View className="px-4 py-2">
                <View className="flex-row items-center bg-gray-100 rounded-xl px-4">
                  <IconSymbol name="magnifyingglass" size={20} color="#9CA3AF" />
                  <TextInput
                    className="flex-1 py-3 px-3 text-base text-gray-900"
                    placeholder="Buscar colaborador..."
                    placeholderTextColor="#9CA3AF"
                    value={search}
                    onChangeText={setSearch}
                  />
                </View>
              </View>
              <FlatList
                data={filteredUsers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="flex-row items-center px-4 py-3"
                    onPress={() => {
                      setSelectedUser(item.id);
                      setStep("type");
                    }}
                    activeOpacity={0.7}
                  >
                    <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: "#003FC3" }}>
                      <Text className="text-white font-bold">{item.name[0]}</Text>
                    </View>
                    <View className="ml-3">
                      <Text className="font-medium text-gray-900">{item.name}</Text>
                      <Text className="text-sm text-gray-500">{item.unitName}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                contentContainerStyle={{ paddingBottom: 40 }}
              />
            </>
          )}

          {/* Step 2: Select Type */}
          {step === "type" && (
            <ScrollView className="p-4">
              {selectedUserData && (
                <View className="flex-row items-center mb-4 p-3 rounded-xl bg-gray-100">
                  <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: "#003FC3" }}>
                    <Text className="text-white font-bold">{selectedUserData.name[0]}</Text>
                  </View>
                  <View className="ml-3">
                    <Text className="font-medium text-gray-900">{selectedUserData.name}</Text>
                    <Text className="text-sm text-gray-500">{selectedUserData.unitName}</Text>
                  </View>
                </View>
              )}

              <Text className="text-sm font-medium text-gray-500 mb-3">Escolha o tipo:</Text>

              {RECOGNITION_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  className="flex-row items-center p-4 mb-3 rounded-xl border"
                  style={{
                    backgroundColor: selectedType === type.value ? type.bg : "#FFFFFF",
                    borderColor: selectedType === type.value ? type.color : "#E5E7EB",
                  }}
                  onPress={() => {
                    setSelectedType(type.value);
                    setStep("message");
                  }}
                  activeOpacity={0.7}
                >
                  <Text className="text-3xl mr-4">{type.emoji}</Text>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900">{type.label}</Text>
                    <Text className="text-sm text-gray-500">{type.description}</Text>
                  </View>
                  <IconSymbol name="chevron.right" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Step 3: Add Message */}
          {step === "message" && (
            <View className="p-4">
              {selectedUserData && selectedType && (
                <View className="flex-row items-center mb-4 p-3 rounded-xl bg-gray-100">
                  <Text className="text-2xl mr-3">
                    {RECOGNITION_TYPES.find((t) => t.value === selectedType)?.emoji}
                  </Text>
                  <View className="flex-1">
                    <Text className="font-medium text-gray-900">
                      {RECOGNITION_TYPES.find((t) => t.value === selectedType)?.label} para {selectedUserData.name}
                    </Text>
                    <Text className="text-sm text-gray-500">{selectedUserData.unitName}</Text>
                  </View>
                </View>
              )}

              <Text className="text-sm font-medium text-gray-500 mb-2">Adicione uma mensagem (opcional):</Text>
              <TextInput
                className="bg-gray-100 rounded-xl p-4 text-base text-gray-900 min-h-[100px]"
                placeholder="Escreva algo especial..."
                placeholderTextColor="#9CA3AF"
                value={message}
                onChangeText={setMessage}
                multiline
                style={{ textAlignVertical: "top" }}
              />

              <TouchableOpacity
                className="rounded-xl py-4 items-center mt-4"
                style={{ backgroundColor: "#003FC3" }}
                onPress={handleSubmit}
                activeOpacity={0.8}
              >
                <Text className="text-white font-semibold text-base">Enviar Reconhecimento</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

export default function RecognitionScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { isAuthenticated, loading: authLoading } = useAppAuth();
  const { recognitions, sendRecognition } = useData();
  const { unreadCount } = useNotifications();
  const [showNewRecognition, setShowNewRecognition] = useState(false);

  const isLargeScreen = width >= 768;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authLoading, isAuthenticated]);

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
      {/* Header com Logo Espaçolaser */}
      <AppHeader 
        notificationCount={unreadCount}
        onNotificationPress={() => router.push("/notifications" as any)}
      />

      {/* Título */}
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-bold text-gray-900">Reconhecimento</Text>
        <Text className="text-sm text-gray-500">Valorize seus colegas de trabalho</Text>
      </View>

      {/* Botões de Tipo */}
      <View className="px-4 py-4">
        <View className="flex-row justify-between">
          {RECOGNITION_TYPES.map((type) => (
            <TouchableOpacity
              key={type.value}
              className="flex-1 mx-1 p-4 rounded-xl items-center"
              style={{ backgroundColor: type.bg }}
              activeOpacity={0.7}
              onPress={() => setShowNewRecognition(true)}
            >
              <Text className="text-3xl mb-2">{type.emoji}</Text>
              <Text className="text-sm font-semibold" style={{ color: type.color }}>{type.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Lista de Reconhecimentos */}
      <View style={{ maxWidth: isLargeScreen ? 800 : undefined, alignSelf: "center", width: "100%", flex: 1 }}>
        <Text className="text-base font-semibold text-gray-900 px-4 mb-3">Reconhecimentos Recentes</Text>
        
        <FlatList
          data={recognitions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <RecognitionCard recognition={item} />}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <View className="bg-white mx-4 rounded-xl p-8 items-center border border-gray-100">
              <Text className="text-5xl mb-4">🌟</Text>
              <Text className="text-gray-900 font-semibold text-lg text-center">
                Seja o primeiro a reconhecer!
              </Text>
              <Text className="text-gray-500 text-center mt-2">
                Envie um reconhecimento para valorizar o trabalho de um colega.
              </Text>
            </View>
          }
        />
      </View>

      {/* Botão Flutuante */}
      <TouchableOpacity
        className="absolute bottom-24 right-6 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        style={{ backgroundColor: "#003FC3" }}
        onPress={() => setShowNewRecognition(true)}
        activeOpacity={0.8}
      >
        <IconSymbol name="plus" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      <NewRecognitionModal
        visible={showNewRecognition}
        onClose={() => setShowNewRecognition(false)}
        onSubmit={sendRecognition}
      />
    </View>
  );
}
