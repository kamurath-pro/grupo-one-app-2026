# Resumo Completo - App Grupo ONE

## O que é o App?

O **Grupo ONE** é uma plataforma de comunicação e gestão interna para a rede de franquias Espaçolaser. Conecta sócios, gerentes e colaboradoras através de um mural corporativo, sistema de reconhecimento, chat, compartilhamento de documentos e métricas de tráfego pago em tempo real.

---

## Estrutura de Usuários

O app possui 4 tipos de usuários com permissões diferentes:

### 1. **Administrador (ADM)** - Você (Kamurath)
- **Email**: agenciatrafegon@gmail.com
- **Senha**: admin2024
- **Acesso**: Painel de aprovação de cadastros, gerenciamento de usuários
- **Onde fazer login**: Tela de Login > Aba "Acesse sua conta" > Selecionar "Sócio(a)" > Inserir email e senha

### 2. **Sócios(as)**
- Acesso pré-cadastrado (nome + senha de 4 dígitos)
- Podem acessar todas as unidades
- Veem Portal completo: Documentos, Métricas, Arquivos Úteis, Suporte
- Podem postar no mural e selecionar unidade
- Aprovam cadastros de gerentes e colaboradoras

### 3. **Gerentes**
- Fazem cadastro (precisam de aprovação do ADM)
- Acesso a uma unidade específica
- Veem Portal simplificado: Documentos e Suporte
- Podem postar no mural (unidade detectada automaticamente)
- Veem aniversariantes do mês

### 4. **Colaboradoras**
- Fazem cadastro (precisam de aprovação do ADM)
- Acesso a uma unidade específica
- Veem Portal simplificado: Documentos e Suporte
- Podem postar no mural (unidade detectada automaticamente)
- Veem aniversariantes do mês

---

## Seções do App (Abas)

### 1. **HOME** 📱
**O que é**: Painel central com comunicados, portal de acesso rápido, aniversariantes do mês e mural de posts.

**Funcionalidades**:
- **Comunicado**: Banner destacado com novidades
- **Portal**: Cards de acesso rápido
  - **Documentos**: Acessa Relatórios Mensais e Notas Fiscais por unidade
  - **Métricas**: Painel executivo com dados de tráfego pago em tempo real (5 indicadores: Investimento, Visualizações, Pessoas Alcançadas, Engajamento, Cliques)
  - **Arquivos Úteis**: Link para pasta do Google Drive com vouchers, artes e termos
  - **Suporte**: WhatsApp da agência (wa.me/5587996466975)
- **Aniversários do Mês**: Exibe colaboradoras aniversariantes com foto
  - Botão "Parabéns" aparece apenas no dia do aniversário
  - Clique envia um reconhecimento automático
- **Mural de Posts**: Feed de todas as unidades ou filtrado por unidade
  - Filtros por Times (13 unidades: Araripina, Serra Talhada, Garanhuns, Cajazeiras, Vitória, Livramento, Muriaé, Vilhena, Corumbá, Fortaleza, Macaé Shopping, Macaé Centro, Quixadá, Messejana)
  - Botões: Curtir (❤️ azul quando curtido), Ver Comentários, Comentar
  - Comentários exibem foto e nome do autor
  - Apenas autor pode excluir comentário

### 2. **CHAT** 💬
**O que é**: Mensageria interna entre usuários.

**Funcionalidades**:
- Lista de conversas ativas
- Envio de mensagens individuais e em grupo
- Opção de apagar mensagem enviada
- Opção de apagar conversa inteira
- Última mensagem e horário exibidos

### 3. **BOTÃO +** (Centralizado no Tab Bar)
**O que é**: Acesso rápido para criar novo post no mural.

**Funcionalidades**:
- Criar post com texto
- Adicionar 1 imagem (proporção 4:5)
- Selecionar unidade (apenas sócios; gerentes/colaboradoras: automático)
- Preview antes de publicar
- Sem suporte a vídeos ou arquivos

### 4. **RECONHECER** 🌟
**O que é**: Sistema de reconhecimento e valorização entre colaboradoras.

**Funcionalidades**:
- Enviar reconhecimento (Parabéns, Obrigado, Destaque)
- Adicionar mensagem personalizada
- Histórico de reconhecimentos recebidos
- Notificação ao receber reconhecimento

### 5. **PERFIL** 👤
**O que é**: Informações pessoais e configurações do usuário.

**Funcionalidades**:
- Foto de perfil circular
- Nome, email, unidade(s), data de nascimento
- Seção Configurações: Tema (claro/escuro), Idioma
- Seção Suporte: Contato com Marketing (WhatsApp)
- Botão Logout

---

