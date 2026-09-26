# Publicar no GitHub

1. No GitHub, crie um repositório vazio para o AEED. Não marque as opções de README, `.gitignore` ou licença no primeiro envio.
2. Execute `publicar-github.bat` na pasta do projeto, com duplo clique ou pelo Prompt de Comando.
3. Cole a URL HTTPS (por exemplo, `https://github.com/seu-usuario/aeed.git`) ou a URL SSH do repositório.
4. Confirme a branch `main` e informe uma mensagem de commit quando solicitado.
5. Conclua a autenticação quando o Git pedir. O script não armazena senha nem token.

O script configura o remoto `origin`, adiciona os arquivos, cria um commit quando necessário e executa o envio para o GitHub. Se já existir um `origin`, ele pede confirmação antes de substituí-lo. Em caso de falha, verifique a URL, as credenciais e se o repositório remoto está vazio; nenhum `force push` é executado.
