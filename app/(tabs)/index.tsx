import { useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl, useWindowDimensions, Modal, TextInput, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAppAuth } from "@/lib/auth-context";
import { useData } from "@/lib/data-context";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { FloatingButton } from "@/components/floating-button";

// Categorias do Mural
const CATEGORIES = [
  { id: "geral", label: "GER", name: "Geral", color: "#1A1A2E" },
  { id: "mkt", label: "MKT", name: "Marketing", color: "#00B4D8" },
  { id: "adm", label: "ADM", name: "Administrativo", color: "#003FC3" },
  { id: "vendas", label: "VED", name: "Vendas", color: "#417CFF" },
  { id: "rh", label: "RH", name: "RH", color: "#DF007E" },
];

// Portal Cards Config
const PORTAL_CARDS = [
  { id: "arquivos", title: "Arquivos", description: "Acesse os documentos da sua unidade", icon: "folder.fill", iconColor: "#003FC3", iconBg: "#E6F0FF", route: "/files" },
  { id: "metricas", title: "Métricas", description: "Dados de tráfego em tempo real", icon: "chart.bar.fill", iconColor: "#22C55E", iconBg: "#DCFCE7", route: null },
  { id: "institucional", title: "Institucional", description: "Informações da Espaçolaser", icon: "building.2.fill", iconColor: "#FF9012", iconBg: "#FFF3E0", route: null },
  { id: "suporte", title: "Suporte", description: "Tire suas dúvidas", icon: "questionmark.circle.fill", iconColor: "#DF007E", iconBg: "#FCE4EC", route: null },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { user, isSocio } = useAppAuth();
  const { posts, addPost, likePost, allUsers } = useData();

  // Gerar aniversariantes de exemplo
  const birthdays = [
    { name: "Maria Silva", date: "08/01", avatarUrl: null },
    { name: "João Santos", date: "09/01", avatarUrl: null },
    { name: "Ana Costa", date: "10/01", avatarUrl: null },
  ];

  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("geral");
  const [activeTab, setActiveTab] = useState<"mural" | "membros">("mural");
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("geral");

  const isLargeScreen = width >= 768;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleCreatePost = () => {
    if (newPostContent.trim()) {
      addPost(newPostContent.trim(), newPostCategory);
      setNewPostContent("");
      setShowNewPostModal(false);
    }
  };

  const filteredPosts = selectedCategory === "geral" 
    ? posts 
    : posts.filter((p: any) => p.category === selectedCategory);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#003FC3" />}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ maxWidth: isLargeScreen ? 800 : undefined, alignSelf: "center", width: "100%" }}>
          
          {/* Saudação */}
          <View className="px-4 pt-4 pb-2">
            <Text className="text-lg text-gray-900">
              {user?.saudacao || `Olá, ${user?.name?.split(" ")[0] || "Usuário"}!`}
            </Text>
            <Text className="text-sm text-gray-500">
              {user?.unitNames?.join(", ") || "Grupo ONE"}
            </Text>
          </View>

          {/* Comunicado / Banner */}
          <View className="px-4 py-3">
            <Text className="text-base font-semibold text-gray-900 mb-3">Comunicado</Text>
            <TouchableOpacity 
              className="rounded-xl overflow-hidden"
              style={{ backgroundColor: "#001C65" }}
              activeOpacity={0.9}
            >
              <View className="p-4">
                <Text className="text-xs text-blue-200 mb-1">Novidade</Text>
                <Text className="text-lg font-bold text-white mb-2">
                  Bem-vindo ao App Grupo ONE!
                </Text>
                <Text className="text-sm text-blue-100">
                  Conectando colaboradores e sócios das unidades Espaçolaser.
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Portal - Grid de Cards */}
          <View className="px-4 py-3">
            <Text className="text-base font-semibold text-gray-900 mb-3">Portal</Text>
            <View className="flex-row flex-wrap" style={{ marginHorizontal: -6 }}>
              {PORTAL_CARDS.map((card) => (
                <View key={card.id} style={{ width: "50%", paddingHorizontal: 6, marginBottom: 12 }}>
                  <TouchableOpacity
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                    style={{ minHeight: 110 }}
                    activeOpacity={0.7}
                    onPress={() => card.route && router.push(card.route as any)}
                  >
                    <View className="flex-row items-start justify-between mb-3">
                      <View
                        className="w-10 h-10 rounded-lg items-center justify-center"
                        style={{ backgroundColor: card.iconBg }}
                      >
                        <IconSymbol name={card.icon as any} size={20} color={card.iconColor} />
                      </View>
                      <IconSymbol name="chevron.right" size={16} color="#003FC3" />
                    </View>
                    <Text className="text-sm font-semibold text-gray-900 mb-1">{card.title}</Text>
                    <Text className="text-xs text-gray-500" numberOfLines={2}>{card.description}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* Aniversariantes */}
          {birthdays.length > 0 && (
            <View className="py-3">
              <Text className="text-base font-semibold text-gray-900 px-4 mb-3">Aniversariantes</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
              >
                {birthdays.map((person: any, index: number) => (
                  <View key={index} className="items-center mr-4" style={{ width: 70 }}>
                    <View 
                      className="w-14 h-14 rounded-full items-center justify-center mb-1"
                      style={{ 
                        backgroundColor: index === 0 ? "#003FC3" : "#E5E7EB",
                        borderWidth: index === 0 ? 2 : 0,
                        borderColor: "#003FC3"
                      }}
                    >
                      {person.avatarUrl ? (
                        <Image source={{ uri: person.avatarUrl }} className="w-14 h-14 rounded-full" />
                      ) : (
                        <Text className="text-lg font-bold" style={{ color: index === 0 ? "#FFFFFF" : "#6B7280" }}>
                          {person.name.charAt(0)}
                        </Text>
                      )}
                    </View>
                    <Text className="text-xs text-gray-900 text-center" numberOfLines={1}>{person.name.split(" ")[0]}</Text>
                    <Text className="text-xs text-gray-500">{person.date}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Filtros de Categoria */}
          <View className="py-3">
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            >
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  className="items-center mr-4"
                  onPress={() => setSelectedCategory(cat.id)}
                  activeOpacity={0.7}
                >
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center mb-1"
                    style={{
                      backgroundColor: selectedCategory === cat.id ? cat.color : "#E5E7EB",
                      borderWidth: selectedCategory === cat.id ? 0 : 1,
                      borderColor: "#D1D5DB",
                    }}
                  >
                    <Text
                      className="text-xs font-bold"
                      style={{ color: selectedCategory === cat.id ? "#FFFFFF" : "#6B7280" }}
                    >
                      {cat.label}
                    </Text>
                  </View>
                  <Text className="text-xs text-gray-600">{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Tabs: Mural / Membros */}
          <View className="flex-row border-b border-gray-200 mx-4">
            <TouchableOpacity
              className="flex-1 py-3 items-center"
              style={{ borderBottomWidth: activeTab === "mural" ? 2 : 0, borderBottomColor: "#003FC3" }}
              onPress={() => setActiveTab("mural")}
            >
              <View className="flex-row items-center gap-2">
                <IconSymbol name="megaphone.fill" size={16} color={activeTab === "mural" ? "#003FC3" : "#6B7280"} />
                <Text style={{ color: activeTab === "mural" ? "#003FC3" : "#6B7280", fontWeight: activeTab === "mural" ? "600" : "400" }}>
                  Mural Oficial
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 py-3 items-center"
              style={{ borderBottomWidth: activeTab === "membros" ? 2 : 0, borderBottomColor: "#003FC3" }}
              onPress={() => setActiveTab("membros")}
            >
              <View className="flex-row items-center gap-2">
                <IconSymbol name="person.2.fill" size={16} color={activeTab === "membros" ? "#003FC3" : "#6B7280"} />
                <Text style={{ color: activeTab === "membros" ? "#003FC3" : "#6B7280", fontWeight: activeTab === "membros" ? "600" : "400" }}>
                  Membros
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Conteúdo do Tab */}
          {activeTab === "mural" ? (
            <View className="px-4 py-4">
              {filteredPosts.length === 0 ? (
                <View className="items-center py-8">
                  <IconSymbol name="doc.text.fill" size={48} color="#D1D5DB" />
                  <Text className="text-gray-400 mt-2">Nenhuma publicação ainda</Text>
                </View>
              ) : (
                filteredPosts.map((post: any) => (
                  <View key={post.id} className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
                    {/* Header do Post */}
                    <View className="flex-row items-center mb-3">
                      <View className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center mr-3">
                        {post.authorAvatar ? (
                          <Image source={{ uri: post.authorAvatar }} className="w-10 h-10 rounded-full" />
                        ) : (
                          <Text className="text-sm font-bold text-gray-600">{post.authorName.charAt(0)}</Text>
                        )}
                      </View>
                      <View className="flex-1">
                        <Text className="font-semibold text-gray-900">{post.authorName}</Text>
                        <Text className="text-xs text-gray-500">{post.authorRole} • {formatTimeAgo(post.createdAt)}</Text>
                      </View>
                      <TouchableOpacity className="p-1">
                        <IconSymbol name="info.circle.fill" size={20} color="#9CA3AF" />
                      </TouchableOpacity>
                    </View>

                    {/* Conteúdo */}
                    <Text className="text-gray-800 mb-3 leading-relaxed">{post.content}</Text>

                    {/* Imagem do Post (se houver) */}
                    {post.imageUrl && (
                      <Image
                        source={{ uri: post.imageUrl }}
                        className="w-full h-48 rounded-lg mb-3"
                        resizeMode="cover"
                      />
                    )}

                    {/* Reações */}
                    <View className="flex-row items-center justify-between pt-2 border-t border-gray-100">
                      <View className="flex-row items-center gap-1">
                        <View className="flex-row">
                          <View className="w-5 h-5 rounded-full bg-blue-500 items-center justify-center">
                            <Text className="text-white text-xs">👍</Text>
                          </View>
                          <View className="w-5 h-5 rounded-full bg-red-500 items-center justify-center -ml-1">
                            <Text className="text-white text-xs">❤️</Text>
                          </View>
                        </View>
                        <Text className="text-sm text-gray-500 ml-1">{post.likes}</Text>
                      </View>
                      <Text className="text-sm text-gray-500">{post.comments} comentários</Text>
                    </View>

                    {/* Ações */}
                    <View className="flex-row items-center justify-around mt-3 pt-3 border-t border-gray-100">
                      <TouchableOpacity
                        className="flex-row items-center gap-2 py-2 px-4"
                        onPress={() => likePost(post.id)}
                        activeOpacity={0.7}
                      >
                        <IconSymbol name="hand.thumbsup.fill" size={18} color={post.isLiked ? "#003FC3" : "#6B7280"} />
                        <Text style={{ color: post.isLiked ? "#003FC3" : "#6B7280" }}>Curtir</Text>
                      </TouchableOpacity>
                      <TouchableOpacity className="flex-row items-center gap-2 py-2 px-4" activeOpacity={0.7}>
                        <IconSymbol name="bubble.left.fill" size={18} color="#6B7280" />
                        <Text className="text-gray-500">Comentar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity className="flex-row items-center gap-2 py-2 px-4" activeOpacity={0.7}>
                        <IconSymbol name="square.and.arrow.up" size={18} color="#6B7280" />
                        <Text className="text-gray-500">Salvar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          ) : (
            <View className="px-4 py-4">
              <Text className="text-gray-500 text-center py-8">Lista de membros em breve</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Botão Flutuante */}
      <FloatingButton onPress={() => setShowNewPostModal(true)} />

      {/* Modal de Novo Post */}
      <Modal visible={showNewPostModal} animationType="slide" transparent>
        <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View className="bg-white rounded-t-3xl" style={{ maxHeight: "80%" }}>
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <TouchableOpacity onPress={() => setShowNewPostModal(false)}>
                <Text className="text-gray-500">Cancelar</Text>
              </TouchableOpacity>
              <Text className="text-lg font-bold text-gray-900">Nova Publicação</Text>
              <TouchableOpacity onPress={handleCreatePost}>
                <Text style={{ color: "#003FC3" }} className="font-semibold">Publicar</Text>
              </TouchableOpacity>
            </View>

            <ScrollView className="p-4">
              {/* Categoria */}
              <Text className="text-sm font-medium text-gray-600 mb-2">Categoria</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    className="mr-2 px-4 py-2 rounded-full"
                    style={{
                      backgroundColor: newPostCategory === cat.id ? cat.color : "#F5F7FA",
                    }}
                    onPress={() => setNewPostCategory(cat.id)}
                  >
                    <Text
                      className="text-sm font-medium"
                      style={{ color: newPostCategory === cat.id ? "#FFFFFF" : "#6B7280" }}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Conteúdo */}
              <TextInput
                className="bg-gray-50 rounded-xl p-4 text-base text-gray-900"
                style={{ minHeight: 150, textAlignVertical: "top" }}
                placeholder="O que você quer compartilhar?"
                placeholderTextColor="#9CA3AF"
                multiline
                value={newPostContent}
                onChangeText={setNewPostContent}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
