import { useState, useCallback, useEffect } from "react";
import { View, Text, ScrollView, Pressable, RefreshControl, useWindowDimensions, Modal, TextInput, Linking, Platform } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAppAuth } from "@/lib/auth-context";
import { useData } from "@/lib/data-context";
import { useNotifications } from "@/lib/notification-context";
import { AppHeader } from "@/components/app-header";
// FooterLogos agora está fixo no _layout.tsx
import { ProfilePhoto } from "@/components/profile-photo";
import { ComunicadoCarousel } from "@/components/comunicado-carousel";

// Unidades (Times) para filtro
const UNIDADES = [
  { id: "geral", label: "Geral", icon: "groups" },
  { id: "araripina", label: "Araripina", icon: "location-on" },
  { id: "serra", label: "Serra Talhada", icon: "location-on" },
  { id: "garanhuns", label: "Garanhuns", icon: "location-on" },
  { id: "cajazeiras", label: "Cajazeiras", icon: "location-on" },
  { id: "vitoria", label: "Vitória", icon: "location-on" },
  { id: "livramento", label: "Livramento", icon: "location-on" },
  { id: "muriae", label: "Muriaé", icon: "location-on" },
  { id: "vilhena", label: "Vilhena", icon: "location-on" },
  { id: "corumba", label: "Corumbá", icon: "location-on" },
  { id: "fortaleza", label: "Fortaleza", icon: "location-on" },
  { id: "macae-plaza", label: "Macaé Plaza", icon: "location-on" },
  { id: "macae-centro", label: "Macaé Centro", icon: "location-on" },
];

// Portal Cards - Sócios veem 4, colaboradores/gerentes veem 2
const PORTAL_CARDS_SOCIO = [
  { id: "documentos", title: "Documentos", description: "Acesse Notas Fiscais e Relatórios", icon: "folder", iconColor: "#003FC3", iconBg: "#E6F0FF", route: "/(tabs)/files" },
  { id: "metricas", title: "Métricas", description: "Tráfego Pago em tempo real", icon: "bar-chart", iconColor: "#22C55E", iconBg: "#DCFCE7", route: null, action: "metricas" },
  { id: "arquivos-uteis", title: "Arquivos Úteis", description: "Vouchers, Artes, Termos e mais", icon: "description", iconColor: "#FF9012", iconBg: "#FFF3E0", route: null, action: "arquivos-uteis" },
  { id: "suporte", title: "Suporte", description: "Vamos resolver seu problema", icon: "chat", iconColor: "#25D366", iconBg: "#E8F5E9", route: null, action: "suporte" },
];

