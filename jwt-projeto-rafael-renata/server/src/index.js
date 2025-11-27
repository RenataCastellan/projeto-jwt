// server/src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-alterar-em-producao';

// Usuário de teste "hardcoded" para a atividade
const TEST_USER = {
  id: 1,
  username: 'admin',
  password: '123456',
  name: 'Admin da Turma',
  role: 'aluno'
};

// Middlewares globais
app.use(
  cors({
    origin: 'http://localhost:5173', // origem do Vite
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());

// ----------------------
// POST /login - gera JWT
// ----------------------
app.post('/login', (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: 'username e password são obrigatórios.' });
    }

    // Validação simples contra o usuário de teste
    if (username !== TEST_USER.username || password !== TEST_USER.password) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    // Payload mínimo: nada de dado sensível
    const payload = {
      sub: TEST_USER.id,
      name: TEST_USER.name,
      username: TEST_USER.username,
      role: TEST_USER.role
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '1h'
    });

    return res.json({ token });
  } catch (err) {
    console.error('Erro em /login:', err);
    return res.status(500).json({ error: 'Erro interno no login.' });
  }
});

// ------------------------------------
// Middleware para validar o JWT (Bearer)
// ------------------------------------
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res
      .status(401)
      .json({ error: 'Header Authorization ausente.' });
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res
      .status(401)
      .json({ error: 'Formato do header Authorization inválido.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Falha ao verificar token:', err);
      return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }

    // Anexa dados do token na requisição para uso nas rotas
    req.user = decoded;
    next();
  });
}

// -----------------------------
// GET /private - rota protegida
// -----------------------------
app.get('/private', authMiddleware, (req, res) => {
  return res.json({
    message: 'Acesso permitido à rota privada!',
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

// Rota simples de saúde
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'API JWT no ar.' });
});

// Tratamento de erro genérico
app.use((err, req, res, _next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

// Sobe o servidor
app.listen(PORT, () => {
  console.log(`✅ Server rodando em http://localhost:${PORT}`);
  console.log('   Credenciais teste: username="admin", password="123456"');
});
