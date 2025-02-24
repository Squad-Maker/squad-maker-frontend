# SquadMaker

Este projeto faz parte da disciplina de Fábrica de Software da UTFPR-DV. O **SquadMaker** é uma ferramenta desenvolvida para facilitar a criação e organização de times, visando a realização de atividades da disciplina. A aplicação utiliza uma interface moderna e intuitiva para simplificar a interação dos usuários.

## Configurando ambiente de desenvolvimento
- Realizar fork do repositório.
- Clonar o repositório:
    - `git clone https://github.com/SeuUsuarioDoGit/squad-maker-frontend`
- Rodar o seguinte comando para adicionar a upstream:
    - `git remote add upstream https://github.com/Squad-Maker/squad-maker-frontend`
- Bloquear push para upstream:
    - `git remote set-url --push upstream NO_PUSH`
- Atualizar repositório:
    - `git pull upstream main`
- Para enviar as alterações (Sempre deve ser enviado para sua origin):
    - `git push origin`
- Sempre que for implementar uma nova funcionalidade no projeto, deve ser criado uma nova branch:
    - `git checkout -b type-nome-da-branch`

## Configuração do ESLint e Tailwind CSS
 - Instale as extensões:
    - Tailwind CSS IntelliSense
    - PostCSS Language Support

## Utilização do shadcn/ui
Estamos utilizando o <a href="https://ui.shadcn.com/docs/components" target="_blank">shadcn/ui</a> para a construção de componentes da interface do usuário.

## Building project
WIP