# Autenticação do AEED

## Fluxo

1. O usuário cria uma conta individual em `/api/auth` com nome, e-mail e senha.
2. O primeiro cadastro da base recebe o perfil `manager`; os próximos escolhem `attendant` ou `manager`.
3. O login invalida todas as sessões ativas do usuário e grava um novo token somente em hash.
4. O cookie `aeed_session` é enviado apenas por HTTPS, não pode ser lido por JavaScript e expira em 30 dias.
5. O navegador consulta `/api/workspace` a cada 20 segundos. Se outro dispositivo fizer login, a sessão antiga recebe `401`, mostra a mensagem de encerramento e retorna à tela de login.

## Permissões

- `attendant`: assistente, treinamento, biblioteca, histórico e cadastro comercial próprio.
- `manager`: todas as áreas do atendente e a visão de gestão; `/api/team` lista somente membros da mesma empresa.
- `admin`: reservado para integrações administrativas futuras.

As permissões são aplicadas no servidor e também refletidas na navegação. Esconder um item de menu não substitui a validação de API.

## Operação

Depois de criar as tabelas, publique a aplicação e faça um cadastro de gestor. Crie uma conta separada para cada atendente; compartilhar a senha faz o novo login encerrar a sessão anterior. Para revogar o acesso de uma conta, marque suas sessões como inativas no D1 ou altere a conta antes de emitir um novo acesso.
