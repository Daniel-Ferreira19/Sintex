Markdown
# 🚀 Sintex - Painel de Controle e Plataforma de Restaurantes

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007acc.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)

O **Sintex** é uma plataforma moderna desenvolvida para conectar clientes e donos de restaurantes. O sistema oferece duas visões principais controladas dinamicamente:
- **Módulo do Cliente (`ClientView`):** Onde os usuários buscam restaurantes e deixam suas notas/avaliações.
- **Módulo do Dono (`OwnerView`):** Um painel estratégico onde o empresário acompanha os gráficos de avaliação da empresa e gerencia o link público do seu negócio.



## 💻 1. Configuração do Ambiente do Zero (Onboarding)

Se você acabou de entrar para o time ou está configurando o projeto em um computador novo, siga estes passos:

### Passo 1: Instalar o Node.js
Você precisa do Node.js para gerenciar os pacotes do projeto.
- Baixe e instale a versão **LTS** no site oficial: [nodejs.org](https://nodejs.org/)

### Passo 2: Clonar o Repositório
Abra o seu terminal (Prompt de Comando, PowerShell ou Terminal do VS Code) e clone o projeto:
```bash
git clone (https://github.com/Daniel-Ferreira19/Sintex.git)
```
### Passo 3: Entrar na Pasta e Instalar as Dependências
Como a pasta node_modules não é enviada para o GitHub por ser muito pesada, você deve rodar o comando abaixo para o npm baixar o React, Tailwind e todas as ferramentas do projeto automaticamente:
```Bash
cd Sintex
npm install
```
## 🛠️ 2. Instalação e Configuração do React Router Dom
Para fazermos o sistema mudar de página no futuro (como criar caminhos para /login, /dashboard ou o link exclusivo do restaurante), utilizaremos o React Router Dom.

Como instalar (Caso ainda não esteja no projeto):
Se o projeto precisar do roteador e ele ainda não estiver listado no arquivo package.json, um dos desenvolvedores deve rodar o comando abaixo na raiz do projeto:

```Bash
npm install react-router-dom
```

⚠️ Nota Importante para o Time: Se um colega já instalou o React Router e enviou o código para o GitHub, você não precisa rodar o comando acima. Basta dar um git pull para atualizar seu código e rodar npm install para que o seu PC baixe a nova biblioteca adicionada pelo amigo.

## 🏃‍♂️ 3. Como Rodar o Projeto Localmente
Para iniciar o servidor de desenvolvimento com atualização em tempo real no navegador:

```Bash
npm run dev
```
Abra o navegador no endereço indicado no seu terminal (geralmente http://localhost:5173).

## 👥 4. Guia de Sobrevivência do Git (Como Trabalhar em Equipe)
Para garantir que ninguém apague o código do outro e evitar conflitos gerados por duas pessoas mexendo no mesmo arquivo, todos devem seguir este fluxo diariamente.

### 🌅 A: Começando o Dia (Atualizar seu PC)
Antes de digitar qualquer linha de código, puxe o que seus colegas já terminaram e enviaram para a nuvem:

```Bash
# Volte para a ramificação principal
git checkout main

# Baixe as novidades do GitHub
git stash
git pull origin main
```

Depois Pra enviar as atulizaões do VsCode direto pro repositorio basta dar um:
```Bash
git push origin main
```
## 🔨 B: Criando uma Filial (Branch) para a sua Tarefa
NUNCA faça alterações direto na branch main. Sempre crie uma branch separada para trabalhar na sua bancada:

```Bash
git checkout -b feature/nome-da-sua-tarefa

# Exemplos de bons nomes:
# git checkout -b feature/tela-dono
# git checkout -b feature/configuracao-router
# git checkout -b bugfix/correcao-erro-tipagem
💡 Quer saber em qual branch você está agora? Digite: git branch
```
### 💾 C: Salvando o Progresso Localmente (O Combo Diário)
Modificou os componentes e testou no navegador? Hora de salvar o progresso no seu Git local:

```Bash
# 1. Veja quais arquivos você alterou (eles aparecem em vermelho)
git status

# 2. Adicione todos os arquivos modificados para o salvamento
git add .

# 3. Oficialize o ponto de salvamento com uma mensagem curta do que foi feito
git commit -m "Desenvolvido o componente de notas e avaliações"
```

### ☁️ D: Enviando para o GitHub
Para mandar o seu trabalho local para as nuvens do GitHub:

```Bash
git push origin feature/nome-da-sua-tarefa
```
### 🤝 E: Juntando os Códigos (Pull Request)
Vá até a página do nosso projeto: GitHub - Sintex.

Clique no botão amarelo "Compare & pull request" que vai aparecer no topo.

Deixe uma breve descrição do que você fez e crie o pedido.

O administrador (Daniel) vai analisar se está tudo certo e clicar em "Merge pull request" para unir seu código com o projeto oficial (main).

### 🚨 5. Caixa de Emergência (Deu Ruim!)
Se você começou a alterar códigos, tudo quebrou e você quer apagar o que fez para voltar exatamente ao estado do seu último salvamento bem-sucedido:

```Bash
# Para resetar um arquivo específico:
git restore src/components/NomeDoArquivo.tsx

# Para resetar TODOS os arquivos modificados da pasta de uma vez só:
git checkout -- .
```
