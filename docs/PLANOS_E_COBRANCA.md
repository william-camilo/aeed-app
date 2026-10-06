# Planos AEED e acesso

## Valores e recursos

| Plano | Mensalidade | Usuários | Recursos liberados |
| --- | ---: | ---: | --- |
| AEED Individual | R$ 69,90 | 1 | Assistente de respostas AEED, análise com IA quando configurada, modo guiado, treinamento individual, histórico e favoritos. Acesso pelo celular e navegador. |
| AEED Equipe | R$ 249,90 | Até 5 | Recursos do Individual, configuração da empresa, criação de contas individuais para atendentes, painel de gestão com relatórios básicos e suporte por e-mail. |
| AEED Empresa | R$ 597,90 | Até 15 | Recursos do Equipe, registros e práticas agregados da equipe, relatórios completos disponíveis no painel, acompanhamento da evolução e suporte por e-mail. |

Não há custo de implantação nos planos apresentados.

## Cadastro e permissões

O cadastro permite escolher o plano. A escolha é persistida na conta junto do estado da assinatura. O plano Individual cria um perfil de atendente e esconde as áreas de empresa e gestão. Os planos Equipe e Empresa criam um perfil gestor; a API limita criação de contas ao teto de usuários do plano. Os atendentes criados pelo gestor recebem o plano da organização e login próprio.

As áreas da empresa também são verificadas no servidor. Uma conta Individual recebe resposta de acesso negado se tentar salvar configurações da empresa ou consultar a equipe diretamente pela API. Para gestores de Equipe e Empresa, o painel carrega até 500 análises e práticas do espaço da organização. O relatório disponível usa esses registros para mostrar volume, respostas copiadas, treinamentos, situações frequentes e desfechos informados manualmente.

## Cobrança recorrente

Esta entrega prepara a seleção de planos, os preços e a liberação de recursos. Ela ainda não cria cobrança, checkout, fatura, cancelamento ou confirmação automática de pagamento. O cadastro inicial grava o estado como `active` para permitir uso durante a preparação e demonstração; isso não significa que uma mensalidade foi cobrada.

Para ativar cobrança em produção, integrar um provedor (por exemplo, Mercado Pago, Stripe ou Asaas) e seguir este fluxo:

1. Depois do cadastro, criar o cliente e a assinatura recorrente no provedor usando o plano selecionado.
2. Redirecionar para o checkout seguro e manter o estado como `pending` até a confirmação.
3. Validar a assinatura dos webhooks do provedor e atualizar `subscription_status` para `active`, `past_due` ou `canceled` conforme os eventos confirmados.
4. Bloquear funções pagas no servidor quando o estado não estiver ativo, além de mostrar uma tela para regularizar a assinatura.
5. Guardar o identificador do cliente/assinatura do provedor, datas do ciclo e histórico dos eventos recebidos para suporte e auditoria.

Não armazenar dados de cartão no AEED. As credenciais secretas do provedor devem ser configuradas como variáveis seguras no ambiente de produção.

## Banco de dados
A publicação Vercel utiliza PostgreSQL Neon. O esquema está em migrations/postgres/001_initial.sql. Execute pnpm db:migrate antes da primeira publicação. As migrações D1 antigas foram mantidas como histórico.

## Janela inicial de planos

A página inicial consulta a sessão antes de renderizar os planos. Visitantes veem a janela com os três planos, escolha para cadastro e entrada para quem já possui conta. Contas autenticadas com assinatura active e administradores entram diretamente no painel. Estados pending, past_due e canceled exibem um lembrete de regularização; não são convertidos em active pelo navegador. Não há sinalizador de compra em localStorage ou parâmetro de URL.

A cobrança ainda não está conectada: os botões informam que o cadastro é de demonstração e não há pagamento nessa etapa. A integração futura deve confirmar compras por webhook autenticado no servidor e atualizar o estado da assinatura; só então será possível reconhecer pagamento real. O estado active dos cadastros atuais é demonstrativo e não comprova pagamento.

Os campos de acesso começam vazios, desestimulam autofill e ficam somente leitura até receber foco. O exemplo público de login admin foi removido. Gerenciadores de senhas podem ignorar essas preferências; nesse caso, remova a credencial salva para o domínio nas configurações do navegador.
