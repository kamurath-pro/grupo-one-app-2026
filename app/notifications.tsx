import { useEffect } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, FlatList } from "react-native";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNotifications, AppNotification } from "@/lib/notification-context";
import { AppHeader } from "@/components/app-header";
import { ScreenContainer } from "@/components/screen-container";

// Ícone por tipo de notificação
const NOTIFICATION_ICONS: Record<string, { name: string; color: string; bgColor: string }> = {
  birthday: { name: "cake", color: "#F59E0B", bgColor: "#FEF3C7" },
  recognition: { name: "star", color: "#22C55E", bgColor: "#DCFCE7" },
  post: { name: "article", color: "#003FC3", bgColor: "#E6F0FF" },
  system: { name: "notifications", color: "#6B7280", bgColor: "#F3F4F6" },
};

function NotificationItem({ 
  notification, 
  onPress 
}: { 
  notification: AppNotification; 
  onPress: () => void;
}) {
  const icon = NOTIFICATION_ICONS[notification.type] || NOTIFICATION_ICONS.system;
  const timeAgo = getTimeAgo(notification.createdAt);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.notificationItem,
        !notification.read && styles.notificationUnread,
        pressed && styles.notificationPressed,
      ]}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: icon.bgColor }]}>
        <MaterialIcons name={icon.name as any} size={24} color={icon.color} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={[styles.title, !notification.read && styles.titleUnread]}>
          {notification.title}
        </Text>
        <Text style={styles.message} numberOfLines={2}>
          {notification.message}
        </Text>
        <Text style={styles.time}>{timeAgo}</Text>
      </View>
      {!notification.read && <View style={styles.unreadDot} />}
    </Pressable>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Agora";
  if (diffMins < 60) return diffMins + " min atrás";
  if (diffHours < 24) return diffHours + "h atrás";
  if (diffDays === 1) return "Ontem";
  if (diffDays < 7) return diffDays + " dias atrás";
  return date.toLocaleDateString("pt-BR");
}

export default function NotificationsScreen() {
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications();

  const handleNotificationPress = (notification: AppNotification) => {
    markAsRead(notification.id);
    
    // Navegar para a tela relevante baseado no tipo
    if (notification.type === "birthday") {
      router.push("/(tabs)");
    } else if (notification.type === "recognition") {
      router.push("/(tabs)/recognition");
    } else if (notification.type === "post") {
      router.push("/(tabs)");
    }
  };

  const renderItem = ({ item }: { item: AppNotification }) => (
    <NotificationItem
      notification={item}
      onPress={() => handleNotificationPress(item)}
    />
  );

  return (
    <ScreenContainer>
      <AppHeader showBack title="Notificações" />
      
      {/* Ações do cabeçalho */}
      {notifications.length > 0 && unreadCount > 0 && (
        <View style={styles.actionsBar}>
          <Pressable style={styles.actionButton} onPress={markAllAsRead}>
            <MaterialIcons name="done-all" size={18} color="#003FC3" />
            <Text style={styles.actionText}>Marcar todas como lidas</Text>
          </Pressable>
        </View>
      )}

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="notifications-none" size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>Nenhuma notificação</Text>
          <Text style={styles.emptyText}>
            Você receberá notificações sobre aniversários, reconhecimentos e novidades aqui.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  actionsBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  actionText: {
    fontSize: 14,
    color: "#003FC3",
    fontWeight: "500",
  },
  listContent: {
    paddingBottom: 100,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  notificationUnread: {
    backgroundColor: "#F0F7FF",
  },
  notificationPressed: {
    backgroundColor: "#F3F4F6",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 4,
  },
  titleUnread: {
    fontWeight: "700",
    color: "#111827",
  },
  message: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#003FC3",
    marginLeft: 8,
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
});
