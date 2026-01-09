import { View, Text, TouchableOpacity } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";

interface PortalCardProps {
  title: string;
  description: string;
  icon: string;
  iconColor?: string;
  iconBgColor?: string;
  onPress: () => void;
}

export function PortalCard({
  title,
  description,
  icon,
  iconColor = "#003FC3",
  iconBgColor = "#E6F0FF",
  onPress,
}: PortalCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
      style={{ flex: 1, minHeight: 100 }}
      activeOpacity={0.7}
    >
      <View className="flex-row items-start justify-between">
        <View
          className="w-10 h-10 rounded-lg items-center justify-center mb-3"
          style={{ backgroundColor: iconBgColor }}
        >
          <IconSymbol name={icon as any} size={20} color={iconColor} />
        </View>
        <IconSymbol name="chevron.right" size={16} color="#003FC3" />
      </View>
      
      <Text className="text-base font-semibold text-gray-900 mb-1">
        {title}
      </Text>
      <Text className="text-xs text-gray-500" numberOfLines={2}>
        {description}
      </Text>
    </TouchableOpacity>
  );
}
