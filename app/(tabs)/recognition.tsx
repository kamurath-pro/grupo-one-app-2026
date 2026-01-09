import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput, Modal, ScrollView, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useAppAuth } from "@/lib/auth-context";
import { useData, Recognition } from "@/lib/data-context";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

const RECOGNITION_TYPES = [
  { value: "parabens" as const, label: "Parabéns!", emoji: "🎉", description: "Reconheça uma conquista" },
  { value: "obrigado" as const, label: "Obrigado!", emoji: "🙏", description: "Agradeça pela ajuda" },
  { value: "destaque" as const, label: "Destaque!", emoji: "⭐", description: "Destaque um bom trabalho" },
];

function RecognitionCard({ recognition }: { recognition: Recognition }) {
  const colors = useColors();

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

  const getTypeInfo = (type: Recognition["type"]) => {
    return RECOGNITION_TYPES.find((t) => t.value === type) || RECOGNITION_TYPES[0];
  };

  const typeInfo = getTypeInfo(recognition.type);

  return (
    <View
      className="mx-4 mb-4 rounded-2xl p-4"
      style={{ backgroundColor: colors.surface }}
    >
      {/* Header */}
      <View className="flex-row items-center mb-3">
        <View
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-white font-bold">{recognition.senderName[0]}</Text>
        </View>
        <View className="ml-3 flex-1">
          <Text className="text-foreground">
            <Text className="font-semibold">{recognition.senderName}</Text>
            <Text className="text-muted"> enviou um reconhecimento para </Text>
            <Text className="font-semibold">{recognition.receiverName}</Text>
          </Text>
          <Text className="text-xs text-muted mt-1">
            {recognition.senderUnit} → {recognition.receiverUnit} • {formatTime(recognition.createdAt)}
          </Text>
        </View>
      </View>

      {/* Recognition Type */}
      <View
        className="flex-row items-center p-3 rounded-xl"
        style={{ backgroundColor: `${colors.accent}15` }}
      >
        <Text className="text-2xl mr-3">{typeInfo.emoji}</Text>
        <View className="flex-1">
          <Text className="font-semibold" style={{ color: colors.accent }}>
            {typeInfo.label}
          </Text>
          {recognition.message && (
            <Text className="text-foreground mt-1">{recognition.message}</Text>
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
  const colors = useColors();
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
        <View
          className="rounded-t-3xl max-h-[85%]"
          style={{ backgroundColor: colors.background }}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center p-4 border-b" style={{ borderColor: colors.border }}>
            <TouchableOpacity
              onPress={() => {
                if (step === "type") setStep("user");
                else if (step === "message") setStep("type");
                else handleClose();
              }}
            >
              <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-foreground">
              {step === "user" ? "Escolha quem reconhecer" : step === "type" ? "Tipo de reconhecimento" : "Adicionar mensagem"}
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <IconSymbol name="xmark" size={24} color={colors.muted} />
            </TouchableOpacity>
          </View>

          {/* Step 1: Select User */}
          {step === "user" && (
            <>
              <View className="px-4 py-2">
                <TextInput
                  className="px-4 py-3 rounded-xl"
                  style={{ backgroundColor: colors.surface, color: colors.foreground }}
                  placeholder="Buscar colaborador..."
                  placeholderTextColor={colors.muted}
                  value={search}
                  onChangeText={setSearch}
                />
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
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <Text className="text-white font-bold">{item.name[0]}</Text>
                    </View>
                    <View className="ml-3">
                      <Text className="font-medium text-foreground">{item.name}</Text>
                      <Text className="text-sm text-muted">{item.unitName}</Text>
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
                <View className="flex-row items-center mb-4 p-3 rounded-xl" style={{ backgroundColor: colors.surface }}>
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <Text className="text-white font-bold">{selectedUserData.name[0]}</Text>
                  </View>
                  <View className="ml-3">
                    <Text className="font-medium text-foreground">{selectedUserData.name}</Text>
                    <Text className="text-sm text-muted">{selectedUserData.unitName}</Text>
                  </View>
                </View>
              )}

              <Text className="text-sm font-medium text-muted mb-3">Escolha o tipo:</Text>

              {RECOGNITION_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  className="flex-row items-center p-4 mb-3 rounded-xl border"
                  style={{
                    backgroundColor: selectedType === type.value ? `${colors.accent}15` : colors.surface,
                    borderColor: selectedType === type.value ? colors.accent : colors.border,
                  }}
                  onPress={() => {
                    setSelectedType(type.value);
                    setStep("message");
                  }}
                  activeOpacity={0.7}
                >
                  <Text className="text-3xl mr-4">{type.emoji}</Text>
                  <View className="flex-1">
                    <Text className="font-semibold text-foreground">{type.label}</Text>
                    <Text className="text-sm text-muted">{type.description}</Text>
                  </View>
                  <IconSymbol name="chevron.right" size={20} color={colors.muted} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Step 3: Add Message */}
          {step === "message" && (
            <View className="p-4">
              {selectedUserData && selectedType && (
                <View className="flex-row items-center mb-4 p-3 rounded-xl" style={{ backgroundColor: colors.surface }}>
                  <Text className="text-2xl mr-3">
                    {RECOGNITION_TYPES.find((t) => t.value === selectedType)?.emoji}
                  </Text>
                  <View className="flex-1">
                    <Text className="font-medium text-foreground">
                      {RECOGNITION_TYPES.find((t) => t.value === selectedType)?.label} para {selectedUserData.name}
                    </Text>
                    <Text className="text-sm text-muted">{selectedUserData.unitName}</Text>
                  </View>
                </View>
              )}

              <Text className="text-sm font-medium text-muted mb-2">Adicione uma mensagem (opcional):</Text>
              <TextInput
                className="rounded-xl p-4 text-base min-h-[100px]"
                style={{
                  backgroundColor: colors.surface,
                  color: colors.foreground,
                  textAlignVertical: "top",
                }}
                placeholder="Escreva algo especial..."
                placeholderTextColor={colors.muted}
                value={message}
                onChangeText={setMessage}
                multiline
              />

              <TouchableOpacity
                className="rounded-xl py-4 items-center mt-4"
                style={{ backgroundColor: colors.primary }}
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
  const colors = useColors();
  const { isAuthenticated, loading: authLoading } = useAppAuth();
  const { recognitions, sendRecognition } = useData();
  const [showNewRecognition, setShowNewRecognition] = useState(false);

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const isDesktop = width >= 1024;
  const contentMaxWidth = isDesktop ? 800 : isTablet ? 600 : undefined;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authLoading, isAuthenticated]);

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
        <Text className="text-2xl font-bold text-foreground">Reconhecimento</Text>
        <Text className="text-sm text-muted">Valorize seus colegas de trabalho</Text>
      </View>

      {/* Recognition List */}
      <FlatList
        data={recognitions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <RecognitionCard recognition={item} />}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          <View className="items-center py-12 px-8">
            <Text className="text-5xl mb-4">🌟</Text>
            <Text className="text-foreground font-semibold text-lg text-center">
              Seja o primeiro a reconhecer!
            </Text>
            <Text className="text-muted text-center mt-2">
              Envie um reconhecimento para valorizar o trabalho de um colega.
            </Text>
          </View>
        }
      />

      {/* New Recognition Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        style={{ backgroundColor: colors.accent }}
        onPress={() => setShowNewRecognition(true)}
        activeOpacity={0.8}
      >
        <IconSymbol name="star.fill" size={28} color="#FFFFFF" />
      </TouchableOpacity>
      </View>

      <NewRecognitionModal
        visible={showNewRecognition}
        onClose={() => setShowNewRecognition(false)}
        onSubmit={sendRecognition}
      />
    </ScreenContainer>
  );
}
