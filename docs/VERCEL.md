# Publicação na Vercel

O projeto `aeed-app`, na equipe `will-search`, usa Next.js e PostgreSQL Neon.
O banco `aeed-database` foi criado no plano gratuito, na região iad1.
Não é necessário contratar a Hostinger para esta publicação.

## Alterações

- Comandos padrão `next dev`, `next build` e `next start`.
- Segredos lidos do ambiente do servidor, sem dependência de Workers.
- Adaptador PostgreSQL com consultas parametrizadas e transações para troca de sessão.
- Senhas PBKDF2, cookie HttpOnly/Secure, validade máxima de 30 dias no servidor.
- Cada novo login substitui a sessão anterior; o cliente consulta o estado a cada 20 segundos.
- Atendentes não podem alterar a configuração da empresa nem acessar gestão de equipe.
- Os arquivos antigos de D1/Drizzle são histórico da versão Cloudflare, não o banco desta publicação.

## Variáveis

`DATABASE_URL` é fornecida pela integração Neon. `ADMIN_PASSWORD` habilita o identificador `admin`.
Não guardar credenciais no Git. Para trocar a senha administrativa, atualizar o segredo na Vercel
e publicar novamente. A conta administrativa fica em uma organização própria; não oferece
acesso global aos dados das empresas clientes.

`AEED_AI_ENABLED=true` e uma `OPENAI_API_KEY` válida habilitam a análise por IA. `OPENAI_MODEL` é opcional. Por padrão, o sistema usa apenas o modo guiado, mesmo com a chave salva, e não chama a OpenAI. Para reativar a IA após habilitar os créditos da API, configure `AEED_AI_ENABLED=true` na Vercel e publique uma nova versão. Remova essa variável ou defina `false` para voltar ao modo guiado.

## Banco e verificação

Executar `pnpm db:migrate` com `DATABASE_URL` configurada antes da primeira publicação.
A migração `migrations/postgres/001_initial.sql` é transacional e pode ser repetida.
Ela cria um banco vazio: não importa automaticamente cadastros ou histórico do antigo Site.

`scripts/smoke-vercel.mjs` verifica cadastro, perfis, acesso negado, login sequencial e concorrente,
cookies, histórico e logout contra `TEST_BASE_URL`. Exige `DATABASE_URL` para remover somente
as contas temporárias criadas pelo próprio teste, com identificadores aleatórios.

Build: `pnpm build`. Iniciar: `pnpm start`.

## Limites da entrega

Os planos exibem R$ 69,90, R$ 249,90 e R$ 597,90 por mês, sem implantação.
A escolha do plano libera os recursos em modo de demonstração. Não há checkout, recebimento
ou confirmação de pagamento. Não apresentar o cadastro como uma assinatura paga.
Integração de pagamento e uma chave de IA válida são configurações separadas.

## Transferência futura

Para a Hostinger, usar uma hospedagem Node.js e manter um PostgreSQL acessível, ou migrar
o banco para MySQL e adaptar a camada de consultas. Fazer backup e importar os dados antes
de alterar o DNS de `assistenteaeed.com.br`. Esta publicação não altera o domínio da Hostinger.
