import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";

interface ProfilePhotoProps {
  uri?: string | null;
  name: string;
  size?: number;
  borderColor?: string;
  borderWidth?: number;
}

/**
 * ProfilePhoto - Componente de foto de perfil circular
 * Exibe a foto do usuário ou as iniciais do nome
 */
export function ProfilePhoto({
  uri,
  name,
  size = 40,
  borderColor,
  borderWidth = 0,
}: ProfilePhotoProps) {
  const initials = name
    .split(" ")
    .map((n) => n.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const fontSize = size * 0.4;
  const borderRadius = size / 2;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius,
          borderColor: borderColor || "transparent",
          borderWidth,
        },
      ]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={[styles.image, { width: size, height: size, borderRadius }]}
          contentFit="cover"
        />
      ) : (
        <View style={[styles.placeholder, { width: size, height: size, borderRadius }]}>
          <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  image: {
    backgroundColor: "#E5E7EB",
  },
  placeholder: {
    backgroundColor: "#003FC3",
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
