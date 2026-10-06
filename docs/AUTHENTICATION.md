# Autenticação do AEED

## Fluxo

1. O usuário cria uma conta individual em `/api/auth` com nome, e-mail e senha.
2. O plano Individual cria um perfil `attendant`; Equipe e Empresa criam um `manager`. Gestores criam atendentes da própria empresa até o limite do plano.
3. O login troca o hash do token atual de forma atômica, invalida todas as sessões anteriores e grava um novo token somente em hash.
4. O cookie `aeed_session` é enviado apenas por HTTPS, não pode ser lido por JavaScript e expira em 30 dias.
5. O navegador consulta `/api/workspace` a cada 20 segundos. Se outro dispositivo fizer login, a sessão antiga recebe `401`, mostra a mensagem de encerramento e retorna à tela de login.

## Permissões

- `attendant`: assistente, treinamento, biblioteca e histórico pessoal. Sem alteração das configurações da empresa ou gestão de equipe.
- `manager`: todas as áreas do atendente e a visão de gestão; `/api/team` lista somente membros da mesma empresa.
- `admin`: acessa a visão de gestão e a própria equipe, com uma organização administrativa isolada. Não recebe acesso aos dados de outras empresas.

As permissões são aplicadas no servidor e também refletidas na navegação. Esconder um item de menu não substitui a validação de API.

## Operação

O login especial `admin` é provisionado no primeiro acesso e usa a mesma tabela de usuários e o mesmo mecanismo de sessão única. A senha vem do segredo `ADMIN_PASSWORD` da Vercel; para desenvolvimento, use variáveis locais ignoradas pelo Git. Para trocar a senha, atualize o segredo e publique novamente. O registro administrativo usa a organização isolada `aeed_admin`; as rotas existentes continuam limitadas à organização e não dão acesso aos dados das empresas clientes.

Depois de criar as tabelas PostgreSQL com `pnpm db:migrate`, publique a aplicação. Crie uma conta separada para cada atendente; compartilhar a senha faz o novo login encerrar a sessão anterior. Para revogar sessões, marque-as como inativas no PostgreSQL. A sessão expira no servidor após 30 dias, mesmo que alguém preserve o cookie.
