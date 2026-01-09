import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Modal, Image } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useAppAuth, UNITS } from "@/lib/auth-context";
import { useColors } from "@/hooks/use-colors";
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
  const colors = useColors();

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View className="rounded-t-3xl max-h-[70%]" style={{ backgroundColor: colors.background }}>
          <View className="flex-row justify-between items-center p-4 border-b" style={{ borderColor: colors.border }}>
            <Text className="text-xl font-bold text-foreground">Selecione sua Unidade</Text>
            <TouchableOpacity onPress={onClose}>
              <IconSymbol name="xmark" size={24} color={colors.muted} />
            </TouchableOpacity>
          </View>
          <ScrollView className="p-4">
            {UNITS.map((unit) => (
              <TouchableOpacity
                key={unit.id}
                className="flex-row items-center p-4 mb-2 rounded-xl"
                style={{
                  backgroundColor: selectedId === unit.id ? `${colors.primary}15` : colors.surface,
                  borderWidth: selectedId === unit.id ? 1 : 0,
                  borderColor: colors.primary,
                }}
                onPress={() => {
                  onSelect(unit.id);
                  onClose();
                }}
                activeOpacity={0.7}
              >
                <View className="flex-1">
                  <Text className="font-medium text-foreground">{unit.name}</Text>
                  <Text className="text-sm text-muted">{unit.city} - {unit.state}</Text>
                </View>
                {selectedId === unit.id && (
                  <IconSymbol name="checkmark" size={20} color={colors.primary} />
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
  const colors = useColors();
  const { login, register } = useAppAuth();

  const [mode, setMode] = useState<AuthMode>("login");
  const [userType, setUserType] = useState<UserType>("colaborador");
  
  // Login fields
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  
  // Register fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedUnitId, setSelectedUnitId] = useState(1);
  const [selectedRole, setSelectedRole] = useState<"gerente" | "consultora">("consultora");
  const [showUnitSelector, setShowUnitSelector] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const selectedUnit = UNITS.find((u) => u.id === selectedUnitId);

  const resetForm = () => {
    setIdentifier("");
    setPassword("");
    setName("");
    setEmail("");
    setConfirmPassword("");
    setSelectedUnitId(1);
    setSelectedRole("consultora");
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
    } else if (result.pending) {
      setMode("pending");
    } else {
      setError(result.error || "Credenciais inválidas");
    }

    setLoading(false);
  };

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
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

  const renderLoginForm = () => (
    <>
      {/* User Type Selector */}
      <View className="mb-4">
        <Text className="text-sm font-medium text-muted mb-2">Tipo de acesso:</Text>
        <View className="flex-row gap-2">
          <TouchableOpacity
            className="flex-1 py-3 rounded-xl items-center"
            style={{
              backgroundColor: userType === "socio" ? colors.primary : colors.surface,
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
              style={{ color: userType === "socio" ? "#fff" : colors.foreground }}
            >
              Sócio(a)
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 py-3 rounded-xl items-center"
            style={{
              backgroundColor: userType === "colaborador" ? colors.primary : colors.surface,
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
              style={{ color: userType === "colaborador" ? "#fff" : colors.foreground }}
            >
              Colaborador(a)
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Identifier Input */}
      <View>
        <Text className="text-sm font-medium text-foreground mb-2">
          {userType === "socio" ? "Seu nome" : "E-mail"}
        </Text>
        <View
          className="flex-row items-center rounded-xl px-4 border"
          style={{ backgroundColor: colors.surface, borderColor: colors.border }}
        >
          <IconSymbol 
            name={userType === "socio" ? "person.fill" : "envelope.fill"} 
            size={20} 
            color={colors.muted} 
          />
          <TextInput
            className="flex-1 py-4 px-3 text-base"
            style={{ color: colors.foreground }}
            placeholder={userType === "socio" ? "Ex: Lia, Márcio, Raquel..." : "seu@email.com"}
            placeholderTextColor={colors.muted}
            value={identifier}
            onChangeText={setIdentifier}
            keyboardType={userType === "socio" ? "default" : "email-address"}
            autoCapitalize={userType === "socio" ? "words" : "none"}
            returnKeyType="next"
          />
        </View>
        {userType === "socio" && (
          <Text className="text-xs text-muted mt-1 ml-1">
            Digite apenas seu primeiro nome
          </Text>
        )}
      </View>

      {/* Password Input */}
      <View>
        <Text className="text-sm font-medium text-foreground mb-2">Senha</Text>
        <View
          className="flex-row items-center rounded-xl px-4 border"
          style={{ backgroundColor: colors.surface, borderColor: colors.border }}
        >
          <IconSymbol name="lock.fill" size={20} color={colors.muted} />
          <TextInput
            className="flex-1 py-4 px-3 text-base"
            style={{ color: colors.foreground }}
            placeholder={userType === "socio" ? "Senha de 4 dígitos" : "Sua senha"}
            placeholderTextColor={colors.muted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            keyboardType={userType === "socio" ? "numeric" : "default"}
            maxLength={userType === "socio" ? 4 : undefined}
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <IconSymbol
              name={showPassword ? "eye.slash.fill" : "eye.fill"}
              size={20}
              color={colors.muted}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Login Button */}
      <TouchableOpacity
        className="rounded-xl py-4 items-center mt-2"
        style={{
          backgroundColor: colors.primary,
          opacity: loading ? 0.7 : 1,
        }}
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

      {/* Register Link - Only for colaboradores */}
      {userType === "colaborador" && (
        <>
          <View className="flex-row items-center my-4">
            <View className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
            <Text className="mx-4 text-muted text-sm">Primeira vez aqui?</Text>
            <View className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
          </View>

          <TouchableOpacity
            className="rounded-xl py-4 items-center border"
            style={{ borderColor: colors.primary }}
            onPress={() => {
              resetForm();
              setMode("register");
            }}
            activeOpacity={0.8}
          >
            <Text style={{ color: colors.primary }} className="font-semibold text-base">
              Criar minha conta
            </Text>
          </TouchableOpacity>
        </>
      )}

      {/* Info for sócios */}
      {userType === "socio" && (
        <View className="mt-6 p-4 rounded-xl" style={{ backgroundColor: colors.surface }}>
          <Text className="text-sm text-muted text-center">
            <Text className="font-semibold">Sócios:</Text> Use seu primeiro nome e a senha de 4 dígitos fornecida pela administração.
          </Text>
        </View>
      )}
    </>
  );

  const renderRegisterForm = () => (
    <>
      {/* Info Banner */}
      <View className="p-3 rounded-xl mb-2 flex-row items-center" style={{ backgroundColor: `${colors.primary}15` }}>
        <IconSymbol name="info.circle.fill" size={18} color={colors.primary} />
        <Text className="flex-1 ml-2 text-sm" style={{ color: colors.primary }}>
          Cadastro para gerentes e consultoras. Após o cadastro, aguarde a aprovação do administrador.
        </Text>
      </View>

      {/* Name Input */}
      <View>
        <Text className="text-sm font-medium text-foreground mb-2">Nome completo</Text>
        <View
          className="flex-row items-center rounded-xl px-4 border"
          style={{ backgroundColor: colors.surface, borderColor: colors.border }}
        >
          <IconSymbol name="person.fill" size={20} color={colors.muted} />
          <TextInput
            className="flex-1 py-4 px-3 text-base"
            style={{ color: colors.foreground }}
            placeholder="Seu nome"
            placeholderTextColor={colors.muted}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            returnKeyType="next"
          />
        </View>
      </View>

      {/* Email Input */}
      <View>
        <Text className="text-sm font-medium text-foreground mb-2">E-mail</Text>
        <View
          className="flex-row items-center rounded-xl px-4 border"
          style={{ backgroundColor: colors.surface, borderColor: colors.border }}
        >
          <IconSymbol name="envelope.fill" size={20} color={colors.muted} />
          <TextInput
            className="flex-1 py-4 px-3 text-base"
            style={{ color: colors.foreground }}
            placeholder="seu@email.com"
            placeholderTextColor={colors.muted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            returnKeyType="next"
          />
        </View>
      </View>

      {/* Role Selector */}
      <View>
        <Text className="text-sm font-medium text-foreground mb-2">Cargo</Text>
        <View className="flex-row gap-2">
          <TouchableOpacity
            className="flex-1 py-3 rounded-xl items-center"
            style={{
              backgroundColor: selectedRole === "consultora" ? colors.primary : colors.surface,
            }}
            onPress={() => setSelectedRole("consultora")}
          >
            <Text
              className="font-medium"
              style={{ color: selectedRole === "consultora" ? "#fff" : colors.foreground }}
            >
              Consultora
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 py-3 rounded-xl items-center"
            style={{
              backgroundColor: selectedRole === "gerente" ? colors.primary : colors.surface,
            }}
            onPress={() => setSelectedRole("gerente")}
          >
            <Text
              className="font-medium"
              style={{ color: selectedRole === "gerente" ? "#fff" : colors.foreground }}
            >
              Gerente
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Unit Selector */}
      <View>
        <Text className="text-sm font-medium text-foreground mb-2">Unidade onde trabalha</Text>
        <TouchableOpacity
          className="flex-row items-center rounded-xl px-4 py-4 border"
          style={{ backgroundColor: colors.surface, borderColor: colors.border }}
          onPress={() => setShowUnitSelector(true)}
          activeOpacity={0.7}
        >
          <IconSymbol name="house.fill" size={20} color={colors.muted} />
          <Text className="flex-1 px-3 text-base" style={{ color: colors.foreground }}>
            {selectedUnit?.name || "Selecione"}
          </Text>
          <IconSymbol name="chevron.right" size={20} color={colors.muted} />
        </TouchableOpacity>
      </View>

      {/* Password Input */}
      <View>
        <Text className="text-sm font-medium text-foreground mb-2">Crie uma senha</Text>
        <View
          className="flex-row items-center rounded-xl px-4 border"
          style={{ backgroundColor: colors.surface, borderColor: colors.border }}
        >
          <IconSymbol name="lock.fill" size={20} color={colors.muted} />
          <TextInput
            className="flex-1 py-4 px-3 text-base"
            style={{ color: colors.foreground }}
            placeholder="Mínimo 4 caracteres"
            placeholderTextColor={colors.muted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            returnKeyType="next"
          />
        </View>
      </View>

      {/* Confirm Password Input */}
      <View>
        <Text className="text-sm font-medium text-foreground mb-2">Confirmar senha</Text>
        <View
          className="flex-row items-center rounded-xl px-4 border"
          style={{ backgroundColor: colors.surface, borderColor: colors.border }}
        >
          <IconSymbol name="lock.fill" size={20} color={colors.muted} />
          <TextInput
            className="flex-1 py-4 px-3 text-base"
            style={{ color: colors.foreground }}
            placeholder="Repita a senha"
            placeholderTextColor={colors.muted}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            returnKeyType="done"
            onSubmitEditing={handleRegister}
          />
        </View>
      </View>

      {/* Register Button */}
      <TouchableOpacity
        className="rounded-xl py-4 items-center mt-2"
        style={{
          backgroundColor: colors.primary,
          opacity: loading ? 0.7 : 1,
        }}
        onPress={handleRegister}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text className="text-white font-semibold text-base">Solicitar Cadastro</Text>
        )}
      </TouchableOpacity>

      {/* Login Link */}
      <TouchableOpacity
        className="mt-4 items-center"
        onPress={() => {
          resetForm();
          setMode("login");
        }}
      >
        <Text className="text-muted">
          Já tem conta?{" "}
          <Text style={{ color: colors.primary }} className="font-semibold">
            Entrar
          </Text>
        </Text>
      </TouchableOpacity>
    </>
  );

  const renderPendingScreen = () => (
    <View className="items-center py-8">
      <View
        className="w-20 h-20 rounded-full items-center justify-center mb-6"
        style={{ backgroundColor: `${colors.warning}20` }}
      >
        <IconSymbol name="clock.fill" size={40} color={colors.warning} />
      </View>
      
      <Text className="text-2xl font-bold text-foreground text-center mb-2">
        Cadastro Enviado!
      </Text>
      
      <Text className="text-base text-muted text-center px-4 mb-6">
        Seu cadastro foi enviado para aprovação. Você receberá acesso assim que o administrador aprovar sua solicitação.
      </Text>

      <View className="w-full p-4 rounded-xl mb-6" style={{ backgroundColor: colors.surface }}>
        <Text className="text-sm text-muted text-center">
          Enquanto isso, entre em contato com sua gerente ou sócio(a) para agilizar o processo.
        </Text>
      </View>

      <TouchableOpacity
        className="rounded-xl py-4 px-8"
        style={{ backgroundColor: colors.primary }}
        onPress={() => {
          resetForm();
          setMode("login");
        }}
        activeOpacity={0.8}
      >
        <Text className="text-white font-semibold text-base">Voltar ao Login</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenContainer edges={["top", "bottom", "left", "right"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 justify-center px-6 py-8">
            {/* Logo Area - Grupo ONE logo */}
            <View className="items-center mb-8">
              <Image
                source={require("@/assets/images/logo-grupo-one.png")}
                className="w-40 h-28 mb-2"
                resizeMode="contain"
              />
              <Text className="text-sm text-muted mt-1">
                {mode === "login" ? "Acesse sua conta" : mode === "register" ? "Cadastro" : ""}
              </Text>
            </View>

            {/* Form */}
            <View className="gap-4">
              {/* Error Message */}
              {error && mode !== "pending" ? (
                <View className="flex-row items-center gap-2 px-2 py-3 rounded-xl" style={{ backgroundColor: `${colors.error}15` }}>
                  <IconSymbol name="exclamationmark.triangle.fill" size={16} color={colors.error} />
                  <Text className="flex-1 text-sm" style={{ color: colors.error }}>{error}</Text>
                </View>
              ) : null}

              {mode === "login" && renderLoginForm()}
              {mode === "register" && renderRegisterForm()}
              {mode === "pending" && renderPendingScreen()}
            </View>

            {/* Footer */}
            <View className="items-center mt-8">
              <Text className="text-xs text-muted mb-1">Desenvolvido por</Text>
              <Image
                source={require("@/assets/images/logo-trafegon.png")}
                className="w-24 h-8"
                resizeMode="contain"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Unit Selector Modal */}
      <UnitSelector
        visible={showUnitSelector}
        onClose={() => setShowUnitSelector(false)}
        onSelect={setSelectedUnitId}
        selectedId={selectedUnitId}
      />
    </ScreenContainer>
  );
}
