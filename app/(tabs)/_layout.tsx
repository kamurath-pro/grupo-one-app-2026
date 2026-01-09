import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { View, Text } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Platform } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { useAppAuth } from "@/lib/auth-context";

export default function TabLayout() {
  const colors = useColors();
  const { user, isAdmin, pendingUsers } = useAppAuth();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 56 + bottomPadding;

  const pendingCount = pendingUsers.length;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Feed",
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="files"
        options={{
          title: "Arquivos",
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="folder.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="message.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="recognition"
        options={{
          title: "Reconhecer",
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="star.fill" color={color} />,
        }}
      />
      {isAdmin ? (
        <Tabs.Screen
          name="admin"
          options={{
            title: "Aprovações",
            tabBarIcon: ({ color }) => (
              <View>
                <IconSymbol size={26} name="checkmark" color={color} />
                {pendingCount > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      top: -4,
                      right: -8,
                      backgroundColor: colors.error,
                      borderRadius: 10,
                      minWidth: 18,
                      height: 18,
                      alignItems: "center",
                      justifyContent: "center",
                      paddingHorizontal: 4,
                    }}
                  >
                    <Text style={{ color: "#FFFFFF", fontSize: 11, fontWeight: "bold" }}>
                      {pendingCount > 9 ? "9+" : pendingCount}
                    </Text>
                  </View>
                )}
              </View>
            ),
          }}
        />
      ) : (
        <Tabs.Screen
          name="profile"
          options={{
            title: "Perfil",
            tabBarIcon: ({ color }) => <IconSymbol size={26} name="person.fill" color={color} />,
          }}
        />
      )}
      {/* Hidden screens */}
      {isAdmin && (
        <Tabs.Screen
          name="profile"
          options={{
            href: null,
          }}
        />
      )}
      {!isAdmin && (
        <Tabs.Screen
          name="admin"
          options={{
            href: null,
          }}
        />
      )}
    </Tabs>
  );
}
