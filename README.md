# AEED na Prática

Aplicação PWA privada para apoiar atendentes e gestores, baseada nas apostilas fornecidas de Camila Cesar Llourente / CL Solutions.

## Funcionalidades
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

## Escopo atual
Um espaço privado por usuário autenticado na plataforma. O painel não gerencia convites de equipes, cobrança de planos ou contas externas. Não há integração direta com WhatsApp ou dados de vendas. O acesso privado é controlado pelo hosting. Dados comerciais e mensagens não são armazenados no cache offline.

## Desenvolvimento
Preservar pnpm e o lockfile. `pnpm exec tsc --noEmit` valida tipos. A compilação usa o script Sites `build-site.mjs`. Esquema em `db/schema.ts`; migrações Drizzle em `drizzle/`. Todas as consultas operacionais usam parâmetros e escopo de usuário.

## Verificação realizada
Compilação de produção, TypeScript, sintaxe do service worker, esquema SQLite, validação das faixas de conteúdo e casos funcionais do modo guiado. Não houve teste visual em navegador nem teste da API OpenAI com credencial real.
