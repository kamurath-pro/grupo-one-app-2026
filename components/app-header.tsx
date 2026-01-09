import { View, Text, TouchableOpacity, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/ui/icon-symbol";

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

  return (
    <View
      style={{
        backgroundColor: "#003FC3",
        paddingTop: insets.top,
      }}
    >
      <View className="flex-row items-center justify-between px-4 py-3">
        {/* Left side */}
        <View className="flex-row items-center flex-1">
          {showBack && (
            <TouchableOpacity
              onPress={onBackPress}
              className="mr-3 p-1"
              activeOpacity={0.7}
            >
              <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}
          
          {showLogo ? (
            <View className="flex-row items-center">
              <Image
                source={require("@/assets/images/logo-grupo-one.png")}
                style={{ width: 100, height: 36 }}
                resizeMode="contain"
              />
            </View>
          ) : title ? (
            <Text className="text-white text-lg font-semibold">{title}</Text>
          ) : null}
        </View>

        {/* Right side - Notification */}
        {showNotification && (
          <TouchableOpacity
            onPress={onNotificationPress}
            className="relative p-2"
            activeOpacity={0.7}
          >
            <IconSymbol name="bell.fill" size={24} color="#FFFFFF" />
            {notificationCount > 0 && (
              <View
                className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center"
              >
                <Text className="text-white text-xs font-bold">
                  {notificationCount > 99 ? "99+" : notificationCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
