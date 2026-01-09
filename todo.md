# Project TODO

- [x] Configurar tema e cores do Grupo ONE (cores Espaçolaser)
- [x] Configurar estrutura de navegação (Tab Bar com 5 abas)
- [x] Criar tela de Login com autenticação
- [x] Implementar sistema de usuários com roles (Sócio, Gerente, Consultora)
- [x] Criar banco de dados com tabelas de usuários, unidades e permissões
- [x] Implementar tela Home (Feed) com posts e interações
- [x] Criar tela de Arquivos com navegação de pastas
- [x] Implementar filtro de arquivos por unidade e cargo
- [x] Criar tela de Chat com lista de conversas
- [ ] Implementar mensagens individuais e em grupo
- [x] Criar tela de Reconhecimento para envio de gestos
- [x] Implementar tela de Perfil com informações do usuário
- [x] Aplicar logo do Grupo ONE (recebido do usuário)
- [x] Configurar branding no app.config.ts
- [ ] Criar dados de exemplo para demonstração
- [ ] Testar fluxos principais do aplicativo
- [x] Atualizar paleta de cores para cores oficiais da Espaçolaser
- [ ] Implementar cadastro/login com Google OAuth
- [x] Aplicar logo da Espaçolaser enviada pelo usuário
- [x] Implementar sistema de aprovação de cadastros pelo administrador
- [ ] Simplificar fluxo: sócios/gerentes pré-cadastrados, apenas consultoras fazem cadastro
- [x] Configurar agenciatrafegon@gmail.com como administrador
- [x] Criar painel de aprovação de cadastros pendentes
- [x] Atualizar sistema: gerentes fazem cadastro igual consultoras (precisam aprovação)
- [x] Configurar sócios com login/senha do PDF (nome + senha 4 dígitos)
- [x] Implementar acesso aos links do Drive por unidade para sócios
- [ ] Implementar visualização de dados de tráfego em tempo real (fonte de dados)
- [x] Aplicar logo da Espaçolaser como ícone do app
- [x] Aplicar logo do Grupo ONE na tela de login
- [x] Aplicar logo da TráfegON no rodapé
- [x] Implementar upload e exibição de foto de perfil
- [x] Implementar funcionalidade de remover usuários (demissão)
- [x] Otimizar layout responsivo para tablets
- [x] Otimizar layout responsivo para desktop/computador
- [x] Garantir acesso via navegador web em smartphones
- [x] Testar responsividade em diferentes tamanhos de tela
- [ ] Preparar aplicativo para publicação na Play Store (Android)
- [x] Atualizar paleta de cores conforme manual de marca Espaçolaser (cores clássicas)
- [x] Aplicar fundo branco na tela de login
- [x] Adicionar fontes Barlow Condensed e Barlow conforme padrão da marca

## Redesign v2.0 - Layout iMidiaApp
- [x] Criar componente Header azul com logo e notificações
- [x] Atualizar tema: header azul, corpo branco/cinza claro
- [x] Redesenhar tela de Login (header azul, corpo branco)
- [x] Redesenhar tela Home com Portal em grid 2x2
- [x] Adicionar seção de Comunicados na Home
- [x] Redesenhar Feed/Mural com filtros por categoria
- [x] Adicionar botão flutuante (+) para criar conteúdo
- [x] Redesenhar Chat com seção de aniversáriantes
- [x] Redesenhar tela de Arquivos
- [x] Redesenhar tela de Perfil
- [x] Redesenhar tela de Admin
- [x] Atualizar Tab Bar com ícones limpos


## Atualização v3.0 - Ajustes Finais
- [x] Copiar logos brancas para assets do projeto
- [x] Header: Logo Espaçolaser branca horizontal no topo
- [x] Portal para SÓCIOS: Documentos, Métricas, Arquivos Úteis, Suporte
- [x] Portal para COLABORADORES/GERENTES: apenas Documentos e Suporte
- [x] Documentos: Unidade > pastas (renomeado de Arquivos)
- [ ] Métricas: painel com dados do Sheets em tempo real (pendente integração)
- [ ] Arquivos Úteis: link para pasta do Drive (aguardar link)
- [x] Suporte: "Fale com o Marketing" > WhatsApp wa.me/5587996466975
- [x] Ícones adequados para cada card do Portal (Material Icons)
- [x] Foto de perfil circular ao lado do nome do usuário
- [x] Tab Bar: Home, Chat, BOTÃO + (centralizado sobressaindo), Reconhecer, Perfil
- [x] Times (filtros): Geral, Araripina, Serra, Garanhuns, Cajazeiras, Vitória, Livramento, Muriaé, Vilhena, Corumbá, Fortaleza, Macaé Plaza, Macaé Centro
- [x] Posts: remover ícone info e opção Salvar
- [x] Curtir: coração que fica azul quando curtido (funcional)
- [x] Comentar funcional (modal de comentário)
- [x] Botão voltar funcional (navegação do smartphone)
- [x] Rodapé com 4 logos em linha: Grupo ONE, Espaçolaser, Meta, TráfegON
- [x] Garantir contraste correto (logo branca no fundo azul)
- [x] Responsividade otimizada para todos os dispositivos
- [ ] Tudo funcional em navegador e Play Store (em teste)

## Correção v3.1 - Rodapé Fixo
- [x] Barra azul com 4 logos fixa abaixo do tab bar (não scrollável)
- [x] Rodapé estático igual ao exemplo visual
- [x] Foto de perfil da Lia salva como exemplo

