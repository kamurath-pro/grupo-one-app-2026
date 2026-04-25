# Requisitos para Publicação - Apple Store e Play Store

## Status Atual do App

✅ **Funcionalidades**: Completas e testadas
✅ **Design**: Padronizado e responsivo
✅ **Testes**: 34+ testes unitários passando
⚠️ **Publicação**: Requer configurações adicionais

---

## 1. REQUISITOS GERAIS (Ambas as Lojas)

### 1.1 Conta de Desenvolvedor
- [ ] **Apple Developer Program**: $99/ano (https://developer.apple.com/programs/)
- [ ] **Google Play Developer**: $25 (pagamento único) (https://play.google.com/console)

### 1.2 Documentação Legal
- [ ] **Política de Privacidade**: Documento em português explicando coleta/uso de dados
- [ ] **Termos de Serviço**: Documento em português com regras de uso
- [ ] **Contato de Suporte**: Email/WhatsApp para contato (já configurado: agenciatrafegon@gmail.com)

### 1.3 Informações do App
- [ ] **Nome do App**: "Grupo ONE" ✅ (já configurado)
- [ ] **Descrição**: Texto descrevendo funcionalidades (máx 4000 caracteres)
- [ ] **Categoria**: Produtividade / Negócios
- [ ] **Idioma**: Português (Brasil)
- [ ] **Classificação etária**: 4+ (sem conteúdo restrito)

### 1.4 Ícones e Imagens
- [ ] **Ícone do app**: 1024x1024px (já existe em assets/images/icon.png) ✅
- [ ] **Screenshots**: 5-8 screenshots em português mostrando funcionalidades
  - Home com Portal
  - Mural de posts
  - Chat
  - Reconhecer
  - Perfil
- [ ] **Imagem de destaque**: 1024x500px (para Play Store)
- [ ] **Imagem promocional**: 1024x500px (para Apple Store)

---

## 2. REQUISITOS ESPECÍFICOS - APPLE APP STORE

### 2.1 Certificados e Provisioning
- [ ] **Apple Developer Account**: Criada e ativa
- [ ] **Certificate Signing Request (CSR)**: Gerado no Mac
- [ ] **iOS Distribution Certificate**: Criado no Apple Developer
- [ ] **Provisioning Profile**: Criado para distribuição
- [ ] **App ID**: Criado com Bundle ID `space.manus.grupo.one.app.t20260108184206`

### 2.2 Configurações no Xcode
- [ ] **Signing Team ID**: Configurado com seu Team ID
- [ ] **Bundle Identifier**: `space.manus.grupo.one.app.t20260108184206` ✅
- [ ] **Version**: 1.0.0 ✅
- [ ] **Build Number**: Incrementado (ex: 1)

### 2.3 App Store Connect
- [ ] **Criar app no App Store Connect**: https://appstoreconnect.apple.com
- [ ] **Informações do app**: Nome, descrição, categoria
- [ ] **Preço e disponibilidade**: Grátis, disponível em Brasil
- [ ] **Conteúdo**: Marcar se usa dados pessoais, câmera, fotos
- [ ] **Classificação etária**: Responder questionário
- [ ] **Contato de suporte**: Email/WhatsApp

### 2.4 Build e Submissão
- [ ] **Build local**: Executar `eas build --platform ios`
- [ ] **Teste em TestFlight**: Enviar para testadores internos/externos
- [ ] **Corrigir problemas**: Resolver avisos/erros do App Store
- [ ] **Submeter para revisão**: Enviar build final

### 2.5 Permissões iOS (Info.plist)
- [ ] **Câmera**: NSCameraUsageDescription (para foto de perfil)
- [ ] **Fotos**: NSPhotoLibraryUsageDescription (para upload de imagens)
- [ ] **Notificações**: NSUserNotificationUsageDescription
- [ ] **Contatos**: NSContactsUsageDescription (se necessário)

### 2.6 Tempo de Revisão
- ⏱️ **Típico**: 24-48 horas
- ⚠️ **Pode rejeitar se**: Bugs, crashes, funcionalidades incompletas, violação de diretrizes

---

## 3. REQUISITOS ESPECÍFICOS - GOOGLE PLAY STORE

### 3.1 Google Play Developer Account
- [ ] **Conta Google**: Criada
- [ ] **Google Play Developer**: Registrado e pago ($25)
- [ ] **Perfil de desenvolvedor**: Completo com informações de contato

### 3.2 Configurações do App
- [ ] **Package Name**: `space.manus.grupo.one.app.t20260108184206` ✅
- [ ] **Version Code**: 1 ✅
- [ ] **Version Name**: 1.0.0 ✅
- [ ] **Target SDK**: 34+ (requerido pelo Google)
- [ ] **Min SDK**: 21 (Android 5.0+)

### 3.3 Assinatura do APK
- [ ] **Keystore**: Criar ou usar existente
  - Comando: `keytool -genkey -v -keystore release.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias grupo-one`
- [ ] **Senha do keystore**: Salvar em local seguro
- [ ] **Alias e senha**: Configurar no build

### 3.4 Google Play Console
- [ ] **Criar app**: Novo app em Google Play Console
- [ ] **Informações básicas**: Nome, descrição, categoria
- [ ] **Conteúdo**: Classificação etária (4+)
- [ ] **Contato de suporte**: Email/WhatsApp
- [ ] **Política de privacidade**: URL ou texto
- [ ] **Permissões**: Listar todas as permissões solicitadas

### 3.5 Build e Upload
- [ ] **Build APK/AAB**: Executar `eas build --platform android`
- [ ] **Upload AAB**: Preferível ao APK (formato moderno)
- [ ] **Teste interno**: Enviar para testadores internos
- [ ] **Teste aberto/fechado**: Opcional, recomendado

### 3.6 Permissões Android (AndroidManifest.xml)
- [ ] **CAMERA**: Para foto de perfil
- [ ] **READ_EXTERNAL_STORAGE**: Para upload de imagens
- [ ] **WRITE_EXTERNAL_STORAGE**: Para salvar dados
- [ ] **INTERNET**: Para conectar ao servidor
- [ ] **POST_NOTIFICATIONS**: Para notificações push ✅

### 3.7 Tempo de Revisão
- ⏱️ **Típico**: 2-3 horas
- ⚠️ **Pode rejeitar se**: Violação de políticas, conteúdo inapropriado, bugs críticos

---

## 4. TAREFAS ANTES DA PUBLICAÇÃO

### 4.1 Testes Finais
- [ ] **Testar em dispositivo real**: iOS e Android
- [ ] **Testar todas as funcionalidades**: Login, posts, chat, métricas, etc.
- [ ] **Testar offline**: Comportamento sem internet
- [ ] **Testar performance**: Sem travamentos ou lentidão
- [ ] **Testar responsividade**: Em diferentes tamanhos de tela

### 4.2 Correções de Bugs
- [ ] **Erros de console**: Remover logs de debug
- [ ] **Crashes**: Corrigir qualquer crash identificado
- [ ] **Avisos TypeScript**: Resolver todos os avisos
- [ ] **Performance**: Otimizar carregamento de imagens e dados

### 4.3 Configurações de Produção
- [ ] **Remover dados de teste**: Limpar usuários/posts de exemplo
- [ ] **Configurar API em produção**: URL do servidor correto
- [ ] **Habilitar HTTPS**: Certificado SSL válido
- [ ] **Configurar variáveis de ambiente**: Chaves de API, tokens, etc.

### 4.4 Documentação
- [ ] **Criar guia de usuário**: Como usar o app
- [ ] **FAQ**: Perguntas frequentes
- [ ] **Contato de suporte**: Email e WhatsApp
- [ ] **Changelog**: Histórico de versões

### 4.5 Branding Final
- [ ] **Logo**: Verificar qualidade e contraste
- [ ] **Cores**: Validar em diferentes temas (claro/escuro)
- [ ] **Fonts**: Verificar se carregam corretamente
- [ ] **Screenshots**: Traduzir textos, adicionar legendas

---

## 5. PROCESSO DE PUBLICAÇÃO (Passo a Passo)

### Passo 1: Preparar Ambiente
```bash
# Instalar EAS CLI
npm install -g eas-cli

# Fazer login
eas login

# Configurar projeto
eas build:configure
```

### Passo 2: Build para iOS
```bash
# Build para App Store
eas build --platform ios --auto-submit

# Ou build local (requer Mac)
eas build --platform ios --local
```

### Passo 3: Build para Android
```bash
# Build para Play Store
eas build --platform android --auto-submit

# Ou build local
eas build --platform android --local
```

### Passo 4: Submeter no App Store Connect
1. Ir para https://appstoreconnect.apple.com
2. Selecionar app "Grupo ONE"
3. Ir para "TestFlight" > "Builds"
4. Selecionar build e clicar "Submit for Review"
5. Preencher informações de revisão
6. Submeter

### Passo 5: Submeter no Google Play Console
1. Ir para https://play.google.com/console
2. Selecionar app "Grupo ONE"
3. Ir para "Release" > "Production"
4. Clicar "Create new release"
5. Upload do AAB
6. Preencher informações
7. Revisar e publicar

---

## 6. CHECKLIST FINAL

### Antes de Submeter
- [ ] App funciona sem crashes
- [ ] Todos os testes passam
- [ ] Screenshots em português
- [ ] Descrição completa e atraente
- [ ] Política de privacidade pronta
- [ ] Termos de serviço prontos
- [ ] Email de suporte configurado
- [ ] Ícone e imagens em alta resolução
- [ ] Permissões justificadas
- [ ] Versão incrementada (1.0.0)

### Após Publicação
- [ ] Monitorar reviews e ratings
- [ ] Responder a feedback dos usuários
- [ ] Corrigir bugs reportados
- [ ] Planejar atualizações futuras
- [ ] Manter app atualizado

---

## 7. ESTIMATIVA DE TEMPO

| Tarefa | Tempo |
|--------|-------|
| Preparar documentação | 2-3 horas |
| Criar screenshots | 1-2 horas |
| Configurar contas de desenvolvedor | 1-2 horas |
| Build e testes | 2-3 horas |
| Submeter iOS | 30 min |
| Submeter Android | 30 min |
| Aguardar aprovação iOS | 24-48 horas |
| Aguardar aprovação Android | 2-3 horas |
| **Total** | **3-4 dias** |

---

## 8. PRÓXIMOS PASSOS RECOMENDADOS

1. **Criar contas de desenvolvedor** (Apple + Google)
2. **Preparar documentação legal** (Política de Privacidade + Termos)
3. **Criar screenshots** em português
4. **Testar app em dispositivos reais** (iOS e Android)
5. **Corrigir bugs identificados**
6. **Fazer build final** com EAS
7. **Submeter para revisão** em ambas as lojas

---

## 9. CONTATO E SUPORTE

- **Email de suporte**: agenciatrafegon@gmail.com
- **WhatsApp**: wa.me/5587996466975
- **Documentação Expo**: https://docs.expo.dev
- **Apple Developer**: https://developer.apple.com
- **Google Play**: https://play.google.com/console

---

## Notas Importantes

⚠️ **Custo**: Apple ($99/ano) + Google ($25 único) = ~$124 total
⚠️ **Tempo**: Contar com 3-4 dias para publicação completa
⚠️ **Manutenção**: App precisa de atualizações regulares (correções, novas funcionalidades)
⚠️ **Segurança**: Usar HTTPS, validar dados, proteger credenciais
⚠️ **Conformidade**: Seguir diretrizes das lojas, respeitar privacidade dos usuários
