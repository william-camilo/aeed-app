# AEED na Prática

Aplicação PWA privada para apoiar atendentes e gestores, baseada nas apostilas fornecidas de Camila Cesar Llourente / CL Solutions.

## Funcionalidades
- Login individual por e-mail e senha, com perfil `attendant` (atendente) ou `manager` (gestor).
- Uma sessão ativa por usuário: um novo login invalida o token anterior; o dispositivo antigo é desconectado automaticamente na verificação periódica ou na próxima ação.
- Oito situações com análise em seis blocos: situação, etapa, informação faltante, estratégia, resposta e próximo passo.
- Modo guiado explicitamente identificado, sem alegar compreensão livre de mensagens.
- Integração server-side com OpenAI Responses, saída estruturada e recuperação de trechos das duas apostilas.
- Cadastro de informações comerciais, histórico, favoritos, desfechos e treinamento salvos em D1, isolados pelo identificador autenticado.
- Biblioteca com os textos extraídos e os PDFs originais de atendentes (96 páginas) e gestores (181 páginas).
- Cinco exercícios com revisão inicial por critérios simples, explicitamente distinta de avaliação semântica por IA ou revisão humana.
- Painel de gestão calculado sobre até os 500 registros recentes deste espaço; não contém números demonstrativos.
- Manifesto PWA, ícones e service worker; fallback offline e cache dos materiais abertos. Análise e persistência exigem conexão.

## Ativação da IA
Configure `OPENAI_API_KEY` como segredo do Site. `OPENAI_MODEL` é opcional (padrão `gpt-4.1-mini`). Nenhuma chave vai para o navegador. Sem chave, o app opera com orientação guiada. A integração com IA está preparada, mas não foi testada com credencial real neste ambiente.

A política do assistente proíbe inventar condições e orienta consultar o cadastro da empresa; a revisão humana antes do envio continua necessária. O aplicativo não envia mensagens a clientes.

## Acesso e sessão única
As tabelas `users` e `sessions` estão na migração `drizzle/0001_auth_sessions.sql`. Senhas nunca são salvas em texto: cada cadastro usa sal e PBKDF2-HMAC-SHA-256 com 600.000 iterações. O cookie `aeed_session` é HttpOnly, Secure e SameSite=Lax. No login, o hash do token atual é trocado atomicamente e todas as sessões anteriores deixam de ser aceitas. O cliente verifica a sessão a cada 20 segundos e encerra a interface quando recebe `401`.

Cada novo cadastro escolhe o plano e recebe o perfil correspondente. Individual é um acesso pessoal; Equipe e Empresa recebem o perfil gestor e podem criar logins próprios para atendentes até o limite do plano. Atendentes e contas Individuais não veem as áreas de empresa e gestão. Para aplicar a migração em um ambiente D1 existente, rode `wrangler d1 migrations apply DB --remote` depois de publicar o arquivo SQL.

Os planos e a preparação da cobrança estão descritos em [`docs/PLANOS_E_COBRANCA.md`](./docs/PLANOS_E_COBRANCA.md). A apresentação de recursos e valores fica na rota `/planos`. A escolha do plano e as permissões estão implementadas; checkout e cobrança recorrente ainda dependem da integração com um provedor e seus webhooks.

## GitHub e Vercel
O código está organizado como um repositório Git comum, com lockfile preservado e um workflow de verificação em `.github/workflows/ci.yml`. Para publicar uma cópia no GitHub, crie um repositório vazio e execute o arquivo [`publicar-github.bat`](./publicar-github.bat). Ele solicita a URL do repositório, configura o remoto `origin`, cria um commit com as alterações e envia a branch escolhida. O script não usa `force push` e não grava tokens de acesso.

Se preferir executar manualmente, use `git remote add origin <URL>` e `git push -u origin main`. O repositório do GitHub deve estar vazio para evitar conflitos no primeiro envio; a autenticação é feita pelo Git Credential Manager, pelo SSH ou pelo método configurado na sua máquina.

O runtime atual usa Cloudflare Workers + D1 (`cloudflare:workers` e binding `DB`), que é o destino usado pelo Site publicado. A estrutura está documentada para migração futura ao Vercel, mas o backend não deve ser enviado ao Vercel sem trocar o binding D1 por um banco HTTP compatível, como Supabase/Postgres, e ajustar os handlers de autenticação. Essa separação evita publicar uma build que pareça funcionar, mas não consiga persistir sessões.

## Escopo atual
O painel agrega até 500 análises e práticas recentes para as contas gestoras da organização, e mantém o histórico pessoal para atendentes e planos Individuais. Os relatórios usam registros da aplicação; não há integração direta com WhatsApp ou sistemas de vendas. O acesso privado é controlado pelo hosting. Dados comerciais e mensagens não são armazenados no cache offline.

## Desenvolvimento
Preservar pnpm e o lockfile. `pnpm exec tsc --noEmit` valida tipos. A compilação usa o script Sites `build-site.mjs`. Esquema em `db/schema.ts`; migrações Drizzle em `drizzle/`. Todas as consultas operacionais usam parâmetros e escopo de usuário.

## Verificação realizada
Compilação de produção, TypeScript, sintaxe do service worker, esquema SQLite, validação das faixas de conteúdo e casos funcionais do modo guiado. Não houve teste visual em navegador nem teste da API OpenAI com credencial real.