const PORTAL_CARDS_COLABORADOR = [
  { id: "documentos", title: "Documentos", description: "Acesse Notas Fiscais e Relatórios", icon: "folder", iconColor: "#003FC3", iconBg: "#E6F0FF", route: "/(tabs)/files" },
  { id: "suporte", title: "Suporte", description: "Vamos resolver seu problema", icon: "chat", iconColor: "#25D366", iconBg: "#E8F5E9", route: null, action: "suporte" },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { user, isSocio } = useAppAuth();
  const { posts, addPost, likePost, addComment, getComments, deleteComment, allUsers, birthdays, sendBirthdayWish } = useData();
  const { unreadCount, addNotification } = useNotifications();

  // Verificar aniversariantes de hoje e criar notificações
  useEffect(() => {
    const todayBirthdays = birthdays.filter(b => b.isTodayBirthday);
    todayBirthdays.forEach(birthday => {
      // Criar notificação interna para cada aniversário de hoje
      addNotification({
        type: "birthday",
        title: "🎂 Aniversário hoje!",
        message: `Hoje é aniversário de ${birthday.name} (${birthday.unitName}). Não esqueça de dar os parabéns!`,
        data: { birthdayId: birthday.id },
      });
    });
  }, []); // Executar apenas uma vez ao carregar

  const [refreshing, setRefreshing] = useState(false);
  const [selectedUnidade, setSelectedUnidade] = useState("geral");
  const [activeTab, setActiveTab] = useState<"mural" | "membros">("mural");
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostUnidade, setNewPostUnidade] = useState("geral");
  const [commentModalPost, setCommentModalPost] = useState<any>(null);
  const [newComment, setNewComment] = useState("");
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  const toggleComments = (postId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const isLargeScreen = width >= 768;
  const portalCards = isSocio ? PORTAL_CARDS_SOCIO : PORTAL_CARDS_COLABORADOR;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handlePortalAction = (card: any) => {
    if (card.route) {
      router.push(card.route as any);
    } else if (card.action === "suporte") {
      // Abrir WhatsApp
      Linking.openURL("https://wa.me/5587996466975");
    } else if (card.action === "metricas") {
      // Navegar para tela de métricas
      router.push("/(tabs)/metricas" as any);
    } else if (card.action === "arquivos-uteis") {
      // Abrir pasta do Drive com Vouchers, Artes, Termos
      Linking.openURL("https://drive.google.com/drive/folders/1WJ2KcWVMnAZZxkrUGtNV33jez8_YT2uR?usp=sharing");
    }
  };

  const handleCreatePost = () => {
    if (newPostContent.trim()) {
      addPost(newPostContent.trim(), newPostUnidade);
      setNewPostContent("");
      setShowNewPostModal(false);
    }
  };

  const handleAddComment = () => {
    if (newComment.trim() && commentModalPost) {
      addComment(commentModalPost.id, newComment.trim());
      setNewComment("");
      setCommentModalPost(null);
    }
  };

  const filteredPosts = selectedUnidade === "geral" 
    ? posts 
    : posts.filter((p: any) => p.category === selectedUnidade);

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
    <View style={{ flex: 1, backgroundColor: "#F5F7FA" }}>
      {/* Header com Logo Espaçolaser */}
      <AppHeader 
        notificationCount={unreadCount}
        onNotificationPress={() => router.push("/notifications" as any)}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#003FC3" />}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ maxWidth: isLargeScreen ? 800 : undefined, alignSelf: "center", width: "100%" }}>
          
          {/* Saudação com Foto de Perfil */}
          <View style={styles.greetingContainer}>
            <ProfilePhoto
              uri={user?.photoUrl}
              name={user?.name || "Usuário"}
              size={48}
            />
            <View style={styles.greetingText}>
              <Text style={styles.greetingName}>
                Olá, {user?.name?.split(" ")[0] || "Usuário"}!
              </Text>
              <Text style={styles.greetingUnit}>
                {user?.unitNames?.join(", ") || "Grupo ONE"}
              </Text>
            </View>
          </View>

          {/* Comunicado / Carrossel */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Comunicado</Text>
            <ComunicadoCarousel />
          </View>

          {/* Portal - Grid de Cards */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Portal</Text>
            <View style={styles.portalGrid}>
              {portalCards.map((card) => (
                <View key={card.id} style={styles.portalCardWrapper}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.portalCard,
                      pressed && styles.portalCardPressed,
                    ]}
                    onPress={() => handlePortalAction(card)}
                  >
                    <View style={styles.portalCardHeader}>
                      <View style={[styles.portalIconContainer, { backgroundColor: card.iconBg }]}>
                        <MaterialIcons name={card.icon as any} size={20} color={card.iconColor} />
                      </View>
                      <MaterialIcons name="chevron-right" size={16} color="#003FC3" />
                    </View>
                    <Text style={styles.portalCardTitle}>{card.title}</Text>
                    <Text style={styles.portalCardDescription} numberOfLines={2}>{card.description}</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </View>

          {/* Aniversários do Mês */}
          {birthdays.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Aniversários do mês</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
              >
                {birthdays.map((person: any) => (
                  <View key={person.id} style={styles.birthdayItem}>
                    <View style={[
                      styles.birthdayAvatar,
                      person.isTodayBirthday && styles.birthdayAvatarHighlight
                    ]}>
                      {person.avatarUrl ? (
                        <Image source={{ uri: person.avatarUrl }} style={styles.birthdayAvatarImage} />
                      ) : (
                        <Text style={[
                          styles.birthdayAvatarText,
                          person.isTodayBirthday && styles.birthdayAvatarTextHighlight
                        ]}>
                          {person.name.charAt(0)}
                        </Text>
                      )}
                      {person.isTodayBirthday && (
                        <View style={styles.birthdayBadge}>
                          <Text style={styles.birthdayBadgeText}>🎂</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.birthdayName} numberOfLines={1}>{person.name.split(" ")[0]}</Text>
                    <Text style={styles.birthdayDate}>
                      {person.birthDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                    </Text>
                    {/* Botão Parabéns só aparece para aniversário do dia */}
                    {person.isTodayBirthday && (
                      <Pressable
                        style={({ pressed }) => [
                          styles.birthdayWishButton,
                          pressed && styles.birthdayWishButtonPressed,
                        ]}
                        onPress={() => {
                          sendBirthdayWish(person.id);
                          // Feedback visual de sucesso
                          if (Platform.OS === "web") {
                            alert(`🎉 Parabéns enviado para ${person.name}!`);
                          }
                        }}
                      >
                        <Text style={styles.birthdayWishText}>🎉 Parabéns</Text>
                      </Pressable>
                    )}
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Filtros de Times (Unidades) */}
          <View style={styles.section}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            >
              {UNIDADES.map((unidade) => (
                <Pressable
                  key={unidade.id}
                  style={styles.unidadeItem}
                  onPress={() => setSelectedUnidade(unidade.id)}
                >
                  <View style={[
                    styles.unidadeCircle,
                    selectedUnidade === unidade.id && styles.unidadeCircleSelected
                  ]}>
                    <MaterialIcons 
                      name={unidade.icon as any} 
                      size={20} 
                      color={selectedUnidade === unidade.id ? "#FFFFFF" : "#6B7280"} 
                    />
                  </View>
                  <Text style={[
                    styles.unidadeLabel,
                    selectedUnidade === unidade.id && styles.unidadeLabelSelected
                  ]} numberOfLines={1}>
                    {unidade.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Tabs: Mural / Membros */}
          <View style={styles.tabsContainer}>
            <Pressable
              style={[styles.tab, activeTab === "mural" && styles.tabActive]}
              onPress={() => setActiveTab("mural")}
            >
              <MaterialIcons 
                name="campaign" 
                size={16} 
                color={activeTab === "mural" ? "#003FC3" : "#6B7280"} 
              />
              <Text style={[styles.tabText, activeTab === "mural" && styles.tabTextActive]}>
                Mural Oficial
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tab, activeTab === "membros" && styles.tabActive]}
              onPress={() => setActiveTab("membros")}
            >
              <MaterialIcons 
                name="people" 
                size={16} 
                color={activeTab === "membros" ? "#003FC3" : "#6B7280"} 
              />
              <Text style={[styles.tabText, activeTab === "membros" && styles.tabTextActive]}>
                Membros
              </Text>
            </Pressable>
          </View>

          {/* Conteúdo do Tab */}
          {activeTab === "mural" ? (
            <View style={styles.postsContainer}>
              {filteredPosts.length === 0 ? (
                <View style={styles.emptyState}>
                  <MaterialIcons name="article" size={48} color="#D1D5DB" />
                  <Text style={styles.emptyStateText}>Nenhuma publicação ainda</Text>
                </View>
              ) : (
                filteredPosts.map((post: any) => (
                  <View key={post.id} style={styles.postCard}>
                    {/* Header do Post */}
                    <View style={styles.postHeader}>
                      <ProfilePhoto
                        uri={post.authorAvatar}
                        name={post.authorName}
                        size={40}
                      />
                      <View style={styles.postAuthorInfo}>
                        <Text style={styles.postAuthorName}>{post.authorName}</Text>
                        <Text style={styles.postMeta}>{post.authorRole} • {formatTimeAgo(post.createdAt)}</Text>
                      </View>
                    </View>

                    {/* Conteúdo */}
                    <Text style={styles.postContent}>{post.content}</Text>

                    {/* Imagem do Post (se houver) */}
                    {post.imageUrl && (
                      <Image
                        source={{ uri: post.imageUrl }}
                        style={styles.postImage}
                        contentFit="cover"
                      />
                    )}

                    {/* Contagem de reações */}
                    <View style={styles.postStats}>
                      {post.likes > 0 && (
                        <View style={styles.postStatItem}>
                          <MaterialIcons name="favorite" size={14} color="#003FC3" />
                          <Text style={styles.postStatText}>{post.likes}</Text>
                        </View>
                      )}
                      {post.comments > 0 && (
                        <Text style={styles.postStatText}>{post.comments} comentários</Text>
                      )}
                    </View>

                    {/* Ações - Curtir, Comentar e Ver comentários */}
                    <View style={styles.postActions}>
                      <Pressable
                        style={styles.postActionButton}
                        onPress={() => likePost(post.id)}
                      >
                        <MaterialIcons 
                          name={post.isLiked ? "favorite" : "favorite-border"} 
                          size={20} 
                          color={post.isLiked ? "#003FC3" : "#6B7280"} 
                        />
                        <Text style={[
                          styles.postActionText,
                          post.isLiked && styles.postActionTextActive
                        ]}>Curtir</Text>
                      </Pressable>
                      <Pressable
                        style={styles.postActionButton}
                        onPress={() => setCommentModalPost(post)}
                      >
                        <MaterialIcons name="chat-bubble-outline" size={20} color="#6B7280" />
                        <Text style={styles.postActionText}>Comentar</Text>
                      </Pressable>
                      {post.comments > 0 && (
                        <Pressable
                          style={styles.postActionButton}
                          onPress={() => toggleComments(post.id)}
                        >
                          <MaterialIcons 
                            name={expandedComments.has(post.id) ? "expand-less" : "expand-more"} 
                            size={20} 
                            color="#6B7280" 
                          />
                          <Text style={styles.postActionText}>
                            {expandedComments.has(post.id) ? "Ocultar" : "Ver comentários"}
                          </Text>
                        </Pressable>
                      )}
                    </View>

                    {/* Comentários expandidos inline */}
                    {expandedComments.has(post.id) && (
                      <View style={styles.inlineComments}>
                        {getComments(post.id).map((comment: any) => (
                          <View key={comment.id} style={styles.inlineCommentItem}>
                            <ProfilePhoto
                              uri={comment.authorAvatar}
                              name={comment.authorName}
                              size={28}
                            />
                            <View style={styles.inlineCommentContent}>
                              <Text style={styles.inlineCommentAuthor}>{comment.authorName}</Text>
                              <Text style={styles.inlineCommentText}>{comment.content}</Text>
                            </View>
                            {comment.authorId === user?.id && (
                              <Pressable
                                style={styles.deleteCommentButton}
                                onPress={() => deleteComment(comment.id)}
                              >
                                <MaterialIcons name="delete-outline" size={16} color="#EF4444" />
                              </Pressable>
                            )}
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))
              )}
            </View>
          ) : (
            <View style={styles.postsContainer}>
              {allUsers.length === 0 ? (
                <View style={styles.emptyState}>
                  <MaterialIcons name="people" size={48} color="#D1D5DB" />
                  <Text style={styles.emptyStateText}>Nenhum membro encontrado</Text>
                </View>
              ) : (
                allUsers.map((member: any, index: number) => (
                  <View key={index} style={styles.memberCard}>
                    <ProfilePhoto
                      uri={member.photoUrl}
                      name={member.name}
                      size={48}
                    />
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberName}>{member.name}</Text>
                      <Text style={styles.memberRole}>{member.role}</Text>
                      {member.unitNames && (
                        <Text style={styles.memberUnit}>{member.unitNames.join(", ")}</Text>
                      )}
                    </View>
                  </View>
                ))
              )}
            </View>
          )}
        </View>

        {/* Espaço para o rodapé fixo */}
        <View style={{ height: 50 }} />
      </ScrollView>

      {/* Modal de Comentário */}
      <Modal visible={!!commentModalPost} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Pressable onPress={() => setCommentModalPost(null)}>
                <Text style={styles.modalCancelText}>Fechar</Text>
              </Pressable>
              <Text style={styles.modalTitle}>Comentários</Text>
              <Pressable onPress={handleAddComment}>
                <Text style={styles.modalSubmitText}>Enviar</Text>
              </Pressable>
            </View>

            {/* Lista de comentários existentes */}
            <ScrollView style={styles.commentsList}>
              {commentModalPost && getComments(commentModalPost.id).map((comment: any) => (
                <View key={comment.id} style={styles.commentItem}>
                  <ProfilePhoto
                    uri={comment.authorAvatar}
                    name={comment.authorName}
                    size={32}
                  />
                  <View style={styles.commentContent}>
                    <Text style={styles.commentAuthor}>{comment.authorName}</Text>
                    <Text style={styles.commentText}>{comment.content}</Text>
                    <Text style={styles.commentTime}>
                      {new Date(comment.createdAt).toLocaleDateString("pt-BR")}
                    </Text>
                  </View>
                  {comment.authorId === user?.id && (
                    <Pressable
                      style={styles.deleteCommentButton}
                      onPress={() => deleteComment(comment.id)}
                    >
                      <MaterialIcons name="delete-outline" size={18} color="#EF4444" />
                    </Pressable>
                  )}
                </View>
              ))}
              {commentModalPost && getComments(commentModalPost.id).length === 0 && (
                <Text style={styles.noCommentsText}>Nenhum comentário ainda. Seja o primeiro!</Text>
              )}
            </ScrollView>

            {/* Input de novo comentário */}
            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Escreva seu comentário..."
                placeholderTextColor="#9CA3AF"
                multiline
                value={newComment}
                onChangeText={setNewComment}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  greetingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greetingText: {
    marginLeft: 12,
  },
  greetingName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  greetingUnit: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  section: {
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  banner: {
    marginHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#001C65",
    overflow: "hidden",
  },
  bannerContent: {
    padding: 16,
  },
  bannerTag: {
    fontSize: 12,
    color: "#93C5FD",
    marginBottom: 4,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  bannerDescription: {
    fontSize: 14,
    color: "#BFDBFE",
  },
  portalGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
  },
  portalCardWrapper: {
    width: "50%",
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  portalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    minHeight: 110,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  portalCardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  portalCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  portalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  portalCardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  portalCardDescription: {
    fontSize: 12,
    color: "#6B7280",
  },
  birthdayItem: {
    alignItems: "center",
    marginRight: 16,
    width: 70,
  },
  birthdayAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  birthdayAvatarHighlight: {
    backgroundColor: "#003FC3",
    borderWidth: 2,
    borderColor: "#003FC3",
  },
  birthdayAvatarImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  birthdayAvatarText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
  },
  birthdayAvatarTextHighlight: {
    color: "#FFFFFF",
  },
  birthdayName: {
    fontSize: 12,
    color: "#111827",
    textAlign: "center",
  },
  birthdayDate: {
    fontSize: 12,
    color: "#6B7280",
  },
  birthdayBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 2,
  },
  birthdayBadgeText: {
    fontSize: 14,
  },
  birthdayWishButton: {
    marginTop: 6,
    backgroundColor: "#003FC3",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  birthdayWishButtonPressed: {
    opacity: 0.8,
  },
  birthdayWishText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  unidadeItem: {
    alignItems: "center",
    marginRight: 16,
  },
  unidadeCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  unidadeCircleSelected: {
    backgroundColor: "#003FC3",
    borderColor: "#003FC3",
  },
  unidadeLabel: {
    fontSize: 11,
    color: "#6B7280",
    maxWidth: 70,
    textAlign: "center",
  },
  unidadeLabelSelected: {
    color: "#003FC3",
    fontWeight: "600",
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginHorizontal: 16,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#003FC3",
  },
  tabText: {
    fontSize: 14,
    color: "#6B7280",
  },
  tabTextActive: {
    color: "#003FC3",
    fontWeight: "600",
  },
  postsContainer: {
    padding: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyStateText: {
    color: "#9CA3AF",
    marginTop: 8,
  },
  postCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  postAuthorInfo: {
    marginLeft: 12,
    flex: 1,
  },
  postAuthorName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  postMeta: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  postContent: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    marginBottom: 12,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  postStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  postStatItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  postStatText: {
    fontSize: 12,
    color: "#6B7280",
  },
  postActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  postActionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  postActionText: {
    fontSize: 14,
    color: "#6B7280",
  },
  postActionTextActive: {
    color: "#003FC3",
    fontWeight: "500",
  },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  memberInfo: {
    marginLeft: 12,
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  memberRole: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  memberUnit: {
    fontSize: 12,
    color: "#003FC3",
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "60%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalCancelText: {
    color: "#6B7280",
    fontSize: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  modalSubmitText: {
    color: "#003FC3",
    fontSize: 14,
    fontWeight: "600",
  },
  commentInput: {
    padding: 16,
    fontSize: 14,
    color: "#111827",
    minHeight: 60,
    textAlignVertical: "top",
    flex: 1,
  },
  commentsList: {
    maxHeight: 300,
    paddingHorizontal: 16,
  },
  commentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  commentContent: {
    flex: 1,
    marginLeft: 10,
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  commentText: {
    fontSize: 13,
    color: "#374151",
    marginTop: 2,
  },
  commentTime: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 4,
  },
  deleteCommentButton: {
    padding: 4,
  },
  noCommentsText: {
    textAlign: "center",
    color: "#9CA3AF",
    paddingVertical: 24,
    fontSize: 14,
  },
  commentInputContainer: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inlineComments: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  inlineCommentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
  },
  inlineCommentContent: {
    flex: 1,
    marginLeft: 8,
  },
  inlineCommentAuthor: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
  },
  inlineCommentText: {
    fontSize: 12,
    color: "#374151",
    marginTop: 2,
  },
});