## Header Padrão (Todas as Abas)
- **Logo Espaçolaser branca** (lado esquerdo)
- **Sininho de notificações** (lado direito)
  - Badge vermelho com contador de notificações não lidas
  - Clique abre tela de notificações
  - Notificações de aniversários, reconhecimentos, comentários

---

## Rodapé Fixo (Todas as Abas)
- Barra azul com 4 logos em linha: **Grupo ONE**, **Espaçolaser**, **Meta**, **TráfegON**
- Fixo abaixo do tab bar (não scrollável)

---

## Unidades Disponíveis (14 no Total)

| ID | Nome | Cidade | Estado | Prefixo |
|----|------|--------|--------|---------|
| 1 | Araripina | Araripina | PE | ARA |
| 2 | Serra Talhada | Serra Talhada | PE | ST |
| 3 | Garanhuns | Garanhuns | PE | GUS |
| 4 | Cajazeiras | Cajazeiras | PB | CZ |
| 5 | Vitória de Santo Antão | Vitória de Santo Antão | PE | VSA |
| 6 | Santana do Livramento | Santana do Livramento | RS | LIV |
| 7 | Muriaé | Muriaé | MG | MUR |
| 8 | Vilhena | Vilhena | RO | VIL |
| 9 | Corumbá | Corumbá | MS | COR |
| 10 | Fortaleza | Fortaleza | CE | FOR |
| 11 | Macaé Shopping | Macaé | RJ | MACS |
| 12 | Macaé Centro | Macaé | RJ | MACE |
| 13 | Quixadá | Quixadá | CE | QUI |
| 14 | Messejana | Fortaleza | CE | MES |

---

## Sistema de Aniversariantes

- **Origem dos dados**: Banco de dados do app (campo "Data de Nascimento" no cadastro)
- **Identificação automática**: Sistema detecta automaticamente quem faz aniversário este mês
- **Destaque no dia**: Aniversariante do dia recebe badge especial e botão "Parabéns"
- **Notificações**: Todos recebem notificação no dia do aniversário de cada colaboradora
- **Atualização**: Diária, automática

---

## Sistema de Métricas

- **Dados em tempo real**: Integração com Google Sheets
- **5 Indicadores**: Investimento (R$), Visualizações, Pessoas Alcançadas, Engajamento, Cliques
- **Por unidade**: Cada unidade tem sua própria planilha de métricas
- **Formatação automática**: Números grandes exibem em K/M (ex: 1.5K, 2.3M)
- **Pull-to-refresh**: Atualizar manualmente puxando a tela para baixo

---

## Permissões por Cargo

| Funcionalidade | Admin | Sócio | Gerente | Colaboradora |
|---|---|---|---|---|
| Aprovar cadastros | ✅ | ✅ | ❌ | ❌ |
| Ver Portal completo | ✅ | ✅ | ❌ | ❌ |
| Ver Métricas | ✅ | ✅ | ❌ | ❌ |
| Postar no mural | ✅ | ✅ | ✅ | ✅ |
| Selecionar unidade ao postar | ✅ | ✅ | ❌ | ❌ |
| Enviar reconhecimento | ✅ | ✅ | ✅ | ✅ |
| Ver aniversariantes | ✅ | ✅ | ✅ | ✅ |
| Acessar chat | ✅ | ✅ | ✅ | ✅ |
| Acessar documentos | ✅ | ✅ | ✅ | ✅ |

---

## Como Fazer Login como Administrador

1. Abra o app
2. Tela de Login: Selecione a aba **"Acesse sua conta"**
3. Selecione **"Sócio(a)"** como tipo de acesso
4. Insira:
   - **Email**: agenciatrafegon@gmail.com
   - **Senha**: admin2024
5. Clique em **"Entrar"**
6. Você terá acesso ao painel de aprovação de cadastros e gerenciamento completo

---

## Dados de Exemplo (Sócios Pré-cadastrados)

Para testar o app, você pode fazer login com os sócios pré-cadastrados:

| Nome | Email | Senha | Unidades |
|------|-------|-------|----------|
| Fran | fran@espaçolaser.com | 9864 | Todas |
| Kamurath (ADM) | agenciatrafegon@gmail.com | admin2024 | Todas |

---

## Tecnologias Utilizadas

- **Frontend**: React Native com Expo SDK 54
- **Styling**: NativeWind (Tailwind CSS)
- **State Management**: React Context + AsyncStorage
- **Notificações**: expo-notifications
- **Integração**: Google Sheets API
- **Banco de dados**: AsyncStorage (local) + PostgreSQL (servidor)
- **Autenticação**: Email/Senha com aprovação manual

---

## Versão Atual

- **Versão**: 4.5
- **Status**: Em desenvolvimento
- **Última atualização**: Novas unidades (Quixadá, Messejana) + Campo de data de nascimento
