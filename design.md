# Design do Aplicativo Grupo ONE

Este documento define o planejamento de interface do aplicativo móvel do Grupo ONE, considerando orientação retrato (9:16) e uso com uma mão, seguindo as diretrizes do Apple Human Interface Guidelines (HIG).

## Identidade Visual

O aplicativo adota uma paleta de cores que remete à identidade do Grupo ONE, com tons profissionais e acolhedores. A cor primária será um azul corporativo (#1E3A5F), complementado por tons de dourado/âmbar (#D4A574) para destaques e ações importantes, transmitindo sofisticação e confiança.

| Elemento | Cor Light | Cor Dark |
|:---------|:----------|:---------|
| Primária | #1E3A5F (Azul Corporativo) | #2E5A8F |
| Destaque | #D4A574 (Dourado) | #E5B584 |
| Background | #FFFFFF | #121212 |
| Surface | #F8F9FA | #1E1E1E |
| Texto Principal | #1A1A1A | #FAFAFA |
| Texto Secundário | #6B7280 | #9CA3AF |

## Lista de Telas

O aplicativo será organizado em cinco abas principais na Tab Bar inferior, seguindo o padrão iOS.

| Tela | Descrição |
|:-----|:----------|
| **Login** | Tela de autenticação com campos de e-mail e senha, logo do Grupo ONE |
| **Home (Feed)** | Feed de notícias e comunicados com cards de posts, curtidas e comentários |
| **Arquivos** | Navegador de documentos do Google Drive filtrado por unidade e permissão |
| **Chat** | Lista de conversas e tela de mensagens individuais/grupo |
| **Reconhecimento** | Envio de gestos de reconhecimento entre colaboradores |
| **Perfil** | Informações do usuário, unidade vinculada e configurações |

## Conteúdo e Funcionalidade por Tela

### Tela de Login
A tela de login apresenta o logo do Grupo ONE centralizado no topo, seguido pelos campos de e-mail e senha. Um botão de ação primária "Entrar" ocupa a largura total na parte inferior da área de conteúdo. A tela deve transmitir profissionalismo e segurança.

### Tela Home (Feed)
O feed exibe cards de posts em lista vertical com scroll infinito. Cada card contém: avatar e nome do autor, data de publicação, conteúdo textual, imagem opcional, e barra de ações (curtir, comentar). Um botão flutuante permite criar novos posts (visível apenas para administradores/gerentes).

### Tela de Arquivos
A tela de arquivos apresenta uma estrutura de pastas navegável. No topo, um breadcrumb mostra o caminho atual. A lista exibe pastas e arquivos com ícones apropriados (pasta, PDF, imagem, documento). Ao tocar em um arquivo, abre-se um visualizador ou link externo. O sistema filtra automaticamente o conteúdo baseado na unidade e cargo do usuário logado.

### Tela de Chat
A lista de conversas mostra contatos e grupos com preview da última mensagem e timestamp. A tela de conversa segue o padrão de mensagens com balões alinhados à direita (enviadas) e esquerda (recebidas). Campo de texto com botão de envio na parte inferior.

### Tela de Reconhecimento
Permite selecionar um colaborador de uma lista e enviar um "gesto" de reconhecimento (elogio, agradecimento, destaque). Os reconhecimentos recebidos aparecem no feed e no perfil do destinatário.

### Tela de Perfil
Exibe foto, nome, cargo e unidade do usuário. Lista de reconhecimentos recebidos. Botão de logout. Configurações de notificação.

## Fluxos de Usuário Principais

### Fluxo de Login
O usuário abre o aplicativo e visualiza a tela de login. Insere e-mail e senha cadastrados pelo administrador. Ao autenticar com sucesso, é direcionado para a Home (Feed). Em caso de erro, uma mensagem clara é exibida.

### Fluxo de Acesso a Arquivos
O usuário navega até a aba Arquivos. O sistema carrega automaticamente as pastas da unidade do usuário. O usuário pode navegar pelas subpastas e visualizar/baixar arquivos. Sócios visualizam pastas adicionais de gestão que não aparecem para consultoras e gerentes.

### Fluxo de Envio de Reconhecimento
O usuário acessa a aba Reconhecimento. Seleciona um colaborador da lista (todas as unidades visíveis). Escolhe um tipo de gesto (Parabéns, Obrigado, Destaque). Adiciona uma mensagem opcional. Confirma o envio. O reconhecimento aparece no feed e no perfil do destinatário.

### Fluxo de Chat
O usuário acessa a aba Chat. Visualiza lista de conversas existentes ou inicia nova conversa. Seleciona um contato ou grupo. Digita e envia mensagens. Recebe notificações de novas mensagens.

## Componentes de Interface

A interface utiliza componentes nativos do iOS sempre que possível, garantindo familiaridade e acessibilidade. Cards com cantos arredondados (12px), sombras sutis para elevação, e espaçamento consistente de 16px nas margens. Botões primários com altura de 48px para facilitar o toque. Tipografia clara com hierarquia bem definida.
