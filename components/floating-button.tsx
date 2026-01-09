import { TouchableOpacity, View } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FloatingButtonProps {
  onPress: () => void;
}

export function FloatingButton({ onPress }: FloatingButtonProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        position: "absolute",
        bottom: 70 + Math.max(insets.bottom, 8),
        left: 0,
        right: 0,
        alignItems: "center",
        zIndex: 100,
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        className="w-14 h-14 rounded-full items-center justify-center shadow-lg"
        style={{
          backgroundColor: "#003FC3",
          shadowColor: "#003FC3",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
        activeOpacity={0.8}
      >
        <IconSymbol name="plus" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}
