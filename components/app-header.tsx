import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface AppHeaderProps {
  title?: string;
  showLogo?: boolean;
  showNotification?: boolean;
  showBack?: boolean;
  onBackPress?: () => void;
  onNotificationPress?: () => void;
  notificationCount?: number;
}

export function AppHeader({
  title,
  showLogo = true,
  showNotification = true,
  showBack = false,
  onBackPress,
  onNotificationPress,
  notificationCount = 0,
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === "web" ? 12 : insets.top;

  return (
    <View style={[styles.container, { paddingTop: topPadding }]}>
      <View style={styles.content}>
        {/* Left side */}
        <View style={styles.leftSide}>
          {showBack && (
            <Pressable onPress={onBackPress} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
            </Pressable>
          )}
          
          {showLogo ? (
            <Image
              source={require("@/assets/images/logos/espacolaser-branca.png")}
              style={styles.logo}
              contentFit="contain"
            />
          ) : title ? (
            <Text style={styles.title}>{title}</Text>
          ) : null}
        </View>

        {/* Right side - Notification */}
        {showNotification && (
          <Pressable onPress={onNotificationPress} style={styles.notificationButton}>
            <MaterialIcons name="notifications-none" size={26} color="#FFFFFF" />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {notificationCount > 99 ? "99+" : notificationCount}
                </Text>
              </View>
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#003FC3",
    width: "100%",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
  leftSide: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  logo: {
    width: 140,
    height: 32,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  notificationButton: {
    padding: 4,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#EF4444",
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
});