## Correção v3.2 - Logos nas Telas de Login/Cadastro
- [x] Logo Grupo ONE branca no header azul das telas de login e cadastro
- [x] Rodapé "Desenvolvido por" + logo TráfegON azul
- [x] Copiar logos corretas para assets

## Atualização v4.0 - Melhorias Completas

### PORTAL
- [x] Documentos: label "Acesse Notas Fiscais e Relatórios"
- [x] Documentos: flow Portal > Documentos > Selecionar Unidade > Relatórios Mensais | Notas Fiscais
- [x] Documentos: remover "Fonte de Dados"
- [x] Métricas: label "Tráfego Pago em tempo real"
- [x] Métricas: tela criada com layout igual ao app de referência
- [ ] Métricas: integração com Google Sheets (pendente API)
- [x] Arquivos Úteis: label "Vouchers, Artes, Termos e mais"
- [x] Arquivos Úteis: redirecionar para pasta do Drive
- [x] Suporte: label "Vamos resolver seu problema"

### ANIVERSARIANTES
- [x] Label "Aniversários do mês"
- [x] Exibir aniversariantes durante o mês
- [x] Destaque visual no dia do aniversário (badge de bolo + cor azul)
- [ ] Notificação interna (sininho) no dia (pendente integração)
- [ ] Push notification no dia do aniversário (pendente integração)
- [x] Botão funcional para dar parabéns com 1 clique

### TIMES
- [x] Posição: abaixo de Aniversários e acima das unidades
- [x] Tab Geral: postagens de todas as unidades
- [x] Tab Unidade: apenas postagens da unidade do usuário
- [x] Membros: detecção automática da unidade ao postar
- [x] Sócios: podem selecionar unidade ao postar
- [x] Conteúdo: apenas texto OU texto + 1 imagem
- [x] Imagem: proporção 4:5 (hint na tela de criar)
- [x] Proibir vídeos e arquivos (removidos da tela de criar)

### MURAL OFICIAL
- [x] Likes: contador visível e em tempo real
- [x] Comentários: exibir nome e foto do autor
- [x] Comentários: apenas o autor pode excluir
- [x] Comentários: permanecem até exclusão
- [x] Corrigir funcionamento atual dos comentários

## Integração v4.1 - Métricas em Tempo Real
- [x] Analisar estrutura das planilhas do Google Sheets por unidade
- [x] Criar serviço de integração com Google Sheets API
- [x] Implementar busca de dados em tempo real
- [x] Atualizar tela de Métricas para consumir dados da API
- [x] Exibir 5 indicadores: Investimento, Visualizações, Pessoas Alcançadas, Engajamento, Cliques
- [x] Testar integração com testes unitários

## Integração v4.2 - Notificações de Aniversário
- [x] Criar contexto de notificações internas (NotificationContext)
- [x] Implementar verificação diária de aniversariantes
- [x] Configurar expo-notifications para push notifications
- [x] Criar tela de listagem de notificações
- [x] Atualizar sininho com badge de notificações não lidas
- [x] Disparar notificação no dia do aniversário de cada colaborador
- [x] Permitir marcar notificações como lidas
- [x] Testar fluxo completo de notificações (24 testes passando)

## Ajustes v4.3 - Limpeza e Padronização
- [x] Métricas: remover seção "Recursos" (Relatórios Mensais e Notas Fiscais)
- [x] Métricas: manter apenas "Performance do Tráfego Pago"
- [x] Header: adicionar logo Espaçolaser + sininho na aba Chat
- [x] Header: adicionar logo Espaçolaser + sininho na aba Reconhecer
- [x] Header: adicionar logo Espaçolaser + sininho na aba Perfil
- [x] Chat: remover seção "Aniversariantes"
- [x] Perfil > Configurações: remover "Notificações"
- [x] Perfil > Configurações: remover "Privacidade"
- [x] Perfil > Suporte: remover "Central de ajuda"
- [x] Perfil > Suporte: remover "Termos de uso"

## Atualização v4.4 - Novas Funcionalidades
### 1. Mural - Ver Comentários
- [x] Adicionar botão "Ver comentários" nas publicações
- [x] Expandir campo da publicação para exibir comentários inline

### 2. Suporte - Ícone WhatsApp
- [x] Adicionar ícone de chat/atendimento no card Suporte (verde)

### 3. Chat - Apagar Mensagens
- [x] Implementar opção de apagar mensagem enviada
- [x] Implementar opção de apagar conversa inteira

### 4. Métricas - Redesign
- [x] Atualizar layout igual ao início da aba Home
- [x] Padronizar design do painel executivo com header azul

### 5. Mural - Upload de Imagens
- [x] Implementar seleção de imagem da galeria (expo-image-picker)
- [x] Suporte para proporção 4:5
- [x] Preview da imagem antes de publicar

### 6. Métricas - Integrar Unidades Faltantes
- [x] Estrutura preparada para Garanhuns (aguardando link da planilha)
- [x] Estrutura preparada para Cajazeiras (aguardando link da planilha)
- [x] Todas as 12 unidades mapeadas no serviço

### 7. Aniversários - Animação de Festa
- [x] Botão "Parabéns" aparece apenas para aniversariante do dia
- [x] Feedback visual ao dar parabéns

### 8. Aniversários - Integração Monday.com
- [x] Conectar com Monday.com via MCP
- [x] Extrair dados do quadro Aniversariantes (Nome, Unidade, Data, Foto)
- [x] Identificar unidades pelos prefixos (ARA, ST, GUS, CZ, VSA, LIV, MUR, VIL, COR, FOR, MACS, MACE)
- [x] Serviço monday-service.ts criado com mapeamento completo
- [ ] Atualização automática diária (requer endpoint no servidor)
