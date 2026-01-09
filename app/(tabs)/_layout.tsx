import { Tabs, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { HapticTab } from "@/components/haptic-tab";
import { useAppAuth } from "@/lib/auth-context";

export default function TabLayout() {
  const { isAdmin, pendingUsers } = useAppAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 60 + bottomPadding;

  const pendingCount = pendingUsers.length;

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#003FC3",
          tabBarInactiveTintColor: "#9CA3AF",
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            paddingTop: 8,
            paddingBottom: bottomPadding,
            height: tabBarHeight,
            backgroundColor: "#FFFFFF",
            borderTopColor: "#E5E7EB",
            borderTopWidth: 1,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "500",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => <MaterialIcons name="home" size={26} color={color} />,
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: "Chat",
            tabBarIcon: ({ color }) => <MaterialIcons name="chat-bubble-outline" size={26} color={color} />,
          }}
        />
        {/* Placeholder for center button */}
        <Tabs.Screen
          name="create"
          options={{
            title: "",
            tabBarIcon: () => null,
            tabBarButton: () => (
              <View style={styles.centerButtonContainer}>
                <Pressable
                  style={({ pressed }) => [
                    styles.centerButton,
                    pressed && styles.centerButtonPressed,
                  ]}
                  onPress={() => {
                    // Navigate to create post modal
                    router.push("/(tabs)/create");
                  }}
                >
                  <MaterialIcons name="add" size={32} color="#FFFFFF" />
                </Pressable>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="recognition"
          options={{
            title: "Reconhecer",
            tabBarIcon: ({ color }) => <MaterialIcons name="star-outline" size={26} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Perfil",
            tabBarIcon: ({ color }) => <MaterialIcons name="person-outline" size={26} color={color} />,
          }}
        />
        {/* Hidden screens */}
        <Tabs.Screen
          name="files"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="admin"
          options={{
            href: isAdmin ? undefined : null,
            title: "Admin",
            tabBarIcon: ({ color }) => (
              <View>
                <MaterialIcons name="admin-panel-settings" size={26} color={color} />
                {pendingCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {pendingCount > 9 ? "9+" : pendingCount}
                    </Text>
                  </View>
                )}
              </View>
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  centerButtonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: -20,
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#003FC3",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#003FC3",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  centerButtonPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "bold",
  },
});
