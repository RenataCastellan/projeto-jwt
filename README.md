# Acadêmicos:
Rafael Angelo Darold
Renata Lima Lopes Castellan

# 🔐 Autenticação JWT – Node.js + Express + React

Este projeto demonstra uma implementação simples e funcional de **autenticação JWT** utilizando:

- **Backend:** Node.js + Express + JWT  
- **Frontend:** React + Vite  
- **Armazenamento de sessão:** sessionStorage  
- **Proteção de rota:** Authorization Bearer Token  

O objetivo é demonstrar o funcionamento completo de login com geração de token no backend e consumo desse token no frontend para acessar rotas protegidas.

---

## 🚀 Funcionalidades

### ✔ Backend (Node/Express)
- Rota `POST /login` que valida usuário e senha
- Geração de **JWT** com tempo de expiração
- Middleware para validar tokens
- Rota protegida `GET /private`
- CORS configurado
- Variáveis de ambiente com `.env`

### ✔ Frontend (React)
- Formulário de login
- Armazena o token no `sessionStorage`
- Botão para acessar `/private` enviando **Authorization: Bearer <token>**
- Exibição da resposta da rota protegida
- Tratamento de erros e loading

---
# COMANDOS PARA RODAR O PROJETO


Backend (`/server`)
- cd server
- npm install
- npm run dev

FrontEnd (`/client`)
- cd client
- npm install
- npm run dev
