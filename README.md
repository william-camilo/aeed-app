# AEED na Prática

Aplicação PWA privada para apoiar atendentes e gestores, baseada nas apostilas fornecidas de Camila Cesar Llourente / CL Solutions.

## Funcionalidades
- Login individual por e-mail e senha, com perfil `attendant` (atendente) ou `manager` (gestor).
- Uma sessão ativa por usuário: um novo login invalida o token anterior; o dispositivo antigo é desconectado automaticamente na verificação periódica ou na próxima ação.
- Oito situações com análise em seis blocos: situação, etapa, informação faltante, estratégia, resposta e próximo passo.
- Modo guiado explicitamente identificado, sem alegar compreensão livre de mensagens.
- Integração server-side com OpenAI Responses, saída estruturada e recuperação de trechos das duas apostilas.
- Cadastro de informações comerciais, histórico, favoritos, desfechos e treinamento salvos em PostgreSQL Neon, isolados pelo identificador autenticado.
- Biblioteca com os textos extraídos e os PDFs originais de atendentes (96 páginas) e gestores (181 páginas).
- Cinco exercícios com revisão inicial por critérios simples, explicitamente distinta de avaliação semântica por IA ou revisão humana.
- Painel de gestão calculado sobre até os 500 registros recentes deste espaço; não contém números demonstrativos.
- Manifesto PWA, ícones e service worker; fallback offline e cache dos materiais abertos. Análise e persistência exigem conexão.

## Ativação da IA
Configure `OPENAI_API_KEY` como segredo do Site. `OPENAI_MODEL` é opcional (padrão `gpt-4.1-mini`). Nenhuma chave vai para o navegador. Sem chave, o app opera com orientação guiada. A integração com IA está preparada, mas não foi testada com credencial real neste ambiente.

A política do assistente proíbe inventar condições e orienta consultar o cadastro da empresa; a revisão humana antes do envio continua necessária. O aplicativo não envia mensagens a clientes.

## Acesso e sessão única
As tabelas users e sessions estão em migrations/postgres/001_initial.sql.sql`. Senhas nunca são salvas em texto: cada cadastro usa sal e PBKDF2-HMAC-SHA-256 com 600.000 iterações. O cookie `aeed_session` é HttpOnly, Secure e SameSite=Lax. No login, o hash do token atual é trocado atomicamente e todas as sessões anteriores deixam de ser aceitas. O cliente verifica a sessão a cada 20 segundos e encerra a interface quando recebe `401`.

Cada novo cadastro escolhe o plano e recebe o perfil correspondente. Individual é um acesso pessoal; Equipe e Empresa recebem o perfil gestor e podem criar logins próprios para atendentes até o limite do plano. Atendentes e contas Individuais não veem as áreas de empresa e gestão. A instalação PostgreSQL usa pnpm db:migrate; as migrações D1 são histórico da versão anterior.

O login administrativo usa admin e o segredo ADMIN_PASSWORD no ambiente da Vercel. Não publicar a senha no repositório. A conta tem organização própria; não acessa os dados das empresas clientes.

Os planos e a preparação da cobrança estão descritos em [`docs/PLANOS_E_COBRANCA.md`](./docs/PLANOS_E_COBRANCA.md). A apresentação de recursos e valores fica na rota `/planos`. A escolha do plano e as permissões estão implementadas; checkout e cobrança recorrente ainda dependem da integração com um provedor e seus webhooks.

## Publicação na Vercel
A aplicação usa Next.js e PostgreSQL Neon. Consulte [docs/VERCEL.md](docs/VERCEL.md) para implantação, variáveis, migrações e futura transferência para Hostinger. O repositório é william-camilo/aeed-app.

## Escopo atual
O painel agrega até 500 análises e práticas recentes para as contas gestoras da organização, e mantém o histórico pessoal para atendentes e planos Individuais. Os relatórios usam registros da aplicação; não há integração direta com WhatsApp ou sistemas de vendas. O acesso interno é controlado pelo login da aplicação. Dados comerciais e mensagens não são armazenados no cache offline.

## Desenvolvimento
Preservar pnpm e o lockfile. `pnpm exec tsc --noEmit` valida tipos. A compilação usa pnpm build (Next.js). O banco atual é PostgreSQL, com esquema em migrations/postgres/.

## Verificação realizada
Build Next.js, TypeScript e testes de integração de cadastro, permissões, sessão única sequencial e concorrente, cookies e logout. Não houve teste de API OpenAI com credencial real.
