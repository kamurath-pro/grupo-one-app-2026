import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Alert, Platform } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAppAuth } from "@/lib/auth-context";

const UNIDADES = [
  "Geral",
  "Araripina",
  "Serra Talhada",
  "Garanhuns",
  "Cajazeiras",
  "Vitória",
  "Livramento",
  "Muriaé",
  "Vilhena",
  "Corumbá",
  "Fortaleza",
  "Macaé Plaza",
  "Macaé Centro",
];

export default function CreatePostScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, isSocio } = useAppAuth();
  const [content, setContent] = useState("");
  // Membros não escolhem unidade (detecta automaticamente), sócios podem escolher
  const defaultUnidade = user?.unitNames?.[0] || "Geral";
  const [selectedUnidade, setSelectedUnidade] = useState(defaultUnidade);
  const [showUnidadeSelector, setShowUnidadeSelector] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handlePost = () => {
    if (!content.trim()) {
      if (Platform.OS === "web") {
        alert("Digite algo para publicar");
      } else {
        Alert.alert("Atenção", "Digite algo para publicar");
      }
      return;
    }

    // TODO: Implement actual post creation
    console.log("Creating post:", { content, unidade: selectedUnidade });
    
    if (Platform.OS === "web") {
      alert("Post criado com sucesso!");
    } else {
      Alert.alert("Sucesso", "Post criado com sucesso!");
    }
    
    setContent("");
    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === "web" ? 12 : insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <MaterialIcons name="close" size={24} color="#374151" />
        </Pressable>
        <Text style={styles.headerTitle}>Nova Publicação</Text>
        <Pressable
          onPress={handlePost}
          style={[styles.postButton, !content.trim() && styles.postButtonDisabled]}
          disabled={!content.trim()}
        >
          <Text style={[styles.postButtonText, !content.trim() && styles.postButtonTextDisabled]}>
            Publicar
          </Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        {/* User info */}
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user?.name || "Usuário"}</Text>
            {/* Sócios podem escolher unidade, membros veem apenas sua unidade */}
            {isSocio ? (
              <Pressable
                style={styles.unidadeSelector}
                onPress={() => setShowUnidadeSelector(!showUnidadeSelector)}
              >
                <MaterialIcons name="location-on" size={14} color="#003FC3" />
                <Text style={styles.unidadeText}>{selectedUnidade}</Text>
                <MaterialIcons name="keyboard-arrow-down" size={16} color="#003FC3" />
              </Pressable>
            ) : (
              <View style={styles.unidadeFixed}>
                <MaterialIcons name="location-on" size={14} color="#6B7280" />
                <Text style={styles.unidadeTextFixed}>{defaultUnidade}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Unidade selector dropdown */}
        {showUnidadeSelector && (
          <View style={styles.unidadeDropdown}>
            {UNIDADES.map((unidade) => (
              <Pressable
                key={unidade}
                style={[
                  styles.unidadeOption,
                  selectedUnidade === unidade && styles.unidadeOptionSelected,
                ]}
                onPress={() => {
                  setSelectedUnidade(unidade);
                  setShowUnidadeSelector(false);
                }}
              >
                <Text
                  style={[
                    styles.unidadeOptionText,
                    selectedUnidade === unidade && styles.unidadeOptionTextSelected,
                  ]}
                >
                  {unidade}
                </Text>
                {selectedUnidade === unidade && (
                  <MaterialIcons name="check" size={18} color="#003FC3" />
                )}
              </Pressable>
            ))}
          </View>
        )}

        {/* Text input */}
        <TextInput
          style={styles.textInput}
          placeholder="O que você quer compartilhar?"
          placeholderTextColor="#9CA3AF"
          multiline
          value={content}
          onChangeText={setContent}
          autoFocus
        />
      </ScrollView>

      {/* Bottom actions - apenas foto permitida (sem vídeo/arquivo) */}
      <View style={[styles.bottomActions, { paddingBottom: Platform.OS === "web" ? 12 : insets.bottom + 12 }]}>
        <Pressable style={styles.actionButton}>
          <MaterialIcons name="image" size={24} color="#003FC3" />
          <Text style={styles.actionText}>Adicionar Foto</Text>
        </Pressable>
        <Text style={styles.imageHint}>Proporção 4:5 recomendada</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  postButton: {
    backgroundColor: "#003FC3",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonDisabled: {
    backgroundColor: "#E5E7EB",
  },
  postButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  postButtonTextDisabled: {
    color: "#9CA3AF",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#003FC3",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },
  userDetails: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  unidadeSelector: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#EBF4FF",
    borderRadius: 12,
    gap: 4,
  },
  unidadeText: {
    fontSize: 12,
    color: "#003FC3",
    fontWeight: "500",
  },
  unidadeDropdown: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  unidadeOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  unidadeOptionSelected: {
    backgroundColor: "#EBF4FF",
  },
  unidadeOptionText: {
    fontSize: 14,
    color: "#374151",
  },
  unidadeOptionTextSelected: {
    color: "#003FC3",
    fontWeight: "600",
  },
  textInput: {
    fontSize: 16,
    color: "#111827",
    minHeight: 150,
    textAlignVertical: "top",
  },
  bottomActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 12,
    paddingHorizontal: 16,
    gap: 24,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: "#003FC3",
    fontWeight: "500",
  },
  unidadeFixed: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },
  unidadeTextFixed: {
    fontSize: 12,
    color: "#6B7280",
  },
  imageHint: {
    fontSize: 12,
    color: "#9CA3AF",
    marginLeft: "auto",
    alignSelf: "center",
  },
});
