@echo off
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"

echo.
echo === Publicar o AEED no GitHub ===
echo.

where git >nul 2>&1
if errorlevel 1 (
    echo Git nao foi encontrado no PATH.
    echo Instale o Git for Windows e execute este arquivo novamente.
    goto :fail
)

set "REPO_URL="
set /p "REPO_URL=URL do repositorio GitHub (HTTPS ou SSH): "
if "%REPO_URL%"=="" (
    echo A URL do repositorio e obrigatoria.
    goto :fail
)

set "BRANCH=main"
set /p "BRANCH=Nome da branch [main]: "
if not defined BRANCH set "BRANCH=main"

git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
    echo Inicializando o repositorio Git local...
    git init
    if errorlevel 1 goto :fail
)

git branch -M "%BRANCH%"
if errorlevel 1 goto :fail

set "CURRENT_REMOTE="
for /f "delims=" %%R in ('git remote get-url origin 2^>nul') do set "CURRENT_REMOTE=%%R"

if defined CURRENT_REMOTE (
    echo.
    echo O remoto origin atual e: !CURRENT_REMOTE!
    choice /C SN /N /M "Substituir origin pela URL informada? [S/N]: "
    if errorlevel 2 (
        echo Operacao cancelada. Nenhum arquivo foi enviado.
        goto :done
    )
    git remote set-url origin "%REPO_URL%"
) else (
    git remote add origin "%REPO_URL%"
)
if errorlevel 1 goto :fail

echo.
echo Preparando os arquivos...
git add -A
if errorlevel 1 goto :fail

git diff --cached --quiet
if errorlevel 1 (
    set "COMMIT_MESSAGE=Publicar AEED no GitHub"
    set /p "COMMIT_MESSAGE=Mensagem do commit [Publicar AEED no GitHub]: "
    if not defined COMMIT_MESSAGE set "COMMIT_MESSAGE=Publicar AEED no GitHub"

    rem Usa um autor local apenas se o Git ainda nao tiver identidade configurada.
    set "GIT_NAME="
    set "GIT_EMAIL="
    for /f "delims=" %%N in ('git config user.name 2^>nul') do set "GIT_NAME=%%N"
    for /f "delims=" %%E in ('git config user.email 2^>nul') do set "GIT_EMAIL=%%E"
    if not defined GIT_NAME set "GIT_NAME=AEED"
    if not defined GIT_EMAIL set "GIT_EMAIL=aeed@users.noreply.github.com"

    git -c user.name="!GIT_NAME!" -c user.email="!GIT_EMAIL!" commit -m "!COMMIT_MESSAGE!"
    if errorlevel 1 goto :fail
) else (
    echo Nenhuma alteracao nova para criar commit.
)

echo.
echo Enviando para o GitHub...
git push --set-upstream origin "%BRANCH%"
if errorlevel 1 (
    echo.
    echo O envio falhou. Confira a URL, sua autenticacao do GitHub e se o repositorio remoto esta vazio.
    echo Este script nunca usa force push para preservar o historico remoto.
    goto :fail
)

echo.
echo Publicacao concluida com sucesso.
goto :done

:fail
echo.
echo A publicacao nao foi concluida.
pause
exit /b 1

:done
echo.
pause
exit /b 0
