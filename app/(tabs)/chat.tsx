import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useAppAuth } from "@/lib/auth-context";
import { useData, Conversation, Message } from "@/lib/data-context";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

function ConversationCard({
  conversation,
  onPress,
}: {
  conversation: Conversation;
  onPress: () => void;
}) {
  const colors = useColors();

  const formatTime = (date?: Date) => {
    if (!date) return "";
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

  return (
    <TouchableOpacity
      className="flex-row items-center px-4 py-3 mx-4 mb-2 rounded-xl"
      style={{ backgroundColor: colors.surface }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        className="w-12 h-12 rounded-full items-center justify-center"
        style={{ backgroundColor: conversation.isGroup ? colors.accent : colors.primary }}
      >
        {conversation.isGroup ? (
          <IconSymbol name="person.fill" size={20} color="#FFFFFF" />
        ) : (
          <Text className="text-white font-bold text-lg">
            {conversation.name[0]}
          </Text>
        )}
      </View>
      <View className="flex-1 ml-3">
        <View className="flex-row items-center justify-between">
          <Text className="font-semibold text-foreground" numberOfLines={1}>
            {conversation.name}
          </Text>
          {conversation.lastMessageTime && (
            <Text className="text-xs text-muted">
              {formatTime(conversation.lastMessageTime)}
            </Text>
          )}
        </View>
        {conversation.lastMessage && (
          <Text className="text-sm text-muted mt-1" numberOfLines={1}>
            {conversation.lastMessage}
          </Text>
        )}
      </View>
      {conversation.unreadCount > 0 && (
        <View
          className="w-5 h-5 rounded-full items-center justify-center ml-2"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-white text-xs font-bold">
            {conversation.unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function ChatModal({
  visible,
  conversation,
  onClose,
}: {
  visible: boolean;
  conversation: Conversation | null;
  onClose: () => void;
}) {
  const colors = useColors();
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
      <ScreenContainer edges={["top", "bottom", "left", "right"]}>
        {/* Header */}
        <View
          className="flex-row items-center px-4 py-3 border-b"
          style={{ borderColor: colors.border }}
        >
          <TouchableOpacity onPress={onClose} className="mr-3">
            <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <View
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-white font-bold">{conversation.name[0]}</Text>
          </View>
          <Text className="flex-1 ml-3 font-semibold text-foreground text-lg">
            {conversation.name}
          </Text>
        </View>

        {/* Messages */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const isMe = item.senderId === user?.id;
            return (
              <View
                className={`mx-4 my-1 max-w-[80%] ${isMe ? "self-end" : "self-start"}`}
              >
                <View
                  className="px-4 py-2 rounded-2xl"
                  style={{
                    backgroundColor: isMe ? colors.primary : colors.surface,
                  }}
                >
                  {!isMe && (
                    <Text className="text-xs font-medium mb-1" style={{ color: colors.accent }}>
                      {item.senderName}
                    </Text>
                  )}
                  <Text style={{ color: isMe ? "#FFFFFF" : colors.foreground }}>
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
              <IconSymbol name="message.fill" size={48} color={colors.muted} />
              <Text className="text-muted mt-4">Nenhuma mensagem ainda</Text>
              <Text className="text-muted text-sm">Comece a conversa!</Text>
            </View>
          }
        />

        {/* Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View
            className="flex-row items-center px-4 py-3 border-t"
            style={{ borderColor: colors.border }}
          >
            <TextInput
              className="flex-1 px-4 py-3 rounded-full mr-2"
              style={{
                backgroundColor: colors.surface,
                color: colors.foreground,
              }}
              placeholder="Digite sua mensagem..."
              placeholderTextColor={colors.muted}
              value={message}
              onChangeText={setMessage}
              returnKeyType="send"
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{
                backgroundColor: message.trim() ? colors.primary : colors.muted,
              }}
              onPress={handleSend}
              disabled={!message.trim()}
            >
              <IconSymbol name="paperplane.fill" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScreenContainer>
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
  const colors = useColors();
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
        <View
          className="rounded-t-3xl max-h-[80%]"
          style={{ backgroundColor: colors.background }}
        >
          <View className="flex-row justify-between items-center p-4 border-b" style={{ borderColor: colors.border }}>
            <Text className="text-xl font-bold text-foreground">Nova Conversa</Text>
            <TouchableOpacity onPress={onClose}>
              <IconSymbol name="xmark" size={24} color={colors.muted} />
            </TouchableOpacity>
          </View>

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
                  onSelectUser(item.id);
                  onClose();
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
                  <Text className="text-sm text-muted">
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
  const colors = useColors();
  const { isAuthenticated, loading: authLoading } = useAppAuth();
  const { conversations, startConversation } = useData();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showNewChat, setShowNewChat] = useState(false);

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
      {/* Header */}
      <View className="px-4 py-3 border-b" style={{ borderColor: colors.border }}>
        <Text className="text-2xl font-bold text-foreground">Chat</Text>
        <Text className="text-sm text-muted">Converse com toda a equipe</Text>
      </View>

      {/* Conversations List */}
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ConversationCard
            conversation={item}
            onPress={() => setSelectedConversation(item)}
          />
        )}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          <View className="items-center py-12">
            <IconSymbol name="message.fill" size={48} color={colors.muted} />
            <Text className="text-muted mt-4">Nenhuma conversa ainda</Text>
            <Text className="text-muted text-sm">Inicie uma nova conversa!</Text>
          </View>
        }
      />

      {/* New Chat Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        style={{ backgroundColor: colors.accent }}
        onPress={() => setShowNewChat(true)}
        activeOpacity={0.8}
      >
        <IconSymbol name="plus" size={28} color="#FFFFFF" />
      </TouchableOpacity>

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
    </ScreenContainer>
  );
}
