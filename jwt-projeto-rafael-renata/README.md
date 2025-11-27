# Demo JWT – Node/Express + React

Atividade de Programação Web: autenticação via JWT.

## Estrutura

- `server/`: API Node/Express com JWT
  - `POST /login`: gera `{ token }` para credenciais válidas
  - `GET /private`: rota protegida que requer `Authorization: Bearer <token>`
- `client/`: app React (Vite)
  - Formulário de login
  - Guarda token em `sessionStorage`
  - Chama `/private` com o header `Authorization: Bearer <token>`
  - Feedback de loading, erro e sucesso

## Como rodar

1. Instale o Node.js (versão 18+ recomendada).
2. No diretório `server/`, rode `npm install` e depois `npm run dev`.
3. No diretório `client/`, rode `npm install` e depois `npm run dev`.
4. Acesse `http://localhost:5173` no navegador.
