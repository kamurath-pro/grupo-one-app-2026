import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform, useWindowDimensions, ScrollView, Image } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppAuth } from "@/lib/auth-context";
import { useData, Conversation, Message } from "@/lib/data-context";
import { IconSymbol } from "@/components/ui/icon-symbol";

function ChatModal({
  visible,
  conversation,
  onClose,
}: {
  visible: boolean;
  conversation: Conversation | null;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { user } = useAppAuth();
  const { getMessages, sendMessage } = useData();
  const [message, setMessage] = useState("");

  if (!conversation) return null;

  const messages = getMessages(conversation.id);

  const handleSend = () => {
    if (message.trim() && conversation) {
      sendMessage(conversation.id, message.trim());
      setMessage("");
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View style={{ backgroundColor: "#003FC3", paddingTop: insets.top }}>
          <View className="flex-row items-center px-4 py-3">
            <TouchableOpacity onPress={onClose} className="mr-3 p-1">
              <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
              <Text className="text-white font-bold">{conversation.name[0]}</Text>
            </View>
            <Text className="flex-1 ml-3 font-semibold text-white text-lg">
              {conversation.name}
            </Text>
          </View>
        </View>

        {/* Messages */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const isMe = item.senderId === user?.id;
            return (
              <View className={`mx-4 my-1 max-w-[80%] ${isMe ? "self-end" : "self-start"}`}>
                <View
                  className="px-4 py-2 rounded-2xl"
                  style={{ backgroundColor: isMe ? "#003FC3" : "#FFFFFF" }}
                >
                  {!isMe && (
                    <Text className="text-xs font-medium mb-1" style={{ color: "#003FC3" }}>
                      {item.senderName}
                    </Text>
                  )}
                  <Text style={{ color: isMe ? "#FFFFFF" : "#1A1A2E" }}>
                    {item.content}
                  </Text>
                </View>
              </View>
            );
          }}
          contentContainerStyle={{ paddingVertical: 16 }}
          inverted={false}
          ListEmptyComponent={
            <View className="items-center py-12">
              <IconSymbol name="message.fill" size={48} color="#D1D5DB" />
              <Text className="text-gray-400 mt-4">Nenhuma mensagem ainda</Text>
              <Text className="text-gray-400 text-sm">Comece a conversa!</Text>
            </View>
          }
        />

        {/* Input */}
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <View className="flex-row items-center px-4 py-3 bg-white border-t border-gray-200">
            <TextInput
              className="flex-1 px-4 py-3 rounded-full mr-2 bg-gray-100 text-gray-900"
              placeholder="Digite sua mensagem..."
              placeholderTextColor="#9CA3AF"
              value={message}
              onChangeText={setMessage}
              returnKeyType="send"
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: message.trim() ? "#003FC3" : "#D1D5DB" }}
              onPress={handleSend}
              disabled={!message.trim()}
            >
              <IconSymbol name="paperplane.fill" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

function NewChatModal({
  visible,
  onClose,
  onSelectUser,
}: {
  visible: boolean;
  onClose: () => void;
  onSelectUser: (userId: number) => void;
}) {
  const insets = useSafeAreaInsets();
  const { user } = useAppAuth();
  const { allUsers } = useData();
  const [search, setSearch] = useState("");

  const filteredUsers = allUsers.filter(
    (u) =>
      u.id !== user?.id &&
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.unitName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View className="bg-white rounded-t-3xl max-h-[80%]">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-xl font-bold text-gray-900">Nova Conversa</Text>
            <TouchableOpacity onPress={onClose}>
              <IconSymbol name="xmark" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

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
                  onSelectUser(item.id);
                  onClose();
                }}
                activeOpacity={0.7}
              >
                <View className="w-10 h-10 rounded-full items-center justify-center" style={{ backgroundColor: "#003FC3" }}>
                  <Text className="text-white font-bold">{item.name[0]}</Text>
                </View>
                <View className="ml-3">
                  <Text className="font-medium text-gray-900">{item.name}</Text>
                  <Text className="text-sm text-gray-500">
                    {item.appRole === "socio" ? "Sócio(a)" : item.appRole === "gerente" ? "Gerente" : "Consultora"} • {item.unitName}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        </View>
      </View>
    </Modal>
  );
}

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { isAuthenticated, loading: authLoading, user } = useAppAuth();
  const { conversations, startConversation, allUsers } = useData();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const isLargeScreen = width >= 768;

  // Aniversariantes de exemplo
  const birthdays = [
    { name: "Valmir Pinto", date: "19/09", avatarUrl: null, isToday: true },
    { name: "Amanda Machado", date: "20/09", avatarUrl: null, isToday: false },
    { name: "Lucas Mendes", date: "27/09", avatarUrl: null, isToday: false },
    { name: "Carlos Andrade", date: "27/09", avatarUrl: null, isToday: false },
    { name: "Jéssica Flores", date: "29/09", avatarUrl: null, isToday: false },
  ];

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authLoading, isAuthenticated]);

  const handleNewChat = (userId: number) => {
    const conversationId = startConversation([userId]);
    const newConv = conversations.find((c) => c.id === conversationId);
    if (newConv) {
      setSelectedConversation(newConv);
    }
  };

  const filteredConversations = searchQuery
    ? conversations.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : conversations;

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
        <View className="flex-row items-center justify-between px-4 py-3">
          <Image
            source={require("@/assets/images/logo-grupo-one.png")}
            style={{ width: 100, height: 36 }}
            resizeMode="contain"
          />
          <TouchableOpacity className="relative p-2" activeOpacity={0.7}>
            <IconSymbol name="bell.fill" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ maxWidth: isLargeScreen ? 800 : undefined, alignSelf: "center", width: "100%" }}>
          
          {/* Seção de Aniversariantes */}
          <View className="py-4">
            <Text className="text-base font-semibold text-gray-900 px-4 mb-3">Aniversariantes</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            >
              {birthdays.map((person, index) => (
                <View key={index} className="items-center mr-4" style={{ width: 70 }}>
                  <View
                    className="w-14 h-14 rounded-full items-center justify-center mb-1"
                    style={{
                      backgroundColor: person.isToday ? "#003FC3" : "#E5E7EB",
                      borderWidth: person.isToday ? 3 : 0,
                      borderColor: "#003FC3",
                    }}
                  >
                    <Text
                      className="text-lg font-bold"
                      style={{ color: person.isToday ? "#FFFFFF" : "#6B7280" }}
                    >
                      {person.name.charAt(0)}
                    </Text>
                  </View>
                  <Text className="text-xs text-gray-900 text-center" numberOfLines={1}>
                    {person.name.split(" ")[0]}
                  </Text>
                  <Text
                    className="text-xs"
                    style={{ color: person.isToday ? "#003FC3" : "#6B7280", fontWeight: person.isToday ? "600" : "400" }}
                  >
                    {person.date}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Título Mensagens */}
          <View className="flex-row items-center justify-between px-4 mb-3">
            <Text className="text-base font-semibold text-gray-900">Mensagens</Text>
            <TouchableOpacity
              className="w-8 h-8 rounded-full items-center justify-center"
              style={{ backgroundColor: "#003FC3" }}
              onPress={() => setShowNewChat(true)}
              activeOpacity={0.7}
            >
              <IconSymbol name="plus" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Barra de Busca */}
          <View className="px-4 mb-4">
            <View className="flex-row items-center bg-white rounded-xl px-4 border border-gray-200">
              <IconSymbol name="magnifyingglass" size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 py-3 px-3 text-base text-gray-900"
                placeholder="Quem você está procurando?"
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <TouchableOpacity
                className="w-10 h-10 rounded-xl items-center justify-center -mr-2"
                style={{ backgroundColor: "#003FC3" }}
                activeOpacity={0.7}
              >
                <IconSymbol name="magnifyingglass" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Lista de Conversas */}
          <View className="bg-white mx-4 rounded-xl overflow-hidden border border-gray-100">
            {filteredConversations.length === 0 ? (
              <View className="items-center py-8">
                <IconSymbol name="message.fill" size={48} color="#D1D5DB" />
                <Text className="text-gray-400 mt-2">Nenhuma conversa ainda</Text>
                <TouchableOpacity
                  className="mt-4 px-6 py-2 rounded-full"
                  style={{ backgroundColor: "#003FC3" }}
                  onPress={() => setShowNewChat(true)}
                >
                  <Text className="text-white font-medium">Iniciar conversa</Text>
                </TouchableOpacity>
              </View>
            ) : (
              filteredConversations.map((conversation, index) => (
                <TouchableOpacity
                  key={conversation.id}
                  className="flex-row items-center p-4"
                  style={{
                    borderBottomWidth: index < filteredConversations.length - 1 ? 1 : 0,
                    borderBottomColor: "#F3F4F6",
                  }}
                  onPress={() => setSelectedConversation(conversation)}
                  activeOpacity={0.7}
                >
                  {/* Avatar */}
                  <View className="w-12 h-12 rounded-full items-center justify-center mr-3" style={{ backgroundColor: "#003FC3" }}>
                    <Text className="text-lg font-bold text-white">{conversation.name.charAt(0)}</Text>
                  </View>

                  {/* Conteúdo */}
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="font-semibold text-gray-900">{conversation.name}</Text>
                      {conversation.lastMessageTime && (
                        <Text className="text-xs text-gray-400">
                          {new Date(conversation.lastMessageTime).toLocaleDateString("pt-BR")}
                        </Text>
                      )}
                    </View>
                    {conversation.lastMessage && (
                      <Text className="text-sm text-gray-500" numberOfLines={1}>
                        {conversation.lastMessage}
                      </Text>
                    )}
                  </View>

                  {/* Badge de não lidas */}
                  {conversation.unreadCount > 0 && (
                    <View className="w-5 h-5 rounded-full items-center justify-center ml-2" style={{ backgroundColor: "#003FC3" }}>
                      <Text className="text-white text-xs font-bold">{conversation.unreadCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      <ChatModal
        visible={!!selectedConversation}
        conversation={selectedConversation}
        onClose={() => setSelectedConversation(null)}
      />

      <NewChatModal
        visible={showNewChat}
        onClose={() => setShowNewChat(false)}
        onSelectUser={handleNewChat}
      />
    </View>
  );
}
