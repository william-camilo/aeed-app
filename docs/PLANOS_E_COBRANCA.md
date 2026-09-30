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

A migração `0002_billing_plans.sql` adiciona `plan` e `subscription_status` à tabela de usuários, mantém as contas existentes ativas e migra gestores antigos para Equipe. Antes de publicar esta versão, aplicar as migrações pendentes ao banco D1 do ambiente de produção.
