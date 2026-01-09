import { View, Text, StyleSheet, Pressable } from "react-native";
import { Image } from "expo-image";

interface UserAvatarProps {
  name: string;
  photoUrl?: string | null;
  size?: number;
  showBorder?: boolean;
  onPress?: () => void;
}

/**
 * UserAvatar - Componente de foto de perfil circular
 */
export function UserAvatar({ 
  name, 
  photoUrl, 
  size = 48, 
  showBorder = true,
  onPress 
}: UserAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const containerStyle = [
    styles.container,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
      borderWidth: showBorder ? 2 : 0,
    },
  ];

  const content = photoUrl ? (
    <Image
      source={{ uri: photoUrl }}
      style={[styles.image, { width: size - 4, height: size - 4, borderRadius: (size - 4) / 2 }]}
      contentFit="cover"
    />
  ) : (
    <View style={[styles.placeholder, { width: size - 4, height: size - 4, borderRadius: (size - 4) / 2 }]}>
      <Text style={[styles.initials, { fontSize: size * 0.35 }]}>{initials}</Text>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={containerStyle}>
        {content}
      </Pressable>
    );
  }

  return <View style={containerStyle}>{content}</View>;
}

const styles = StyleSheet.create({
  container: {
    borderColor: "#003FC3",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  image: {
    backgroundColor: "#f0f0f0",
  },
  placeholder: {
    backgroundColor: "#003FC3",
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    color: "#fff",
    fontWeight: "600",
  },
});
