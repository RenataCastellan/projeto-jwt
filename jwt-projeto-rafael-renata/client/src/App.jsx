// client/src/App.jsx
import React, { useState } from 'react';

const API_BASE_URL = 'http://localhost:3001';

function App() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');

  const [token, setToken] = useState(() => sessionStorage.getItem('token') || '');

  const [loginStatus, setLoginStatus] = useState(null);
  const [loadingLogin, setLoadingLogin] = useState(false);

  const [privateResponse, setPrivateResponse] = useState(null);
  const [loadingPrivate, setLoadingPrivate] = useState(false);

  const [error, setError] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoadingLogin(true);
    setError(null);
    setLoginStatus(null);
    setPrivateResponse(null);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const msg = data.error || `Falha no login (status ${response.status}).`;
        throw new Error(msg);
      }

      const data = await response.json();
      if (!data.token) {
        throw new Error('Resposta do servidor não contém { token }.');
      }

      sessionStorage.setItem('token', data.token);
      setToken(data.token);
      setLoginStatus('success');
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoginStatus('error');
      sessionStorage.removeItem('token');
      setToken('');
    } finally {
      setLoadingLogin(false);
    }
  };

  const handleCallPrivate = async () => {
    setLoadingPrivate(true);
    setError(null);
    setPrivateResponse(null);

    const storedToken = sessionStorage.getItem('token');

    if (!storedToken) {
      setError('Nenhum token encontrado. Faça login primeiro.');
      setLoadingPrivate(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/private`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${storedToken}`
        }
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const msg = data.error || `Erro ao acessar /private (status ${response.status}).`;
        throw new Error(msg);
      }

      const data = await response.json();
      setPrivateResponse(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoadingPrivate(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setToken('');
    setPrivateResponse(null);
    setLoginStatus(null);
    setError(null);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '2rem',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        backgroundColor: '#121212',
        color: '#f1f1f1'
      }}
    >
      <h1>Demo JWT – Login + Rota Protegida</h1>

      <p style={{ maxWidth: 600, marginBottom: '1.5rem' }}>
        Esta aplicação faz login em um backend Node/Express que emite um JWT
        (rota <code>/login</code>) e depois usa esse token para acessar a rota
        protegida <code>/private</code> com o header{' '}
        <code>Authorization: Bearer {'<token>'}</code>.
      </p>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Login</h2>
        <form
          onSubmit={handleLogin}
          style={{
            maxWidth: 340,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            padding: '1rem',
            borderRadius: 8,
            background: '#1e1e1e'
          }}
        >
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            Usuário
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              style={{
                padding: '0.5rem',
                borderRadius: 4,
                border: '1px solid #555',
                background: '#181818',
                color: '#f1f1f1'
              }}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            Senha
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              style={{
                padding: '0.5rem',
                borderRadius: 4,
                border: '1px solid #555',
                background: '#181818',
                color: '#f1f1f1'
              }}
            />
          </label>

          <button
            type="submit"
            disabled={loadingLogin}
            style={{
              padding: '0.6rem 1rem',
              borderRadius: 4,
              border: 'none',
              cursor: loadingLogin ? 'default' : 'pointer',
              background: loadingLogin ? '#555' : '#4CAF50',
              color: '#fff',
              fontWeight: 600
            }}
          >
            {loadingLogin ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div style={{ marginTop: '1rem' }}>
          {loginStatus === 'success' && (
            <p style={{ color: '#4CAF50' }}>
              Login bem-sucedido! Token armazenado em <code>sessionStorage</code>.
            </p>
          )}
          {loginStatus === 'error' && (
            <p style={{ color: '#ff6b6b' }}>
              Falha no login. Verifique usuário/senha ou o backend.
            </p>
          )}

          {token && (
            <details style={{ marginTop: '1rem' }}>
              <summary style={{ cursor: 'pointer' }}>Ver token JWT</summary>
              <code
                style={{
                  display: 'block',
                  marginTop: '0.5rem',
                  padding: '0.5rem',
                  background: '#1e1e1e',
                  borderRadius: 4,
                  wordBreak: 'break-all'
                }}
              >
                {token}
              </code>
            </details>
          )}

          {token && (
            <button
              onClick={handleLogout}
              style={{
                marginTop: '0.75rem',
                padding: '0.4rem 0.9rem',
                borderRadius: 4,
                border: 'none',
                background: '#e53935',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Logout
            </button>
          )}
        </div>
      </section>

      <section>
        <h2>Rota Protegida /private</h2>
        <p style={{ maxWidth: 600, marginBottom: '0.75rem' }}>
          Ao clicar no botão abaixo, o front recupera o token do{' '}
          <code>sessionStorage</code> e faz um <code>GET /private</code> com o
          header <code>Authorization: Bearer {'<token>'}</code>.
        </p>

        <button
          onClick={handleCallPrivate}
          disabled={loadingPrivate}
          style={{
            padding: '0.6rem 1rem',
            borderRadius: 4,
            border: 'none',
            cursor: loadingPrivate ? 'default' : 'pointer',
            background: loadingPrivate ? '#555' : '#2196F3',
            color: '#fff',
            fontWeight: 600
          }}
        >
          {loadingPrivate ? 'Chamando /private...' : 'Acessar /private'}
        </button>

        {loadingPrivate && (
          <p style={{ marginTop: '0.75rem' }}>Carregando...</p>
        )}

        {error && (
          <p style={{ marginTop: '0.75rem', color: '#ff6b6b' }}>
            Erro: {error}
          </p>
        )}

        {privateResponse && (
          <pre
            style={{
              marginTop: '1rem',
              padding: '1rem',
              borderRadius: 8,
              background: '#1e1e1e',
              maxWidth: '100%',
              overflowX: 'auto'
            }}
          >
            {JSON.stringify(privateResponse, null, 2)}
          </pre>
        )}
      </section>
    </div>
  );
}

export default App;
