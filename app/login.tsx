import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Modal, Image } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppAuth, UNITS } from "@/lib/auth-context";
import { IconSymbol } from "@/components/ui/icon-symbol";

type AuthMode = "login" | "register" | "pending";
type UserType = "socio" | "colaborador";

function UnitSelector({
  visible,
  onClose,
  onSelect,
  selectedId,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (id: number) => void;
  selectedId: number;
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View className="bg-white rounded-t-3xl max-h-[70%]">
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-xl font-bold text-gray-900">Selecione sua Unidade</Text>
            <TouchableOpacity onPress={onClose}>
              <IconSymbol name="xmark" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <ScrollView className="p-4">
            {UNITS.map((unit) => (
              <TouchableOpacity
                key={unit.id}
                className="flex-row items-center p-4 mb-2 rounded-xl"
                style={{
                  backgroundColor: selectedId === unit.id ? "#E6F0FF" : "#F5F7FA",
                  borderWidth: selectedId === unit.id ? 1 : 0,
                  borderColor: "#003FC3",
                }}
                onPress={() => {
                  onSelect(unit.id);
                  onClose();
                }}
                activeOpacity={0.7}
              >
                <View className="flex-1">
                  <Text className="font-medium text-gray-900">{unit.name}</Text>
                  <Text className="text-sm text-gray-500">{unit.city} - {unit.state}</Text>
                </View>
                {selectedId === unit.id && (
                  <IconSymbol name="checkmark" size={20} color="#003FC3" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login, register } = useAppAuth();

  const [mode, setMode] = useState<AuthMode>("login");
  const [userType, setUserType] = useState<UserType>("colaborador");
  
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedUnitId, setSelectedUnitId] = useState(1);
  const [selectedRole, setSelectedRole] = useState<"consultora" | "gerente">("consultora");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showUnitSelector, setShowUnitSelector] = useState(false);

  const selectedUnit = UNITS.find((u) => u.id === selectedUnitId);

  const resetForm = () => {
    setIdentifier("");
    setPassword("");
    setName("");
    setEmail("");
    setConfirmPassword("");
    setError("");
  };

  const handleLogin = async () => {
    if (!identifier.trim() || !password.trim()) {
      setError("Preencha todos os campos");
      return;
    }

    setLoading(true);
    setError("");

    const result = await login(identifier.trim(), password);

    if (result.success) {
      router.replace("/(tabs)");
    } else {
      setError(result.error || "Erro ao fazer login");
    }

    setLoading(false);
  };

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Preencha todos os campos");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (password.length < 4) {
      setError("A senha deve ter pelo menos 4 caracteres");
      return;
    }

    setLoading(true);
    setError("");

    const result = await register({
      name: name.trim(),
      email: email.trim(),
      password,
      unitId: selectedUnitId,
      appRole: selectedRole,
    });

    if (result.success) {
      setMode("pending");
    } else {
      setError(result.error || "Erro ao cadastrar");
    }

    setLoading(false);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header Azul com Logo Grupo ONE Branca */}
      <View style={{ backgroundColor: "#003FC3", paddingTop: insets.top }}>
        <View className="items-center py-6">
          <Image
            source={require("@/assets/images/logos/grupoone-branca-header.png")}
            style={{ width: 120, height: 45 }}
            resizeMode="contain"
          />
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 py-6" style={{ maxWidth: 480, alignSelf: 'center', width: '100%' }}>
            
            {mode === "pending" ? (
              /* Tela de Aguardando Aprovação */
              <View className="items-center py-8">
                <View className="w-20 h-20 rounded-full items-center justify-center mb-6" style={{ backgroundColor: "#FFF3E0" }}>
                  <IconSymbol name="clock.fill" size={40} color="#FF9012" />
                </View>
                
                <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
                  Cadastro Enviado!
                </Text>
                
                <Text className="text-base text-gray-500 text-center px-4 mb-6">
                  Seu cadastro foi enviado para aprovação. Você receberá acesso assim que o administrador aprovar sua solicitação.
                </Text>

                <View className="w-full p-4 rounded-xl mb-6 bg-gray-100">
                  <Text className="text-sm text-gray-600 text-center">
                    Entre em contato com sua gerente ou sócio(a) para agilizar o processo.
                  </Text>
                </View>

                <TouchableOpacity
                  className="rounded-xl py-4 px-8"
                  style={{ backgroundColor: "#003FC3" }}
                  onPress={() => {
                    resetForm();
                    setMode("login");
                  }}
                  activeOpacity={0.8}
                >
                  <Text className="text-white font-semibold text-base">Voltar ao Login</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {/* Título */}
                <Text className="text-2xl font-bold text-gray-900 text-center mb-6">
                  {mode === "login" ? "Acesse sua conta" : "Criar conta"}
                </Text>

                {/* Erro */}
                {error ? (
                  <View className="flex-row items-center gap-2 px-3 py-3 rounded-xl mb-4" style={{ backgroundColor: "#FDE8E8" }}>
                    <IconSymbol name="exclamationmark.triangle.fill" size={16} color="#DF007E" />
                    <Text className="flex-1 text-sm" style={{ color: "#DF007E" }}>{error}</Text>
                  </View>
                ) : null}

                {mode === "login" ? (
                  /* Formulário de Login */
                  <>
                    {/* Seletor de Tipo */}
                    <Text className="text-sm font-medium text-gray-600 mb-2">Tipo de acesso:</Text>
                    <View className="flex-row gap-3 mb-5">
                      <TouchableOpacity
                        className="flex-1 py-3 rounded-xl items-center"
                        style={{
                          backgroundColor: userType === "socio" ? "#003FC3" : "#F5F7FA",
                        }}
                        onPress={() => {
                          setUserType("socio");
                          setIdentifier("");
                          setPassword("");
                          setError("");
                        }}
                      >
                        <Text
                          className="font-semibold"
                          style={{ color: userType === "socio" ? "#FFFFFF" : "#1A1A2E" }}
                        >
                          Sócio(a)
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="flex-1 py-3 rounded-xl items-center"
                        style={{
                          backgroundColor: userType === "colaborador" ? "#003FC3" : "#F5F7FA",
                        }}
                        onPress={() => {
                          setUserType("colaborador");
                          setIdentifier("");
                          setPassword("");
                          setError("");
                        }}
                      >
                        <Text
                          className="font-semibold"
                          style={{ color: userType === "colaborador" ? "#FFFFFF" : "#1A1A2E" }}
                        >
                          Colaborador(a)
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Campo de Identificação */}
                    <Text className="text-sm font-medium text-gray-600 mb-2">
                      {userType === "socio" ? "Nome" : "E-mail"}
                    </Text>
                    <View className="flex-row items-center rounded-xl px-4 border border-gray-200 bg-gray-50 mb-4">
                      <IconSymbol 
                        name={userType === "socio" ? "person.fill" : "envelope.fill"} 
                        size={20} 
                        color="#6B7280" 
                      />
                      <TextInput
                        className="flex-1 py-4 px-3 text-base text-gray-900"
                        placeholder={userType === "socio" ? "Seu nome" : "seu@email.com"}
                        placeholderTextColor="#9CA3AF"
                        value={identifier}
                        onChangeText={setIdentifier}
                        keyboardType={userType === "socio" ? "default" : "email-address"}
                        autoCapitalize={userType === "socio" ? "words" : "none"}
                        returnKeyType="next"
                      />
                    </View>

                    {/* Campo de Senha */}
                    <Text className="text-sm font-medium text-gray-600 mb-2">
                      Senha {userType === "socio" && "(4 dígitos)"}
                    </Text>
                    <View className="flex-row items-center rounded-xl px-4 border border-gray-200 bg-gray-50 mb-6">
                      <IconSymbol name="lock.fill" size={20} color="#6B7280" />
                      <TextInput
                        className="flex-1 py-4 px-3 text-base text-gray-900"
                        placeholder={userType === "socio" ? "••••" : "••••••••"}
                        placeholderTextColor="#9CA3AF"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        keyboardType={userType === "socio" ? "number-pad" : "default"}
                        maxLength={userType === "socio" ? 4 : undefined}
                        returnKeyType="done"
                        onSubmitEditing={handleLogin}
                      />
                    </View>

                    {/* Botão de Login */}
                    <TouchableOpacity
                      className="rounded-xl py-4 items-center mb-4"
                      style={{ backgroundColor: "#003FC3" }}
                      onPress={handleLogin}
                      disabled={loading}
                      activeOpacity={0.8}
                    >
                      {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                      ) : (
                        <Text className="text-white font-semibold text-base">Entrar</Text>
                      )}
                    </TouchableOpacity>

                    {/* Link para Cadastro (apenas colaboradores) */}
                    {userType === "colaborador" && (
                      <TouchableOpacity
                        onPress={() => {
                          resetForm();
                          setMode("register");
                        }}
                        className="items-center py-2"
                      >
                        <Text className="text-gray-500">
                          Não tem conta?{" "}
                          <Text style={{ color: "#003FC3" }} className="font-semibold">
                            Cadastre-se
                          </Text>
                        </Text>
                      </TouchableOpacity>
                    )}
                  </>
                ) : (
                  /* Formulário de Cadastro */
                  <>
                    {/* Nome */}
                    <Text className="text-sm font-medium text-gray-600 mb-2">Nome completo</Text>
                    <View className="flex-row items-center rounded-xl px-4 border border-gray-200 bg-gray-50 mb-4">
                      <IconSymbol name="person.fill" size={20} color="#6B7280" />
                      <TextInput
                        className="flex-1 py-4 px-3 text-base text-gray-900"
                        placeholder="Seu nome"
                        placeholderTextColor="#9CA3AF"
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                        returnKeyType="next"
                      />
                    </View>

                    {/* E-mail */}
                    <Text className="text-sm font-medium text-gray-600 mb-2">E-mail</Text>
                    <View className="flex-row items-center rounded-xl px-4 border border-gray-200 bg-gray-50 mb-4">
                      <IconSymbol name="envelope.fill" size={20} color="#6B7280" />
                      <TextInput
                        className="flex-1 py-4 px-3 text-base text-gray-900"
                        placeholder="seu@email.com"
                        placeholderTextColor="#9CA3AF"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        returnKeyType="next"
                      />
                    </View>

                    {/* Cargo */}
                    <Text className="text-sm font-medium text-gray-600 mb-2">Cargo</Text>
                    <View className="flex-row gap-3 mb-4">
                      <TouchableOpacity
                        className="flex-1 py-3 rounded-xl items-center"
                        style={{
                          backgroundColor: selectedRole === "consultora" ? "#003FC3" : "#F5F7FA",
                        }}
                        onPress={() => setSelectedRole("consultora")}
                      >
                        <Text
                          className="font-medium"
                          style={{ color: selectedRole === "consultora" ? "#FFFFFF" : "#1A1A2E" }}
                        >
                          Consultora
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="flex-1 py-3 rounded-xl items-center"
                        style={{
                          backgroundColor: selectedRole === "gerente" ? "#003FC3" : "#F5F7FA",
                        }}
                        onPress={() => setSelectedRole("gerente")}
                      >
                        <Text
                          className="font-medium"
                          style={{ color: selectedRole === "gerente" ? "#FFFFFF" : "#1A1A2E" }}
                        >
                          Gerente
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Unidade */}
                    <Text className="text-sm font-medium text-gray-600 mb-2">Unidade</Text>
                    <TouchableOpacity
                      className="flex-row items-center rounded-xl px-4 py-4 border border-gray-200 bg-gray-50 mb-4"
                      onPress={() => setShowUnitSelector(true)}
                      activeOpacity={0.7}
                    >
                      <IconSymbol name="building.2.fill" size={20} color="#6B7280" />
                      <Text className="flex-1 px-3 text-base text-gray-900">
                        {selectedUnit?.name || "Selecione"}
                      </Text>
                      <IconSymbol name="chevron.right" size={20} color="#6B7280" />
                    </TouchableOpacity>

                    {/* Senha */}
                    <Text className="text-sm font-medium text-gray-600 mb-2">Senha</Text>
                    <View className="flex-row items-center rounded-xl px-4 border border-gray-200 bg-gray-50 mb-4">
                      <IconSymbol name="lock.fill" size={20} color="#6B7280" />
                      <TextInput
                        className="flex-1 py-4 px-3 text-base text-gray-900"
                        placeholder="Crie uma senha"
                        placeholderTextColor="#9CA3AF"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        returnKeyType="next"
                      />
                    </View>

                    {/* Confirmar Senha */}
                    <Text className="text-sm font-medium text-gray-600 mb-2">Confirmar senha</Text>
                    <View className="flex-row items-center rounded-xl px-4 border border-gray-200 bg-gray-50 mb-6">
                      <IconSymbol name="lock.fill" size={20} color="#6B7280" />
                      <TextInput
                        className="flex-1 py-4 px-3 text-base text-gray-900"
                        placeholder="Repita a senha"
                        placeholderTextColor="#9CA3AF"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        returnKeyType="done"
                        onSubmitEditing={handleRegister}
                      />
                    </View>

                    {/* Botão de Cadastro */}
                    <TouchableOpacity
                      className="rounded-xl py-4 items-center mb-4"
                      style={{ backgroundColor: "#003FC3" }}
                      onPress={handleRegister}
                      disabled={loading}
                      activeOpacity={0.8}
                    >
                      {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                      ) : (
                        <Text className="text-white font-semibold text-base">Cadastrar</Text>
                      )}
                    </TouchableOpacity>

                    {/* Link para Login */}
                    <TouchableOpacity
                      onPress={() => {
                        resetForm();
                        setMode("login");
                      }}
                      className="items-center py-2"
                    >
                      <Text className="text-gray-500">
                        Já tem conta?{" "}
                        <Text style={{ color: "#003FC3" }} className="font-semibold">
                          Entrar
                        </Text>
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </>
            )}

            {/* Footer - Desenvolvido por TráfegON */}
            <View className="items-center mt-8 pt-4">
              <Text className="text-xs text-gray-400 mb-2">Desenvolvido por</Text>
              <Image
                source={require("@/assets/images/logos/trafegon-azul.png")}
                style={{ width: 100, height: 32 }}
                resizeMode="contain"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <UnitSelector
        visible={showUnitSelector}
        onClose={() => setShowUnitSelector(false)}
        onSelect={setSelectedUnitId}
        selectedId={selectedUnitId}
      />
    </View>
  );
}
