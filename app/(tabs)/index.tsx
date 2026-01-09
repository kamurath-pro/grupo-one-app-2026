import { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, TextInput, Modal, RefreshControl } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useAppAuth } from "@/lib/auth-context";
import { useData, Post } from "@/lib/data-context";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

function PostCard({ post, onLike, onComment }: { post: Post; onLike: () => void; onComment: () => void }) {
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

  const getRoleColor = (role: string) => {
    if (role.includes("Sócio")) return colors.accent;
    if (role === "Gerente") return colors.primary;
    return colors.muted;
  };

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
          <Text className="text-white font-bold">{post.authorName[0]}</Text>
        </View>
        <View className="ml-3 flex-1">
          <Text className="font-semibold text-foreground">{post.authorName}</Text>
          <View className="flex-row items-center gap-2">
            <Text
              className="text-xs font-medium"
              style={{ color: getRoleColor(post.authorRole) }}
            >
              {post.authorRole}
            </Text>
            <Text className="text-xs text-muted">• {post.authorUnit}</Text>
            <Text className="text-xs text-muted">• {formatTime(post.createdAt)}</Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <Text className="text-foreground text-base leading-6 mb-3">{post.content}</Text>

      {/* Actions */}
      <View className="flex-row items-center pt-3 border-t" style={{ borderColor: colors.border }}>
        <TouchableOpacity
          className="flex-row items-center mr-6"
          onPress={onLike}
          activeOpacity={0.7}
        >
          <IconSymbol
            name="heart.fill"
            size={20}
            color={post.liked ? colors.error : colors.muted}
          />
          <Text
            className="ml-1 text-sm"
            style={{ color: post.liked ? colors.error : colors.muted }}
          >
            {post.likesCount}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-row items-center"
          onPress={onComment}
          activeOpacity={0.7}
        >
          <IconSymbol name="bubble.left.fill" size={20} color={colors.muted} />
          <Text className="ml-1 text-sm text-muted">{post.commentsCount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function NewPostModal({
  visible,
  onClose,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (content: string) => void;
}) {
  const colors = useColors();
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content.trim());
      setContent("");
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View
          className="rounded-t-3xl p-6"
          style={{ backgroundColor: colors.background }}
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-foreground">Novo Post</Text>
            <TouchableOpacity onPress={onClose}>
              <IconSymbol name="xmark" size={24} color={colors.muted} />
            </TouchableOpacity>
          </View>
          <TextInput
            className="rounded-xl p-4 text-base min-h-[120px]"
            style={{
              backgroundColor: colors.surface,
              color: colors.foreground,
              textAlignVertical: "top",
            }}
            placeholder="O que você quer compartilhar?"
            placeholderTextColor={colors.muted}
            value={content}
            onChangeText={setContent}
            multiline
          />
          <TouchableOpacity
            className="rounded-xl py-4 items-center mt-4"
            style={{
              backgroundColor: content.trim() ? colors.primary : colors.muted,
            }}
            onPress={handleSubmit}
            disabled={!content.trim()}
          >
            <Text className="text-white font-semibold">Publicar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const { user, isAuthenticated, loading: authLoading } = useAppAuth();
  const { posts, addPost, likePost } = useData();
  const [showNewPost, setShowNewPost] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authLoading, isAuthenticated]);

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

  const canPost = user?.appRole === "socio" || user?.appRole === "gerente";

  return (
    <ScreenContainer>
      {/* Header */}
      <View className="px-4 py-3 flex-row items-center justify-between border-b" style={{ borderColor: colors.border }}>
        <View>
          <Text className="text-2xl font-bold text-foreground">Feed</Text>
          <Text className="text-sm text-muted">Olá, {user?.name}</Text>
        </View>
        <View
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.primary }}
        >
          <Text className="text-white font-bold">{user?.name?.[0] || "U"}</Text>
        </View>
      </View>

      {/* Posts List */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onLike={() => likePost(item.id)}
            onComment={() => {}}
          />
        )}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <View className="items-center py-12">
            <IconSymbol name="house.fill" size={48} color={colors.muted} />
            <Text className="text-muted mt-4">Nenhum post ainda</Text>
          </View>
        }
      />

      {/* New Post Button */}
      {canPost && (
        <TouchableOpacity
          className="absolute bottom-6 right-6 w-14 h-14 rounded-full items-center justify-center shadow-lg"
          style={{ backgroundColor: colors.accent }}
          onPress={() => setShowNewPost(true)}
          activeOpacity={0.8}
        >
          <IconSymbol name="plus" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      <NewPostModal
        visible={showNewPost}
        onClose={() => setShowNewPost(false)}
        onSubmit={addPost}
      />
    </ScreenContainer>
  );
}
